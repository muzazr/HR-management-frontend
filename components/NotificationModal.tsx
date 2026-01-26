'use client'

import { useEffect } from 'react'
import Image from 'next/image'

interface NotificationModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'success' | 'error'
    title: string
    message: string
    autoClose?: boolean
    autoCloseDuration?: number
}

export default function NotificationModal({
    isOpen,
    onClose,
    type,
    title,
    message,
    autoClose = true,
    autoCloseDuration = 3000
}: NotificationModalProps) {

    // Auto close
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(() => {
                onClose()
            }, autoCloseDuration)

            return () => clearTimeout(timer)
        }
    }, [isOpen, autoClose, autoCloseDuration, onClose])

    if (!isOpen) return null

    const colors = {
        success: {
            gradient: 'bg-[#19C8A7]',
            border: 'border-[#19C8A7]',
            icon: '/icons/success.png',
            buttonBg: 'bg-[#19C8A7]/20',
            buttonHover: 'hover:bg-[#19C8A7]/30',
        },
        error: {
            gradient: 'bg-[#CF1A2C]',
            border: 'border-[#CF1A2C]',
            icon: '/icons/error.png',
            buttonBg: 'bg-[#CF1A2C]/20',
            buttonHover: 'hover:bg-[#CF1A2C]/30',
        }
    }

    const config = colors[type]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#1e1e1e] rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl w-full max-w-md animate-slide-up">
                
                {/* Gradient Blur Effect */}
                <div className="absolute inset-0 pointer-events-none">
                    <div 
                        className={`absolute w-[60%] h-[60%] -right-[20%] -top-[20%] ${config.gradient} rounded-full blur-[100px] opacity-40`}
                    />
                </div>

                {/* Content */}
                <div className="relative p-8">
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className={`w-20 h-20 rounded-full ${config.buttonBg} flex items-center justify-center`}>
                            {type === 'success' ? (
                                <svg className="w-12 h-12 text-[#19C8A7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-12 h-12 text-[#CF1A2C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white text-center mb-3">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-base text-gray-300 text-center mb-6 leading-relaxed">
                        {message}
                    </p>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className={`w-full px-6 py-3 ${config.buttonBg} ${config.buttonHover} text-white font-semibold rounded-xl transition-all`}
                    >
                        Close
                    </button>

                    {/* Auto close indicator */}
                    {autoClose && (
                        <div className="mt-4">
                            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${config.gradient} animate-shrink`}
                                    style={{ 
                                        animation: `shrink ${autoCloseDuration}ms linear forwards` 
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}