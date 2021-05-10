import React, { useState, useEffect } from 'react'
import { Button, Form, Modal, Input, Select } from 'antd'
import generateZipFromCSV from '../../utils/generateZipFromCSV'
import getCSVColumns from '../../utils/getCSVColumns'

export default function GenerateZip() {
	const [form] = Form.useForm()
	const [csvFile, setCSVFile] = useState(null)
	const [visible, setVisible] = useState(false)
	const [columns, setColumns] = useState([])

	const showModal = () => setVisible(true)
	const hideModal = () => {
		setVisible(false)
		form.resetFields()
	}

	const onOk = () => {
		onFinish()
		hideModal()
	}

	const onCancel = () => hideModal()

	const onFinish = () => {
		const value = form.getFieldsValue()
		const {
			csvFile,
			groupBy,
			urlColumns,
			folderNameStruct,
			fileNameStruct,
			separator,
			zipFileName,
		} = value
		generateZipFromCSV(
			csvFile,
			groupBy,
			urlColumns,
			folderNameStruct,
			fileNameStruct,
			separator,
			zipFileName,
		)
	}

	useEffect(() => {
		if (csvFile) {
			getCSVColumns(csvFile).then((columns) => {
				setColumns(columns.map((column) => ({ label: column, value: column })))
			})
		}
	}, [csvFile])

	return (
		<>
			<Button type="primary" onClick={showModal}>
				Generate Zip
			</Button>
			<Modal
				visible={visible}
				maskClosable={false}
				title="Generate Zip"
				onOk={onOk}
				onCancel={onCancel}
			>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item
						label="CSV File"
						name="csvFile"
						valuePropName="file"
						getValueFromEvent={(e) => (e.target.files ? e.target.files[0] : null)}
						required
					>
						<Input
							type="file"
							onChange={(e) => setCSVFile(e.target.files ? e.target.files[0] : null)}
						/>
					</Form.Item>
					<Form.Item label="Group By" name="groupBy" initialValue="ROW" required>
						<Select
							options={[
								{
									label: 'Row',
									value: 'ROW',
								},
								{
									label: 'Column',
									value: 'COLUMN',
								},
							]}
						/>
					</Form.Item>
					<Form.Item label="URL Columns" name="urlColumns" required>
						<Select mode="multiple" options={columns} />
					</Form.Item>
					<Form.Item
						noStyle
						shouldUpdate={(prev, curr) => {
							return prev.groupBy !== curr.groupBy
						}}
					>
						{({ getFieldValue }) => (
							<>
								{getFieldValue('groupBy') === 'ROW' && (
									<Form.Item
										label="Folder Name Structure"
										name="folderNameStruct"
										required
									>
										<Select mode="multiple" options={columns} />
									</Form.Item>
								)}
								{getFieldValue('groupBy') === 'COLUMN' && (
									<Form.Item
										label="File Name Structure"
										name="fileNameStruct"
										required
									>
										<Select mode="multiple" options={columns} />
									</Form.Item>
								)}
							</>
						)}
					</Form.Item>
					<Form.Item label="Separator" name="separator" initialValue="_" required>
						<Input type="text" maxLength="1" />
					</Form.Item>
					<Form.Item label="Zip File Name" name="zipFileName" required>
						<Input type="text" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	)
}