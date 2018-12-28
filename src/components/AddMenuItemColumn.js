import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

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
    value: 'FOOD_STAR',
    label: 'Starter',
  },
  {
    value: 'FOOD_MAIN',
    label: 'Main',
  },
  {
    value: 'FOOD_DSRT',
    label: 'Desert',
  },
  {
    value: 'FOOD_SNK',
    label: 'Snack',
  },
  {
    value: 'FOOD_DRNK',
    label: 'Drink',
  },
];

class AddMenuItemColumn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      productName:"",
      productDescription:"",
      productPrice:"",
      productType:"FOOD_DSRT",
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} >
        <TextField
          id="outlined-name"
          label="Product name"
          value={this.state.productName}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={(e) => {
            this.setState({
              'productName':e.target.value
            })
          }}

        />



        <TextField
          id="outlined-uncontrolled"
          label="Product description"
          value={this.state.productDescription}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={(e) => this.setState({
            productDescription:e.target.value
          })}
        />
        <TextField
          required
          id="outlined-required"
          value={this.state.productPrice}
          label="Price"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={(e) => this.setState({
            productPrice:e.target.value
          })}
        />
        <TextField
          id="outlined-select-currency"
          select
          label="Product type"
          value={this.state.productType}
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
            productType:e.target.value
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