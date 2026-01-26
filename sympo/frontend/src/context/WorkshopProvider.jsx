import React from 'react';
// eslint-disable-next-line no-unused-vars
import { workshopcontext } from './workshop.context';

function WorkshoProvider({ children }) {
  const OtherEvents = [
    {
      title: 'Workshop1',
      id: '10',
      image: '/workshop1.png',
      backside: './assets/Hopper.png',
      description: 'This is workshop 1',
      date: '2026-02-21',
      time: '11:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Dipakumar',
        phone1: '7639933600',
        name2: 'Ramkumar',
        phone2: '8825538554',
      },
    },
    {
      title: 'Workshop2',
      id: '11',
      image: '/workshop2.png',
      backside: './assets/Hopper.png',
      description: 'This is workshop 2',
      date: '2026-02-21',
      time: '11:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Kamalnath',
        phone1: '9150580147',
        name2: 'Albin Joseph',
        phone2: '9566322365',
      },
    },
    {
      title: 'Paper Presentation',
      id: '12',
      image: '/workshop2.png',
      backside: './assets/Hopper.png',
      description: 'This is Paper presentation',
      date: '2026-02-21',
      time: '11:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Poorna Prakash',
        phone1: '8838730894',
        name2: 'Nitin Pranav',
        phone2: '9123591494',
      },
    },
    {
      title: 'Hackathon',
      id: '13',
      image: '/workshop2.png',
      backside: './assets/Hopper.png',
      description: 'This is Hackathon',
      date: '2026-02-21',
      time: '11:00 AM',
      rules: 'Rules',
      fees: 'Fees',
      contact: {
        name1: 'Sandheep',
        phone1: '9884793806',
        name2: 'Rahul',
        phone2: '9159812736',
      },
    },
  ];
  return <workshopcontext.Provider value={OtherEvents}>{children}</workshopcontext.Provider>;
}

export default WorkshoProvider;
