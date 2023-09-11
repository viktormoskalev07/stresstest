import {delayedFunctionCall} from "../helpers/delayFunc.js"
import {deleteAccount} from "../testsFunc/deleteAccount.js"
import {getBalance} from "../testsFunc/userInfo.js"
import {showLogs} from "../index.js";

let roomId

const createGame = async (instanceUser) => {
	const xpOrCash = 'xp'
	const body = {
		games: [
			{game: "fifa23_new", bid: 12},
			{game: "fifa23_old", bid: 12},
			{game: "mw2_console", bid: 12},
			{game: "mw2_pc", bid: 12},
			{game: "dota", bid: 12},
			{game: "csgo", bid: 123},
		],
		ready_to_play: true
	}
	try {
		const createGameResponse = await instanceUser.patch(`/user/set-ready-to-play/${xpOrCash}/`, body);
		showLogs&&console.log(createGameResponse.data , "create game")
	} catch (e) {
		console.error(e.message, 'create game')
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
};
const inviteToGame = async (instanceUser, userId) => {

	const body = {
		price: 122,
		player_id: userId,
		game: "csgo",
		account_type: "xp"
	}

	try {
		const inviteToGameResponse = await instanceUser.post(`/rooms/create-room/`, body);
		showLogs&&console.log(inviteToGameResponse.data , "invite to game")
	} catch (e) {
		console.error(e.message, 'invite to game')
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
return 1
}

const acceptGame = async (instanceUser) => {

	try {
		const getInvitationsResponse = await instanceUser.get(`/rooms/invitations/`);
		roomId = getInvitationsResponse.data[0].id
		showLogs&&console.log(getInvitationsResponse.data[0].id , "get room id")

		const acceptGameResponse = await instanceUser.post(`/rooms/${roomId}/accept/`)
		showLogs&&console.log(acceptGameResponse.data , "accepted game")

	} catch (e) {
		console.error(e.message, 'accept game')
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
}

const setRoomBid = async (instanceUser, bid) => {

	const body = {
		bid: bid
	}

	try {
		const setBidResponse = await instanceUser.post(`/rooms/${roomId}/set-bid/`, body)
		showLogs&&	console.log(setBidResponse.data, 'setting bid')
	} catch (e) {
		console.error(e.message, 'set room bid')
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
}

const setReady = async (instanceUser) => {

	try {
		const setReadyResponse = await instanceUser.post(`/rooms/${roomId}/set-ready/`)
		showLogs&&console.log(setReadyResponse.data, 'set ready')

	} catch (e) {
		console.error(e.message, 'set ready')
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
}

const setVerdict = async (instanceUser, userId) => {

	const body = {
		user_id: userId
	}

	try {
		const setVerdictResponse = await instanceUser.post(`/rooms/${roomId}/set-verdict/`, body)
		showLogs&&console.log(setVerdictResponse.data, 'set verdict')

	} catch (e) {
		console.error(e.message, 'set verdict')
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
}

export const cancelGame = async (instanceUser) => {

	try {
		const cancelGameResponse = await instanceUser.post(`/rooms/${roomId}/remove-room/`)
		showLogs&&	console.log(cancelGameResponse.data, 'cancel game')
	} catch (e) {
		console.error(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
}


export const playGame = async (instanceUser1, instanceUser2, user1, user2, saveToFile) => {
	let secondUserInitialBalance = 0
	let secondUserFinalBalance = 0

	const setInitialBalance = (balance) => {
		secondUserInitialBalance = balance
	}

	const setFinalBalance = (balance) => {
		secondUserFinalBalance = balance
	}

	showLogs&&console.log('start game')

	// second user balance before verdict
	showLogs&&console.log('=== get user balance before game')
	await delayedFunctionCall(() => getBalance(instanceUser2, setInitialBalance)  ,1,"getBalance" )

	// firs user created game
	await delayedFunctionCall(() => createGame(instanceUser1) , 1,"createGame")

	//second user send invite to game
	await delayedFunctionCall(() => inviteToGame(instanceUser2, user1.userId) , 1,"inviteToGame")

	// first user accept the game
	await delayedFunctionCall(() => acceptGame(instanceUser1) , 1,"acceptGame")

	// first user set new bid
	await delayedFunctionCall(() => setRoomBid(instanceUser1, 50) , 1,"setRoomBid")

	// second user set the same bid
	await delayedFunctionCall(() => setRoomBid(instanceUser2, 50) ,  1,"setRoomBid")

	// first user ready
	await delayedFunctionCall(() => setReady(instanceUser1) , 1,"setReady")

	// second user ready
	await delayedFunctionCall(() => setReady(instanceUser2) , 1,"setReady")

	// first user lose
	await delayedFunctionCall(() => setVerdict(instanceUser1, user2.userId) , 1,"setVerdict")

	// second user win
	await delayedFunctionCall(() => setVerdict(instanceUser2, user2.userId) ,1,"setVerdict")

	// second user balance after verdict
	showLogs&&console.log('=== get user balance after game')
	await delayedFunctionCall(() => getBalance(instanceUser2, setFinalBalance) ,1,"getBalance ")
	process.send('incrementAction');
	showLogs&&console.log('game finished')

	const balanceDifference = secondUserFinalBalance - secondUserInitialBalance
	const balanceChange = balanceDifference > 0 ? `+${balanceDifference}$` : balanceDifference.toString()
	const balancePositive = balanceDifference > 0
}
