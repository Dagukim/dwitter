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
import {
    AttachFileButton,
    AttachFileInput,
    DeleteFileButton,
    Form,
    ImageUploadContainer,
    PreviewImage,
    SubmitButton,
    TextArea,
} from "@/components/tweet-form-components";

type FormValue = {
    tweet: string;
    file: FileList | null;
};

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
