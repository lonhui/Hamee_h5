import React, { Component } from 'react';
import {HashRouter, Route, Switch} from'react-router-dom';
import {routers} from './Router/router'
import 'antd/dist/antd.css';
import './App.css'
import {PublicKey} from './util/encryption'
import {setCookie, getCookie} from './util/Cookie'

class App extends Component {
  componentDidMount(){
    if(getCookie("publicKey")==null||getCookie("publicKey")==''){
      const publicKey = PublicKey()
      setCookie("publicKey",publicKey,1)
    }
  }
  render() {
    return (
      <div className="App">
        <HashRouter>
              <Switch>
                {
                  routers.map((route,index) => {
                      return(
                          <Route 
                          key={index}
                          path={route.path}
                          exact={route.exact}
                          component={route.component}/>
                      )
                  })
                }
              </Switch>
            </HashRouter>
      </div>
    );
  }
}

export default App;
