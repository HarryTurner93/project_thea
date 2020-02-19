import React from "react";
import ReactMapGL, {Popup} from "react-map-gl";
import {SensorIcon, SensorBite} from "./sensor";
import Sensor_data from "../fake_data/sensor_data";

class Map extends React.Component {

  state = {
    viewport: {
      width: "100%",
      height: "100vh",
      latitude: 51.5084,
      longitude: -2.5927,
      zoom: 16
    }
  };

  _updateViewport = viewport => {
    this.setState({viewport});
  };

  _onClickMarker = city => {
    this.setState({popupInfo: city});
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
          onClose={() => this.setState({popupInfo: null})}
        >
          <SensorBite
              info={popupInfo}
              add_tab_cb={this.props.add_tab_cb}
          />
        </Popup>
      )
    );
  }

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
        mapStyle='mapbox://styles/hturner30/ck62e8klf0xzn1ithmmtve3iq'
        mapboxApiAccessToken='pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjJhZWFkdjBiNnMzbm1tNHh1cDNlMWsifQ.0ZiYTbXUCbaJ2mxlibJjDg'
      >
          {(this.state.viewport.zoom >= 15)
              ? <SensorIcon data={Sensor_data} onClick={this._onClickMarker}/>
              : null
          }
          {this._renderPopup()}
      </ReactMapGL>
    );
  }
}

export { Map };