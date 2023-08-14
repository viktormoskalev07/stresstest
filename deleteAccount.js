export const deleteAccount = async (instanceUser) => {
	try {
		const deleteResponse = await instanceUser.post("/user/delete-account/");
		console.log(deleteResponse.data, " /user/delete-account/");
	} catch (e) {
		console.log(e.message);
	}
}