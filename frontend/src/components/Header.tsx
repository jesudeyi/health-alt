import React from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  navContainerCustomStyles?: string
}

const Header = ({ navContainerCustomStyles }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 mt-4 w-full px-16">
      <div className="md:text-center">
        <h1 className="font-[cursive] text-4xl font-medium tracking-wider">
          <span>health</span>
          <span className="text-teal-500">ALT</span>
        </h1>
      </div>

      <div
        className={`flex md:w-[45% items-center gap-x-8 ${
          navContainerCustomStyles ? navContainerCustomStyles : ''
        }`}
      >
        <Link className="text-teal-500 text-base hover:underline  " to="/">
          Get Alt
        </Link>
        <Link
          className="text-teal-500 text-base hover:underline  "
          to="/register-business"
        >
          Register
        </Link>
        <Link
          className="text-teal-500 text-base hover:underline  "
          to="/verify-business"
        >
          Verify
        </Link>
      </div>
    </div>
  )
}

export default Header
