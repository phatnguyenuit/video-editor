import React, { memo, useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

import classes from './styles.module.css';

export const ScrollTopComponent: React.FC<React.PropsWithChildren<
  ScrollTopProps
>> = ({ children, offset = 20 }) => {
  const [visibility, setVisibility] = useState(false);
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollListener = useCallback(() => {
    // When the user scrolls down $offset(px) from the top of the document,
    // show the button
    if (
      document.body.scrollTop > offset ||
      document.documentElement.scrollTop > offset
    ) {
      setVisibility(true);
    } else {
      setVisibility(false);
    }
  }, [offset]);

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  return (
    <button
      className={clsx(classes['ScrollTop-root'], {
        [classes['ScrollTop-invisible']]: visibility === false,
        [classes['ScrollTop-visible']]: visibility,
      })}
      onClick={scrollToTop}
      title="Scroll to top"
    >
      {children || 'Scroll to top!'}
    </button>
  );
};

const ScrollTop = memo(ScrollTopComponent);
ScrollTop.displayName = 'ScrollTop';

export default ScrollTop;

export interface ScrollTopProps {
  offset?: number; // Default 20px;
}
