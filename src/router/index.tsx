import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dudar } from "../components/screens/Dudar";
import { About } from "../components/screens/About";
import { routes } from "./routes";
import { LoginPage } from "../components/screens/LoginPage";
import Admin from "../components/Admin";
import EDuda from "../components/screens/Eduda";
import { Playlists } from "../components/Playlist";
import { ArticlesList } from "../components/Articles/ArticlesList";
import BlogAdmin from "../components/Articles/Admin/BlogAdmin";
import BlogUpdate from "../components/Articles/Admin/BlogUpdate";
import BlogAdminList from "../components/Articles/Admin/BlogAdminList";
import ArticlePage from "../components/Articles/ArticlePage";
import { ContactsPage } from "../components/screens/Contacts";
import { LearningBook } from "../components/LearningBook";

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
        <Route path={routes.articleAdminList}>
          <BlogAdminList />
        </Route>
        <Route path={routes.learningBook}>
          <LearningBook />
        </Route>
        <Route path={routes.articleUpdate}>
          <BlogUpdate />
        </Route>
        <Route path={routes.articleAdmin}>
          <BlogAdmin />
        </Route>
        <Route path={`${routes.article}/:lang/:slug`}>
          <ArticlePage />
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
