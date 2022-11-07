import Link from 'next/link';
import { BsHeartFill } from "react-icons/bs";
import { BsHeart } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { motion } from 'framer-motion';


export default function PostFeed({ posts, admin }) {
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : <p className='text-center flex w-full self-center text-white text-2xl'>No Posts Yet</p>;
}

function PostItem({ post, admin = false }) {

    // const wordCount = post?.content.trim().split(/\s+/g).length;
    // const minsToRead = (wordCount / 100 + 1).toFixed(0);

    // const extLink = "http://google.com";


    function truncateString(str, num) {
        if (str == null) return "";
        if (str.length <= num) {
            return str
        }
        return str.slice(0, num) + '...';
    }

    return (

        <Link href={`/${post.username}/${post.slug}`}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`${post.imgLink ? "row-span-2" : ""} bg-black-gradient flex flex-col gap-6 items-center justify-center w-80 rounded-lg p-6 cursor-pointer`}>
                <Link href={`/${post.username}/${post.slug}`}>
                    <h2 className='text-white text-lg cursor-pointer font-semibold'>
                        <a>{truncateString(post.title, 25)}</a>
                    </h2>
                </Link>
                
                {(post.type === "Art" && post.imgLink) && 
                    <div className='bg-gray-gradient flex justify-center items-center shadow-2xl border border-primary bg-opacity-50 rounded-lg w-full p-3'>    
                        <img className='object-cover' src={post.imgLink} />
                    </div> 
                } 
                <p className='text-white text-left opacity-70'>{truncateString(post?.description, 65)}</p> 
                
                
            
                {!admin && (
                    <Link href={`/${post.username}`}>
                        <strong className='text-secondary text-lg cursor-pointer hover:underline'>@{post.username}</strong>
                    </Link>
                )}
                
                <div className='flex flex-row-reverse w-full justify-between'>
                    <span className='flex flex-row items-center justify-center gap-2 text-white opacity-50'><BsHeartFill size={15} /> {post.heartCount || 0}</span>
                    {post.extLink &&
                        <Link href={post?.extLink}>
                            <p className='text-white opacity-50 hover:underline'>Check it out</p>
                        </Link>}
                </div>

                {/* If admin view, show extra controls for user */}
                {admin && (
                    <div className='flex flex-row w-full justify-between px-6'>
                    <Link href={`/admin/${post.slug}`}>
                        <h3>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="text-xl font-thin hover:text-secondary"><AiOutlineEdit /></motion.button>
                        </h3>
                    </Link>

                    {post.published ? 
                    <p className="font-thin" >Status: <span className='font-medium'>Live</span></p> : 
                    <p className="font-thin">Status: <span className='font-medium'>Unpublished</span></p>}
                    </div>
                )}
            </motion.div>
        </Link>
    );
}

