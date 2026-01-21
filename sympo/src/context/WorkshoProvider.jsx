import React from 'react';
// eslint-disable-next-line no-unused-vars
import { workshopcontext } from './workshop.context';

function WorkshoProvider({ children }) {
  const Workshops = [
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
  ];
  return <workshopcontext.Provider value={Workshops}>{children}</workshopcontext.Provider>;
}

export default WorkshoProvider;
