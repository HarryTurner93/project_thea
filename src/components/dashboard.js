import React from "react";
import {Map} from "./map/Map";
import {TabBrowser} from "./tabBrowser";
import {sensor_data} from "../fake_data/fake_data";
import nextId from "react-id-generator";
import {API, graphqlOperation} from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

// Todo: Wrap up callbacks into single prop.
// Todo: API calls to get sensors.
// Todo: Think more carefully about when to pull from API when zone changes. Currently does it in render...

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            current_tab_key: "traps",
            sensors: []
        };

        // Create References.
        this.mapRef = React.createRef();
    }

    // API Calls
    // #########

    // Pull all zones from the backend for the given zone. Update the state.
    APICALL_getZoneSensors () {
        API.graphql(graphqlOperation(queries.getZone, {id: this.props.zone.id}))
            .then((result) => {

                // Pulled sensors.
                let sensors = result.data.getZone.sensors.items

                // Map string coordinates to floats.
                let mappedSensors = sensors.map(sensor => (
                    {
                        id: sensor.id,
                        name: sensor.name,
                        latitude: parseFloat(sensor.latitude),
                        longitude: parseFloat(sensor.longitude)
                    }
                ));

                // Update with sensors
                this.setState({sensors: mappedSensors});

            })
            .catch((result) => console.log(result));
    }

    // Push new zone to the backend for the given user. Update the state.
    //APICALL_putZoneSensors () {
    //    const payload = { name: "Behind House", latitude: "51.504", longitude: "-2.59", sensorZoneId: this.props.zone.id };
    //    API.graphql(graphqlOperation(mutations.createSensor, {input: payload}))
    //        .then((result) => {
    //
    //            // If the put was successful, then update state to the added zone.
    //            this.APICALL_getZoneSensors();
    //        })
    //        .catch((result) => {
    //
    //        });
    //}


    // Handler Functions
    // #################

    // Called from ?
    handleRemoveSensor (sensor_id, tab_id) {

        // Clear pop ups on the map.
        this.mapRef.current.clearPopUp();

        // Now remove the tab from the browser.
        this.handleRemoveTab(tab_id);

        // Now remove the sensor from the state.
        this.setState((state) => {
            const new_sensors = state.sensors.filter(sensor => sensor.id !== sensor_id);
            return {sensors: new_sensors}
        })
    }

    // Called from ?
    handleRemoveTab (id) {
        this.setState((state) => {
            const new_tabs = state.tabs.filter(tab => tab.id !== id);
            return {tabs: new_tabs, current_tab_key: "traps"}
        })
    }

    // Called from ?
    handleAddTab (eventKey) {

        // Get tabs that already have this eventKey.
        const existing_tabs = this.state.tabs.filter(tab => tab.eventKey === eventKey);

        // Add the new tab if none already exist.
        if (existing_tabs.length === 0) {
            this.setState((state, props) => ({
                tabs: state.tabs.concat({"eventKey": eventKey, "title": eventKey, "id": state.tabs.length}),
                current_tab_key: eventKey
            }));
        }
    }

    // Called from ?
    handleChangeTab(eventKey) { this.setState({current_tab_key: eventKey}) }

    handleMoveSensor(lngLat, sensorID) {
        this.setState({
            sensors: this.state.sensors.map(el => (el.id === sensorID ? {...el, longitude: lngLat[0], latitude: lngLat[1]} : el))
        });
    }

    // Called from ?
    handleLocateSensor(longitude, latitude) { this.mapRef.current._goToViewport({longitude, latitude}) }


    // Render
    // ######

    render() {

        // Destructure props.
        let { zone } = this.props;

        // Pull latest zones.
        if ( zone ) {
            this.APICALL_getZoneSensors()
        }

        // Destructure state.
        let { sensors, tabs, current_tab_key } = this.state;

        return (
            <main className="App">
                <div style={{display: 'flex'}}>
                    <div style={{flex: 1}}>
                        <Map
                            sensor_data={sensors}
                            callbackEditSensorLocation={this.handleMoveSensor.bind(this)}
                            add_tab_cb={this.handleAddTab}
                            ref={this.mapRef}
                        />
                    </div>

                </div>
            </main>
        );
    }
}

//<div style={{flex: 1}}>
//    <TabBrowser
//        sensorProps={
//            {
//                allSensors: sensors,
//                removeSensor: this.handleRemoveSensor.bind(this),
//                locateSensor: this.handleLocateSensor.bind(this)
//            }
//        }
//        tabProps={
//            {
//                allTabs: tabs,
//                currentTab: current_tab_key,
//                addTab: this.handleAddTab.bind(this),
//                removeTab: this.handleRemoveTab.bind(this),
//                changeTab: this.handleChangeTab.bind(this)
//
//            }
//        }
//    />
//</div>

export default Dashboard;