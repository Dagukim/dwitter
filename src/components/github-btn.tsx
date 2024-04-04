import { auth, db } from "@/firebase";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    GithubAuthProvider,
    signInWithPopup,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
    transition: 0.2s;
    &:hover {
        opacity: 0.8;
    }
`;

export function GithubButton() {
    const nav = useNavigate();
    const onClick = async () => {
        try {
            const provider = new GithubAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const userRef = doc(db, "users", result.user.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                await updateProfile(result.user, {
                    displayName: result.user.email?.replace(/@.*/, "#github"),
                });
                await setDoc(userRef, {
                    username: result.user.displayName,
                    email: result.user.email,
                    avatar: result.user.photoURL,
                });
            }
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
