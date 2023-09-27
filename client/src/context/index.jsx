import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract(import.meta.env.VITE_THIRDWEB_CONTRACT_ADDRESS);
    const { mutateAsync: createCampagin } = useContractWrite(contract, 'createCampagin');

    const address = useAddress();
    const connect = useMetamask();

    const publishCampaign = async (form) => {
        try {
            const data = await createCampagin({args: [
                address,
                form.title,
                form.description,
                form.target,
                new Date(form.deadline).getTime(),
                form.image
            ]});

            console.log('Create campgain success: data', data)
        } catch (error) {
            console.log('Create campaign failed', error)
        }
    }

    return (
        <StateContext.Provider value={{
            address,
            connect,
            contract,
            createCampagin: publishCampaign
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);