'use client'

/**
 * LoginPage
 * - Menyediakan form login (username/email + password).
 * - Menangani validasi ringan di client dan menampilkan error UI.
 * - Memanggil AuthService.login untuk otentikasi.
 * - Menyimpan credential menggunakan useAuth.login (context/provider).
 * - Menavigasi pengguna setelah login berhasil.
 *
 * Catatan implementasi:
 * - Komponen ini adalah client component (menggunakan 'use client').
 * - Semua side-effect (login request) dikelola di handleSubmit.
 * - Error handling: tampilkan pesan error generik jika request gagal atau server mengembalikan error.
 * - Accessibility: form element menggunakan atribut standar (type, name, required, disabled).
 * - Testing: unit/integration tests sebaiknya mem-mock AuthService dan useAuth.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { AuthService } from '../../../lib/api'
import { useAuth } from '../../../hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  /**
   * Local component state
   * - formData: menyimpan nilai input form
   * - isLoading: flag untuk menandakan proses network sedang berjalan
   * - error: pesan error yang ditampilkan ke user
   * - showPassword: toggle visibilitas field password
   */
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  /**
   * handleSubmit
   *
   * Melakukan proses login:
   * 1. Mencegah default form submit behaviour.
   * 2. Memanggil AuthService.login dengan username & password.
   * 3. Jika sukses: simpan token & user melalui useAuth.login lalu navigasi ke /dashboard.
   * 4. Jika gagal: set error message untuk ditampilkan ke user.
   *
   * Error handling:
   * - Menangkap exception network/JS dan menampilkan pesan generik.
   * - Menjaga isLoading selalu di-reset pada finally block.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await AuthService.login(formData.username, formData.password)

      if (response.success && response.data) {
        login(response.data.token, response.data.user)
        router.push('/dashboard')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err?.message || 'Login failed! Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * handleChange
   *
   * Generic input change handler untuk controlled inputs.
   * - Mengupdate formData sesuai name input.
   * - Membersihkan error saat user mulai mengetik ulang.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (error) setError('')
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="relative rounded-4xl overflow-hidden shadow-2xl">
        {/* Visual background gradients; purely presentational */}
        <div className="absolute inset-0">
          <div className="absolute w-[40%] h-[40%] -left-[15%] -top-[15%] bg-[#29C5EE]/40 rounded-full blur-[120px]" />
          <div className="absolute w-[50%] h-[50%] -right-[20%] -top-[20%] bg-[#CF1A2C]/40 rounded-full blur-[120px]" />
          <div className="absolute w-[40%] h-[40%] -left-[15%] -bottom-[15%] bg-[#EAB04D]/40 rounded-full blur-[120px]" />
          <div className="absolute w-[50%] h-[50%] -right-[20%] -bottom-[20%] bg-[#19C8A7]/40 rounded-full blur-[120px]" />
        </div>

        {/* Card Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT SIDE - Form */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            {/* Title / Intro */}
            <div className="text-center mb-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-[#ffffff] mb-2">Welcome</h1>
              <p className="text-[#ffffff] text-sm">We Are Glad To See You Back With Us</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200 text-sm text-center" role="alert">
                {error}
              </div>
            )}

            {/* Login Form (accessible & controlled) */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Username / Email */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Image src="/icons/name.png" alt="user" width={30} height={30} />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username/Email"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder:text-gray-500"
                  required
                  disabled={isLoading}
                  aria-label="Username or Email"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Image src="/icons/lock.png" alt="pass" width={30} height={30} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#F2F2F2] text-[#1C1C1C] rounded-xl pl-14 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-cyan-400 transition-all placeholder:text-gray-500"
                  required
                  disabled={isLoading}
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    /* Icon: visible */
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    /* Icon: hidden */
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 bg-slate-800 hover:bg-[#000000] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl py-3.5 transition-all duration-200 uppercase tracking-wider shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Loading...' : 'NEXT'}
              </button>

              {/* Secondary action: Sign Up */}
              <p className="text-center text-gray-400 text-sm mt-3">
                Don't have an account?{' '}
                <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>

          {/* RIGHT SIDE - Illustration (presentational only) */}
          <div className="hidden lg:flex items-center justify-center p-8 lg:p-12">
            <div className="relative w-full aspect-square max-w-md">
              <Image src="/images/login-image.png" alt="Team collaboration" fill className="object-cover rounded-2xl shadow-2xl" priority />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}