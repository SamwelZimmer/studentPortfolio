import { useState } from "react";
import { useRouter } from 'next/router';
import { useDocumentDataOnce, useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import { VscEye } from "react-icons/vsc";
import { VscOpenPreview } from "react-icons/vsc";
import { AiOutlineDelete } from "react-icons/ai";

import { auth, firestore } from "../../lib/firebase";
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore } from 'firebase/firestore';
import Metatags from "../../components/Metatags";
import AuthCheck from "../../components/AuthCheck";
import ImageUploader from "../../components/ImageUploader";
import InfoText from "../../components/InfoText";



export default function AdminPostEdit(props) {
    return (
      <AuthCheck>
        <PostManager />
      </AuthCheck>
    );
}
  
function PostManager() {
    const [preview, setPreview] = useState(false);
  
    const router = useRouter();
    const { slug } = router.query;
  
    // const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
    const postRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'posts', slug)
    const [post] = useDocumentData(postRef);
  
    return (
      <main className='py-32 text-white bg-primary flex flex-col gap-20 items-center w-full justify-center'>
        {post && (
          <div className="flex flex-col gap-12 justify-center items-center w-full px-6">
            <h1 className="text-4xl">{preview ? "Go on, check your grammar" : "Create a Project"}</h1>
            <div className="flex flex-col gap-20 sm:flex-row-reverse">
              {/* card */}
              <PostForm postRef={postRef} defaultValues={post} preview={preview} title={post.title} />
              <hr className="sm:hidden my-4 mx-auto w-48 h-[1px] bg-secondary opacity-10 rounded border-0 md:my-10" />

              {/* tools */}
              <div className="flex flex-col justify-center items-center gap-6 bg-opacity-40">
                <div className="flex flex-row w-[150px] gap-3 items-center justify-between">
                  <p className="ml-2 text-sm font-medium text-dimWhite">{preview ? 'Edit' : 'Preview'}</p>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 border border-primary bg-blue-gradient rounded-lg text-primary" onClick={() => setPreview(!preview)}><VscOpenPreview /></motion.button>
                </div>
                <div className="flex flex-row w-[150px] gap-3 items-center justify-between">
                  <p className="ml-2 text-sm font-medium text-dimWhite">Live View</p>
                  <Link href={`/${post.username}/${post.slug}`}>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 border border-primary bg-blue-gradient rounded-lg text-primary"><VscEye /></motion.button>
                  </Link>
                </div>
                <DeletePostButton postRef={postRef} />
              </div>
            </div>
          </div>
        )}
      </main>
    );
}
  
