import { useDocument } from 'react-firebase-hooks/firestore';
import { increment, writeBatch, doc, getFirestore } from "firebase/firestore";
import { BsHeart } from "react-icons/bs";
import { BsHeartFill } from "react-icons/bs";
import { motion } from 'framer-motion';

import { firestore, auth } from '../lib/firebase';

// Allows user to heart or like a post
export default function Heart({ postRef }) {
    // Listen to heart document for currently logged in user
    const heartRef = doc(getFirestore(), postRef.path, 'hearts', auth.currentUser.uid);
    const [heartDoc] = useDocument(heartRef);
  
    // Create a user-to-post relationship
    const addHeart = async () => {
      const uid = auth.currentUser.uid;
      const batch = writeBatch(getFirestore());
  
      batch.update(postRef, { heartCount: increment(1) });
      batch.set(heartRef, { uid });
  
      await batch.commit();
    };
  
    // Remove a user-to-post relationship
    const removeHeart = async () => {
      const batch = writeBatch(getFirestore());
  
      batch.update(postRef, { heartCount: increment(-1) });
      batch.delete(heartRef);
  
      await batch.commit();
    };
  
    return heartDoc?.exists() ? (
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={removeHeart} className="text-secondary"><BsHeartFill /></motion.button>
    ) : (
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={addHeart}><BsHeart /></motion.button>
    );
  }
