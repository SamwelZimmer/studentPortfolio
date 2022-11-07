import Link from "next/link";
import { BsTwitter } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { motion } from "framer-motion";

export default function UserProfile({ user }) {
  const course = user?.course || null;
  const establishment = user?.institution || null;
  const bio = user?.bio || null;
  const twitterURL = user?.socials?.twitter || null;
  const facebookURL = user?.socials?.facebook || null;
  const instagramURL = user?.socials?.instagram || null;
  const linkedinURL = user?.socials?.linkedin || null;

    return (
      <div className="text-white z-40 py-12 flex flex-col items-center gap-16">

        <div className="flex flex-row justify-center items-center gap-4">
          {user.photoURL && 
            <img referrerPolicy='no-referrer' src={user.photoURL} className="card-img-center w-[70px] aspect-square rounded-full" />
          }
          <i className="text-xl">@{user.username}</i>
        </div>

        <div className="flex flex-col justify-center items-center gap-12">
          {user.displayName && 
            <h2 className="text-3xl font-semibold">{user.displayName || 'Anonymous User'}</h2>
          }
          <div className="flex flex-col justify-center items-center gap-2">
            <h3 className="text-xl font-light">{course}</h3>
            <h4 className="text-xl font-thin">{establishment}</h4>
          </div>
        </div>

        <div className="flex flex-row items-center justify-center gap-6">
          {twitterURL && 
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}  href={twitterURL} className="hover:text-secondary">
              <BsTwitter size={25} />
            </motion.a>
          } 
          {facebookURL && 
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={facebookURL} className="hover:text-secondary">
              <BsFacebook size={25} />
            </motion.a>
          }
          {instagramURL &&
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={instagramURL} className="hover:text-secondary">
              <BsInstagram size={25} />
            </motion.a>
          }
          {linkedinURL && 
            <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} href={linkedinURL} className="hover:text-secondary">
              <BsLinkedin size={25} />
            </motion.a>
          }
        </div>

        <div className="w-full px-12 text-justify sm:w-[500px] text-dimWhite">
          {bio &&
            <p>{bio}</p>
          }
        </div>

      </div>
    );
  }