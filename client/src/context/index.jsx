import React, { useContext, createContext } from 'react';
import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract(import.meta.env.VITE_THIRDWEB_CONTRACT_ADDRESS);
    const { mutateAsync: createCampagin } = useContractWrite(contract, 'createCampagin');
    // const { mutateAsync: donateToCampaign } = useContractWrite(contract, 'donateToCampaign');

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

    const getCampagins = async () => {
        try {
            const campaigns = await contract.call('getCampagins')
            const parsedCampaigns = campaigns.map((campaign, idx) => ({
                owner: campaign.owner,
                title: campaign.title,
                description: campaign.description,
                deadline: campaign.deadline,
                target: ethers.utils.formatEther(campaign.target.toString()),
                amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
                image: campaign.image,
                pId: idx
            }))
            return parsedCampaigns;
            
        } catch (error) {
            console.log('Error fetching campaigns', error);
        }
    }

    const getUserCampaigns = async () => {
        try {
            const allCampaigns = await getCampagins();
            const filteredCampaigns = allCampaigns.filter((campaign, idx) => campaign.owner === address);
            return filteredCampaigns;
        } catch (error) {
            console.log('Error getting user campaigns', error);
        }
    }

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', [pId], {value: ethers.utils.parseEther(amount)});
        return data;
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', [pId]);
        const numberOfDonations = donations[0].length;
        const parsedDonations = [];

        for(let i = 0; i < numberOfDonations; i++){
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }
        return parsedDonations;
    }

    return (
        <StateContext.Provider value={{
            address,
            connect,
            contract,
            createCampagin: publishCampaign,
            getCampagins,
            getUserCampaigns,
            donate,
            getDonations
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);