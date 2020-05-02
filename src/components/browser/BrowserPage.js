import React  from "react";
import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {API, graphqlOperation, Storage} from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as Sentry from "@sentry/browser";

import ImageBrowser from "./ImageBrowser";
import BrowserControlPanel from "./BrowserControlPanel";
import * as mutations from "../../graphql/mutations";

import splash_image from '../../images/splash_image.png';

class BrowserPage extends React.Component {

    constructor() {
        super();
        this.state = {
            sensors: [],
            items: [],
            selectedItems: [],
            modifiedItems: [],
            focusItem: null,
            labels: {cat: 0.5},
            showLabelScores: false
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyPress.bind(this), false);
        this.refreshPage(this.props.zone)
    }

    refreshPage(zone) {

        // Pull Sensors from API.
        this.setState({sensors: [], imageURLS: []})
        this.getZoneSensors(zone);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKeyPress.bind(this), false);
    }

    handleKeyPress(event){
        if (event.key === 'Delete') {
                this.handleAssignLabel('none')
            }
        Object.entries(this.state.labels).map(([key,value])=>{
            if (event.key === key[0]) {
                this.handleAssignLabel(key, false)
            }
            if (event.key === key[0].toUpperCase()) {
                this.handleAssignLabel(key, true)
            }
            return null
        })
    }

    // API Calls
    // #########

    // Pull all sensors from the backend for a given zone. Update the state.
    getZoneSensors (zone) {

        // If the zone has no ID, then it's not valid, then just return. This will be the case when the user hasn't
        // create any zones, but a default one is used.
        if (!zone.hasOwnProperty('id')) {
            return null
        }

        API.graphql(graphqlOperation(queries.getZone, {id: zone.id}))
            .then((result) => {

                // Pulled sensors.
                let sensors = result.data.getZone.sensors.items

                // Map string coordinates to floats.
                let mappedSensors = sensors.map(sensor => (
                    {
                        id: sensor.id,
                        name: sensor.name,
                        selected: true
                    }
                ));

                // Update with sensors
                this.setState({sensors: mappedSensors}, () => {
                    this.fetch_images()
                });

            })
            .catch((result) => console.log(result));
    }

    // Pull all images from the backend for the given sensors. Update the state.
    async APICALL_getSensorImages (sensorID) {
        API.graphql(graphqlOperation(queries.getSensor, {id: sensorID}))
            .then((result) => {

                let image_list = result.data.getSensor.images.items

                // Get URLs for those images.
                this.fetch_urls(image_list, sensorID)
                    .then((items) => {

                        let _items = this.state.items;
                        _items.push(...items)
                        this.setState({items: _items})
                    })

            })
            .catch((result) => console.log(result));
    }


    APICALL_mutateImages (image) {
        const payload = {
            id: image.id,
            classes: image.classes
        };
        API.graphql(graphqlOperation(mutations.updateImage, {input: payload}))
            .then((result) => {
                console.log("Success: ", result)

            })
            .catch((result) => {
            });
    }


    async fetch_images() {

        let sensors = this.state.sensors;

        for (let i = 0; i < sensors.length; i++) {
            await this.APICALL_getSensorImages(sensors[i].id)
        }
    }

     async fetch_urls(image_list, sensorID) {

        let items = []

        for (var i = 0; i < image_list.length; i++) {
            let psu = await Storage.get(image_list[i].url)

            // Turn class string into list.
            let classList = image_list[i].classes.split(',')
            let classes = {}

            for (let i = 0; i < classList.length; i++) {
                if (classList[i].includes(':')) {
                    let bits = classList[i].split(':')
                    classes[bits[0]] = parseFloat(bits[1])
                }
            }

            items.push({url: psu, id: image_list[i].id, classes: classes, sensorID: sensorID})
        }

        return items
    }

    save() {

        let modifiedItems = this.state.modifiedItems;

        for (let i = 0; i < modifiedItems.length; i++) {

            let image = { ...modifiedItems[i] };

            // Convert classes back to class code.
            let classCodeArray = []
            for (const label in image.classes) {
                let labelCode = `${label}:${image.classes[label]}`;
                classCodeArray.push(labelCode)
            }
            let classCode = classCodeArray.join()

            image.classes = classCode
            this.APICALL_mutateImages(image)
        }

        this.setState({modifiedItems: []})
    }

    // Called from Selector, argument is a list of selected items, does nothing right now.
    handleSelectionFinish(items) {
        this.setState({selectedItems: items});
    }

    handleDoubleClick(item) {
        this.setState({focusItem: item})
    }

    // Called from ControlPanel, argument is a label, updates from segment, the stored segments with the new label.
    handleAssignLabel(label, opposite) {

        // Pull out items to mutate.
        let items = this.state.items;
        let modifiedItems = this.state.modifiedItems;

        // Pull out the urls so it's just a list.
        let urls = this.state.selectedItems.map(item => item.url);

        for (var i = 0; i < items.length; i++) {
            if (urls.includes(items[i].url)) {

                // If none, then remove all labels for this segment. Otherwise add relevant label.
                if (label === 'none') {
                    items[i].classes = {}
                } else {

                    // Set label to 1.0.
                    if ( opposite ) {
                        items[i].classes[label] = 0.0;
                    } else {
                        items[i].classes[label] = 1.0;
                    }
                }

                if (modifiedItems.indexOf(items[i]) === -1) {
                    modifiedItems.push(items[i])
                }
            }
        }

        // Finally update the state, and save.
        this.setState({items: items, selectedItems: [], modifiedItems: modifiedItems});
    }

    // Called from ControlPanel, no argument, simply toggles state.
    handleToggleLabelScores() {
        if (this.state.showLabelScores) {
            this.setState({showLabelScores: false})
        } else {
            this.setState({showLabelScores: true})
        }
    }

    handleToggleSensor(sensor) {
        let sensors = this.state.sensors;
        for (let i = 0; i < sensors.length; i++) {
                if (sensors[i].id == sensor.id) {
                    sensors[i].selected = !sensors[i].selected;
                }
        }
        this.setState({sensors: sensors})
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {

        // Filter the items to be only those in the sensor list.
        let currentSensorIDS = this.state.sensors.map((sensor) => (sensor.selected ? sensor.id : null))
        let filteredItems = this.state.items.filter((item) => (currentSensorIDS.includes(item.sensorID) ? item : null))

        let handleToggleSensor = this.handleToggleSensor.bind(this)


        return (
            <div style={{width: '100%', height: (window.innerHeight * 0.94), /*backgroundImage: 'url(' + require('../../images/mesh_small.jpg') + ')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'*/}}>
                <div style={{display: 'flex'}}>
                    <div style={{width: '60%', padding: '40px'}}>
                        <Paper elevation={5}>
                            <div>
                                <BrowserControlPanel
                                    labels={this.state.labels}
                                    showLabelScores={this.state.showLabelScores}
                                    handleAssignLabel={this.handleAssignLabel.bind(this)}
                                    handleToggleLabelScores={this.handleToggleLabelScores.bind(this)}
                                    handleSave={this.save.bind(this)}
                                />
                            </div>
                            <ImageBrowser
                                images={filteredItems}
                                thresholds={this.state.labels}
                                showLabelScores={this.state.showLabelScores}
                                handleSelectionFinish={this.handleSelectionFinish.bind(this)}
                                handleDoubleClick={this.handleDoubleClick.bind(this)}
                            />
                        </Paper>
                    </div>
                    <div style={{display: 'flex', width: '40%', flexDirection: 'column'}}>

                        <div style={{padding: '40px', paddingLeft: '0px', width: '100%'}}>
                            <Paper elevation={5}>
                                {this.state.focusItem == null
                                 ? <img style={{width: '100%', padding: '10px'}} src={splash_image}/>
                                 : <img style={{width: '100%', padding: '10px'}} src={this.state.focusItem.url}/>}
                            </Paper>
                        </div>

                        <div style={{padding: '40px', paddingLeft: '0px', paddingTop: '0px'}}>
                            <Paper elevation={5}>
                                <div style={{padding: '20px'}}>
                                    <h4>Sensors</h4>
                                    <p>Select from list those you wish to appear in the browser.</p>
                                </div>
                                <List>
                                    {this.state.sensors.map(function(item, index) {
                                        return (
                                            <ListItem button key={item.id} selected={item.selected} onClick={(e) => {handleToggleSensor(item)}}>
                                                <ListItemText primary={item.name}/>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            </Paper>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default BrowserPage;