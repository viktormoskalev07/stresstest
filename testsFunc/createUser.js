import axios from "axios"
import WebSocket from 'ws'
import {showLogs} from "../index.js";

export const createUser = async (instanceUser, baseUrl) => {
	let num = Math.floor(Math.random() * 100000) + 1
	const random = num.toString(16)
	const email = "ttestUser" + random + new Date().getTime()+ "lul@kek.mek"

	let tokenData
	const startTime = Date.now()


	try {
		tokenData = await axios.post(baseUrl + "/api/v0/auth/base/signup/", {
			email,
			password: "2222",
			password_repeat: "2222",
			accept: true,
		});
		const endTime = Date.now();
		const elapsedTime = endTime - startTime;

		if(elapsedTime>1000){
			console.error(`Request Time: ${elapsedTime/1000}s createUser`);
		} else {
			showLogs&&console.log(`Request Time: ${elapsedTime/1000}s`);
		}
		if(!tokenData.data?.token){
			console.error("NO TOKEN ")

		}
		showLogs&&	console.log(tokenData.data?.token)
		process.send('incrementAction');
	} catch (e){
		console.log(e.message ,  "sign")
		return
	}

	// connect webSocket
	const wsUrl = baseUrl.replace('http', 'ws');

	let webSocket = new WebSocket(`${wsUrl}/ws?token=${tokenData.data?.token}`)
	process.send('incrementAction');
	webSocket.onopen = () => {
		showLogs&&	console.log('socket connected')
	}

	webSocket.onmessage = (message) => {
		const data = JSON.parse(message.data);
		showLogs&&	console.log('web socket --- ', data.action)
	};

	webSocket.onerror = (error) => {
		console.log('web socket error: ', error?.detail)
		webSocket?.close();
	}

	webSocket.onclose= ()=>{
		setTimeout(()=>{
			webSocket	=new WebSocket(`${wsUrl}/ws?token=${tokenData.data.token}`)
		},1000)
	}
	instanceUser.interceptors.request.use((config) => {
		if (tokenData.data?.token) {
			config.headers.Authorization ="Token "+ tokenData.data?.token;
		} else {
			console.log("NO TOKEN" );
		}
		return config;
	});

	let userInfo

	try {
		const response = await instanceUser.get('/user/info')
		userInfo = response.data
	} catch (e) {
		console.log(e.message)
	}


	return {
		userId: userInfo.id,
		webSocket: webSocket,
		token: tokenData.data.token,
	}
}