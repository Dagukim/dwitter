import PostTweetForm from "@/components/post-tweet-form";
import Timeline from "@/components/timeline";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 50px;
    max-width: 700px;
`;

export default function Home() {
    return (
        <Wrapper>
            <PostTweetForm />
            <Timeline />
        </Wrapper>
    );
}
