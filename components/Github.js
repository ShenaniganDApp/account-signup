import { GithubLoginButton } from 'react-social-login-buttons';

export const GithubSign = ({ githubUsername }) => (
  <div className="w-60 p-2">
    {githubUsername ? (
      <GithubLoginButton
        className="m-0 font-button"
        text={`${githubUsername}`}
        align="center"
      />
    ) : (
      <a
        href={`https://github.com/login/oauth/authorize?scope=user&client_id=${process.env.GITHUB_CLIENT_ID}`}
      >
        <GithubLoginButton
          className="m-0 text-center font-button font-bold"
          text="Link Github"
          align="center"
        />
      </a>
    )}
  </div>
);
