import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { InfoCard, TitleCard } from './sensor';
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

class TabBrowser extends React.Component {

    render() {
        let { tabs, remove_tab_cb } = this.props;
        return (
            <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab key="dashboard" eventKey="dashboard" title="Dashboard">
                    <div>Tab 1</div>
                </Tab>
                <Tab key="network" eventKey="network" title="Sensor Network">
                    <div>Tab 2</div>
                </Tab>
                {tabs.map(function(tab){
                    return (
                        <Tab key={tab.eventKey} eventKey={tab.eventKey} title={tab.title}>
                            <TitleCard sensor_name={tab.eventKey} remove_tab_cb={remove_tab_cb} tab_id={tab.id}/>
                            <InfoCard sensor_name={tab.eventKey} remove_tab_cb={remove_tab_cb} tab_id={tab.id}/>
                        </Tab>
                    )
                })}
            </Tabs>
        )
    }
}

export { TabBrowser };