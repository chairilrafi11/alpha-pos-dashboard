'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

export type ModalType = 'success' | 'info' | 'warning' | 'error' | 'confirm';

interface ModalState {
    isOpen: boolean;
    content?: string | null;
    title?: string | null;
    onConfirm?: () => void | null;
    autoCloseDelay?: number | null;
    type: ModalType;
}

interface ModalContextType extends ModalState {
    openModal: (
        options: {
            content?: string | null;
            title?: string | null;
            onConfirm?: () => void | null;
            autoCloseDelay?: number | null;
            type: ModalType;
        }
    ) => void
    closeModal: () => void
}

const defaultState: ModalContextType = {
    isOpen: false,
    content: null,
    title: null,
    type: 'success',
    openModal: () => { },
    closeModal: () => { },
    autoCloseDelay: 300
};

export const ModalContext = createContext<ModalContextType>(defaultState);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
        content: null,
        title: null,
        autoCloseDelay: 1300,
        type: 'success',
    });

    const openModal = useCallback((
        options: {
            content?: string | null;
            title?: string | null;
            onConfirm?: () => void | null;
            autoCloseDelay?: number | null;
            type: ModalType;
        }
    ) => {
        setModalState({
            isOpen: true,
            content: options.content,
            title: options.title || options.type.charAt(0).toUpperCase() + options.type.slice(1),
            onConfirm: options.onConfirm,
            autoCloseDelay: options.autoCloseDelay,
            type: options.type,
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalState({
            isOpen: false,
            content: null,
            title: null,
            autoCloseDelay: null,
            type: 'success',
        });
    }, []);

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

export const useGlobalModal = () => useContext(ModalContext);