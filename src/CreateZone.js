import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import {API, graphqlOperation} from "aws-amplify";
import * as queries from "./graphql/queries";
import * as mutations from './graphql/mutations';

class CreateZone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            zoneName: ""
        };
    }

    // Simple Handlers
    handleClose = (e) => { this.setState({open: false}) };
    handleZoneNameChange = (e) => { this.setState({zoneName: e.target.value}) };

    // Complex Handlers
    handleAgree() {
        this.setState({open: false});

        // Call the API to add a new zone to this user.
        const zone = {
            name: this.state.zoneName,
            zoneUserId: this.props.user
        };
        API.graphql(graphqlOperation(mutations.createZone, {input: zone}))
            .then((result) => {
                this.props.updateUserProfile()
            })
            .catch((result) => {

            });
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.open} onClose={this.handleClose.bind(this)}>
                    <DialogTitle>Create Zone</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="zoneName"
                            value={this.state.zoneName}
                            onChange={this.handleZoneNameChange.bind(this)}
                            label="Name"
                            type="email"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose.bind(this)} color="primary">Cancel</Button>
                        <Button onClick={this.handleAgree.bind(this)} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default CreateZone;