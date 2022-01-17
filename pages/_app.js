import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';
import Auth from '../components/Auth';
import useWeb3Modal from '/hooks/useWeb3Modal';
import { useEffect } from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const { web3Modal, connect } = useWeb3Modal();
  // Auto connect to the cached provider
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect();
    }
  }, [connect, web3Modal]);

  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

export default MyApp;
