import React from 'react';
import { AiFillLike,AiFillDislike, AiOutlineLoading3Quarters, AiFillStar } from 'react-icons/ai';
import { BsCheck2Circle } from 'react-icons/bs';
import {TiStarOutline} from "react-icons/ti";
import {Problem} from "@/utils/types/problem"
import { DBProblem } from '@/utils/types/problem';
import { useState,useEffect } from 'react';
import {arrayRemove, arrayUnion, doc,getDoc,runTransaction, updateDoc} from "firebase/firestore"
import {firestore} from "@/firebase/firebase"
import CircleSkeleton from '@/components/Skeletons/CircleSkeleton';
import RectangleSkeleton from '@/components/Skeletons/RectangleSkeleton';
import { promises } from 'dns';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "@/firebase/firebase"
import { toast } from 'react-toastify';

type ProblemdescriptionProps = {
	problem:Problem,
	_solved:boolean
};

const Problemdescription:React.FC<ProblemdescriptionProps> = ({problem,_solved}) => {
	const {currentproblem,loading,problemDifficulty,setCurrentproblem} = useGetCurrentProblem(problem.id)
	const {liked,disliked,solved,setData,starred}=useGetUserDataOnProblem(problem.id);
	const [updating,setUpdating]=useState(false);
	const [user] = useAuthState(auth);  
	
	const getUserandProblemfromfirebase = async(transaction:any) => {
		const userRef=doc(firestore,"users",user!.uid);
		const problemRef=doc(firestore,"problems",problem.id);
		const userDoc=await transaction.get(userRef);
		const problemDoc=await transaction.get(problemRef);
		return {userRef,problemRef,userDoc,problemDoc}
	}
 	const handleLike = async() => {
		if(!user){
			toast.error("You must be logged in to like a problem",{position:'top-left'});
			return;
		}
		if(updating) return;
		setUpdating(true);
		await runTransaction(firestore, async (transaction) => {
			const {userRef,problemRef,userDoc,problemDoc} = await getUserandProblemfromfirebase(transaction);
			if(userDoc.exists() && problemDoc.exists()){
				if(liked){
					transaction.update(userRef,{
						likedProblems : userDoc.data().likedProblems.filter((id:string) => id!==problem.id)
					})
					transaction.update(problemRef,{
						likes : problemDoc.data().likes-1
					})
					setCurrentproblem((prev) => (prev ? { ...prev, likes: prev.likes - 1 } : null));
					setData(prev=>({...prev,liked:false}));
				}
				else if(disliked){
					transaction.update(userRef,{
						likedProblems:[...userDoc.data().likedProblems,problem.id],
						dislikedProblems : userDoc.data().dislikedProblems.filter((id:string)=>problem.id)
					})
					transaction.update(problemRef,{
						likes: problemDoc.data().likes+1,
						dislikes: problemDoc.data().dislikes-1
					})
					setCurrentproblem((prev) =>
						prev ? { ...prev, dislikes: prev.dislikes + 1, likes: prev.likes - 1 } : null
					);
					setData(prev=>({...prev,liked:true,disliked:false}))
				}
				else {
					transaction.update(userRef,{
						likedProblems:[...userDoc.data().likedProblems,problem.id]
					})
					transaction.update(problemRef,{
						likes:problemDoc.data().likes+1
					})
					setCurrentproblem((prev) => (prev ? { ...prev, likes: prev.likes + 1 } : null));
					setData(prev=>({...prev,liked:true}))
				}
			}
		})
		setUpdating(false);
	}

	const handleDislike = async() => {
		if(!user){
			toast.error("You must be logged in to dislike a problem",{position:'top-left'})
			return
		}
		if(updating) return;
		setUpdating(true);
	    await runTransaction(firestore, async (transaction)=>{
			const {userRef,problemRef,userDoc,problemDoc} = await getUserandProblemfromfirebase(transaction);
			if(userDoc.exists() && problemDoc.exists()){
				if (disliked) {
					transaction.update(userRef, {
						dislikedProblems: userDoc.data().dislikedProblems.filter((id: string) => id !== problem.id),
					});
					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes - 1,
					});
					setCurrentproblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes - 1 } : null));
					setData((prev) => ({ ...prev, disliked: false }));
				} else if (liked) {
					transaction.update(userRef, {
						dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
						likedProblems: userDoc.data().likedProblems.filter((id: string) => id !== problem.id),
					});
					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes + 1,
						likes: problemDoc.data().likes - 1,
					});
					setCurrentproblem((prev) =>
						prev ? { ...prev, dislikes: prev.dislikes + 1, likes: prev.likes - 1 } : null
					);
					setData((prev) => ({ ...prev, disliked: true, liked: false }));
				} else {
					transaction.update(userRef, {
						dislikedProblems: [...userDoc.data().dislikedProblems, problem.id],
					});
					transaction.update(problemRef, {
						dislikes: problemDoc.data().dislikes + 1,
					});
					setCurrentproblem((prev) => (prev ? { ...prev, dislikes: prev.dislikes + 1 } : null));
					setData((prev) => ({ ...prev, disliked: true }));
				}
			}
		})
		setUpdating(false);
	}
	const handleStar = async () => {
		if(!user){
			toast.error("You must be logged in to star a problem",{position:"top-left"})
			return
		}
		if(updating) return;
		setUpdating(true);
		if(starred){
			const userRef=doc(firestore,"users",user.uid);
			await updateDoc(userRef,{starredProblems:arrayRemove(problem.id)});
			setData(prev=>({...prev,starred:false}))
		}
		if(!starred){
			const userRef=doc(firestore,"users",user.uid);
			await updateDoc(userRef,{starredProblems:arrayUnion(problem.id)});
			setData(prev=>({...prev,starred:true}))
		}
		setUpdating(false);
	}

	return (
		<div className='bg-dark-layer-1 '>
			<div className='flex w-full h-11 bg-dark-layer-2 text-white overflow-x-hidden pt-1'>
				<div className='bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] cursor-pointer text-xs'>
					Description
				</div>
			</div>
			<div className='flex px-0 py-4 h-[calc(100vh-94px)] ml-3 overflow-y-auto '>
				<div className='px-5'>
				<div className='w-full'>
					<div className='flex space-x-4'>
						<div className='flex-1 text-white font-medium text-lg'>
							{problem.title}
						</div>
					</div>
					{!loading && currentproblem && 
					<div className='flex mt-3 items-center '>
					<div className={`${problemDifficulty} inline-block rounded-[21px] bg-opacity-[.15] px-2.5 text-sm py-1 font-medium capitalize`}>
						{currentproblem.difficulty}
					</div>
					{_solved || solved && 
					<div className='text-dark-green ml-4 text-lg rounded p-[3px] transition-colors duration-200 text-green-s text-dark-green-s'>
					    <BsCheck2Circle/>
				    </div>
					}
					<div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-dark-gray-6'>
						{liked && !updating &&<AiFillLike className='text-dark-blue-s' onClick={handleLike}/>}
						{!liked && !updating && <AiFillLike onClick={handleLike}/>}
						{updating && <AiOutlineLoading3Quarters className='animate-spin'/>}
						<span className='text-sm'>{currentproblem.likes}</span>
					</div>
					<div className='flex items-center cursor-pointer hover:bg-dark-fill-3 space-x-1 rounded p-[3px] ml-3 text-lg transition-colors duration-200 text-dark-gray-6'>
						{disliked && !updating && <AiFillDislike className='text-dark-blue-s' onClick={handleDislike}/>}
						{!disliked && !updating && <AiFillDislike onClick={handleDislike}/>}
						{updating && <AiOutlineLoading3Quarters className='animate-spin'/>}
						<span className='text-sm'>{currentproblem.dislikes}</span>
					</div>
					<div className='flex items-center cursor-pointer text-xl ml-4 text-dark-gray-6 hover:text-dark-gray-7 rounded p-[3px]'>
						{starred && !updating && <AiFillStar className='text-dark-yellow' onClick={handleStar}/>}
						{!starred && !updating && <AiFillStar onClick={handleStar}/>}
						{updating && <AiOutlineLoading3Quarters className='animate-spin'/>}
					</div>
				    </div>
					}
					{loading && <div className='flex mt-3 space-x-2'>
						<RectangleSkeleton/>
						<CircleSkeleton/>
						<RectangleSkeleton/>
						<RectangleSkeleton/>
						<CircleSkeleton/>
					</div>}
					<div className='text-white text-sm'>
						<div>
							<div dangerouslySetInnerHTML={{__html:problem.problemStatement}}/>
						</div>
						<div className='mt-4'>
							<div>
								{problem.examples.map((example,index)=>(
									<div key={example.id}>
										<p className='font-medium text-white'>Example {index+1}:</p>
										{example.img && <img src={example.img} alt='' className='mt-3'/>}
								        <div className='example-card'>
									        <pre>
										    <strong className='text-white'>Input: </strong> {example.inputText} <br/>
										    <strong>Output:</strong> {example.outputText} <br/>
										    {example.explanation && 
											<>
											<strong>Explaination:</strong> {example.explanation}
											</>
											}
									        </pre>
								        </div>
									</div>
								))}
							</div>
						</div>
					</div>
					<div className='my-5 pb-4'>
						<div className='text-white font-medium text-sm'>Constraints:</div>
						<ul className='text-white ml-5 list-disc '>
							<div dangerouslySetInnerHTML={{__html:problem.constraints}}/>
						</ul>
					</div>
				</div>
				</div>
			</div>
		</div>
	)
}
export default Problemdescription;

