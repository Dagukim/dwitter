import { db, storage } from "@/firebase";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { doc, updateDoc } from "firebase/firestore";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

type FormValue = {
    tweet: string;
    file: FileList | null;
};

const Form = styled.form`
    margin-top: 10px;
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

const ImageUploadContainer = styled.div`
    display: flex;
    gap: 10px;
`;

const AttachFileButton = styled.label`
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

const AttachFileInput = styled.input`
    display: none;
`;

const DeleteFileButton = styled.button`
    color: tomato;
    background: transparent;
    border: 1px solid tomato;
    padding: 10px 14px;
    border-radius: 50%;
    cursor: pointer;
`;

const PreviewImage = styled.img`
    width: 20px;
    height: 20px;
    background-color: #fff;
`;

const SubmitButton = styled.input`
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

export default function EditTweet({
    tweet,
    photo,
    id,
    userId,
    username,
    onFinishEdit,
}: {
    tweet?: string;
    photo?: string;
    id: string;
    userId: string;
    username: string;
    onFinishEdit: () => void;
}) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | undefined>(photo);
    const { register, handleSubmit, watch, resetField } = useForm<FormValue>({
        defaultValues: { tweet: tweet },
    });
    const tweetValue = watch("tweet");
    const fileValue = watch("file");
    // ???
    const disableSubmit =
        (!tweetValue || tweetValue?.trim() === "") && !imagePreview;
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        try {
            setLoading(true);
            const tweetDocRef = doc(db, "tweets", id);
            const tweetData: { tweet: string; photo?: string } = {
                tweet: data?.tweet,
            };
            const locationRef = ref(
                storage,
                `tweets/${userId}-${username || "Anonymous"}/${id}`
            );

            if (data.file && data.file.length > 0) {
                const file = data.file[0];
                if (photo) {
                    await deleteObject(locationRef);
                }
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                tweetData.photo = url;
            }
            if (photo && !imagePreview) {
                await deleteObject(locationRef);
                tweetData.photo = "";
            }
            await updateDoc(tweetDocRef, tweetData);
            onFinishEdit();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    const deleteFile = () => {
        setImagePreview(undefined);
        resetField("file");
    };

    useEffect(() => {
        if (fileValue && fileValue.length > 0) {
            const file = fileValue[0];
            if (file.size > 1024 * 1024) {
                alert(
                    "The file is too large. Please select a file that is 1MB or smaller."
                );
                resetField("file");
                return;
            }
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [fileValue, resetField]);

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <TextArea
                rows={5}
                maxLength={180}
                placeholder="What is happening?"
                defaultValue={tweet ?? ""}
                {...register("tweet")}
            />
            <ImageUploadContainer>
                <AttachFileButton htmlFor="edit-file">
                    {imagePreview ? (
                        <PreviewImage src={imagePreview} alt="photo" />
                    ) : (
                        "Add Photo"
                    )}
                </AttachFileButton>
                <AttachFileInput
                    type="file"
                    id="edit-file"
                    accept="image/*"
                    {...register("file")}
                />
                {imagePreview ? (
                    <DeleteFileButton type="button" onClick={deleteFile}>
                        <FontAwesomeIcon icon={faX} size="lg" />
                    </DeleteFileButton>
                ) : null}
            </ImageUploadContainer>
            <SubmitButton
                type="submit"
                disabled={disableSubmit}
                value={isLoading ? "Editing..." : "Edit Tweet"}
            />
        </Form>
    );
}
