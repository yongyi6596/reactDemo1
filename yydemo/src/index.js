import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom'
import { mainRoute } from './routes/routers'

ReactDOM.render(
    <Router>
      <Switch>
        <Route path='/admin' render={(props) => {
          return <App {...props} />
        }} />
        {mainRoute.map((route) => {
          return <Route
            key={route.path}
            {...route} />
        })}
        <Redirect to='/404' />
      </Switch>
    </Router>
  , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
