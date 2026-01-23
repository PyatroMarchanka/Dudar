import React from "react";
import styled from "styled-components";
import { mediaQueries } from "../../../constants/style";

interface ModalProps {
    isOpen: boolean;
    position: { left: number; top: number };
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, position, onMouseEnter, onMouseLeave, children }) => {
    if (!isOpen) return null;

    return (
        <ModalContent
            style={{
                left: `${position.left}px`,
                top: `${position.top}px`,
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </ModalContent>
    );
};

const ModalContent = styled.div`
    position: fixed;
    background: white;
    border-radius: 8px;
    min-width: 300px;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    margin-top: 4px;

    @media (max-width: ${mediaQueries.tabletMiddle}) {
        max-width: 90vw;
    }
`;

