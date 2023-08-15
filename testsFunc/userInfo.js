import {deleteAccount} from "./deleteAccount.js"
import {delayedFunctionCall} from "../helpers/delayFunc.js"

export const getBalance = async (instanceUser, setBalance) => {

	try {
		const getBalanceResponse = await instanceUser.get('/balances/my/')
		console.log('get second user balance -- ', getBalanceResponse.data.xp)
		setBalance(getBalanceResponse.data.xp)
	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
	}
}