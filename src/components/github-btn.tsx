import { auth } from "@/firebase";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Button = styled.span`
    margin-top: 50px;
    background-color: #fff;
    color: #000;
    font-weight: 500;
    width: 100%;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
`;

export function GithubButton() {
    const nav = useNavigate();
    const onClick = async () => {
        try {
            const provieder = new GithubAuthProvider();
            await signInWithPopup(auth, provieder);
            nav("/");
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Button onClick={onClick}>
            <FontAwesomeIcon icon={faGithub} size="xl" />
            Continue with Github
        </Button>
    );
}
