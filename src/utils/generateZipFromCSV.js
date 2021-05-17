import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import Papa from 'papaparse'
import getFileName from './getFileName'
import isValidURLArray from './isValidURLArray'

export default function generateZipFromCSV(
	csvFile,
	groupBy = 'ROW',
	urlColumns = [],
	folderNameStruct = [],
	separator = '_',
	zipFileName = 'file_bundle',
	onUpdate = () => {},
	onFinishDownload = () => {},
) {
	let zip = new JSZip()
	Papa.parse(csvFile, {
		download: true,
		header: true,
		complete: (results) => {
			const rows = results.data
			rows.forEach((row) => {
				urlColumns.forEach((column) => {
					let urlArray = row[column]?.split('\n')
					if (isValidURLArray(urlArray)) {
						urlArray.forEach((url) => {
							const folderName = folderNameStruct
								.map((col) => (row[col] ? row[col] : 'null'))
								.join(separator)
							const fileName = getFileName(url)
							let saveToZipRelativePath = ''
							switch (groupBy) {
								case 'ROW':
									saveToZipRelativePath = `${zipFileName}/${folderName}/${column}/${fileName}`
									break
								case 'COLUMN':
									saveToZipRelativePath = `${zipFileName}/${column}/${folderName}/${fileName}`
									break
								default:
									break
							}
							zip.file(
								saveToZipRelativePath,
								new Promise(function (resolve, reject) {
									JSZipUtils.getBinaryContent(url, function (err, data) {
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
						})
					}
				})
			})
			zip.generateAsync({ type: 'blob' }, onUpdate).then((content) => {
				onFinishDownload()
				saveAs(content, zipFileName)
			})
		},
	})
}
