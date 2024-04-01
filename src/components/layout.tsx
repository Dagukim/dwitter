import { auth } from "@/firebase";
import {
    faHouse,
    faRightFromBracket,
    faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 5fr;
    padding: 50px 0;
    width: 100%;
    max-width: 860px;
    height: 100%;
`;

const Menu = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    top: 50px;
    position: sticky;
    height: fit-content;
`;

const MenuItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    transition: 0.2s;
    svg {
        transition: color 0.2s;
        color: #fff;
    }
    &:hover {
        background-color: #fff;
        border-color: transparent;
        svg {
            color: #000;
        }
    }
    &.logout {
        border-color: tomato;
        svg {
            color: tomato;
        }
        &:hover {
            background-color: tomato;
            border-color: transparent;
            svg {
                color: #000;
            }
        }
    }
`;

export default function Layout() {
    const nav = useNavigate();
    const onLogOut = async () => {
        const ok = confirm("Are you sure you want to log out?");
        if (ok) {
            await auth.signOut();
            nav("/login");
        }
    };

    return (
        <Wrapper>
            <Menu>
                <Link to={"/"}>
                    <MenuItem>
                        <FontAwesomeIcon icon={faHouse} />
                    </MenuItem>
                </Link>
                <Link to={"/profile"}>
                    <MenuItem>
                        <FontAwesomeIcon icon={faUserAlt} />
                    </MenuItem>
                </Link>
                <MenuItem className="logout" onClick={onLogOut}>
                    <FontAwesomeIcon icon={faRightFromBracket} />
                </MenuItem>
            </Menu>
            <Outlet />
        </Wrapper>
    );
}
