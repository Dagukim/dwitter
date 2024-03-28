import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import {
    ForgotButton,
    Form,
    Input,
    Message,
    Switcher,
    Title,
    Wrapper,
} from "@/components/auth-components";
import { GithubButton } from "@/components/github-btn";
import Modal from "@/components/Modal/modal";
import ResetPw from "@/components/reset-pw";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

type FormValues = {
    email: string;
    password: string;
};

export default function Login() {
    const nav = useNavigate();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [fbError, setFbError] = useState<string | null>(null);
    const { register, handleSubmit } = useForm<FormValues>();
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (isLoading || !data.email || !data.password) return;
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, data.email, data.password);
            nav("/");
        } catch (e) {
            if (e instanceof FirebaseError) {
                setFbError(e.message);
            }
        } finally {
            setLoading(false);
        }
    };
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <Wrapper>
            <Title>
                Log Into <FontAwesomeIcon icon={faXTwitter} />
            </Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    type="email"
                    placeholder="email"
                    {...register("email", { required: true })}
                />
                <Input
                    type="password"
                    placeholder="password"
                    {...register("password", { required: true })}
                />
                <Input
                    type="submit"
                    value={isLoading ? "Loading..." : "Login"}
                />
            </Form>
            {fbError && <Message>{fbError}</Message>}
            <Switcher>
                Don't have an account?{" "}
                <Link to="/create-account">Create one &rarr;</Link>
            </Switcher>
            <ForgotButton onClick={openModal}>Forgot password?</ForgotButton>
            {showModal && (
                <Modal onClose={closeModal}>
                    <ResetPw />
                </Modal>
            )}
            <GithubButton />
        </Wrapper>
    );
}
