'use client'

import { useState, useCallback } from 'react'

interface ConfirmationState {
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    type: 'danger' | 'warning' | 'info'
    onConfirmCallback: (() => void) | null
}

export function useConfirmation() {
    const [confirmation, setConfirmation] = useState<ConfirmationState>({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        type: 'danger',
        onConfirmCallback: null,
    })

    const showConfirmation = useCallback((
        title: string,
        message: string,
        onConfirm: () => void,
        options?: {
            confirmText?: string
            cancelText?: string
            type?: 'danger' | 'warning' | 'info'
        }
    ) => {
        setConfirmation({
            isOpen: true,
            title,
            message,
            confirmText: options?.confirmText || 'Confirm',
            cancelText: options?.cancelText || 'Cancel',
            type: options?.type || 'danger',
            onConfirmCallback: onConfirm,
        })
    }, [])

    const close = useCallback(() => {
        setConfirmation(prev => ({ ...prev, isOpen: false }))
    }, [])

    const handleConfirm = useCallback(() => {
        if (confirmation.onConfirmCallback) {
            confirmation.onConfirmCallback()
        }
    }, [confirmation.onConfirmCallback])

    return {
        confirmation,
        showConfirmation,
        close,
        handleConfirm,
    }
}