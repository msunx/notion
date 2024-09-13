let kada_data;
let title;

render();

async function render() {
    const urlParams = new URLSearchParams(window.location.search);
    title = urlParams.get('title');
    document.getElementById('page-title').textContent = title;
    kada_data = await get_daka_data();
    render_daka_count()

    let firstDay = getFirstDayOfYear()
    const lastDayOfYear = getLastDayOfYear()
    while (firstDay <= lastDayOfYear) {
        firstDay = renderOneWeek(firstDay, lastDayOfYear)
    }
}

function renderOneWeek(startDay, lastDayOfYear) {
    const startWeekDay = getDayOfWeek(startDay)
    let currentDay = startDay
    const container = document.getElementById('container');
    const grid = document.createElement('div');
    grid.classList.add('grid');
    container.appendChild(grid)
    for (let i = 0; i < 7; i++) {
        const gridItem = document.createElement('div');
        const dateStr = formatDate(currentDay)
        gridItem.setAttribute('date', dateStr)
        gridItem.setAttribute('title', dateStr);  // 添加这一行
        gridItem.classList.add('grid-item');
        if (i < startWeekDay - 1) {
            gridItem.classList.add('blank');
        }
        if (startDay >= lastDayOfYear - 7 && i >= lastDayOfYear.getDay()) {
            gridItem.classList.add('blank');
        }
        if (areDatesEqual(currentDay, new Date())) {
            gridItem.classList.add('today');
        }
        if (kada_data.includes(dateStr)) {
            gridItem.classList.add('active');
        }
        gridItem.addEventListener('click', function () {
            const isActivate = gridItem.classList.toggle('active');
            sendPostRequest(dateStr, isActivate);
        });
        grid.appendChild(gridItem);
        currentDay.setDate(currentDay.getDate() + 1);
    }
    return currentDay
}

function getDayOfWeek(date) {
    return date.getDay();
}

function getFirstDayOfYear() {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, 0, 1);
}

function getLastDayOfYear() {
    const currentYear = new Date().getFullYear();
    const firstDayOfNextYear = new Date(currentYear + 1, 0, 1);
    const lastDayOfYear = new Date(firstDayOfNextYear);
    lastDayOfYear.setDate(lastDayOfYear.getDate() - 1);
    return lastDayOfYear;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function areDatesEqual(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

async function get_daka_data() {
    try {
        const response = await fetch('http://127.0.0.1:8728/notion/daka/get?title=' + title);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;  // 重新抛出错误以便调用者可以处理
    }
}

function render_daka_count() {
    document.getElementById('daka-count').textContent = `打卡总天数: ${kada_data.length}`
}

function sendPostRequest(dateStr, isActivate) {
    try {
        const response = fetch('http://127.0.0.1:8728/notion/daka/do', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({
                date: dateStr, title: title, isActivate: isActivate
            }),
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

