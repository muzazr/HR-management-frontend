'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AuthService } from '../../../lib/api';
import { getCroppedImg } from '../../../utils/canvasUtils';
import Cropper from 'react-easy-crop';

export default function RegisterPage() {
  const router = useRouter();
  
  // state utama form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false)

  // state terkait photo & cropper
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0})
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)

  /**
   * handleSubmit
   * - Mengumpulkan data form ke FormData, termasuk foto bila ada.
   * - Memanggil AuthService.register dan meng-handle hasilnya (success/error).
   * - Menjaga state loading dan menavigasi ke /login jika sukses.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const formDataToSend = new FormData();
      console.log('photoFile state', photoFile)
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      
      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      const response = await AuthService.register(formDataToSend);
      
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

  /**
   * handleChange
   * - Generic input handler untuk semua input berbasis name attribute.
   * - Reset error bila ada perubahan input.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  /**
   * handlePhotoChange
   * - Membaca file gambar dari input dan melakukan setting imageSrc sebagai dataURL.
   * - Membuka modal crop setelah image dimuat.
   */
  const handlePhotoChange = (e: React. ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string)
        setIsCropModalOpen(true)
      })
      reader.readAsDataURL(file)
    }
  };

  /**
   * onCropComplete
   * - Callback dari react-easy-crop, menyimpan area crop dalam pixel.
   */
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  /**
   * handleSaveCrop
   * - Menghasilkan Blob hasil crop via util getCroppedImg.
   * - Membuat preview URL dan File untuk dikirim ke server.
   * - Menutup modal crop setelah berhasil.
   */
  const handleSaveCrop = async () => {
    try {
      if(imageSrc && croppedAreaPixels) {
        const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
        // console.log('croppedBlob', croppedImageBlob)

        if(croppedImageBlob) {
          // preview dari crop nya
          const croppedImageUrl = URL.createObjectURL(croppedImageBlob)
          setPhotoPreview(croppedImageUrl)

          const file = new File([croppedImageBlob], "profile_cropped.jpg", {type: "image/jpeg"})
          console.log('photoFile', file, file.size, file.type)
          setPhotoFile(file)
          setIsCropModalOpen(false)
        }
      }
    } catch(e) {
      console.error(e)

    }
  }

  /**
   * handlePhotoClick
   * - Memicu klik pada input file tersembunyi.
   */
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * removePhoto
   * - Menghapus file foto dan preview dari state, serta mereset input file.
   */
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
                style= {{width: '120px', height: '120px'}}
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
                      Remove
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

            { isCropModalOpen && (
              <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'>
                <div className='bg-[#1e1e1e] rounded-xl w-full max-w-md overflow-hidden flex flex-col h-[500px]'>
                   
                   {/* header */}
                  <div className='p-4 border-b border-gray-700 flex justify-between items-center'>
                    <h3 className="text-white font-semibold">Adjust Photo</h3>
                    <button onClick={() => setIsCropModalOpen(false)} className="text-gray-400 hover:text-white">X</button>
                  </div>

                  {/* area crop */}
                  <div className="relative flex-1 bg-black">
                    <Cropper 
                      image={imageSrc || ''}
                      crop={crop}
                      zoom={zoom}
                      aspect={1} //rasio 1:1
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>

                  {/* Footer / Controls */}
                  <div className="p-4 bg-[#1e1e1e] space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400">Zoom</span>
                      <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-cyan-400 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsCropModalOpen(false)}
                        className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveCrop}
                        className="flex-1 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition"
                      >
                        Save Photo
                      </button>
                    </div>
                  </div>
                    
                </div>
              </div>
            )}

            {/* Nama Lengkap Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Image src='/icons/name.png' alt='user' width={30} height={30} />
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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder:text-gray-500"
                required
                disabled={isLoading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )
                }
              </button>
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