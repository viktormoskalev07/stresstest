import {delayedFunctionCall} from "../helpers/delayFunc.js";
import {deleteAccount} from "./deleteAccount.js";

export const getMatchfinderGames = async (userInstance, page = 1, type = 'xp', pageSize = 20) => {

	const url = `/games/${type}/?page=${page}&page_size=${pageSize}`

	try {
		await userInstance.get(url)
		console.log(`== get matchfinder games`)
	} catch (e) {
		console.log(e.message , "get matchfinder games")
		await delayedFunctionCall(() => deleteAccount(userInstance))
	}
}