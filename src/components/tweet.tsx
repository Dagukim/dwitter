import { styled } from "styled-components";
import { ITweet } from "./timeline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

const DeleteButton = styled.span`
    position: absolute;
    top: 20px;
    right: 20px;
    color: white;
    transition: 0.2s;
    cursor: pointer;

    &:hover,
    &:active {
        color: #ff0000;
        scale: 1.5;
    }
`;

export default function Tweet({ username, photo, tweet }: ITweet) {
    return (
        <Wrapper>
            <Username>{username}</Username>
            <DeleteButton>
                <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
            {tweet ? <Payload>{tweet}</Payload> : null}
            {photo ? <Photo src={photo} /> : null}
        </Wrapper>
    );
}
