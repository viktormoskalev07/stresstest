import {delayedFunctionCall} from "../helpers/delayFunc.js"
import {deleteAccount} from "../testsFunc/deleteAccount.js"
import {getBalance} from "../testsFunc/userInfo.js"

let roomId

const createGame = async (instanceUser) => {
	const xpOrCash = 'xp'
	const body = {
		games: [
			{game: "fifa23_new", bid: 0},
			{game: "fifa23_old", bid: 0},
			{game: "mw2_console", bid: 0},
			{game: "mw2_pc", bid: 0},
			{game: "dota", bid: 0},
			{game: "csgo", bid: 123},
		],
		ready_to_play: true
	}
	try {
		const createGameResponse = await instanceUser.patch(`/user/set-ready-to-play/${xpOrCash}/`, body);
		console.log(createGameResponse.data , "create game")
	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
	}
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
		console.log(inviteToGameResponse.data , "invite to game")
	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
	}

}

const acceptGame = async (instanceUser) => {

	try {
		const getInvitationsResponse = await instanceUser.get(`/rooms/invitations/`);
		roomId = getInvitationsResponse.data[0].id
		console.log(getInvitationsResponse.data[0].id , "get room id")

		const acceptGameResponse = await instanceUser.post(`/rooms/${roomId}/accept/`)
		console.log(acceptGameResponse.data , "accepted game")

	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
	}
}

const setRoomBid = async (instanceUser, bid) => {

	const body = {
		bid: bid
	}

	try {
		const setBidResponse = await instanceUser.post(`/rooms/${roomId}/set-bid/`, body)
		console.log(setBidResponse.data, 'setting bid')
	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
	}
}

const setReady = async (instanceUser) => {

	try {
		const setReadyResponse = await instanceUser.post(`/rooms/${roomId}/set-ready/`)
		console.log(setReadyResponse.data, 'set ready')

	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
	}
}

const setVerdict = async (instanceUser, userId) => {

	const body = {
		user_id: userId
	}

	try {
		const setVerdictResponse = await instanceUser.post(`/rooms/${roomId}/set-verdict/`, body)
		console.log(setVerdictResponse.data, 'set verdict')

	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
	}
}

export const cancelGame = async (instanceUser) => {

	try {
		const cancelGameResponse = await instanceUser.post(`/rooms/${roomId}/remove-room/`)
		console.log(cancelGameResponse.data, 'cancel game')
	} catch (e) {
		console.log(e.message)
		await delayedFunctionCall(() => deleteAccount(instanceUser))
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

	console.log('start game')

	// second user balance before verdict
	console.log('=== get user balance before game')
	await delayedFunctionCall(() => getBalance(instanceUser2, setInitialBalance))

	// firs user created game
	await delayedFunctionCall(() => createGame(instanceUser1))

	//second user send invite to game
	await delayedFunctionCall(() => inviteToGame(instanceUser2, user1.userId))

	// first user accept the game
	await delayedFunctionCall(() => acceptGame(instanceUser1))

	// first user set new bid
	await delayedFunctionCall(() => setRoomBid(instanceUser1, 50))

	// second user set the same bid
	await delayedFunctionCall(() => setRoomBid(instanceUser2, 50))

	// first user ready
	await delayedFunctionCall(() => setReady(instanceUser1))

	// second user ready
	await delayedFunctionCall(() => setReady(instanceUser2))

	// first user lose
	await delayedFunctionCall(() => setVerdict(instanceUser1, user2.userId))

	// second user win
	await delayedFunctionCall(() => setVerdict(instanceUser2, user2.userId))

	// second user balance after verdict
	console.log('=== get user balance after game')
	await delayedFunctionCall(() => getBalance(instanceUser2, setFinalBalance))

	console.log('finished game')

	const balanceDifference = secondUserFinalBalance - secondUserInitialBalance
	const balanceChange = balanceDifference > 0 ? `+${balanceDifference}$` : balanceDifference.toString()
	const balancePositive = balanceDifference > 0

	saveToFile('data/gameLogs.txt', `UserId ${user2.userId} --- ${balanceChange} (${balancePositive})`)
}
