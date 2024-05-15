import React from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
} from "./NavbarElements";

export default function TopBarComponent() {
    return (
        <>
            <Nav>
                <Bars/>
                <NavMenu>
                    <NavLink to="/app/dashboard">
                        Dashboard
                    </NavLink>
                    <NavLink to="/app/auctions" >
                        Auctions
                    </NavLink>
                    <NavLink to="/app/settings" >
                        Settings
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
}
