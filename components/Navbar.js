import Link from 'next/link';
import React, { useContext } from 'react';
import { useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

import { UserContext } from '../lib/context';

const Navbar = () => {
    const { user, username } = useContext(UserContext);
    const [toggle, setToggle] = useState(false);

    function toggleDropdown() {
        var x = document.getElementById("navbar-cta");
        x.classList.toggle("hidden");
    }

    return (
        <nav className="absolute w-full z-50 top-0 left-0 px-8 md:px-32 py-4">
            <div className="container flex flex-wrap justify-between items-center mx-auto">
                <div className='order-1 px-3 md:px-0'>
                    <Link href="/" className='flex items-center'>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <span className="md:hidden self-center text-xl text-secondary hover:text-white font-poppins font-semibold whitespace-nowrap">S</span>
                            <span className="md:hidden self-center text-xl text-white hover:text-secondary font-poppins font-semibold whitespace-nowrap">P</span>
                            <div className='flex flex-row'>
                                <span className="hidden md:flex self-center text-xl text-secondary hover:text-white font-poppins font-semibold whitespace-nowrap">Student</span>
                                <span className="hidden md:flex self-center text-xl text-white hover:text-secondary font-poppins font-semibold whitespace-nowrap">Portfolio</span>
                            </div>

                        </motion.button>
                    </Link>
                </div>
            
                
                { !username && 
                    <div className="flex order-2 items-center w-max md:w-32 justify-end">
                        <Link href="/enter">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" className="text-white flex flex-row border border-secondary font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 hover:border-white">Get started</motion.button>
                        </Link>
                        <button onClick={toggleDropdown} data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden" aria-controls="navbar-cta" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <div className='w-full h-full object-contain flex items-center justify-center' onClick={() => setToggle((prev) => !prev)}>
                            { toggle ? <HiX size={30}  /> : <HiMenuAlt3 size={30} /> }
                        </div>                       
                        </button>
                    </div>
                }

                { username && 
                    <div className="flex order-2 items-center w-32 justify-end">
                        <Circle username={username} />
                        <button onClick={toggleDropdown} data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden" aria-controls="navbar-cta" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <div className='w-full h-full object-contain flex items-center justify-center' onClick={() => setToggle((prev) => !prev)}>
                            { toggle ? <HiX size={30}  /> : <HiMenuAlt3 size={30} /> }
                        </div>
                        
                        </button>
                    </div>
                }
                


                <div className="hidden justify-between items-center w-full md:flex md:w-auto order-3 md:order-1" id="navbar-cta">
                    <ul className="flex flex-col text-right p-4 px-12 mt-4 bg-primary bg-opacity-30 backdrop-blur-xl md:bg-transparent rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0">
                        <Link href="/feed">
                            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} >
                                <a className="block cursor-pointer py-2 pr-4 pl-3 text-secondary opacity-60 bg-custPurpleNavy rounded md:bg-transparent font-poppins md:p-0" aria-current="page">Home</a>
                            </motion.li>
                        </Link>
                        <Link href="/admin">
                            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} >
                                <a className="block py-2 pr-4 pl-3 text-dimWhite hover:text-white opacity-60 rounded md:hover:bg-transparent font-poppins cursor-pointer  md:p-0">My Posts</a>
                            </motion.li>
                        </Link>
                        
                        <Link href="/recruit">
                            <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} >
                                <a className="block py-2 pr-4 pl-3 text-dimWhite hover:text-white opacity-60 rounded md:hover:bg-transparent cursor-pointer md:p-0">Recruiters</a>
                            </motion.li>
                        </Link>                       
                    </ul>
                </div>
            
            </div>
        </nav>

        
        // <nav>
        //     <ul>
        //         <li>
        //             <Link href="/">
        //                 <button>FEED</button>
        //             </Link>
        //         </li>
                

        //         { username && (
        //             <>
        //                 <li>
        //                     <Link href="/admin">
        //                         <button>Write Post</button>
        //                     </Link>
        //                 </li>
        //                 <li>
        //                     <Link href={`/${username}`}>
        //                         <img src={user?.photoURL} />
        //                     </Link>
        //                 </li>
        //             </>

        //         )}

        //         { !username && (
        //             <li>
        //                 <Link href="/enter">
        //                     <button>Log In</button>
        //                 </Link>
        //             </li>
        //         )}
            

        //     </ul>
        // </nav>
    );
}

const Circle = ({ username }) => {
    return (
        <Link href={`/${username}`}>
            <motion.div whileHover={{ rotate: 90 }} whileTap={{ rotate: -270 }} className={`flex items-end justify-center w-[40px] aspect-square rounded-full bg-blue-gradient p-[2px] cursor-pointer`}>
                <div className={`flex items-end justify-center flex-col bg-primary w-[100%] h-[100%] rounded-full`}>
                    <div className={`flex items-end justify-center flex-row`}>
            
                    </div>
                </div>
            </motion.div>
        </Link>
       
      )
}

export default Navbar;