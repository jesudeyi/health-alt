import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Aos from 'aos'
import './index.css'

import 'aos/dist/aos.css'
import RegisterBusiness from 'pages/RegisterBusiness'
import VerifyBusiness from 'pages/VerifyBusiness'

const App = () => {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-100 px-7 pt-4 font-[rubik] text-gray-900 md:text-[0.9rem] md:leading-[1.35rem] dark:bg-gray-900 dark:text-gray-200">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register-business" element={<RegisterBusiness />} />
            <Route path="/verify-business" element={<VerifyBusiness />} />
            <Route
              path="*"
              element={
                <div className="flex h-screen items-center justify-center bg-gray-200 dark:bg-gray-900">
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
