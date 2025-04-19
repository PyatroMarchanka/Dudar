import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dudar } from "../components/screens/Dudar";
import { About } from "../components/screens/About";
import { routes } from "./routes";
import { LoginPage } from "../components/screens/LoginPage";
import Admin from "../components/Admin";
import EDuda from "../components/screens/Eduda";
import { Playlists } from "../components/Playlist";
import BlogList from "../components/Blog/BlogList";
import BlogAdmin from "../components/Blog/Admin/BlogAdmin";
import BlogUpdate from "../components/Blog/Admin/BlogUpdate";
import BlogAdminList from "../components/Blog/Admin/BlogAdminList";
import BlogPost from "../components/Blog/BlogPost";
import { ContactsPage } from "../components/screens/Contacts";

export const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path={routes.admin}>
          <Admin />
        </Route>
        <Route path={routes.contacts}>
          <ContactsPage />
        </Route>
        <Route path={routes.blogAdminList}>
          <BlogAdminList />
        </Route>
        <Route path={routes.blogUpdate}>
          <BlogUpdate />
        </Route>
        <Route path={routes.blogAdmin}>
          <BlogAdmin />
        </Route>
        <Route path={routes.blogPost}>
          <BlogPost />
        </Route>
        <Route path={routes.blog}>
          <BlogList />
        </Route>
        <Route exact path={routes.main}>
          <About />
        </Route>
        <Route path={routes.app}>
          <Dudar />
        </Route>
        <Route path={routes.login}>
          <LoginPage />
        </Route>
        <Route path={routes.playlists}>
          <Playlists />
        </Route>
        <Route path={routes.eduda}>
          <EDuda />
        </Route>
        <Route path={routes.logout}>Logout</Route>
      </Switch>
    </Router>
  );
};
