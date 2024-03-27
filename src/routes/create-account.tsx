import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

type FormValues = {
    name: string;
    email: string;
    password: string;
};

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 420px;
    padding: 50px 0;
`;

const Title = styled.h1`
    font-size: 42px;
`;

const Form = styled.form`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Input = styled.input`
    padding: 10px 20px;
    margin: 12px 0 12px;
    border-radius: 50px;
    border: none;
    width: 100%;
    font-size: 16px;
    &[type="submit"] {
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
    }
`;

const Message = styled.span`
    display: block;
    padding-left: 24px;
    font-size: 12px;
    font-weight: 600;
    color: tomato;
`;

export default function CreateAccount() {
    const nav = useNavigate();
    const [isLoading, setLoding] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (isLoading || !data.name || !data.email || !data.password) return;
        try {
            setLoding(() => true);
            const credentials = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            console.log(credentials.user);
            await updateProfile(credentials.user, { displayName: data.name });
            nav("/");
        } catch (e) {
            console.log(e);
        } finally {
            setLoding(() => false);
        }
    };

    return (
        <Wrapper>
            <Title>Join ✖</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="text"
                    placeholder="name"
                    {...register("name", {
                        required: {
                            value: true,
                            message: "이름을 입력해주세요",
                        },
                    })}
                />
                <div style={{ transition: "all 0.6s" }}>
                    {errors?.name && <Message>{errors?.name.message}</Message>}
                </div>
                <Input
                    type="email"
                    placeholder="email"
                    {...register("email", {
                        required: {
                            value: true,
                            message: "이메일을 입력해주세요",
                        },
                        pattern: {
                            value: /^[^@\s]+@[^@\s]+\.[^@\s]*$/,
                            message: "이메일 형식이 올바르지 않습니다",
                        },
                    })}
                />
                {errors?.email && <Message>{errors?.email.message}</Message>}
                <Input
                    type="password"
                    placeholder="password"
                    {...register("password", {
                        required: {
                            value: true,
                            message: "비밀번호를 입력해주세요",
                        },
                        minLength: {
                            value: 8,
                            message: "비밀번호 길이를 8자리 이상 입력해주세요",
                        },
                    })}
                />
                {errors?.password && (
                    <Message>{errors?.password.message}</Message>
                )}
                <Input
                    type="submit"
                    value={isLoading ? "Loading..." : "Create Account"}
                />
            </Form>
        </Wrapper>
    );
}
