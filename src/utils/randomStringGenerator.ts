export function randomStringGenerator(num: number) {
	let text: string = '';

	for (let i = 0; i <= num; i++) {
		text += Math.random().toString(36).slice(-8);
	}

	return text;
}
