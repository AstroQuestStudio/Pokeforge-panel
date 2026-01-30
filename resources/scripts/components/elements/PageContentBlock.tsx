import React, { useEffect } from 'react';
import ContentContainer from '@/components/elements/ContentContainer';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import FlashMessageRender from '@/components/FlashMessageRender';

export interface PageContentBlockProps {
    title?: string;
    className?: string;
    showFlashKey?: string;
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, showFlashKey, className, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <CSSTransition timeout={150} classNames={'fade'} appear in>
            <>
                <ContentContainer css={tw`my-4 sm:my-10`} className={className}>
                    {showFlashKey && <FlashMessageRender byKey={showFlashKey} css={tw`mb-4`} />}
                    {children}
                </ContentContainer>
                <ContentContainer css={tw`mb-4`}>
                    <p 
                        css={tw`text-center text-xs py-4`}
                        style={{ color: 'hsl(220, 10%, 40%)' }}
                    >
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
                                transition: 'color 0.2s ease',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = 'hsl(185, 80%, 55%)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'hsl(220, 10%, 50%)'}
                        >
                            Pterodactyl
                        </a>
                        &nbsp;&copy; 2015 - {new Date().getFullYear()}
                    </p>
                </ContentContainer>
            </>
        </CSSTransition>
    );
};

export default PageContentBlock;
