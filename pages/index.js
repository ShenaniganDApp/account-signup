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

  const { connect, address } = useWeb3Modal();
  const { data: session, status } = useSession({ required: true });
  console.log('session: ', session);
  const { addressbook } = useAddressbook(session.user.id);

  const onSubmit = async (ethAddress, githubUsername) => {
    e.preventDefault();
    const newEntry = { discordId: session.user.id, address, githubUsername };
    writeAddressbook(newEntry, addBookEntry);
  };

  const brightIDMessage = session.hasBrightId
    ? '✅ BrightID is Connected'
    : '❌ Go back to Discord and connect BrightID';

  // useEffect(() => {
  //   async function fetchData() {
    
  //   }
  //   fetchData();
  // }, [session]);

  useEffect(() => {
    addressbook.find((addBookEntry) => {
      session.user.id === addBookEntry.discordId
        ? setAddBookEntry(addBookEntry)
        : null;
    });
  }, [session, addressbook]);

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
                {address && address != addBookEntry.address ? (
                  `New Address: ${formatAddress(address)}`
                ) : (
                  <button
                    className="w-60 text-white p-2 text-xl font-bold bg-cornflowerblue rounded"
                    onClick={connect}
                  >
                    Link Ethereum to SHE
                  </button>
                )}
                <div className="w-60 p-2">
                  <GithubLoginButton text="Link Github to SHE" />
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
