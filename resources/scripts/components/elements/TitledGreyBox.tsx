import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';

interface Props {
    icon?: IconProp;
    title: string | React.ReactNode;
    className?: string;
    children: React.ReactNode;
}

const TitledGreyBox = ({ icon, title, children, className }: Props) => (
    <div 
        css={tw`rounded-xl shadow-lg overflow-hidden`}
        className={className}
        style={{
            background: 'linear-gradient(135deg, hsla(220, 30%, 14%, 0.9) 0%, hsla(240, 25%, 12%, 0.95) 100%)',
            backdropFilter: 'blur(8px)',
            border: '1px solid hsla(255, 40%, 40%, 0.15)',
        }}
    >
        <div 
            css={tw`p-4 relative`}
            style={{
                background: 'linear-gradient(135deg, hsla(255, 40%, 25%, 0.3) 0%, hsla(220, 30%, 15%, 0.3) 100%)',
                borderBottom: '1px solid hsla(255, 40%, 40%, 0.1)',
            }}
        >
            <div 
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, hsla(255, 75%, 55%, 0.2) 50%, transparent 100%)',
                }}
            />
            {typeof title === 'string' ? (
                <p css={tw`text-sm uppercase font-semibold tracking-wide flex items-center`}>
                    {icon && (
                        <FontAwesomeIcon 
                            icon={icon} 
                            css={tw`mr-3`} 
                            style={{ 
                                color: 'hsl(185, 80%, 55%)',
                                filter: 'drop-shadow(0 0 4px hsla(185, 80%, 55%, 0.4))',
                            }}
                        />
                    )}
                    <span style={{ color: 'hsl(220, 10%, 75%)' }}>{title}</span>
                </p>
            ) : (
                title
            )}
        </div>
        <div css={tw`p-4`}>{children}</div>
    </div>
);

export default memo(TitledGreyBox, isEqual);
