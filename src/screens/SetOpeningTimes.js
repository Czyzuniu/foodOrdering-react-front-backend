import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from "../components/Utils";
import Paper from "@material-ui/core/Paper/Paper";
import AddIcon from '@material-ui/icons/AddCircle';
import AddMenuItemColumn from "../components/AddMenuItemColumn";
import Button from "@material-ui/core/Button/Button";

const styles = theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column'
    },
    button: {
        margin: 'auto',
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 25,
        marginBottom:0
    },
    column: {
        flexDirection:'column'
    }

});

class SetOpeningTimes extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {classes} = this.props;

        return (
            <div id='content' className={classes.column}>
                time
            </div>
        );
    }
}

SetOpeningTimes.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SetOpeningTimes);