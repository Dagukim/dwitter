import styled from "styled-components";

export const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 420px;
    padding: 50px 0;
`;

export const Title = styled.h1`
    font-size: 42px;
`;

export const Form = styled.form`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const Input = styled.input`
    padding: 10px 20px;
    margin: 12px 0 12px;
    border-radius: 50px;
    border: none;
    width: 100%;
    font-size: 16px;
    &[type="submit"] {
        background-color: #1d9bf0;
        color: #fff;
        cursor: pointer;
        transition: 0.2s;
        &:hover {
            opacity: 0.8;
        }
    }
    &:first-child {
        margin-top: 0;
    }
`;

export const Message = styled.span`
    display: block;
    padding-left: 24px;
    font-size: 12px;
    font-weight: 600;
    color: tomato;
`;

export const Switcher = styled.span`
    margin-top: 20px;
    a {
        transition: 0.2s;
        color: #1d9bf0;
        &:hover {
            opacity: 0.9;
        }
    }
`;

export const ForgotButton = styled.span`
    margin-top: 20px;
    color: #1d9bf0;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        opacity: 0.9;
    }
`;
