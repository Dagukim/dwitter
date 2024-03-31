import { db } from "@/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Tweet from "./tweet";

export interface ITweet {
    id: string;
    photo?: string;
    tweet: string;
    userId: string;
    userName: string;
    createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);
    const fetchTweets = async () => {
        const tweetsQuery = query(
            collection(db, "tweets"),
            orderBy("createdAt", "desc")
        );
        const spanshot = await getDocs(tweetsQuery);
        const tweets = spanshot.docs.map((doc) => {
            const { tweet, createdAt, userId, userName, photo } = doc.data();
            return {
                tweet,
                createdAt,
                userId,
                userName,
                photo,
                id: doc.id,
            };
        });
        setTweet(tweets);
    };
    useEffect(() => {
        fetchTweets();
    }, []);
    return (
        <Wrapper>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
            ))}
        </Wrapper>
    );
}
