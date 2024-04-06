import { auth, db, storage } from "@/firebase";
import { UserData } from "@/routes/profile";
import { faCamera, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";

type FormValue = {
    file: FileList | null;
    name: string | null | undefined;
    aboutMe?: string | null;
};

const Title = styled.h1`
    font-size: 24px;
`;

const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const AvatarInput = styled.input`
    display: none;
`;

const PhotoEditIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    padding: 16px;
    border-radius: 50%;
    background-color: #333;
    color: #fff;
    width: 20px;
    height: 20px;
    transition: 0.2s;
    opacity: 0.5;
`;

const AvatarUpload = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    position: relative;
    &:hover ${PhotoEditIcon} {
        background-color: #333;
        opacity: 0.7;
    }
`;

const Form = styled.form`
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-top: 30px;
    gap: 12px;
`;

const Input = styled.input`
    padding: 10px 20px;
    background-color: #000;
    color: #fff;
    border: 2px solid #aaa;
    border-radius: 50px;
    width: 100%;
    font-size: 16px;
    transition: 0.2s;
    &:focus,
    &:active {
        outline: none;
        border-color: #1d9bf0;
    }
    &[type="submit"] {
        background-color: #1d9bf0;
        color: #fff;
        border: none;
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
        &:disabled {
            opacity: 0.5;
        }
    }
`;

const TextArea = styled.textarea`
    border: 2px solid #ddd;
    padding: 20px;
    border-radius: 10px;
    font-size: 16px;
    background-color: #000;
    color: #fff;
    width: 100%;
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
        sans-serif;
    transition: 0.2s;
    &:focus,
    &:active {
        outline: none;
        border-color: #1d9bf0;
    }
`;

export default function ProfileEditForm({
    userId,
    userData,
    setUserData,
    onClose,
}: {
    userId: string;
    userData?: UserData;
    setUserData: (data: UserData) => void;
    onClose: () => void;
}) {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [isLoading, setLoading] = useState<boolean>(false);

    const { register, handleSubmit, watch } = useForm<FormValue>({
        defaultValues: { name: userData?.name, aboutMe: userData?.aboutMe },
    });
    const nameValue = watch("name");
    const fileValue = watch("file");
    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        if (isLoading || !data.name || !user) return;
        try {
            setLoading(true);
            const userDocRef = doc(db, "users", userId);
            const updateData: UserData = {
                name: data.name,
                avatar: userData?.avatar,
                aboutMe: data.aboutMe,
            };
            const locationRef = ref(storage, `users/${userId}/avatar`);

            if (data.file && data.file.length === 1) {
                const file = data.file[0];
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);
                updateData.avatar = url;
            }
            await updateProfile(user, {
                displayName: updateData.name,
                photoURL: updateData.avatar ?? "",
            });
            await updateDoc(userDocRef, updateData);
            setUserData(() => updateData);

            onClose();
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (fileValue && fileValue.length === 1) {
            const url = URL.createObjectURL(fileValue[0]);
            setAvatar(url);

            return () => URL.revokeObjectURL(url);
        }
    }, [fileValue]);

    return (
        <>
            <Title>Edit Profile</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <AvatarUpload htmlFor="avatar">
                    <PhotoEditIcon>
                        <FontAwesomeIcon icon={faCamera} />
                    </PhotoEditIcon>
                    {avatar ? (
                        <AvatarImg src={avatar} alt="avatar" />
                    ) : (
                        <FontAwesomeIcon icon={faUser} size="2xl" />
                    )}
                </AvatarUpload>
                <AvatarInput
                    type="file"
                    id="avatar"
                    accept="image/*"
                    {...register("file")}
                />
                <Input
                    type="text"
                    placeholder="name"
                    {...register("name", { required: true })}
                />
                <TextArea placeholder="about me" {...register("aboutMe")} />
                <Input
                    type="submit"
                    disabled={!nameValue}
                    value={isLoading ? "saving..." : "save"}
                />
            </Form>
        </>
    );
}
