import {showLogs} from "../index.js";

export const changeUsername = async (instanceUser, newUsername) => {
    try {
      const changeUserResponse = await instanceUser.post("/user/change-username/", {
        username: newUsername,
      });
      
      showLogs&& console.log(changeUserResponse.data ,`/user/change-username/` )
      return changeUserResponse
    } catch (error) {
        console.error(e.message , e?.response?.data,"change-username")
    }
  };

  