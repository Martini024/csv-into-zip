import logo from './logo.svg'
import { GithubOutlined } from '@ant-design/icons'
import { Space, Button } from 'antd'

import './App.css'
import 'antd/dist/antd.css'
import GenerateZip from './components/GenerateZip/index'

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Batch download files from urls inside csv file.</p>
				<Space direction="vertical">
					<GenerateZip />
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
