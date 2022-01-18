// fetch json cata from the github endpoint 'https://raw.githubusercontent.com/ShenaniganDApp/scoreboard/master/data/addressbook.json' then filter the array for a discordId

import fetch from 'node-fetch';
import { useEffect, useState } from 'react';

const useAddressbook = () => {
  const [addressbook, setAddressbook] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAddressbook = async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/ShenaniganDApp/scoreboard/master/data/addressbook.json'
      );
      const json = await response.json();
      console.log('json: ', json);

      setAddressbook(json);
      setIsLoading(false);
    };

    fetchAddressbook();
  }, []);

  return { addressbook, isLoading };
};

export default useAddressbook;
