import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import {createSelectable, DeselectAll, SelectableGroup, SelectAll} from "react-selectable-fast";
import Button from "@material-ui/core/Button";

import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

class SegmentCard extends React.Component {

    render() {

        const { selectableRef, isSelected, isSelecting, item, handleDoubleClick, showLabelScores} = this.props

        // Create the label score map.
        const scores = Object.entries(item.classes).map(([label,score])=>{
            if (label !== 'dummy') {
                return (
                    <div key={label}><b>{label}:</b> {score.toFixed(3).toString()}</div>
                );
            }
        })

        return (
            <div style={{padding: '10px'}} onDoubleClick={(e) => {handleDoubleClick(item)}}>
                <Card ref={selectableRef}
                      style={{
                          width: '300px',
                          padding: '5px',
                          backgroundColor: (isSelected) ? '#5eD0BD' : '#FFFFFF',
                          opacity: (isSelecting) ? 0.5 : 1.0
                      }}>
                    <CardMedia
                        style={{height: '150px'}}
                        image={`${item.url}`}
                    />
                    {showLabelScores
                        ? scores
                        : null}
                </Card>
            </div>
        )
    }
}

const SelectableCard = createSelectable(SegmentCard);

class MyList extends React.Component {

    shouldComponentUpdate(nextProps) {
        return nextProps.items !== this.props.items
    }

    render() {
        const { items, pageInfo, handleChangePage, handleDoubleClick, showLabelScores } = this.props;
        const h = window.innerHeight - 440;

        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className="button-container" style={{display: 'flex', padding: '10px', paddingBottom: '30px'}}>
                        <div style={{paddingRight: '10px'}}>
                            <SelectAll>
                                <Button variant="contained" color="primary" disableElevation style={{backgroundColor: '#00A287'}}>
                                    Select All
                                </Button>
                            </SelectAll>
                        </div>
                        <div>
                            <DeselectAll>
                                <Button variant="contained" color="primary" disableElevation style={{backgroundColor: '#00A287'}}>
                                    Clear Selection
                                </Button>
                            </DeselectAll>
                        </div>
                    </div>

                    <div className="button-container" style={{display: 'flex', padding: '10px', paddingBottom: '30px'}}>
                        <div style={{paddingRight: '20px'}}>
                            Page {pageInfo.pageNum}/{Math.floor(pageInfo.numPages)}
                        </div>
                        <div style={{paddingRight: '10px'}}>
                            <Button variant="contained" color="primary" disableElevation style={{backgroundColor: '#00A287'}} onClick={(e) => {handleChangePage('back')}}>
                                <ArrowLeftIcon/>
                            </Button>
                        </div>
                        <div>
                            <Button variant="contained" color="primary" disableElevation style={{backgroundColor: '#00A287'}} onClick={(e) => {handleChangePage('forward')}}>
                                <ArrowRightIcon/>
                            </Button>
                        </div>
                    </div>
                </div>

                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', height: h + 'px', overflowY: 'auto'}}>
                    {items.map(item => (
                        <SelectableCard
                            key={item.url}
                            item={item}
                            handleDoubleClick={handleDoubleClick}
                            showLabelScores={showLabelScores}
                        />
                        ))}
                </div>
            </div>
        )
    }
}

class Selector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            numPerPage: 16
        }
    }

    componentDidMount(){
        document.addEventListener("keydown", this.handleKeyPress.bind(this), false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKeyPress.bind(this), false);
    }

    handleKeyPress(event){
        if (event.key === '=') {
            this.handleChangePage('forward')
        } else if (event.key === "-") {
            this.handleChangePage('back')
        }

    }

    handleChangePage(direction) {
        if (direction === 'back') {
            if (this.state.page > 0) {
                this.setState((state, props) => ({
                    page: state.page - 1
                }))
            }
        } else {
            let numPages = this.props.numItems / this.state.numPerPage;
            if ( this.state.page < ( numPages - 1) ) {
                this.setState((state, props) => ({
                    page: state.page + 1
                }))
            }
        }
    }

    handleSelectionFinish(items) {
         let mappedItems = items.map(item => item.props.item);
         this.props.handleSelectionFinish(mappedItems)
    }

    render() {

        // Destructure the props.
        let { items, numItems, handleDoubleClick, showLabelScores } = this.props;

        // Paginate the items.
        let paginated_items = items.slice(this.state.page * this.state.numPerPage, (this.state.page * this.state.numPerPage) + this.state.numPerPage)

        return (
            <SelectableGroup
                ref={this.getSelectableGroupRef}
                className="main"
                clickClassName="tick"
                enableDeselect={true}
                tolerance={10}
                deselectOnEsc={true}
                allowClickWithoutSelected={false}
                onSelectionFinish={this.handleSelectionFinish.bind(this)}
                ignoreList={['.not-selectable']}
                allowShiftClick={true}
            >
                <MyList
                    items={paginated_items}
                    pageInfo={{pageNum: this.state.page, numPages: numItems / this.state.numPerPage}}
                    handleChangePage={this.handleChangePage.bind(this)}
                    handleDoubleClick={handleDoubleClick}
                    showLabelScores={showLabelScores}
                />
            </SelectableGroup>
        )
    }
}

export default Selector;
