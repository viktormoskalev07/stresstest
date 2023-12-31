import cluster from 'node:cluster';

import {app, showLogs} from "./index.js";
import {createReport} from "./chart/index.js";

let usersCounter = 0;
let requestsCounter = [];
let errorsCounter = [];
let warningsCounter = [];
const requestsTime = [];


const testStartTime = new Date();
if (cluster.isMaster) {
    showLogs&&  console.log(`Master ${process.pid} is running`);
    !showLogs&& console.error("mode only errors")
    let workerCount =10;

    for (let i = 0; i < workerCount; i++) {
        setTimeout(() => {
            const worker = cluster.fork();
            showLogs&&   console.log(i , "from" ,workerCount )
            worker.on('message', (message) => {
                if (message === 'incrementCluster') {
                    usersCounter++;
                }
                if (message.type === 'requestsTime') {
                    requestsTime.push({
                        date:new Date(),
                        duration:message.duration,
                        requestType:message.requestType
                    });
                }
                if (message.type === 'errors') {
                    errorsCounter.push({message:message.err , date:new Date()});
                }
                if (message === 'warnings') {
                    warningsCounter.push({date:new Date()});
                }
                if (message === 'incrementAction') {
                    requestsCounter.push({date:new Date()});
                    const now = new Date();
                    const twoSecondsAgo = new Date(now - 2000);
                    const recentRequests = requestsCounter.filter(requestDate => requestDate?.date >= twoSecondsAgo);
                    const numberOfRecentRequests = recentRequests.length;
                    const testTime = (new Date()- testStartTime  )/1000
                    console.log(`Online =${usersCounter}  actions=${requestsCounter.length}  , duration = ${testTime}s  rps = ${numberOfRecentRequests/2}`);
                }
                if (message === 'decrementUsers') {
                    usersCounter--;
                    console.log(`user closed : ${requestsCounter.length}`);
                }
            });
        }, i * 50);
    }

    cluster.on('exit', (worker, code, signal) => {
        showLogs&&    console.log(`Worker ${worker.process.pid} died`);

        console.warn(` finish user , Online users =${usersCounter}  actions=${requestsCounter.length}`)
        createReport({requestsCounter, errorsCounter ,warningsCounter,requestsTime})
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
