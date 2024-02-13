import React, { useEffect, useState } from 'react';
import PrefernceNav from './PreferenceNav/PreferenceNav';
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror"
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import EditorFooter from './EditorFooter/EditorFooter';
import {Problem} from "@/utils/types/problem"
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "@/firebase/firebase"
import {toast} from "react-toastify"
import { useRouter } from 'next/router';
import {problems} from "@/utils/problems/"
import {arrayUnion, doc,updateDoc} from "firebase/firestore"
import {firestore} from "@/firebase/firebase"

type PlaygroundProps = {
    problem:Problem;
    setSolved:React.Dispatch<React.SetStateAction<boolean>>;
};

export interface Isettings {
    fontSize:string,
    settingModalisOpen:boolean,
    dropdownisOpen:boolean
}

const Playground:React.FC<PlaygroundProps> = ({problem,setSolved}) => {
    const [user]=useAuthState(auth);
    const {query : {pid}} = useRouter();
    const [testCaseState,setTestCaseState]=useState<number>(0);
    let [userCode, setUserCode] = useState<string>(problem.starterCode);

    const [settings,setSettings] = useState<Isettings>({
        fontSize:"16px",
        settingModalisOpen:false,
        dropdownisOpen:false,
    })

    const handleSubmit = async() => {
        if(!user){
            toast.error("please login ro submit your code",{position:'top-center'})
            return;
        }
        try{
            userCode = userCode.slice(userCode.indexOf(problem.starterFunctionName));
			const cb = new Function(`return ${userCode}`)();
			const handler = problems[pid as string].handlerFunction;

			if (typeof handler === "function") {
				const success = handler(cb);
				if (success) {
					toast.success("Congrats! All tests passed!", {
						position: "top-center",
						autoClose: 3000,
						theme: "dark",
					});

					const userRef = doc(firestore, "users", user.uid);
					await updateDoc(userRef, {
						solvedProblems: arrayUnion(pid),
					});
                    
					setSolved(true);
				}
			}
        } catch(error:any) {
            console.log(error.message);
			if (
				error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")
			) {
				toast.error("Oops! One or more test cases failed", {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			} else {
				toast.error(error.message, {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			}
        }
    }

    useEffect(()=>{
        const code = localStorage.getItem(`code-${pid}`);
        if(user){
            setUserCode(code ? JSON.parse(code) : problem.starterCode);
        } else{
            setUserCode(problem.starterCode);
        }
    },[setUserCode,pid,problem.starterCode,user])

    const onChange = (value:string) => {
        setUserCode(value);
        localStorage.setItem(`code-${pid}`,JSON.stringify(value));
    }

    return <div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
        <PrefernceNav settings={settings} setSettings={setSettings}/>
        <Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60,40]} minSize={60}>
            <div className='w-full overflow-auto'>
                <CodeMirror
                value={userCode}
                theme={vscodeDark}
                onChange={onChange}
                extensions={[javascript()]}
                style={{fontSize:settings.fontSize}}
                />
            </div>
            <div className='w-full px-5 overflow-y-hidden'>
                {/*Test Case heading*/}
                <div className='flex h-10 items-center'>
                    <div className='relative flex flex-col'>
                        <div className='text-sm font-medium text-white leading-5 justify-center cursor-pointer mb-1'>Testcases</div>
                        <hr className='w-full rounded-full absolute bottom-0 h-0.5 border-none bg-white'/>
                    </div>
                </div>

                <div className='flex space-x-6'>
                    {/*case 1*/}
                    {problem.examples.map((example,index)=>(
                        <>
                        <div className='items-start mt-2 ' onClick={()=>{setTestCaseState(index)}}>
                            <div className='flex flex-wrap items-center gap-y-4'>
                                <div className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap 
                                ${testCaseState===index? "text-white" : "text-gray-500"}
                                `}
                                >
                                    Case {index+1}
                                </div>
                            </div>
                        </div>
                        </>
                    ))}
                </div>
                <div className='font-semibold my-4'>
                    <p className='text-sm font-medium mt-4 text-white'>Input:</p>
                    <div className='w-full mt-2 cursor-text bg-dark-fill-3 rounded-lg px-3 py-[10px] text-white text-sm font-medium border border-transparent'>{problem.examples[testCaseState].inputText}</div>
                    <p className='text-sm font-medium mt-4 text-white'>Output:</p>
                    <div className='w-full mt-2 cursor-text bg-dark-fill-3 rounded-lg px-3 py-[10px] text-white text-sm font-medium border border-transparent'>{problem.examples[testCaseState].outputText}</div>
                </div>
            </div>
        </Split>
        <EditorFooter handleSubmit={handleSubmit}/>
    </div>
}
export default Playground;