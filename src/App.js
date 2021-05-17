import logo from './logo.svg'
import { useState } from 'react'
import { GithubOutlined } from '@ant-design/icons'
import { Space, Button, Progress, Row, Typography, message } from 'antd'

import './App.css'
import 'antd/dist/antd.css'
import GenerateZip from './components/GenerateZip/index'
import getFileName from './utils/getFileName'

const { Paragraph } = Typography

function App() {
	const [loading, setLoading] = useState(false)
	const [percent, setPercent] = useState(0)

	const onUpdate = ({ percent }) => {
		setPercent(percent.toFixed(2))
	}

	const onStartDownload = () => {
		setLoading(true)
	}
	const onFinishDownload = () => {
		setLoading(false)
		message.info('Generate Zip Successfully!')
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Batch download files from urls inside csv file.</p>
				<Space direction="vertical">
					<GenerateZip
						onStartDownload={onStartDownload}
						onUpdate={onUpdate}
						onFinishDownload={onFinishDownload}
					/>
					{loading && (
						<div style={{ width: '400px' }}>
							<Progress percent={percent} size="small" status="active" />
						</div>
					)}
					<Button
						type="link"
						size="large"
						href="https://github.com/Martini024/csv-into-zip"
						target="_blank"
						rel="noopener noreferrer"
					>
						<GithubOutlined />
						CSV into Zip
					</Button>
				</Space>
			</header>
		</div>
	)
}

export default App
