import React  from "react";
import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {API, graphqlOperation, Storage} from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as Sentry from "@sentry/browser";

class BrowserPage extends React.Component {

    constructor() {
        super();
        this.state = {
            sensors: [],
            imageURLS: []
        }
    }

    componentDidMount() {
        this.APICALL_getZoneSensors()
    }

    // API Calls
    // #########

    // Pull all sensors from the backend for the given zone. Update the state.
    APICALL_getZoneSensors () {
        API.graphql(graphqlOperation(queries.getZone, {id: this.props.zone.id}))
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
                this.setState({sensors: mappedSensors}, () => this.fetch_images());

            })
            .catch((result) => console.log(result));
    }

    // Pull all zones from the backend for the given zone. Update the state.
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
            presignedURLs.push(psu)
        }

        return presignedURLs
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {
        return (
            <div style={{width: '100%', height: (window.innerHeight * 0.94), backgroundImage: 'url(' + require('../../images/mesh.png') + ')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
                <div style={{display: 'flex'}}>
                    <div style={{width: '75%', padding: '40px'}}>
                        <Paper elevation={5}>
                            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                                {this.state.imageURLS.map(function(item, i) {
                                    return <img key={item} style={{width: '150px', padding: '10px'}} src={item}/>
                                })}
                            </div>
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