function useGetCurrentProblem(problemId:string){
	const [currentproblem,setCurrentproblem]=useState<null | DBProblem>(null)
	const [loading,setLoading]=useState<boolean>(false);
	const [problemDifficulty,setProblemDifficulty]=useState<string>("");
	useEffect(()=>{
		setLoading(true);
		const getCurrentProblem = async () => {
			const docRef=doc(firestore,"problems",problemId);
		    const docSnap=await getDoc(docRef);
			if(docSnap.exists()){
				const cur=docSnap.data();
				setCurrentproblem({id:docSnap.id,...cur} as DBProblem);
				setProblemDifficulty(cur.difficulty==='Easy' ? "bg-olive text-olive" : cur.difficulty==='Medium' ? "text-dark-yellow bg-dark-yellow" : "text-dark-pink bg-dark-pink")
			}
			setLoading(false);
		}
		getCurrentProblem();
	},[problemId])
	return {currentproblem,loading,problemDifficulty,setCurrentproblem}
}

function useGetUserDataOnProblem(problemId:string){
	const [data,setData] = useState({liked:false,disliked:false,starred:false,solved:false});
	const [user] = useAuthState(auth);

	useEffect(()=>{
		const getUserDataOnProblem = async() => {
			const userRef = doc(firestore,"users",user!.uid);
			const userSnap = await getDoc(userRef);
			if(userSnap.exists()){
				const data=userSnap.data();
				const {solvedProblems,likedProblems,dislikedProblems,starredProblems} = data;
				setData({
					liked:likedProblems.includes(problemId),
					disliked:dislikedProblems.includes(problemId),
					starred:starredProblems.includes(problemId),
					solved:solvedProblems.includes(problemId)
				})
			}
		}
		if(user) getUserDataOnProblem();
		return () => setData({ liked: false, disliked: false, starred: false, solved: false });
	},[problemId,user])
	return {...data,setData};
}