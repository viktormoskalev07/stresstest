import {pingMaxTimeError, showLogs} from "../index.js";

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export const delayedFunctionCall = async (func, delayTime = 50 , name) => {
	const startTime = Date.now()
	await delay(delayTime)
	await func()
	const endTime = Date.now();
	const elapsedTime = endTime - startTime;
	process.send({ type: 'requestsTime', duration: elapsedTime ,requestType:name||"delayedFunctionCall" });
	if(elapsedTime>pingMaxTimeError){
		console.warn(`Request Time: ${elapsedTime}s `+name||"delayedFunctionCall");
	} else {
		showLogs&&console.log(`Request Time: ${elapsedTime}s`);
	}
	process.send('incrementAction');

	return true
}


