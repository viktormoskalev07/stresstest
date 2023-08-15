import axios from "axios"
import WebSocket from 'ws'

export const createUser = async (instanceUser, baseUrl) => {
	let num = Math.floor(Math.random() * 100000) + 1
	const random = num.toString(16)
	const email = "testUser" + random + "lul@kek.mek"

	let tokenData

	try {
		tokenData = await axios.post(baseUrl + "/api/v0/auth/base/signup/", {
			email,
			password: "2222",
			password_repeat: "2222",
			accept: true,
		});
		console.log(tokenData.data.token)
	} catch (e){
		console.log(e.message ,  "sign")
		return
	}

	// connect webSocket
	const wsUrl = baseUrl.replace('http', 'ws');
	const webSocket = new WebSocket(`${wsUrl}/ws?token=${tokenData.data.token}`)

	webSocket.onopen = () => {
		console.log('socket connected')
	}

	webSocket.onmessage = (message) => {
		const data = JSON.parse(message.data);
		console.log('web socket --- ', data.action)
	};

	webSocket.onerror = (error) => {
		console.log('web socket error: ', error?.detail)
		webSocket?.close();
	}

	instanceUser.interceptors.request.use((config) => {
		if (tokenData.data.token) {
			config.headers.Authorization ="Token "+ tokenData.data.token;
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