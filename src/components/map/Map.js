import React from "react";
import ReactMapGL, {Popup, FlyToInterpolator} from "react-map-gl";
import {SensorIcon, SensorBite} from "../sensors/sensor";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import * as Sentry from "@sentry/browser";
import MessageAlert from "../misc/MessageAlert";

class CreateSensor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            sensorName: "",
            latitude: null,
            longitude: null
        };
    }

    // Handler Functions
    // #################

    // Called when user clicks cancel. Tells the map to remove the temporary sensor marker, and closes the dialog.
    handleClose() {
        this.props.handleCancelCreateSensor();
        this.setState({open: false, zoneName: ""})
    };

    // Called when the user types in text. Updates the name state.
    handleSensorNameChange(e) {
        this.setState({sensorName: e.target.value})
    };

    // Called when the user clicks agree, tells dashboard to create sensor and passes values.
    // Tells map to remove temporary sensor marker. Then closes.
    handleAgree() {
        this.setState({open: false, sensorName: ""});
        this.props.handleCancelCreateSensor();
        this.props.handleCreateSensor(this.state.latitude, this.state.longitude, this.state.sensorName);
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.open} onClose={this.handleClose.bind(this)}>
                    <DialogTitle>Create Sensor</DialogTitle>
                    <DialogContent>
                        <TextField autoFocus margin="dense" id="zoneName" value={this.state.sensorName} type="email"
                            onChange={this.handleSensorNameChange.bind(this)} label="Name" fullWidth
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

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: "100%",
                height: "100vh",
                latitude: 54.2361,
                longitude: -4.5481,
                zoom: 5,
            },
            tempSensor: null
        };

        // References to two dialog pop ups, components that are currently hidden and "turned on" by a button press.
        this.createSensorRef = React.createRef();
        this.messageRef = React.createRef()
    }

    clearPopUp() {
        this.setState({popupInfo: null})
    };

    _onClickMarker = city => {
        this.setState({popupInfo: city});
    };

    _onViewportChange = viewport =>
        this.setState({viewport: {...this.state.viewport, ...viewport}
    });

    _goToViewport = ({longitude, latitude, speed, zoom}) => {
        this._onViewportChange({
            longitude,
            latitude,
            zoom: zoom,
            transitionInterpolator: new FlyToInterpolator({speed: speed}),
            transitionDuration: 'auto'
        });
    };

    _renderPopup() {
        const {popupInfo} = this.state;

        return (
            popupInfo && (
            <Popup
                tipSize={5}
                anchor="top"
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                closeOnClick={false}
                onClose={this.clearPopUp.bind(this)}
                >
                <SensorBite
                    info={popupInfo}
                    add_tab_cb={this.props.tabProps.handleAddTab}
                />
            </Popup>
            )
        );
    }

    handleClick(e) {
        if ( e.rightButton ) {

            if (this.props.sensorProps.allSensors.length >= 2) {
                this.messageRef.current.fire("Sensor Limit Reached", "The free service is limited to just two sensors per zone.")
            } else {

                // This gets the lat and long from the mouse click position.
                // It then access the reference to the CreateSensor dialog popup, passes it the lat and long and triggers it.
                // The pop up is then responsible for adding the name and finally calling the parent handler in dashboard which calls the API.
                //this.props.sensorProps.handleAddSensor(e.lngLat[1], e.lngLat[0])
                let tempSensor = {name: 'tempSensor', latitude: e.lngLat[1], longitude: e.lngLat[0]}
                this.setState({tempSensor: tempSensor})
                this.createSensorRef.current.setState({latitude: e.lngLat[1], longitude: e.lngLat[0]})
                this.createSensorRef.current.setState({open: true})
            }
        }
    }

    handleCancelCreateSensor() {
        this.setState({tempSensor: null})
    }

    render() {

        // Destructure props.
        let { sensorProps } = this.props;

        // Destructure state.
        let { viewport } = this.state;

        if ( this.state.viewport.latitude === null ) {
            return null

        } else {

            return (
                <ReactMapGL
                    {...viewport}
                    onViewportChange={(viewport) => this.setState({viewport})}
                    mapStyle='mapbox://styles/hturner30/ck62e8klf0xzn1ithmmtve3iq'
                    mapboxApiAccessToken='pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjJhZWFkdjBiNnMzbm1tNHh1cDNlMWsifQ.0ZiYTbXUCbaJ2mxlibJjDg'
                    getCursor={() => {
                        'pointer'
                    }}
                    onClick={( this.props.freezeMap ) ? null : this.handleClick.bind(this)}
                >
                    {(viewport.zoom >= 12)
                        ? sensorProps.allSensors.map((sensor, index) => (
                            <SensorIcon
                                key={index}
                                sensor={sensor}
                                index={index}
                                zoomLevel={viewport.zoom}
                                handleClick={this._onClickMarker}
                                callbackEditSensorLocation={sensorProps.handleMoveSensor}
                            />
                        ))
                        : null
                    }
                    <MessageAlert ref={this.messageRef}/>
                    {(this.state.tempSensor)
                        ? <SensorIcon
                            key='tempSensor'
                            sensor={this.state.tempSensor}
                            index={sensorProps.allSensors.length}
                            zoomLevel={viewport.zoom}
                            callbackEditSensorLocation={sensorProps.handleMoveSensor}
                        />
                        : null}
                    {this._renderPopup()}
                    <CreateSensor
                        handleCancelCreateSensor={this.handleCancelCreateSensor.bind(this)}
                        handleCreateSensor={sensorProps.handleCreateSensor}
                        ref={this.createSensorRef}
                    />
                </ReactMapGL>
            );
        }
        }
    }

export { Map };