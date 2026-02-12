import React from "react";
import styled from "styled-components";
import { mediaQueries } from "../../../constants/style";

interface ModalProps {
    isOpen: boolean;
    position: { left: number; top: number };
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, position, children }) => {
    if (!isOpen) return null;

    return (
        <ModalContent
            style={{
                left: `${position.left}px`,
                top: `${position.top}px`,
            }}
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
    overflow-x: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    margin-top: 0;
    pointer-events: auto;

    @media (max-width: ${mediaQueries.tabletMiddle}) {
        max-width: 90vw;
    }
`;

