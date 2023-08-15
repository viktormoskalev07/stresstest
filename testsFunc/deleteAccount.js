import {removeTokenFromFile} from "./deleteScript.js";

export const deleteAccount = async (instanceUser, token) => {
	try {
		const deleteResponse = await instanceUser.post("/user/delete-account/")
		console.log(deleteResponse.data, " /user/delete-account/")
		removeTokenFromFile(token)
	} catch (e) {
		console.log(e.message)
	}
}