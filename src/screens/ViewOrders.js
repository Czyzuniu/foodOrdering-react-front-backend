import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import OrderCard from '../components/OrderCard'
import Typography from "@material-ui/core/Typography/Typography";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import { Link } from 'react-router-dom'
import Utils from "../components/Utils";
import socketIOClient from "socket.io-client";



const styles = theme => ({
  root: {
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent:'flex-start !important',
    alignItems:'flex-start !important'
  },
  input: {
    margin: theme.spacing.unit,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%'
  },
  button: {
    margin: 'auto',
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 'auto',
    marginTop: 10,
  },
  registerLink: {
    fontSize: 14,
    marginTop: 'auto'
  }
});

class ViewOrders extends Component {

  constructor(props) {
    super(props)
    this.state = {
      orders:{}
    }

    this.socket = null
  }

  playOrderSound() {
    this.audio = new Audio('../../img/newOrderNotification.mp3');
    this.audio.play()
  }

  componentDidMount() {
    Utils.getData(`${Utils.endPoint}/orders?id=${this.props.history.location.state.restaurantId}`).then((data) => {
      this.setState({orders:data})
      this.socket = socketIOClient('http://localhost:3001');

      this.socket.on('newOrder', () => {
        Utils.getData(`${Utils.endPoint}/orders?id=${this.props.history.location.state.restaurantId}`).then((data) => {
          this.setState({orders:data})
          this.playOrderSound()
        })
      });

    })
  }

  render() {
    const {classes} = this.props;

    return (
      <div id='content' className={classes.root}>
        {Object.keys(this.state.orders).map((ord) => {
          const order = this.state.orders[ord]
          return <OrderCard order={order.order}></OrderCard>
        })}
      </div>
    );
  }
}


ViewOrders.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewOrders);
