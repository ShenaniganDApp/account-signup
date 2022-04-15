import { formatAddress } from '../helpers/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
export const EthereumSign = ({
  address,
  signature,
  signMessage,
  isVerifiedAddress,
}) => (
  <div className="flex justify-center w-60 p-2">
    {!address ? (
      <ConnectButton />
    ) : (
      <button
        className=" w-[calc(100%-10px)] h-12 px-3.5 text-white p-2 text-xl disabled:bg-darkpurple  bg-cornflowerblue rounded shadow-md font-button font-bold"
        onClick={async () => await signMessage()}
        disabled={isVerifiedAddress}
      >
        {signature && isVerifiedAddress
          ? `✅ ${formatAddress(address)}`
          : `Link ${formatAddress(address)}`}
      </button>
    )}
  </div>
);
