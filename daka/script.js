document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    get_daka_data()

    const title = urlParams.get('title');
    if (title) {
        document.getElementById('page-title').textContent = title;
    }
    let firstDay = getFirstDayOfYear()
    const lastDayOfYear = getLastDayOfYear()
    while (firstDay <= lastDayOfYear) {
        firstDay = renderOneWeek(firstDay, lastDayOfYear)
    }
});

function renderOneWeek(startDay, lastDayOfYear) {
    const startWeekDay = getDayOfWeek(startDay)
    let currentDay = startDay
    const container = document.getElementById('container');
    const grid = document.createElement('div');
    grid.classList.add('grid');
    container.appendChild(grid)
    for (let i = 0; i < 7; i++) {
        const gridItem = document.createElement('div');
        gridItem.setAttribute('date', formatDate(currentDay))
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
        gridItem.addEventListener('click', function () {
            gridItem.classList.toggle('active');
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

function get_daka_data() {
    fetch('http://127.0.0.1:8728/notion/test')
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}