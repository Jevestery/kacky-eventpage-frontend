import { Button, Center, useBoolean, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { MdOutlineViewAgenda, MdOutlineViewHeadline } from 'react-icons/md';
import { useQuery } from '@tanstack/react-query';

import ServerCard from './ServerCard';

import mapImage1 from '../../assets/images/Map1.jpg';

import { getDashboardData } from '../../api/api';

const getMapsFinished = () => {
  const mapsFinishedArr = [];
  const getKey = key => key.toString();
  for (let i = 151; i <= 300; i += 1) {
    const randomBoolean = Math.random() < 0.3;
    mapsFinishedArr.push({ [getKey(i)]: randomBoolean });
  }
  return mapsFinishedArr;
};
const mapsFinished = getMapsFinished();

const Dashboard = () => {
  const [isCompactView, setIsCompactView] = useBoolean();

  const [servers, setServers] = useState([]);
  const [counter, setCounter] = useState([0]);

  const { data, isSuccess } = useQuery(['servers'], getDashboardData);

  useEffect(() => {
    if (isSuccess) {
      const timeLeftArr = [];
      const formattedData = [];
      data.serverinfo.forEach((server, index) => {
        timeLeftArr.push(server[`Server ${index + 1}`][1]);
        const formattedServer = {
          serverNumber: (index + 1).toString(),
          mapImageUrl: mapImage1,
          mapNumbers: [
            server[`Server ${index + 1}`][2][0].toString(),
            server[`Server ${index + 1}`][2][1].toString(),
            server[`Server ${index + 1}`][2][2].toString(),
            server[`Server ${index + 1}`][2][3].toString(),
          ],
          serverDifficulty: 'undefined',
          timeLimit: server[`Server ${index + 1}`][2] * 60,
        };
        formattedData.push(formattedServer);
      });
      setServers(formattedData);
      setCounter(timeLeftArr);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    const counterCopy = [...counter];
    const timer = setInterval(() => {
      counter.forEach((element, index) => {
        if (counterCopy[index] > 0) counterCopy[index] -= 1;
        if (counter.length - 1 === index) setCounter(counterCopy);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);

  return (
    <>
      <Center mb={8}>
        <Button
          borderRadius="6px 0 0 6px"
          onClick={setIsCompactView.toggle}
          leftIcon={<MdOutlineViewHeadline />}
          disabled={isCompactView}
        >
          Compact View
        </Button>
        <Button
          borderRadius="0 6px 6px 0"
          onClick={setIsCompactView.toggle}
          rightIcon={<MdOutlineViewAgenda />}
          disabled={!isCompactView}
        >
          Large View
        </Button>
      </Center>
      <VStack spacing={8}>
        {servers.map((server, index) => (
          <ServerCard
            {...server}
            timeLeft={counter[index]}
            mapsFinished={mapsFinished}
            isCompactView={isCompactView}
            key={server.serverNumber}
          />
        ))}
      </VStack>
    </>
  );
};

export default Dashboard;
