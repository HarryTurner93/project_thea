import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { InfoCard, TitleCard, DataCard, ControlCard } from './sensor';

class TabBrowser extends React.Component {

    render() {

        let { tabs, remove_tab_cb, current_tab_key, set_tab_cb } = this.props;

        return (
            <Tabs id="controlled_tab"
                  activeKey={current_tab_key}
                  onSelect={k => set_tab_cb(k)}>
                <Tab key="dashboard" eventKey="dashboard" title="Dashboard">
                    <div style={{paddingTop:"20px"}}>Try clicking an icon on the map.</div>
                </Tab>
                {tabs.map(function(tab){
                    return (
                        <Tab key={tab.eventKey} eventKey={tab.eventKey} title={tab.title}>
                            <TitleCard sensor_name={tab.eventKey} remove_tab_cb={remove_tab_cb} tab_id={tab.id}/>
                            <InfoCard sensor_name={tab.eventKey} remove_tab_cb={remove_tab_cb} tab_id={tab.id}/>
                            <DataCard sensor_name={tab.eventKey}/>
                            <ControlCard sensor_name={tab.eventKey}/>
                        </Tab>
                    )
                })}
            </Tabs>
        )
    }
}

export { TabBrowser };