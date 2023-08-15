import fs from 'fs'

export const saveToFile = (fileName, string) => {
	fs.appendFileSync(fileName, string + '\n');
}