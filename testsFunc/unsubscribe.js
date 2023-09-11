import {deleteAccount} from "./deleteAccount.js"
import {delayedFunctionCall} from "../helpers/delayFunc.js"
import {showLogs} from "../index.js";

export const unsubscribeEmail = async (instanceUser) => {

	try {
		const unsubscribeResponse = await instanceUser.post(`/emails/unsubscribe/`);
	 showLogs&&	console.log(unsubscribeResponse.data ,`/emails/unsubscribe/` )
		process.send('incrementAction');
	} catch (e) {
		console.error(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
}
