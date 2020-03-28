import React from 'react';
import './App.css';
import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// Import my pages.
import Dashboard from "./components/dashboard";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/login/LoginPage";

// Amplify
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import * as queries from './graphql/queries';
import awsconfig from './aws-exports';
import CreateZone from "./CreateZone";
import DeleteZone from "./DeleteZone";
import SignUpPage from "./components/signup/SignUpPage";
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

                console.log(user.username)

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
            zones: [],
            currentZone: null
        };

        this.createZoneRef = React.createRef();
        this.deleteZoneRef = React.createRef();
    }

    // This is responsible for pulling user data.
    componentDidMount() {
        this.updateUserProfile()
    }

    updateUserProfile () {
        API.graphql(graphqlOperation(queries.getUser, {id: this.props.user}))
            .then((result) => {
                console.log(result.data);
                this.setState({zones: result.data.getUser.zones.items});
                this.setState({currentZone: this.state.zones[0]})
            })
            .catch((result) => console.log(result));
    }

    handleSignOut () {
        Auth.signOut()
            .then((data) => {
                window.location.replace("/");
            })
            .catch(err => console.log(err));
    }

    handleCreateZone () {
        this.createZoneRef.current.setState({open: true})
    }

    handleDeleteZone () {
        this.deleteZoneRef.current.setState({open: true})
    }

    handleChangeZone (zone) {
        this.setState({currentZone: zone})
    }

    render() {

        // Try and get the current zone name if it's available.
        let currentZoneName = "Zone";
        if (this.state.currentZone) {
            currentZoneName = this.state.currentZone.name;
        }

        return (
            <Router>
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand>Thea <b>Portal</b></Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="mr-auto">

                        </Nav>
                        <Nav>
                            <NavDropdown title={currentZoneName}>
                                {this.state.zones.map((zone, key) =>
                                    <NavDropdown.Item
                                        key={zone.id}
                                        active={(zone.name === currentZoneName)}
                                        onClick={() => {this.handleChangeZone(zone)}}
                                    >
                                        {zone.name}
                                    </NavDropdown.Item>)
                                }
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={this.handleCreateZone.bind(this)}>Create New Zone</NavDropdown.Item>
                                {this.state.currentZone
                                    ?<NavDropdown.Item onClick={this.handleDeleteZone.bind(this)}>Delete Zone</NavDropdown.Item>
                                    :null}
                                <CreateZone ref={this.createZoneRef} user={this.props.user} updateUserProfile={this.updateUserProfile.bind(this)}/>
                                {this.state.currentZone
                                    ?<DeleteZone ref={this.deleteZoneRef} zone={this.state.currentZone} updateUserProfile={this.updateUserProfile.bind(this)}/>
                                    :null}
                            </NavDropdown>
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