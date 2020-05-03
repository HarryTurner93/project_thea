import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";

class MessageAlert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            title: "",
            message: ""
        };
    }

    // Simple Handlers
    handleClose() { this.setState({open: false}) };
    fire(title, message, foot) {
        this.setState({title: title, message: message, foot:foot, open: true})
    }


    render() {

        let { title, message, foot} = this.state;

        return (
            <div>
                <Dialog open={this.state.open} onClose={this.handleClose.bind(this)}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{message}</DialogContentText>
                        <DialogContentText>{foot}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose.bind(this)} color="primary">Okay</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default MessageAlert;