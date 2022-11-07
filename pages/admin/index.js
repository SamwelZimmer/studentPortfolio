import { serverTimestamp, query, collection, orderBy, getFirestore, setDoc, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { auth } from '../../lib/firebase';
import Loader from '../../components/Loader';
import Link from 'next/link';
import LoginRedirect from '../../components/LoginRedirect';


export default function AdminPostPage(props) {
    return (
        // how can i make it so the page shows loading rather than jumping from <LoginRedirect /> to this page?
        // can i store the user in local storage?
        <main className="py-32 text-white bg-black-shifting flex flex-col gap-20 items-center justify-center">
            <AuthCheck fallback={<LoginRedirect />}>
                <div className='flex flex-col px-12 w-full sm:w-1/2 text-4xl sm:text-6xl'>
                    <h1 className='px-6 text-center'>Upload, View and Edit your Projects</h1>
                </div>
                
                <CreateNewPost />
                <hr className="my-4 mx-auto w-48 h-[2px] bg-dimBlue rounded border-0 md:my-10" />
                <div className='flex flex-col gap-6'>
                    <h3 className='text-gradient text-center text-3xl font-thin'>Exisiting Work</h3>
                    <div className="grid grid-cols-1 mx-6 gap-6 ss:grid-cols-2 md:grid-cols-3">
                        <PostList />
                    </div> 
                </div>
            </AuthCheck>
        </main>
    );
}

function PostList() {
    const ref = collection(getFirestore(), 'users', auth.currentUser.uid, 'posts')
    const postQuery = query(ref, orderBy('createdAt'))
  
    const [querySnapshot] = useCollection(postQuery);
  
    const posts = querySnapshot?.docs.map((doc) => doc.data());
  
    return (
      <>
        <PostFeed posts={posts} admin />
      </>
    );
  }

function CreateNewPost() {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    // Ensure slug is URL safe
    const slug = encodeURI(kebabCase(title));

    // Validate length
    const isValid = title.length > 3 && title.length < 100;

    // Create post in firestore
    const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(getFirestore(), 'users', uid, 'posts', slug);

        // Give all fields a default value here
        const data = {
            title,
            slug,
            uid,
            username,
            imgLink: "",
            published: false,
            description: '',
            content: '# ',
            tags: '',
            extLink: '',
            type: 'general',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            heartCount: 0,
        };

        await setDoc(ref, data);

        toast.success('Post Created', {
            style: {
              border: '1px solid #00040f',
              padding: '16px',
              color: '#00040f',
            },
            iconTheme: {
              primary: '#00040f',
              secondary: '#ffffff',
            },
          });
    
        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
    }

    return (
        <form className='flex flex-col justify-center items-center gap-6 w-full' onSubmit={createPost}>
            <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-dimWhite px-2.5">Project Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" id="first_name" className="bg-transparent text-dimWhite text-sm rounded-lg block w-full p-2.5 border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="Lemme get uhh.." required />
            </div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-blue-gradient rounded-lg p-[1px]">
                <motion.button type="submit" disabled={!isValid} className="w-full h-full bg-primary rounded-lg p-3 cursor-pointer">
                    Create
                </motion.button>
            </motion.div>
        </form>
    )
}