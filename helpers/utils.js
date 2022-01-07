const UTF8_FORMAT = 'utf8';
const BASE64_FORMAT = 'base64';

export const formatAddress = (address) => {
  return address.slice(0, 5) + '...' + address.slice(-4);
};

export function decodeData(encodedData) {
  const bufferedContent = Buffer.from(encodedData, BASE64_FORMAT);
  return JSON.parse(bufferedContent.toString(UTF8_FORMAT));
}

export function encodeData(decodedData) {
  const updatedContent = Buffer.from(
    JSON.stringify(decodedData, null, 2),
    UTF8_FORMAT
  );
  return updatedContent.toString(BASE64_FORMAT);
}

export function marshallAddressEntry({ name, address, discordId }) {
  return {
    name,
    createdAt: Date.now(),
    address,
    discordId,
  };
}

export function marshallFileUpdate({ message, content, sha }) {
  return JSON.stringify({
    message,
    content,
    sha,
  });
}

export function marshallUser({ username, platforms }) {
  return {
    username,
    aliases: platforms,
  };
}
