import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';

type NavbarProps = {
    
};

const Navbar:React.FC<NavbarProps> = () => {
    const  setAuthModalState=useSetRecoilState(authModalState);
    return <div className='flex items-center justify-between sm:px-12 px-2 md:px-24'>
        <Link href="/" className='flex items-center justify-center h-20'>
            <Image src='/litucode.png' alt='LeetClone' height={150} width={150}/>
        </Link>
        <div className="flex items-center">
            <button className="bg-brand-orange text-white px-2 py-1 sm:px-5 rounded-md text-sm font-medium hover:bg-white hover:text-brand-orange hover:border-brand-orange hover:border-2 border-2 border-transparent transition duration-300 ease-in-out"
            onClick={()=>{
                setAuthModalState((prev)=>({...prev,isOpen:true}));
            }}
            >Sign In</button>
        </div>
    </div>
}
export default Navbar;