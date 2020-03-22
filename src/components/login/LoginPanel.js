import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Auth } from 'aws-amplify';
import { Redirect } from "react-router-dom";

class BuildPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'ready',
            username: '',
            password: ''
        };
    }

    handleUsernameChange(e){
        this.setState({username: e.target.value})
    }

    handlePasswordChange(e){
        this.setState({password: e.target.value})
    }



    handleSubmit() {
        console.log(this.state.username);
        console.log(this.state.password);

        Auth.signIn({username: this.state.username, password: this.state.password})
            .then((user) => {
                console.log(user);
                window.location.replace("/portal");
            })
            .catch((err) => {
                console.log(err)
                if (err.code === "InvalidParameterException") {
                    this.setState({status: 'invalid'})
                }
                else if (err.code === "UserNotFoundException") {
                    this.setState({status: 'nouser'})
                }
                else if (err.code === "NotAuthorizedException") {
                    this.setState({status: 'unauthorised'})
                }
                else {
                    this.setState({status: 'problem'})
                }
            });

    }

    render() {

        // Construct the feedback component based on status.
        let feedback = null;

        if (this.state.status === 'ready') {
            feedback = null
        }
        else if (this.state.status === 'unauthorised') {
            feedback = <MuiAlert elevation={6} variant="filled" severity="error">Incorrect username or password.</MuiAlert>;
        }
        else if (this.state.status === 'invalid') {
            feedback = <MuiAlert elevation={6} variant="filled" severity="error">Missing password</MuiAlert>;
        }
        else if (this.state.status === 'nouser') {
            feedback = <MuiAlert elevation={6} variant="filled" severity="error">Incorrect username or password.</MuiAlert>;
        }
        else if (this.state.status === 'problem') {
            feedback = <MuiAlert elevation={6} variant="filled" severity="error">Something went wrong.</MuiAlert>;
        }

        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row", paddingBottom: "10px", justifyContent: "space-around"}}>
                    <TextField
                      id="filled-name"
                      label="Username"
                      fullWidth={true}
                      value={this.state.username}
                      onChange={this.handleUsernameChange.bind(this)}
                      variant="outlined"
                    />
                </div>
                <div style={{display: "flex", flexDirection: "row", paddingBottom: "10px", justifyContent: "space-around"}}>
                    <TextField
                      id="filled-name"
                      label="Password"
                      fullWidth={true}
                      value={this.state.password}
                      onChange={this.handlePasswordChange.bind(this)}
                      variant="outlined"
                      type="password"
                    />
                </div>
                <div style={{paddingBottom: "10px"}}>
                    {feedback}
                </div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Button variant="outlined" onClick={this.handleSubmit.bind(this)}>Sign In</Button>
                </div>
            </div>
        )
    }
}

export default BuildPanel;