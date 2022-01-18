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

export default function Home() {
  const [addBookEntry, setAddBookEntry] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [updateSuccessfull, setUpdateSuccessful] = useState(false);
  const [signature, setSignature] = useState('');
  const [signedAddress, setSignedAddress] = useState('');

  const { connect, address, web3Provider } = useWeb3Modal();
  const { data: session, status } = useSession({ required: true });
  const { addressbook } = useAddressbook(session.user.id);

  //check if screen width is less than 550px
  const isMobile = window.innerWidth < 550;

  const canSubmit = (signedAddress && signature) || githubUsername;

  const onSubmit = async (e) => {
    e.preventDefault();
    const newEntry = {
      name: session.user.name,
      discordId: session.user.id,
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
        } catch (error) {
          setIsLoading(false);
        }
      }
    };
    fetchGithub();
  }, []);

  useEffect(() => {
    addressbook.find((addBookEntry) => {
      session.user.id === addBookEntry.discordId
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

  if (isMobile) return <MobileWarning />;

  return (
    <div className={styles.container}>
      <CornerTriangle origin="origin-top-right" corner={'top-0 left-0'} />
      <CornerTriangle origin="origin-bottom-left" corner={'bottom-0 right-0'} />
      <Head>
        <title>Scoreboard Signup</title>
        <meta
          name="description"
          content="Signup to receive weekly SHE Particle Airdrops"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main} bg-white`}>
        <div className="absolute top-10 flex row justify-around items-center w-60	">
          <Image
            className=" rounded-full"
            src={session.user.image}
            width={100}
            height={100}
          />
          <h1 className="text-3xl">{session.user.name}</h1>
        </div>

        <div className="flex row justify-center items-center">
          <Image
            src={'/assets/brightid.jpeg'}
            className="rounded-full"
            width={75}
            height={75}
          />

          <p className="text-2xl w-80 text-center">{brightIDMessage}</p>
        </div>
        {!session.hasBrightId && (
          <div className="flex flex-col justify-center items-center ">
            <p className="text-large">
              You Must Link Your BrightID account via the Discord Bot
            </p>
            <a
              href="https://discord.gg/JTctQhENDe"
              target={'_blank'}
              rel="noreferrer"
            >
              <button className="shadow-md m-20 w-60 text-white p-2 text-xl font-bold bg-discord rounded">
                Back to Discord
              </button>
            </a>
          </div>
        )}

        {session.hasBrightId && (
          <>
            <div className="w-full flex flex-row justify-center items-center">
              <div className="w-1/2 flex flex-col gap-5 justify-center items-start ml-10">
                <AccountBanner src={'/assets/github.png'}>
                  {addBookEntry.github ? addBookEntry.github : '❌ Not Linked'}
                </AccountBanner>
                <AccountBanner src={'/assets/ethereum.png'}>
                  {addBookEntry.address
                    ? `${formatAddress(addBookEntry.address)}`
                    : '❌ Not Linked'}
                </AccountBanner>
              </div>

              <div className="w-1/2 flex flex-col gap-5 flex-row justify-center items-center">
                <div className="w-60 p-2">
                  {githubUsername ? (
                    <GithubLoginButton
                      className="m-0"
                      text={`${githubUsername}`}
                      align="center"
                    />
                  ) : (
                    <a
                      href={`https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.GITHUB_CLIENT_ID}`}
                    >
                      <GithubLoginButton
                        className="m-0 text-center"
                        text="Link Github"
                        align="center"
                      />
                    </a>
                  )}
                </div>
                <div className="flex justify-center w-60 p-2">
                  <button
                    className=" w-[calc(100%-10px)] h-12 px-3.5 text-white p-2 text-xl  bg-cornflowerblue rounded shadow-md"
                    onClick={address ? signMessage : connect}
                  >
                    {signature
                      ? `✅ ${formatAddress(signedAddress)}`
                      : address
                      ? `Link ${formatAddress(address)}`
                      : 'Connect Ethereum'}
                  </button>
                </div>
              </div>
            </div>

            <button
              className={`shadow-md disabled:bg-slate-200 absolute bottom-10 w-60 text-white p-2 text-xl font-bold bg-she-pink rounded`}
              disabled={!canSubmit}
              onClick={onSubmit}
            >
              {updateSuccessfull
                ? '✅'
                : !!addBookEntry
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
