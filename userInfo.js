import {delayedFunctionCall} from "./delayFunc.js";
import {deleteAccount} from "./deleteAccount.js";

export const getBalance = async (instanceUser) => {

	try {
		const getBalanceResponse = await instanceUser.get('/balances/my/')
		console.log('get second user balance -- ', getBalanceResponse.data.xp)
	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
	}
}