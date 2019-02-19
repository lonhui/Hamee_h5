import React, { Component } from 'react';
import {HashRouter, Route, Switch} from'react-router-dom';
import {routers} from './Router/router'
import 'antd/dist/antd.css';
class App extends Component {
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
