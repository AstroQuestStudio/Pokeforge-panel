import React, { Suspense } from 'react';
import styled, { css, keyframes } from 'styled-components/macro';
import tw from 'twin.macro';
import ErrorBoundary from '@/components/elements/ErrorBoundary';

export type SpinnerSize = 'small' | 'base' | 'large';

interface Props {
    size?: SpinnerSize;
    centered?: boolean;
    isBlue?: boolean;
}

interface Spinner extends React.FC<Props> {
    Size: Record<'SMALL' | 'BASE' | 'LARGE', SpinnerSize>;
    Suspense: React.FC<Props>;
}

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const glow = keyframes`
    0%, 100% { 
        box-shadow: 0 0 15px 2px hsla(255, 75%, 55%, 0.4),
                    0 0 30px 4px hsla(185, 80%, 55%, 0.2);
    }
    50% { 
        box-shadow: 0 0 20px 4px hsla(255, 75%, 55%, 0.6),
                    0 0 40px 8px hsla(185, 80%, 55%, 0.3);
    }
`;

const SpinnerComponent = styled.div<Props>`
    ${tw`w-10 h-10`};
    border-width: 3px;
    border-radius: 50%;
    animation: 
        ${spin} 1s cubic-bezier(0.55, 0.25, 0.25, 0.7) infinite,
        ${glow} 2s ease-in-out infinite;

    ${(props) =>
        props.size === 'small'
            ? tw`w-5 h-5 border-2`
            : props.size === 'large'
            ? css`
                  ${tw`w-16 h-16`};
                  border-width: 4px;
              `
            : null};

    border-color: hsla(255, 75%, 55%, 0.2);
    border-top-color: hsl(185, 80%, 55%);
    border-right-color: hsl(255, 75%, 55%);
`;

const Spinner: Spinner = ({ centered, ...props }) =>
    centered ? (
        <div css={[tw`flex justify-center items-center`, props.size === 'large' ? tw`m-20` : tw`m-6`]}>
            <SpinnerComponent {...props} />
        </div>
    ) : (
        <SpinnerComponent {...props} />
    );
Spinner.displayName = 'Spinner';

Spinner.Size = {
    SMALL: 'small',
    BASE: 'base',
    LARGE: 'large',
};

Spinner.Suspense = ({ children, centered = true, size = Spinner.Size.LARGE, ...props }) => (
    <Suspense fallback={<Spinner centered={centered} size={size} {...props} />}>
        <ErrorBoundary>{children}</ErrorBoundary>
    </Suspense>
);
Spinner.Suspense.displayName = 'Spinner.Suspense';

export default Spinner;
