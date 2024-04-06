import Modal from "@/components/Modal/modal";
import ProfileEditForm from "@/components/profile-edit-form";
import { ITweet } from "@/components/timeline";
import Tweet from "@/components/tweet";
import { auth, db } from "@/firebase";
import { faPen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Unsubscribe,
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
`;

const AvatarBox = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Name = styled.span`
    font-size: 22px;
`;

const AboutMe = styled.pre`
    white-space: pre-wrap;
    word-break: break-all;
`;

const EditProfileButton = styled.button`
    display: flex;
    gap: 4px;
    padding: 8px 12px;
    border: 1px solid #555;
    border-radius: 20px;
    background: transparent;
    font-size: 14px;
    color: white;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        background-color: #333;
    }
`;

const Tweets = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [showModal, setShowModal] = useState(false);
    const [tweets, setTweet] = useState<ITweet[]>([]);
    const [editingTweetId, setEditingTweetId] = useState<string | null>(null);

    const openModal = () => {
        setShowModal(true);
    };
    const closeModal = () => setShowModal(false);

    const handleEdit = (tweetId: string) => {
        setEditingTweetId((prev) => (prev === tweetId ? null : tweetId));
    };

    useEffect(() => {
        if (!user) return;
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            unsubscribe = onSnapshot(tweetsQuery, async (snapshot) => {
                const tweets: ITweet[] = await Promise.all(
                    snapshot.docs.map((doc) => {
                        const { tweet, createdAt, userId, photo } = doc.data();
                        return {
                            tweet,
                            createdAt,
                            userId,
                            username: user.displayName,
                            photo,
                            userAvatarUrl: avatar,
                            id: doc.id,
                        };
                    })
                );
                setTweet(tweets);
            });
        };
        fetchTweets();

        return () => {
            unsubscribe && unsubscribe();
        };
    }, [avatar, user?.displayName, user]);

    return (
        <Wrapper>
            <InfoContainer>
                <AvatarBox htmlFor="avatar">
                    {avatar ? (
                        <AvatarImg src={avatar} alt="avatar" />
                    ) : (
                        <FontAwesomeIcon icon={faUser} size="2xl" />
                    )}
                </AvatarBox>
                <Name>{user?.displayName ?? "Anonymous"}</Name>
                <AboutMe>about me</AboutMe>
                <EditProfileButton onClick={openModal}>
                    edit profile
                    <FontAwesomeIcon icon={faPen} size="1x" />
                </EditProfileButton>
            </InfoContainer>
            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet
                        key={tweet.id}
                        isEditing={editingTweetId === tweet.id}
                        onEditToggle={() => handleEdit(tweet.id)}
                        {...tweet}
                    />
                ))}
            </Tweets>
            {showModal && user?.uid ? (
                <Modal onClose={closeModal}>
                    <ProfileEditForm
                        userId={user.uid}
                        setPhoto={setAvatar}
                        onClose={closeModal}
                    />
                </Modal>
            ) : null}
        </Wrapper>
    );
}
