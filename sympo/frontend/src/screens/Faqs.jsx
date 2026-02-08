import { useState } from 'react';

const faqs = [
  {
    q: 'How do I register?',
    a: 'Choose any one event pass and click Register. After completing the payment, your pass will be available in your profile under “My Purchase.”',
  },
  {
    q: 'Is on-spot registration available?',
    a: 'Yes, on-spot registration is available for both technical and non-technical events.',
  },
  {
    q: 'For the hackathon, does each individual need to register',
    a: 'No, for the hackathon, only one person from the team need to register',
  },
  {
    q: 'Will  I receive a certificate?',
    a: 'Yes!, certificates will be provided to all registered participants and winners where applicable.',
  },
  {
    q: 'Does every team member need to get a pass?',
    a: 'Yes, for both technical and non-technical events, every team member must buy a pass',
  },
  {
    q: 'Are arts students eligible to participate?',
    a: 'Yes, any student who is interested  can participate in events and workshops.',
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="flex min-h-screen justify-center px-6 py-24 text-white">
      <div className="flex flex-col gap-12 md:flex-row">
        {/*titiele */}
        <div className="flex items-center">
          <h2 className="mb-12 text-center text-3xl uppercase tracking-widest text-primary md:text-4xl">
            Things That Might Be Bugging You Out
          </h2>
        </div>

        {/*FAQs */}
        <div className="flex flex-col justify-center gap-6">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-primary/30 bg-black/60 backdrop-blur-md transition-all duration-300"
              >
                {/* Question*/}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`relative w-full px-6 py-5 text-left text-sm uppercase tracking-widest text-primary transition-all duration-300 hover:text-white ${index === openIndex && 'text-white'} `}
                >
                  {item.q}
                  <span
                    className={`absolute bottom-3 left-6 h-[2px] bg-primary shadow-stGlowStrong transition-all duration-300 ${isOpen ? 'w-[calc(100%-3rem)]' : 'w-0 group-hover:w-[calc(100%-3rem)]'} `}
                  />
                </button>

                {/*Answer*/}
                <div
                  className={`overflow-hidden px-6 text-sm text-white/80 transition-all duration-300 ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'} `}
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
