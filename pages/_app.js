import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';
import Auth from '../components/Auth';
import '@rainbow-me/rainbowkit/styles.css';

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, chain } from 'wagmi';
import { providers } from 'ethers';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // Auto connect to the cached provider

  const infuraId = process.env.INFURA_ID;

  const provider = ({ chainId }) => {
    new providers.JsonRpcProvider(chainId);
  };

  const chains = [
    { ...chain.mainnet, name: 'Ethereum' },
    { ...chain.gnosis, name: 'Gnosis' },
  ];

  const wallets = getDefaultWallets({
    chains,
    infuraId,
    appName: 'SHE Scoreboard Signup',
    jsonRpcUrl: ({ chainId }) =>
      chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
      chain.mainnet.rpcUrls[0],
  });

  const connectors = connectorsForWallets(wallets);

  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <RainbowKitProvider chains={chains}>
            <WagmiProvider
              autoConnect
              connectors={connectors}
              provider={provider}
            >
              <Component {...pageProps} />
            </WagmiProvider>
          </RainbowKitProvider>
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

export default MyApp;
