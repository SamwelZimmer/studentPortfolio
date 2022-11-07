import Link from 'next/link';
import { motion } from 'framer-motion';
import { BiHomeAlt } from "react-icons/bi";

export default function Custom404() {
  return (
    <main className='flex flex-col gap-20 py-32 text-center items-center justify-center bg-black-shifting text-white'>
      <h2 className='text-3xl opacity-50 font-thin'>404</h2>

      <div className='flex flex-col gap-6'>
        <h1 className='text-5xl'>Yeah ...</h1>
        <h3 className='text-3xl opacity-70'>... What you{"'"}re looking for aint here.</h3>
        <h4 className='text-xl opacity-30'>My bad.</h4>
      </div>
    
      <div className='flex flex-col gap-3 justify-center items-center'>
        <p className='text-xl'>Come on, I{"'"}ll walk you home</p>
        <Link href="/feed">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className='border border-white hover:text-secondary rounded-lg p-3'><BiHomeAlt /></motion.button>
        </Link>
      
      </div>

      {/* <iframe
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe> */}
      {/* <Link href="/">
        <button className="btn-blue">Go home</button>
      </Link> */}
    </main>
  );
}