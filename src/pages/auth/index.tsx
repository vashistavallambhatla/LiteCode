import React, { useEffect,useState} from 'react';
import Navbar from '@/components/Navbar/Navbar';
import AuthModal from '@/components/Modals/AuthModal';
import {useRecoilValue} from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "@/firebase/firebase";
import { useRouter } from 'next/router';


type AuthPageProps = {
    
};

const AuthPage:React.FC<AuthPageProps> = () => {
    const authModal=useRecoilValue(authModalState);
    const [user,loading,error]=useAuthState(auth);
    const [pageloading,setLoading]=useState(true);
    const router=useRouter();

    useEffect(()=>{
        if(user) router.push("/");
        if(!loading && !user) setLoading(false); 
    },[user,router,loading]);

    if(pageloading) return null;

    return <div className="bg-gradient-to-b from-gray-600 to-black h-screen relative">
        <div className='max-w-7xl mx-auto'>
            <Navbar/>
            <div className='flex justify-center h-screen items-center'>
            <h1 className='text-brand-orange text-5xl'>Best place to practice your dsA game</h1>
        </div>
        {authModal.isOpen && <AuthModal/>}
        </div>
    </div>
}
export default AuthPage;