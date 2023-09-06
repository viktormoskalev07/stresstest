


import fs from 'fs/promises';
export const createReport = (requestsCounter)=>{




// Преобразование массива в строку JSON
    const jsonString = JSON.stringify(requestsCounter, null, 2); // Второй и третий аргументы для форматирования

// Запись JSON строки в файл
    fs.writeFile('./chart/requestsCounter.json', jsonString, (err) => {
        if (err) {
            console.log('Ошибка при записи файла', err);
        } else {
            console.log('Файл успешно сохранен');
        }
    });
}

