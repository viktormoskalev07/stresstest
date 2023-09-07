


import fs from 'fs/promises';
export const createReport = ({requestsCounter , errorsCounter,warningsCounter})=>{




// Преобразование массива в строку JSON
    const jsonString = JSON.stringify(requestsCounter, null, 2);
    const jsonErrors = JSON.stringify(errorsCounter, null, 2);
    const jsonWarning = JSON.stringify(warningsCounter, null, 2);

// Запись JSON строки в файл
    fs.writeFile('./chart/requestsCounter.json', jsonString, (err) => {
        if (err) {
            console.log('Ошибка при записи файла', err);
        } else {
            console.log('Файл успешно сохранен');
        }
    });
    fs.writeFile('./chart/errors.json', jsonErrors, (err) => {
        if (err) {
            console.log('Ошибка при записи файла', err);
        } else {
            console.log('Файл успешно сохранен');
        }
    });
    fs.writeFile('./chart/warning.json', jsonWarning, (err) => {
        if (err) {
            console.log('Ошибка при записи файла', err);
        } else {
            console.log('Файл успешно сохранен');
        }
    });
}

