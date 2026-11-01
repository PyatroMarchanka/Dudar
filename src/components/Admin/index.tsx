import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { SongEditor } from './SongEditor';
import { SongList } from './SongList';
import { AdminMenu } from './AdminMenu';
import { ReviewList } from './ReviewList';
import { ReviewMelody } from './ReviewMelody';
import { Navbar } from '../global/Navbar';
import { store } from '../../context';
import { routes } from '../../router/routes';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 70px;
  padding: 0 12px;
  font-family: Arial, sans-serif;
`;

const Admin = () => {
  const {
    state: { userData },
  } = useContext(store);

  return (
    <Container>
      <Navbar />
      {userData?._id && !userData.isAdmin ? (
        // Only a hint: the server refuses every admin request from non-admins
        <p>This page is for admins.</p>
      ) : (
        <>
          <AdminMenu />
          <Switch>
            <Route exact path={routes.admin}>
              <SongList />
            </Route>
            <Route exact path={`${routes.adminSong}/:id`}>
              <SongEditor />
            </Route>
            <Route exact path={[routes.adminReview, `${routes.adminReview}/:status`]}>
              <ReviewList />
            </Route>
            <Route exact path={`${routes.adminMelody}/:id`}>
              <ReviewMelody />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
};

export default Admin;
