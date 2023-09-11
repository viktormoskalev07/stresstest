import {deleteAccount} from "./deleteAccount.js"
import {delayedFunctionCall} from "../helpers/delayFunc.js"
import {showLogs} from "../index.js";

export const getBalance = async (instanceUser, setBalance) => {

	try {
		const getBalanceResponse = await instanceUser.get('/balances/my/')
		showLogs&&	console.log('get second user balance -- ', getBalanceResponse.data.xp)
		setBalance(getBalanceResponse.data.xp)
	} catch (e) {
		console.error(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
}
