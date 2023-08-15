import {deleteAccount} from "./deleteAccount.js"
import {delayedFunctionCall} from "../helpers/delayFunc.js"

export const unsubscribeEmail = async (instanceUser) => {
	try {
		const unsubscribeResponse = await instanceUser.post(`/emails/unsubscribe/`);
		console.log(unsubscribeResponse.data ,`/emails/unsubscribe/` )
	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
	}
}