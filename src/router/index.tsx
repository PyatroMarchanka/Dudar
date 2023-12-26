import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dudar } from "../components/screens/Dudar";
import { About } from "../components/screens/About";
import { Start } from "../components/screens/Start";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/app">
          <Dudar />
        </Route>
        <Route path="/start">
          <Start />
        </Route>
        <Route path="/">
          <Dudar />
        </Route>
      </Switch>
    </Router>
  );
};
