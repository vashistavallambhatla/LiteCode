import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Topbar from '@/components/Topbar/Topbar'
import ProblemsTable from '@/components/ProblemsTable/ProblemsTable'
import {useState} from "react"
import {doc,setDoc} from "firebase/firestore"
import { firestore } from '@/firebase/firebase'
import useHasMounted from '@/hooks/useHasMounted'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [loadingProblems,setLoadingProblems]=useState(false);
  const hasMounted=useHasMounted();
  if(!hasMounted) return null;

  return (
    <>
      <main className='bg-dark-layer-2 min-h-screen'>
        <Topbar></Topbar>
        <div className='relative overflow-x-auto mx-auto px-6 pb-10'>
          {loadingProblems && (
            <div>
              <div className='max-w-[1200px] mx-auto sm:w-7/12 w-full animate-pulse'>
							{[...Array(10)].map((_, idx) => (
								<LoadingSkeleton key={idx} />
							))}
						</div>

            </div>
          )}
          <table className='text-sm text-gray-500 dark:text-gray-300 w-full sm:w-7/12 mx-auto max-w-[1200px] mt-10'>
            {!loadingProblems && (
            <thead className='tex-xs text-gray-700 uppercase dark:text-gray-300 border-b'>
              <tr>
                <th scope='col' className='px-1 py-3 w-0 font-medium'>
										Status
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Title
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Difficulty
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Category
									</th>
									<th scope='col' className='px-6 py-3 w-0 font-medium'>
										Solution
									</th>
                </tr>
            </thead>
          )}     
            <ProblemsTable setLoadingProblems={setLoadingProblems}/>
          </table>
        </div>
      </main>
    </>
  )
}

const LoadingSkeleton = () => {
	return (
		<div className='flex items-center space-x-12 mt-4 px-6'>
			<div className='w-6 h-6 shrink-0 rounded-full bg-dark-layer-1'></div>
			<div className='h-4 sm:w-52  w-32  rounded-full bg-dark-layer-1'></div>
			<div className='h-4 sm:w-52  w-32 rounded-full bg-dark-layer-1'></div>
			<div className='h-4 sm:w-52 w-32 rounded-full bg-dark-layer-1'></div>
			<span className='sr-only'>Loading...</span>
		</div>
	);
};
