export default function dateToUnix(date) {
	return Date.parse(date) / 1000;
	// parseInt((new Date(date).getTime() / 1000).toFixed(0));
}
