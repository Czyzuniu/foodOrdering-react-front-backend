import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Button from '@material-ui/core/Button';

import OrderCard from './components/OrderCard'

import socketIOClient from "socket.io-client";
import { BrowserRouter, Route, Link, Redirect} from "react-router-dom";
import Home from './screens/Home'
import Restaurants from './screens/Restaurants'
import Register from './screens/Register'
import TopBar from "./components/TopBar";
import AppContext from './components/AppContext'
import CircularProgress from '@material-ui/core/CircularProgress';

import Login from "./screens/Login";
import Utils from './components/Utils'
import RegisterRestaurant from "./screens/RegisterRestaurant";
import AddMenu from "./screens/AddMenu";

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
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute exact path="/restaurants" component={Restaurants} />
            <PrivateRoute exact path="/registerRestaurant" component={RegisterRestaurant} />
            <PrivateRoute exact path="/addMenu" component={AddMenu} />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;



// class App extends Component {
//
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       orders:[],
//       response: false,
//       endpoint: "http://localhost:3001"
//     }
//
//     fetch('/orders').then(res => res.json())
//       .then(data => this.setState({
//         orders:JSON.parse(data)
//       }))
//
//
//
//   }
//
//
//   componentDidMount() {
//     const { endpoint } = this.state;
//     const socket = socketIOClient(endpoint);
//     socket.on("connect", data => console.log('hh'));
//   }
//
//   handleClick() {
//     fetch('/login').then(res => res.json())
//   }
//
//   render() {
//     return (
//       <div className="App">
//         {this.state.orders.map((order) => {
//           return <OrderCard orderId={order.orderId}></OrderCard>
//         })}
//       </div>
//     );
//   }
// }

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