import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Nav, Navbar} from "react-bootstrap";
import {Map} from "./map";
import {TabBrowser} from "./tabBrowser";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
            current_tab_key: "dashboard"
        };

        // Bind all handler functions.
        this.removeTab = this.removeTab.bind(this)
        this.addTab = this.addTab.bind(this)
        this.setTab = this.setTab.bind(this)
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
        this.setState((state, props) => ({
            tabs: state.tabs.concat({"eventKey": eventKey, "title": eventKey, "id": state.tabs.length}),
            current_tab_key: eventKey
        }));
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
                            add_tab_cb={this.addTab}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <TabBrowser
                            tabs={this.state.tabs}
                            current_tab_key={this.state.current_tab_key}
                            remove_tab_cb={this.removeTab}
                            set_tab_cb={this.setTab}
                        />
                    </div>
                </div>
            </main>
        );
    }
}

export default Dashboard;