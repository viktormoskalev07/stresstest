import { delayedFunctionCall } from "../helpers/delayFunc.js"


export async function performDataRequests(instanceUser1, instanceUser2) {
  const dataEndpoints = [
    { user: instanceUser1, endpoint: "/user/info/", logMessage: "userInfo" },
    { user: instanceUser2, endpoint: "/user/info/", logMessage: "userInfo" },
    { user: instanceUser1, endpoint: "/chats/unread/", logMessage: "unreadChats" },
    { user: instanceUser2, endpoint: "/chats/unread/", logMessage: "unreadChats" },
    { user: instanceUser1, endpoint: "/rooms/invitations/", logMessage: "roomsInvitations" },
    { user: instanceUser2, endpoint: "/rooms/invitations/", logMessage: "roomsInvitations" },
  ];

  for (const { user, endpoint, logMessage } of dataEndpoints) {
    await delayedFunctionCall(async () => await user(endpoint), 1, logMessage);
  }
}
