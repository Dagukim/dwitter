import { db } from "@/firebase";
import {
    collection,
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
    username: string;
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

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
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
