import {
  decodeData,
  encodeData,
  marshallFileUpdate,
  marshallAddressEntry,
} from './utils';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_ADDRESS_FILE_PATH =
  'ShenaniganDApp/scoreboard/contents/data/addressbook.json';

export function writeAddressbook(newEntry, currentEntry) {
  try {
    const discordId = newEntry.id;
    const address = newEntry.address;
    const github = newEntry.github;
    let userExists = null;
    fetch(`${GITHUB_API_URL}/repos/${GITHUB_ADDRESS_FILE_PATH}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((body) => {
        console.log('body: ', body);
        const encodedContent = body.content;
        const fileSha = body.sha;
        console.log(`fetched file with sha ${fileSha} for user ${name}`);
        // Decode the content from the Github API response, as
        // it's returned as a base64 string.
        const decodedContent = decodeData(encodedContent); // Manipulated the decoded content:
        // First, check if the user already exists.
        if (!!currentEntry) {
          const index = decodedContent.indexOf(currentEntry);
          if (currentEntry.address !== address) {
            decodedContent[index].address = address;
          } else {
            console.log('address already there');
          }
          if (currentEntry.github !== github) {
            decodedContent[index].github = github;
          } else {
            console.log('github already there');
          }
        } else {
          // If the user is not registered, we can now proceed to mutate
          // the file by appending the user to the end of the array.
          const addressEntry = marshallAddressEntry({
            name,
            address,
            discordId,
            github,
          });
          decodedContent.push(addressEntry);
        }

        // We encode the updated content to base64.
        const updatedContent = encodeData(decodedContent);
        // We prepare the body to be sent to the API.
        const marshalledBody = marshallFileUpdate({
          message: 'Update addressbook.json',
          content: updatedContent,
          sha: fileSha,
        });
        // And we update the project.json file directly.
        fetch(`${GITHUB_API_URL}/repos/${GITHUB_ADDRESS_FILE_PATH}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_API_TOKEN}`,
          },
          body: marshalledBody,
        }).then(() => {
          console.log('Updated file on GitHub successfully.');
        });
      });
  } catch (err) {
    console.log(error);
  }
}
