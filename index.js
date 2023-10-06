import axios from "axios";
import { saveToFile } from "./helpers/saveToFile.js";
import { createUser } from "./testsFunc/createUser.js";
import { delayedFunctionCall } from "./helpers/delayFunc.js";
import { unsubscribeEmail } from "./testsFunc/unsubscribe.js";
import { sendMessage } from "./testsFunc/sendMessage.js";
import { playGame } from "./game/game.js";
import { deleteAccount } from "./testsFunc/deleteAccount.js";

import { baseUrl } from "./helpers/constants.js";

import { getGamesWithFilters } from "./testsFunc/getGamesWithFilters.js";
import chalk from "chalk";
import { changeUsername } from "./testsFunc/changeUserName.js";
import { performDataRequests } from "./performDataRequests/performDataRequests.js";



export const showLogs = false
const changeUserName = true
const performData = true
const playGames = true
export const getGames = true
const sendMessages = true
export const connectSocket = true
export const pingMaxTimeError = 1500


const createAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL: baseURL + "/api/v0",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

export const app = async (id) => {
  console.error = function (...message) {
    process.send({ type: 'errors', err: message })
    console.log(chalk.red(JSON.stringify(message)));
  };
  console.warn = function (message) {
    console.log(chalk.yellow(message));
    process.send('warnings')
  };
  showLogs && console.log("app started" + id)
  const instanceUser1 = createAxiosInstance(baseUrl)
  const instanceUser2 = createAxiosInstance(baseUrl)
  const [user1, user2] = await Promise.all([
    createUser(instanceUser1, baseUrl),
    createUser(instanceUser2, baseUrl),
  ]);

  console.error = function (...message) {
    process.send({ type: 'errors', err: { message, user11: user1.userId, user22: user2.userId } })
    console.log(chalk.red(JSON.stringify({ message, user11: user1.userId, user22: user2.userId })));
  };
  if (!user1?.token || !user2?.token) {
    console.error("error no user ");
    process.send('decrementUsers')
    process.exit()
    return
  }

  //change userName (only after register)
  changeUserName && await delayedFunctionCall(async () => await changeUsername(instanceUser1), 1, "changeUserName")
  await delayedFunctionCall(async () => await changeUsername(instanceUser2), 1, "changeUserName")

  //home page
  performData && performDataRequests(instanceUser1, instanceUser2)
  await delayedFunctionCall(async () => await instanceUser1("/games/cash/"), 1, "gamesCash")
  await delayedFunctionCall(async () => await instanceUser2("/games/cash/"), 1, "gamesCash")

  await delayedFunctionCall(async () => await instanceUser1("/balances/my/"), 1, "myBalance")
  await delayedFunctionCall(async () => await instanceUser2("/balances/my/"), 1, "myBalance")

  //profile
  performData && performDataRequests(instanceUser1, instanceUser2)

  await delayedFunctionCall(async () => await instanceUser1(`/feedbacks/${user1.userId}`), 1, "feedbacks")
  await delayedFunctionCall(async () => await instanceUser2(`/feedbacks/${user2.userId}`), 1, "feedbacks")
  performData && performDataRequests(instanceUser1, instanceUser2)

  await delayedFunctionCall(async () => await instanceUser1("/rooms/history/"), 1, "roomsHistory")
  await delayedFunctionCall(async () => await instanceUser2("/rooms/history/"), 1, "roomsHistory")
  performData && performDataRequests(instanceUser1, instanceUser2)

  await delayedFunctionCall(async () => await instanceUser1("/transactions/"), 1, "transactions")
  await delayedFunctionCall(async () => await instanceUser2("/transactions/"), 1, "transactions")
  performData && performDataRequests(instanceUser1, instanceUser2)

  // await delayedFunctionCall(async () => await instanceUser1("/transactions/withdrawal-requests/"), 1, "withdrawalTransactions")
  // await delayedFunctionCall(async () => await instanceUser2("/transactions/withdrawal-requests/"), 1, "withdrawalTransactions")
  performData && performDataRequests(instanceUser1, instanceUser2)

  // await delayedFunctionCall(async () => await instanceUser1("/transactions/check-withdrawal-availability"), 1, "checkWithdrawAvailability")
  // await delayedFunctionCall(async () => await instanceUser2("/transactions/check-withdrawal-availability"), 1, "checkWithdrawAvailability")
  performData && performDataRequests(instanceUser1, instanceUser2)


  //settings
  await delayedFunctionCall(async () => await instanceUser1("/user/settings/"), 1, "userSettings")
  await delayedFunctionCall(async () => await instanceUser2("/user/settings/"), 1, "userSettings")
  performData && performDataRequests(instanceUser1, instanceUser2)

  //games search
  getGames && await getGamesWithFilters(instanceUser2)
  getGames && await getGamesWithFilters(instanceUser1)
  showLogs && console.log('first user id -- ', user1?.userId)
  showLogs && console.log('second user id -- ', user2?.userId)
  getGames && await getGamesWithFilters(instanceUser1)
  getGames && await getGamesWithFilters(instanceUser2)

  //unsubscribe
  await delayedFunctionCall(async () => await unsubscribeEmail(instanceUser1), 1, "unsubscribeEmail")
  getGames && await getGamesWithFilters(instanceUser2)
  getGames && await getGamesWithFilters(instanceUser1)
  getGames && await getGamesWithFilters(instanceUser1)
  await delayedFunctionCall(async () => await unsubscribeEmail(instanceUser2), 1, "unsubscribeEmail")
  getGames && await getGamesWithFilters(instanceUser2)
  getGames && await getGamesWithFilters(instanceUser1)
  // playGames && await playGame(instanceUser1, instanceUser2, user1, user2, saveToFile)

  // go to home page
  sendMessages && await sendMessage(instanceUser1)

  getGames && await getGamesWithFilters(instanceUser2)
  getGames && await getGamesWithFilters(instanceUser1)

  getGames && await getGamesWithFilters(instanceUser2)
  getGames && await getGamesWithFilters(instanceUser1)
  sendMessages && await sendMessage(instanceUser2)

  getGames && await getGamesWithFilters(instanceUser2)
  getGames && await getGamesWithFilters(instanceUser1)
  getGames && await getGamesWithFilters(instanceUser2)
  playGames && await playGame(instanceUser1, instanceUser2, user1, user2, saveToFile)
  getGames && await getGamesWithFilters(instanceUser1)

  getGames && await getGamesWithFilters(instanceUser2)
  getGames && await getGamesWithFilters(instanceUser1)

  //reset stats
  // await delayedFunctionCall(async () => await instanceUser1.post("/user/reset-stats/"), 1, "resetStats")
  // await delayedFunctionCall(async () => await instanceUser2.post("/user/reset-stats/"), 1, "resetStats")
  performData && performDataRequests(instanceUser1, instanceUser2)

  // delete account
  await delayedFunctionCall(() => deleteAccount(instanceUser1, user1.token), 100, "deleteacc")

  if (connectSocket) {
    user1.webSocket.close(1000);
  }
  showLogs && console.log("webSocket closed", id)

  await delayedFunctionCall(() => deleteAccount(instanceUser2, user2.token), 100, "deleteacc")
  if (connectSocket) {
    user2.webSocket.close(1000);
  }



  process.send('decrementUsers')
  process.exit()
};


