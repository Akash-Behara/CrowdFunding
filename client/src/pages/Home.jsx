import React, { useState, useEffect } from 'react';

import { useStateContext } from '../context';
import { DisplayCampaigns } from '../components';

const Home = () => {
  const [isLoading, setisLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getCampagins } = useStateContext();

  const fetchCampagins = async () => {
    const data = await getCampagins()
    setCampaigns(data)
    setisLoading(false)
  }

  useEffect(() => {
    setisLoading(true)
    if(contract) fetchCampagins();
  }, [address, contract])

  return (
    <div className=''>
      <DisplayCampaigns 
        title="All Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
      />
    </div>
  )
}

export default Home