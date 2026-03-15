// fonction pour mélanger
export default function shuffleArray(array: (number | string | undefined)[]) {
	let i = array.length;
	while (i) {
		const j = Math.floor(Math.random() * i--);
		[array[i], array[j]] = [array[j], array[i]];
	}
}