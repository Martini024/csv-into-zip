import { useEffect } from 'react'
import csvFile from './wpforms-1222-Upload-Form-2021-05-10-11-58-46.csv'

import './App.css'

import logo from './logo.svg'
import getURLsFromCSV from './utils/getURLsFromCSV'
import { Button } from 'antd'
import 'antd/dist/antd.css'

function App() {
	const handleClick = () => {
		getURLsFromCSV(csvFile)
	}
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Batch download files from urls inside csv file.</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
				<Button type="primary" onClick={handleClick}>
					Generate Zip
				</Button>
			</header>
		</div>
	)
}

export default App
