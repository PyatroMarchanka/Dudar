import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dudar } from "../components/screens/Dudar";
import { About } from "../components/screens/About";
import { Start } from "../components/screens/Start";
import { routes } from "./routes";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path={routes.about}>
          <About />
        </Route>
        <Route path={routes.app}>
          <Dudar />
        </Route>
        <Route path={routes.start}>
          <Start />
        </Route>
        <Route exact path={routes.main}>
          <Dudar />
        </Route>
      </Switch>
    </Router>
  );
};
