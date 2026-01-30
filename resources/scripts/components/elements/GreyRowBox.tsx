import styled from 'styled-components/macro';
import tw from 'twin.macro';

export default styled.div<{ $hoverable?: boolean }>`
    ${tw`flex rounded-xl no-underline text-neutral-200 items-center p-5 transition-all duration-300 overflow-hidden relative`};
    
    background: linear-gradient(135deg, 
        hsla(220, 30%, 14%, 0.8) 0%, 
        hsla(240, 25%, 12%, 0.9) 100%
    );
    backdrop-filter: blur(8px);
    border: 1px solid hsla(255, 40%, 40%, 0.15);
    box-shadow: 
        0 4px 20px -5px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, 
            transparent 0%, 
            hsla(255, 75%, 55%, 0.3) 50%, 
            transparent 100%
        );
    }

    ${(props) => props.$hoverable !== false && `
        &:hover {
            transform: translateY(-2px);
            border-color: hsla(255, 60%, 50%, 0.3);
            box-shadow: 
                0 8px 30px -5px rgba(139, 92, 246, 0.2),
                0 4px 20px -5px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
    `};

    & .icon {
        ${tw`rounded-xl w-14 h-14 flex items-center justify-center transition-all duration-300`};
        background: linear-gradient(135deg, 
            hsla(255, 60%, 50%, 0.2) 0%, 
            hsla(185, 60%, 50%, 0.1) 100%
        );
        border: 1px solid hsla(255, 40%, 50%, 0.2);
        
        svg {
            color: hsl(185, 80%, 55%);
            filter: drop-shadow(0 0 4px hsla(185, 80%, 55%, 0.4));
        }
    }

    &:hover .icon {
        transform: scale(1.05);
        border-color: hsla(255, 50%, 60%, 0.3);
        box-shadow: 0 0 20px -5px hsla(255, 75%, 55%, 0.3);
    }
`;
