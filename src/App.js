import React from 'react';
import './App.css';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// Import my pages.
import Dashboard from "./components/dashboard";
import Summary from "./components/summary";
import Login from "./components/login";

// Amplify
import Amplify from 'aws-amplify';
import { Authenticator, SignIn, SignUp, SignOut } from 'aws-amplify-react';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends React.Component {
    render() {
        return (
            <Authenticator hideDefault={true}>
                <SignIn/>
                <SignUp/>
                <AuthorisedArea />
            </Authenticator>
        );
    }
}


class AuthorisedArea extends React.Component {

    render() {
        if (this.props.authState === 'signedIn') {
            return (
                <Router>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Navbar.Brand>Thea <b>Portal</b></Navbar.Brand>
                        <Navbar.Collapse>
                            <Nav className="mr-auto">
                                <NavItem href="/">
                                    <Nav.Link as={Link} to="/" >Dashboard</Nav.Link>
                                </NavItem>
                            </Nav>
                            <Nav>
                                <NavItem href="/">
                                   <SignOut/>
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Switch>
                        <Route exact path="/">
                            <Dashboard />
                        </Route>
                        <Route path="/summary">
                            <Summary />
                        </Route>
                        <Route path="/login">
                            <Login />
                        </Route>
                    </Switch>
                </Router>
            );
        }
        else {
            return null;
        }
    }
}

export default App;