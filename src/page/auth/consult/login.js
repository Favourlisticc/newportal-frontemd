import React, { useState } from 'react';

const ConsultLogin = () => {
  const [captcha, setCaptcha] = useState('DQ2WAH'); // Random captcha value (you can generate this dynamically)
  const [inputCaptcha, setInputCaptcha] = useState('');

  const handleCaptchaChange = (e) => {
    setInputCaptcha(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCaptcha === captcha) {
      alert('Captcha Matched. Logging in...');
    } else {
      alert('Invalid Captcha. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center" style={{ backgroundImage: 'url(/path-to-your-image.jpg)' }}>
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <img src="/path-to-your-logo.png" alt="Logo" className="mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">SIGN IN</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-left">USERNAME</label>
            <input type="text" className="w-full p-2 border rounded" placeholder="Username" required />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-left">PASSWORD</label>
            <input type="password" className="w-full p-2 border rounded" placeholder="Password" required />
          </div>

          <div className=' flex justify-start'>
           <span className="bg-gray-200 p-2 rounded text-lg">{captcha}</span>
          </div>

          <div className="mb-4 mt-5">
            <label className="block text-gray-700 text-left">Captcha</label>
            <div className="flex items-center mb-2">
             
              <input
                type="text"
                value={inputCaptcha}
                onChange={handleCaptchaChange}
                className="w-full p-2 border rounded"
                placeholder="Enter Captcha"
                required
              />
            </div>
          </div>

          <div className="text-right mb-4">
            <a href="#" className="text-teal-600">Forgot Password?</a>
          </div>

          <button type="submit" className="bg-teal-600 text-white w-full py-2 rounded hover:bg-teal-700">
            SIGN IN
          </button>

          <div className="text-center mt-4">
            <a href="#" className="text-teal-600">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultLogin;
