import React from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from 'react-icons/ai';
import {useState,useEffect} from "react"
import{ Isettings } from "../Playground"
import SettingsModal from "@/components/Modals/SettingsModal";


type PreferenceNavProps = {
    settings:Isettings;
    setSettings:React.Dispatch<React.SetStateAction<Isettings>>;
};

const PreferenceNav:React.FC<PreferenceNavProps> = ({settings,setSettings}) => {
    const [isFullScreen,setIsFullScreen]=useState(false);
    const handleFullScreen = () => {
		if (isFullScreen) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
		setIsFullScreen(!isFullScreen);
	};
    useEffect(() => {
		function exitHandler(e: any) {
			if (!document.fullscreenElement) {
				setIsFullScreen(false);
				return;
			}
			setIsFullScreen(true);
		}

		if (document.addEventListener) {
			document.addEventListener("fullscreenchange", exitHandler);
			document.addEventListener("webkitfullscreenchange", exitHandler);
			document.addEventListener("mozfullscreenchange", exitHandler);
			document.addEventListener("MSFullscreenChange", exitHandler);
		}
	}, [isFullScreen]);
    
    return <div className='flex items-center justify-between bg-dark-layer-2 h-11'>
        <button className='flex cursor-pointer bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 rounded font-medium'>
            <div className='flex items-center px-1'>
                <div className='text-xs text-label-2 dark:text-label-2'>Javascript</div>
            </div>
        </button>
        <div className='flex items-center m-2'>
            <button className='preferenceBtn group' onClick={()=>setSettings({...settings,settingModalisOpen:true})}>
            <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'><AiOutlineSetting/></div>
            <div className='preferenceBtn-tooltip'>Settings</div>
            </button>
            <button className='preferenceBtn group' onClick={handleFullScreen}>
            <div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
                {!isFullScreen? <AiOutlineFullscreen/> : <AiOutlineFullscreenExit/>}
            </div>
            <div className='preferenceBtn-tooltip'>Full Screen</div>
            </button>
        </div>
        {settings.settingModalisOpen && <SettingsModal settings={settings} setSettings={setSettings} />}
    </div>
}
export default PreferenceNav;