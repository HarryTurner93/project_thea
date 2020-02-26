import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import {Icon} from "@material-ui/core";
import EditLocationIcon from "@material-ui/icons/EditLocation";

class DeleteSensorButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };

        // Bind all handler functions.
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClickClose = this.handleClickClose.bind(this);
        this.handleClickAgree = this.handleClickAgree.bind(this);
    }

    // Call back function to handle button click.
    handleClickOpen() {
        this.setState((state) => {
            return {open: true}
        })
    }

    // Call back function to handle button click.
    handleClickClose() {
        this.setState((state) => {
            return {open: false}
        })
    }

    // Call back function to handle button click.
    handleClickAgree() {
        this.setState((state) => {
            return {open: false}
        });
        this.props.callbackRemoveSensor(this.props.sensorID, this.props.tab_id);
    }

    render() {
        return (
            <div>
                <Tooltip title="Delete Sensor">
                    <IconButton onClick={this.handleClickOpen}>
                        <DeleteIcon color='action' style={{height: '50px', width: '50px'}}/>
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClickClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    >
                    <DialogTitle id="alert-dialog-title">Delete Sensor?</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this sensor? This action can't be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClickClose} color="primary">
                            Disagree
                        </Button>
                        <Button onClick={this.handleClickAgree} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

// Not implemented yet.
class EditSensorLocationButton extends React.Component {
    render () {
        return (
            <Tooltip title="Edit Location">
                <IconButton>
                    <EditLocationIcon style={{height: '50px', width: '50px'}}/>
                </IconButton>
            </Tooltip>
        )
    }
}

export { DeleteSensorButton, EditSensorLocationButton };