import React from 'react'
import signupImage from "../assets/signup.avif"

const SignUp: React.FC = () => {
  return (
    <>
      <div className="flex h-screen bg-gray-100">
      {/* Left side - Signup Card */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Sign Up</h2>
          {/* Your signup form goes here */}
          <form>
            {/* Form inputs go here */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="flex-1 bg-cover bg-signUpRightBg" >
       {/* <img src={signupImage} alt="signup image illustration"/> */}
      </div>
    </div>
    </>
  )
}

export default SignUp