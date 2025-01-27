import React, { useEffect, useState } from 'react';
import styles from './NotFound.module.css';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);
  return (
    <div className={styles.foundWrapper}>
      <section className={styles.notFoundSection}>
        <h1 className={styles.notFoundHeading}>404 - Page not found</h1>
        <h2>👻 Wow, congratulations! You've discovered a ghost page. 🕸️</h2>
        <p>
          Too bad it doesn't actually exist - maybe a spirit ran off with the
          URL. But hey, just click
          <button onClick={() => navigate('/')}>here</button> and haunt your way
          back to the homepage like a regular person.
        </p>
        <p>
          Or just wait {timeLeft} {timeLeft > 1 ? 'seconds' : 'second'}... If
          you dare.
        </p>
      </section>
    </div>
  );
}
