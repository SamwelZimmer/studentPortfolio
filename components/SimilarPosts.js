import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { query, where, orderBy, limit, collectionGroup, getDocs, startAfter, getFirestore } from 'firebase/firestore';
// import HorizontalScroll from 'react-horizontal-scrolling'
import Link from 'next/link';

import { postToJSON } from '../lib/firebase';
import { truncateString } from '../lib/helpers';
import InfoText from './InfoText';

// Max posts to query per page
const LIMIT = 10;

const SimilarPosts = ({ post }) => {

    const [similarPosts, setSimilarPosts] = useState([]);

    const removeCurrentPost = () => {
        const filtered = similarPosts.filter((item) => {
            return `${item.username}/${item.slug}` !== `${post.username}/${post.slug}`
        })
        return filtered
    }

    const getPostsByTag = async (tags) => {
        if (!tags) return [];
        const ref = collectionGroup(getFirestore(), 'posts');
        const postsQuery = query(
            ref,
            where('tags', 'array-contains-any', tags),
            orderBy('createdAt', 'desc'),
            limit(LIMIT),
        );

        const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
        return posts;
    }

    const recPosts = getPostsByTag(post.tags)

    useEffect(() => {
        recPosts.then((res) => {
            setSimilarPosts(res)
        })
    }, []);

    removeCurrentPost();

    return (
        <>
            {removeCurrentPost().length > 0 ?
                removeCurrentPost().map((post, i) => (
                    <Link key={i} href={`/${post.username}/${post.slug}`}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='flex flex-row m-3 items-center w-full sm:w-[300px] text-white justify-between rounded-lg border gap-3 border-dimWhite p-3 px-6 hover:border-white cursor-pointer'>
                            <p className=''>{truncateString(post?.title, 20)}</p>
                            <p className='text-gradient'>{truncateString(post?.username, 15)}</p>
                        </motion.div>
                    </Link>
                ))
            : 
                <div className='flex flex-row w-full items-center justify-center gap-6'>
                    <p className='text-center w-max opacity-70'>There are currently no similar posts</p>
                    <InfoText primaryText={"Not similar? Says who?"} secondaryText={"To show up here, a post must have one or more tags which match the tags of this post."} tertiaryText={"Tags can be assigned when creating the post."} />
                </div>
            }
        </>
    );
}

export default SimilarPosts;