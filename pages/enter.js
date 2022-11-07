import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AiOutlineGoogle } from "react-icons/ai";
import { signInWithPopup, signInWithRedirect, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import debounce from 'lodash.debounce';
import { doc, getFirestore, writeBatch, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

import { auth, googleAuthProvider } from "../lib/firebase";
import { UserContext } from '../lib/context';

export default function Enter({ }) {
    const router = useRouter()
    const { user, username } = useContext(UserContext);

    const [isSignup, setIsSignup] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);

    useEffect(() => {
        if (username) {
            router.push(`${username}`)
        }
    });

    const switchForm = () => {
        if (isSignup) setForgotPassword(false);
        setIsSignup(!isSignup);
    }

    const toggleForgotPassword = () => {
        setForgotPassword(!forgotPassword);
    }

    return (
        <>
            <main className='bg-black-shifting relative w-full pb-28 overflow-hidden text-white px-6 flex flex-col justify-center items-center'> 
                <div className='absolute w-[30%] h-[20%] -right-20 -bottom-20 pink__gradient' />
                <div className='absolute w-[40%] h-[30%] -left-20 top-[50%] blue__gradient' />

                <h2 className='pb-12 pt-32 text-5xl'>You want in?</h2>
                { !user &&
                    <div className='flex flex-col w-full gap-12 sm:flex-row justify-center'>
                        <div className='flex flex-col gap-2'>
                            <div className='z-10 bg-primary w-full sm:w-[500px] h-[400px] border border-white rounded-lg p-6'>
                                {isSignup ? <SignUpForm /> : <LoginForm toggleForgotPassword={toggleForgotPassword} />}
                            </div>
                            {!user && (
                                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={switchForm}>
                                    {isSignup ? <p className='text-center opacity-50 text-xs underline'>Already got an account?</p> : <p className='text-center opacity-50 text-xs underline'>Need an account?</p>}
                                </motion.button>
                            )}
                        </div>
                        <div className='flex flex-col gap-12 w-full sm:w-1/3 justify-center items-center'>
                            {(forgotPassword && !isSignup) ? <ForgotPassword /> : <UseGoogle />}
                        </div>
                    </div>

                }
                {(user && !username) && (
                    <UsernameForm />
                )}
                {/* { user ?
                    !username ? <UsernameForm /> : <SignOutButton />
                    :
                    <SignInWithGoogleButton />
                } */}
            </main>
  
        </>
    );
}

// function SignInWithGoogleButton() {
//     const signInWithGoogle = async () => {
//         await signInWithPopup(auth, googleAuthProvider)
//     };

//     return (
//         <button onClick={signInWithGoogle}>
//             <AiOutlineGoogle color='blue' />
//         </button>
//     );
// };

const signInWithGoogle = async () => {
    await signInWithRedirect(auth, googleAuthProvider)
};


function SignOutButton() {
    return (
        <button onClick={() => auth.signOut()}>
            Sign Out
        </button>
    )
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();
        // Create refs for both documents
        const userDoc = doc(getFirestore(), 'users', user.uid);
        const usernameDoc = doc(getFirestore(), 'usernames', formValue);
        // Commit both docs together as a batch write.
        const batch = writeBatch(getFirestore());
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL || "", displayName: user.displayName || "", email: user.email || signupEmail, ppCode: GeneratePPCode()});
        batch.set(usernameDoc, { uid: user.uid });
    
        await batch.commit();

        console.log(formValue);
    }

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }
  
        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    }

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // Hit the database for username match after each debounced change
    // useCallback is required for debounce to work
    const checkUsername = useCallback(
        debounce(async (username) => {
          if (username.length >= 3) {
            const docRef = doc(getFirestore(), 'usernames', username);
            const snap = await getDoc(docRef);
            console.log('Firestore read executed!', snap.exists());
            setIsValid(!snap.exists());
            setLoading(false);
          }
        }, 500),
        []
    );

    return (
        !username && (
            <section className='text-center bg-primary my-20 border z-10 flex flex-col gap-12 border-white rounded-lg py-12 px-6'>
                <div>                
                    <h3 className='text-3xl'>Time to choose a username</h3>
                    <p className='text-sm opacity-50 text-dimWhite'>This is the name visible on your posts - it cannot be changed</p>
                </div>
                <form className='flex flex-col gap-2' onSubmit={onSubmit}>
                    <input required placeholder='username' value={formValue} onChange={onChange} type="text" id="username" className="block w-full p-2.5 text-sm placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" />
                    {/* <input name="username" placeholder="username" value={formValue} onChange={onChange} /> */}
                    <div>
                        {formValue.length > 1 ? 
                            (!loading ? 
                                (isValid ? <p className='text-green-600'>{"'"}{formValue}{"'"} is available</p> : <p className='text-red-500'>{"'"}{formValue}{"'"} is unavailable or invalid</p>)
                            :
                            (<p className='opacity-50'>Checking ...</p>)
                            )
                        : 
                        <p className='opacity-0'>hidden text placeholder</p>
                        }
                        
                        {/* {(formValue.length > 1 && !loading) && (
                            isValid ? <p className='text-green-600'>'{formValue}' is available</p> : <p className='text-red-500'>'{formValue}' is unavailable or invalid</p>
                        )}
                        {(formValue.length > 1 && loading) && (
                            <p className='opacity-50'>Checking ...</p>
                        )} */}
                    </div>
                    <motion.button className='border border-secondary mt-3 p-3 rounded-xl w-1/2 self-center cursor-pointer' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={!isValid}>
                        This is the one
                    </motion.button>
                   
                    {/* <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div> */}
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <p></p>;
    }
}

