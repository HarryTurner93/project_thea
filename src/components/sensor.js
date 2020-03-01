import React, { PureComponent } from "react";
import {Marker} from "react-map-gl";
import { sensor_data, detection_data } from "../fake_data/sensor_data";
import Tooltip from '@material-ui/core/Tooltip';
import { DeleteSensorButton } from "./buttons";
import CloseIcon from "@material-ui/icons/Close";
import CameraCard from "./cameraCard";
import PollutionCard from "./pollutionCard";
import NoDataCard from "./noDataCard";


import IconButton from "@material-ui/core/IconButton";
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Some global settings.
const ICON_SIZE = 80;

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  fill: '#d00',
  stroke: 'none'
};

class Pin extends PureComponent {
  render() {
    const {size = 20} = this.props;

    return (
      <svg height={size} viewBox="0 0 24 24" style={pinStyle}>
        <path d={ICON} />
      </svg>
    );
  }
}

class SensorIcon extends React.Component {

    get_pin (sensor, onClick) {
        if (this.props.sensor.drag === true) {
            return (
                <Pin size={50} />
            )
        }
        else {
            return (
                <div style={{cursor: 'pointer'}} onClick={() => onClick(sensor)}>
                    <img src={sensor.icon} alt="sensor_icon"
                         style={{
                             width: `${ICON_SIZE}px`,
                             transform: `translate(${-ICON_SIZE / 2}px,${-ICON_SIZE}px)`}}
                    />
                </div>
            )
        }
    }

    render() {

        const {sensor, index, onClick, onMarkerDragEnd} = this.props;

        return (
            <Marker
                key={`marker-${index}`}
                draggable
                onDragEnd={onMarkerDragEnd}
                longitude={sensor.longitude}
                latitude={sensor.latitude}>
                {this.get_pin(sensor, onClick)}
            </Marker>
        );
    }
}

class InfoCard extends React.Component {

    render() {
        // Deconstruct props.
        const { sensor_name } = this.props;

        // Find the sensor with the right name.
        const sensor = sensor_data.filter(sensor => sensor.name === sensor_name)[0];

        return (
            <div style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{padding: "20px", backgroundColor:"#EEEEEE", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    <div><h4>Basic Sensor Details</h4></div>
                    <div><b>Name:</b> {sensor.name}</div>
                    <div><b>Sensor Type:</b> {sensor.type}</div>
                    <div><b>Created:</b> {sensor.created}</div>
                    <div><b>Data Update Frequency:</b> {sensor.frequency}</div>
                    <div><b>Sensor Security:</b> {sensor.access}</div>
                    <div><b>Data Provenance:</b> {sensor.provenance}</div>
                </div>
            </div>
        );
    }
}

class TitleCard extends React.Component {

    render() {
        // Deconstruct props.
        const { sensor_name, remove_tab_cb, tab_id } = this.props;

        // Find the sensor with the right name.
        const sensor = sensor_data.filter(sensor => sensor.name === sensor_name)[0];

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

class DataCard extends React.Component {

    render() {

        // Find the sensor with the right name.
        const sensor = sensor_data.filter(sensor => sensor.name === this.props.sensor_name)[0];

        // Get detection data for that sensor.
        const data = detection_data.filter(data => data.sensor_id === sensor.id)[0];

        // Decide which card to show based on the detection data type.
        let card = <NoDataCard/>;
        if (data.type === 'camera') {
            card = <CameraCard
                information={data.info}
                data={data.data}
            />
        }
        else if (data.type === 'pollution') {
            card = <PollutionCard
                information={data.info}
                source_site={data.site}
                api={data.api}
                y_axis_label={data.y_axis_label}
            />
        }

        // Simply render the appropriate card component.
        return ( card );
    }
}

class ControlCard extends React.Component {

    render() {
        // Deconstruct props.
        const { sensor_name, callbackRemoveSensor, tab_id } = this.props;

        // Find the sensor with the right name.
        const sensor = sensor_data.filter(sensor => sensor.name === sensor_name)[0];

        return (
            <div style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{padding: "20px", backgroundColor:"#EEEEEE", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    <div><h4>Control</h4></div>
                    <div style={{display: 'flex'}}>
                        <DeleteSensorButton
                            sensorID={sensor.id}
                            callbackRemoveSensor={callbackRemoveSensor}
                            tab_id={tab_id}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

class SensorBite extends React.Component {
  render() {

      // Deconstruct props.
      const {info, add_tab_cb} = this.props;

      return (
          <div style={{paddingTop: "15px", textAlign: "left"}}>
              <div><b>{`${info.name}`}</b></div>
              <div>
                  <div>{`Type: ${info.type}`}</div>
                  <div>Health: <b style={{color: '#55BB55'}}>{info.health}</b></div>
                  <div onClick={() => add_tab_cb(info.name)} style={{cursor: 'pointer'}}><u>More Details</u></div>
              </div>
          </div>
      );
  }
}

class SensorSummaryCard extends React.Component {
    render() {

        // Deconstruct props.
        const { sensor_name, add_tab_cb } = this.props;

        // Find the sensor with the right name.
        const sensor = sensor_data.filter(sensor => sensor.name === sensor_name)[0];

        return (
            <div style={{paddingTop: '20px', width: '100%'}}>
                <Card style={{width: '100%', backgroundColor: '#EEEEEE'}}>
                  <CardContent style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    <Typography variant="h5" component="h2">
                        {sensor.name}
                    </Typography>
                    <Typography color="textSecondary">
                        {sensor.type}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => add_tab_cb(sensor.name)}>Details</Button>
                  </CardActions>
                </Card>
            </div>
        )
    }
}

export { SensorBite, SensorIcon, InfoCard, TitleCard, DataCard, ControlCard, SensorSummaryCard };