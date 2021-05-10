import Papa from 'papaparse'

export default function getCSVColumns(csvFile) {
	return new Promise((complete, error) => {
		Papa.parse(csvFile, {
			preview: 1,
			complete: (results) => {
				complete(results.data?.[0])
			},
			error,
		})
	})
}
