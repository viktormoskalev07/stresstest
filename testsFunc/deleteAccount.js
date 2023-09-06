import {removeTokenFromFile} from "./deleteScript.js";
import {showLogs} from "../index.js";

export const deleteAccount = async (instanceUser, token) => {
	process.send('incrementAction');
	try {
		const deleteResponse = await instanceUser.post("/user/delete-account/")
		showLogs&&console.log(deleteResponse.data, " /user/delete-account/")
		removeTokenFromFile(token)
	} catch (e) {
		console.log(e.message)
	}
}