import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { GithubLoginButton } from 'react-social-login-buttons';
import CornerTriangle from '../components/UI/CornerTriangle';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession({ required: true });
  console.log('session: ', session);
  return (
    <div className={styles.container}>
      <CornerTriangle origin="origin-top-right" corner={'top-0 left-0'} />
      <CornerTriangle origin="origin-bottom-left" corner={'bottom-0 right-0'} />
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main}`}>
        <div className='flex row justify-around items-center w-60 	'>
          <Image
            className=" rounded-full"
            src={session.user.image}
            width={100}
            height={100}
          />
          <h1 className="text-3xl">{session.user.name}</h1>
        </div>
        <div className="md">
          <GithubLoginButton />
        </div>
        <button onClick={() => signOut()}>End Session</button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

Home.auth = true;