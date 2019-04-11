import React, { Component } from 'react';

import './App.css';
import { BrowserRouter, Route, Link, Redirect} from "react-router-dom";
import Home from './screens/Home'
import Restaurants from './screens/Restaurants'
import Register from './screens/Register'
import TopBar from "./components/TopBar";
import CircularProgress from '@material-ui/core/CircularProgress';
import Login from "./screens/Login";
import Utils from './components/Utils'
import setRestaurant from "./screens/SetRestaurant";
import AddMenu from "./screens/AddMenu";
import ViewOrders from "./screens/ViewOrders";
import ViewMenu from "./screens/ViewMenu";
import SetOpeningTimes from "./screens/SetOpeningTimes";
import EditRestaurant from "./screens/EditRestaurant";
import AddPhotos from "./screens/AddPhotos";
import Reviews from "./screens/Reviews";
import ViewPhoto from "./screens/ViewPhoto";
import Profile from "./screens/Profile";




class App extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    if (localStorage.getItem('foodApp') == "null" || localStorage.getItem('foodApp') == null ) {
      localStorage.setItem('foodApp', JSON.stringify(
        {
          sessionId:null,
          authenticatedUser:{}
        }
      )
      )
    }
  }

  render() {

    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <TopBar/>
            <Route exact path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <PrivateRoute exact path="/" component={Restaurants} />
            <PrivateRoute exact path="/restaurants" component={Restaurants} />
            <PrivateRoute exact path="/setRestaurant" component={setRestaurant} />
            <PrivateRoute exact path="/addMenu" component={AddMenu} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/viewOrders" component={ViewOrders} />
            <PrivateRoute exact path="/addPhotos" component={AddPhotos} />
            <PrivateRoute exact path="/viewMenu" component={ViewMenu} />
            <PrivateRoute exact path="/setOpeningTimes" component={SetOpeningTimes} />
            <PrivateRoute exact path="/editRestaurant" component={EditRestaurant} />
            <PrivateRoute exact path="/reviews" component={Reviews} />
            <PrivateRoute exact path="/viewPhoto" component={ViewPhoto} />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;

class PrivateRoute extends Component {
  state = {
    loading: true,
    isAuthenticated: false,
  };

  componentWillMount() {
    Utils.isAuthenticated().then((isAuthenticated) => {
      console.log(isAuthenticated, 'imback')
      this.setState({
        isAuthenticated:isAuthenticated,
        loading:false
      })
    })
  }

  render() {
    const { component: Component, ...rest } = this.props

    return (
      <Route
        {...rest}
        render={props =>
          this.state.isAuthenticated ? (
            <Component {...props} />
          ) : (
            this.state.loading ? (
              <div id='content'>
                <CircularProgress color="secondary" />
              </div>
            ) : (
              <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />
            )
          )
        }
      />
    )
  }
}
