
import React from 'react';
import AppContext from "./AppContext";

class Utills {

  constructor() {
    this.endPoint = 'http://localhost:3001'
  }

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
        credentials: 'include',
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

  uploadImg(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: data,
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
        headers: new Headers({'content-type': 'application/json'}),
        credentials: 'include'
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


  navigate = (url) => {
    window.location.href = url
  }

  isAuthenticated() {
    return new Promise((resolve) => {
        this.getData(`${this.endPoint}/checkAuthentication`).then((data) => {
          if (data.status == 'authenticated') {
            resolve(true)
          } else {
            resolve(false)
          }
        })
      })
  }

}

export default new Utills()