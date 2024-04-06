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
    background-color: rgba(91, 112, 131, 0.4);
`;
const ModalContent = styled.div`
    position: relative;
    padding: 42px;
    width: 500px;
    background-color: black;
    border-radius: 16px;
    color: #fff;
`;

const CloseButton = styled.span`
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    cursor: pointer;
    color: #fff;
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
