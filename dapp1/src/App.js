import "./App.css";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";
import Web3 from "web3";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [acc, setAcc] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, setReload] = useState(false);
  const loadeff = () => setReload(!reload);
  useEffect(() => {
    const load = async () => {
      const provider = await detectEthereumProvider();

      const contract1 = await loadContract("Funder", provider);
      console.log(window.web3);
      console.log(window.ethereum);
      if (provider) {
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract: contract1,
        });
      } else {
        // if the provider is not detected, detectEthereumProvider resolves to null
        console.error("Please install MetaMask!");
      }
      // let provider = null;
      // if (window.ethereum) {
      //   provider = window.ethereum;

      //   try {
      //     await provider.enable();
      //   } catch {
      //     console.error("user is not allowed");
      //   }
      // } else if (window.web3) {
      //   provider = window.currentProvider;
      // } else if (!process.env.production) {
      //   provider = new Web3.provider.HttpProvider("http://localhost:7545");
      // }
    };
    load();
    console.log("web3Api", web3Api);
  }, []);
  useEffect(() => {
    const getAcc = async () => {
      const acc1 = await web3Api.web3.eth.getAccounts();
      setAcc(acc1[0]);
    };
    web3Api.web3 && getAcc();
  }, [web3Api.web3, reload]);
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      console.log("contract.adress", web3Api.contract);
      console.log("contract.adressdcdcds", web3Api.contract.address);
      const balance = await web3.eth.getBalance(web3Api.contract.address);
      // setBalance(balance)
      setBalance(web3.utils.fromWei(balance, "ether"));
      console.log("balance", balance);
      console.log("balance", web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api.web3, reload]);

  const transferFund = async () => {
    const { contract, web3 } = web3Api;
    await contract.transfer({
      from: acc,
      value: web3.utils.toWei("2", "ether"),
    });
    loadeff();
  };

  const withFund = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmout = web3.utils.toWei("2", "ether");
    console.log("contract", contract);
    await contract.withDraw(withdrawAmout, {
      from: acc,
    });
    loadeff();
  };
  return (
    <div className="App">
      hey
      {/* this is how we connect our metamask to browser's frontend */}
      <button
        onClick={async () => {
          const acc = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log(acc);
        }}
      >
        connact to metamask
      </button>
      <button onClick={() => transferFund()}>transfer</button>
      <button onClick={() => withFund()}>with</button>
      {balance}
      <p>{acc ? acc : "not connected"}</p>
    </div>
  );
}

export default App;
