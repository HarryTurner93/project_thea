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

class DeleteZone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    // Simple Handlers
    handleClose = (e) => { this.setState({open: false}) };

    // Complex Handlers
    handleDelete() {
        this.setState({open: false});

        // Call the API to update the zone. It doesn't actually delete, just removes association with user.
        const zone = {
            id: this.props.zone.id,
            name: this.props.zone.name,
            zoneUserId: "none"
        };
        API.graphql(graphqlOperation(mutations.updateZone, {input: zone}))
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
                        <DialogContentText>You are about to delete <b>{this.props.zone.name}</b>. At the moment this
                            action is final and cannot be undone, it will also delete all sensors associated with
                            this zone.</DialogContentText>
                        <DialogContentText>Are you absolutely sure?</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose.bind(this)} color="primary">Cancel</Button>
                        <Button onClick={this.handleDelete.bind(this)} color="primary">Delete</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default DeleteZone;