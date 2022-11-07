import { motion } from "framer-motion";
import { AiOutlineInfoCircle } from "react-icons/ai";


export default function InfoText({ primaryText, secondaryText, tertiaryText="" }) {
  return (
    <div className="info-dropdown">
        <motion.button type="button" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="info-btn flex items-center justify-center cursor-pointer">
            <AiOutlineInfoCircle />
        </motion.button>
        <div className="info-dropdown-menu flex flex-col bg-primary rounded-2xl text-center w-52 p-4 border border-dimWhite shadow-2xl">
            <p className="brown-text opacity-80 text-sm">{primaryText}</p>
            <p className="brown-text opacity-50 text-xs">{secondaryText}</p>
            <p className="brown-text opacity-30 text-xs">{tertiaryText}</p>
        </div>
    </div>
  );
}
