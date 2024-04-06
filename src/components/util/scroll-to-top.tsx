import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import styled from "styled-components";

const Button = styled.button`
    position: fixed;
    bottom: 50px;
    right: 50px;
    background: none;
    border: 2px solid #fff;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    width: 30px;
    height: 30px;
`;

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);

        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {isVisible && (
                <Button onClick={scrollToTop}>
                    <FontAwesomeIcon icon={faCaretUp} size="xl" />
                </Button>
            )}
        </>
    );
}
