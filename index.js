import axios from "axios";
import {createUser} from "./createUser.js";
import {delayedFunctionCall} from "./delayFunc.js";
import {goToHomePage, goToMatchfinder} from "./goTo.js";
import {sendMessage} from "./sendMessage.js";
import {unsubscribeEmail} from "./unsubscribe.js";
import {deleteAccount} from "./deleteAccount.js";
import {playGame} from "./game.js";
import {getBalance} from "./userInfo.js";

const baseUrl = "https://duel-api.smart-ui.pro";
// const baseUrl = "https://api.duelmasters.io";
const frontendUrl ="https://duel-master-git-duelmasters-old-api-config-duelmastersgg-s-team.vercel.app/"
// const frontendUrl ="https://www.duelmasters.io/"

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

  // second user balance before verdict
  console.log('start game')
  console.log('=== get user balance before game')
  await delayedFunctionCall(() => getBalance(instanceUser2))

  // play game
  await playGame(instanceUser1, instanceUser2, user1, user2)

  // second user balance after verdict
  console.log('finished game')
  console.log('=== get user balance after game')
  await delayedFunctionCall(() => getBalance(instanceUser2))

  // first user canceled the game
  // await delayedFunctionCall(() => cancelGame(instanceUser1), 3000)

  // delete account
  await delayedFunctionCall(() => deleteAccount(instanceUser1),1000*15)
  user1.webSocket.close(1000);
    console.log("webSocket closed" , id )

  await delayedFunctionCall(() => deleteAccount(instanceUser2),1000*15)
  user2.webSocket.close(1000);
  console.log("webSocket closed" , id )
};


