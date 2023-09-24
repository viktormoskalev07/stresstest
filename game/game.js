import { delayedFunctionCall } from "../helpers/delayFunc.js"
import { deleteAccount } from "../testsFunc/deleteAccount.js"
import { getBalance } from "../testsFunc/userInfo.js"
import { showLogs } from "../index.js";

let roomId
let game

const createGame = async (instanceUser) => {
	const xpOrCash = 'cash'
	const body = {
		games: [
			// {game: "fifa23_new", bid: 12},
			// {game: "fifa23_old", bid: 12},
			// {game: "mw2_console", bid: 12},
			// {game: "mw2_pc", bid: 12},
			// {game: "dota", bid: 12},
			{ game: "csgo", bid: 1 },
		],
		ready_to_play: true
	}

	try {
		const createGameResponse = await instanceUser.patch(`/user/set-ready-to-play/${xpOrCash}/`, body);
		showLogs && console.log(createGameResponse.data, "create game")
	} catch (e) {
		console.error(e, e?.response?.data, 'create game')
		// await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
};
const inviteToGame = async (instanceUser, userId) => {

	const body = {
		price: 122,
		player_id: userId,
		game: "fifa23_new",
		account_type: "cash"
	}

	try {
		const inviteToGameResponse = await instanceUser.post(`/rooms/create-room/`, body);
		showLogs && console.log(inviteToGameResponse.data, "invite to game")
	} catch (e) {
		console.error(e.message, e?.response?.data, 'invite to game')
		// await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
}

const acceptGame = async (instanceUser) => {

	try {
		const getInvitationsResponse = await instanceUser.get(`/rooms/invitations/`);
		roomId = getInvitationsResponse.data[0].id
		showLogs && console.log(getInvitationsResponse.data[0].id, "get room id")

		const acceptGameResponse = await instanceUser.post(`/rooms/${roomId}/accept/`)
		showLogs && console.log(acceptGameResponse.data, "accepted game")

	} catch (e) {
		console.error(e.message, e?.response?.data, 'accept game')
		// await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
}

const transactionsCardGenerateCode = async (instanceUser, userId) => {

	const body = {
		email: `test${userId}@gmail.com`
	}

	try {
		const transactionsCodeResponse = await instanceUser.post(`/transactions/generate-code/`, body)
		showLogs && console.log(transactionsCodeResponse.data, 'transactions card generated Code')
	} catch (e) {
		console.error(e.message, e?.response?.data, 'transactions card generateCode')
	}
}

const transactionsCrypto = async (instanceUser) => {

	const body = {
		currency: "USDCMATIC",
		payment_service: "nowpayments",
		// promo_code: "",
		sum: 10
	}

	try {
		const createReplenishmentResponse = await instanceUser.post(`/transactions/create-replenishment-request/`, body)
		showLogs && console.log(createReplenishmentResponse.data, 'create crypto replenishment ')
	} catch (e) {
		console.error(e.message, e?.response?.data, 'transactions crypto replenishment')
	}
}

const setRoomBid = async (instanceUser, bid) => {

	const body = {
		bid: bid
	}

	try {
		const setBidResponse = await instanceUser.post(`/rooms/${roomId}/set-bid/`, body)
		showLogs && console.log(setBidResponse.data, 'setting bid')
	} catch (e) {
		console.error(e.message, e?.response?.data, 'set room bid')
		// await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
}

const setReady = async (instanceUser) => {

	try {
		const setReadyResponse = await instanceUser.post(`/rooms/${roomId}/set-ready/`)
		showLogs && console.log(setReadyResponse.data, 'set ready')

	} catch (e) {
		console.error(e.message, e?.response?.data, 'set ready')
		// await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
}

const getRoom = async (instanceUser) => {
	try {
		const getRoomResponse = await instanceUser.get(`/rooms/${roomId}`)
		game = getRoomResponse.data.game;
		showLogs && console.log(getRoomResponse.data, 'get room')

	} catch (e) {
		console.log(e);
		console.error(e.message, e?.response?.data, 'get room')
	}
}

const setPlayersUserName = async (instanceUser) => {
	const body = {
		game_type: "cash",
		username: "https://steamcommunity.com/id/gabelogannewell"
	}
	try {
		const setPlayersUserNameResponse = await instanceUser.put(`/games/${game}/change-username/`, body)
		showLogs && console.log(setPlayersUserNameResponse.data, 'set Players User Name ')

	} catch (e) {
		console.log(game);
		console.error(e.message, e?.response?.data, 'set Players User Name')
	}
}

const setVerdict = async (instanceUser, userId) => {

	const body = {
		user_id: userId
	}

	try {
		const setVerdictResponse = await instanceUser.post(`/rooms/${roomId}/set-verdict/`, body)
		showLogs && console.log(setVerdictResponse.data, 'set verdict')

	} catch (e) {
		console.error(e.message, e?.response?.data, 'set verdict')
		// await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
	}
	return 1
}

export const cancelGame = async (instanceUser) => {

	try {
		const cancelGameResponse = await instanceUser.post(`/rooms/${roomId}/remove-room/`)
		showLogs && console.log(cancelGameResponse.data, 'cancel game')
	} catch (e) {
		console.error(e.message, e?.response?.data, "cansel game")
		// await delayedFunctionCall(() => deleteAccount(instanceUser) , 1 ,"delete")
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

	showLogs && console.log('start game')

	// second user balance before verdict
	showLogs && console.log('=== get user balance before game')
	const _user1BalanceStart = await delayedFunctionCall(async () => await getBalance(instanceUser1, setInitialBalance), 1, "getBalance")
	const user1BalanceStart = _user1BalanceStart?.cash
	const _user2BalanceStart = await delayedFunctionCall(async () => await getBalance(instanceUser2, setInitialBalance), 1, "getBalance")
	const user2BalanceStart = _user2BalanceStart?.cash
	const opponentInfo = await delayedFunctionCall(async () => await instanceUser1("/user/users/" + user2.userId), 1, "opponentInfo")
	const opponentInfo2 = await delayedFunctionCall(async () => await instanceUser2("/user/users/" + user1.userId), 1, "opponentInfo")

	const BID = 2
	// firs user created game
	const timeout = Math.random() * 2
	await delayedFunctionCall(() => createGame(instanceUser1), timeout, "createGame")

	//second user send invite to game
	await delayedFunctionCall(() => inviteToGame(instanceUser2, user1.userId), 1, "inviteToGame")

	// first user accept the game
	await delayedFunctionCall(() => acceptGame(instanceUser1), timeout, "acceptGame")

	//first user decided to deposit funds , he choose the credit card

	await delayedFunctionCall(() => transactionsCardGenerateCode(instanceUser1, user1.userId), timeout, "transactionsCardGenerateCode")
	const _user1BalanceAfterReplenishment = await delayedFunctionCall(async () => await getBalance(instanceUser1, setInitialBalance), 1, "getBalance")
	const user1Replenishment = _user1BalanceAfterReplenishment?.cash - user1BalanceStart

	//second user decided to deposit funds , he choose the crypto
	
	const replenishmentUser1Response = await delayedFunctionCall(() => instanceUser2(`/transactions/replenishment-requests/`) , timeout, "replenishmentInfo")
	showLogs && console.log(replenishmentUser1Response.data, 'transactions card replenishment requests')

	const minReplenishmentResponse = await delayedFunctionCall(() => instanceUser2(`/transactions/min-replenishment/`), timeout, "minReplenishment")
	showLogs && console.log(minReplenishmentResponse.data, 'transactions card min replenishment requests')

	await delayedFunctionCall(() => transactionsCrypto(instanceUser2), timeout, "transactionsCrypto")
	const _user2BalanceAfterReplenishment = await delayedFunctionCall(async () => await getBalance(instanceUser2, setInitialBalance), 1, "getBalance")
	const user2Replenishment = _user2BalanceAfterReplenishment?.cash - user2BalanceStart

	// first user set new bid
	await delayedFunctionCall(() => setRoomBid(instanceUser1, BID), timeout, "setRoomBid")

	// second user set the same bid
	await delayedFunctionCall(() => setRoomBid(instanceUser2, BID), timeout, "setRoomBid")

	// first user ready
	await delayedFunctionCall(() => setReady(instanceUser1), timeout, "setReady")

	// second user ready
	await delayedFunctionCall(() => setReady(instanceUser2), timeout, "setReady")

	// add players user names 
	await delayedFunctionCall(() => getRoom(instanceUser1), timeout, "getRoom")

	await delayedFunctionCall(() => setPlayersUserName(instanceUser1), timeout, "setPlayersUserName")

	await delayedFunctionCall(() => setPlayersUserName(instanceUser2), timeout, "setPlayersUserName")

	// first user lose
	await delayedFunctionCall(() => setVerdict(instanceUser1, user2.userId), timeout, "setVerdict")

	// second user win
	await delayedFunctionCall(() => setVerdict(instanceUser2, user2.userId), timeout, "setVerdict")
	const _user1BalanceFinish = await delayedFunctionCall(async () => await getBalance(instanceUser1, setInitialBalance), 1, "getBalance")
	const user1BalanceFinish = _user1BalanceFinish?.cash
	const _user2BalanceFinish = await delayedFunctionCall(async () => await getBalance(instanceUser2, setInitialBalance), 1, "getBalance")
	const user2BalanceFinish = _user2BalanceFinish?.cash
	// second user balance after verdict
	showLogs && console.log('=== get user balance after game')
	const round10 = (num) => Math.round(num * 1000) / 1000;
	const result1 = round10(user1BalanceFinish - user1BalanceStart);
	const result2 = round10(user2BalanceFinish - user2BalanceStart);

	const user1Error = result1 !== (-BID + user1Replenishment)
	const user2Error = result2 !== (round10(BID * 0.9) + user2Replenishment)
	console.log({ result1, result2, user1Error, user2Error })
	if (user1Error || user2Error) {
		console.error({ user1BalanceFinish, user1Replenishment, user1BalanceStart, user2BalanceFinish, user2Replenishment, user2BalanceStart, BID })
	}

	showLogs && console.log('game finished')


}
