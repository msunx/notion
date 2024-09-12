document.addEventListener('DOMContentLoaded', function () {
    const grid = document.getElementById('grid');
    const daysInYear = 365;
    const daysInWeek = 7;
    const weeksInYear = Math.ceil(daysInYear / daysInWeek);

    // Set the grid layout to have 7 rows and enough columns for the year
    grid.style.gridTemplateColumns = `repeat(${weeksInYear}, 13px)`;

    for (let i = 0; i < daysInYear; i++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.addEventListener('click', function () {
            gridItem.classList.toggle('active');
        });
        grid.appendChild(gridItem);
    }
});

