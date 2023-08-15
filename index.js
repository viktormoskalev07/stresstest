import axios from "axios";
import {saveToFile} from "./helpers/saveToFile.js";
import {createUser} from "./testsFunc/createUser.js";
import {delayedFunctionCall} from "./helpers/delayFunc.js";
import {unsubscribeEmail} from "./testsFunc/unsubscribe.js";
import {goToHomePage, goToMatchfinder} from "./testsFunc/goTo.js";
import {sendMessage} from "./testsFunc/sendMessage.js";
import {playGame} from "./game/game.js";
import {deleteAccount} from "./testsFunc/deleteAccount.js";

import {baseUrl, frontendUrl} from "./helpers/constants.js";


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
    console.log("app started" + id)

  const instanceUser1 = createAxiosInstance(baseUrl)
  const instanceUser2 = createAxiosInstance(baseUrl)

  const instanceUser1Frontend = createAxiosInstance(frontendUrl)

  const [user1, user2] = await Promise.all([
    createUser(instanceUser1, baseUrl),
    createUser(instanceUser2, baseUrl),
  ]);

  saveToFile('data/tokens.txt', user1.token);
  saveToFile('data/tokens.txt', user2.token);

  console.log('first user id -- ', user1.userId)
  console.log('second user id -- ', user2.userId)


  //unsubscribe
  await delayedFunctionCall(() => unsubscribeEmail(instanceUser1))
  console.log('user 1 unsubscribed')

  await delayedFunctionCall(() => unsubscribeEmail(instanceUser2))
  console.log('user 2 unsubscribed')

  // go to home page
  await delayedFunctionCall(() => goToHomePage(instanceUser1Frontend, frontendUrl))

  // go to matchfinder
  await delayedFunctionCall(() => goToMatchfinder(instanceUser1Frontend, frontendUrl))

  //send message
  await delayedFunctionCall(() => sendMessage(instanceUser1))

  // play game
  await playGame(instanceUser1, instanceUser2, user1, user2, saveToFile)

  // first user canceled the game
  // await delayedFunctionCall(() => cancelGame(instanceUser1), 3000)

  // delete account
  await delayedFunctionCall(() => deleteAccount(instanceUser1, user1.token),1000*15)
  user1.webSocket.close(1000);
    console.log("webSocket closed" , id )

  await delayedFunctionCall(() => deleteAccount(instanceUser2, user2.token),1000*15)
  user2.webSocket.close(1000);
  console.log("webSocket closed" , id )
};


