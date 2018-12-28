import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'
import AppContext from '../components/AppContext'
import Utils from "./Utils";

const styles = theme => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  center: {
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class TopBar extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      anchorEl: null,
      isAuthenticated:false
    };
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  signOut = () => {
    localStorage.removeItem('foodApp')
    Utils.getData('http://localhost:3001/signOut').then((res) => {
      if (res.status == 'success') {
        Utils.navigate('/login')
      }
    })
  }

  componentDidMount() {
    Utils.isAuthenticated().then((isAuthenticated) => {
      this.setState({
        isAuthenticated:isAuthenticated
      })
    })
  }

  render() {
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const { classes } = this.props;

    const authenticatedUser = JSON.parse(localStorage.getItem('foodApp')).authenticatedUser

    const renderDropdownMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}> My Profile</MenuItem>
        <MenuItem onClick={() => {
          Utils.navigate('/restaurants')
        }}> My Restaurants</MenuItem>

        <MenuItem onClick={this.signOut}>Sign out</MenuItem>
      </Menu>
    );

    const renderLoggedOptions = (
      <div className={classes.center}>
        <Typography className={classes.title} variant="subtitle1" color="inherit" noWrap>
          {authenticatedUser.firstName} {authenticatedUser.lastName}
        </Typography>
        <div className={classes.sectionDesktop}>
          <IconButton
            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleProfileMenuOpen}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
        </div>
      </div>
    )

    const renderLoggedOutOptions = (
      <div className={classes.center}>
        <Button variant="contained" color={"primary"} component={Link} to="/" className={classes.button}>
          Sign in
        </Button>
      </div>
    )

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Welcome
            </Typography>
            <div className={classes.grow}/>
            {this.state.isAuthenticated ? renderLoggedOptions : renderLoggedOutOptions}
          </Toolbar>
        </AppBar>
        {renderDropdownMenu}
      </div>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);