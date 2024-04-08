import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes"
import { getProvider } from '../constants/providers';
import { getDonationContract } from "../constants/contracts";
import { isSupportedChain } from "../utils";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserBalance = () => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const [address, setAddress] = useState("");
    const [userBalance, setUserBalance] = useState("")

    async function handleGetUserBalance() {
        if (!isSupportedChain(chainId)) return toast.error("Wrong network", {
          position: "top-center",
        });
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
    
        const contract = getDonationContract(signer);
      
          try {
            const tx = await contract.getUserBalances(address);
            setUserBalance(Number(tx))
        
            toast.success("Balance check Successful", {
              position: "top-center",
            });
          } catch (err) {
            toast.error(`${err.message}`, {
                position: "top-center",
            });
        }
    }

  return (
    <div>
        <Dialog.Root>
            <Dialog.Trigger>
                <button className="bg-[#00416A] rounded-full text-white py-2 px-10 font-bold">Get Balance</button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Get User Balance</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                Check how much you have donated.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                   Address
                    </Text>
                    <TextField.Root
                    placeholder="Enter an address"
                    onChange={(e) => setAddress(e.target.value)}
                    />
                </label>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                    <Button variant="soft" color="gray">
                    Cancel
                    </Button>
                </Dialog.Close>
                <Dialog.Close>
                    <Button onClick={handleGetUserBalance}>Save</Button>
                </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root> 
        <p>User balance: {userBalance}</p>
    </div>
  )
}

export default UserBalance