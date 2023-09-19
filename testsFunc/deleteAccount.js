import {removeTokenFromFile} from "./deleteScript.js";
import {showLogs} from "../index.js";

export const deleteAccount = async (instanceUser, token) => {
	process.send('incrementAction');
	try {
		const deleteResponse = await instanceUser.post("/user/delete-account/")
		showLogs&&console.log(deleteResponse.data, " /user/delete-account/")
		removeTokenFromFile(token)

		process.send('decrementUsers')
		process.exit()
	} catch (e) {
		console.error(e.message ,e?.response?.data, "userinfo")

		process.send('decrementUsers')
		process.exit()
	}
	return 1
}
