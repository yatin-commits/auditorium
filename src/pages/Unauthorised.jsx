import React from 'react'
import { Navbar } from './Navbar'

function Unauthorised() {
  return (
    <>
    <Navbar/>
    <div className="flex justify-center items-center  flex-col"> 
        <h1 className="text-[30px] font-[poppins] text-center">🚫Admin Access Only 🚫</h1>
    <img src="./unauthorised.png" className="h-96 w-96" alt="" />

    </div>
    </>
  )
}

export default Unauthorised