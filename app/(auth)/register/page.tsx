'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Registration data:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect ke login setelah register
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full max-w-2xl">
      
      {/* Card Container*/}
      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
        
        {/* Gradient */}
        <div className='absolute inset-0'>
            <div className='absolute w-[40%] h-[40%] -left-[10%] -top-[5%] bg-[#29C5EE]/40 rounded-full blur-[120px]'/>
            <div className='absolute w-[50%] h-[50%] -right-[20%] -top-[20%] bg-[#CF1A2C]/40 rounded-full blur-[120px]'/>
            <div className='absolute w-[40%] h-[40%] -left-[10%] -bottom-[5%] bg-[#EAB04D]/40 rounded-full blur-[120px]'/>
            <div className='absolute w-[50%] h-[50%] -right-[20%] -bottom-[20%] bg-[#19C8A7]/40 rounded-full blur-[120px]'/>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 lg:p-16">
          
          {/* Register Title */}
          <div className="mb-10 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Register
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
            
            {/* Nama Lengkap Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src='/icons/nama.png' alt='user' width={30} height={30} />
              </div>
              <input
                type="text"
                name="fullName"
                placeholder="Nama Lengkap"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder: text-gray-500"
                required
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src='/icons/mail.png' alt='email' width={30} height={30} />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder:text-gray-500"
                required
              />
            </div>

            {/* Username Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src='/icons/username-icon.png' alt='username' width={30} height={30} />
              </div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder:text-gray-500"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src='/icons/lock.png' alt='password' width={30} height={30} />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder:text-gray-500"
                required
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-slate-800 hover:bg-[#000000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl py-3.5 transition-all uppercase tracking-wider shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Loading...' : 'SIGN UP'}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?  {' '}
              <Link 
                href="/login" 
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}