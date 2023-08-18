import {deleteAccount} from "./deleteAccount.js"
import {delayedFunctionCall} from "../helpers/delayFunc.js"

const delay2 = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const del =1;
export const sendMessage = async (instanceUser) => {
	for(let i = 0; i < 25; i++) {
		try {
			await delay2(500*del);
			const sendMessageResponse2 = await instanceUser.post(`/chats/${1}/send-message/`, {
				text: 'I am spam bot i am testing a website',
				type: 'default',
			});
			await delay2(1000*del); // Задержка
			try {
				const userInfo =  await instanceUser.get( "/user/info/");
				console.log(" message from " , userInfo.data.id ,"num ",  i  )

			} catch (e) {
				console.log(e.message)
				await delayedFunctionCall(() => deleteAccount(instanceUser))
			}
			console.log(i)
		} catch (e) {
			console.log(e.message);
			await delayedFunctionCall(() => deleteAccount(instanceUser))
		}
	}
};

