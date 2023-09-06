import {delayedFunctionCall} from "../helpers/delayFunc.js";
import {deleteAccount} from "./deleteAccount.js";
import {showLogs} from "../index.js";

export const getMatchfinderGames = async (userInstance, page = 1, type = 'xp', pageSize = 100) => {

	const url = `/games/${type}/?page=${page}&page_size=${pageSize}`

	try {
		await userInstance.get(url)
		showLogs&&console.log(`== get matchfinder games`)
	} catch (e) {
		console.error(e.message , "get matchfinder games")
		await delayedFunctionCall(() => deleteAccount(userInstance))
	}
}