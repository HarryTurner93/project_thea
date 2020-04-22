import React  from "react";
import {Marker} from "react-map-gl";
import Tooltip from '@material-ui/core/Tooltip';
import {DeleteSensorButton} from "./buttons";
import CloseIcon from "@material-ui/icons/Close";
import Pin from "./map/Pin"
import uuid from 'react-uuid'


import IconButton from "@material-ui/core/IconButton";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Amplify
import {API, graphqlOperation, Storage} from 'aws-amplify';
import * as mutations from "../graphql/mutations";
import * as queries from "../graphql/queries";

class SensorIcon extends React.Component {

    handleDragEnd = event => {

        this.props.callbackEditSensorLocation(event.lngLat, this.props.sensor);
    };

    render() {

        const {sensor, index, handleClick, zoomLevel} = this.props;

        // Compute pin size dynamically.
        let pinSizeControl = 2.5
        let pinSize = zoomLevel * pinSizeControl / (((16 - zoomLevel) / 10) + 1)

        return (
            <Marker
                key={`marker-${index}`}
                draggable
                onDragEnd={this.handleDragEnd.bind(this)}
                longitude={sensor.longitude}
                latitude={sensor.latitude}
            >
                <div style={{cursor: 'pointer'}} onDoubleClick={() => handleClick(sensor)}>
                    <Pin size={pinSize} />
                </div>
            </Marker>
        );
    }
}

// The card right at the top of each sensor panel, with a title and close button.
class TitleCard extends React.Component {

    render() {
        // Deconstruct props.
        const { sensor, remove_tab_cb, tab_id } = this.props;

        return (
            <div style={{padding: "20px", display: "flex"}}>
                <Tooltip title="Close">
                    <IconButton onClick={() => remove_tab_cb(tab_id)}>
                        <CloseIcon></CloseIcon>
                    </IconButton>
                </Tooltip>
                <h3 style={{marginTop:"6px", marginLeft:"10px"}}>{sensor.name}</h3>
            </div>
        );
    }
}

// The card just below the title with basic sensor information.
class InfoCard extends React.Component {

    render() {

        // Deconstruct props.
        const { sensor } = this.props;

        return (
            <div style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{padding: "20px", backgroundColor:"#EEEEEE", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    <div><h4>Camera Trap Details</h4></div>
                    <div><b>Name:</b> {sensor.name}</div>
                    <div><b>ID:</b> {sensor.id}</div>
                    <div><b>LatLong:</b> {sensor.latitude}, {sensor.longitude}</div>
                </div>
            </div>
        );
    }
}

// The card below the information, with summary of data.
class DataCard extends React.Component {

    constructor() {
        super();
        this.state = {
            images: []
        }
    }

    componentDidMount() {
        this.APICALL_getSensorImages()
    }

    async fetch_urls(images) {

        let presignedURLs = []

        for (var i = 0; i < images.length; i++) {
            let psu = await Storage.get(images[i].url)
            presignedURLs.push(psu)
        }

        return presignedURLs
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // API Calls
    // #########

    // Pull all zones from the backend for the given zone. Update the state.
    APICALL_getSensorImages () {
        API.graphql(graphqlOperation(queries.getSensor, {id: this.props.sensor.id}))
            .then((result) => {

                let images = result.data.getSensor.images.items

                this.fetch_urls(images)
                    .then((presignedURLs) => {
                        this.setState({images: presignedURLs})
                        this.sleep(100)
                        this.forceUpdate()
                    })


            })
            .catch((result) => console.log(result));
    }

    // Push new zone to the backend for the given user. Update the state.
    APICALL_putSensorImages (url) {
        const payload = { url: url, classes: {}, imageSensorId: this.props.sensor.id };
        API.graphql(graphqlOperation(mutations.createImage, {input: payload}))
            .then((result) => {

                // If the put was successful, then update state to the added zone.
                this.APICALL_getSensorImages();
            })
            .catch((result) => {

            });
    }

    handleUpload(e) {

        let file = e.target.files[0]
        let id = uuid()

        Storage.put(id, file, {contentType: file.type})
            .then((result) => {

                // If this returned, then the image was uploaded successfully. Now update the database with the image key.
                this.APICALL_putSensorImages(result.key)

            })
            .catch(error => console.log(error));
    }

    render() {

        return (
            <div style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{padding: "20px", backgroundColor:"#D1D1C6", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                        <div><h4>Data</h4></div>
                        <Button variant="outlined" component="label">Upload Images<input onChange={this.handleUpload.bind(this)} type='file' style={{display: 'none'}}/></Button>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        {this.state.images.map(function(item, i) {
                            return <img key={item} style={{width: '150px', padding: '10px'}} src={item}/>
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

// The bit below the data in the sensor panel with options to delete and move sensors.
class ControlCard extends React.Component {

    render() {

        // Deconstruct props.
        const { sensor, callbackRemoveSensor, tab_id } = this.props;

        return (
            <div style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{padding: "20px", backgroundColor:"#EEEEEE", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    <div><h4>Control</h4></div>
                    <div style={{display: 'flex'}}>
                        <DeleteSensorButton
                            sensor={sensor}
                            callbackRemoveSensor={callbackRemoveSensor}
                            tab_id={tab_id}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

// This is the little pop up you get when clicking the icon on the map.
class SensorBite extends React.Component {
  render() {

      // Deconstruct props.
      const {info, add_tab_cb} = this.props;

      return (
          <div style={{paddingTop: "15px", textAlign: "left"}}>
              <div><b>{`${info.name}`}</b></div>
              <div>
                  <div onClick={() => add_tab_cb(info.name)} style={{cursor: 'pointer'}}><u>More Details</u></div>
              </div>
          </div>
      );
  }
}

// This is the card that appears in the "Sensor Tab" that lists all sensors. Think a menu to go to your sensors directly.
class SensorSummaryCard extends React.Component {
    render() {

        // Deconstruct props.
        const { sensor, add_tab_cb, callbackFindInMap } = this.props;

        return (
            <div style={{paddingTop: '20px', width: '100%'}}>
                <Card style={{width: '100%', backgroundColor: '#EEEEEE'}}>
                    <CardContent style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                        <Typography variant="h5" component="h2">
                            {sensor.name}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => add_tab_cb(sensor.name)}>Details</Button>
                        <Button size="small" onClick={() => callbackFindInMap(sensor.longitude, sensor.latitude, 1.2)}>Find in Map</Button>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export { SensorBite, SensorIcon, InfoCard, TitleCard, DataCard, ControlCard, SensorSummaryCard };