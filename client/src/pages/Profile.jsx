import React, { useState, useEffect } from 'react';

import { useStateContext } from '../context';
import { DisplayCampaigns } from '../components';

const Profile = () => {
  const [isLoading, setisLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampagins = async () => {
    setisLoading(true)
    const data = await getUserCampaigns()
    setCampaigns(data)
    setisLoading(false)
  }

  useEffect(() => {
    if(contract) fetchCampagins();
  }, [address, contract])

  return (
    <div className=''>
      <DisplayCampaigns 
        title="Your Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  )
}

export default Profile