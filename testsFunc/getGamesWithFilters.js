import {delayedFunctionCall} from "../helpers/delayFunc.js";
import {deleteAccount} from "./deleteAccount.js";
import {pingMaxTimeError, showLogs} from "../index.js";


export const getGamesWithFilters = async (userInstance, page = 1, type = 'xp', pageSize = 20) => {

	const url = `/games/${type}/?page=${page}&page_size=${pageSize}&ordering=-network__user__ready_to_play&games=csgo,dota,mw2_console,mw2_pc,fifa23_new,fifa23_old/`

	try {
		const startTime = Date.now()
		await userInstance.get(url)
		const endTime = Date.now();
		const elapsedTime = endTime - startTime;

		if(elapsedTime>pingMaxTimeError){
			console.error(`Request Time: ${elapsedTime}s getGamesWithFilters`);
		} else {
			showLogs&&console.log(`Request Time: ${elapsedTime}s`);
		}
		process.send('incrementAction');
		showLogs&& console.log(`== get matchfinder games with filters`)
	} catch (e) {
		console.error(e.message , e?.code  , e?.response?.data, e?.response?.status, "get matchfinder games with filters")
		await delayedFunctionCall(() => deleteAccount(userInstance))
	}
}