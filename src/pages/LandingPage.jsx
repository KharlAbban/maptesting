import { FaMapMarked } from 'react-icons/fa'
import { FaBookAtlas, FaLocationPin, FaLocationPinLock, FaMap } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className='flex h-screen relative w-screen flex-col lg:flex-row'>
      {/* Background image for mobile/tablet screens */}
      <div className='relative lg:w-2/5 w-full lg:flex hidden'>
        <img src="/landing_bg.jpg" className='object-cover w-full h-full brightness-50' alt="Learn Mapbox" loading='lazy' />
      </div>
      {/* Background for smaller screens */}
      <div className="lg:hidden absolute inset-0 bg-cover bg-center bg-[url('/landing_bg.jpg')] brightness-50" />
      
      <div className="relative flex-1 flex items-center justify-center flex-col text-center lg:text-left p-6 lg:p-0 z-10 bg-white/75 lg:bg-transparent">
        <h1 className="font-bold text-5xl md:text-6xl tracking-normal max-w-lg relative">
          <span className='bg-gradient-to-r from-blue-900 to-teal-600 text-transparent bg-clip-text'>
            Learn Mapbox with MapTesting
          </span>
          {/* Map icons position responsive */}
          <FaMap className='absolute text-green-500 md:-top-20 -top-10 left-5 md:left-auto' />
          <FaMapMarked className='absolute text-orange-500 md:-top-16 md:-right-10 -top-8 right-5' />
          <FaBookAtlas className='absolute text-fuchsia-500 md:-bottom-52 md:left-20 -bottom-80 left-12' />
          <FaLocationPin className='absolute text-indigo-600 md:-top-28 md:left-20 -top-40 left-32' />
        </h1>
        <FaLocationPinLock className='absolute text-cyan-500 bottom-24 right-12 md:bottom-16 md:right-12' size={35} />
        <p className="max-w-lg mt-6 md:mt-10 text-base md:text-lg">
          Mapbox is an all-in-one map rendering package and playground. Design, build, customise and interact with quality, clean, and professional maps that load in seconds!
        </p>
        <Link to="/general-map" className="bg-cyan-400 px-6 md:px-8 py-2 mt-4 mb-2 hover:bg-cyan-500 duration-100 ease-in-out rounded-sm text-sm md:text-base">
          Get Started
        </Link>
      </div>
    </div>
  )
}

export default LandingPage
