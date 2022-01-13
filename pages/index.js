import Head from 'next/head';
import Image from 'next/image';
import styles from '/styles/Home.module.css';
import { GithubLoginButton } from 'react-social-login-buttons';
import CornerTriangle from '/components/UI/CornerTriangle';
import AccountBanner from '/components/UI/AccountBanner';
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
  const [signature, setSignature] = useState('');

  const { connect, address, web3Provider } = useWeb3Modal();
  const { data: session, status } = useSession({ required: true });
  const { addressbook } = useAddressbook(session.user.id);

  const onSubmit = async (ethAddress, githubUsername) => {
    e.preventDefault();
    const newEntry = { discordId: session.user.id, address, githubUsername };
    writeAddressbook(newEntry, addBookEntry);
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

          setGithubUsername(login);
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
    setSignature(signature);
  };

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
        {session.hasBrightId && (
          <>
            <div className="w-full flex flex-row justify-center items-center">
              <div className="w-1/2 flex flex-col gap-5 justify-center items-start ml-10">
                <AccountBanner src={'/assets/ethereum.png'}>
                  {addBookEntry.address
                    ? `${formatAddress(addBookEntry.address)}`
                    : '❌ Not Linked'}
                </AccountBanner>
                <AccountBanner src={'/assets/github.png'}>
                  {addBookEntry.github ? addBookEntry.github : '❌ Not Linked'}
                </AccountBanner>
              </div>

              <div className="w-1/2 flex flex-col gap-5 flex-row justify-center items-center">
                <div className="flex justify-center w-60 p-2">
                  <button
                    className=" w-[calc(100%-10px)] h-12 px-3.5 text-white p-2 text-xl  bg-cornflowerblue rounded shadow"
                    onClick={address ? signMessage : connect}
                  >
                    {signature
                      ? `✅ ${formatAddress(address)}`
                      : address
                      ? `Link ${formatAddress(address)}`
                      : 'Connect Ethereum'}
                  </button>
                </div>

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
              </div>
            </div>

            <button className="absolute bottom-10 w-60 text-white p-2 text-xl font-bold bg-she-pink rounded">
              {!!addBookEntry ? 'Update Account' : 'Sign Up'}
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
