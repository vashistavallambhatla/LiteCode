import { authModalState } from '@/atoms/authModalAtom';
import React, { useEffect } from 'react';
import {useSetRecoilState} from 'recoil';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import {auth} from "@/firebase/firebase"
import { useRouter } from 'next/router';

type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const router=useRouter();

    const SetRecoilState=useSetRecoilState(authModalState);

    const handleClick = (type:'login' | 'register' | 'forgotPassword') => {
        SetRecoilState((prev)=>({...prev,type}));
    };

    const [inputs,setInputs]=useState({email:"",password:""});

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputs((prev)=>({...prev,[e.target.name]:e.target.value}));
    }

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);
    

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputs.email || !inputs.password) return alert("Please fill all fields");
        try{
            const newUser = await signInWithEmailAndPassword(inputs.email,inputs.password);
            if(error) alert(error.message);
            if(!newUser) return;
            router.push("/");
        } catch(e:any){
            return alert(e.message);
        }
    }
    
    useEffect(()=>{
        if(error) alert(error.message);
    },[error]);

    return <form className='px-6 py-4 space-y-6' onSubmit={handleSubmit}>
        <div className='mb-4'>
            <h3 className='text-white text-xl font-medium mb-4'>Sign in to LeetClone</h3>
            <label htmlFor="email" className='block mb-2 text-gray-300 font-medium text-sm'>
                Username
            </label>
            <input type="email" name="email" id="email" className="rounded-lg mb-2 w-70 block h-10 w-full p-2.5 border-2 outline-none" placeholder="Username" onChange={handleChange}/>
            <label htmlFor="password" className='block mb-2 text-gray-300 font-medium text-sm'>
                Password
            </label>
            <input type="password" name="password" id="password" className="rounded-lg mb-2 w-full block h-10 w-full p-2.5 border-2 outline-none" placeholder="Password" onChange={handleChange}/>
            <button type="submit" className='bg-brand-orange font-medium rounded-lg w-full h-10 mt-6 text-white font-medium hover:bg-brand-orange-s'>Login</button>
            <button className='flex w-full justify-end' onClick={()=>handleClick("forgotPassword")}>
                <a href="#" className="text-sm block mt-5 text-brand-orange hover:underline w-full text-right">Forgot password?</a>
            </button>
            <div className='text-sm font-medium text-white mt-5'>
                Not Registered? {" "}
                <a href="#" className="text-brand-orange hover:underline" onClick={()=>handleClick("register")}>
                    Create account
                </a>
            </div>
        </div>
    </form>
}
export default Login;