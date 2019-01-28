import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from "../components/Utils";
import Paper from "@material-ui/core/Paper/Paper";
import AddIcon from '@material-ui/icons/AddCircle';
import AddMenuItemColumn from "../components/AddMenuItemColumn";
import Button from "@material-ui/core/Button/Button";
const EditTable = require('material-ui-table-edit')
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

const headers = [
    {value: 'Name', type: 'TextField', width: 200},
    {value: 'Address', type: 'TextField', width: 200},
    {value: 'Phone', type: 'TextField', width: 200},
    {value: 'Date', type: 'DatePicker', width: 200},
    {value: 'Enabled', type: 'Toggle', width: 50},
    {value: 'Last Edited By', type: 'ReadOnly', width: 100}
]

const rows = []

const onChange = (row) => {
    console.log(row)
}

class ViewMenuNew extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const {classes} = this.props;

        return (
            <div id='content' className={classes.column}>
                <EditTable
                    onChange={onChange}
                    rows={rows}
                    headerColumns={headers}
                    enableDelete={true}
                />
            </div>
        );
    }
}

ViewMenuNew.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewMenuNew);