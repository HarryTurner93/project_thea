import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {InfoCard, TitleCard, DataCard, ControlCard, SensorSummaryCard} from '../sensors/sensor';
import * as Sentry from "@sentry/browser";
import styles from './tabs.module.css';

class TabBrowser extends React.Component {

    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {

        let { sensorProps, tabProps, setUploadFile } = this.props;

        return (
            <Tabs
                  className={styles.tab}
                  activeKey={tabProps.currentTab}
                  onSelect={k => tabProps.changeTab(k)}
            >
                <Tab key="traps" eventKey="traps" title="Traps" >
                    <div style={{padding: "20px"}}>
                        <div style={{padding: "0px", color: '#575757', display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <div style={{paddingBottom: '10px'}}><h4>Your Traps</h4></div>
                            {sensorProps.allSensors.map(sensor => (
                                <SensorSummaryCard
                                    key={sensor.id}
                                    add_tab_cb={tabProps.addTab}
                                    sensor={sensor}
                                    callbackFindInMap={sensorProps.locateSensor}
                                />
                                ))}
                        </div>
                    </div>
                </Tab>
                {tabProps.allTabs.map(function(tab){

                    // Find the sensor with the right name.
                    const sensor = sensorProps.allSensors.filter(sensor => sensor.name === tab.eventKey)[0];

                    return (
                        <Tab key={tab.eventKey} eventKey={tab.eventKey} title={tab.title}>
                            <TitleCard sensor={sensor} remove_tab_cb={tabProps.removeTab} tab_id={tab.id}/>
                            <InfoCard sensor={sensor} remove_tab_cb={tabProps.removeTab} tab_id={tab.id}/>
                            <DataCard sensor={sensor} setUploadFile={setUploadFile}/>
                            <ControlCard sensor={sensor} callbackRemoveSensor={sensorProps.removeSensor} tab_id={tab.id}/>
                        </Tab>
                    )
                })}
            </Tabs>
        )
    }
}

export { TabBrowser };