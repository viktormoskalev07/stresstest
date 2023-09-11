import {deleteAccount} from "./deleteAccount.js"
import {delayedFunctionCall} from "../helpers/delayFunc.js";
import {showLogs} from "../index.js";

export const goToHomePage = async (userInstance, frontendUrl) => {
	try {
		await userInstance.get(frontendUrl);
		showLogs&&console.log(`== visited home page`)
	} catch (e) {
		console.error(e.message , "home")
		await delayedFunctionCall(() => deleteAccount(userInstance) , 1 ,"delete")
	}
}

export const goToMatchfinder = async (userInstance, frontendUrl) => {
	try {
		await userInstance.get(frontendUrl + "/matchfinder");
		showLogs&&console.log(`== visited matchfinder`)
	} catch (e) {
		console.error(e.message , "match")
		await delayedFunctionCall(() => deleteAccount(userInstance) , 1 ,"delete")
	}
}
