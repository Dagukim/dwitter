import styled from "styled-components";

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const TextArea = styled.textarea`
    border: 2px solid #fff;
    padding: 20px;
    border-radius: 20px;
    font-size: 16px;
    color: #fff;
    background-color: #000;
    width: 100%;
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
        sans-serif;
    &::placeholder {
        font-size: 16px;
    }
    &:focus {
        outline: none;
        border-color: #1d9bf0;
    }
`;

export const AttachFileButton = styled.label`
    flex-grow: 1;
    padding: 10px 0;
    color: #1d9bf0;
    text-align: center;
    border-radius: 25px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;

export const ImageUploadContainer = styled.div`
    display: flex;
    gap: 10px;
`;

export const AttachFileInput = styled.input`
    display: none;
`;

export const DeleteFileButton = styled.button`
    color: tomato;
    background: transparent;
    border: 1px solid tomato;
    padding: 10px 14px;
    border-radius: 50%;
    cursor: pointer;
`;

export const PreviewImage = styled.img`
    width: 20px;
    height: 20px;
    background-color: #fff;
`;

export const SubmitButton = styled.input`
    background-color: #1d9bf0;
    color: #fff;
    border: none;
    padding: 10px 0;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;
    &:hover,
    &:active {
        opacity: 0.9;
    }
    &:disabled {
        opacity: 0.5;
    }
`;
