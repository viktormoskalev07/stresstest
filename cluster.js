import cluster from 'node:cluster';

import { app } from "./index.js";

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    let workerCount =200;

    for (let i = 0; i < workerCount; i++) {
        setTimeout(() => {
            cluster.fork();
            console.log(i , "from" ,workerCount )
        }, i * 20);
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Это будет создавать новый рабочий процесс, если один умрет
    });
} else {
    console.log(`Worker ${process.pid} started`);
    if(process.pid){
        // setTimeout(()=>{
        //     app(process.pid + " dublicate");
        // }, 2000)

        app(process.pid);
    }

}