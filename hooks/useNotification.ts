'use client'

import { useState, useCallback } from 'react'

interface NotificationState {
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
}

export function useNotification() {
    const [notification, setNotification] = useState<NotificationState>({
        isOpen: false,
        type: 'success',
        title: '',
        message: '',
    })

    const showSuccess = useCallback((title: string, message: string) => {
        setNotification({
            isOpen: true,
            type: 'success',
            title,
            message,
        })
    }, [])

    const showError = useCallback((title: string, message: string) => {
        setNotification({
            isOpen: true,
            type: 'error',
            title,
            message,
        })
    }, [])

    const close = useCallback(() => {
        setNotification(prev => ({ ...prev, isOpen: false }))
    }, [])

    return {
        notification,
        showSuccess,
        showError,
        close,
    }
}