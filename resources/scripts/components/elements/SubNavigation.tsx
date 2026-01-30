import styled from 'styled-components/macro';
import tw from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`w-full shadow-lg overflow-x-auto relative`};
    background: linear-gradient(180deg, 
        hsla(220, 30%, 12%, 0.95) 0%, 
        hsla(240, 25%, 10%, 0.98) 100%
    );
    backdrop-filter: blur(8px);
    border-bottom: 1px solid hsla(255, 40%, 40%, 0.1);

    & > div {
        ${tw`flex items-center text-sm mx-auto px-4`};
        max-width: 1200px;

        & > a,
        & > div {
            ${tw`inline-block py-4 px-5 no-underline whitespace-nowrap transition-all duration-200 relative`};
            color: hsl(220, 10%, 55%);
            font-weight: 500;

            &:not(:first-of-type) {
                ${tw`ml-1`};
            }

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
                color: hsl(220, 10%, 85%);
                background: hsla(255, 40%, 40%, 0.1);
            }

            &:active,
            &.active {
                color: hsl(185, 80%, 55%);
                
                &::before {
                    width: 100%;
                }
            }
        }
    }
`;

export default SubNavigation;
