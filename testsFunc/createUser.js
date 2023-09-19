import axios from "axios"
import WebSocket from 'ws'
import {connectSocket, pingMaxTimeError, showLogs} from "../index.js";
import {delayedFunctionCall} from "../helpers/delayFunc.js";
import {unsubscribeEmail} from "./unsubscribe.js";

const link_code = "stesstest"
const referral_user=2
export const createUser = async (instanceUser, baseUrl) => {
	let num = Math.floor(Math.random() * 100000) + 1
	const random = num.toString(16)
	const email = "ttestUser" + random + new Date().getTime()+ "lul@kek.mek"

	let tokenData
	const startTime = Date.now()
	await delayedFunctionCall(async () => await axios .get('https://api.duelmasters.io/api/v0/referral-links/stesstest/check/') ,1 , "user/info")

	try {
		tokenData = await axios.post(baseUrl + "/api/v0/auth/base/signup/", {
			email,
			password: "2222",
			password_repeat: "2222",
			accept: true,
			referral_user,
			link_code
		});
		const endTime = Date.now();
		const elapsedTime = endTime - startTime;
		process.send({ type: 'requestsTime', duration: elapsedTime ,requestType:"register" });
		if(elapsedTime>pingMaxTimeError){
			console.warn(`Request Time: ${elapsedTime/1000}s createUser`);
		} else {
			showLogs&&console.log(`Request Time: ${elapsedTime/1000}s`);
		}
		if(!tokenData.data?.token){
			console.error("NO TOKEN ")
		}
		showLogs&&	console.log(tokenData.data?.token)
		process.send('incrementAction');
		process.send('incrementCluster')
	} catch (e){
		console.error(e ,  "sign")
		return
	}

	// connect webSocket
	const wsUrl = baseUrl.replace('http', 'ws');
	let webSocket={}
if(connectSocket){
	  webSocket = new WebSocket(`${wsUrl}/ws?token=${tokenData.data?.token}`)
	process.send('incrementAction');
	webSocket.onopen = () => {
		showLogs&&	console.log('socket connected')
	}

	webSocket.onmessage = (message) => {
		const data = JSON.parse(message.data);
		showLogs&&	console.log('web socket --- ', data.action)
	};

	webSocket.onerror = (error) => {
		console.error('web socket error: ', error?.detail)
		webSocket?.close();
	}

	webSocket.onclose= ()=>{
		setTimeout(()=>{
			webSocket	=new WebSocket(`${wsUrl}/ws?token=${tokenData.data.token}`)
		},1000)
	}
}

	instanceUser.interceptors.request.use((config) => {
		if (tokenData.data?.token) {
			config.headers.Authorization ="Token "+ tokenData.data?.token;
		} else {
			console.error("NO TOKEN" );
		}
		return config;
	});
	await delayedFunctionCall(async () => await instanceUser.get('/user/info') ,1 , "user/info")
	let userInfo

	try {
		const response = await instanceUser.get('/user/info')
		process.send('incrementAction');
		userInfo = response.data
	} catch (e) {
		console.error(e.message ,e?.response?.data, "userinfo")
		return {
			error:true
		}
	}


	return {
		userId: userInfo.id,
		webSocket: webSocket,
		token: tokenData.data.token,
	}
}
