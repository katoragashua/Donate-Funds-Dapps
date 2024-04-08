import { configWeb3Modal } from "./wallet-connection"
import FormDialog from "./components/FormDialog";
import UserBalance from "./components/UserBalance";
import { getProvider } from "./constants/providers";
import { getDonationContract } from "./constants/contracts";
import { isSupportedChain } from "./utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

configWeb3Modal();

function App() {
  const { chainId } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [totalBalance, setTotalBalance] = useState(0)

  async function handleTotalBalance() {
      if (!isSupportedChain(chainId)) return toast.error("Wrong network", {
        position: "top-center",
      });
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
  
      const contract = getDonationContract(signer);
    
        try {
          const tx = await contract.getTotalBalance();
          setTotalBalance(Number(tx))
          toast.success("Balance check Successful", {
            position: "top-center",
          });
        } catch (err) {
          toast.error("`${err.message}`", {
              position: "top-center",
          });
      }
  }

    async function handleWithdraw() {
      if (!isSupportedChain(chainId)) return toast.error("Wrong network", {
        position: "top-center",
      });
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();

      const contract = getDonationContract(signer);
    
        try {
          const tx = await contract.withdraw();
          setTotalBalance(Number(tx))
          toast.success("Withdraw Successful", {
            position: "top-center",
          });
        } catch (err) {
          toast.error("Not authorized - only owner can withdraw", {
              position: "top-center",
          });
      }
  }

  return (  
      <main className="relative lg:h-[100vh] h-auto max-w-[1440px] mx-auto">
        <section style={{ backgroundImage: 'url(https://images.pexels.com/photos/6647122/pexels-photo-6647122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)'}} className="bg-cover bg-center lg:h-[85vh] md:h-[85vh] h-[95vh] w-[100%] p-6 flex bg-[#262626] bg-blend-overlay bg-no-repeat ">
        <header className="flex  mb-auto justify-between items-center absolute w-[100%] p-8">
          <img src="https://img.freepik.com/free-vector/realistic-cardano-coin-illustration_52683-78384.jpg?size=626&ext=jpg&ga=GA1.1.1207199826.1690666781&semt=ais" alt="" className="w-[70px] rounded-full"/>
        <w3m-button />
      </header>
      <div className="m-auto lg:w-[50%] md:w-[70%] w-[100%] text-center text-white">
        <h1 className="lg:text-[3rem] md:text-[2.5rem] text-[1.5rem] my-4 font-black"> Make a Difference with Ease.</h1>
        <p>Seamlessly connect with charitable causes</p>
        <p className="mb-4">Explore transparent donation tracking, real-time impact updates, and secure blockchain transactions, ensuring your contributions reach those in need. Join a community of philanthropists and leverage the efficiency of decentralized technology to support meaningful causes worldwide. </p>
      <FormDialog />
      </div>
        </section>
        <section className="w-[80%] mx-auto bg-white rounded-lg p-8 absolute lg:bottom-8 md:bottom-8 transform lg:-translate-x-1/2 md:-translate-x-1/2 -translate-x-1/2 lg:translate-y-1/2 md:translate-y-1/2 border left-1/2 flex flex-col lg:flex-row md:flex-row justify-between">
          <div className="lg:border-r md:border-r p-2 lg:w-[32%] md:w-[32%] w-[100%] text-center">
          <h2 className="font-black my-2">Get user balance</h2>
          <UserBalance />
          </div>
          <div className="lg:border-r md:border-r p-2 lg:w-[32%] md:w-[32%] w-[100%] text-center">
          <h2 className="font-black my-2">Get total balance</h2>
          <button className="bg-[#00416A] rounded-full text-white py-2 px-10 font-bold" onClick={handleTotalBalance}>Get Total Balance</button>
          <p>Total Balance: {totalBalance}</p>
          </div>
          <div className="p-2 lg:w-[32%] md:w-[32%] w-[100%] text-center">
          <h2 className="font-black my-2">Withdraw</h2>
          <button className="bg-[#00416A] rounded-full text-white py-2 px-10 font-bold" onClick={handleWithdraw}>Withdraw</button>
          </div>
        </section>
      </main>
  )
}

export default App
