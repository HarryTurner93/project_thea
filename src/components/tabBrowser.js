import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {InfoCard, TitleCard, DataCard, ControlCard, SensorSummaryCard} from './sensor';

class TabBrowser extends React.Component {

    render() {

        let { sensorProps, tabProps } = this.props;

        return (
            <Tabs id="controlled_tab"
                  activeKey={tabProps.currentTab}
                  onSelect={k => tabProps.changeTab(k)}>
                <Tab key="traps" eventKey="traps" title="Traps">
                    <div style={{padding: "20px"}}>
                        <div style={{padding: "0px", color: '#575757', display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                            <div style={{paddingBottom: '10px'}}><h4>Your Traps</h4></div>
                            {sensorProps.allSensors.map(sensor => (
                                <SensorSummaryCard
                                    key={sensor.id}
                                    add_tab_cb={tabProps.addTab}
                                    sensor_name={sensor.name}
                                    callbackFindInMap={sensorProps.locateSensor}
                                />
                                ))}
                        </div>
                    </div>
                </Tab>
                {tabProps.allTabs.map(function(tab){
                    return (
                        <Tab key={tab.eventKey} eventKey={tab.eventKey} title={tab.title}>
                            <TitleCard sensor_name={tab.eventKey} remove_tab_cb={tabProps.removeTab} tab_id={tab.id}/>
                            <InfoCard sensor_name={tab.eventKey} remove_tab_cb={tabProps.removeTab} tab_id={tab.id}/>
                            <DataCard sensor_name={tab.eventKey}/>
                            <ControlCard
                                sensor_name={tab.eventKey}
                                callbackRemoveSensor={sensorProps.removeSensor}
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