import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dudar } from "../components/screens/Dudar";
import { About } from "../components/screens/About";
import { Start } from "../components/screens/Start";
import { routes } from "./routes";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={routes.main}>
          <About />
        </Route>
        <Route exact path={routes.start}>
          <Start />
        </Route>
        <Route exact path={routes.app}>
          <Dudar />
        </Route>
      </Switch>
    </Router>
  );
};
