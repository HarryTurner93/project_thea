import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';

import henry from "./images/henry.jpg";
import arnaud from "./images/arnaud.png";

const useStyles = makeStyles({
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
        color: '#EFEFEF'
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
        textAlign: 'center'
    },
    team_area: {
        display: 'flex'
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
});

function App() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.jumbotron}>
                <h1 className={classes.logo}>Thea</h1>
                <h2 className={classes.strapline}>Simplifying Systems Engineering</h2>
            </div>
            <div className={classes.content}>
                <h1 className={classes.header}>The Company</h1>
                <div className={classes.content_paragraph_container}>
                    <p className={classes.content_paragraph}>
                        Thea streamlines the systems development lifecycle for engineering teams
                        of every discipline in mature, regulated markets.
                    </p>
                </div>
                <h1 className={classes.header}>The Problem</h1>
                <div className={classes.content_paragraph_container}>
                    <p className={classes.content_paragraph}>
                        Over decades the amount of technical complexity in engineering systems has
                        exploded, increasing the risk of complex failures. In response regulators across the world have
                        constrained and standardized industries where such risk is unacceptable. Examples include the
                        Defence, Medical Devices, and Automotive industries.
                    </p>
                    <p className={classes.content_paragraph}>
                        Engineering teams in these industries are
                        left to absorb the additional compliance overhead using manual processes to handle often
                        unstructured design, verification/validation, and maintenance data. Requiring engineers to
                        spend time on these tasks with inadequate tools is a waste of their qualifications,
                        experience, and expertise.
                    </p>
                </div>
                <h1 className={classes.header}>The Solution</h1>
                <div className={classes.content_paragraph_container}>
                    <p className={classes.content_paragraph}>
                        Thea builds tools for engineers that abstract away the complexity of rote tasks performed
                        solely to ensure compliance with industry regulations, standards, and best practices.
                        The engineers’ time freed up this way can then be deployed on more nuanced tasks that truly
                        require their extensive training and judgment.
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
                <h1 className={classes.header}>The Team</h1>
                <div className={classes.team_area}>
                    <div className={classes.profile_panel}>
                        <img src={arnaud} className={classes.profile_image}/>
                        <h3 className={classes.profile_name}>Arnaud Doko</h3>
                    </div>
                    <div className={classes.profile_panel}>
                        <img src={henry} className={classes.profile_image}/>
                        <h3 className={classes.profile_name}>Harry Turner</h3>
                    </div>
                </div>
            </div>
            <div className={classes.footer}>
                <p>Copyright Thea 2020</p>
            </div>

        </div>
    );
}

export default App;