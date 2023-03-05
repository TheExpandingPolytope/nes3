import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { useWeb3React } from '@web3-react/core'
import { hooks, metaMask } from './metaMask'
import { address as dappAddress } from '../../deployments/localhost/dapp.json'
import { abi as InputFacetAbi } from "../../deployments/localhost/InputFacet.json"
import { ethers } from 'ethers'
import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import axios from 'axios'


export const SERVER_URL = `http://localhost:3002`;
var instance = axios.create({baseURL: SERVER_URL })


// account is not optional
function getSigner(provider, account) {
  return provider.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(provider, account){
  return account ? getSigner(provider, account) : provider
}


function App() {
  const { chainId, provider, account } = useWeb3React()
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasVideo, setHasVideo] = useState(false);

  const contract = useMemo(
    () => {
      if (!chainId || !provider || !account) return null
      const signer = getSigner(provider, account)
      return new Contract(dappAddress, InputFacetAbi, signer)
    },
    [chainId, provider, account],
  )

  //attempt to connect eagerly on mount
  useEffect(() => {
    void metaMask.connectEagerly()
  }, [])  

  const inputRef = useRef(null);
  const linkUrl = useRef(null);

  const changeHandler = (event) => {
      if (event.target.files && event.target.files.length > 0) {
          setSelectedFile(event.target.files[0]);
      }
  };

  const handleSubmission = async () => {
    let file = selectedFile;
    var binary = new Uint8Array(await file.arrayBuffer());
    let result = await contract.addInput(binary)
  }

  //poll "/inspect/0xff" every 5 seconds for an mp4
  //once recieved download and set it to mp4 ref
  useEffect(() => {
    const interval = setInterval(() => {
      instance.get('/inspect/0xff').then((response) => {
        if (response.data) {
          setHasVideo(true);
          console.log(response.data)
          const hex_string = response.data.reports[0].payload;
          const bytes = new Uint8Array(hex_string.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
          const blob = new Blob([bytes], {type: 'video/mp4'});
          console.log(blob)
          linkUrl.current = URL.createObjectURL(blob);



        }
      })
    }, 5000);
    return () => clearInterval(interval);
  }, []);
    

  return (
    <div className="App">
      <h1>On-chain NES emulator</h1>
      <div className="card">
        {!account ? (
          <button
            style={{
              backgroundColor: '#61dafbaa',
            }}
            onClick={() => {metaMask.activate()}}>
            Connect 🦊
          </button>
        ) : (
          <>
            <input 
              type="file" 
              onChange={changeHandler} 
              ref={inputRef}
            />
            <button 
              style={{
                backgroundColor: '#61dafbaa',
              }}
              onClick={handleSubmission}
            >
              Send rom
            </button>
            {hasVideo && (
              <a href={linkUrl.current} download>Download video</a>
            )}
          </>
        )}
        <p>
          First connect your Web3 wallet, then send a rom to the contract.
        </p>
      </div>
      <p className="read-the-docs">
        <a href="https://github.com/Kevoot/NESalizer">An NES emulator</a> within the CTSI-Machine runs the ROM you submit for 30 seconds, then returns an mp4.
      </p>
    </div>
  )
}

export default App
