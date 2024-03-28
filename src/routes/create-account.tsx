import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "@/firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
    Form,
    Input,
    Message,
    Switcher,
    Title,
    Wrapper,
} from "@/components/auth-components";
import { GithubButton } from "@/components/github-btn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

type FormValues = {
    name: string;
    email: string;
    password: string;
};

export default function CreateAccount() {
    const nav = useNavigate();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [fbError, setFbError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (isLoading || !data.name || !data.email || !data.password) return;
        try {
            setLoading(() => true);
            const credentials = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            console.log(credentials.user);
            await updateProfile(credentials.user, { displayName: data.name });
            nav("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                setFbError(e.message);
            }
        } finally {
            setLoading(() => false);
        }
    };

    return (
        <Wrapper>
            <Title>
                Join <FontAwesomeIcon icon={faXTwitter} />
            </Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="text"
                    placeholder="name"
                    {...register("name", {
                        required: {
                            value: true,
                            message: "Please enter your name",
                        },
                    })}
                />
                {errors?.name && <Message>{errors?.name.message}</Message>}
                <Input
                    type="email"
                    placeholder="email"
                    {...register("email", {
                        required: {
                            value: true,
                            message: "Please enter your email",
                        },
                        pattern: {
                            value: /^[^@\s]+@[^@\s]+\.[^@\s]*$/,
                            message: "The email format is not valid",
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
                            message: "Please enter your password",
                        },
                        minLength: {
                            value: 8,
                            message:
                                "Please enter a password of at least 8 characters",
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
            {fbError && <Message>{fbError}</Message>}
            <Switcher>
                Already have an account? <Link to="/login">Log in &rarr;</Link>
            </Switcher>
            <GithubButton />
        </Wrapper>
    );
}
