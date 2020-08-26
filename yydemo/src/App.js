import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'antd/dist/antd.css'
import { Switch, Route, Redirect } from 'react-router-dom'
import { adminRoute } from './routes/routers'
import Frame from './components/frame/Index'
import { isLogined } from './utils/auth'
function App(props) {
  return (
    isLogined() ?
      <Frame>
        <Switch>
          {adminRoute.map((route) => {
            return <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              render={(props) => {
                return <route.component  {...props} />
              }} />
          })}
        
          <Redirect from='/admin' to={adminRoute[0].path} />
        </Switch>
      </Frame>
      : <Redirect to='/' />
  );
}
export default App;
