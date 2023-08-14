import {goToMatchfinder} from "./goTo.js";
import {delayedFunctionCall} from "./delayFunc.js";
import {deleteAccount} from "./deleteAccount.js";

const delay2 = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const del =1;
export const sendMessage = async (instanceUser) => {
	for(let i = 0; i < 1; i++) {
		try {
			await delay2(5000*del);
			const sendMessageResponse2 = await instanceUser.post(`/chats/${1}/send-message/`, {
				text: 'I am spam bot i am testing a website',
				type: 'default',
			});
			await delay2(3000*del); // Задержка
			// await  goToMatchfinder()
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