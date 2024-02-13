import { authModalState } from '@/atoms/authModalAtom';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from "@/firebase/firebase"
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {doc,setDoc} from "firebase/firestore"

type SignupProps = {};

const Signup:React.FC<SignupProps> = () => {
    const SetRecoilState=useSetRecoilState(authModalState);
    
    const router=useRouter();

    const [inputs,setInput]=useState({email:'',username:'',password:''});

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInput((prev)=>({...prev,[e.target.name]:e.target.value}));
    }

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useCreateUserWithEmailAndPassword(auth);

    const handleRegister = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!inputs.email || !inputs.password || !inputs.username) return alert("Please fill all fields")
        try{
            toast.loading("Creating your account",{position:"top-center",toastId:"loadingToast"})
            const newUser = await createUserWithEmailAndPassword(inputs.email,inputs.password);
            if(error) toast.error(error.message,{position:"top-center",autoClose:3000,hideProgressBar:true})
            if(!newUser) return;
            const userData = {
                uid: newUser.user.uid,
                email:newUser.user.email,
                displayName: inputs.username,
                createdAt:Date.now(),
                updatedAt:Date.now(),
                likedProblems:[],
                dislikedProblems:[],
                solvedProblems:[],
                starredProblems:[],
            }
            await setDoc(doc(firestore,"users",newUser.user.uid),userData)
            router.push('/');
        } catch(error:any){
            return toast.error(error.message,{position:"top-center",autoClose:3000,hideProgressBar:true})
        } finally {
            toast.dismiss("loadingToast")
        }
    }

    useEffect(()=>{
        if(error) toast.error(error.message,{position:"top-center",autoClose:3000,hideProgressBar:true})
    },[error])

    return <form className="space-y-6 px-6 lg:px-8 pb-4 sm:pb-6 xl:pb-8" onSubmit={handleRegister}>
        <div>
            <h3 className="text-white text-xl font-medium mb-4">Register to LeetClone</h3>
            <label htmlFor='Email' className="text-gray-300 font-medium block mb-2">
                Email
            </label>
            <input type="email" name="email" id="email" className="rounded-lg w-full h-10 p-2.5 border-2 outline-none mb-2" placeholder="Email" onChange={handleChange}></input>
            <label htmlFor='username' className="text-gray-300 font-medium block mb-2">
                Username
            </label>
            <input type="username" name="username" id="username" className="rounded-lg w-full h-10 p-2.5 border-2 outline-none mb-2" placeholder="Username" onChange={handleChange}></input>
            <label htmlFor='Password' className="text-gray-300 font-medium block mb-2">
                Password
            </label>
            <input type="password" name="password" id="password" className="rounded-lg w-full h-10 p-2.5 border-2 outline-none mb-4" placeholder="Password" onChange={handleChange}
            ></input>
            <button className='bg-brand-orange w-full rounded-lg h-10 mt-3 text-white font-medium'>{loading ? "Registering.." : "Register"}</button>
            <button className='text-sm text-white font-medium mt-5'>
                Already Registered? {" "}
                <a href="#" className="text-brand-orange hover:underline"
                onClick={()=>{
                    SetRecoilState((val)=>({...val,type:'login'}))
                }}
                >Log in</a>
            </button>
        </div>
    </form>
}
export default Signup;