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

console.warn = function(message) {
  console.log(chalk.yellow(message));
};
console.error = function(message) {
  console.log(chalk.red(message));
};
export const showLogs = false
export const getGames = false

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
  showLogs&&   console.log("app started" + id)

  const instanceUser1 = createAxiosInstance(baseUrl)
  const instanceUser2 = createAxiosInstance(baseUrl)

  process.send('incrementAction');

  const [user1, user2] = await Promise.all([
    createUser(instanceUser1, baseUrl),
    createUser(instanceUser2, baseUrl),
  ]);


    if(!user1?.token||!user2?.token){
    console.error("error no user ")
      return
  }


  saveToFile('data/tokens.txt', user1?.token);
  saveToFile('data/tokens.txt', user2?.token);

  showLogs&&console.log('first user id -- ', user1?.userId)
  showLogs&&console.log('second user id -- ', user2?.userId)
  await getGamesWithFilters(instanceUser1)

  //unsubscribe
  await delayedFunctionCall(() => unsubscribeEmail(instanceUser1))
  getGames&&  await getGamesWithFilters(instanceUser1)
  await delayedFunctionCall(() => unsubscribeEmail(instanceUser2))
  getGames&&   await getGamesWithFilters(instanceUser1)
  await playGame(instanceUser1, instanceUser2, user1, user2, saveToFile)
  // go to home page
  getGames&&   await getGamesWithFilters(instanceUser1)
  getGames&&   await getGamesWithFilters(instanceUser2)
  await sendMessage(instanceUser1)
  getGames&&  await getGamesWithFilters(instanceUser2)



  await delayedFunctionCall(() => sendMessage(instanceUser1))



  // delete account
  await delayedFunctionCall(() => deleteAccount(instanceUser1, user1.token),100)
  user1.webSocket.close(1000);
    console.log("webSocket closed" , id )

  await delayedFunctionCall(() => deleteAccount(instanceUser2, user2.token),100)
  user2.webSocket.close(1000);


  process.send('decrementUsers')
  process.exit()
};


