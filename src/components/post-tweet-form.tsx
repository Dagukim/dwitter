import { auth, db, storage } from "@/firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

type FormValue = {
    tweet: string;
    file: FileList | null;
};

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TextArea = styled.textarea`
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

const AttachFileButton = styled.label`
    padding: 10px 0;
    color: #1d9bf0;
    text-align: center;
    border-radius: 20px;
    border: 1px solid #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`;

const AttachFileInput = styled.input`
    display: none;
`;

const SubmitButton = styled.input`
    background-color: #1d9bf0;
    color: #fff;
    border: none;
    padding: 10px 0;
    border-radius: 20px;
    font-size: 16px;
    cursor: pointer;
    &:hover,
    &:active {
        opacity: 0.9;
    }
    &:disabled {
        opacity: 0.5;
    }
`;

export default function PostTweetForm() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const { register, handleSubmit, watch, reset, resetField } =
        useForm<FormValue>();
    const tweetValue = watch("tweet");
    const fileValue = watch("file");

    const disableSubmit =
        (!tweetValue || tweetValue?.trim() === "") &&
        (!fileValue || fileValue?.length === 0);
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const user = auth.currentUser;
        if (!user || isLoading || data.tweet.length > 180) return;

        try {
            setLoading(true);
            const doc = await addDoc(collection(db, "tweets"), {
                tweet: data.tweet.trim() !== "" ? data.tweet : "",
                createdAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
            });
            if (data.file && data.file.length > 0) {
                const file = data.file[0];
                const locationRef = ref(
                    storage,
                    `tweets/${user.uid}-${user.displayName || "Anonymous"}/${
                        doc.id
                    }`
                );
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc, { photo: url });
            }

            reset();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const file = fileValue?.[0];
        if (file && file.size > 1024 * 1024) {
            alert(
                "The file is too large. Please select a file that is 1MB or smaller."
            );
            resetField("file");
        }
    }, [fileValue, resetField]);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <TextArea
                rows={5}
                maxLength={180}
                placeholder="What is happening?"
                {...register("tweet")}
            />
            <AttachFileButton htmlFor="file">
                {fileValue && fileValue.length > 0
                    ? "Photo added ✅"
                    : "Add Photo"}
            </AttachFileButton>
            <AttachFileInput
                type="file"
                id="file"
                accept="image/*"
                {...register("file")}
            />
            <SubmitButton
                type="submit"
                disabled={disableSubmit}
                value={isLoading ? "Posting..." : "Post Tweet"}
            />
        </Form>
    );
}
