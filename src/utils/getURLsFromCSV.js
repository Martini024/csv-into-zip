import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'
import isValidURL from './isValidURL'
import getFileExtension from './getFileExtension'

export default function getURLsFromCSV(
	csvFile,
	groupBy = 'ROW',
	urlColumns = [
		'My Award Photo Submission',
		'My Best SuperHero Pose Photo Submission',
		'My Video Submission',
	],
	folderNameStruct = ['Entry ID', 'Given Name', 'First Name', 'Email Address'],
	fileNameStruct = [],
	separator = '_',
	zipFileName = 'CF - Upload Form',
) {
	let zip = new JSZip()
	switch (groupBy) {
		case 'ROW':
			Papa.parse(csvFile, {
				download: true,
				header: true,
				complete: (results) => {
					const rows = results.data
					rows.forEach((row) => {
						// 1. Generate folder name
						const folderName = folderNameStruct
							.map((col) => (row[col] ? row[col] : 'null'))
							.join(separator)
						urlColumns.forEach((column) => {
							if (isValidURL(row[column])) {
								const fileExtension = getFileExtension(row[column])
								const fileName = `${zipFileName}/${folderName}/${column}.${fileExtension}`
								zip.file(
									fileName,
									new Promise(function (resolve, reject) {
										JSZipUtils.getBinaryContent(
											row[column],
											function (err, data) {
												if (err) {
													reject(err)
												} else {
													resolve(data)
												}
											},
										)
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
						console.log(content)
						saveAs(content, zipFileName)
					})
				},
			})
			break
		case 'COLUMN':
			Papa.parse(csvFile, {
				download: true,
				header: false,
				complete: (input) => {
					const records = input.data
					console.log(records[0])
				},
			})
			break
		default:
			break
	}
}
