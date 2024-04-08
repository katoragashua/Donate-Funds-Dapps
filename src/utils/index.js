import { SUPPORTED_CHAIN } from "../wallet-connection";
import { getDonationContract } from "../constants/contracts";
import { getProvider } from "../constants/providers";

export const isSupportedChain = (chainId) =>
    Number(chainId) === SUPPORTED_CHAIN;

export const getReadWriteDonationContract = async (provider) => {
    const readWriteProvider = getProvider(provider);

    const signer = await readWriteProvider.getSigner();

    return getDonationContract(signer);
};
