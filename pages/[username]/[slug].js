import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsHeart } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

import { firestore, getUserWithUsername, postToJSON } from '../../lib/firebase';
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import SimilarPosts from '../../components/SimilarPosts';


export async function getStaticProps({ params }) {
    const { username, slug } = params;
    const userDoc = await getUserWithUsername(username);

    let post;
    let path;

    if (userDoc) {
        const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);
        post = postToJSON(await getDoc(postRef));
        path = postRef.path;
    }
    return {
        props: { post, path },
        revalidate: 100,
    };
}

export async function getStaticPaths() {
    // Improve my using Admin SDK to select empty docs
    const q = query(
      collectionGroup(getFirestore(), 'posts'),
      limit(20)
    )
    const snapshot = await getDocs(q);
  
    const paths = snapshot.docs.map((doc) => {
      const { slug, username } = doc.data();
      return {
        params: { username, slug },
      };
    });
  
    return {
      paths,
      fallback: 'blocking',
    };
}

export default function Post(props) {
    const postRef = doc(getFirestore(), props.path);
    const [realtimePost] = useDocumentData(postRef);
    const post = realtimePost || props.post;

    const GetDate = () => {
        const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();
    
        let date = createdAt.toISOString().split("T")[0];
        date = `${date.split("-")[2]}/${date.split("-")[1]}/${date.split("-")[0]}`
    
        return (
          <span className="text-xs font-thin text-dimWhite opacity-50 flex items-center justify-center mt-1"> 
            {date}
          </span>
        )
    }


    const signInNotification = () => {
        return (
            toast((t) => (
                    <span className='flex flex-row items-center gap-4'>
                    <Link href="/enter">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex flex-row w-max p-3 items-center gap-2 shadow-lg rounded-lg border border-secondary text-white">
                            Sign in to <BsHeartFill size={15} />
                        </motion.button>
                    </Link>
                  <motion.button className='text-dimWhite' whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toast.dismiss(t.id)}>
                    <BsXLg />
                  </motion.button>
                </span>
              ), {style: {background: '#00040f', border: '1px solid rgba(255, 255, 255, 0.7)'}})
                
        )
        
    }

    return (
        <main className='bg-primary py-32 text-white flex flex-col justify-center items-center px-6 w-full'>

            <div className="flex flex-col items-center text-white gap-6 p-6">
                <h1 className='font-semibold text-3xl'>{post?.title}</h1>
                <Link href={`/${post.username}/`}>
                    <motion.a whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-xl text-gradient cursor-pointer">@{post.username}</motion.a>
                </Link>{' '}
            </div>

            <div className="bg-black-gradient flex flex-col sm:flex-row w-full sm:w-[700px] gap-6 p-6 rounded-lg">
                {post.imgLink && (
                     <div className='bg-gray-gradient shadow-2xl p-3 flex justify-center items-center border border-primary bg-opacity-50 rounded-lg w-full aspect-[2/1]'>    
                        <img alt='link to image' src={post.imgLink} />
                    </div>
                )}
               
         
                <div className='flex flex-col justify-between w-full items-center gap-2'>
                    <span className='text-white flex w-full text-justify'>
                        <ReactMarkdown className='text-left'>{post?.description}</ReactMarkdown>
                    </span>
                    <ReactMarkdown className='text-dimWhite'>{post?.content}</ReactMarkdown>
                    <div className='flex flex-row-reverse justify-between items-center w-full'>
                        <span className='flex flex-row items-center justify-center gap-2 text-white opacity-50'>
                            {/* <BsHeartFill size={15} /> {post.heartCount || 0} */}
                            <AuthCheck fallback={<button onClick={signInNotification} className='flex flex-row items-center justify-center gap-2'>{post.heartCount || 0}<BsHeart/></button>}>
                                <div className='flex flex-row items-center justify-center gap-2'>
                                    {post.heartCount || 0}
                                    <HeartButton postRef={postRef} /> 
                                </div>
                            </AuthCheck>
                        </span>


                        {/* need to find a way to catch errors if link is invald */}
                        {post.extLink &&  (
                            <Link href={post.extLink}>
                                <p className='text-white opacity-50 hover:underline cursor-pointer'>Check it out</p>
                            </Link>
                        )}
                       
                    </div>
                </div>
            </div>
            <GetDate />
            <section className='w-full my-28 flex flex-col text-center gap-6'>
                <p className='text-gradient capitalize font-thin text-3xl'>Related Posts</p>
                <div className='w-full flex flex-col sm:flex-row gap-6'>
                    <SimilarPosts post={post} />
                </div>
            </section>
        </main>
    );
}