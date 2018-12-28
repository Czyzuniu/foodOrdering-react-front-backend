import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Utils from "../components/Utils";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";
import RestaurantCard from "../components/RestaurantCard";
import AlertDialogSlide from "../components/AlertDialogSlide";

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
    height:'80%'
  },
  rootInitial: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    height:'15%'
  },
  addButton: {
    height: '80',
    fontSize: 'larger'
  },
  btnContainer: {
    marginTop: 'auto',
    marginBottom: 20
  },
  column:{
    flexDirection:'column'
  }
});

class Restaurants extends Component {

  constructor(props) {
    super(props)
    this.state = {
      restaurants:[],
      loading:true,
      toDelete:""
    }
  }

  componentDidMount() {
    Utils.getData('http://localhost:3001/myRestaurants').then((data) => {
      //check status later
      this.setState({
        restaurants:data.restaurantsData,
        loading:false
      })
    })
  }

  deleteRestaurant() {
    const toDelete = this.state.toDelete
    Utils.postData(`${Utils.endPoint}/deleteRestaurant`, {restaurantId:toDelete.RESTAURANT_ID}).then((res) => {
      this.setState({
        toDelete:""
      })

      let index = this.state.restaurants.indexOf(toDelete)
      console.log(index)

      if (index != null) {
        this.state.restaurants.splice(index, 1)
        this.setState({restaurants: this.state.restaurants})
      }
    })
  }

  render() {

    const {classes} = this.props;
    const renderOwnedRestaurants = (
      <div id='restaurantCardContainer'>
        {this.state.restaurants.map((restaurant) => {
          return <RestaurantCard router={this.props.history} restaurant={restaurant} key={restaurant.RESTAURANT_ID} onDelete={() => {
              this.setState({
                toDelete:restaurant
              })
            }
          }/>
        })
        }
      </div>
    )

    const renderNoRestaurantWindow = (
      <Paper elevation={3} className={classes.rootInitial}>
        <Typography variant="title"  color="inherit" noWrap>
          You currently not own any restaurant
        </Typography>
        <div className={classes.btnContainer}>
          <Button variant="contained" color={"primary"} className={classes.addButton} onClick={() => {
            this.props.history.push('/registerRestaurant')
          }}>
            Add a restaurant
          </Button>
        </div>
      </Paper>
    )

    const progressBar = (
        <CircularProgress color="primary" size={150}/>
    )


    return (
      <div id='content' className={classes.column}>
        <AlertDialogSlide title="confirm deletion" message={`Are you sure you want to delete restaurant : ${this.state.toDelete.RESTAURANT_NAME}`}
        handleYes={() => {this.deleteRestaurant()}} open={this.state.toDelete ? true : false} handleNo={() => {
          this.setState({
            toDelete:""
          })
        }}
        />
        { this.state.restaurants.length ?
          <div>
            <Button variant="contained" color={"primary"} className={classes.addButton} onClick={() => {
              this.props.history.push('/registerRestaurant')
            }}>
              Add a restaurant
            </Button>
          </div> : ""
        }
        {this.state.loading ? progressBar : this.state.restaurants.length ? renderOwnedRestaurants : renderNoRestaurantWindow}
      </div>
    );
  }
}


Restaurants.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Restaurants);