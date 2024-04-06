import { auth, db, storage } from "@/firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
    Form,
    AttachFileButton,
    AttachFileInput,
    TextArea,
    SubmitButton,
} from "@/components/tweet-form-components";

type FormValue = {
    tweet: string;
    file: FileList | null;
};

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
                userId: user.uid,
            });
            if (data.file && data.file.length > 0) {
                const file = data.file[0];
                const locationRef = ref(
                    storage,
                    `tweets/${user.uid}/${doc.id}`
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
