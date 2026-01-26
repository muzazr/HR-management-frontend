'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ApiService } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await ApiService.login(formData.username, formData.password);
      
      if (response. success && response.data) {
        login(response.data.token, response.data.user);
        router.push('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error:  any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed!  Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React. ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  return (
    <div className='w-full max-w-6xl mx-auto'>

      <div className="relative rounded-4xl overflow-hidden shadow-2xl">
        {/* Gradient */}
        <div className='absolute inset-0'>
          <div className='absolute w-[40%] h-[40%] -left-[15%] -top-[15%] bg-[#29C5EE]/40 rounded-full blur-[120px]'/>
          <div className='absolute w-[50%] h-[50%] -right-[20%] -top-[20%] bg-[#CF1A2C]/40 rounded-full blur-[120px]'/>
          <div className='absolute w-[40%] h-[40%] -left-[15%] -bottom-[15%] bg-[#EAB04D]/40 rounded-full blur-[120px]'/>
          <div className='absolute w-[50%] h-[50%] -right-[20%] -bottom-[20%] bg-[#19C8A7]/40 rounded-full blur-[120px]'/>
        </div>

        {/* Card Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
          
          {/* LEFT SIDE - Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            
            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#ffffff] mb-2">
                Welcome
              </h1>
              <p className="text-[#ffffff] text-sm">
                We Are Glad To See You Back With Us
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Username/Email Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Image src='/icons/name.png' alt='user' width={30} height={30} />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username/Email"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder: text-gray-500"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Image src='/icons/lock.png' alt='pass' width={30} height={30} />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder:text-gray-500"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Next Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 bg-slate-800 hover:bg-[#000000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl py-3.5 transition-all duration-200 uppercase tracking-wider shadow-lg hover:shadow-xl cursor-pointer"
              >
                {isLoading ? 'Loading...' : 'NEXT'}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-gray-400 text-sm mt-3">
                Don't have an account? {' '}
                <Link 
                  href="/register" 
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>

          {/* RIGHT SIDE - Illustration */}
          <div className="hidden lg:flex items-center justify-center p-8 lg:p-12">
            <div className="relative w-full aspect-square max-w-md">
              <Image
                src="/images/login-image.png"
                alt="Team collaboration"
                fill
                className="object-cover rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}