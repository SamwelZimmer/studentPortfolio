import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function Footer() {
    const router = useRouter();

    var current = new Date();

    return (
        <footer className="p-10 w-full flex flex-col gap-6 text-white bg-primary border border-primary border-t-dimWhite shadow ">
                <div className="cursor-pointer flex justify-center items-center mb-4 sm:mb-0">
                    <motion.img whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9, rotate: -15}} src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-8 cursor-default" alt="Logo" />
                    <motion.span whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9}} onClick={ () => router.push("/") } className="self-center text-2xl font-semibold whitespace-nowrap brown-text"><span className="text-gradient">Student</span>Portfolio</motion.span>
                </div>
                <div className="flex flex-row justify-center items-center gap-6">
                    <p className="block text-xs grey-text sm:text-center md:text-sm">© {current.getFullYear()}</p>
                    <p className="block text-xs grey-text sm:text-center md:text-sm">All Rights Reserved.</p>
                </div>
                
        </footer>
    );
}