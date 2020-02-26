import React from "react";
import ReactMapGL, {Marker, Popup} from "react-map-gl";
import {SensorIcon, SensorBite} from "./sensor";

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: "100%",
                height: "100vh",
                latitude: 51.5084,
                longitude: -2.5927,
                zoom: 16,
            }
        };

        this.clearPopUp = this.clearPopUp.bind(this);
    }

    clearPopUp() {
        this.setState({popupInfo: null})
    };

    _onClickMarker = city => {
        this.setState({popupInfo: city});
    };

    _onMarkerDragEnd = event => {
        console.log(event);
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
                onClose={this.clearPopUp}
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

        let { sensor_data } = this.props;
        return (
            <ReactMapGL
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}
                mapStyle='mapbox://styles/hturner30/ck62e8klf0xzn1ithmmtve3iq'
                mapboxApiAccessToken='pk.eyJ1IjoiaHR1cm5lcjMwIiwiYSI6ImNrNjJhZWFkdjBiNnMzbm1tNHh1cDNlMWsifQ.0ZiYTbXUCbaJ2mxlibJjDg'
                >
                {(this.state.viewport.zoom >= 15)
                    ? sensor_data.map((sensor, index) => (
                        <SensorIcon
                            sensor={sensor}
                            index={index}
                            onClick={this._onClickMarker}
                            onMarkerDragEnd={this._onMarkerDragEnd}
                        />
                    ))
                    : null
                }
                {this._renderPopup()}
            </ReactMapGL>
            );
        }
    }

export { Map };