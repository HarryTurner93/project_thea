import React from "react";

import {Nav, Navbar, NavItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import LoginPanel from "./LoginPanel";

class LoginPage extends React.Component {

    render() {

        return (
            <div style={{display: 'flex', width: '70%', margin: 'auto', flexDirection: 'column'}}>
                <div>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Navbar.Brand><b>Thea</b></Navbar.Brand>
                        <Navbar.Collapse>
                            <Nav className="mr-auto">
                                <NavItem href="/">
                                    <Nav.Link as={Link} to="/" >About</Nav.Link>
                                </NavItem>
                                <NavItem href="/">
                                    <Nav.Link as={Link} to="/" >Pricing</Nav.Link>
                                </NavItem>
                                <NavItem href="/">
                                    <Nav.Link as={Link} to="/" >Features</Nav.Link>
                                </NavItem>
                                <NavItem href="/">
                                    <Nav.Link as={Link} to="/" >Blog</Nav.Link>
                                </NavItem>
                            </Nav>
                            <Nav>
                                <NavItem href="/">
                                    <Nav.Link as={Link} to="/login" >Login to the Portal</Nav.Link>
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div>
                    <h1 style={{paddingLeft:'100px', paddingTop:'100px'}}>Sign In To The Portal</h1>
                    <div style={{paddingLeft:'100px', paddingTop:'25px', width: '40%'}}>
                        <LoginPanel/>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;