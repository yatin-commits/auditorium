import React from 'react'
import Navbar from './Navbar'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <>
    <div className="flex justify-center flex-col w-screen h-screen items-center">
        <h1 className="text-9xl text-center">404</h1>
        <h1 className="text-3xl text-center">Page Not Found</h1>
        <button className="border-2 p-2 m-1 border-black rounded-md bg-black text-white font[poppins]"><Link to='/'>Home</Link></button>
        
    </div>
    </>
  )
}

export default NotFound