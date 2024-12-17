import React, { useState } from 'react';

const AdminLogin = () => {
  const [captchaInput, setCaptchaInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle sign in
    console.log("Form Submitted");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-teal-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-left">Username</label>
            <input
              id="username"
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-left">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Password"
            />
          </div>
          <div>
         <div className=' flex justify-start'>
         <span className="bg-gray-200 px-3 py-2 rounded-md font-mono text-xl">BZMK85</span>
         </div>
           
            <div className="">
            <label htmlFor="captcha" className="text-left block mb-2 text-sm font-medium">Captcha</label>
              <input
                id="captcha"
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter Captcha"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
