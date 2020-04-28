import React from "react";
import {Map} from "./map/Map";
import {TabBrowser} from "./tabs/tabBrowser";
import {API, graphqlOperation} from "aws-amplify";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";
import * as Sentry from '@sentry/browser';

class DashboardPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            current_tab_key: "traps",
            sensors: [],
            cachedZoneID: null,
            freezeMap: true
        };

        // Create References.
        this.mapRef = React.createRef();
    }

    resetTabs() {
        this.setState({tabs: [], current_tab_key: 'traps'})
    }

    resetDashboard() {

        // Reset sensors.
        this.setState({sensors: []})
        this.setState({freezeMap: true})

    }

    // API Calls
    // #########

    // Pull all sensors from the backend for the given zone. Update the state.
    APICALL_getZoneSensors (fly_to_zone) {

        // This function is only called if another zone exists, so unfreeze the map as it's not in default mode anymore.
        this.setState({freezeMap: false})


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
                this.setState({sensors: mappedSensors}, () => {

                    // Fly to zone.
                    if ( fly_to_zone ) {
                        this.relocateToZone()
                    }
                });

            })
            .catch((result) => console.log(result));
    }

    // Push new zone to the backend for the given user. Update the state.
    APICALL_putZoneSensors (latitude, longitude, name) {
        const payload = { name: name, latitude: latitude.toString(), longitude: longitude.toString(), sensorZoneId: this.props.zone.id };
        API.graphql(graphqlOperation(mutations.createSensor, {input: payload}))
            .then((result) => {

                // If the put was successful, then update state to the added zone.
                this.APICALL_getZoneSensors();
            })
            .catch((result) => {

            });
    }

    // Remove sensor association with a zone. Update the state.
    // Note that for now, it doesn't actually delete, just removes association with zone.
    APICALL_deleteZoneSensors (sensor) {
        const payload = {
            id: sensor.id,
            name: sensor.name,
            sensorZoneId: "none"
        };
        API.graphql(graphqlOperation(mutations.updateSensor, {input: payload}))
            .then((result) => {

                // If the delete was successful, then pull the zones again (to update the state).
                this.APICALL_getZoneSensors();
            })
            .catch((result) => {
            });
    }

    // Update sensor location.
    APICALL_moveZoneSensors (sensor, latitude, longitude) {
        const payload = {
            id: sensor.id,
            latitude: latitude,
            longitude: longitude
        };
        API.graphql(graphqlOperation(mutations.updateSensor, {input: payload}))
            .then((result) => {

                // If the delete was successful, then pull the zones again (to update the state).
                this.APICALL_getZoneSensors();
            })
            .catch((result) => {
            });
    }


    // Handler Functions
    // #################

    // Called from ?
    handleCreateSensor(latitude, longitude, name) {
        this.APICALL_putZoneSensors(latitude, longitude, name)
    }

    // Called from ?
    handleRemoveSensor (sensor, tab_id) {

        // Clear pop ups on the map.
        this.mapRef.current.clearPopUp();

        // Now remove the tab from the browser.
        this.handleRemoveTab(tab_id);

        // Now update API.
        this.APICALL_deleteZoneSensors(sensor)
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

    handleMoveSensor(lngLat, sensor) {

        this.APICALL_moveZoneSensors(sensor, lngLat[1], lngLat[0])
    }

    // Called from ?
    handleLocateSensor(longitude, latitude, speed, zoom) {
        if (this.mapRef.current !== null) {
            this.mapRef.current._goToViewport({longitude, latitude, speed, zoom})
        }
    }


    // Functions
    // #########

    relocateToZone() {

        // If no sensors, return.
        if ( this.state.sensors.length === 0) {
            return
        }

        // Create counts.
        let latitudes = 0
        let longitudes = 0

        // Count up all positions.
        this.state.sensors.map((sensor) => {
            latitudes += sensor.latitude
            longitudes += sensor.longitude
            return null
        });

        // Average.
        latitudes /= this.state.sensors.length;
        longitudes /= this.state.sensors.length;

        // Jump to position.
        this.handleLocateSensor(longitudes, latitudes, 2, 13)
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }


    // Render
    // ######

    render() {

        // Destructure props.
        let { zone } = this.props;


        // If the zone has changed, pull latest.
        if ( zone ) {
            if ( zone.id !== this.state.cachedZoneID) {
                this.setState({cachedZoneID: zone.id}, () => {
                    this.resetTabs()
                    this.APICALL_getZoneSensors(true)
                })
            }
        } else {
            this.handleLocateSensor( -4.5481, 54.2361,2, 5)
        }

        // Destructure state.
        let { sensors, tabs, current_tab_key } = this.state;

        return (
            <main className="App">
                <div style={{display: 'flex'}}>
                    <div style={{flex: 1}}>
                        <Map
                            sensorProps={
                                {
                                    allSensors: sensors,
                                    handleCreateSensor: this.handleCreateSensor.bind(this),
                                    handleMoveSensor: this.handleMoveSensor.bind(this)
                                }
                            }
                            tabProps={
                                {
                                    handleAddTab: this.handleAddTab.bind(this)
                                }
                            }
                            ref={this.mapRef}
                            freezeMap={this.state.freezeMap}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <TabBrowser
                            sensorProps={
                                {
                                    allSensors: sensors,
                                    removeSensor: this.handleRemoveSensor.bind(this),
                                    locateSensor: this.handleLocateSensor.bind(this)
                                }
                            }
                           tabProps={
                                {
                                    allTabs: tabs,
                                    currentTab: current_tab_key,
                                    addTab: this.handleAddTab.bind(this),
                                    removeTab: this.handleRemoveTab.bind(this),
                                    changeTab: this.handleChangeTab.bind(this)

                                }
                            }
                            setUploadFile={this.props.setUploadFile}
                        />
                    </div>
                </div>
            </main>
        );
    }
}


export default DashboardPage;