import React from 'react';
import Split from 'react-split';
import Problemdescription from './ProblemDescription/Problemdescription';
import Playground from './Playground/Playground';
import {Problem} from "@/utils/types/problem"
import {useState} from "react"

type WorkspaceProps = {
    problem:Problem
};

const Workspace:React.FC<WorkspaceProps> = ({problem}) => {
    const [solved,setSolved] = useState(false);
    
    return <Split className='split' minSize={0}>
        <Problemdescription problem={problem} _solved={solved}/>
        <Playground problem={problem} setSolved={setSolved}/>
    </Split>
}
export default Workspace;