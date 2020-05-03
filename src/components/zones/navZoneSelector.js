import React from "react";
import {NavDropdown} from "react-bootstrap";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import * as Sentry from "@sentry/browser";
import './nav.css'
import MessageAlert from '../misc/MessageAlert';

class CreateZone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            zoneName: ""
        };
    }

    // Simple Handlers
    handleClose() { this.setState({open: false, zoneName: ""}) };
    handleZoneNameChange(e) { this.setState({zoneName: e.target.value}) };

    // If agree, then call APICALL_putUserZones from parent which handles creating zone on backend.
    handleAgree() {
        this.setState({open: false, zoneName: ""});
        this.props.handleCreateZone(this.state.zoneName);
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.open} onClose={this.handleClose.bind(this)}>
                    <DialogTitle>Create Zone</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" id="zoneName" value={this.state.zoneName} type="email"
                            onChange={this.handleZoneNameChange.bind(this)} label="Name" fullWidth
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

class DeleteZone extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    // Simple Handlers
    handleClose() { this.setState({open: false}) };

    // Complex Handlers
    handleDelete() {
        this.setState({open: false});
        this.props.handleDeleteZone(this.props.zone)
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

class NavZoneSelector extends React.Component {

    constructor(props) {
        super(props);

        // References to two dialog pop ups, components that are currently hidden and "turned on" by a button press.
        this.createZoneRef = React.createRef();
        this.deleteZoneRef = React.createRef();
        this.messageRef = React.createRef();
    }

    // Handlers to open relevant dialog boxes.
    handleCreateZone () {
        if (this.props.zoneState.availableZones.length >= 1) {
            this.messageRef.current.fire("Zone Limit Reached", "The free service is limited to only one zone.")
        }
        else {
            this.createZoneRef.current.setState({open: true})
        }
    }
    handleDeleteZone () { this.deleteZoneRef.current.setState({open: true}) }

    // Error handling and reporting.
    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {

        // Destructure props and state.
        let { zoneState, handleChangeZone, handleDeleteZone, handleCreateZone } = this.props;

        return (
            <NavDropdown id='NavZoneSelector' title={(zoneState.currentZone.name) ? zoneState.currentZone.name : null}>
                {zoneState.availableZones.map((zone, key) =>
                    <NavDropdown.Item
                        id={(zone.name === zoneState.currentZone.name) ? 'dropdown' : null}
                        key={zone.id}
                        active={(zone.name === zoneState.currentZone.name)}
                        onClick={() => {handleChangeZone(zone)}}
                    >
                        {zone.name}
                    </NavDropdown.Item>)
                }
                <MessageAlert ref={this.messageRef}/>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={this.handleCreateZone.bind(this)}>Create New Zone</NavDropdown.Item>
                <CreateZone ref={this.createZoneRef} handleCreateZone={handleCreateZone}/>
                {zoneState.currentZone.name !== 'Zone'
                    ?<NavDropdown.Item onClick={this.handleDeleteZone.bind(this)}>Delete Zone</NavDropdown.Item>
                    :null}
                {zoneState.currentZone.name !== 'Zone'
                    ?<DeleteZone ref={this.deleteZoneRef} zone={zoneState.currentZone} handleDeleteZone={handleDeleteZone}/>
                    :null}
            </NavDropdown>
        )
    }
}

export default NavZoneSelector;