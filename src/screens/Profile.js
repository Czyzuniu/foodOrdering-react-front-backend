import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AppContext from '../components/AppContext'
import Typography from "@material-ui/core/Typography/Typography";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import { Link } from 'react-router-dom'
import Utils from '../components/Utils'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    justifyContent:'center',
    height:400
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
    marginBottom: 'auto',
    marginTop: 10,
  },

});

class Register extends Component {

  constructor(props) {
    super(props)

    this.state = {
      emailAddress: '',
      firstName: '',
      lastName: '',
      phone: '',
      id:'',
    }
  }


  componentDidMount() {
    const authenticatedUser = JSON.parse(localStorage.getItem('foodApp')).authenticatedUser

    this.setState({
      firstName:authenticatedUser.firstName,
      lastName:authenticatedUser.lastName,
      phone:authenticatedUser.phoneNumber,
      emailAddress:authenticatedUser.emailAddress,
      id:authenticatedUser.id
    })
  }

  editDetails = () => {
    Utils.postData(`${Utils.endPoint}/editProfile`,this.state).then((data) => {
      localStorage.setItem('foodApp', JSON.stringify({
        'authenticatedUser': data.authenticatedUser
      }))
      this.props.history.push('/restaurants')
    }).catch((err) => {
      console.log(err)
      alert(err)
    })
  }

  render() {
    const {classes} = this.props;

    return (
      <div id="content">
        <Paper elevation={3} className={classes.root}>
          <Typography variant="title" color="inherit" noWrap>
            Edit details
          </Typography>

          <div>
            <TextField
              id="firstName-input"
              label="First Name"
              className={classes.input}
              value={this.state.firstName}
              type='text'
              margin="normal"
              onChange={(e) => {
                this.setState({
                  'firstName':e.target.value
                })
              }}
            />

            <TextField
              id="lastName-input"
              label="Last name"
              className={classes.input}
              value={this.state.lastName}
              type='text'
              margin="normal"
              onChange={(e) => {
                this.setState({
                  'lastName':e.target.value
                })
              }}
            />
          </div>

          <TextField
            id="phone-input"
            label="Phone"
            className={classes.inputCenter}
            value={this.state.phone}
            type='text'
            margin="normal"
            onChange={(e) => {
              this.setState({
                'phone':e.target.value
              })
            }}
          />

          <TextField
            id="email-addr-input"
            label="Email Address"
            className={classes.inputCenter}
            value={this.state.emailAddress}
            onChange={(e) => {
              this.setState({
                'emailAddress':e.target.value
              })
            }}
            margin="normal"
          />

          <Button variant="contained" color={"primary"} className={classes.button} onClick={this.editDetails}>
            Edit details
          </Button>
        </Paper>
      </div>
    );
  }
}


Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Register);
