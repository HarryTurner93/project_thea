import React from "react";
import ReactMapGL, {Popup, FlyToInterpolator} from "react-map-gl";
import {SensorIcon, SensorBite} from "../sensor";

class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: "100%",
                height: "100vh",
                latitude: 51.5084,
                longitude: -2.5927,
                zoom: 14,
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

    _onViewportChange = viewport =>
        this.setState({viewport: {...this.state.viewport, ...viewport}
    });

    _goToViewport = ({longitude, latitude}) => {
        this._onViewportChange({
            longitude,
            latitude,
            zoom: 15,
            transitionInterpolator: new FlyToInterpolator({speed: 1.2}),
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
                getCursor={() => {'pointer'}}
                >
                {(this.state.viewport.zoom >= 12)
                    ? sensor_data.map((sensor, index) => (
                        <SensorIcon
                            key={index}
                            sensor={sensor}
                            index={index}
                            zoomLevel={this.state.viewport.zoom}
                            onClick={this._onClickMarker}
                            callbackEditSensorLocation={this.props.callbackEditSensorLocation}
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