'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ApiService } from '../../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('username', formData.username);
      formDataToSend. append('password', formData.password);
      
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      const response = await ApiService.register(formDataToSend);
      
      if (response.success) {
        setSuccess('Registration successful!  Redirecting to login...');
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handlePhotoChange = (e: React. ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      if (! file.type.startsWith('image/')) {
        setError('File must be an image');
        return;
      }

      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <div className="mb-5 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Register
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 text-sm text-center max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-xl text-green-200 text-sm text-center max-w-md mx-auto">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
            
            {/* Photo Upload */}
            <div className="flex flex-col items-center mb-2">
              <div 
                onClick={handlePhotoClick}
                className="relative w-30 h-30 rounded-full bg-gray-700/50 border-2 border-dashed border-gray-400 hover:border-cyan-400 cursor-pointer transition-all overflow-hidden group"
              >
                {photoPreview ?  (
                  <>
                    <Image
                      src={photoPreview}
                      alt="Photo preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto();
                      }}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                    >
                      Change Photo
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-cyan-400 transition-colors">
                      <Image 
                        src="/icons/add.png"
                        alt="add"
                        width={36}
                        height={36}
                      />
                    <span className="text-xs">Add Photo</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <p className="text-gray-400 text-xs mt-2">Optional (Max 5MB)</p>
            </div>

            {/* Nama Lengkap Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src='/icons/nama.png' alt='user' width={30} height={30} />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder:text-gray-500"
                required
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
                minLength={6}
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-slate-800 hover:bg-[#000000] disabled:opacity-50 disabled: cursor-not-allowed text-white font-semibold rounded-2xl py-3.5 transition-all uppercase tracking-wider shadow-lg hover: shadow-xl"
            >
              {isLoading ? 'Loading...' :  'SIGN UP'}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account? {' '}
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