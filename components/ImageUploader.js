import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Link from 'next/link';
import { updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';

function truncateString(str, num) {
    if (str == null) return "";
    if (str.length <= num) {
        return str
    }
    return str.slice(0, num) + '...';
}

export default function ImageUploader({ postRef }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadURL, setDownloadURL] = useState(null);

    const updatePost = async ( imgLink ) => {
        console.log('hello')
        await updateDoc(postRef, {
          imgLink,
        });
        
        toast.success('Image Uploaded Successfully', {
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
    };

    const uploadFile = async (e) => {
        // Get the file
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split('/')[1];

        // Makes reference to the storage bucket location
        const fileRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
        setUploading(true);

        // Starts the upload
        const task = uploadBytesResumable(fileRef, file)

        // Listen to updates to upload task
        task.on(STATE_CHANGED, (snapshot) => {
            const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
            setProgress(pct);
        });
        
        // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
        task
            .then((d) => getDownloadURL(fileRef))
            .then((url) => {
                setDownloadURL(url);
                setUploading(false);
                
                updatePost(url);
        });
    }

    // probably want some kind of limit on file size
    return (
        <div className="w-full flex flex-col justify-center items-center gap-3">
            <Loader show={uploading} />
            {uploading && <h3>{progress} %</h3>}

            {!uploading && (
            <div className="flex justify-center items-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col p-6 justify-center items-center text-center w-full h-64 bg-gray-gradient rounded-lg border-2  border-dimBlue outline-dimBlue focus:outline-none focus:border-dimWhite border-dashed cursor-pointer">
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. ???Mb)</p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" onChange={uploadFile} accept="image/*" />
                </label>
            </div>
            )}
            
            {/* is it safe to show this? */}
            {downloadURL && 
                <Link href={downloadURL}>
                    <code className='text-xs opacity-50 text-center'>{`${truncateString(downloadURL, 25)}`}</code>
                </Link>
            }
        </div>
    );
}