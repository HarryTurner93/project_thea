import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';

import henry from "./images/henry.jpg";
import arnaud from "./images/arnaud.png";

const useStyles = makeStyles({
    "@media (min-width: 40px)": {
        root: {
            display: 'flex',
            width: '100%',
            maxWidth: '1366px',
            margin: 'auto',
            flexDirection: 'column',
            backgroundColor: '#EFEFEF'
        },
        jumbotron: {
            height: '600px',
            width: '100%',
            backgroundColor: '#0B3142',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        logo: {
            fontFamily: 'Manrope',
            fontWeight: '800',
            fontSize: '72pt',
            color: '#F69365'
        },
        strapline: {
            fontFamily: 'Manrope',
            fontWeight: '700',
            color: '#EFEFEF',
            fontSize: '18pt',
            textAlign: 'center'
        },
        content: {
            padding: '20px',
            color: '#78939C',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        header: {
            paddingTop: '100px',
            paddingBottom: '30px',
            fontSize: '22pt'
        },
        content_paragraph_container: {
            width: '90%',
            paddingBottom: '70px',
        },
        content_paragraph: {
            textAlign: 'center',
            fontSize: '12pt'
        },
        content_paragraph_left: {
            textAlign: 'left',
            fontSize: '12pt'
        },
        team_area: {
            display: 'flex',
            flexDirection: 'column'
        },
        profile_panel: {
            width: "100%",
            padding: '50px',
            paddingLeft: '0px',
            paddingRight: '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        profile_image: {
            width: "50%",
            margin: 'auto',
            borderRadius: '50%',
            filter: 'grayscale(0%)'
        },
        profile_name: {
            padding: '10px'
        },
        footer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            color: '#78939C',
        }
    },
    "@media (min-width: 800px)": {
        root: {
            display: 'flex',
            width: '100%',
            maxWidth: '1366px',
            margin: 'auto',
            flexDirection: 'column',
            backgroundColor: '#EFEFEF'
        },
        jumbotron: {
            height: '600px',
            width: '100%',
            backgroundColor: '#0B3142',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        },
        logo: {
            fontFamily: 'Manrope',
            fontWeight: '800',
            fontSize: '72pt',
            color: '#F69365'
        },
        strapline: {
            fontFamily: 'Manrope',
            fontWeight: '700',
            color: '#EFEFEF',
            fontSize: '24pt'
        },
        content: {
            padding: '50px',
            color: '#78939C',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        header: {
            paddingTop: '100px',
            paddingBottom: '60px'
        },
        content_paragraph_container: {
            width: '80%',
            paddingBottom: '100px',
        },
        content_paragraph: {
            textAlign: 'center',
             fontSize: '14pt'
        },
        content_paragraph_left: {
            textAlign: 'left',
             fontSize: '14pt'
        },
        team_area: {
            display: 'flex',
            flexDirection: 'row'
        },
        profile_panel: {
            width: "50%",
            padding: '50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        profile_image: {
            width: "50%",
            margin: 'auto',
            borderRadius: '50%',
            filter: 'grayscale(0%)'
        },
        profile_name: {
            padding: '10px'
        },
        footer: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            color: '#78939C',
        }
    }
});

function App() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.jumbotron}>
                <h1 className={classes.logo}>Thea</h1>
                <h2 className={classes.strapline}>Simplifying Engineering</h2>
            </div>
            <div className={classes.content}>
                <h1 className={classes.header}>The Company</h1>
                <div className={classes.content_paragraph_container}>
                    <p className={classes.content_paragraph}>
                        Thea reduces uncertainty at the early stages of non-software enginering projects in mature, regulated markets.
                    </p>
                </div>
                <h1 className={classes.header}>The Team</h1>
                <div className={classes.team_area}>
                    <div className={classes.profile_panel}>
                        <img src={arnaud} className={classes.profile_image}/>
                        <h3 className={classes.profile_name}>Arnaud Doko</h3>
                        <p className={classes.profile_name}><i>CEO & Co-Founder</i></p>
                        <ul>
                            <li><p>Roles: R&D, Project Management, Account Management</p></li>
                            <li><p>Sectors: Automotive, MedTech, Consultancy</p></li>
                            <li><p>Previously: Circadia Health, Metaview (both Village Global portfolio)</p></li>
                            <li><p>Training: Mechanical Engineer, University of Bath</p></li>
                        </ul>
                    </div>
                    <div className={classes.profile_panel}>
                        <img src={henry} className={classes.profile_image}/>
                        <h3 className={classes.profile_name}>Harry Turner</h3>
                        <p className={classes.profile_name}><i>CTO & Co-Founder</i></p>
                        <ul>
                            <li><p>Roles: R&D, Systems Engineering, Machine Learning</p></li>
                            <li><p>Sectors: Aerospace, Defence, Offshore</p></li>
                            <li><p>Previously: Rolls-Royce, Rovco (Foresigh Group portfolio)</p></li>
                            <li><p>Training: Robotics and AI, University of Bath & Computer Science, Georgia Tech</p></li>
                        </ul>
                    </div>
                </div>
                <h1 className={classes.header}>The Problem</h1>
                <div className={classes.content_paragraph_container}>
                    <p className={classes.content_paragraph}>
                        There is a growing gap in productivity between software engineering and all other engineering
                        disciplines (e.g. Mechanical, Chemical, or Civil Engineering). Over the past decades, it
                        has become clear that software engineering teams can build, collaborate, and iterate more
                        quickly and cheaply than their non-software engineering counterparts. We see two reasons
                        for this:
                    </p>
                    <ol>
                        <li>
                            <p className={classes.content_paragraph_left}>
                                Greater regulation — non-software engineering is significantly more regulated than
                                software engineering. There are more standards governing the design of an airplane
                                than the development of a food delivery app, and rightly so. Non-software engineering
                                teams are left to absorb this additional compliance overhead while the trend for
                                increasing regulation continues.
                            </p>
                        </li>
                        <li>
                            <p className={classes.content_paragraph_left}>
                                Fewer and worse tools — software engineers have developed powerful tools
                                (usually software!) to manage their form of knowledge work while non-software engineers
                                have fewer and less-powerful software tools available to them. The data they handle
                                daily exists in physical, fragmented, and often unstructured, locations, and formats.
                                This is particularly problematic at the earliest, most volatile stages of projects
                                where later downstream costs are most often locked in.
                            </p>
                        </li>
                    </ol>
                </div>
                <h1 className={classes.header}>The Solution</h1>
                <div className={classes.content_paragraph_container}>
                    <p className={classes.content_paragraph}>
                        Thea is an Email and Slack/Teams extension that crawls a non-software engineering team’s
                        communications, extracts rogue engineering files, and automatically clusters them by project
                        for easy review and use in compliance.
                    </p>
                </div>
                <h1 className={classes.header}>Why Now?</h1>
                <div className={classes.content_paragraph_container}>
                    <p className={classes.content_paragraph}>
                        Recent Machine Learning approaches and techniques, notably in Computer Vision, offer a unique
                        opportunity to automate rote elements of engineering teams’ compliance-related work that
                        would not have been feasible even some years ago.
                    </p>
                </div>
            </div>
            <div className={classes.footer}>
                <p>Copyright Thea 2020</p>
            </div>

        </div>
    );
}

export default App;