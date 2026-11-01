import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { adminMelodiesApi, AdminMelodyPage } from '../../api/adminMelodies';
import { ReviewStatus } from '../../api/melodies';
import { routes } from '../../router/routes';
import { ReviewBadge } from '../MyMelodies/ReviewBadge';
import { Table, TableWrapper } from './SongList';

const titles: Record<ReviewStatus, string> = {
  pending: 'Melodies for review',
  approved: 'Approved melodies',
  rejected: 'Rejected melodies',
  draft: 'Drafts',
};

const formatDate = (date?: string) => (date ? new Date(date).toLocaleString() : '');

// Melodies users sent in, by review status: /admin/review (pending), /admin/review/approved, /admin/review/rejected
export const ReviewList = () => {
  const params = useParams<{ status?: string }>();
  const status: ReviewStatus = (['approved', 'rejected'] as string[]).includes(params.status ?? '')
    ? (params.status as ReviewStatus)
    : 'pending';
  const [page, setPage] = useState(0);
  const [data, setData] = useState<AdminMelodyPage | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setPage(0);
  }, [status]);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setError(undefined);
    adminMelodiesApi
      .list(status, page)
      .then((result) => !cancelled && setData(result))
      .catch((err) => {
        console.log(err);
        if (!cancelled) setError(err?.response?.data?.error || 'Could not load melodies');
      });
    return () => {
      cancelled = true;
    };
  }, [status, page]);

  const pages = data ? Math.ceil(data.total / data.pageSize) : 0;

  return (
    <>
      <h1>{titles[status]}</h1>
      {error ? (
        <p>{error}</p>
      ) : !data ? (
        <p>Loading...</p>
      ) : !data.melodies.length ? (
        <p>Nothing here.</p>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Added by</th>
                <th>Format</th>
                <th>Sent</th>
                {status !== 'pending' && <th>Reviewed</th>}
                <th>Play</th>
              </tr>
            </thead>
            <tbody>
              {data.melodies.map((melody) => (
                <tr key={melody.id}>
                  <td>
                    <Link to={`${routes.adminMelody}/${melody.id}`}>{melody.title}</Link>{' '}
                    <ReviewBadge status={melody.reviewStatus ?? 'draft'} />
                  </td>
                  <td>
                    <Owner>
                      {melody.ownerPicture && <Avatar src={melody.ownerPicture} alt="" referrerPolicy="no-referrer" />}
                      <span>
                        {melody.ownerName ?? 'Unknown user'}
                        {melody.ownerEmail && <Email>{melody.ownerEmail}</Email>}
                      </span>
                    </Owner>
                  </td>
                  <td>{melody.format === 'roll' ? 'Editor' : 'ABC'}</td>
                  <td>{formatDate(melody.submittedAt)}</td>
                  {status !== 'pending' && (
                    <td>
                      {formatDate(melody.reviewedAt)}
                      {melody.reviewedByName && <Email>by {melody.reviewedByName}</Email>}
                    </td>
                  )}
                  <td>
                    <a href={`${routes.app}/${routes.melody}/${melody.id}`} target="_blank" rel="noopener noreferrer">
                      open
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
      {pages > 1 && (
        <Pager>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            {page + 1} / {pages}
          </span>
          <button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </Pager>
      )}
    </>
  );
};

const Owner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;

const Email = styled.small`
  display: block;
  color: #777;
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;
