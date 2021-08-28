import React, { useContext, useEffect } from "react";
import Feeds from "./Components/Feeds";
import Header from "./Components/Header";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import Signup from "./Components/Signup";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <Router>
      <AuthProvider>
          <Switch>
            <PrivateRoute path="/" comp={Feeds} exact></PrivateRoute>
            <Route path="/login" component={Login}></Route>
            <Route path="/signup" component={Signup}></Route>
            <Route path="/profile/:id" component={Profile}></Route>
          </Switch>
      </AuthProvider>
    </Router>
  );
}

function PrivateRoute({ comp: Component, ...rest }) {
  let { currentUser } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props => {
        // console.log(props);
        return currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }}
    ></Route>
  );
}

export default App;