function PostForm({ defaultValues, postRef, preview, title }) {
    const { register, errors, handleSubmit, formState, reset, watch } = useForm({ defaultValues, mode: 'onChange' });
  
    const { isValid, isDirty } = formState;

    const updatePost = async ({ content, published, description, extLink, type, tags, imgLink }) => {
      tags = tags.split(",")
      await updateDoc(postRef, {
        content,
        published,
        description,
        extLink,
        type,
        tags,
        updatedAt: serverTimestamp(),
      });
  
      reset({ content, published, description, extLink, type, tags });
  
      toast.success('Post updated successfully!');
    };
  
    return (
      <form className="text-white w-full flex flex-col gap-6" onSubmit={handleSubmit(updatePost)}>
        {preview && (
          <div className="w-[300px] sm:w-[500px] h-full flex flex-col gap-12 items-center justify-center ">
            <div className="bg-black-gradient w-full rounded-lg p-6 flex flex-col gap-6 justify-center items-center">
              <p className="text-dimWhite">{watch('description')}</p>
              <ReactMarkdown>{watch('content')}</ReactMarkdown>
            </div>
          </div>
          
        )}
  
        <div className={`flex flex-col sm:flex-row gap-20 ${preview ? 'hidden' : ''}`}>
          <div className="bg-black-gradient w-full rounded-lg p-6 flex flex-col gap-6 justify-center items-center">
            <h3 className="text-3xl font-semibold">{title}</h3>

            <div className="w-full flex flex-col">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-dimWhite">Project Description*</label>
              <input type="text" id="description" {...register("description", { required: true })} className="block w-full p-2.5 text-sm text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="A sorting algorithm for something unnecessary" />
            </div>

            <div className="w-full flex flex-col">
              <div className="flex flex-row w-full justify-between">
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-dimWhite">Project Explaination*</label>
                <InfoText 
                    primaryText={"'Markdown'"} 
                    secondaryText={`If you want to add a little more emphasis, you can write the shmeat of your content in markdown format. If you don't know what it is then don't worry. If you do... nerd. Oh One thing, it needs to start with a "#"`} 
                />
              </div>
              <textarea
                {...register('content', {
                    required: { value: true, message: 'content is required' },
                    maxLength: { value: 20000, message: 'content is too long' },
                    minLength: { value: 10, message: 'content is too short' },
                })}
                id="message" rows="4" className="block p-2.5 w-full text-sm text-White placeholder:text-opacity-30 bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="Why's this polished peice of shit worth someone's time. Respectfully, of course.">
              </textarea>
            </div>

            <div className="w-full flex flex-col">
              <div className="flex flex-row w-full justify-between">
                <label htmlFor="extLink" className="block mb-2 text-sm font-medium text-dimWhite">Link to Project</label>                
                <InfoText 
                  primaryText={"Link?? Link to what?"} 
                  secondaryText={"We'll if your code is on GitHub, your Art on Instgram or your video on Youtube - maybe show us"} 
                />
              </div>
              <input type="text" id="extLink" {...register("extLink", { required: false })} className="block w-full p-2.5 text-sm text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="http://instagram.com/ronaldo" />
            </div>

            <div className="w-full flex flex-col">
              <div className="flex flex-row w-full justify-between">
                <label htmlFor="projectType" className="block mb-2 text-sm font-medium text-dimWhite">Project Type</label>
                <InfoText 
                  primaryText={"Don't Worry Too Much, I Think ..."} 
                  secondaryText={"One day (maybe) the home feed will be 'filterable' by post type, potentially. This feature perhaps would be nice to have, we'll see."} 
                />
              </div>
              <select id="projectType" {...register("type", { required: true })} className="block w-full p-2.5 appearance-none text-sm text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite">
                <option defaultValue>Meh</option>
                <option  value="Com">Computer Sciencey</option>
                <option value="Eng">Engineery</option>
                <option value="Art">Arty Farty</option>
                <option value="Hum">Humanitiesy</option>
              </select>
            </div>

            <div className="w-full flex flex-col">
              <div className="flex flex-row w-full justify-between">
                <label htmlFor="tags" className="block mb-2 text-sm font-medium  text-dimWhite">Tags</label>
                <InfoText 
                  primaryText={"Like hashtags, but not visible"} 
                  secondaryText={"So that your posts may be recommended to when people view posts similar to yours. If you don't want it, don't use it. The power is yours."} 
                  tertiaryText={"Lowercase words, seperated by a comma and less than 80 characters in total. Cheers,"}
                />
              </div>
              <input type="text" id="tags" pattern="[a-z,]{1,80}" {...register("tags", { required: false })} className="block w-full p-2.5 text-sm text-white bg-gray-gradient rounded-lg border border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite" placeholder="e.g. robotics,arduino" />
            </div>
            
            <div className="w-full">
              <ImageUploader postRef={postRef} />
            </div>

          </div>

  
            {errors && <p className="text-danger">{errors.content.message}</p>}
            <div className="flex flex-col justify-center items-center">
              <fieldset>
                <div className="flex items-center mb-4">
                  <input name="published" id="default-checkbox" type="checkbox" {...register("published", { required: true })} className="w-4 h-4 rounded-lg" />
                  <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-dimWhite">Publish</label>
                </div>
              </fieldset>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="submit" className="text-primary cursor-pointer capitalize font-thin bg-blue-gradient rounded-lg w-max p-3" disabled={!isDirty || !isValid}>
                Save Changes
              </motion.button>

          </div>
            
  
          
        </div>
      </form>
    );
}
  
function DeletePostButton({ postRef }) {
    const router = useRouter();
  
    const deletePost = async () => {
      const doIt = confirm('are you sure!');
      if (doIt) {
        await deleteDoc(postRef);
        router.push('/admin');
        toast('I have abolished this post', { icon: '🗑️' })
      }
    };
  
    return (
      <div className="flex flex-row w-[150px] gap-3 items-center justify-between">
        <p className="ml-2 text-sm font-medium text-dimWhite">Delete</p>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-3 border border-secondary rounded-lg text-white" onClick={deletePost}>
          <AiOutlineDelete />
        </motion.button>
      </div>
      
    );
}