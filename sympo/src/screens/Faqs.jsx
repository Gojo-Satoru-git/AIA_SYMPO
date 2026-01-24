import { useState } from 'react';

const faqs = [
  {
    q: 'What is the symposium?',
    a: 'The symposium is a technical event organized by the department, featuring competitions, talks, and workshops designed to enhance technical and practical skills.',
  },
  {
    q: 'Who can participate?',
    a: 'Students from all colleges and departments are welcome to participate unless an event specifies eligibility criteria.',
  },
  {
    q: 'Is there a registration fee?',
    a: 'Some events may have a minimal registration fee. Details will be provided during registration.',
  },
  {
    q: 'Will participants receive certificates?',
    a: 'Yes, certificates will be provided to all registered participants and winners where applicable.',
  },
  {
    q: 'How do I register?',
    a: 'Registration links will be available on the symposium website under the Events section.',
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="min-h-screen text-white flex justify-center px-6 py-24">
      <div className="flex flex-col md:flex-row gap-12">
        {/*titiele */}
        <div className="flex items-center">
          <h2 className="text-center text-primary text-3xl md:text-4xl uppercase tracking-widest mb-12">
            Things That Might Be Bugging You Out
          </h2>
        </div>

        {/*FAQs */}
        <div className="flex flex-col gap-6 justify-center">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="
                  group relative
                  bg-black/60 backdrop-blur-md
                  border border-primary/30
                  rounded-xl overflow-hidden
                  transition-all duration-300 
                "
              >
                {/* Question*/}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className={`
                    relative w-full text-left
                    px-6 py-5
                    text-primary uppercase tracking-widest text-sm
                    transition-all duration-300
                    hover:text-white
                    ${index === openIndex && 'text-white'}
                  `}
                >
                  {item.q}
                  <span
                    className={`
                      absolute left-6 bottom-3
                      h-[2px]
                      bg-primary
                      shadow-stGlowStrong
                      transition-all duration-300
                      ${isOpen ? 'w-[calc(100%-3rem)]' : 'w-0 group-hover:w-[calc(100%-3rem)]'}
                    `}
                  />
                </button>

                {/*Answer*/}
                <div
                  className={`
                    px-6 text-white/80 text-sm
                    overflow-hidden transition-all duration-300
                    ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}
                  `}
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
