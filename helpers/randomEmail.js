export const randomEmail = () => {
  let num = Math.floor(Math.random() * 100000) + 1
  const random = num.toString(16)
  return "ttestUser" + random + new Date().getTime() + "lul@kek.mek"
}
