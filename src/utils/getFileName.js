export default function getFileName(url, withExtension = true) {
	const fileNameWithExtension = url.split('/').pop()
	if (withExtension) return fileNameWithExtension
	else {
		return fileNameWithExtension.split('.').slice(0, -1).join('.')
	}
}
