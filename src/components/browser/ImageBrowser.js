import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Selector from "./Selector";
import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

function TabPanel(props) {

    const { children, value, index, ...other } = props;

    return (
        <Typography
            component='div'
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            {...other}
            >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

class ImageBrowser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0
        }
    }

    handleTabChange(e, newValue) {this.setState({value: newValue})}

    render() {

        let { images, handleSelectionFinish } = this.props;

        // Build the sortedSegments dict. It always has 'unsorted', then append whatever is in thresholds.
        let sortedImages = {unsorted: []}

        images.forEach((item, index) => {

            // For now just put them all in unsorted.
            sortedImages.unsorted.push(item)

        })

        return (
            <div>
                <AppBar position='static'>
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleTabChange.bind(this)}
                        style={{backgroundColor: '#1F7B67'}}
                        TabIndicatorProps={{style: {backgroundColor: '#5eD0BD'}}}
                    >
                        <Tab label={`Unsorted [${sortedImages['unsorted'].length}]`}/>
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.value} index={0}>
                    <Selector
                        items={sortedImages.unsorted}
                        handleSelectionFinish={handleSelectionFinish}
                        numItems={sortedImages.unsorted.length}
                    />
                </TabPanel>
            </div>
        )
    }
}

export default ImageBrowser;