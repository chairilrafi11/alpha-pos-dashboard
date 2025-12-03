'use client';

import { useEffect } from 'react';
import { useGlobalModal } from '@/context/ModalContext';
import { setGlobalModalHandler } from '@/utils/apiClient';

export default function GlobaModalHandlerInjector() {
    const { openModal } = useGlobalModal();

    useEffect(() => {
        const handler = (
            title: string, 
            content: string, 
            type: 'error' | 'warning' | 'info' | 'success',
            autoClose: boolean
        ) => {
            openModal({
                title: title,
                content: content,
                type: type, 
                autoCloseDelay: autoClose ? 2000 : null,
            });
        };

        setGlobalModalHandler(handler);

        return () => {
            setGlobalModalHandler(() => { });
        };
    }, [openModal]);

    return null;
}