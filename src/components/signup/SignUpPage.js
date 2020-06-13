import React from "react";

import {Nav, Navbar, NavItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import SignUpPanel from "./SignUpPanel";
import * as Sentry from "@sentry/browser";

class SignUpPage extends React.Component {

    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {

        return (
            <div style={{display: 'flex', width: '70%', margin: 'auto', flexDirection: 'column'}}>
                <div>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Navbar.Brand href="/"><b>Thea</b></Navbar.Brand>
                        <Navbar.Collapse>
                            <Nav className="mr-auto">
                                <NavItem href="/">
                                    <Nav.Link as={Link} to="/" >About</Nav.Link>
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div>
                    <h1 style={{paddingLeft:'100px', paddingTop:'100px'}}>Register your Interest.</h1>
                    <h4 style={{paddingLeft:'100px', paddingTop: '20px'}}>Sign up below to create an account with us.</h4>
                    <div style={{paddingLeft:'100px', paddingTop:'25px', width: '60%'}}>
                        <SignUpPanel/>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignUpPage;