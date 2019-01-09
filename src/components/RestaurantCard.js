import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteCrossIcon from '@material-ui/icons/Clear';


const styles = {
  card: {
    maxWidth: 275,
    minWidth: 255,
    margin:10
  },
  button: {
    margin:20
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  delete: {
    position: 'relative',
    fontSize:35,
    color: 'red',
    cursor:'pointer'
  },
  deleteContainer: {
    display:'flex',
    justifyContent:'flex-end'
  }
};


class RestaurantCard extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { classes } = this.props;

    const restaurant = this.props.restaurant

    return (
      <Card className={classes.card}>
        <div className={classes.deleteContainer}>
        <DeleteCrossIcon color={'primary'}  className={classes.delete} onClick={this.props.onDelete}/>
        </div>
        <CardContent>
          <Typography variant="headline" component="h2">
            {restaurant.RESTAURANT_NAME}
          </Typography>
          <Typography variant="subtitle1" component="h2">
            {restaurant.RESTAURANT_STREET} {restaurant.RESTAURANT_POSTCODE}
          </Typography>
          <Typography variant="subtitle1" component="h2">
            {restaurant.RESTAURANT_CITY}
          </Typography>
          <Typography variant="subtitle2" component="h2">
            Tables : {restaurant.RESTAURANT_TABLE_COUNT}
          </Typography>
          <Typography variant="subtitle2" component="h2">
            Pre-book enabled : {restaurant.RESTAURANT_PRE_BOOK == 1 ? "Yes" : "No"}
          </Typography>
        </CardContent>
        <div id='restaurantCardButtonContainer'>
          <Button variant="contained" color="primary"  className={classes.button} onClick={() => {
            this.props.router.push('/addMenu', { restaurantId: restaurant.RESTAURANT_ID})
          }}>
            Add menu
          </Button>
          <Button variant="contained" color="primary"  className={classes.button}>
            Edit
          </Button>
          <Button variant="contained" color="primary"  className={classes.button} onClick={() => {
            this.props.router.push('/viewOrders', { restaurantId: restaurant.RESTAURANT_ID})
          }}>
            View orders
          </Button>
        </div>
      </Card>
    );
  }
}


RestaurantCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RestaurantCard);