import { ITweet } from "@/components/timeline";
import Tweet from "@/components/tweet";
import { auth, db, storage } from "@/firebase";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateProfile } from "firebase/auth";
import {
    Unsubscribe,
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const AvatarImg = styled.img`
    width: 100%;
`;

const AvatarInput = styled.input`
    display: none;
`;

const Name = styled.span`
    font-size: 22px;
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
    const [tweets, setTweet] = useState<ITweet[]>([]);
    const [editingTweetId, setEditingTweetId] = useState<string | null>(null);
    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!user) return;
        if (files && files.length === 1) {
            const file = files[0];
            const locationRef = ref(storage, `user/${user.uid}/avatar`);
            const result = await uploadBytes(locationRef, file);
            const avatarUrl = await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user, { photoURL: avatarUrl });
        }
    };

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
            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
                const tweets = snapshot.docs.map((doc) => {
                    const { tweet, createdAt, userId, username, photo } =
                        doc.data();
                    return {
                        tweet,
                        createdAt,
                        userId,
                        username,
                        photo,
                        id: doc.id,
                    };
                });
                setTweet(tweets);
            });
        };
        fetchTweets();

        return () => {
            unsubscribe && unsubscribe();
        };
    }, [user]);

    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {avatar ? (
                    <AvatarImg src={avatar} />
                ) : (
                    <FontAwesomeIcon icon={faUser} size="2xl" />
                )}
            </AvatarUpload>
            <AvatarInput
                onChange={onAvatarChange}
                type="file"
                id="avatar"
                accept="image/*"
            />
            <Name>{user?.displayName ?? "Anonymous"}</Name>
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
        </Wrapper>
    );
}
