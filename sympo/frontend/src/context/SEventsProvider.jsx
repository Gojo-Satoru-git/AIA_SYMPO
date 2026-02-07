import { Signeventscontext } from './SEvents.context';

const SignEventProvider = ({ children }) => {
  const workshops = [
    {
      title: 'Hackathon',
      id: '16',
      image:
        'https://firebasestorage.googleapis.com/v0/b/tekhora-26.firebasestorage.app/o/hackathon.webp?alt=media&token=4b4072c9-7ea6-439e-825b-19c86e85c3fb',
      backside: './assets/Billy.webp',
      description: 'This is Hackathon',
      category: 'Technical',
      isSignature: true,
      miniTeamSize: '2',
      teamSize: '4',
      date: '2026-02-21',
      time: '11:00 AM',
      rules: 'Rules',
      fees: 499,
      contact: {
        name1: 'Sandheep',
        phone1: '9884793806',
        name2: 'Rahul',
        phone2: '9159812736',
      },
      //fallbackImage: './assets/fall_back/hackathon.webp',
    },
    {
      title: 'MUN Debate',
      id: '17',
      image:
        'https://firebasestorage.googleapis.com/v0/b/tekhora-26.firebasestorage.app/o/hackathon.webp?alt=media&token=4b4072c9-7ea6-439e-825b-19c86e85c3fb',
      backside: './assets/Billy.webp',
      description: 'This is MUN Debate',
      category: 'Technical',
      isSignature: true,
      miniTeamSize: '2',
      teamSize: '4',
      date: '2026-02-21',
      time: '11:00 AM',
      rules: [
        'Each team must consist of 2 participants',
        'Use of mobile phones or internet is strictly prohibited',
        'Any malpractice leads to immediate disqualification',
        'Judges and coordinators’ decisions are final',
        'Teams must report 5 minutes before the scheduled time',
        'Rules may be modified by organizers if required',
      ],
      fees: 499,
      contact: {
        name1: 'Sandheep',
        phone1: '9884793806',
        name2: 'Rahul',
        phone2: '9159812736',
      },
      //fallbackImage: './assets/fall_back/hackathon.webp',
    },
    {
      title: 'Paper Presentation',
      id: '18',
      image:
        'https://firebasestorage.googleapis.com/v0/b/tekhora-26.firebasestorage.app/o/paper_presentation.webp?alt=media&token=0cb3bc8a-db71-48c1-bf5b-81c95e6f2530',
      backside: './assets/Robin.webp',
      description: 'This is Paper presentation',
      category: 'Technical',
      isSignature: true,
      date: '2026-02-21',
      time: '11:00 AM',
      rules: 'Rules',
      miniTeamSize: '2',
      teamSize: '2',
      fees: 199,
      contact: {
        name1: 'Poorna Prakash',
        phone1: '8838730894',
        name2: 'Nitin Pranav',
        phone2: '9123591494',
      },
      //fallbackImage: './assets/fall_back/paper_presentation.webp',
    },
  ];
  return <Signeventscontext.Provider value={workshops}>{children}</Signeventscontext.Provider>;
};
export default SignEventProvider;
