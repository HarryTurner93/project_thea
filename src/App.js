import React from 'react';
import './App.css';

// Import custom components.
import { Map } from './components/map';
import { TabBrowser } from './components/tabBrowser'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabs: []
        };

        this.removeTab = this.removeTab.bind(this)
        this.addTab = this.addTab.bind(this)
    }

    // Call back function to remove a tab from the browser.
    removeTab (id) {
        this.setState((state) => {
            const new_tabs = state.tabs.filter(tab => tab.id !== id);
            return {tabs: new_tabs}
        })
    }

    // Call back function to add a tab to the browser.
    addTab (eventKey) {
        this.setState((state, props) => ({
            tabs: state.tabs.concat({"eventKey": eventKey, "title": eventKey, "id": state.tabs.length})
        }));
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
                            remove_tab_cb={this.removeTab}
                        />
                    </div>
                </div>
            </main>
        )
    }
}

export default App;
