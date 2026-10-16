import { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { mediaQueries } from '../../constants/style';

interface Props {
  title: string;
}

// Titles longer than this get a smaller font so most of them fit on one line
const longTitleLength = 32;

// Shows the song name on at most two lines. When it is cut off, tapping it
// shows the whole name, and the full name is always in the tooltip.
export const SongTitle = ({ title }: Props) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  useLayoutEffect(() => {
    setIsExpanded(false);
  }, [title]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const checkTruncation = () => {
      if (isExpanded) return;
      setIsTruncated(element.scrollHeight > element.clientHeight + 1);
    };

    checkTruncation();
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [title, isExpanded]);

  const canToggle = isTruncated || isExpanded;

  return (
    <Title
      ref={ref}
      title={title}
      className={[title.length > longTitleLength ? 'long' : '', isExpanded ? 'expanded' : '', canToggle ? 'toggle' : '']
        .filter(Boolean)
        .join(' ')}
      onClick={canToggle ? () => setIsExpanded((value) => !value) : undefined}
    >
      {title}
    </Title>
  );
};

const Title = styled.h1`
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Arial,
    sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.25;
  letter-spacing: -0.01em;
  text-align: center;
  color: #2b2321;
  margin: 0;
  width: 100%;
  max-width: 640px;
  overflow: hidden;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.9);

  &.long {
    font-size: 17px;
  }

  &.toggle {
    cursor: pointer;
  }

  &.expanded {
    display: block;
    -webkit-line-clamp: unset;
  }

  @media (max-width: ${mediaQueries.mobile}) {
    font-size: 16px;

    &.long {
      font-size: 14px;
    }
  }
`;
