import React from "react";
import {sensor_data, alert_data} from "../fake_data/fake_data";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';


class AlertSummaryCard extends React.Component {
    render() {

        // Deconstruct props.
        const { alert_name, alert_id, cb_remove_alert } = this.props;

        // Find the alert with the right name.
        const alert = alert_data.filter(alert => alert.name === alert_name)[0];

        // Find the associated sensor with the right name.
        const sensor = sensor_data.filter(sensor => sensor.id === alert.sensor)[0];

        return (
            <div style={{paddingTop: '20px', width: '100%'}}>
                <Card style={{width: '100%', backgroundColor: '#EEEEEE'}}>
                  <CardContent style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                      <Typography variant="h5" component="h2">
                          {alert_name}
                      </Typography>
                      <Typography color="textSecondary">
                          You will receive {alert.notification_medium} when the sensor {sensor.name} {alert.trigger} {alert.target}.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => cb_remove_alert(alert_id)}>Delete</Button>
                  </CardActions>
                </Card>
            </div>
        )
    }
}

class CreateAlertDialog extends React.Component {

    constructor(props) {
        super();
        this.state = {
            open: false,
            name: "",
            sensor: props.sensors[0],
            notification_medium: '',
            notification_medium_options: ['email', 'text']
        };

    }

    handleNotificationMediumChange(e) {
        console.log(e.target.value)
        this.setState({
            notification_medium: e.target.value
        });
    }

    handleClickOpen()  {
        this.setState((state) => {
            return {open: true}
        })
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value,
        });
    };

    handleSensorChange = (e) => {

        // Find the sensor with the right id.
        const sensor = this.props.sensors.filter(sensor => sensor.id == e.target.value)[0];

        this.setState({
            sensor: sensor
        });
    };

    handleClose() {
        this.setState((state) => {
            return {open: false, name: ""}
        })
    }

    handleCreate() {
        if (this.state.name !== "") {
            this.setState((state) => {
                return {open: false, name: ""}
            });
            this.props.cb_add_alert(this.state.name);
        }
    }

    render() {
        console.log(this.state.sensor.name)
        return (
            <div>
                <Button variant="outlined" color="primary" onClick={this.handleClickOpen.bind(this)}>
                    Create New Alert
                </Button>
                <Dialog disableBackdropClick disableEscapeKeyDown open={this.state.open} onClose={this.handleClose.bind(this)}>
                    <DialogTitle>Create Alert</DialogTitle>
                    <DialogContent>
                        <form style={{display: 'flex', flexDirection: 'column'}}>
                            <FormControl style={{paddingBottom: '20px'}}>
                                <TextField
                                    id="alert-name"
                                    label="Alert Name"
                                    value={this.state.name}
                                    onChange={this.handleNameChange.bind(this)}
                                    variant="outlined"
                                />
                            </FormControl>
                            <FormControl style={{paddingBottom: '20px'}}>
                                <InputLabel htmlFor="demo-dialog-native">Sensor</InputLabel>
                                <Select
                                    native
                                    value={this.state.sensor.name}
                                    onChange={this.handleSensorChange.bind(this)}
                                    input={<Input id="demo-dialog-native" />}
                                >
                                    {this.props.sensors.map(sensor => (
                                        <option value={sensor.id}>{sensor.name}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl style={{paddingBottom: '20px'}}>
                                <DialogContentText id="alert-dialog-description">
                                    This sensor is of type: {this.state.sensor.type}
                                </DialogContentText>
                            </FormControl>
                            <FormControl style={{paddingBottom: '20px'}}>
                                <InputLabel htmlFor="demo-dialog-native">Notification</InputLabel>
                                <Select
                                    native
                                    value={this.state.notification_medium}
                                    onChange={this.handleNotificationMediumChange.bind(this)}
                                    input={<Input id="demo-dialog-native" />}
                                >
                                    {this.state.notification_medium_options.map(medium => (
                                        <option value={medium}>{medium}</option>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl style={{paddingBottom: '20px'}}>
                                <TextField
                                    id="alert-name"
                                    label="Alert Name"
                                    value={this.state.name}
                                    onChange={this.handleNameChange.bind(this)}
                                    variant="outlined"
                                />
                            </FormControl>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose.bind(this)} color="primary">Cancel</Button>
                        <Button onClick={this.handleCreate.bind(this)} color="primary">Create</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export { AlertSummaryCard, CreateAlertDialog };