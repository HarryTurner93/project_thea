import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import FormLabel from '@material-ui/core/FormLabel';
import Button from "@material-ui/core/Button";
import {API, Auth, graphqlOperation} from 'aws-amplify';
import { Redirect } from "react-router-dom";
import * as mutations from "../../graphql/mutations";

class SignUpPanel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'signup',
            errorCode: undefined,
            username: '',
            password: '',
            code: '',
            userSub: undefined
        };
    }

    handleUsernameChange(e){
        this.setState({username: e.target.value})
    }

    handlePasswordChange(e){
        this.setState({password: e.target.value})
    }

    handleCodeChange(e){
        this.setState({code: e.target.value})
    }



    handleSubmit() {

        Auth.signUp({username: this.state.username, password: this.state.password})
            .then((data) => {
                this.setState({userSub: data.userSub});
                this.setState({errorCode: undefined});
                this.setState({status: 'unconfirmed'})
            })
            .catch((err) => {
                this.setState({errorCode: err.code})
            });
    }

    handleReSubmit() {

        // Send a confirm signup request.
        Auth.confirmSignUp(this.state.username, this.state.code)

            // If successful code...
            .then((data) => {

                // ... then attempt sign in.
                Auth.signIn({username: this.state.username, password: this.state.password})

                    // If successful sign in...
                    .then(() => {

                    // ... then try and create an entry in the database for the new user.
                    API.graphql(graphqlOperation(mutations.createUser, {input: { id: this.state.userSub }}))

                        // If database entry successfull created...
                        .then((result) => {

                            // Set the state to confirmed to update the UI.
                            this.setState({errorCode: undefined});
                            this.setState({status: 'confirmed'})
                        })

                        // If entry not created, then a backend API problem.
                        .catch((err) => {
                            this.setState({errorCode: err.code})
                        });
                    })

                    // If unsuccessful sign in, print error to user. This is unusual though
                    // as username and password are the same as just used to sign up.
                    .catch(err => {
                    this.setState({errorCode: err.code})
                });
            })

            // If unsuccessful code, print error to user.
            .catch((err) => {
                this.setState({errorCode: err.code})
            });
    }

    render() {

        console.log(this.state.errorCode);

        // Construct the feedback component based on status.
        let feedback = <MuiAlert elevation={6} variant="filled" severity="error">Something went wrong.</MuiAlert>;;

        if (this.state.errorCode === 'InvalidParameterException') {
            feedback = <MuiAlert elevation={6} variant="filled" severity="error">Either username or password aren't valid.</MuiAlert>;
        }
        else if (this.state.errorCode === 'UsernameExistsException') {
            feedback = <MuiAlert elevation={6} variant="filled" severity="error">Username already exists.</MuiAlert>;
        }
        else if (this.state.errorCode === 'CodeMismatchException') {
            feedback = <MuiAlert elevation={6} variant="filled" severity="error">Incorrect Verification Code.</MuiAlert>;
        }
        else if (this.state.errorCode === undefined) {
            feedback = null;
        }

        let signup = (
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row", paddingBottom: "10px", justifyContent: "space-around"}}>
                    <TextField
                      id="filled-email"
                      label="Enter your email"
                      fullWidth={true}
                      value={this.state.username}
                      onChange={this.handleUsernameChange.bind(this)}
                      variant="outlined"
                      type="email"
                    />
                </div>
                <div style={{display: "flex", flexDirection: "row", paddingBottom: "10px", justifyContent: "space-around"}}>
                    <TextField
                      id="filled-password"
                      label="Create a password"
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
                    <Button variant="outlined" onClick={this.handleSubmit.bind(this)}>Create my Account</Button>
                </div>
                <FormLabel style={{paddingTop: '60px', fontSize: '16x'}}><b>Privacy</b></FormLabel>
                <FormLabel style={{paddingTop: '10px', fontSize: '16x'}}>We take privacy very seriously.
                    We're excited that you're interested in using our platform and will never breach that trust by sharing your email
                    with third parties.</FormLabel>
                <FormLabel style={{paddingTop: '10px', fontSize: '16x'}}>For more, see our <a href="">Privacy Policy</a></FormLabel>
            </div>
        );

        let unconfirmed = (
            <div style={{display: "flex", flexDirection: "column"}}>
                <FormLabel style={{paddingBottom: '20px', fontSize: '24px'}}>Almost there, check your emails for a verification code.</FormLabel>
                <div style={{display: "flex", flexDirection: "row", paddingBottom: "10px", justifyContent: "space-around"}}>
                    <TextField
                      id="filled-code"
                      label="Verification Code"
                      fullWidth={true}
                      value={this.state.code}
                      onChange={this.handleCodeChange.bind(this)}
                      variant="outlined"
                    />
                </div>
                <div style={{paddingBottom: "10px"}}>
                    {feedback}
                </div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Button variant="outlined" onClick={this.handleReSubmit.bind(this)}>Confirm Verification Code</Button>
                </div>
            </div>
        );

        let confirmed = (
            <div style={{display: "flex", flexDirection: "column"}}>
                <FormLabel style={{paddingBottom: '20px', fontSize: '24px'}}>Nice. We'll be in touch.</FormLabel>
                <div style={{paddingBottom: "20px"}}>
                    {feedback}
                </div>
            </div>
        );

        let confirmed2 = (
            <div style={{display: "flex", flexDirection: "column"}}>
                <FormLabel style={{paddingBottom: '20px', fontSize: '24px'}}>Nice. You're all ready to go.</FormLabel>
                <div style={{paddingBottom: "10px"}}>
                    {feedback}
                </div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Button variant="outlined" href="/portal">Go to the Portal</Button>
                </div>
            </div>
        );

        let content = signup;
        if (this.state.status === 'unconfirmed') {
            content = unconfirmed
        }
        else if (this.state.status === 'confirmed') {
            content = confirmed
        }

        return (
            content
        )
    }
}

export default SignUpPanel;