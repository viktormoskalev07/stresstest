import axios from "axios";
import {saveToFile} from "./helpers/saveToFile.js";
import {createUser} from "./testsFunc/createUser.js";
import {delayedFunctionCall} from "./helpers/delayFunc.js";
import {unsubscribeEmail} from "./testsFunc/unsubscribe.js";
import {sendMessage} from "./testsFunc/sendMessage.js";
import {playGame} from "./game/game.js";
import {deleteAccount} from "./testsFunc/deleteAccount.js";

import {baseUrl   } from "./helpers/constants.js";

import {getGamesWithFilters} from "./testsFunc/getGamesWithFilters.js";
import chalk from "chalk";



export const showLogs = false
const playGames = false
export const getGames = false
const sendMessages = false
export const connectSocket = false
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
  console.error = function(...message) {
    process.send({type:'errors', err:message})
    console.log(chalk.red(JSON.stringify(message)));
  };
  console.warn = function(message) {
    console.log(chalk.yellow(message));
    process.send('warnings')
  };
  showLogs&&   console.log("app started" + id)
  const instanceUser1 = createAxiosInstance(baseUrl)
  const instanceUser2 = createAxiosInstance(baseUrl)
  const [user1, user2] = await Promise.all([
    createUser(instanceUser1, baseUrl),
    createUser(instanceUser2, baseUrl),
  ]);


    if(!user1?.token||!user2?.token){
    console.error("error no user ");
      process.send('decrementUsers')
      process.exit()
      return
  }


  getGames&&  await getGamesWithFilters(instanceUser2)
  getGames&&   await getGamesWithFilters(instanceUser1)
  showLogs&&console.log('first user id -- ', user1?.userId)
  showLogs&&console.log('second user id -- ', user2?.userId)
  getGames&& await getGamesWithFilters(instanceUser1)
  getGames&&   await getGamesWithFilters(instanceUser2)
  //unsubscribe
  await delayedFunctionCall(async () =>await unsubscribeEmail(instanceUser1) ,1 , "unsubscribeEmail")
  getGames&&  await getGamesWithFilters(instanceUser2)
  getGames&&   await getGamesWithFilters(instanceUser1)
  getGames&&  await getGamesWithFilters(instanceUser1)
  await delayedFunctionCall(async() => await unsubscribeEmail(instanceUser2), 1 , "unsubscribeEmail")
  getGames&&  await getGamesWithFilters(instanceUser2)
  getGames&&   await getGamesWithFilters(instanceUser1)
  playGames&&await playGame(instanceUser1, instanceUser2, user1, user2, saveToFile)
  // go to home page
  sendMessages&&await sendMessage(instanceUser1)

  getGames&&  await getGamesWithFilters(instanceUser2)
  getGames&&   await getGamesWithFilters(instanceUser1)
  playGames&&await playGame(instanceUser1, instanceUser2, user1, user2, saveToFile)
  getGames&&  await getGamesWithFilters(instanceUser2)
  getGames&&   await getGamesWithFilters(instanceUser1)
  sendMessages&& await  sendMessage(instanceUser2)

  getGames&&  await getGamesWithFilters(instanceUser2)
  getGames&&   await getGamesWithFilters(instanceUser1)
  getGames&&  await getGamesWithFilters(instanceUser2)
  playGames&&await playGame(instanceUser1, instanceUser2, user1, user2, saveToFile)
  getGames&&   await getGamesWithFilters(instanceUser1)
  playGames&&await playGame(instanceUser1, instanceUser2, user1, user2, saveToFile)
  getGames&&  await getGamesWithFilters(instanceUser2)
  getGames&&   await getGamesWithFilters(instanceUser1)
  // delete account
  await delayedFunctionCall(() => deleteAccount(instanceUser1, user1.token),100, "deleteacc")

  if(connectSocket) {
    user1.webSocket.close(1000);
  }
  showLogs&& console.log("webSocket closed" , id )

  await delayedFunctionCall(() => deleteAccount(instanceUser2, user2.token),100 , "deleteacc")
  if(connectSocket){
    user2.webSocket.close(1000);
  }



  process.send('decrementUsers')
  process.exit()
};


