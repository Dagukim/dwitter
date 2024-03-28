import { auth } from "@/firebase";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const nav = useNavigate();
    const logOut = () => {
        auth.signOut();
        nav("/login");
    };
    return (
        <>
            <h1>Home</h1>
            <button onClick={logOut}>Log Out</button>
        </>
    );
}
