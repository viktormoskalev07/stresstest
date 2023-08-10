import axios from "axios";
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
  console.log(tokenData.data.token);
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
  try {
    const deleteResponse = await loggedAxios.post("/user/delete-account/");
    console.log(deleteResponse.data);
  } catch (e) {
    console.log(e.message);
  }
};

app();
