import React from "react";
import {Marker} from "react-map-gl";
import Sensor_data from "../fake_data/sensor_data";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

// Some global settings.
const ICON_SIZE = 80;

class SensorIcon extends React.Component {
  render() {
    const {data, onClick} = this.props;

    return data.map((sensor, index) => (
      <Marker key={`marker-${index}`} longitude={sensor.longitude} latitude={sensor.latitude}>
          <div style={{cursor: 'pointer'}} onClick={() => onClick(sensor)}>
             <img src={sensor.icon}
                  alt="sensor_icon"
                  style={{
                      width: `${ICON_SIZE}px`,
                      transform: `translate(${-ICON_SIZE / 2}px,${-ICON_SIZE}px)`}}/>
          </div>
      </Marker>
    ));
  }
}

class InfoCard extends React.Component {

    render() {
        // Deconstruct props.
        const { sensor_name } = this.props;

        // Find the sensor with the right name.
        const sensor = Sensor_data.filter(sensor => sensor.name === sensor_name)[0];

        return (
            <div style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{padding: "20px", backgroundColor:"#B6E0DC", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
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
        const sensor = Sensor_data.filter(sensor => sensor.name === sensor_name)[0];

        return (
            <div style={{padding: "20px", display: "flex"}}>
                <IconButton onClick={() => remove_tab_cb(tab_id)}>
                    <CloseIcon></CloseIcon>
                </IconButton>
                <h3 style={{marginTop:"6px", marginLeft:"10px"}}>{sensor.name}</h3>
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

export { SensorBite, SensorIcon, InfoCard, TitleCard };