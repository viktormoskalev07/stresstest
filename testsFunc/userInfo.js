import {deleteAccount} from "./deleteAccount.js"
import {delayedFunctionCall} from "../helpers/delayFunc.js"
import {showLogs} from "../index.js";

export const getBalance = async (instanceUser, setBalance) => {
		let balance = undefined
	try {
		const getBalanceResponse = await instanceUser.get('/balances/my/')
		showLogs&&	console.log('get second user balance -- ', getBalanceResponse.data.xp)
		setBalance&&setBalance(getBalanceResponse.data.xp)
		balance=getBalanceResponse.data
	} catch (e) {
		console.error(e.message, e?.response?.data,"get balance")
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return balance
}
