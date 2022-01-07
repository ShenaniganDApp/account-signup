// fetch json cata from the github endpoint 'https://raw.githubusercontent.com/ShenaniganDApp/scoreboard/master/data/addressbook.json' then filter the array for a discordId

import fetch from 'node-fetch';
import { useEffect, useState } from 'react';

const useAddressbook = ({ discordId }) => {
  const [addressbook, setAddressbook] = useState([]);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddressbook = async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/ShenaniganDApp/scoreboard/master/data/addressbook.json'
      );
      const json = await response.json();
      json.find((user) => {
        discordId === user.discordId ? setUser(user) : null;
      });
      setAddressbook(json);
      setIsLoading(false);
    };

    fetchAddressbook();
  }, [discordId]);

  return { addressbook, user, isLoading };
};

export default useAddressbook;
