import {deleteAccount} from "./deleteAccount.js"
import {delayedFunctionCall} from "../helpers/delayFunc.js"
import {pingMaxTimeError, showLogs} from "../index.js";


const delay2 = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const del =1;
export const sendMessage = async (instanceUser) => {
	for(let i = 0; i < 25; i++) {
		try {
			await delay2(500*del);
			const startTime = Date.now()

			const sendMessageResponse2 = await instanceUser.post(`/chats/${1}/send-message/`, {
				text: 'I am spam bot i am testing a website',
				type: 'default',
			});
			const endTime = Date.now();
			const elapsedTime = endTime - startTime;
			if(elapsedTime>pingMaxTimeError){
				console.warn(`Request Time: ${elapsedTime/1000}s createUser`);
			} else {
				showLogs&&console.log(`Request Time: ${elapsedTime/1000}s`);
			}
			process.send('incrementAction');
			await delay2(1000*del); // Задержка
			try {
				const userInfo =  await instanceUser.get( "/user/info/");
				showLogs&&console.log(" message from " , userInfo.data.id ,"num ",  i  )
				process.send('incrementAction');
			} catch (e) {
				console.error(e.message)
				await delayedFunctionCall(() => deleteAccount(instanceUser))
			}

		} catch (e) {
			console.error(e.message);
			await delayedFunctionCall(() => deleteAccount(instanceUser))
		}
	}
};

