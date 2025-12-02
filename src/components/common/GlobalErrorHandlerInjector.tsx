'use client';

import { useEffect } from 'react';
import { useGlobalModal } from '@/context/ModalContext';
import { setGlobalErrorHandler } from '@/utils/apiClient';

export default function GlobalErrorHandlerInjector() {
    const { openModal } = useGlobalModal();

    useEffect(() => {
        const handler = (title: string, content: string, type: 'error' | 'warning' | 'info' | 'success') => {
            openModal({
                title: title,
                content: content,
                type: type, 
                autoCloseDelay: null,
            });
        };

        setGlobalErrorHandler(handler);

        return () => {
            setGlobalErrorHandler(() => { });
        };
    }, [openModal]);

    return null;
}