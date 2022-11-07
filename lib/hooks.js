import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';

import { firestore, auth } from './firebase';

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
      // turn off realtime subscription
      let unsubscribe;
  
      if (user) {
        const ref = doc(getFirestore(), 'users', user.uid);
        unsubscribe = onSnapshot(ref, (doc) => {
          setUsername(doc.data()?.username);
        });
      } else {
        setUsername(null);
      }
  
      return unsubscribe;
    }, [user]);

    return { user, username };
}