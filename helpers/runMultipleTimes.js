export const runMultipleTimes = async (fn, times) => {
	let counter = times;
	let page = 1;

	while (counter > 0) {
		if (page <= 2) {
			await fn(page);
		} else {
			page = 1;
		}

		counter--;
		page++;
		await new Promise(resolve => setTimeout(resolve, 50));
	}
};