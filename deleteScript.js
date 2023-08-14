import axios from "axios"
import fs from 'fs'
import {delay} from "./delayFunc.js";

const baseUrl = "https://duel-api.smart-ui.pro"

const createDeleteInstance = (token) => {
	return axios.create({
		baseURL: baseUrl + "/api/v0",
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			Authorization: "Token " + token
		},
	});
}

export const removeTokenFromFile = (tokenToRemove) => {
	const tokens = fs.readFileSync('tokens.txt', 'utf-8').split('\n');
	const updatedTokens = tokens.filter(token => token !== tokenToRemove)
	fs.writeFileSync('tokens.txt', updatedTokens.join('\n'))
};

const deleteUsers = async () => {
	const tokens = fs.readFileSync('tokens.txt', 'utf-8').split('\n').filter(token => token)

	for (let token of tokens) {
		const instance = createDeleteInstance(token)
		try {
			const deleteScriptResponse = await instance.post('/user/delete-account/')
			console.log(deleteScriptResponse.data, `token - ${token}`)
			removeTokenFromFile(token)
		} catch (error) {
			console.error(`Failed to delete user with token ${token}, ${error.message}`)
		}

		await delay(2000)
	}
}

await deleteUsers()