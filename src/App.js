import React from 'react';
import './App.css';
import * as Sentry from '@sentry/browser';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";

// Import pages.
import DashboardPage from "./components/DashboardPage";
import BrowserPage from "./components/browser/BrowserPage.js"
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/login/LoginPage";

// Import Components
import NavZoneSelector from "./components/zones/navZoneSelector.js";

// Amplify
import Amplify, { Auth, Storage } from 'aws-amplify';
import awsconfig from './aws-exports';
import SignUpPage from "./components/signup/SignUpPage";
Sentry.init({dsn: "https://7e17d29823cf45b1988ac99ba35e95af@o382306.ingest.sentry.io/5210959",});
Amplify.configure(awsconfig);

// https://read.acloud.guru/8-steps-to-building-your-own-serverless-graphql-api-using-aws-amplify-42c21770424d

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

    badFunc() {

    }

    render() {

        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LandingPage user={this.state.user} badComp={this.badFunc()}/>
                    </Route>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Route path="/signup">
                        <SignUpPage />
                    </Route>
                    <Route path="/portal">
                        {this.state.user !== null ? <AuthorisedArea user={this.state.user}/> : null }
                    </Route>
                </Switch>
            </Router>
        )
    };
}

class AuthorisedArea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            zone: null
        };

        // Create References.
        this.dashRef = React.createRef();
    }

    handleSignOut () {
        Auth.signOut()
            .then((data) => {
                window.location.replace("/");
            })
            .catch(err => console.log(err));
    }

    // Simple state update handlers.
    handleChangeZone (zone) { this.setState({zone: zone}) }

    render() {

        // Destructure props.
        let { user } = this.props;

        // Destructure state.
        let { zone } = this.state;

        return (
            <Router>
                <Navbar bg="dark" variant="dark">

                    <Navbar.Brand>
                        Thea <b>Portal</b>
                    </Navbar.Brand>

                    <Navbar.Collapse>
                        <Nav>
                            <NavItem href="/portal/map">
                                <Nav.Link as={Link} to="/portal/map" >Map</Nav.Link>
                            </NavItem>
                            <NavItem href="/portal/browser">
                                <Nav.Link as={Link} to="/portal/browser" >Browser</Nav.Link>
                            </NavItem>
                        </Nav>
                        <Nav className="ml-auto">
                            <NavZoneSelector user={user} handleAppChangeZone={this.handleChangeZone.bind(this)} dashRef={this.dashRef}/>
                            <NavItem>
                                <Nav.Link onClick={this.handleSignOut}>Sign Out</Nav.Link>
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>

                </Navbar>

                <Switch>
                    <Route path="/portal/map">
                        <DashboardPage ref={this.dashRef} zone={zone} />
                    </Route>
                    <Route path="/portal/browser">
                        <BrowserPage zone={zone}/>
                    </Route>
                </Switch>

            </Router>
        );

    }
}

export default App;