import React, { useEffect } from 'react';
import Link from 'next/link';
import {BsCheckCircle} from "react-icons/bs"
import {AiFillYoutube} from "react-icons/ai";
import { IoClose } from 'react-icons/io5';
import YouTube from "react-youtube"
import { useState } from 'react';
import { collection,orderBy,query,getDocs, where } from 'firebase/firestore';
import { firestore} from '@/firebase/firebase';
import { DBProblem } from '@/utils/types/problem';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "@/firebase/firebase"
import {doc,getDoc} from "firebase/firestore"


type ProblemsTableProps = {
    setLoadingProblems:React.Dispatch<React.SetStateAction<boolean>>
};

const ProblemsTable:React.FC<ProblemsTableProps> = ({setLoadingProblems}) => {
    const [foot,setFoot]=useState({
        isOpen:false,
        link:""
    });

    const problems=useGetProblems(setLoadingProblems);
    
    const handleClick = () => {
        setFoot(()=>({isOpen:false,link:""}));
    }

    useEffect(()=>{
        const handleEsc = (e:KeyboardEvent) => {
            if(e.key==="Escape") handleClick();
        }
        window.addEventListener("keydown",handleEsc);
        return () => window.removeEventListener("keydown",handleEsc);
    },[]);

    const solvedproblems=useGetSolvedProblems();
    console.log(solvedproblems)

    return (
        <>
        <tbody className='text-white'>
            {problems.map((doc,idx)=>{
                const difficultyColor = doc.difficulty==='Easy' ? "text-dark-green-s" : doc.difficulty==='Medium' ? "text-dark-yellow" : "text-dark-pink"
                return (
                    <tr className={`${idx%2==1 ? "bg-dark-layer-1" : " "} whitespace-nowrap`} key={doc.id}>
                        <th className='px-2 py-4 font-medium whitespace-nowrap text-dark-green-s'>
                            {solvedproblems.includes(doc.id) && <BsCheckCircle fontSize={"18"} width={'18'} />}
                        </th>
                        <td className={"px-6 py-4"}>
                            {doc.link ? (<Link href={doc.link} className='hover:text-blue-600 cursor-pointer' target='_blank'>
                                {doc.title}
                            </Link>) : (
                                <Link className='hover:text-blue-600 cursor-pointer' href={`/problems/${doc.id}`}>
                                    {doc.title}
                                </Link>
                            )}
                        </td>
                        <td className={`${difficultyColor} font-medium`}>
                            {doc.difficulty}
                        </td>
                        <td className={"px-6 py-4"}>
                            {doc.category}
                        </td>
                        <td className={"px-6 py-4"}>
                            {doc.videoId ? (
                                <AiFillYoutube fontSize={28} className='cursor-pointer hover:text-red-600' onClick={()=>{setFoot(()=>({isOpen:true,link:doc.videoId as string}))}}></AiFillYoutube>
                            ) : (<p className='text-gray-400'>Coming soon</p>)}
                        </td>
                    </tr>
                )
            }) }
        </tbody>
        {foot.isOpen && <tfoot className='fixed top-0 left-0 h-screen w-screen flex items-center justify-center'>
            <div className='bg-black z-10 opacity-70 top-0 left-0 w-screen h-screen absolute' onClick={handleClick}></div>
            <div className='w-full z-50 h-full px-6 relative max-w-4xl'>
                <div className='w-full h-full flex items-center justify-center relative'>
                    <div className='w-full relative'>
                        <IoClose className='cursor-pointer absolute right-0 -top-16' fontSize={"35"} onClick={handleClick}></IoClose>
                        <YouTube videoId={foot.link} loading='lazy' iframeClassName='w-full min-h-[500px]'/>
                    </div>
                </div>
            </div>
        </tfoot>}
        </>
    )
}
export default ProblemsTable;

function useGetProblems(setLoadingProblems:React.Dispatch<React.SetStateAction<boolean>>){
    const [problems,setProblems] = useState<DBProblem[]>([]);
    useEffect(()=>{
        const getProblems = async () => {
            setLoadingProblems(true);
            const q = query(collection(firestore,"problems"),orderBy("order",'asc'));
            const querySnapshot = await getDocs(q);
            console.log("horray");
            const temp: DBProblem[] = [];
            querySnapshot.forEach((doc)=>{
                temp.push({id:doc.id,...doc.data()} as DBProblem);
            })
            setProblems(temp);
            setLoadingProblems(false);
        }
        getProblems();
    },[setLoadingProblems]);
    return problems;
}

function useGetSolvedProblems(){
    const[solvedproblems,setSolvedProblems]=useState<string[]>([]);
    const [user]=useAuthState(auth);

    useEffect(()=>{
        const getSolvedProblems = async() => {
            const userRef=doc(firestore,"users",user!.uid);
            const userDoc=await getDoc(userRef);
            if(userDoc.exists()){
                setSolvedProblems(userDoc.data().solvedProblems)
            }
        }
        if(user) getSolvedProblems();
        if(!user) setSolvedProblems([])
    },[user])
    return solvedproblems;
}