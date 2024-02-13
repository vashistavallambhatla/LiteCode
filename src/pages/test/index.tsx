import React from 'react';
import { GoHomeFill } from "react-icons/go";
import { MdOutlineEventNote,MdPayments} from "react-icons/md";
import { PiSquaresFourBold,PiLightningBold } from "react-icons/pi";
import { FiTruck } from "react-icons/fi";
import { HiSpeakerphone } from "react-icons/hi";
import { LuMousePointer2,LuPalette } from "react-icons/lu";
import { TbDiscount2 } from "react-icons/tb";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { CiWallet } from "react-icons/ci";


type indexProps = {
    
};

const index:React.FC<indexProps> = () => {
    
    return (
        <div className='flex'>
            <div className='bg-slate-950 text-white p-10 h-screen'>
                <div className='flex items-center mb-3 mr-5'>
                <GoHomeFill className='mr-3'></GoHomeFill>
                <button>Home</button>
                </div>
                <div className='flex items-center mb-3 mr-5'>
                <MdOutlineEventNote className='mr-3'></MdOutlineEventNote>
                <button>Orders</button>
                </div>  
                <div className='flex items-center mb-3 mr-5'>
                <PiSquaresFourBold className='mr-3'></PiSquaresFourBold>
                <button>Products</button>
                </div>   
                <div className='flex items-center mb-3 mr-5'>
                <FiTruck className='mr-3'></FiTruck>
                <button>Delivery</button>
                </div> 
                <div className='flex items-center mb-3 mr-5'>
                <HiSpeakerphone className='mr-3'></HiSpeakerphone>
                <button>Marketing</button>
                </div>  
                <div className='flex items-center mb-3 mr-5'>
                <MdPayments className='mr-3'></MdPayments>
                <button>Payments</button>
                </div> 
                <div className='flex items-center mb-3 mr-5'>
                <LuMousePointer2 className='mr-3 '></LuMousePointer2>
                <button>Tools</button>
                </div> 
                <div className='flex items-center mb-3 mr-5'>
                <TbDiscount2 className='mr-3 '></TbDiscount2>
                <button>Discount</button>
                </div>  
                <div className='flex items-center mb-3 mr-5'>
                <MdOutlineEventNote className='mr-3 '></MdOutlineEventNote>
                <button>Audience</button>
                </div> 
                <div className='flex items-center mb-3 mr-5'>
                <LuPalette className='mr-3 '></LuPalette>
                <button>Appearance</button>
                </div> 
                <div className='flex items-center mb-3 mr-5'>
                <PiLightningBold className='mr-3 '></PiLightningBold>
                <button>Plugins</button>
                </div>   
                <div className='absolute bottom-0 mb-5 w-10 inline-flex'>
                    <div className='border-white border rounded-sm w-20'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 mt-3 mb-3 ml-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                    </svg>
                    <div className='w-3'>
                        <p className='font-thin'>Available credits</p>
                    </div>
                    </div>
                </div> 
            </div>
            <div></div>
        </div>
    )
}
export default index;