import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className='flex bg-white justify-center'>
      <div className='bg-black text-white  px-[100px] py-[30px] m-[50px] rounded'>
        <p>Hostel Allocation</p>
        <p>Report Complaint</p>
        <p>Rules & Regulation</p>
      </div>

      <div className='bg-black text-white px-[100px] py-[30px] m-[50px] rounded'>
        <p>Alumini Connect</p>
        <p>Gallery</p>
        <p>Contact Us</p>
      </div>

      <div className='bg-black text-white px-[100px] py-[30px] m-[50px] rounded'>
        <Link
          to="/about"
          className="md:py-3 md:hover:text-blue-500 transition-all ease-linear"
        >
          About
        </Link>
      </div>
    </div>
  )
}
