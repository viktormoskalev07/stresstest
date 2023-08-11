import cluster from 'node:cluster';

import { app } from "./index.js";

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    let workerCount = 50; // Установите нужное количество рабочих процессов

    for (let i = 0; i < workerCount; i++) {
        setTimeout(() => {
            cluster.fork();
            console.log(i)
        }, i * 2000); // Запуск каждого рабочего процесса с интервалом в 5 секунд
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Это будет создавать новый рабочий процесс, если один умрет
    });
} else {
    console.log(`Worker ${process.pid} started`);
    if(process.pid){
        app(process.pid);
    }

}