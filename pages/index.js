import Head from 'next/head';
import Image from 'next/image';
import styles from '/styles/Home.module.css';
import { GithubLoginButton } from 'react-social-login-buttons';
import CornerTriangle from '/components/UI/CornerTriangle';
import AccountBanner from '/components/UI/AccountBanner';
import { MobileWarning } from '/components/UI/MobileWarning';
import { useSession, signOut } from 'next-auth/react';
import useAddressbook from '/hooks/useAddressbook';
import { useEffect, useState } from 'react';
import useWeb3Modal from '/hooks/useWeb3Modal';
import { formatAddress } from '/helpers/utils';
import { writeAddressbook } from '/helpers/github';
import { GithubSign } from '../components/Github';
import { EthereumSign } from '../components/Ethereum';
import { ProgressBar } from '../components/UI/ProgressBar';
import { emojisplosions } from 'emojisplosion';

export default function Home() {
  const [addBookEntry, setAddBookEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [updateSuccessfull, setUpdateSuccessful] = useState(false);
  const [signature, setSignature] = useState('');
  const [signedAddress, setSignedAddress] = useState('');
  const [index, setIndex] = useState(0);

  const { connect, address, web3Provider } = useWeb3Modal();
  const { data: session, status } = useSession({ required: true });
  const { addressbook } = useAddressbook();

  //check if screen width is less than 550px
  const isMobile = window.innerWidth < 550;

  const canSubmit = (signedAddress && signature) || githubUsername;

  const onSubmit = async (e) => {
    e.preventDefault();
    const newEntry = {
      name: session?.user?.name,
      discordId: session?.user?.id,
      address: signedAddress,
      githubUsername,
    };
    const { address: newAddress, github } = writeAddressbook(
      newEntry,
      addBookEntry
    );
    newAddress && setAddBookEntry({ ...addBookEntry, address: newAddress });
    github && setAddBookEntry({ ...addBookEntry, github });
    setUpdateSuccessful(true);
    emojisplosions({
      emojis: ['✅'],
    });
  };

  const brightIDMessage = session.hasBrightId
    ? '✅ BrightID is Connected'
    : '❌ Go back to Discord and connect BrightID';

  useEffect(() => {
    const fetchGithub = async () => {
      const url = window.location.href;
      const hasCode = url.includes('?code=');

      // If Github API returns the code parameter
      if (hasCode) {
        setIsLoading(true);
        const newUrl = url.split('?code=');

        const requestData = {
          code: newUrl[1],
        };

        const proxy_url = process.env.NEXTAUTH_URL + '/api/github';

        // Use code parameter and other parameters to make POST request to proxy_server
        try {
          const response = await fetch(proxy_url, {
            method: 'POST',
            body: JSON.stringify(requestData),
          });
          const { login } = await response.json();

          login && setGithubUsername('@' + login);
          setIsLoading(false);
          13;
          setIndex(1);
        } catch (error) {
          setIsLoading(false);
        }
      }
    };
    fetchGithub();
  }, []);

  useEffect(() => {
    addressbook.find((addBookEntry) => {
      session?.user?.id === addBookEntry?.discordId
        ? setAddBookEntry(addBookEntry)
        : null;
    });
  }, [session, addressbook]);

  //use web3Provider to sign a message that will confirm the user owns the address
  const signMessage = async () => {
    const signer = web3Provider.getSigner();
    const message = `I own this address: ${address}`;
    const signature = await signer.signMessage(message);
    const signerAddress = await signer.getAddress();
    setSignedAddress(signerAddress);
    setSignature(signature);
  };

  // if (isMobile) return <MobileWarning />;

  const currentPage = (i) => {
    switch (i) {
      case 0:
        return (
          <div className="w-1/2 flex flex-col gap-5 justify-center items-center p-5">
            <AccountBanner src={'/assets/github.png'}>
              {addBookEntry?.github ? addBookEntry.github : '❌ Not Linked'}
            </AccountBanner>
            <GithubSign githubUsername={githubUsername} />
          </div>
        );
      case 1:
        return (
          <div className="w-1/2 flex flex-col gap-5 justify-center items-center p-5">
            <AccountBanner src={'/assets/ethereum.png'}>
              {addBookEntry?.address
                ? `${formatAddress(addBookEntry.address)}`
                : '❌ Not Linked'}
            </AccountBanner>
            <EthereumSign
              address={address}
              signedAddress={signedAddress}
              connect={connect}
              signMessage={signMessage}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.container} justify-around`}>
      <Head>
        <title>Scoreboard Signup</title>
        <meta
          name="description"
          content="Signup to receive weekly SHE Particle Airdrops"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={
          'py-10 flex flex-col lg:flex-row justify-around items-center gap-3'
        }
      >
        <div className="flex row justify-center items-center gap-3">
          <Image
            className="rounded-full"
            src={session.user.image}
            width={100}
            height={100}
          />
          <h1 className="text-3xl font-title text-white">
            {session.user.name}
          </h1>
        </div>
        <div className="flex row justify-center items-center">
          {/* <Image
            src={'/assets/brightid.jpeg'}
            className="rounded-full"
            width={75}
            height={75}
          /> */}

          <p className="text-2xl w-80 text-center text-white font-title">
            {brightIDMessage}
          </p>
        </div>
      </div>

      <main
        className={`${styles.main} bg-glass-white border-glass-border border-2 border-solid rounded-lg justify-center items-center lg:mx-8 md:mx-0 `}
      >
        {!session.hasBrightId && (
          <div className="flex flex-col justify-center items-center ">
            <p className="text-large font-title text-dark-title">
              You Must Link Your BrightID account via the Discord Bot
            </p>
            <a
              href="https://discord.gg/JTctQhENDe"
              target={'_blank'}
              rel="noreferrer"
            >
              <button className="shadow-md m-20 w-60 text-dark-title font-title p-2 text-xl font-bold bg-discord rounded">
                Back to Discord
              </button>
            </a>
          </div>
        )}

        {session.hasBrightId && (
          <>
            <ProgressBar
              progressLabels={['Github', 'Ethereum']}
              setIndex={setIndex}
              index={index}
            />

            <div className="w-full flex flex-row justify-center items-center">
              {currentPage(index)}
            </div>

            <button
              className={`shadow-md disabled:bg-darkpurple absolute bottom-10 w-60 text-white font-button p-2 text-xl font-bold bg-she-pink rounded`}
              disabled={!canSubmit}
              onClick={onSubmit}
            >
              {updateSuccessfull
                ? '✅ Successfully Updated'
                : addBookEntry
                ? 'Update Account'
                : 'Sign Up'}
            </button>

            <a
              href="https://she.energy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Connected by SHE
              {/* <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span> */}
            </a>
          </>
        )}
      </main>
    </div>
  );
}

Home.auth = true;
