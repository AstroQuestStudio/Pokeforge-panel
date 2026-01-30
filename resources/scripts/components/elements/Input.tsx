import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
}

const light = css<Props>`
    background: hsla(220, 15%, 95%, 0.95);
    border-color: hsl(220, 15%, 80%);
    color: hsl(220, 20%, 20%);
    
    &:focus {
        border-color: hsl(255, 75%, 55%);
        box-shadow: 0 0 0 3px hsla(255, 75%, 55%, 0.15);
    }

    &:disabled {
        background: hsl(220, 10%, 92%);
        border-color: hsl(220, 10%, 85%);
    }
`;

const checkboxStyle = css<Props>`
    ${tw`cursor-pointer appearance-none inline-block align-middle select-none flex-shrink-0 w-5 h-5 rounded`};
    background: hsla(220, 30%, 20%, 0.8);
    border: 2px solid hsla(255, 40%, 50%, 0.3);
    color-adjust: exact;
    background-origin: border-box;
    transition: all 0.2s ease;

    &:checked {
        ${tw`border-transparent bg-no-repeat bg-center`};
        background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
        background-color: hsl(255, 75%, 55%);
        background-size: 100% 100%;
        box-shadow: 0 0 12px hsla(255, 75%, 55%, 0.4);
    }

    &:focus {
        border-color: hsl(255, 60%, 55%);
        box-shadow: 0 0 0 3px hsla(255, 75%, 55%, 0.2);
    }

    &:hover:not(:checked) {
        border-color: hsl(255, 60%, 55%);
    }
`;

const inputStyle = css<Props>`
    resize: none;
    ${tw`appearance-none outline-none w-full min-w-0`};
    ${tw`p-3 rounded-lg text-sm transition-all duration-200`};
    
    background: hsla(220, 30%, 15%, 0.8);
    border: 2px solid hsla(255, 30%, 40%, 0.2);
    color: hsl(220, 10%, 90%);
    backdrop-filter: blur(4px);
    
    &::placeholder {
        color: hsl(220, 10%, 45%);
    }

    &:hover:not(:disabled):not(:read-only) {
        border-color: hsla(255, 40%, 50%, 0.3);
    }

    & + .input-help {
        ${tw`mt-2 text-xs`};
        color: ${(props) => (props.hasError ? 'hsl(0, 80%, 65%)' : 'hsl(220, 10%, 55%)')};
    }

    &:required,
    &:invalid {
        ${tw`shadow-none`};
    }

    &:not(:disabled):not(:read-only):focus {
        border-color: hsl(255, 60%, 55%);
        box-shadow: 
            0 0 0 3px hsla(255, 75%, 55%, 0.15),
            0 4px 20px -5px hsla(255, 75%, 55%, 0.2);
        ${(props) => props.hasError && css`
            border-color: hsl(0, 70%, 55%);
            box-shadow: 
                0 0 0 3px hsla(0, 70%, 55%, 0.15),
                0 4px 20px -5px hsla(0, 70%, 55%, 0.2);
        `};
    }

    &:disabled {
        ${tw`opacity-60 cursor-not-allowed`};
        background: hsla(220, 20%, 18%, 0.6);
    }

    ${(props) => props.isLight && light};
    ${(props) => props.hasError && css`
        border-color: hsla(0, 60%, 50%, 0.5);
        
        &:hover:not(:disabled):not(:read-only) {
            border-color: hsl(0, 60%, 55%);
        }
    `};
`;

const Input = styled.input<Props>`
    &:not([type='checkbox']):not([type='radio']) {
        ${inputStyle};
    }

    &[type='checkbox'],
    &[type='radio'] {
        ${checkboxStyle};

        &[type='radio'] {
            ${tw`rounded-full`};
        }
    }
`;

const Textarea = styled.textarea<Props>`
    ${inputStyle}
`;

export { Textarea };
export default Input;
