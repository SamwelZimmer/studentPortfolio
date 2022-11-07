import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Toaster } from 'react-hot-toast';

import { UserContext } from '../lib/context';
import { useUserData } from '../lib/hooks';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';



function MyApp({ Component, pageProps }) {

  const userData = useUserData();

  return (
    <UserContext.Provider value={userData} >
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
      <Footer />
    </UserContext.Provider>
  )
}

export default MyApp
