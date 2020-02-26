import React from "react";
import {Map} from "./map";
import {TabBrowser} from "./tabBrowser";
import {sensor_data} from "../fake_data/sensor_data";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            current_tab_key: "dashboard",
            sensors: Array.from(sensor_data)
        };

        // Bind all handler functions.
        this.callbackRemoveSensor = this.callbackRemoveSensor.bind(this);
        this.removeTab = this.removeTab.bind(this);
        this.addTab = this.addTab.bind(this);
        this.setTab = this.setTab.bind(this);

        // Create References.
        this.mapRef = React.createRef();
    }

    // Call back function to remove a sensor.
    callbackRemoveSensor (sensor_id, tab_id) {

        // Clear pop ups on the map.
        this.mapRef.current.clearPopUp();

        // Now remove the tab from the browser.
        this.removeTab(tab_id);

        // Now remove the sensor from the state.
        this.setState((state) => {
            const new_sensors = state.sensors.filter(sensor => sensor.id !== sensor_id);
            return {sensors: new_sensors}
        })
    }

    // Call back function to remove a tab from the browser.
    removeTab (id) {
        this.setState((state) => {
            const new_tabs = state.tabs.filter(tab => tab.id !== id);
            return {tabs: new_tabs, current_tab_key: "dashboard"}
        })
    }

    // Call back function to add a tab to the browser.
    addTab (eventKey) {

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

    setTab(eventKey) {
        this.setState({current_tab_key: eventKey})
    }

    render() {
        return (
            <main className="App">
                <div style={{display: 'flex'}}>
                    <div style={{flex: 1}}>
                        <Map
                            sensor_data={this.state.sensors}
                            add_tab_cb={this.addTab}
                            ref={this.mapRef}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <TabBrowser
                            sensor_data={this.state.sensors}
                            tabs={this.state.tabs}
                            add_tab_cb={this.addTab}
                            current_tab_key={this.state.current_tab_key}
                            remove_tab_cb={this.removeTab}
                            set_tab_cb={this.setTab}
                            callbackRemoveSensor={this.callbackRemoveSensor}
                        />
                    </div>
                </div>
            </main>
        );
    }
}

export default Dashboard;