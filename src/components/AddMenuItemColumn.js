import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import DeleteCrossIcon from '@material-ui/icons/Clear';
import Utils from "./Utils";
import Button from "@material-ui/core/Button/Button";


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent:'center',
    backgroundColor:'white'
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
   delete: {
      display:'flex',
      alignItems: 'center'
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
    label: 'Dessert',
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

    this.menuItem = this.props.menuItem

    this.state = {
      PRODUCT_NAME:!this.menuItem ? "" : this.menuItem.PRODUCT_NAME,
      PRODUCT_DESCRIPTION:!this.menuItem ? "" : this.menuItem.PRODUCT_DESCRIPTION,
      PRODUCT_PRICE:!this.menuItem ? "" : this.menuItem.PRODUCT_PRICE,
      PRODUCT_MENU_TYPE:!this.menuItem ? "" : this.menuItem.PRODUCT_MENU_TYPE,
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
          <div className={classes.delete}>
              <Button variant="contained" color="secondary" size='large'  onClick={() => {
              }}>
                  Delete
              </Button>
          </div>
      </form>
    );
  }
}

AddMenuItemColumn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddMenuItemColumn);