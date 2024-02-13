import Topbar from '@/components/Topbar/Topbar';
import React from 'react';
import Workspace from '@/components/Workspace/Workspace';
import {problems} from "@/utils/problems"
import { notFound } from 'next/navigation';
import {Problem} from "@/utils/types/problem"
import useHasMounted from "@/hooks/useHasMounted"

type ProblemPageProps = {
    problem:Problem
};

const ProblemPage:React.FC<ProblemPageProps> = ({problem}) => {
    const hasMounted=useHasMounted();
    if(!hasMounted) return null;
    
    return (
    <div>
       <Topbar problemPage={true}/>
       <Workspace problem={problem}/>
    </div>
    );
}
export default ProblemPage;

export async function getStaticPaths(){
    const paths=Object.keys(problems).map((key)=>({
        params:{pid:key}
    }))
    return {
        paths, 
        fallback:false
    }
}

export async function getStaticProps({params}:{params:{pid:string}}){
    const {pid}=params;
    const problem=problems[pid];
    if(!problem){
        notFound:true
    }
    problem.handlerFunction = problem.handlerFunction.toString();
    return{
        props:{
            problem
        }
    }
}