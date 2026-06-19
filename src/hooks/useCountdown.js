import { useState, useEffect, useRef } from 'react';


const useCountdown = (expiresAt) => {
  const calcRemaining = () => {
    if (!expiresAt) return 0;
    return Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
  };

  const [seconds, setSeconds] = useState(calcRemaining);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!expiresAt) return;

    setSeconds(calcRemaining());

    intervalRef.current = setInterval(() => {
      const remaining = calcRemaining();
      setSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [expiresAt]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return { seconds, isExpired: seconds <= 0, formatted };
};

export default useCountdown;
