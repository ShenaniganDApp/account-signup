// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const FormData = require('form-data');

export default async function handler(req, res) {
  const { code } = await JSON.parse(req.body);

  const data = new FormData();

  data.append('client_id', process.env.GITHUB_CLIENT_ID);
  data.append('client_secret', process.env.GITHUB_CLIENT_SECRET);
  data.append('code', code);
  data.append('redirect_uri', process.env.NEXTAUTH_URL + '/api/github');

  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: 'POST',
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      const access_token = params.get('access_token');
      console.log('access_token: ', access_token);

      // Request to return data of a user that has been authenticated
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });
}
