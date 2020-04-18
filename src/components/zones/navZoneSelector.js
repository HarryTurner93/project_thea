import React from "react";
import {API, graphqlOperation} from "aws-amplify";
import * as queries from "../../graphql/queries";
import {NavDropdown} from "react-bootstrap";
import * as mutations from "../../graphql/mutations";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";

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
        this.state = {
            zoneState: {
                availableZones: [],
                currentZone: 'Zone'
            }
        };

        // References to two dialog pop ups, components that are currently hidden and "turned on" by a button press.
        this.createZoneRef = React.createRef();
        this.deleteZoneRef = React.createRef();
    }

    // Handlers to open relevant dialog boxes.
    handleCreateZone () { this.createZoneRef.current.setState({open: true}) }
    handleDeleteZone () { this.deleteZoneRef.current.setState({open: true}) }

    // Called when user changes zone. Updates the state with the new zone.
    handleChangeZone (zone) {
        let zoneState = {...this.state.zoneState}
        zoneState.currentZone = zone
        this.setState({zoneState: zoneState})

        // Call the parent (AuthorisedApp) to tell it the new zone.
        this.props.handleAppChangeZone(zone)
    }

    // On load, pull user zones.
    componentDidMount() {
        this.APICALL_getUserZones()
    }

    // Pull all zones from the backend for the given user. Update the state.
    APICALL_getUserZones () {
        API.graphql(graphqlOperation(queries.getUser, {id: this.props.user}))
            .then((result) => {

                // Pulled zones.
                let availableZones = result.data.getUser.zones.items

                // Update with available zones and arbitrarily set the current zone to the first one.
                let zoneState = {availableZones: availableZones, currentZone: availableZones[0]}
                this.setState({zoneState: zoneState});

                // Call the parent (AuthorisedApp) to tell it the new zone.
                this.props.handleAppChangeZone(this.state.zoneState.currentZone)

            })
            .catch((result) => console.log(result));
    }

    // Push new zone to the backend for the given user. Update the state.
    APICALL_putUserZones (newZone) {
        const payload = { name: newZone, zoneUserId: this.props.user };
        API.graphql(graphqlOperation(mutations.createZone, {input: payload}))
            .then((result) => {

                // If the put was successful, then update state to the added zone.
                this.APICALL_getUserZones();
            })
            .catch((result) => {

            });
    }

    // Remove zone association with a user. Update the state.
    // Note that for now, it doesn't actually delete, just removes association with user.
    APICALL_deleteUserZones (zone) {
        const payload = {
            id: zone.id,
            name: zone.name,
            zoneUserId: "none"
        };
        API.graphql(graphqlOperation(mutations.updateZone, {input: payload}))
            .then((result) => {

                // If the delete was successful, then pull the zones again (to update the state).
                this.APICALL_getUserZones();
            })
            .catch((result) => {
            });
    }

    render() {

        // Destructure props and state.
        let { zoneState } = this.state;

        return (
            <NavDropdown title={zoneState.currentZone.name}>
                {zoneState.availableZones.map((zone, key) =>
                    <NavDropdown.Item
                        key={zone.id}
                        active={(zone.name === zoneState.currentZone.name)}
                        onClick={() => {this.handleChangeZone(zone)}}
                    >
                        {zone.name}
                    </NavDropdown.Item>)
                }
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={this.handleCreateZone.bind(this)}>Create New Zone</NavDropdown.Item>
                <CreateZone ref={this.createZoneRef} handleCreateZone={this.APICALL_putUserZones.bind(this)}/>
                {zoneState.currentZone !== 'Zone'
                    ?<NavDropdown.Item onClick={this.handleDeleteZone.bind(this)}>Delete Zone</NavDropdown.Item>
                    :null}
                {zoneState.currentZone !== 'Zone'
                    ?<DeleteZone ref={this.deleteZoneRef} zone={zoneState.currentZone} handleDeleteZone={this.APICALL_deleteUserZones.bind(this)}/>
                    :null}
            </NavDropdown>
        )
    }
}

export default NavZoneSelector;