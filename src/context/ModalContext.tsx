'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

// --- Interfaces ---
interface ModalState {
    isOpen: boolean;
    content?: ReactNode | null;
    title?: string | null;
    onConfirm?: () => void | null;
    autoCloseDelay?: number | null;
}

interface ModalContextType extends ModalState {
    openModal: (
        content?: ReactNode | null,
        title?: string | null,
        onConfirm?: () => void | null,
        autoCloseDelay?: number | null
    ) => void
    closeModal: () => void
}

// Nilai default untuk Context
const defaultState: ModalContextType = {
    isOpen: false,
    content: null,
    title: 'Sukses',
    openModal: () => { },
    closeModal: () => { },
    autoCloseDelay: 300
};

export const ModalContext = createContext<ModalContextType>(defaultState);

// --- Provider Component ---
export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        content: null,
        title: 'Sukses',
        autoCloseDelay: 300,
    });

    // Fungsi untuk membuka modal
    const openModal = useCallback((
        content?: ReactNode | null,
        title?: string | null,
        onConfirm?: () => void,
        autoCloseDelay?: number | null
    ) => {
        setModalState({
            isOpen: true,
            content,
            title: title || 'Sukses',
            onConfirm,
            autoCloseDelay
        });
    }, []);

    // Fungsi untuk menutup modal dan mereset state
    const closeModal = useCallback(() => {
        setModalState({
            isOpen: false,
            content: null,
            title: '',
            autoCloseDelay: null
        });
    }, []);

    // Nilai Context yang akan diberikan ke komponen anak
    const contextValue = {
        ...modalState,
        openModal,
        closeModal,
    };

    return (
        <ModalContext.Provider value={contextValue}>
            {children}
        </ModalContext.Provider>
    );
};

// --- Custom Hook untuk Kemudahan Akses ---
export const useGlobalModal = () => useContext(ModalContext);