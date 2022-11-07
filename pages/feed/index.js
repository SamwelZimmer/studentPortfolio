import { motion } from 'framer-motion';
import { useState } from 'react';
import { Timestamp, query, where, orderBy, limit, collectionGroup, getDocs, startAfter, getFirestore } from 'firebase/firestore';

import Loader from '../../components/Loader';
import PostFeed from '../../components/PostFeed';
import { postToJSON } from '../../lib/firebase';

// Max posts to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {
  const ref = collectionGroup(getFirestore(), 'posts');
  const postsQuery = query(
    ref,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT),
  )

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
 
  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);


  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;

    const ref = collectionGroup(getFirestore(), 'posts');
    const postsQuery = query(
      ref,
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT),
    )

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main className="py-32 text-white bg-black-shifting flex flex-col items-center justify-center">

      <div className='flex flex-col px-12 w-full sm:w-1/2 text-4xl sm:text-6xl'>
          <h1 className='px-6 text-center'>Explore the Handywork of Others</h1>
      </div>

      <div className="mt-20 grid grid-cols-1 grid-rows- ss:grid-cols-2 md:grid-cols-3 mx-6 gap-6 post-grid">
          <PostFeed posts={posts} />
      </div>

        {!loading && !postsEnd && 
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='border border-opacity-40 border-secondary hover:border-dimWhite font-thin w-max p-3 mt-3 rounded-lg' onClick={getMorePosts}>Load More</motion.button>
        }

      <Loader show={loading} />

      {postsEnd && <p className='font-thin mt-6'>No more posts to load</p>}
    </main>
  );
}
