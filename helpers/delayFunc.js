export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
export const delayedFunctionCall = async (func, delayTime = 2000) => {
	await delay(delayTime)
	return await func()
}