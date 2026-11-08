import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import './ScrollToTopButton.css';

const SHOW_AFTER_PX = 320;

export const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`scroll-top-btn${visible ? ' scroll-top-btn--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Volver al inicio"
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp size={22} aria-hidden />
    </button>
  );
};
