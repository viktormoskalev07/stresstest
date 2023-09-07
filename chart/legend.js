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
