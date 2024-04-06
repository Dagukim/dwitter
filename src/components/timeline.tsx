import { db } from "@/firebase";
import {
    collection,
    doc,
    getDoc,
    limit,
    onSnapshot,
    orderBy,
    query,
    Unsubscribe,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Tweet from "./tweet";

export interface ITweet {
    id: string;
    photo?: string;
    tweet?: string;
    userId: string;
    username: string | null | undefined;
    userAvatarUrl?: string | null | undefined;
    createdAt: number;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
`;

export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);
    const [editingTweetId, setEditingTweetId] = useState<string | null>(null);

    const getUserInfo = async (userId: string) => {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            return {
                username: userDocSnap.data().username,
                avatar: userDocSnap.data().avatar,
            };
        }
        return undefined;
    };

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                limit(25)
            );
            unsubscribe = onSnapshot(tweetsQuery, async (snapshot) => {
                const tweets: ITweet[] = await Promise.all(
                    snapshot.docs.map(async (doc) => {
                        const { tweet, createdAt, userId, photo } = doc.data();
                        const userInfo = await getUserInfo(userId);
                        return {
                            tweet,
                            createdAt,
                            userId,
                            username: userInfo?.username,
                            photo,
                            userAvatarUrl: userInfo?.avatar,
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
    }, []);

    const handleEdit = (tweetId: string) => {
        setEditingTweetId((prev) => (prev === tweetId ? null : tweetId));
    };

    return (
        <Wrapper>
            {tweets.map((tweet) => (
                <Tweet
                    key={tweet.id}
                    {...tweet}
                    isEditing={editingTweetId === tweet.id}
                    onEditToggle={() => handleEdit(tweet.id)}
                />
            ))}
        </Wrapper>
    );
}
