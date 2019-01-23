import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from "../components/Utils";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import TimeInput from 'material-ui-time-picker'



const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputCenter: {
    margin: theme.spacing.unit,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '70%'
  },
  input: {
    margin: theme.spacing.unit,
    width: '70%'
  },
  button: {
    margin: 'auto',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 15,
    marginTop: 'auto',
  },
  grid: {
    width: '60%',
  },
});

class RegisterRestaurant extends Component {

  constructor(props) {
    super(props)
    this.state = {
      restaurantName:'',
      restaurantTableCount:'',
      allowPreBook:false,
      street:'',
      city:'',
      postalCode:'',
      openingTime:new Date('2014-08-18T21:11:54'),
      closingTime:new Date('2014-08-18T21:11:54')
    }
  }



  addRestaurant = () => {
    Utils.postData(`${Utils.endPoint}/addRestaurant`, this.state).then((res) => {
      if (res.status == 'success') {
        this.props.history.push('/restaurants')
      } else {
        alert(res)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  render() {

    const {classes} = this.props;

    return (
      <div id='content'>
        <Paper elevation={3} className={classes.root}>

          <Typography variant="title" color="inherit" noWrap>
            Register your restaurant
          </Typography>

          <div>
            <TextField
              id="restaurant-name"
              label="Restaurant name"
              className={classes.inputCenter}
              value={this.state.restaurantName}
              type='text'
              margin="normal"
              onChange={(e) => {
                this.setState({
                  'restaurantName':e.target.value
                })
              }}
            />

            <TextField
              id="restaurant-table-count"
              label="Table count"
              className={classes.input}
              value={this.state.restaurantTableCount}
              type='number'
              margin="normal"
              onChange={(e) => {
                this.setState({
                  'restaurantTableCount':e.target.value
                })
              }}
            />
          </div>

          <div>

            <TextField
              id="restaurant-street"
              label="Street"
              className={classes.input}
              value={this.state.street}
              type='text'
              margin="normal"
              onChange={(e) => {
                this.setState({
                  'street':e.target.value
                })
              }}
            />

            <TextField
              id="restaurant-postCode"
              label="Postal Code"
              className={classes.inputCenter}
              value={this.state.postalCode}
              type='text'
              margin="normal"
              onChange={(e) => {
                this.setState({
                  'postalCode':e.target.value
                })
              }}
            />

            <TextField
              id="restaurant-city"
              label="City"
              className={classes.input}
              value={this.state.city}
              type='text'
              margin="normal"
              onChange={(e) => {
                this.setState({
                  'city':e.target.value
                })
              }}
            />
          </div>

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.allowPreBook}
                  onChange={(e) => {
                    this.setState({
                      'allowPreBook':!this.state.allowPreBook
                    })
                  }
                  }
                  value={this.state.allowPreBook}
                />
              }
              label="Allow Pre-book"
            />
          </div>

          <Button variant="contained" color={"primary"} className={classes.button} onClick={this.addRestaurant}>
            Add your restaurant
          </Button>
        </Paper>
      </div>
    );
  }
}


RegisterRestaurant.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RegisterRestaurant);