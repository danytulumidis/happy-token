import Head from 'next/head'
import InfoCard from '../components/InfoCard'
import { useEffect, useRef, useState } from "react";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Web3Modal from "web3modal";
import { HAPPY_TOKEN_ADDRESS, abi } from "../constants";
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const zero = BigNumber.from(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [amountToMint, setAmountToMint] = useState(0);
  const [numberOfTokens, setNumberOfTokens] = useState(zero);
  const [tokenLiquidity, setTokenLiquidity] = useState(zero);
  const [maximalTokenSuppy, setMaximalTokenSuppy] = useState(zero);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const web3ModalRef = useRef();

  const handleError = (error) => {
    setError(error.message);
    setTimeout(() => {
      setError("");
    }, 5000);
  }

  // Mint new Tokens
  const mintTokens = async () => {
    try {
      const provider = await getProviderSigner(true);
  
      const contract = new Contract(
        HAPPY_TOKEN_ADDRESS,
        abi,
        provider
      );
  
      const signer = await getProviderSigner(true);
      const address = await signer.getAddress();
  
      const tx = await contract.mint(address, ethers.utils.parseEther(amountToMint.toString()));
      
      setIsLoading(true);
      await tx.wait();

      await getTokenBalance();
      await getTokenLiquidity();

      setIsLoading(false);
      
      setAmountToMint(0);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      handleError(error);
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
      setNumberOfTokens(balance);
    } catch (error) {
      handleError(error);
    }
  };

  // Get Tokens current Liquidity
  const getTokenLiquidity = async () => {
    try {
      const provider = await getProviderSigner();
  
      const contract = new Contract(
        HAPPY_TOKEN_ADDRESS,
        abi,
        provider
      );
  
      const liquidity = await contract.totalSupply();
      setTokenLiquidity(liquidity);
    } catch (error) {
      handleError(error);
    }
  };

  // Get Maximal Token Supply
  const getMaximalTokenSupply = async () => {
    try {
      const provider = await getProviderSigner();
  
      const contract = new Contract(
        HAPPY_TOKEN_ADDRESS,
        abi,
        provider
      );
  
      const supply = await contract.maxSupply();
      setMaximalTokenSuppy(supply);
    } catch (error) {
      handleError(error);
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
        throw new Error("Please change to the Rinkeby test network");
      }

      if (isSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }

      return web3Provider;
    } catch (error) {
      handleError(error);
    }
    
  };

  // Connect User Wallet
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      await getProviderSigner();
      setWalletConnected(true);
      setIsLoading(false);
    } catch(error) {
      handleError(error);
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
      getTokenLiquidity();
      getMaximalTokenSupply();
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
        
        <h1 className="text-9xl pb-2 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-violet-500">Happy Token</h1>
        <p className="text-4xl text-glow">Mint some <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-violet-500">Happy Tokens</span>, enjoy life and put on your biggest smile!</p>
        <div className="flex flex-row gap-4">
          <input type="number" value={amountToMint} onChange={(e) => setAmountToMint(e.target.value)} className="text-4xl w-24 gradient-border shadow-inner" max={10}></input>
          <button onClick={() => mintTokens(amountToMint)} className="px-9 py-5 text-2xl text-orange-600 font-semibold border border-orange-200 hover:text-white hover:bg-orange-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 transition hover:-translate-y-2 duration-300 ease-in-out hover:scale-100 shadow-inner shadow-slate-50/50">Mint Token</button>
        </div>
        {
          isSuccess &&
          <div className="border-2 border-green-600 py-2 px-2 shadow-inner shadow-slate-400">
            <p className="text-green-600 text-2xl">Success! Enjoy your Happy Tokens!</p>
          </div>
        }
        {
          error &&
          <div className="border-2 border-red-600 py-2 px-2 shadow-inner shadow-slate-400 w-2/4 mx-auto">
            <p className="text-red-600 text-2xl overflow-hidden">{error}</p>
          </div>
        }
        {
          isLoading ? <LoadingSpinner /> :
          <div className="flex flex-row gap-10">
            <InfoCard info="Amount of your Happy Tokens" tokenAmount={utils.formatEther(numberOfTokens) / 1}/>
            <InfoCard info="Tokens Liquidity" tokenAmount={utils.formatEther(tokenLiquidity) / 1}/>
            <InfoCard info="Maximum of Tokens" tokenAmount={utils.formatEther(maximalTokenSuppy) / 1}/>
          </div>
        }
      </main>

      <footer className="absolute inset-x-0 bottom-0">
        <p className="font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-violet-500 max-w-full w-80 mx-auto text-center">Made with &#10084; by Dany Tulumidis</p>
      </footer>
    </div>
  )
}
