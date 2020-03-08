import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Button from '@material-ui/core/Button';
import {InfoCard, TitleCard, DataCard, ControlCard, SensorSummaryCard, SensorIcon} from './sensor';
import {AlertSummaryCard, CreateAlertDialog} from "./alert";

class TabBrowser extends React.Component {

    render() {

        let { tabs, sensor_data, add_tab_cb, remove_tab_cb, current_tab_key, set_tab_cb,
              callbackRemoveSensor, alert_data, cb_remove_alert, cb_add_alert } = this.props;

        console.log(current_tab_key)
        return (
            <Tabs id="controlled_tab"
                  activeKey={current_tab_key}
                  onSelect={k => set_tab_cb(k)}>
                <Tab key="sensors" eventKey="sensors" title="Sensors">
                    <div style={{padding: "20px"}}>
                        <div style={{padding: "0px", color: '#575757', display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <div style={{paddingBottom: '10px'}}><h4>Your Sensors</h4></div>
                            {sensor_data.map(sensor => (<SensorSummaryCard key={sensor.id} add_tab_cb={add_tab_cb} sensor_name={sensor.name}/>))}
                        </div>
                    </div>
                </Tab>
                <Tab key="alerts" eventKey="alerts" title="Alerts">
                    <div style={{padding: "20px"}}>
                        <div style={{padding: "0px", color: '#575757', display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <div style={{paddingBottom: '10px'}}><h4>Your Alerts</h4></div>
                            {alert_data.map(alert => (
                                <AlertSummaryCard
                                    key={alert.id}
                                    alert_name={alert.name}
                                    alert_id={alert.id}
                                    cb_remove_alert={cb_remove_alert}
                                />))}
                        </div>
                    </div>
                </Tab>
                {tabs.map(function(tab){
                    return (
                        <Tab key={tab.eventKey} eventKey={tab.eventKey} title={tab.title}>
                            <TitleCard sensor_name={tab.eventKey} remove_tab_cb={remove_tab_cb} tab_id={tab.id}/>
                            <InfoCard sensor_name={tab.eventKey} remove_tab_cb={remove_tab_cb} tab_id={tab.id}/>
                            <DataCard sensor_name={tab.eventKey}/>
                            <ControlCard
                                sensor_name={tab.eventKey}
                                callbackRemoveSensor={callbackRemoveSensor}
                                tab_id={tab.id}
                            />
                        </Tab>
                    )
                })}
            </Tabs>
        )
    }
}

export { TabBrowser };