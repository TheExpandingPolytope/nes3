import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { metaMask, hooks as metaMaskHooks  } from './metaMask';


import { Web3ReactProvider } from "@web3-react/core";

const connectors = [
  [metaMask, metaMaskHooks],
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <Web3ReactProvider connectors={connectors}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Web3ReactProvider>
)
