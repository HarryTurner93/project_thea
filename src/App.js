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
        fontWeight: '700',
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
        textAlign: 'center'
    },
    header: {
        paddingTop: '40px'
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
                <h2 className={classes.strapline}>Simplifying Engineering</h2>
            </div>
            <div className={classes.content}>
                <div>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vel tincidunt neque.
                        Phasellus at tincidunt magna. Sed maximus pulvinar ligula id ullamcorper.
                        Curabitur faucibus velit et tortor blandit pretium. Aliquam erat volutpat.
                        Duis porta, ipsum non posuere auctor, lacus diam consequat libero, fermentum
                        eleifend urna lorem nec metus. Vivamus egestas, libero in semper aliquam, dolor
                        mauris suscipit lorem, sit amet rhoncus tortor magna quis orci. Vestibulum
                        facilisis mi sed tristique faucibus. Aenean ac laoreet dolor. Phasellus lacinia
                        velit neque, a congue quam molestie eget.
                    </p>
                    <h1 className={classes.header}>The Team</h1>
                    <div className={classes.team_area}>
                        <div className={classes.profile_panel}>
                            <img src={arnaud} className={classes.profile_image}/>
                            <h3 className={classes.profile_name}>Arnaud</h3>
                        </div>
                        <div className={classes.profile_panel}>
                            <img src={henry} className={classes.profile_image}/>
                            <h3 className={classes.profile_name}>Henry</h3>
                        </div>
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