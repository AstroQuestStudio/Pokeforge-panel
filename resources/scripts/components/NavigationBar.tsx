import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt, faRocket } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Tooltip from '@/components/elements/tooltip/Tooltip';
import Avatar from '@/components/Avatar';

const NavigationWrapper = styled.div`
    ${tw`w-full shadow-lg overflow-x-auto relative`};
    background: linear-gradient(180deg, 
        hsla(220, 35%, 10%, 0.95) 0%, 
        hsla(240, 30%, 8%, 0.98) 100%
    );
    backdrop-filter: blur(12px);
    border-bottom: 1px solid hsla(255, 50%, 50%, 0.15);
    
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
            transparent 0%, 
            hsl(255, 75%, 55%) 30%, 
            hsl(185, 80%, 55%) 70%, 
            transparent 100%
        );
        opacity: 0.5;
    }
`;

const Logo = styled(Link)`
    ${tw`text-2xl font-header font-semibold px-4 no-underline transition-all duration-300`};
    background: linear-gradient(135deg, hsl(255, 75%, 65%) 0%, hsl(185, 80%, 55%) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    &:hover {
        filter: brightness(1.2);
        transform: translateY(-1px);
    }

    svg {
        color: hsl(185, 80%, 55%);
        -webkit-text-fill-color: initial;
        filter: drop-shadow(0 0 8px hsla(185, 80%, 55%, 0.5));
        transition: all 0.3s ease;
    }

    &:hover svg {
        transform: rotate(-10deg) scale(1.1);
    }
`;

const RightNavigation = styled.div`
    ${tw`flex h-full items-center justify-center`};
    
    & > a,
    & > button,
    & > .navigation-link {
        ${tw`flex items-center h-full no-underline px-5 cursor-pointer transition-all duration-200 relative`};
        color: hsl(220, 10%, 65%);
        
        &::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, hsl(255, 75%, 55%), hsl(185, 80%, 55%));
            transform: translateX(-50%);
            transition: width 0.3s ease;
            border-radius: 2px;
        }

        &:hover {
            color: hsl(220, 10%, 95%);
            background: hsla(255, 50%, 50%, 0.1);
        }

        &:active,
        &.active {
            color: hsl(185, 80%, 55%);
            
            &::before {
                width: 80%;
            }
        }

        svg {
            ${tw`w-5 h-5 transition-all duration-200`};
        }

        &:hover svg {
            transform: scale(1.15);
            filter: drop-shadow(0 0 6px hsla(185, 80%, 55%, 0.5));
        }
    }
`;

const AvatarWrapper = styled.span`
    ${tw`flex items-center w-8 h-8 rounded-full overflow-hidden transition-all duration-200`};
    border: 2px solid transparent;
    background: linear-gradient(135deg, hsl(255, 75%, 55%), hsl(185, 80%, 55%)) border-box;
    
    &:hover {
        transform: scale(1.1);
        box-shadow: 0 0 12px hsla(255, 75%, 55%, 0.4);
    }
`;

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is valid
            window.location = '/';
        });
    };

    return (
        <NavigationWrapper>
            <SpinnerOverlay visible={isLoggingOut} />
            <div className={'mx-auto w-full flex items-center h-[4rem] max-w-[1200px]'}>
                <div id={'logo'} className={'flex-1'}>
                    <Logo to={'/'}>
                        <FontAwesomeIcon icon={faRocket} />
                        {name}
                    </Logo>
                </div>
                <RightNavigation>
                    <SearchContainer />
                    <Tooltip placement={'bottom'} content={'Dashboard'}>
                        <NavLink to={'/'} exact>
                            <FontAwesomeIcon icon={faLayerGroup} />
                        </NavLink>
                    </Tooltip>
                    {rootAdmin && (
                        <Tooltip placement={'bottom'} content={'Admin'}>
                            <a href={'/admin'} rel={'noreferrer'}>
                                <FontAwesomeIcon icon={faCogs} />
                            </a>
                        </Tooltip>
                    )}
                    <Tooltip placement={'bottom'} content={'Account Settings'}>
                        <NavLink to={'/account'}>
                            <AvatarWrapper>
                                <Avatar.User />
                            </AvatarWrapper>
                        </NavLink>
                    </Tooltip>
                    <Tooltip placement={'bottom'} content={'Sign Out'}>
                        <button onClick={onTriggerLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </Tooltip>
                </RightNavigation>
            </div>
        </NavigationWrapper>
    );
};
