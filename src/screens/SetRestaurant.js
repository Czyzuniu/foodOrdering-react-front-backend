import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from "../components/Utils";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Select from "@material-ui/core/Select/Select"
import InputLabel from "@material-ui/core/InputLabel/InputLabel"
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

class SetRestaurant extends Component {

  constructor(props) {
    super(props)

    this.restaurant = null

    if (this.props.history.location.state) {
      this.restaurant = this.props.history.location.state.restaurant
    }

    if (this.restaurant) {
        this.state = {
            restaurantId:this.restaurant.RESTAURANT_ID,
            restaurantName:this.restaurant.RESTAURANT_NAME,
            restaurantTableCount:this.restaurant.RESTAURANT_TABLE_COUNT,
            allowPreBook:this.restaurant.RESTAURANT_PRE_BOOK,
            street:this.restaurant.RESTAURANT_STREET,
            city:this.restaurant.RESTAURANT_CITY,
            postalCode:this.restaurant.RESTAURANT_POSTCODE,
            categories:this.restaurant.RESTAURANT_CATEGORIES.split(',')

        }
    } else {
        this.state = {
          restaurantName:'',
          restaurantTableCount:'',
          allowPreBook:false,
          street:'',
          city:'',
          postalCode:'',
          categories:[],
          selectedCategories:[]
        }
    }
  }


  componentDidMount() {
    Utils.getFoodCategories().then((data) => {
      this.setState({
        categories:data
      })
    })
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

    editRestaurant = () => {
        Utils.postData(`${Utils.endPoint}/editRestaurant`, this.state).then((res) => {
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
              {this.restaurant ? `Edit ${this.restaurant.RESTAURANT_NAME}` : 'Register your restaurant'}
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

            <div style={{display:'flex', flexDirection:'column'}}>
              <InputLabel style={{alignSelf:'flex-start',marginLeft:80}}>Food cuisines</InputLabel>
              <Select
                multiple
                value={this.state.selectedCategories}
                className={classes.inputCenter}
                onChange={(event) => {
                  this.setState({ selectedCategories: event.target.value });
                }}
              >
                {this.state.categories.map(c => (
                  <MenuItem key={c.CATEGORY_ID} value={c.CATEGORY_ID}>
                    {c.CATEGORY_DESCRIPTION}
                  </MenuItem>
                ))}
              </Select>
            </div>
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

            {!this.restaurant &&
                <Button variant="contained" color={"primary"} className={classes.button} onClick={this.addRestaurant}>
                    Create
                </Button>
            }

            {this.restaurant &&
                <Button variant="contained" color={"primary"} className={classes.button} onClick={this.editRestaurant}>
                    Edit
                </Button>
            }
        </Paper>
      </div>
    );
  }
}


SetRestaurant.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SetRestaurant);
