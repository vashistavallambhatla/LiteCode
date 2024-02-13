import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ToastContainer,toast } from 'react-toastify';
import { RecoilRoot } from 'recoil';
import "react-toastify/dist/ReactToastify.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Head>
        <title>LiteCode</title>
        <meta name="description" content="Web application that let's you solve DSA problems along with their solution" />
        <link rel="icon" href='/favicon.png'/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ToastContainer/>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
