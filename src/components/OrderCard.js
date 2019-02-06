import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import LocalDrinkIcon from '@material-ui/icons/LocalDrink';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import Divider from '@material-ui/core/Divider';



const styles = {
    card: {
        maxWidth: 275,
        maxHeight:400,
        minHeight:400,
        margin:10,
        display:'flex',
        flexDirection:'column'
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
    blackAvatar: {
        color: '#fff',
        backgroundColor: 'black',
    }
};


class OrderCard extends Component {

    constructor(props) {
        super(props)

        const {order} = this.props


        this.state = {
          order:order,
          status:order.orderStatus
        }

    }

    render() {
        const { classes, order } = this.props;
        return (
            <Card className={classes.card}>
                <CardContent style={{flex:1,display: 'flex',flexDirection:'column',justifyContent: 'space-evenly'}}>
                    <Typography variant="headline" component="h2">
                        Order Number : {order.orderId}
                    </Typography>
                    <Typography variant="subtitle2" component="h2">
                      Order Status : {this.state.status}
                    </Typography>
                    <List>
                      {order.orderItems.map((item) => {
                        return (
                          <ListItem>
                            <Avatar className={classes.blackAvatar}>
                              {item.PRODUCT_MENU_TYPE == 'MT_DRINK' ?  <LocalDrinkIcon color={'primary'}/> : <RestaurantIcon color={'primary'}/>}
                            </Avatar>
                            <ListItemText primary={item.PRODUCT_NAME} secondary={`x ${item.QUANTITY}`} />
                          </ListItem>
                        )
                      })}
                        <Divider/>
                    </List>
                    <Typography variant="caption" component="h2">
                        Total Price : £ {order.totalPrice.toFixed(2)}
                    </Typography>
                </CardContent>
              <div>
                <Button variant="contained" color="primary"  className={classes.button} onClick={this.props.onOrderConfirm}>
                  Confirm order
                </Button>
                <Button variant="contained" color="primary"  className={classes.button}>
                  Decline order
                </Button>
              </div>
            </Card>
        );
    }
}


OrderCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderCard);