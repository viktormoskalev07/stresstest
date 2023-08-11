import axios from "axios";
import WebSocket from 'ws';
// const baseUrl = "https://duel-api.smart-ui.pro";
const baseUrl = "https://api.duelmasters.io";
// const frontendUrl ="https://duel-master-git-duelmasters-old-api-config-duelmastersgg-s-team.vercel.app/"
const frontendUrl ="https://www.duelmasters.io/"
let token = {};


export const app = async (id) => {
    console.log("app started" + id)
    const loggedAxios = axios.create({
    baseURL: baseUrl + "/api/v0",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  let num = Math.floor(Math.random() * 100000) + 1;
  const random = num.toString(16);
  const email = "testUser" + random + "lul@kek.mek";
 let tokenData

  try{
    tokenData = await axios.post(baseUrl + "/api/v0/auth/base/signup/", {
      email,
      password: "2222",
      password_repeat: "2222",
      accept: true,
    });
    console.log(tokenData.data.token)
  } catch (e){
    console.log(e.message ,  "sign")
    return
  }


  // connect webSocket
  const wsUrl = baseUrl.replace('http', 'ws');
  const webSocket = new WebSocket(`${wsUrl}/ws?token=${tokenData.data.token}`)

  webSocket.onopen = () => {
    console.log('socket connected')
  }

  webSocket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log('web socket --- ', data.action)
  };

  webSocket.onerror = (error) => {
    console.log('web socket error: ', error?.detail)
    webSocket?.close();
  }

  loggedAxios.interceptors.request.use((config) => {
    if (tokenData.data.token) {
      config.headers.Authorization ="Token "+ tokenData.data.token;
    } else {
      console.log("NO TOKEN" );
    }
    return config;
  });

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  const delayedFunctionCall = async (func, delayTime = 1000) => {
    await delay(delayTime)
    return await func()
  }
  const createGame = async () => {
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
      const createGameResponse = await loggedAxios.patch(`/user/set-ready-to-play/${xpOrCash}/`, body);
      console.log(createGameResponse.data , "create game")
    } catch (e) {
      console.log(e.message)
    }
  };

  const delay2 = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const del =1;
  const sendMessage = async () => {
    for(let i = 0; i < 15; i++) {
      try {
        await delay2(1000*del);
        const sendMessageResponse2 = await loggedAxios.post(`/chats/${1053}/send-message/`, {
          text: 'I am spam bot i am testing a website',
          type: 'default',
        });
        await delay2(1000*del); // Задержк
        try {
         const userInfo =  await loggedAxios.get( "/user/info/");
          console.log(" message from " , userInfo.data.id ,"num ",  i  )
          console.log('== visited matchfinder')
        } catch (e) {
          console.log(e.message)
        }
        console.log(i)
      } catch (e) {
        console.log(e.message);
      }
    }
  };



  const goToHomePage = async () => {
    try {
      await axios.get(frontendUrl);
      console.log('== visited home page')
    } catch (e) {
      console.log(e.message , "home")
    }
  }

  const goToMatchfinder = async () => {
    try {
      await axios.get(frontendUrl+"/matchfinder");
      console.log('== visited matchfinder')
    } catch (e) {
      console.log(e.message , "match")
    }
  }

  const unsubscribeEmail = async () => {
    try {
      const unsubscribeResponse = await loggedAxios.post(`/emails/unsubscribe/`);
      console.log(unsubscribeResponse.data ,`/emails/unsubscribe/` )
    } catch (e) {
      console.log(e.message)
    }
  }

  const deleteAcc = async () => {
    try {
      const deleteResponse = await loggedAxios.post("/user/delete-account/");
      console.log(deleteResponse.data, " /user/delete-account/");
    } catch (e) {
      console.log(e.message);
    }
  }


  //unsubscribe
  await delayedFunctionCall(unsubscribeEmail)

  //go to home page
  await delayedFunctionCall(goToHomePage)

  //go to matchfinder
  await delayedFunctionCall(goToMatchfinder)
  console.log('== start create game')
  await delayedFunctionCall(createGame , 5000)
  //send message
  console.log('== start send message')
  await delayedFunctionCall(sendMessage , 5000)

  //create game

  webSocket.close(1000);
  // delete account
  await delayedFunctionCall(deleteAcc,1000*60)
};


