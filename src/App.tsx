import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "@/components/layout";
import Home from "@/routes/home";
import Profile from "@/routes/profile";
import Login from "@/routes/login";
import CreateAccount from "@/routes/create-account";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/loading-screen";
import ProtectedRoute from "@/components/protected-route";
import { auth } from "@/firebase";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "",
                element: <Home />,
            },
            {
                path: "profile",
                element: <Profile />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/create-account",
        element: <CreateAccount />,
    },
]);

const GlobalStyles = createGlobalStyle`
    ${reset};
    * {
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #9f9f9f;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-track {
        background: #2c2c2c;
        border-radius: 10px;
      }
    }
    body {
      background-color: black;
      color: white;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
`;

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    justify-content: center;
`;

function App() {
    const [isLoading, setLoading] = useState<boolean>(true);
    const init = async () => {
        await auth.authStateReady();
        setLoading(() => false);
    };

    useEffect(() => {
        init();
    }, []);

    return (
        <Wrapper>
            <GlobalStyles />
            {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
        </Wrapper>
    );
}

export default App;
