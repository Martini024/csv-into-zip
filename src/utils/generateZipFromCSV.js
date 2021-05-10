import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import isValidURL from './isValidURL'
import getFileExtension from './getFileExtension'

export default function generateZipFromCSV(
	csvFile,
	groupBy = 'ROW',
	urlColumns = [],
	folderNameStruct = [],
	fileNameStruct = [],
	separator = '_',
	zipFileName = 'file_bundle',
) {
	let zip = new JSZip()
	Papa.parse(csvFile, {
		download: true,
		header: true,
		complete: (results) => {
			const rows = results.data
			rows.forEach((row) => {
				urlColumns.forEach((column) => {
					if (isValidURL(row[column])) {
						const fileExtension = getFileExtension(row[column])
						let saveToZipRelativePath = ''
						switch (groupBy) {
							case 'ROW':
								const folderName = folderNameStruct
									.map((col) => (row[col] ? row[col] : 'null'))
									.join(separator)
								saveToZipRelativePath = `${zipFileName}/${folderName}/${column}.${fileExtension}`
								break
							case 'COLUMN':
								const fileName1 = fileNameStruct
									.map((col) => (row[col] ? row[col] : 'null'))
									.join(separator)
								saveToZipRelativePath = `${zipFileName}/${column}/${fileName1}.${fileExtension}`
								break
							default:
								break
						}
						zip.file(
							saveToZipRelativePath,
							new Promise(function (resolve, reject) {
								JSZipUtils.getBinaryContent(row[column], function (err, data) {
									if (err) {
										reject(err)
									} else {
										resolve(data)
									}
								})
							}),
							{
								binary: true,
								createFolders: true,
							},
						)
					}
				})
			})
			zip.generateAsync({ type: 'blob' }).then((content) => {
				saveAs(content, zipFileName)
			})
		},
	})
}
