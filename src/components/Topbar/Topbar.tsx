import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "@/firebase/firebase"
import Logout from "@/components/Buttons/Logout"
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';
import {FaChevronLeft,FaChevronRight} from "react-icons/fa";
import { BsList } from 'react-icons/bs';
import Timer from "@/components/Timer/Timer"
import { useRouter } from 'next/router';
import { problems } from "@/utils/problems";
import { Problem } from "@/utils/types/problem";


type TopbarProps = {
    problemPage?:boolean,
};

const Topbar:React.FC<TopbarProps> = ({problemPage}) => {
    const [user] = useAuthState(auth);
    const setAuthModalState=useSetRecoilState(authModalState);
    const router = useRouter();
    const handleProblemChange = (isForward:boolean) => {
        const {order} = problems[router.query.pid as string] as Problem;
        const direction = isForward ? 1 : -1;
        const nextOrder = order + direction;
        const nextProblemKey = Object.keys(problems).find((key) => problems[key].order===nextOrder);

        if(isForward && !nextProblemKey){
            const firstProblemOrder = Object.keys(problems).find((key)=>problems[key].order===1);
            router.push(`/problems/${firstProblemOrder}`);
        }
        else if(!isForward && !nextProblemKey){
            const lastProblemOrder = Object.keys(problems).find((key)=>problems[key].order===Object.keys(problems).length);
            router.push(`/problems/${lastProblemOrder}`)
        }
        else router.push(`/problems/${nextProblemKey}`)
    }
    return (
        <nav className='relative flex w-full h-[50px] items-center px-5 bg-dark-layer-1 text-dark-gray-7 '>
            <div className={`flex w-full items-center justify-between ${!problemPage?"max-w-[1200px] mx-auto" : ""}`}>
                <Link href="/" className='flex-1 mx-5'>
                    <Image src="/litucode.png" alt="Logo" height={100} width={120}/>
                </Link>
                {problemPage && (
                    <div className='flex items-center justify-center gap-4 flex-1'>
                        <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer' onClick={()=>handleProblemChange(false)}>
                            <FaChevronLeft/>
                        </div>
                        <Link href="/" className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer '>
                            <div>
                                <BsList className='text-white'/>
                            </div>
                            <p>Problems List</p>
                        </Link>
                        <div className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer' onClick={()=>handleProblemChange(true)}>
                            <FaChevronRight/>
                        </div>
                    </div>
                )}
                

                <div className='flex items-center space-x-4 flex-1 justify-end mx-5'>
                    {!user && <Link href="/auth">
                         <button className='bg-dark-fill-3 px-2 py-1 rounded cursor-pointer' onClick={()=>setAuthModalState((prev)=>({...prev,isOpen:true,type:"login"}))}>Sign in</button>
                    </Link>}
                    {user && problemPage && <Timer/>}
                    {user && (
                    <div className='cursor-pointer relative cursor-pointer group'>
                        <Image src='/avatar.png' alt="Avatar" height={200} width={30}/>
                        <div className='absolute top-10 left-2/4 -translate-x-2/4 max-auto bg-dark-layer-1 text-brand-orange p-2 rounded shadow-lg z-40 scale-0 group-hover:scale-100 transition-all duration-300 ease-in-out'>
                            <p className='text-sm'>{user.email}</p>
                        </div>
                    </div>)}
                    {user && <Logout/>}
                </div>
            </div>
        </nav>
    )
}
export default Topbar;