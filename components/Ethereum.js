import { formatAddress } from '../helpers/utils';
export const EthereumSign = ({ address, signature, signMessage, connect }) => (
  <div className="flex justify-center w-60 p-2">
    <button
      className=" w-[calc(100%-10px)] h-12 px-3.5 text-white p-2 text-xl  bg-cornflowerblue rounded shadow-md font-button font-bold"
      onClick={address ? signMessage : connect}
    >
      {signature
        ? `✅ ${formatAddress(signedAddress)}`
        : address
        ? `Link ${formatAddress(address)}`
        : 'Connect Ethereum'}
    </button>
  </div>
);
