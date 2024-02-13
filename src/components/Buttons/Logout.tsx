import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useSignOut } from 'react-firebase-hooks/auth';
import {auth} from "@/firebase/firebase"

type LogoutProps = {
    
};

const Logout:React.FC<LogoutProps> = () => {
    const [signOut,loading,erroe] = useSignOut(auth);
    const handleLogout = () =>{
        signOut();
    }
    
    return <button className='bg-dark-fill-3 text-brand-orange px-3 py-2 rounded' onClick={handleLogout}>
        <FiLogOut/>
    </button>
}
export default Logout;