import React, { useState } from 'react'
import { IoIosOptions } from 'react-icons/io'

const Home = () => {
  const [sideMenuIsVisible, setSideMenuIsVisible] = useState<boolean>(true)

  return (
    <div className="relative flex flex-col items-start justify-center overflow-y-scroll">
      <div
        className={`my-auto ${
          sideMenuIsVisible ? 'w-2/3' : 'w-full'
        } flex-col items-center justify-center`}
      >
        {/* A. Topmost section */}
        <div className="mb-12 flex items-center justify-between px-4">
          {/* Logo */}
          <div className="flex-1 text-center">
            <h1 className="font-[cursive] text-4xl font-medium tracking-wider">
              <span>health</span>
              <span className="text-teal-500">ALT</span>
            </h1>
          </div>

          {!sideMenuIsVisible && (
            <div className="absolute right-0 top-2 flex items-center space-x-4">
              <button
                onClick={() => setSideMenuIsVisible(true)}
                className="rounded-full p-2 transition-colors ease-in-out hover:bg-gray-800 dark:bg-teal-700 dark:hover:bg-teal-600"
              >
                <IoIosOptions size={24} />
              </button>
            </div>
          )}
        </div>

        {/* B. Next section */}
        <div></div>
      </div>

      {/* Side menu */}
      <div></div>
    </div>
  )
}

export default Home
