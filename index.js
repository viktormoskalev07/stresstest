import axios from "axios";
import WebSocket from 'ws';
const baseUrl = "https://duel-api.smart-ui.pro";

let token = {};
export const loggedAxios = axios.create({
  baseURL: baseUrl + "/api/v0",
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
});


const app = async () => {
  let num = Math.floor(Math.random() * 100000) + 1;
  const random = num.toString(16);
  const email = "testIvan" + random + "lul@kek.mek";
  const tokenData = await axios.post(baseUrl + "/api/v0/auth/base/signup/", {
    email,
    password: "2222",
    password_repeat: "2222",
    accept: true,
  });
  console.log(tokenData.data.token)

  // connect webSocket
  const wsUrl = baseUrl.replace('http', 'ws');
  const webSocket = new WebSocket(`${wsUrl}/ws?token=${tokenData.data.token}`)

  webSocket.onopen = () => {
    console.log('socket connected')
  }

  webSocket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log('web socket --- ', data)
  };

  webSocket.onerror = (error) => {
    console.log('web socket error: ', error)
    webSocket?.close();
  }

  loggedAxios.interceptors.request.use((config) => {
    console.log(123);
    if (tokenData.data.token) {
      console.log(234)
      config.headers.Authorization ="Token "+ tokenData.data.token;
    } else {
      console.log("NO TOKEN");
    }
    return config;
  });

  //unsubscribe
  await delayedFunctionCall(unsubscribeEmail)

  //go to home page
  await delayedFunctionCall(goToHomePage)

  //go to matchfinder
  await delayedFunctionCall(goToMatchfinder)

  //send message
  console.log('== start send message')
  await delayedFunctionCall(sendMessage)

  //create game
  console.log('== start create game')
  await delayedFunctionCall(createGame)

  // delete account
  await delayedFunctionCall(deleteAcc)
};

app();


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const delayedFunctionCall = async (func, delayTime = 1000) => {
  await delay(delayTime)
  return await func()
}

const sendMessage = async () => {
  try {
    const sendMessageResponse = await loggedAxios.post('/chats/551/send-message/', {
      text: 'hi',
      type: 'default',
    })
    console.log(sendMessageResponse.data)
  } catch (e) {
    console.log(e.message)
  }
};

const createGame = async () => {
  const xpOrCash = 'xp'
  const body = {
    games: [
      {game: "fifa23_new", bid: 18},
      {game: "fifa23_old", bid: 0},
      {game: "mw2_console", bid: 0},
      {game: "mw2_pc", bid: 0},
      {game: "dota", bid: 0},
      {game: "csgo", bid: 0},
    ],
    ready_to_play: true
  }
  try {
    const createGameResponse = await loggedAxios.patch(`/user/set-ready-to-play/${xpOrCash}/`, body);
    console.log(createGameResponse.data)
  } catch (e) {
    console.log(e.message)
  }
};

const goToHomePage = async () => {
  try {
    await loggedAxios.get(`https://duel-master-git-develop-duelmastersgg-s-team.vercel.app/home`);
    console.log('== visited home page')
  } catch (e) {
    console.log(e.message)
  }
}

const goToMatchfinder = async () => {
  try {
    await loggedAxios.get(`https://duel-master-git-develop-duelmastersgg-s-team.vercel.app/matchfinder`);
    console.log('== visited matchfinder')
  } catch (e) {
    console.log(e.message)
  }
}

const unsubscribeEmail = async () => {
  try {
    const unsubscribeResponse = await loggedAxios.post(`/emails/unsubscribe/`);
    console.log(unsubscribeResponse.data)
  } catch (e) {
    console.log(e.message)
  }
}

const deleteAcc = async () => {
  try {
    const deleteResponse = await loggedAxios.post("/user/delete-account/");
    console.log(deleteResponse.data);
  } catch (e) {
    console.log(e.message);
  }
}
