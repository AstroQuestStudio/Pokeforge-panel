import React, { useEffect, useMemo, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import Fade from '@/components/elements/Fade';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface RequiredModalProps {
    visible: boolean;
    onDismissed: () => void;
    appear?: boolean;
    top?: boolean;
}

export interface ModalProps extends RequiredModalProps {
    dismissable?: boolean;
    closeOnEscape?: boolean;
    closeOnBackground?: boolean;
    showSpinnerOverlay?: boolean;
}

export const ModalMask: React.FC<{ onClick?: (e: React.MouseEvent) => void; children: React.ReactNode }> = ({
    onClick,
    children,
}) => (
    <div
        className={classNames(
            'fixed inset-0 z-50 overflow-auto flex',
            'bg-black/60 backdrop-blur-sm',
            'animate-fade-in'
        )}
        onClick={onClick}
        onContextMenu={(e) => e.stopPropagation()}
    >
        {children}
    </div>
);

const Modal: React.FC<ModalProps> = ({
    visible,
    appear,
    dismissable,
    showSpinnerOverlay,
    top = true,
    closeOnBackground = true,
    closeOnEscape = true,
    onDismissed,
    children,
}) => {
    const [render, setRender] = useState(visible);

    const isDismissable = useMemo(() => {
        return (dismissable || true) && !(showSpinnerOverlay || false);
    }, [dismissable, showSpinnerOverlay]);

    useEffect(() => {
        if (!isDismissable || !closeOnEscape) return;

        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setRender(false);
        };

        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
        };
    }, [isDismissable, closeOnEscape, render]);

    useEffect(() => setRender(visible), [visible]);

    return (
        <Fade in={render} timeout={150} appear={appear || true} unmountOnExit onExited={() => onDismissed()}>
            <ModalMask
                onClick={(e) => {
                    e.stopPropagation();
                    if (isDismissable && closeOnBackground && e.target === e.currentTarget) {
                        setRender(false);
                    }
                }}
            >
                <div
                    className={classNames(
                        'relative flex flex-col w-full m-auto',
                        'max-w-[95%] md:max-w-[75%] lg:max-w-[50%]',
                        'max-h-[calc(100vh-8rem)]',
                        top ? 'mt-[10%] mb-auto' : ''
                    )}
                >
                    {/* Close Button */}
                    {isDismissable && (
                        <button
                            className={classNames(
                                'absolute -top-10 right-0 p-2',
                                'text-white/50 hover:text-white',
                                'transition-all duration-200',
                                'hover:rotate-90',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50'
                            )}
                            onClick={() => setRender(false)}
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    )}

                    {/* Spinner Overlay */}
                    {showSpinnerOverlay && (
                        <Fade timeout={150} appear in>
                            <div
                                className={classNames(
                                    'absolute inset-0 rounded-xl',
                                    'flex items-center justify-center',
                                    'bg-neutral-900/50 backdrop-blur-sm',
                                    'z-50'
                                )}
                            >
                                <Spinner size="large" />
                            </div>
                        </Fade>
                    )}

                    {/* Modal Content */}
                    <div
                        className={classNames(
                            'p-4 sm:p-6',
                            'rounded-xl',
                            'overflow-y-auto',
                            // Glassmorphism
                            'bg-gradient-to-br from-neutral-800/95 to-neutral-900/95',
                            'backdrop-blur-xl',
                            'border border-white/10',
                            'shadow-2xl shadow-black/30',
                            // Animation
                            'animate-scale-in'
                        )}
                    >
                        {children}
                    </div>
                </div>
            </ModalMask>
        </Fade>
    );
};

const PortaledModal: React.FC<ModalProps> = ({ children, ...props }) => {
    const element = document.getElementById('modal-portal');
    
    if (!element) {
        return <Modal {...props}>{children}</Modal>;
    }

    return createPortal(<Modal {...props}>{children}</Modal>, element);
};

export default PortaledModal;
