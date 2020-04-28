import React from 'react';
import './App.css';
import * as Sentry from '@sentry/browser';
import { connect } from 'react-redux';
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
import Amplify, {API, Auth, graphqlOperation} from 'aws-amplify';
import awsconfig from './aws-exports';
import SignUpPage from "./components/signup/SignUpPage";
import * as queries from "./graphql/queries";
import * as mutations from "./graphql/mutations";
import {setUploadFile} from "./redux/uploadFile/uploadFile.actions";

// Configure App.
// Sentry.init({
//        dsn: "https://7e17d29823cf45b1988ac99ba35e95af@o382306.ingest.sentry.io/5210959",
//        release: "0.1"
//    });
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

    render() {

        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <LandingPage user={this.state.user} />
                    </Route>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Route path="/signup">
                        <SignUpPage />
                    </Route>
                    <Route path="/portal">
                        {this.state.user !== null ? <AuthorisedArea user={this.state.user} setUploadFile={this.props.setUploadFile}/> : null }
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
            zoneState: {
                availableZones: [],
                currentZone: {name: 'Zone'}
            }
        };

        // Create References.
        this.dashRef = React.createRef();
        this.browserRef = React.createRef();
    }

    // When the app has loaded properly, start fetching data.
    componentDidMount() {

        // Start by fetching zones. This will also trigger a get for sensors.
        this.getUserZones()
    }

    // Pull all zones from the backend for the given user. Update the state.
    getUserZones (goToZone) {
        API.graphql(graphqlOperation(queries.getUser, {id: this.props.user}))
            .then((result) => {

                // Pulled zones.
                let availableZones = result.data.getUser.zones.items

                // If zones, then update.
                if ( availableZones.length > 0 ) {

                    let zoneState = {availableZones: availableZones, currentZone: availableZones[0]}

                    // If a zone has been specified, then set the current zone to that one.
                    if ( goToZone ) {
                        zoneState.currentZone = availableZones.filter(zone => zone.name === goToZone)[0]
                    }

                    this.setState({zoneState: zoneState}, () => {

                        // Finally, refresh the browser and dashboard with the new zone so they can call the API.
                        if (this.browserRef.current != null) {
                            this.browserRef.current.refreshPage(zoneState)
                        }

                    });

                } else {

                    // Call the parent (AuthorisedApp) to tell it the null zone.
                    this.setState({zoneState: {availableZones: [], currentZone: {name: 'Zone'}}});
                    this.dashRef.current.resetDashboard()
                }

            })
            .catch((result) => console.log(result));
    }

    // Push new zone to the backend for the given user. Update the state.
    putUserZones (newZone) {
        const payload = { name: newZone, zoneUserId: this.props.user };
        API.graphql(graphqlOperation(mutations.createZone, {input: payload}))
            .then((result) => {

                // If the put was successful, then update state to the added zone.
                this.getUserZones(newZone);
            })
            .catch((result) => {});
    }

    // Remove zone association with a user. Update the state.
    // Note that for now, it doesn't actually delete, just removes association with user.
    deleteUserZones (zone) {
        const payload = {id: zone.id, name: zone.name, zoneUserId: "none"};
        API.graphql(graphqlOperation(mutations.updateZone, {input: payload}))
            .then((result) => {

                // If the delete was successful, then pull the zones again (to update the state).
                this.getUserZones();
            })
            .catch((result) => {});
    }

    // Handler Functions
    // *****************

    // Called from this class in the Nav Link (header bar). Called Auth Signout.
    handleSignOut () {
        Auth.signOut()
            .then((data) => {
                window.location.replace("/");
            })
            .catch(err => console.log(err));
    }

    // Called from NavZoneSelector when user changes zone. Updates the state with the new zone.
    handleChangeZone (zone) {
        let zoneState = {...this.state.zoneState}
        zoneState.currentZone = zone
        this.setState({zoneState: zoneState}, () => {

            // Finally, refresh the browser and dashboard with the new zone so they can call the API.
            if (this.browserRef.current != null) {
                this.browserRef.current.refreshPage(zone)
            }
        })
    }

    // Called from NavZoneSelector when user creates zone. Makes relevant API call.
    handleCreateZone (zoneName) {
        this.putUserZones(zoneName);
    }

    // Called from NavZoneSelector when user creates zone. Makes relevant API call.
    handleDeleteZone (zone) {
        this.deleteUserZones(zone)
    }


    // Render Function
    // ***************

    render() {

        // Destructure state.
        let { zoneState } = this.state;

        return (
            <Router>
                <Navbar style={{backgroundColor: '#1F7B67'}} variant="dark">

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
                            <NavZoneSelector
                                zoneState={zoneState}
                                handleDeleteZone={this.handleDeleteZone.bind(this)}
                                handleCreateZone={this.handleCreateZone.bind(this)}
                                handleChangeZone={this.handleChangeZone.bind(this)}
                            />
                            <NavItem>
                                <Nav.Link onClick={this.handleSignOut}>Sign Out</Nav.Link>
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>

                </Navbar>

                <Switch>
                    <Route path="/portal/map">
                        <DashboardPage ref={this.dashRef} zone={zoneState.currentZone} setUploadFile={this.props.setUploadFile}/>
                    </Route>
                    <Route path="/portal/browser">
                        <BrowserPage ref={this.browserRef} zone={zoneState.currentZone}/>
                    </Route>
                </Switch>

            </Router>
        );

    }
}

const mapDispatchToProps = dispatch => ({
    setUploadFile: files => dispatch(setUploadFile(files))
})

export default connect(null, mapDispatchToProps)(App);