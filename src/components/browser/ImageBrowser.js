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

        let { images, thresholds, handleSelectionFinish, handleDoubleClick, showLabelScores } = this.props;

        // Build the sortedSegments dict. It always has 'unsorted', then append whatever is in thresholds.
        let sortedImages= {unsorted: []}
        for (const [label, _] of Object.entries(thresholds)){
            sortedImages[label] = []
        }

        images.forEach((item, index) => {

            // If no scores at all, then it's unsorted.
            if (Object.keys(item.classes).length === 0 && item.classes.constructor === Object) {
                sortedImages.unsorted.push(item)
            } else {

                //  If reach here, then there is a scores object with at least one score.
                let notBeenSorted = true
                for (const [label, score] of Object.entries(item.classes)) {
                    if (score >= thresholds[label]) {
                        sortedImages[label].push(item)
                        notBeenSorted = false
                    }
                }

                // If the item was not sorted according to any of it's labels, then it goes back into unsorted.
                if ( notBeenSorted ) {
                    sortedImages.unsorted.push(item)
                }
            }
        })

        return (

            <div style={{display: 'flex'}}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={this.state.value}
                    onChange={this.handleTabChange.bind(this)}
                    style={{backgroundColor: '#EEEEEE', width: '15%'}}
                    TabIndicatorProps={{style: {backgroundColor: '#5eD0BD'}}}
                >
                    <Tab label={`Unsorted [${sortedImages['unsorted'].length}]`}/>
                    {Object.entries(thresholds).map(([key,value])=>{
                        return (
                            <Tab key={key} label={`${key} [${sortedImages[key].length}]`}/>
                        )
                    })}
                </Tabs>
                <TabPanel value={this.state.value} index={0} style={{width: '85%'}}>
                    <Selector
                        items={sortedImages.unsorted}
                        handleSelectionFinish={handleSelectionFinish}
                        handleDoubleClick={handleDoubleClick}
                        numItems={sortedImages.unsorted.length}
                        showLabelScores={showLabelScores}
                    />
                </TabPanel>
                {Object.entries(thresholds).map(([key,value])=>{
                        return (
                            <TabPanel key={key} value={this.state.value} index={Object.keys(thresholds).indexOf(key) + 1}  style={{width: '85%'}}>
                                <Selector
                                    items={sortedImages[key]}
                                    handleSelectionFinish={handleSelectionFinish}
                                    handleDoubleClick={handleDoubleClick}
                                    numItems={sortedImages.unsorted.length}
                                    showLabelScores={showLabelScores}
                                />
                            </TabPanel>
                        )
                    })}
            </div>
        )
    }
}

export default ImageBrowser;