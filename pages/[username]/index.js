import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import { query, collection, where, getDocs, getDoc, doc, limit, orderBy, getFirestore, updateDoc } from 'firebase/firestore';
import { getUserWithUsername, postToJSON, auth, firestore, getUserUidFromUsername } from "../../lib/firebase";
import { UserContext } from "../../lib/context";
import InfoText from "../../components/InfoText";

import { motion } from "framer-motion";
import { useRouter } from "next/router";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { BsSave } from "react-icons/bs";
import { BsXSquare } from "react-icons/bs";
import toast from "react-hot-toast";


export async function getServerSideProps({ query: urlQuery }) {
    const { username } = urlQuery;
    const userDoc = await getUserWithUsername(username);

     // If no user, short circuit to 404 page
    if (!userDoc) {
        return {
        notFound: true,
        };
    }

    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();
        const postsQuery = query(
            collection(getFirestore(), userDoc.ref.path, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
        );
        posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return {
        props: { user, posts }, // will be passed to the page component as props
    };
}

export default function UserProfilePage({ user, posts }) {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [isEdit, setIsEdit] = useState(false);

    const handleLogout = () => {
        auth.signOut();
        router.push("/feed");
    }

    const toggleEdit = () => {
        setIsEdit(!isEdit);
    }
    
    return (
        <main className="py-32 bg-black-shifting flex flex-col items-center justify-center">
            <div className='absolute z-0 w-[40%] h-[20%] top-0 left-0 pink__gradient' />
            {/* <div className='absolute z-10 w-[80%] h-[80%] bottom-0 rounded-full white__gradient' /> */}
            <div className='absolute z-20 w-[50%] h-[50%] right-0 bottom-0 blue__gradient' />
        
            {isEdit ? <EditProfile toggleEdit={toggleEdit} user={user} /> : (
                <>
                    <UserProfile user={user} />
                    <h3 className='capitalize font-thin text-3xl text-gradient mt-12 pb-6'>PROJECTS</h3>
                    <div className="grid grid-cols-1 z-50 mx-6 gap-6 ss:grid-cols-2 md:grid-cols-3">
                        <PostFeed posts={posts} />
                    </div>
                    {user.username == username ? (
                        <div className="flex flex-row gap-6">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="text-white border border-opacity-50 border-secondary hover:border-white p-3 rounded-lg mt-12">
                                Logout
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={toggleEdit} className="text-white flex flex-row items-center gap-3 border border-opacity-50 border-secondary hover:border-white p-3 rounded-lg mt-12">
                                Edit <AiOutlineEdit />
                            </motion.button>
                        </div>
                        
                    ) : null }
                </>
            )}    
        </main>
    );
}

function EditProfile({ user, toggleEdit }) {

    // This means that the inputs are always "controlled" 
    const dummyData = {displayName: 'Name', institution: " ", course: " ", bio: " ", socials: {twitter: "twitter.com", facebook: " ", instagram: " ", linkedin: " "}}

    const [uid, setUid] = useState("");

    const [userData, setUserData] = useState(dummyData);
    const [displayName, setDisplayName] = useState("");
    const [institution, setInstitution] = useState("");
    const [course, setCourse] = useState("");
    const [bio, setBio] = useState("");

    const [twitter, setTwitter] = useState("");
    const [facebook, setFacebook] = useState("");
    const [instagram, setInstagram] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [allowEmail, setAllowEmail] = useState(true);

    const toggleEmail = () => {
        setAllowEmail(current => !current);
    };

    // getting users uid from the username collection then getting user data from user collection using the uid
    const getUserDataWithUid = async (uid) => {
        const docRef = doc(firestore, "users", `${uid}`);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            setUserData(docSnap.data())
            return docSnap.data()
        } else {
            console.log("No such document!");
        }
    }
    
    const getUserData = async () => {
        getUserUidFromUsername(user.username).then((result => {
            setUid(result.uid)
            getUserDataWithUid(result.uid)
        }));
    };

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        setDisplayName(userData?.displayName);
        setInstitution(userData?.institution);
        setCourse(userData?.course || "");
        setBio(userData?.bio || "");
        setTwitter(userData?.socials?.twitter || "");
        setFacebook(userData?.socials?.facebook || "");
        setInstagram(userData?.socials?.instagram || "");
        setLinkedin(userData?.socials?.linkedin || "");
    }, [userData]);

    const updateUserData = async () => {
        const docRef = doc(firestore, "users", `${uid}`);

        await updateDoc(docRef, {
            displayName: displayName,
            institution: institution,
            course: course,
            bio: bio,
            socials: {twitter: twitter, facebook: facebook, instagram: instagram, linkedin: linkedin},
            allowEmail: allowEmail
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUserData();
        toast.success("Profile Updated")
        toggleEdit();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col z-30 text-white items-center justify-center w-full gap-20">
            <div className="flex flex-row justify-center items-center gap-4">
                {user.photoURL && 
                    <Image alt="profile picture" referrerPolicy='no-referrer' src={user.photoURL} className="card-img-center w-[70px] aspect-square rounded-full" />
                }
                <i className="text-xl">@{user.username}</i>
                <hr className=" my-4 mx-auto w-1/4 h-[1px] bg-secondary opacity-10 rounded border-0 md:my-10" />

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-12">
                <div className="w-full flex flex-col items-center justify-center gap-6">
                    <div className="w-1/2 flex flex-row items-center justify-center gap-6">
                        <hr className="my-4 mx-auto w-1/4 h-[1px] opacity-20 bg-secondary rounded border-0 md:my-10" />
                        <p className='opacity-30'>General</p>
                        <hr className="my-4 mx-auto w-1/4 h-[1px] opacity-20 bg-secondary rounded border-0 md:my-10" />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-dimWhite">Display Name</label>
                        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} type="text" id="name" className="block w-full p-2.5 text-sm bg-opacity-80 placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="What should I call you?" />
                    </div>
                    <div className=" w-1/2">
                        <label htmlFor="institution" className="block mb-2 text-sm font-medium text-dimWhite w-full text-left">Institute Name</label>
                        <input value={institution} onChange={(e) => setInstitution(e.target.value)} type="text" id="institution" className="block w-full p-2.5 text-sm bg-opacity-80 placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="Who do you pay to learn shit?" />
                    </div>
                    <div className=" w-1/2">
                        <label htmlFor="course" className="block mb-2 text-sm font-medium text-dimWhite w-full text-left">Course</label>
                        <input value={course} onChange={(e) => setCourse(e.target.value)} type="text" id="course" className="block w-full p-2.5 text-sm bg-opacity-80 placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="What's your current course?" />
                    </div>
                    <div className=" w-1/2">
                        <div className="flex flex-row items-center justify-between">
                            <label htmlFor="bio" className="block mb-2 text-sm font-medium text-dimWhite w-full text-left">Bio</label>
                            <InfoText 
                                primaryText={"No longer than 150 characters, please."}
                                secondaryText={"Thank you. Please."}
                                tertiaryText={"(What a kind young person)"}
                            />
                        </div>
                        <input value={bio} maxLength="150" onChange={(e) => setBio(e.target.value)} type="text" id="course" className="block w-full p-2.5 text-sm bg-opacity-80 placeholder:opacity-50 text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="Tell me about yourself." />
                    </div>
                </div>

                <div className="w-full flex flex-col items-center justify-center gap-6">
                    <div className="w-1/2 flex flex-row items-center justify-center gap-6">
                        <hr className="my-4 mx-auto w-1/4 h-[1px] opacity-20 bg-secondary rounded border-0 md:my-10" />
                        <p className='opacity-30'>Contact</p>
                        <hr className="my-4 mx-auto w-1/4 h-[1px] opacity-20 bg-secondary rounded border-0 md:my-10" />
                    </div>
                    <div className="flex flex-row w-1/2 justify-between items-center gap-6">
                        <BsTwitter size={25} />
                        <input value={twitter} onChange={(e) => setTwitter(e.target.value)} type="url" id="twitter" className="block w-full p-2.5 text-sm bg-opacity-60 placeholder:opacity-50 text-white bg-transparent rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="https://twitter.com/joemama" />
                    </div>
                    <div className="flex flex-row w-1/2 justify-between items-center gap-6">
                        <BsFacebook size={25} />
                        <input value={facebook} onChange={(e) => setFacebook(e.target.value)} type="url" id="facebook" className="block w-full p-2.5 text-sm  placeholder:opacity-50 text-white bg-transparent rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="What should I call you?" />
                    </div>
                    <div className="flex flex-row w-1/2 justify-between items-center gap-6">
                        <BsInstagram size={25} />
                        <input value={instagram} onChange={(e) => setInstagram(e.target.value)} type="url" id="instagram" className="block w-full p-2.5 text-sm  placeholder:opacity-50 text-white bg-transparent rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="Who do you pay to learn shit?" />
                    </div>
                    <div className="flex flex-row w-1/2 justify-between items-center gap-6">
                        <BsLinkedin size={25} />
                        <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} type="url" id="linkedin" className="block w-full p-2.5 text-sm  placeholder:opacity-50 text-white bg-transparent rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="What's your current course?" />
                    </div>
                    <fieldset>
                        <div className="flex items-center gap-3 mb-4">
                            <input name="allowEmail" value={allowEmail} onChange={toggleEmail} defaultChecked id="default-checkbox" type="checkbox" className="w-4 h-4 rounded-lg" />
                            <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-dimWhite">Share Email</label>
                            <motion.div >
                                <InfoText 
                                    primaryText={"'The Fuck'"} 
                                    secondaryText={`Chill. This just means that companies can express their intrest through your email. No dodgy business.`} 
                                    tertiaryText={`Pinky promise.`}
                                />
                            </motion.div>
                        </div>
                    </fieldset>

                </div>
            </div>

            <div className="flex flex-row gap-6">
                <motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex flex-row text-primary items-center gap-3 p-3 rounded-lg border border-transparent bg-blue-gradient hover:border-white">
                    Save
                    <BsSave size={20} />
                </motion.button>
                <motion.button type="button" onClick={toggleEdit} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex flex-row items-center gap-3 p-3 rounded-lg border border-white bg-transparent hover:border-secondary">
                    Exit
                    <BsXSquare size={20} />
                </motion.button>

            </div>

        </form>
    );
}