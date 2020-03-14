import React from 'react';
import './App.css';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

// Import my pages.
import Dashboard from "./components/dashboard";
import Summary from "./components/summary";
import Login from "./components/login";

class App extends React.Component {

    render() {
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
}

export default App;