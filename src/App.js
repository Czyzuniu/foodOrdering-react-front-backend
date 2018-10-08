import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import OrderCard from './components/OrderCard'



class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      orders:[]
    }
  }

  componentDidMount() {
    fetch('/orders').then(res => res.json())
        .then(data => this.setState({
            orders:JSON.parse(data)
        }))
  }

  render() {
    return (
      <div className="App">
          {this.state.orders.map((order) => {
              return <OrderCard orderId={order.orderId}></OrderCard>
          })}
      </div>
    );
  }
}

export default App;
