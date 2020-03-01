import React from "react";
import MediaCard from "./mediaCard";

class CameraCard extends React.Component {

    render() {

        // Deconstruct props.
        const { data, information } = this.props;

        // Compute the card content based on the data.
        let card_content = <div>No data available yet.</div>;
        if (data.length > 0) {
            card_content = <div style={{display: 'flex'}}>
            {data.map((d) =>
                <div key={d.id} style={{padding: '10px'}}>
                    <MediaCard
                        image={d.image}
                        title={d.title}
                        time_seen={d.time_seen}
                    />
                </div>
            )}
            </div>
        }

        return (
            <div style={{padding: "20px", paddingTop: "0px"}}>
                <div style={{padding: "20px", backgroundColor:"#EEEEEE", display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                    <div><h4>Data: Images</h4></div>
                    <div style={{textAlign: 'justify', paddingTop: '10px', paddingBottom: '10px', }}>{information}</div>
                    { card_content }
                </div>
            </div>
        );
    }
}

export default CameraCard;
