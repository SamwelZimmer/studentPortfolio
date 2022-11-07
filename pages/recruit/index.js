import React from 'react'

const RecuitPage = () => {
  return (
    <main className='bg-primary text-white flex flex-col items-center py-48 gap-20'>
        <div className='flex flex-col w-full ss:w-[600px] px-6'>
            <h2 className='text-left text-6xl'>
                we're<br /> working <br /> on it
            </h2>
            <h2 className='text-right text-6xl opacity-50'>
                hold on<br /> tight
            </h2>
        </div>

        <div className='flex flex-col text-center'>
            <p className='opacity-40 text-lg'>but ...</p>
            <p className='text-xl opacity-70'>if you’re really keen, <br />you can contact us here:</p>
            <p className=' font-thin text-3xl text-gradient mt-6 pb-6'>email@company.com</p>
            <p className='text-xl'>we can work something out</p>
        </div>

        <div className='flex flex-col gap-3 text-center pt-32 text-lg w-full sm:w-1/2 px-12'>
            <p className='text-right text-xl'>What is all this about?</p>
            <p className='text-left opacity-70'>Well, this site is essentially an acculuation of talent soon-to-be graduates displaying thier skills.<br />As a recruiter, this is a gold mine. You might as well swing the pick.</p>
        </div>

    </main>
  )
}

export default RecuitPage;