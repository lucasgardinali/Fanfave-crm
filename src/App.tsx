
import React from 'react';
import LandingAds from './pages/LandingAds';
import CRM from './pages/CRM';

/**
 * Simple hash-based router.
 * - / or /#landing → LandingAds
 * - /#crm          → CRM
 *
 * In production, replace with React Router or Next.js pages.
 */
function useHash() {
  const [hash, setHash] = React.useState(window.location.hash);
  React.useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHash();
  if (hash === '#crm') return <CRM />;
  return <LandingAds />;
}
