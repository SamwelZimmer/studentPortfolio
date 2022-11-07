import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Physics, usePlane, useBox, useSphere } from '@react-three/cannon';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { motion } from 'framer-motion';
import Link from "next/link";

function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {innerWidth, innerHeight};
}


// // Practice Spinning Ball
function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;  

  const [windowSize, setWindowSize] = useState(getWindowSize());

  function onDocumentMouseMove(e) {
    mouseX = (e.clientX - windowSize.innerWidth);
    mouseY = (e.clientY - windowSize.innerHeight);
  }
  document.addEventListener("mousemove", onDocumentMouseMove)

  useFrame((state, delta) => {
    targetX = mouseX * .001;
    targetY = mouseY * .001;

    mesh.current.rotation.y += 0.005
    mesh.current.rotation.x += .05 * (targetY - mesh.current.rotation.x)
    // mesh.current.rotation.y += 0.5 * (targetX - mesh.current.rotation.y)
    mesh.current.rotation.z += -.05 * (targetY - mesh.current.rotation.x)
  });

  // Return view, these are regular three.js elements expressed in JSX
  const colorMap = useLoader(TextureLoader, 'textures/NormalMap.png');

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial normalMap={colorMap} roughness={0.5} metalness={0.5} color={hovered ? 'rgb(9, 151, 124)' : '#00040f'} />
    </mesh>
  )
}


function Phone1(props) {
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const phone = useRef()
  const gltf = useLoader(GLTFLoader, '/phone1.gltf')

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;  

  const [windowSize, setWindowSize] = useState(getWindowSize());

  function onDocumentMouseMove(e) {
    mouseX = (e.clientX - windowSize.innerWidth);
    mouseY = (e.clientY - windowSize.innerHeight);
  }
  document.addEventListener("mousemove", onDocumentMouseMove)

  useFrame((state, delta) => {
    targetX = mouseX * .001;
    targetY = mouseY * .001;
    // phone.current.rotation.y += 0.005
    // phone.current.rotation.y = 0.005
    phone.current.rotation.y += .005 * (targetX - phone.current.rotation.y)
    phone.current.rotation.x += .003 * (targetY - phone.current.rotation.x)
    phone.current.rotation.z += -.00005 * (targetY - phone.current.rotation.x)
  });

  return (
    <mesh 
      {...props}
      ref={phone}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <primitive
        // scale={17} 
        object={gltf.scene} 
        rotation={[0, -.5, 0]}
        scale={windowSize.innerWidth < 450 ? 20 : 25}
      />
    </mesh>
 
  )
}

function Laptop(props) {
  // const [hovered, setHover] = useState(false)
  // const [active, setActive] = useState(false)
  const laptop = useRef()
  const gltf2 = useLoader(GLTFLoader, '/macbookpro.gltf')

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;  

  const [windowSize, setWindowSize] = useState(getWindowSize());

  function onDocumentMouseMove(e) {
    mouseX = (e.clientX - windowSize.innerWidth);
    mouseY = (e.clientY - windowSize.innerHeight);
  }
  document.addEventListener("mousemove", onDocumentMouseMove)

  useFrame((state, delta) => {
    targetX = mouseX * .001;
    targetY = mouseY * .001;

    laptop.current.rotation.y += .04 * (targetX - laptop.current.rotation.y)
  });

  return (
    <mesh 
      {...props}
      ref={laptop}
    >
      <primitive
        object={gltf2.scene} 
        rotation={[0, 90, 45]}
        scale={windowSize.innerWidth < 450 ? 0.7 : 1.2}
      />
    </mesh>
  )
}

function Scene() {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  return (
    <>
      {/* <pointLight color={'#00f6ff'} intensity={1} position={[10, 10, 10]} /> */}
      <pointLight color={'#ffffff'} intensity={1} position={[10, 10, 10]} />

      <Phone1 position={windowSize.innerWidth < 450 ? [0, -2, 0] : [2, -2, 0] } />
      <pointLight color={'#fc67fa'} intensity={0.3} position={[10, -10, 20]} />
    </>
  )
}

