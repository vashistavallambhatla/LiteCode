import React, { useEffect } from 'react';
import {auth} from "@/firebase/firebase"
import { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import {toast} from "react-toastify";

type ResetPasswordProps = {
    
};

const ResetPassword:React.FC<ResetPasswordProps> = () => {
    const [email,setEmail]=useState("");
    const [sendPasswordResetEmail,sending,error]=useSendPasswordResetEmail(auth);

    const handleReset = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const success = await sendPasswordResetEmail(
            email,
        );
        if(success) toast.success("Password reset email sent",{position:"top-center",autoClose:3000,hideProgressBar:true});
    }

    useEffect(()=>{
        if(error) toast.error(error.message,{position:"top-center",autoClose:3000,hideProgressBar:true})
    },[error])

    return <form className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8" onSubmit={handleReset}>
        <div>
            <h3 className="text-white font-medium text-xl mb-4">Reset Password</h3>
            <p className='text-sm text-white mb-4'>
                Forgotten your password? Enter your e-mail address below to receive a link.
            </p>
            <label htmlFor='email' className='text-gray-300 font-medium block mb-2'>Your Email</label>
            <input placeholder='Email' className='rounded-lg w-full h-10 border-2 p-2.5 mb-6' name='email' id='email' onChange={(e)=>{setEmail(e.target.value)}}></input>
            <button className='w-full bg-brand-orange h-10 rounded-lg text-white font-medium mt-2' >Reset</button>
        </div>
    </form>
}
export default ResetPassword;