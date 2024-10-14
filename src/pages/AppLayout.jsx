import { useState } from 'react';
import { FaHamburger, FaStopCircle } from 'react-icons/fa';
import { Link, Outlet } from 'react-router-dom';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true); // State to handle mobile menu toggle

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='w-screen h-screen overflow-hidden flex flex-col m-0 p-0'>
      {/* Navbar */}
      <nav className='relative bg-blue-900 shadow border-b border-b-white px-4 min-h-10 max-h-10 h-10 flex justify-between items-center'>
        {/* Brand Logo */}
        <Link to="/" className='text-2xl text-blue-50 font-semibold'>
          MapTesting
        </Link>

        {/* Menu for larger screens (Desktop) */}
        <div className='hidden lg:flex gap-4 items-center'>
          <Link to='/' className='text-white hover:text-blue-400 duration-100 ease-in-out'>Home</Link>
          <Link to='/general-map' className='text-white hover:text-blue-400 duration-100 ease-in-out'>General Map</Link>
          <Link to='/basic-interactions-map' className='text-white hover:text-blue-400 duration-100 ease-in-out'>Basic Interactions</Link>
          <Link to='/advanced-interactions-map' className='text-white hover:text-blue-400 duration-100 ease-in-out'>Advanced Interactions</Link>
          <Link to='/mapbox-layers-map' className='text-white hover:text-blue-400 duration-100 ease-in-out'>MapboxLayers</Link>
        </div>

        <FaHamburger size={25} color='pink' className='max-lg:hidden' />

        {/* Hamburger Icon for mobile menu */}
        <div className='lg:hidden'>
          <button onClick={toggleMenu} className='focus:outline-none'>
            {isMenuOpen ? <FaStopCircle size={25} color='pink' /> : <FaHamburger size={25} color='pink' />}
          </button>
        </div>
        {/* Mobile menu dropdown */}
        <div
            // className={`absolute right-0 bottom-0 lg:hidden flex flex-col gap-4 p-4 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0  z-[9999]' : 'translate-y-full'}`}>
            className={`absolute right-0 bottom-0 lg:hidden flex flex-col gap-2 pb-2 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-full z-[999]' : 'translate-y-0 hidden'} border`}>
            <Link to='/' className='hover:bg-blue-800 px-4 py-1 duration-100 ease-in-out' onClick={toggleMenu}>
            Home
            </Link>
            <Link to='/general-map' className='hover:bg-blue-700 duration-100 px-4 py-1 ease-in-out' onClick={toggleMenu}>
            General Map
            </Link>
            <Link to='/basic-interactions-map' className='hover:bg-blue-700 px-4 py-1 duration-100 ease-in-out' onClick={toggleMenu}>
            Basic Interactions
            </Link>
            <Link to='/advanced-interactions-map' className='hover:bg-blue-700 px-4 py-1 duration-100 ease-in-out' onClick={toggleMenu}>
            Advanced Interactions
            </Link>
            <Link to='/mapbox-layers-map' className='hover:bg-blue-700 duration-100 px-4 py-1 ease-in-out' onClick={toggleMenu}>
            MapboxLayers
            </Link>
        </div>
      </nav>


      {/* Main content */}
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
};

export default LandingPage;
