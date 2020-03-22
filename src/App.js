import React from 'react';
import './App.css';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// Import my pages.
import Dashboard from "./components/dashboard";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/login/LoginPage";

// Amplify
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    // This is responsible for checking with Cognito whether or not a user is logged in.
    componentDidMount() {
        Auth.currentAuthenticatedUser({bypassCache: false})
            .then((user) => {
                // Update the state with the new user.
                this.setState({user: user.username});

            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LandingPage user={this.state.user}/>
                    </Route>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Route path="/portal/">
                        {this.state.user !== null ? <AuthorisedArea /> : null }
                    </Route>
                </Switch>
            </Router>
        )
    };
}

class AuthorisedArea extends React.Component {

    handleSignOut () {
        Auth.signOut()
            .then((data) => {
                window.location.replace("/");
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <Router>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand>Thea <b>Portal</b></Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="mr-auto">
                            <NavItem>
                                <Nav.Link as={Link} to="/portal" >Dashboard</Nav.Link>
                            </NavItem>
                        </Nav>
                        <Nav>
                            <NavItem>
                                <Nav.Link onClick={this.handleSignOut}>Sign Out</Nav.Link>
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route path="/portal">
                        <Dashboard />
                    </Route>
                </Switch>
            </Router>
        );

    }
}

export default App;