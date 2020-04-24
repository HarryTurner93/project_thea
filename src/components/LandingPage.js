import React from "react";

import Carousel from 'react-bootstrap/Carousel'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'

import banner_1 from "../fake_data/fox-banner.jpg";
import banner_2 from "../fake_data/banner-2.jpg";
import {Nav, Navbar, NavItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Auth} from 'aws-amplify';

import PermMediaIcon from '@material-ui/icons/PermMedia';
import DescriptionIcon from '@material-ui/icons/Description';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import * as Sentry from "@sentry/browser";

class LandingPage extends React.Component {

    handleSignOut () {
        Auth.signOut()
            .then((data) => {
                window.location.replace("/");
            })
            .catch(err => console.log(err));
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {

        // Determine whether the log in button should say "log in" or "Portal" depending on whether the user is logged
        // in already.
        //let login_button = <Nav><NavItem><Nav.Link as={Link} to="/login" >Login to the Portal</Nav.Link></NavItem></Nav>
        //if (this.props.user !== null) {
        //    login_button = <Nav>
        //        <NavItem>
        //            <Nav.Link as={Link} to="/portal" >Go to the Portal</Nav.Link>
        //        </NavItem>
        //        <NavItem>
        //            <Nav.Link onClick={this.handleSignOut}>Sign Out</Nav.Link>
        //        </NavItem>
        //    </Nav>
        //}

        this.props.badComp()

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
                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div>
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={banner_1}
                                alt="First slide"
                            />
                            <Carousel.Caption>
                                <h3>Something about auto identification maybe.</h3>
                                <p>More text down here.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={banner_2}
                                alt="Third slide"
                            />
                            <Carousel.Caption>
                                <h3>Maybe a fancy screenshot of the software in use</h3>
                                <p>More explanatory text.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
                <div>
                    <Jumbotron>
                        <h1>Register your interest.</h1>
                        <h5 style={{paddingTop: '20px', paddingBottom: '20px'}}><i>We're working hard to get this up and running as soon as possible.
                            If you want to be notified when we launch, register your interest below.</i></h5>
                        <Button variant="primary" href="/signup">Register your Interest</Button>
                    </Jumbotron>
                </div>
                <div style={{display: 'flex'}}>
                    <div style={{width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{padding: '50px'}}>
                            <PermMediaIcon fontSize='large'/>
                        </div>
                        <div>
                            <h2>Organise</h2>
                        </div>
                        <div style={{padding: '50px', textAlign: 'center'}}>
                            <p>With Thea's fully featured set of trap management tools, the portal keeps all your
                            trap data in one place, with easy access, easy searching, and easy management. Use Thea's
                            management tools to keep your projects organised.</p>
                        </div>
                    </div>
                    <div style={{width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{padding: '50px'}}>
                            <DescriptionIcon fontSize='large'/>
                        </div>
                        <div>
                            <h2>Communicate</h2>
                        </div>
                        <div style={{padding: '50px', textAlign: 'center'}}>
                            <p>With Thea's reporting tools, easily generate summaries from your projects from particular
                                time periods, from certain areas, and from specific traps. Communicate your project's
                            data findings to your stakeholders with the click of a button.</p>
                        </div>
                    </div>
                    <div style={{width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <div style={{padding: '50px'}}>
                            <DoubleArrowIcon fontSize='large'/>
                        </div>
                        <div>
                            <h2>Automate</h2>
                        </div>
                        <div style={{padding: '50px', textAlign: 'center'}}>
                            <p>We use state of the art Machine Learning systems to automate the identification of
                            animal species within camera trap photos. Use Thea's specifies identification toolset to
                            minimise the amount of time you spend analysing and tagging photos.</p>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex', 'backgroundColor': '#EEEEEE', padding: '10px'}}>
                    <div style={{width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                    </div>
                    <div style={{width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        Copyright © 2020 Thea
                    </div>
                    <div style={{width: '33%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                    </div>
                </div>
            </div>
        );
    }
}

export default LandingPage;