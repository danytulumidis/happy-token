import Head from 'next/head'
import InfoCard from '../components/InfoCard'
import { useEffect, useRef, useState } from "react";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Web3Modal from "web3modal";
import { HAPPY_TOKEN_ADDRESS, abi } from "../constants";

export default function Home() {
  const zero = BigNumber.from(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [numberOfTokens, setNumberOfTokens] = useState(zero);
  const [maximalTokenSuppy, setMaximalTokenSuppy] = useState(0);

  const web3ModalRef = useRef();

  // Mint new Tokens
  const mintTokens = async () => {
    try {
      const provider = await getProviderSigner();
  
      const contract = new Contract(
        HAPPY_TOKEN_ADDRESS,
        abi,
        provider
      );
  
      const signer = await getProviderSigner(true);
      const address = await signer.getAddress();
  
      const tx = await contract.mint(address, ethers.utils.parseEther("1"));
  
      await tx.wait();
    } catch (error) {
      // TODO: Handle error
      console.log(error);
    }
  };

  // Get Token Balance from the User
  const getTokenBalance = async () => {
    try {
      const provider = await getProviderSigner();

      const contract = new Contract(
        HAPPY_TOKEN_ADDRESS,
        abi,
        provider
      );

      const signer = await getProviderSigner(true);
      const address = await signer.getAddress();

      const balance = await contract.balanceOf(address);
      console.log(balance);
      setNumberOfTokens(balance);
    } catch (error) {
      // TODO: Handle error
      console.log(error);
    }
    
  };
  
  // Get the Provider or Signer to interact with the Blockchain
  const getProviderSigner = async (isSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      // Since the Contract lives currently on the Rinkeby test network, make sure user is connected to Rinkeby
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 4) {
        console.log(chainId);
        window.alert("Please connect to the Rinkeby test network");
        throw new Error("Please change to the Rinkeby test network");
      }

      if (isSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }

      return web3Provider;
    } catch (error) {
      // TODO: Handle error
      console.log(error);
    }
    
  };

  // Connect User Wallet
  const connectWallet = async () => {
    try {
      await getProviderSigner();
      setWalletConnected(true);
    } catch(error) {
      console.log(error);
    }
  };

  // Based on walletConnected, check if user has connected their wallet
  // Runs when walletConnected changes
  useEffect(() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getTokenBalance();
    }
  },[walletConnected]);

  return (
    <div className="bg-gradient-to-t from-slate-700 to-gray-900 text-white">
      <Head>
          <title>Happy Token</title>
          <meta name="description" content="Mint some Happy Token and enjoy life" />
          <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-around items-center min-h-screen">
        
        <h1 className="text-9xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-violet-500">Happy Token</h1>
        <p className="text-4xl text-glow">Mint some Happy Tokens, enjoy life and put on your biggest smile!</p>
        <button className="px-9 py-5 text-2xl text-orange-600 font-semibold border border-orange-200 hover:text-white hover:bg-orange-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition hover:-translate-y-2 duration-300 ease-in-out hover:scale-100">Mint Token</button>
        <div className="flex flex-row gap-10">
          <InfoCard info="Amount of your Happy Tokens" tokenAmount={utils.formatEther(numberOfTokens) / 1}/>
          <InfoCard info="Tokens Liquidity" tokenAmount={15}/>
          <InfoCard info="Maximum of Tokens" tokenAmount={100}/>
        </div>
      </main>

      <footer></footer>
    </div>
  )
}
