
import React from 'react';
import AppContext from "./AppContext";

class Utills {

  startLoading() {
    return true
  }

  stopLoading() {
    return false
  }

  toTimestamp(strDate) {
    let datum = Date.parse(strDate);
    return datum / 1000;
  }

  postData(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        headers: new Headers({'content-type': 'application/json'}),
        body: JSON.stringify(data),
      }).then(function (res) {
        console.log(res)
        return res.json()
      }).then((data) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      });
    })
  }

  getData(url) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'GET',
        headers: new Headers({'content-type': 'application/json'})
      }).then(function (res) {
        return res.json()
      }).then((data) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      });
    })
  }

  navigate = (url) => {
    window.location.href = url
  }

  isAuthenticated() {
    console.log('does this ever run?')
    return new Promise((resolve) => {
      let sessionId = localStorage.getItem('sessionId')
      if (sessionId) {
        this.postData('http://localhost:3001/checkAuthentication', {sessionId: localStorage.getItem('sessionId')}).then((data) => {
          console.log('checking session', data)
          if (data.status == 'authenticated') {
            console.log('authenticated kurwo')
            resolve(true)
          } else {
            resolve(false)
          }
        })
      } else {
        console.log('not authenticated kurwo')
        resolve(false)
      }
    })
  }

}

export default new Utills()