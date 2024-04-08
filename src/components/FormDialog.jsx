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

const FormDialog = () => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();
    const [amount, setAmount] = useState(0);

    async function handleDonateFunds() {
        if (!isSupportedChain(chainId)) return toast.error("Wrong network", {
          position: "top-center",
        });
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
    
        const contract = getDonationContract(signer);
      
          try {
            const tx = await contract.donate(amount);
            tx.wait()
            toast.success("Donation Successful", {
              position: "top-center",
            });
          } catch (err) {
            toast.error("Donation Failed", {
              position: "top-center",
            });
        }
    }

  return (
    <div>
        <Dialog.Root>
            <Dialog.Trigger>
                <button className="bg-[#00416A] rounded-full text-white py-4 px-10 font-bold border">Donate Funds</button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px">
                <Dialog.Title>Donate For a change.</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                Make a change, donate today.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                   Amount
                    </Text>
                    <TextField.Root
                    placeholder="Enter an amount"
                    onChange={(e) => setAmount(e.target.value)}
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
                    <Button onClick={handleDonateFunds}>Save</Button>
                </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
   
    </div>
  )
}

export default FormDialog