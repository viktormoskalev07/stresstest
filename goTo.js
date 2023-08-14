import axios from "axios";
import {delayedFunctionCall} from "./delayFunc.js";
import {deleteAccount} from "./deleteAccount.js";

export const goToHomePage = async (userInstance, frontendUrl) => {
	try {
		await userInstance.get(frontendUrl);
		console.log(`== visited home page`)
	} catch (e) {
		console.log(e.message , "home")
		await delayedFunctionCall(() => deleteAccount(userInstance))
	}
}

export const goToMatchfinder = async (userInstance, frontendUrl) => {
	try {
		await userInstance.get(frontendUrl + "/matchfinder");
		console.log(`== visited matchfinder`)
	} catch (e) {
		console.log(e.message , "match")
		await delayedFunctionCall(() => deleteAccount(userInstance))
	}
}