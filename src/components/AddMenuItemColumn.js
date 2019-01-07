import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Utils from "./Utils";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 16,
  },
  menu: {
    width: 200,
  },
});

const foodTypes = [
  {
    value: 'MT_STARTER',
    label: 'Starter',
  },
  {
    value: 'MT_MAIN',
    label: 'Main',
  },
  {
    value: 'MT_DSRT',
    label: 'Desert',
  },
  {
    value: 'MT_SNK',
    label: 'Snack',
  },
  {
    value: 'MT_DRINK',
    label: 'Drink',
  },
];

class AddMenuItemColumn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      PRODUCT_NAME:"",
      PRODUCT_DESCRIPTION:"",
      PRODUCT_PRICE:"",
      PRODUCT_MENU_TYPE:foodTypes[0].value,
    }
  }


  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} >
        <TextField
          required
          id="outlined-name"
          label="Product name"
          value={this.state.PRODUCT_NAME}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={(e) => {
            this.setState({
              'PRODUCT_NAME':e.target.value
            })
          }}

        />

        <TextField
          id="outlined-uncontrolled"
          label="Product description"
          value={this.state.PRODUCT_DESCRIPTION}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={(e) => this.setState({
            PRODUCT_DESCRIPTION:e.target.value
          })}
          required
        />
        <TextField
          required
          id="outlined-required"
          value={this.state.PRODUCT_PRICE}
          label="Price"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={(e) => this.setState({
            PRODUCT_PRICE:e.target.value
          })}
        />
        <TextField
          required
          id="outlined-select-currency"
          select
          label="Product type"
          value={this.state.PRODUCT_MENU_TYPE}
          className={classes.textField}
          SelectProps={{
            MenuProps: {
              className: classes.menu,
            },
          }}
          helperText="Please select food type"
          margin="normal"
          variant="outlined"
          onChange={(e) => this.setState({
            PRODUCT_MENU_TYPE:e.target.value
          })}
        >
          {foodTypes.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </form>
    );
  }
}

AddMenuItemColumn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddMenuItemColumn);