const legendElement = document.getElementById('legend');

// Создание элементов легенды на основе объекта
for (const [label, color] of Object.entries(window.colors)) {
    const item = document.createElement('div');
    item.className = 'legend-item';

    const colorBox = document.createElement('div');
    colorBox.className = 'legend-color';
    colorBox.style.backgroundColor = color;

    const text = document.createTextNode(label);

    item.appendChild(colorBox);
    item.appendChild(text);

    legendElement.appendChild(item);
}

// Инициализация объектов для хранения данных
const maxDurations = {};
const totalDurations = {};
const countPerType = {};


const stat = ()=>{

// Проход по всем записям для вычисления статистики
    shiftedDuration.forEach((entry) => {
        const requestType = entry.requestType;
        const duration = entry.duration;

        // Вычисление максимальной продолжительности
        maxDurations[requestType] = Math.max(maxDurations[requestType] || 0, duration);

        // Вычисление суммарной продолжительности и количества запросов
        totalDurations[requestType] = (totalDurations[requestType] || 0) + duration;
        countPerType[requestType] = (countPerType[requestType] || 0) + 1;
    });

// Вычисление средней продолжительности
    const avgDurations = {};
    for (const [requestType, total] of Object.entries(totalDurations)) {
        avgDurations[requestType] = total / countPerType[requestType];
    }

// Вывод результатов (можно сделать это как угодно, это просто пример)
    const outputElement = document.getElementById('output');
    for (const [requestType, maxDuration] of Object.entries(maxDurations)) {
        const avgDuration = avgDurations[requestType];
        const text = `Тип запроса: ${requestType}, Максимальная продолжительность: ${maxDuration}, Средняя продолжительность: ${avgDuration.toFixed(2)}`;

        const paragraph = document.createElement('p');
        paragraph.textContent = text;

        outputElement.appendChild(paragraph);
    }

}

setTimeout(stat,2 *1000)
