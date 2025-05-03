import React from 'react'
import gym from '../../../assets/facility/gym.jpg'
import football from '../../../assets/facility/football.jpg'
import basketball from '../../../assets/facility/basketball.jpg'
import badminton from '../../../assets/facility/badminton.jpg'
import swimmingpool from '../../../assets/facility/swimmingpool.jpg'
import campus from '../../../assets/facility/campus.jpg'
import mess from '../../../assets/facility/mess.jpg'

export default function Facility() {
  return (
    <section className="bg-white">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-xl">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-black">
          Our Facilities
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-700 sm:text-xl">
          We aim to provide top-notch amenities to make your stay comfortable and secure.
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Example Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <img src={gym} alt="Spacious Rooms" className="w-full h-[350px] object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-black">Gym</h3>
              <p className="text-gray-700">Fully equipped with modern machines and free weights for fitness and strength training.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <img src={mess} className="w-full h-[350px] object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-black">🍽️ Mess Facility</h3>
              <p className="text-gray-700">Nutritious and hygienic food served three times a day.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <img src={swimmingpool} alt="Mess Facility" className="w-full h-[350px] object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-black">Swimming Pool</h3>
              <p className="text-gray-700">A clean and spacious pool open to all students for training and relaxation.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <img src={badminton} alt="Mess Facility" className="w-full h-[350px] object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-black">Badminton Courts</h3>
              <p className="text-gray-700">Well-maintained indoor courts for recreational and competitive play.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <img src={campus} alt="Mess Facility" className="w-full h-[350px] object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-black">Campus</h3>
              <p className="text-gray-700">A green, serene environment perfect for learning, living, and unwinding.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <img src={basketball} alt="Mess Facility" className="w-full h-[350px] object-cover" />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-black">Basketball Court</h3>
              <p className="text-gray-700">A full-sized court available for practice, matches, and fitness.</p>
            </div>
          </div>                    

          {/* Add more cards similarly... */}
        </div>
      </div>
    </section>
  )
}
