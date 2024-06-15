import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Aos from 'aos'

import 'aos/dist/aos.css'

const App = () => {
  return (
    <>
      <Router>
        <div className="h-screen bg-gray-100 px-7 pt-4 font-[rubik] text-[0.9rem] leading-[1.35rem] text-gray-900 dark:bg-gray-900 dark:text-gray-200">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="*"
              element={
                <div className="flex h-screen items-center justify-center bg-gray-200">
                  <p className="text-center font-[rubik] text-2xl font-bold">
                    404 PAGE NOT FOUND
                  </p>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
