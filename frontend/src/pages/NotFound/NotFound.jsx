import React, { useEffect, useState } from 'react';
import styles from './NotFound.module.css';
import notFoundImage from '../../assets/notFoundImage.png';
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

    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div className={styles.foundWrapper}>
      <div>
        <section>
          <h1>404 - Page not found</h1>
          <p>
            You'll be redirected to the homepage in {timeLeft}{' '}
            {timeLeft > 1 ? 'seconds' : 'second'}.
          </p>
          <p>
            You won't wait? Click{' '}
            <button onClick={() => navigate('/')}>here</button>
          </p>
        </section>
      </div>
    </div>
  );
}
