import React, { forwardRef } from 'react';
import { Form } from 'formik';
import styled from 'styled-components/macro';
import { breakpoint } from '@/theme';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const Container = styled.div`
    ${breakpoint('sm')`
        ${tw`w-4/5 mx-auto`}
    `};

    ${breakpoint('md')`
        ${tw`p-10`}
    `};

    ${breakpoint('lg')`
        ${tw`w-3/5`}
    `};

    ${breakpoint('xl')`
        ${tw`w-full`}
        max-width: 800px;
    `};
`;

const FormWrapper = styled.div`
    ${tw`rounded-2xl p-8 md:p-10 mx-1 relative overflow-hidden`};
    background: linear-gradient(135deg, 
        hsla(220, 30%, 14%, 0.95) 0%, 
        hsla(240, 25%, 12%, 0.98) 100%
    );
    backdrop-filter: blur(16px);
    border: 1px solid hsla(255, 40%, 40%, 0.2);
    box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.5),
        0 0 100px -20px hsla(255, 75%, 55%, 0.15);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, 
            transparent 0%, 
            hsl(255, 75%, 55%) 30%, 
            hsl(185, 80%, 55%) 70%, 
            transparent 100%
        );
    }
`;

const Logo = styled.div`
    ${tw`flex flex-col items-center mb-8`};
    
    .logo-text {
        ${tw`text-4xl font-bold mt-4`};
        background: linear-gradient(135deg, hsl(255, 75%, 65%) 0%, hsl(185, 80%, 55%) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 0.05em;
    }
    
    .logo-subtitle {
        ${tw`text-sm mt-2`};
        color: hsl(220, 10%, 55%);
    }
`;

const RocketIcon = styled.div`
    ${tw`w-20 h-20 rounded-2xl flex items-center justify-center`};
    background: linear-gradient(135deg, 
        hsla(255, 60%, 50%, 0.3) 0%, 
        hsla(185, 60%, 50%, 0.2) 100%
    );
    border: 1px solid hsla(255, 40%, 50%, 0.3);
    box-shadow: 
        0 0 40px -10px hsla(255, 75%, 55%, 0.4),
        inset 0 0 30px hsla(255, 75%, 55%, 0.1);
    
    svg {
        width: 40px;
        height: 40px;
        color: hsl(185, 80%, 55%);
        filter: drop-shadow(0 0 10px hsla(185, 80%, 55%, 0.5));
    }
`;

export default forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <Container>
        <FlashMessageRender css={tw`mb-4 px-1`} />
        <Form {...props} ref={ref}>
            <FormWrapper>
                <Logo>
                    <RocketIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C9.243 2 6.85 3.678 5.753 6.092L4.497 5.048A9.97 9.97 0 0112 2zm0 0c2.757 0 5.15 1.678 6.247 4.092l1.256-1.044A9.97 9.97 0 0012 2zm9.293 7.707a1 1 0 01-1.414 0L17.5 7.328A7.97 7.97 0 0112 5a7.97 7.97 0 00-5.5 2.328L4.121 9.707a1 1 0 01-1.414-1.414l2.379-2.379A9.97 9.97 0 0112 3a9.97 9.97 0 016.914 2.914l2.379 2.379a1 1 0 010 1.414zM12 8a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4zm-1 9v2a1 1 0 102 0v-2a5.978 5.978 0 01-2 0z"/>
                        </svg>
                    </RocketIcon>
                    <span className="logo-text">AstroQuest</span>
                    <span className="logo-subtitle">Game Server Management</span>
                </Logo>
                {title && (
                    <h2 
                        css={tw`text-2xl text-center font-medium mb-6`}
                        style={{ color: 'hsl(220, 10%, 80%)' }}
                    >
                        {title}
                    </h2>
                )}
                <div css={tw`space-y-4`}>{props.children}</div>
            </FormWrapper>
        </Form>
        <p css={tw`text-center text-xs mt-6`} style={{ color: 'hsl(220, 10%, 40%)' }}>
            <span 
                style={{ 
                    background: 'linear-gradient(135deg, hsl(255, 75%, 65%) 0%, hsl(185, 80%, 55%) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: 600,
                }}
            >
                AstroQuest
            </span>
            &nbsp;•&nbsp;Powered by&nbsp;
            <a
                rel={'noopener nofollow noreferrer'}
                href={'https://pterodactyl.io'}
                target={'_blank'}
                style={{ 
                    color: 'hsl(220, 10%, 50%)',
                    textDecoration: 'none',
                }}
            >
                Pterodactyl Software
            </a>
        </p>
    </Container>
));
