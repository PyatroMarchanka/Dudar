import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { adminMelodiesApi, ReviewCounts } from '../../api/adminMelodies';
import { routes } from '../../router/routes';

// Sent by the review page after an approve or reject, so the counts catch up
export const REVIEW_CHANGED_EVENT = 'admin-review-changed';

const items = [
  { to: routes.admin, label: 'All songs', exact: true },
  { to: routes.adminReview, label: 'For review', exact: true, count: 'pending' as const },
  { to: `${routes.adminReview}/approved`, label: 'Approved', exact: true, count: 'approved' as const },
  { to: `${routes.adminReview}/rejected`, label: 'Rejected', exact: true, count: 'rejected' as const },
];

// Switches between the admin lists, with how many melodies each review list holds
export const AdminMenu = () => {
  const location = useLocation();
  const [counts, setCounts] = useState<ReviewCounts>();

  useEffect(() => {
    const refresh = () =>
      adminMelodiesApi
        .counts()
        .then(setCounts)
        .catch((error) => console.log(error));
    refresh();
    window.addEventListener(REVIEW_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(REVIEW_CHANGED_EVENT, refresh);
  }, [location.pathname]);

  return (
    <Menu aria-label="Admin lists">
      {items.map((item) => (
        <MenuLink key={item.to} to={item.to} exact={item.exact} activeClassName="active">
          {item.label}
          {item.count && counts && (
            <Count className={item.count === 'pending' && counts.pending ? 'attention' : undefined}>
              {counts[item.count]}
            </Count>
          )}
        </MenuLink>
      ))}
    </Menu>
  );
};

const Menu = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 16px 0 8px;
`;

const MenuLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 18px;
  border: 1px solid #009879;
  color: #009879;
  text-decoration: none;
  font-size: 14px;

  &.active {
    background: #009879;
    color: white;
  }
`;

const Count = styled.span`
  min-width: 18px;
  padding: 1px 6px;
  border-radius: 9px;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.08);

  &.attention {
    background: #e65100;
    color: white;
  }
`;
