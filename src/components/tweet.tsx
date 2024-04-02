import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { auth, db, storage } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    position: relative;
`;

const Photo = styled.img`
    max-width: 100%;
    max-height: 500px;
    border-radius: 15px;
    margin-top: 10px;
`;

const Username = styled.span`
    display: block;
    font-weight: 600;
    font-size: 15px;
`;

const Payload = styled.p`
    margin-top: 10px;
    font-size: 15px;
    line-height: 24px;
    word-wrap: break-word;
`;

const DeleteButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    border: none;
    background: none;
    color: white;
    transition: 0.2s;
    cursor: pointer;

    &:hover,
    &:active {
        color: #ff0000;
        scale: 1.3;
    }
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const user = auth.currentUser;
    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this tweet?");

        if (!ok || user?.uid !== userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const photoRef = ref(
                    storage,
                    `tweets/${user.uid}-${
                        user.displayName || "Anonymous"
                    }/${id}`
                );
                await deleteObject(photoRef);
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Wrapper>
            <Username>{username}</Username>
            {user?.uid === userId ? (
                <DeleteButton onClick={onDelete}>
                    <FontAwesomeIcon icon={faTrash} size="lg" />
                </DeleteButton>
            ) : null}
            {tweet ? <Payload>{tweet}</Payload> : null}
            {photo ? <Photo src={photo} /> : null}
        </Wrapper>
    );
}
