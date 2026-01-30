import React from 'react';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import tw from 'twin.macro';

type Props = Readonly<
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        title?: string;
        borderColor?: string;
        showFlashes?: string | boolean;
        showLoadingOverlay?: boolean;
    }
>;

const ContentBox = ({ title, borderColor, showFlashes, showLoadingOverlay, children, ...props }: Props) => (
    <div {...props}>
        {title && (
            <h2 
                css={tw`mb-4 px-4 text-2xl font-semibold`}
                style={{ 
                    color: 'hsl(220, 10%, 90%)',
                    background: 'linear-gradient(135deg, hsl(220, 10%, 95%) 0%, hsl(220, 10%, 70%) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}
            >
                {title}
            </h2>
        )}
        {showFlashes && (
            <FlashMessageRender byKey={typeof showFlashes === 'string' ? showFlashes : undefined} css={tw`mb-4`} />
        )}
        <div 
            css={tw`p-5 rounded-xl shadow-lg relative overflow-hidden`}
            style={{
                background: 'linear-gradient(135deg, hsla(220, 30%, 14%, 0.9) 0%, hsla(240, 25%, 12%, 0.95) 100%)',
                backdropFilter: 'blur(8px)',
                border: '1px solid hsla(255, 40%, 40%, 0.15)',
                ...(borderColor && { borderTopWidth: '4px', borderTopColor: borderColor }),
            }}
        >
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, hsla(255, 75%, 55%, 0.3) 50%, transparent 100%)',
                }}
            />
            <SpinnerOverlay visible={showLoadingOverlay || false} />
            {children}
        </div>
    </div>
);

export default ContentBox;