function SignUpForm() {
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    const registerWithEmailAndPassword = async (email, password) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        registerWithEmailAndPassword(signupEmail, signupPassword);
    }

    return (
        <div className='h-full w-full flex flex-col items-center justify-between'>
            <h3 className='h-full w-2/3 flex pt-6 text-center opacity-60 text-2xl'>Let{"'"}s get to know each other first, huh</h3>
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
                <div className="w-full flex flex-col">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-dimWhite">Email Please* <span className='text-xs opacity-25 pl-12'>*jumping in anticipation*</span></label>
                    <input required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} type="email" id="email" className="block w-full p-2.5 text-sm placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="skinny-king@university.com" />
                </div>

                <div className="w-full flex flex-col ">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-dimWhite">And Password* <span className='text-xs opacity-25 pl-12'>*puking with excitment*  </span></label>
                    <input required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} type="password" id="password" className="block w-full p-2.5 text-sm placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="Now, why would I tell you?" />
                </div>

                <motion.button type='submit' className='bg-blue-gradient text-primary hover:text-white self-center w-1/2 border border-transparent p-3 rounded-xl hover:border-white' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97}}>Let{"'"}s go</motion.button>
            </form>
        </div>
    )
}

function LoginForm({ toggleForgotPassword }) {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const logInWithEmailAndPassword = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            toast.error(`Login Failed: ${err.message}`, {
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
        }    
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        logInWithEmailAndPassword(loginEmail, loginPassword)
    }
    return (
        <div className='h-full w-full flex flex-col items-center justify-between'>
            <h3 className='h-full w-2/3 flex pt-6 justify-center text-center opacity-60 text-2xl'>ohh, yeah ... <br /> I remeber you</h3>
            <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
                <div className="w-full flex flex-col">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-dimWhite">Sorry, I don{"'"}t remember your email</label>
                    <input type="email" id="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="block w-full p-2.5 text-sm placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="skinny-king@university.com" />
                </div>

                <div className="w-full flex flex-col ">
                    <div className='flex flex-row w-full justify-between'>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-dimWhite">For this I{"'"}ll close my eyes</label>
                        <motion.button type='button' onClick={toggleForgotPassword} className="block mb-2 text-sm font-medium text-dimWhite hover:underline">Forgor?</motion.button>
                    </div>
                    <input type="password" id="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="block w-full p-2.5 text-sm placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="Now, why would I tell you?" />
                </div>
                <motion.button type='submit' className='bg-blue-gradient text-primary hover:text-white self-center w-1/2 border border-transparent p-3 rounded-xl hover:border-white' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97}}>Back to it</motion.button>

            </form>
        </div>
    )
}

function UseGoogle() {
    return (
        <>
            <div className="w-full flex flex-row items-center justify-center">
                <hr className=" my-4 mx-auto w-1/4 h-[1px] bg-secondary opacity-10 rounded border-0 md:my-10" />
                <p className='opacity-30'>or</p>
                <hr className=" my-4 mx-auto w-1/4 h-[1px] bg-secondary opacity-10 rounded border-0 md:my-10" />
            </div>
            <p className='text-center text-xl font-normal opacity-70'>let Google do the work ...</p>
            <motion.div whileHover={{ scale: 1.1, rotate: -30 }} whileTap={{ scale: 0.9, rotate: 150 }} onClick={signInWithGoogle} className='w-[100px] aspect-square rounded-full bg-blue-gradient p-[1px] cursor-pointer'>
                <div className='bg-primary w-full h-full rounded-full flex justify-center items-center'>
                    <AiOutlineGoogle size={30} />
                </div>
            </motion.div>
        </>
    )
}

function ForgotPassword() {
    const [resetEmail, setResetEmail] = useState("");
    const [isSent, setIsSent] = useState(false);

    const handlSubmit = (e) => {
        e.preventDefault();
        sendPasswordReset(resetEmail);
        setIsSent(true)
        console.log(resetEmail);
    }

    return (
        <div>
            {isSent ? 
            (<div className='flex flex-col pt-12 sm:pt-0 gap-6 sm:gap-12  justify-center items-center text-center'>
                <p className=''>If you{"'"}ve got an account linked to that email then you{"'"}ll get a link to reset your password</p>
                <p className='opacity-70'>Otherwise don{"'"}t hold your breath</p>
                <p className='opacity-30'>Or do, IDC</p>
            </div> )
            :
            (<form onSubmit={handlSubmit} className='flex flex-col pt-12 sm:pt-0 gap-6 sm:gap-12  justify-center items-center text-center'>
                <p className='opacity-70'>Nice Job!</p>
                <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} id="forgotPassword" className="block w-full p-2.5 text-sm placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="Just give me your email" />
                <p><span className='opacity-50'>Fine.</span><br /> Just say the word</p>
                <motion.button type='submit' className='border border-secondary rounded-lg p-3 ' whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9}}>{'"'}The Word{'"'}</motion.button>
            </form>)
            }

        </div>
        
    )
}

// Creating values to be interpreted as randomly assigned profile picture
function GeneratePPCode() {
    const bgDir = Math.floor(Math.random() * 8);
    const bgFrom = Math.floor(Math.random() * 8);
    const bgTo = Math.floor(Math.random() * 8);
    const imgValue = Math.floor(Math.random() * 11);
    return `${bgDir}.${bgFrom}.${bgTo}-${imgValue}`
}

//function to send reset password link to users email
const sendPasswordReset = async (email) => {
    try {
        sendPasswordResetEmail(auth, email);
        toast.success('Your email just got graced with a link to reset your password! \nTry to remember it this time.', {
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
    } catch (err) {
        toast.error(`Error: ${err.message}`, {
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
    }
};