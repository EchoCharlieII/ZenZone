import React from "react";
import { Nav, NavLink, NavMenu } from "./NavbarElements";
 
const Navbar = () => {
    return (
        <>
            <Nav>
                <NavMenu>
                    <NavLink to="/map" activeStyle>
                        Map
                    </NavLink>
                    <NavLink to="/route" activeStyle>
                        Route
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default Navbar;