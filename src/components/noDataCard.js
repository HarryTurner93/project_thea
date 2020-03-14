import React from "react";

class NoDataCard extends React.Component {

    render() {

        return (
            <div style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{padding: "20px", backgroundColor:"#D1D1C6", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    <div><h4>Data</h4></div>
                    <div>No data associated with this trap yet.</div>
                </div>
            </div>
        );
    }
}

export default NoDataCard;
