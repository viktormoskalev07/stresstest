import cluster from 'node:cluster';

import {app, showLogs} from "./index.js";

let usersCounter = 0;
let requestsCounter = 0;
const testStartTime = new Date();
if (cluster.isMaster) {
    showLogs&&  console.log(`Master ${process.pid} is running`);
    !showLogs&& console.error("mode only errors")
    let workerCount =2;

    for (let i = 0; i < workerCount; i++) {
        setTimeout(() => {
            const worker = cluster.fork();
            showLogs&&   console.log(i , "from" ,workerCount )

            worker.on('message', (message) => {
                if (message === 'incrementCluster') {
                    usersCounter++;
                    console.log(`Number of clusters: ${usersCounter}`);
                }
                if (message === 'incrementAction') {
                    requestsCounter++;

                    const testTime = (new Date()- testStartTime  )/1000
                    console.log(`Online users =${usersCounter}  actions=${requestsCounter}  , duration = ${testTime}s  rps = ${testTime/requestsCounter}`);

                }
                if (message === 'decrementUsers') {
                    requestsCounter++;
                    console.log(`Number of actions: ${requestsCounter}`);
                }
            });
        }, i * 22);
    }

    cluster.on('exit', (worker, code, signal) => {
        showLogs&&    console.log(`Worker ${worker.process.pid} died`);

        // cluster.fork();
        const testEndTime = new Date();
        const testDuration =(testEndTime- testStartTime ) / 1000
        console.log({testDuration  ,usersCounter  , requestsCounter})

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