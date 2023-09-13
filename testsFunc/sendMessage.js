import {deleteAccount} from "./deleteAccount.js"
import {delayedFunctionCall} from "../helpers/delayFunc.js"
import {pingMaxTimeError, showLogs} from "../index.js";


const delay2 = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const del =1;
export const sendMessage = async (instanceUser) => {
	for(let i = 0; i < 3; i++) {
		try {
			await delay2(100*del);
			const startTime = Date.now()
				const message =async ()=>{
					const sendMessageResponse2 = await instanceUser.post(`/chats/${1}/send-message/`, {
						text: 'I am spam bot i am testing a website',
						type: 'default',
					});
					return sendMessageResponse2
				}
				const userInfo =async ()=>{
					const userInfo =  await instanceUser.get( "/user/info/");
					showLogs&&console.log(" message from " , userInfo.data.id ,"num ",  i  )
					return 1
				}
				const getListMessages =async ()=>{
				return await instanceUser.get("/chats/?page_size=100")

				}
 			await delayedFunctionCall(message , 1 , "message");
			 await  delayedFunctionCall(userInfo , 1 , "userInfo");
			 await  delayedFunctionCall(getListMessages , 1 , "getListMessages");
		} catch (e) {
			console.error(e.message, "send message");
			await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
		}
	}
};

