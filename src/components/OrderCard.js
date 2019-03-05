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
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField/TextField";
import Draggable, {DraggableCore} from 'react-draggable';


const styles = {
    card: {
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

        const {order,socket} = this.props

        this.state = {
          order:order,
          status:order.orderStatus,
          declineDialogOpen:false,
          reason:''
        }

        this.socket = socket

    }

    confirmOrder = () => {
        this.socket.emit('confirmOrder', {toSocketId:this.state.order.from, orderId:this.state.order.orderId, status:'CONFIRMED'})
    }

    declineOrder = () => {
        this.socket.emit('declineOrder', {toSocketId:this.state.order.from, orderId:this.state.order.orderId, status:'DECLINED',
          reason:this.state.reason})
        this.setState({
          declineDialogOpen:false
        })
    }

    completeOrder = () => {
      this.socket.emit('completeOrder', {toSocketId:this.state.order.from, orderId:this.state.order.orderId, status:'COMPLETED'})
    }

    declineDialogClose = () => {
      this.setState({
        declineDialogOpen:false
      })
    }

    render() {
        const { classes, order } = this.props;
        return (
          <Draggable >
            <Card className={classes.card}>
              <CardContent style={{flex:1,display: 'flex',flexDirection:'column',justifyContent: 'space-evenly'}}>
                <Typography variant="headline" component="h2">
                  Order Number : {order.orderId}
                </Typography>
                <Typography variant="subtitle2" component="h2">
                  Order Status : {this.state.status.desc}
                </Typography>
                <Typography variant="subtitle2" component="h2">
                  Table : {order.orderTable}
                </Typography>
                <List>
                  {order.orderItems.map((item) => {
                    return (
                      <ListItem>
                        <Avatar className={classes.blackAvatar}>
                          {item.PRODUCT_MENU_TYPE == 'MT_DRINK' ?  <LocalDrinkIcon color={'primary'}/> : <RestaurantIcon color={'primary'}/>}
                        </Avatar>
                        <ListItemText primary={item.PRODUCT_NAME} secondary={
                          <div>
                            <p>Quantity: {item.QUANTITY}</p>
                            {item.ORDER_CUSTOM &&
                            <p>Customizations: {item.ORDER_CUSTOM}</p>
                            }
                          </div>
                        } />
                      </ListItem>
                    )
                  })}
                  <Divider/>
                </List>
                <Typography variant="caption" component="h2">
                  Total Price : £ {order.totalPrice.toFixed(2)}
                </Typography>
              </CardContent>

              {this.state.status.id === 'WTFORCONF' ? (
                <div>
                  <Button variant="contained" color="primary" className={classes.button} onClick={this.confirmOrder}>
                    Confirm order
                  </Button>
                  <Button variant="contained" color="primary" className={classes.button} onClick={() => this.setState({declineDialogOpen:true})}>
                    Decline order
                  </Button>
                </div>
              ) : (
                <div>
                  <Button variant="contained" color="primary" className={classes.button} onClick={this.completeOrder}>
                    Complete order
                  </Button>
                </div>
              )
              }
              <div>
                <Dialog
                  open={this.state.declineDialogOpen}
                  onClose={this.declineDialogClose}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">Decline order</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Please pass a reason, for declining the order back to the customer
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="reason"
                      label="Reason"
                      type="text"
                      value={this.state.reason}
                      onChange={(e) => {this.setState({reason:e.target.value})}}
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.declineDialogClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={this.declineOrder} color="primary">
                      Decline order
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </Card>
          </Draggable>
        );
    }
}


OrderCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderCard);
