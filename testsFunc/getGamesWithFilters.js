import {delayedFunctionCall} from "../helpers/delayFunc.js";
import {deleteAccount} from "./deleteAccount.js";

export const getGamesWithFilters = async (userInstance, page = 1, type = 'xp', pageSize = 20) => {

	const url = `/games/${type}/?page=${page}&page_size=${pageSize}&ordering=-network__user__ready_to_play&games=csgo,dota,mw2_console,mw2_pc,fifa23_new,fifa23_old/`

	try {
		await userInstance.get(url)
		console.log(`== get matchfinder games with filters`)
	} catch (e) {
		console.log(e.message , "get matchfinder games with filters")
		await delayedFunctionCall(() => deleteAccount(userInstance))
	}
}