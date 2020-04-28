import React  from "react";
import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {API, graphqlOperation, Storage} from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as Sentry from "@sentry/browser";

import ImageBrowser from "./ImageBrowser";

class BrowserPage extends React.Component {

    constructor() {
        super();
        this.state = {
            sensors: [],
            imageURLS: []
        }
    }

    componentDidMount() {
        this.refreshPage(this.props.zone)
    }

    refreshPage(zone) {

        // Pull Sensors from API.
        this.setState({sensors: [], imageURLS: []})
        this.getZoneSensors(zone);
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
                console.log(image_list)

                // Get URLs for those images.
                this.fetch_urls(image_list)
                    .then((presignedURLs) => {

                        let imageURLS = this.state.imageURLS;
                        imageURLS.push(...presignedURLs)
                        this.setState({imageURLS: imageURLS})
                    })

            })
            .catch((result) => console.log(result));
    }


    async fetch_images() {

        let sensors = this.state.sensors;

        for (let i = 0; i < sensors.length; i++) {
            await this.APICALL_getSensorImages(sensors[i].id)
        }
    }

     async fetch_urls(image_list) {

        let presignedURLs = []

        for (var i = 0; i < image_list.length; i++) {
            let psu = await Storage.get(image_list[i].url)
            presignedURLs.push({url: psu})
        }

        return presignedURLs
    }

    // Called from Selector, argument is a list of selected items, does nothing right now.
    handleSelectionFinish(items) {

    }


    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {

        return (
            <div style={{width: '100%', height: (window.innerHeight * 0.94), /*backgroundImage: 'url(' + require('../../images/mesh_small.jpg') + ')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'*/}}>
                <div style={{display: 'flex'}}>
                    <div style={{width: '75%', padding: '40px'}}>
                        <Paper elevation={5}>
                            <ImageBrowser images={this.state.imageURLS} handleSelectionFinish={this.handleSelectionFinish.bind(this)}/>
                        </Paper>
                    </div>
                    <div style={{width: '25%', padding: '40px', paddingLeft: '0px'}}>
                        <Paper elevation={5}>
                            <List>
                                {this.state.sensors.map(function(item, index) {
                                    return (
                                        <ListItem button key={item.id} selected={item.selected}>
                                            <ListItemText primary={item.name}/>
                                        </ListItem>
                                    )
                                })}
                            </List>
                        </Paper>
                    </div>
                </div>
            </div>
        )
    }
}

export default BrowserPage;