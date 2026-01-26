'use client'

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger'
}: ConfirmationModalProps) {

    if (!isOpen) return null

    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    const colors = {
        danger: {
            gradient: 'bg-[#CF1A2C]',
            icon: 'text-[#CF1A2C]',
            buttonBg: 'bg-[#CF1A2C]',
            buttonHover: 'hover:bg-[#b01625]',
        },
        warning: {
            gradient: 'bg-[#EAB04D]',
            icon: 'text-[#EAB04D]',
            buttonBg: 'bg-[#EAB04D]',
            buttonHover: 'hover:bg-[#d19a3a]',
        },
        info: {
            gradient: 'bg-[#29C5EE]',
            icon: 'text-[#29C5EE]',
            buttonBg: 'bg-[#29C5EE]',
            buttonHover: 'hover:bg-[#1fa8cc]',
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
                        className={`absolute w-[60%] h-[60%] -right-[20%] -top-[20%] ${config.gradient} rounded-full blur-[100px] opacity-30`}
                    />
                </div>

                {/* Content */}
                <div className="relative p-8">
                    
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                            <svg className={`w-12 h-12 ${config.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white text-center mb-3">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-base text-gray-300 text-center mb-8 leading-relaxed">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 px-6 py-3 ${config.buttonBg} ${config.buttonHover} text-white font-semibold rounded-xl transition-all`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}