import React from 'react';
import {Navbar, Nav, NavDropdown, NavItem} from 'react-bootstrap';
import NavZoneSelector from "../zones/navZoneSelector";

class BrowserControlPanel extends React.Component {

    render() {
        let { handleToggleLabelScores, handleAssignLabel, labels, showLabelScores, handleSave } = this.props;
        return (
            <div>
                <Navbar style={{backgroundColor: '#1F7B67'}} variant="dark">
                    <Navbar.Brand><b>Browser</b></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link onClick={(e) => {handleToggleLabelScores()}}>{`Show Label Scores: ${showLabelScores ? 'On' : 'Off'}`}</Nav.Link>

                            <NavDropdown title="Assign Label" id="basic-nav-dropdown" style={{paddingLeft: '10px'}}>
                                <NavDropdown.Item onClick={(e) => {handleAssignLabel("none")}}>Remove Assigned Labels [Del]</NavDropdown.Item>
                                {Object.entries(labels).map(([key,value])=>{
                                    return (
                                        <NavDropdown.Item key={key} onClick={(e) => {handleAssignLabel(key, false)}}>{`${key} [${key[0]}]`}</NavDropdown.Item>
                                    )
                                })}
                                <NavDropdown.Divider />
                                {Object.entries(labels).map(([key,value])=>{
                                    return (
                                        <NavDropdown.Item key={key} onClick={(e) => {handleAssignLabel(key, true)}}>{`NOT ${key} [Shift + ${key[0]}]`}</NavDropdown.Item>
                                    )
                                })}

                            </NavDropdown>
                        </Nav>
                        <Nav className="ml-auto">
                            <Nav.Link onClick={(e) => {handleSave()}}>Save</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}

export default BrowserControlPanel;