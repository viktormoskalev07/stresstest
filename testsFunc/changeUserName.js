import {showLogs} from "../index.js";

export const changeUsername = async (instanceUser) => {
    try {
      const changeUserResponse = await instanceUser.post("/user/change-username/", {
        username: randomEmail(),
      });
      
      showLogs&& console.log(changeUserResponse.data ,`/user/change-username/` )
      return changeUserResponse
    } catch (error) {
        console.error(e.message , e?.response?.data,"change-username")
    }
  };
