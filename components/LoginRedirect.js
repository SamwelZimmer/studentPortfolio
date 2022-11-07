import { motion } from "framer-motion";
import Link from "next/link";

const LoginRedirect = () => {
    return (

        
        <main className="bg-black-shifting text-white flex flex-col gap-28 w-full top-0 py-12 px-6 justify-center items-center">
            <div className='absolute w-[50%] h-[50%] right-0 -bottom-20 blue__gradient' />
            <div className='absolute w-[20%] h-[30%] -left-20 top-[50%] pink__gradient' />


            <div className="flex flex-col text-center text-white gap-6 px-6">
                <h1 className="text-6xl">Nuh Uh ...</h1>
                <h2 className="text-4xl">... where do you think you're going?</h2>
            </div>
            <div className="bg-primary shadow-2xl border z-10 border-dimWhite rounded-lg flex flex-col gap-20 justify-center items-center px-6 py-20 w-max sm:w-[700px]">
                <div className="flex flex-row gap-6">
                    <Link href="/enter">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-blue-gradient rounded-lg py-3 px-6 font-thin capitalize text-primary">LOGIN</motion.button>
                    </Link>
                    <Link href="/feed">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-blue-gradient rounded-lg p-[1px]">
                            <div className="w-full h-full rounded-lg py-3 px-6 font-thin bg-primary">
                                HOME
                            </div>
                        </motion.button>
                    </Link>
                </div>
                <div className="flex flex-col gap-6 text-center">
                        <h3 className="text-2xl opacity-50">Yeah, that's right.</h3>
                        <h4 className="text-2xl opacity-70">{'Nowhere - unless you sign in   :)'}</h4>
                </div>
            </div>
        </main>
    )
}

export default LoginRedirect