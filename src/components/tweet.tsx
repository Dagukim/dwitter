import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faX } from "@fortawesome/free-solid-svg-icons";
import { auth, db, storage } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import EditTweet from "./edit-tweet";

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
    background-color: #fff;
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

const TweetActions = styled.div`
    display: flex;
    position: absolute;
    top: 20px;
    right: 20px;
`;

const ActionButton = styled.button<{ $hoverColor?: string }>`
    width: 18px;
    height: 18px;
    margin-left: 8px;
    padding: 0;
    border: none;
    background: none;
    color: white;
    transition: 0.2s;
    cursor: pointer;

    &:first-child {
        margin: 0;
    }
    &:hover,
    &:active {
        color: ${(props) => props.$hoverColor};
        transform: scale(1.3);
    }
`;

export default function Tweet({
    username,
    photo,
    tweet,
    userId,
    id,
    isEditing,
    onEditToggle,
}: ITweet & { isEditing: boolean; onEditToggle: () => void }) {
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
                <TweetActions>
                    <ActionButton onClick={onEditToggle}>
                        {isEditing ? (
                            <FontAwesomeIcon icon={faX} size="lg" />
                        ) : (
                            <FontAwesomeIcon icon={faPen} size="lg" />
                        )}
                    </ActionButton>
                    <ActionButton onClick={onDelete} $hoverColor="#f4212e">
                        <FontAwesomeIcon icon={faTrash} size="lg" />
                    </ActionButton>
                </TweetActions>
            ) : null}

            {isEditing ? (
                <EditTweet
                    tweet={tweet}
                    userId={userId}
                    id={id}
                    photo={photo}
                    username={username}
                    onFinishEdit={onEditToggle}
                />
            ) : (
                <div>
                    {tweet ? <Payload>{tweet}</Payload> : null}
                    {photo ? <Photo src={photo} /> : null}
                </div>
            )}
        </Wrapper>
    );
}
