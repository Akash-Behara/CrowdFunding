import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import { BigNumber, ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

const CampaignDetails = () => {

  const { state } = useLocation();
  const navigate = useNavigate();
  const { getDonations, contract, address, donate } = useStateContext();

  const [isLoading, setisLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);

  const remainingDays = daysLeft(BigNumber.from(state.deadline))

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data)
  }

  const handleDonate = async () => {
    setisLoading(true);
    await donate(state.pId, amount);
    fetchDonators();
    navigate('/');
    setisLoading(false);
  }

  useEffect(() => {
    if(contract) fetchDonators();
  }, [contract, address, donators])

  return (
    <div>
      {isLoading && <Loader />}
      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px]'>
        <div className='flex-1 flex-col'>
          <img src={state.image} alt="campaign" className='w-full h-[410px] object-cover rounded-xl' />
          <div className='relative w-full h-[5px] mt-2 bg-[#3a3a43]'>
            <div className='absolute h-full bg-[#4acd8d]' style={{width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}></div>
          </div>
        </div>
        <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
          <CountBox title="Days Left" value={remainingDays}/>
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected}/>
          <CountBox title="Total Backers" value={donators.length}/>
        </div>
      </div>

      <div className='mt-[60px] flex lg:flex-row flex-col gap-5'>
        <div className='flex-[2] flex flex-col gap-[40px]'>
          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Creator</h4>
            <div className='mt-[20px] flex flex-row flex-wrap items-center gap-[14px]'>
              <div className='w-[52px] h-[52px] flex justify-center items-center rounded-full bg-[#2c2f32] cursor-pointer'>
                <img src={thirdweb} alt="user" className='w-[60%] h-[60%] object-contain'/>
              </div>
              <div>
                <h4 className='font-epilogue font-semibold text-[14px] text-white break-all'>{state.owner}</h4>
                <p className='mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]'>10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Story</h4>
            <div className='mt-[20px]'>
              <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>{state.description}</p>
            </div>
          </div>

          <div>
            <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Donators</h4>
            <div className='mt-[20px] flex flex-col gap-4'>
              {donators.length > 0 
                ? donators.map((donator, idx) => (
                    <div key={donator.donator} className='flex justify-between items-center gap-4'>
                      <p className='font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-11'>{idx + 1}. {donator.donator}</p>
                      <p className='font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-11'>{donator.donation} <span className='text-[14px] text-[#b2b3bd]'>ETH</span></p>
                    </div>
                  ))
                : <p className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify'>No Donators yet. Be the first one!</p>
              }
            </div>
          </div>
        </div>
            
        <div className='flex-1 '>
          <h4 className='font-epilogue font-semibold text-[18px] text-white uppercase'>Fund</h4>
          <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]'>
              <p className='font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]'>Fund the Campaign</p>
              <div className='mt-[30px]'>
                <input 
                  type='number'
                  placeholder='ETH 0.1'
                  step={0.1}
                  className='w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a4a4e] font-epilogue text-white bg-transparent text-[18px] leading-[30px] placeholder:text-[#4d5264] rounded-[10px]'
                  value={amount}
                  onChange={(e) => {setAmount(e.target.value)}}
                />
                <div className='my-[20px] p-4 bg-[#13131a] rounded-[10px]'>
                  <h4 className='font-epilogue font-semibold text-[14px] leading-[22px] text-white'>Back it because you believe in it.</h4>
                  <p className='mt-[20px] leading-[22px] text-[#808191] font-epilogue font-normal'>Support the project for no rewards, just because it speaks to you.</p>
                </div>
                <CustomButton 
                  btnType={"button"}
                  title="Fund Campaign"
                  styles="w-full bg-[#8c6dfd]"
                  handleClick={handleDonate}
                />
              </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CampaignDetails