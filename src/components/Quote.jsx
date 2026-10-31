import { useEffect, useState } from 'react';
import { QUOTES } from '../lib/constants.js';

export default function Quote() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * QUOTES.length));

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), 9000);
    return () => clearInterval(id);
  }, []);

  return (
    <blockquote className="quote" key={index}>
      “{QUOTES[index]}”
    </blockquote>
  );
}
