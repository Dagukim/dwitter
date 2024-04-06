import { auth } from "@/firebase";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

type FormValue = {
    email: string;
};

const Title = styled.h1`
    font-size: 24px;
`;

const Form = styled.form`
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
`;

const Label = styled.label`
    font-size: 14px;
    line-height: 1.5;
`;

const Input = styled.input`
    padding: 10px 20px;
    border: 1px solid #ddd;
    border-radius: 50px;
    width: 100%;
    font-size: 16px;
    &[type="submit"] {
        background-color: #1d9bf0;
        color: #fff;
        border: none;
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
    }
    &:first-child {
        margin-top: 0;
    }
`;

const Message = styled.span`
    display: block;
    padding-left: 24px;
    font-size: 12px;
    font-weight: 600;
    color: tomato;
`;

const SuccessMessage = styled.span`
    display: block;
    padding-left: 24px;
    font-size: 12px;
    font-weight: 600;
    color: green;
`;

export default function ResetPw() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [fbError, setFbError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { register, handleSubmit } = useForm<FormValue>();
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        if (isLoading || !data.email) return;
        try {
            setFbError(null);
            setLoading(true);
            await sendPasswordResetEmail(auth, data.email);
            setSuccessMessage("Password reset email sent successfully!");
        } catch (e) {
            if (e instanceof FirebaseError) {
                setFbError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Title>Reset your password</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Label htmlFor="email_field">
                    Enter your user account's verified email address and we will
                    send you a password reset link.
                </Label>
                <Input
                    id="email_field"
                    type="email"
                    placeholder="Enter your email address"
                    {...register("email", { required: true })}
                />
                {fbError && <Message>{fbError}</Message>}
                {successMessage && (
                    <SuccessMessage>{successMessage}</SuccessMessage>
                )}
                <Input
                    type="submit"
                    value={
                        isLoading ? "Loading..." : "Send password reset email"
                    }
                />
            </Form>
        </>
    );
}
