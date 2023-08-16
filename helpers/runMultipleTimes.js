export const runMultipleTimes = (fn, times) => {
	return new Promise((resolve) => {
		let counter = times;
		let page = 1

		const intervalId = setInterval(async () => {
			if (counter <= 0) {
				clearInterval(intervalId);
				resolve();
				return;
			}

			if (page <= 2) {
				await fn(page)
			} else {
				page = 1
			}
			counter--;
		}, 100);
	});
};
