import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPortal } from "react-dom";
import styled from "styled-components";

const Frame = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.8);
`;
const ModalContent = styled.div`
    position: relative;
    padding: 42px;
    max-width: 500px;
    background-color: white;
    border-radius: 8px;
    color: #707070;
`;

const CloseButton = styled.span`
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    cursor: pointer;
    color: #555;
`;

export default function Modal({
    children,
    onClose,
}: {
    children: React.ReactNode;
    onClose: () => void;
}) {
    return createPortal(
        <Frame onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                {children}
                <CloseButton onClick={onClose}>
                    <FontAwesomeIcon icon={faX} size="xl" />
                </CloseButton>
            </ModalContent>
        </Frame>,
        document.getElementById("modal-root") as HTMLElement
    );
}