export default function Home(props) {

  return (
    <main className="bg-primary py-32 text-white">
      <div className='absolute w-[20%] h-[20%] right-[0rem] top-[20%] white__gradient' />
      <div className='absolute w-[30%] h-[20%] -left-20 top-[70%] pink__gradient' />
      <div className='absolute w-[40%] h-[30%] right-0 top-[100%] blue__gradient' />
      <div className='absolute w-[20%] h-[20%] left-[1rem] top-[200%] white__gradient' />

      <section>
        <div className='h-screen grid place-items-center'>
          <h1 className='text-5xl sm:text-7xl font-poppins text-left w-full px-6 sm:px-32'>upload your <br/> projects</h1>
        </div>

        <div className='w-screen h-screen flex justify-center absolute top-0 left-0 outline-none mix-blend-exclusion'>
          <Canvas resize={{ scroll: true, debounce: { scroll: 50, resize: 0 } }}>
            <Scene  />
          </Canvas>
        </div>
      </section>

      <div className='w-full flex justify-end px-32'>
        <motion.div whileHover={{ scale: 1.1, rotate: 30 }} whileTap={{ scale: 0.9, rotate: -90 }} className='z-50 aspect-square p-[1px] bg-blue-gradient rounded-full'>
          <Link href="enter">
            <motion.button className='w-full h-full bg-black rounded-full p-3 font-bold hover:bg-transparent hover:text-black'>
              Sign Me Up
            </motion.button>
          </Link>
        </motion.div>
      </div>
    

      <section>
        <div className='h-screen grid place-items-center'>       
          <h1 className='text-5xl sm:text-7xl font-poppins text-right w-full px-6 sm:px-32'>grow your<br/>portfolio </h1>
        </div>
        <div className='w-screen h-screen flex justify-center absolute top-full left-0 outline-none mix-blend-exclusion'>
          <Canvas>
              {/* <Box position={[0, 0, 0]} scale={10} /> */}
              <pointLight color={'#ffffff'} intensity={3} position={[-10,0,0]} />
              <Laptop position={[0, -1, 0]} />
              <pointLight color={'#33bbcf'} intensity={0.1}  position={[10, 30, 10]} />
          </Canvas>
        </div>
      </section>



      <section className='flex flex-col gap-28 w-full px-6 justify-center items-center'>
        <div className='flex flex-col w-full lg:w-2/3'>
          <h1 className='text-5xl sm:text-7xl font-poppins text-left w-full sm:px-32'>and this<br/>time...</h1>
          <h1 className='text-5xl sm:text-7xl font-poppins text-right w-full sm:px-32'>... they{"'"}ll<br/>come to you</h1>
        </div>
        
        <div className='w-full sm:w-2/3 flex flex-col justify-center items-center gap-12'>
          
          <div className='flex flex-row gap-6'>
            <Link href="enter">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9}} className="p-3 w-[120px] rounded-lg border text-black border-black bg-blue-gradient hover:border-white hover:text-white hover:text-bold">
                Sign Up
              </motion.button>
            </Link>
            <Link href="enter">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9}} className="p-3 w-[120px] rounded-lg border border-white hover:border-secondary hover:font-bold">
                Log In
              </motion.button>
            </Link>
          </div>

          <div className="w-1/2 flex flex-row items-center justify-center gap-6">
            <hr className="my-4 mx-auto w-1/4 h-[1px] opacity-20 bg-secondary rounded border-0 md:my-10" />
            <p className='opacity-30'>or</p>
            <hr className="my-4 mx-auto w-1/4 h-[1px] opacity-20 bg-secondary rounded border-0 md:my-10" />
          </div>

          <div  className='flex flex-col w-full items-center gap-6'>
            <p className='w-1/2 text-center opacity-30'>if you{"'"}re part of a company looking for talented graduates...</p>
            <Link href="recruit">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9}} className="p-3 w-[120px] rounded-lg border text-secondary border-dimWhite hover:bg-white hover:border-secondary hover:text-black">
                Follow Me
              </motion.button>
            </Link>
          </div>
        </div>
      </section>


    

 

     

  
   

    
    </main>
  );
}
