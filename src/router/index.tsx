import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dudar } from "../components/screens/Dudar";
import { About } from "../components/screens/About";
import { Start } from "../components/screens/Start";
import { routes } from "./routes";
import { LoginPage } from "../components/screens/LoginPage";
import Admin from "../components/Admin";
import EDuda from "../components/screens/Eduda";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path={routes.admin}>
          <Admin />
        </Route>
        <Route exact path={routes.main}>
          <About />
        </Route>
        <Route exact path={routes.start}>
          <Start />
        </Route>
        <Route path={routes.app}>
          <Dudar />
        </Route>
        <Route path={routes.login}>
          <LoginPage />
        </Route>
        <Route path={routes.eduda}>
          <EDuda />
        </Route>
        <Route path={routes.logout}>Logout</Route>
      </Switch>
    </Router>
  );
};
