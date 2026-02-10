import LogoLoop from '../components/LogoLoop';
const About = () => {
  const sponsors = [
    {
      src: '/assets/slogos/youthalic.webp',
      alt: 'youthalic',
    },
    {
      src: '/assets/slogos/bkt1.webp',
      alt: 'bkt',
    },
    {
      src: '/assets/slogos/thecreators.jpeg',
      alt: 'Thecreators',
    },
    {
      src: '/assets/slogos/t&g.png',
      alt: 'toni&guy'
    },
    {
      src: '/assets/slogos/uniq.jpg',
      alt: 'uniq',
    },
    {
      src: '/assets/slogos/ed.webp',
      alt: 'edgematrix',
    },
    {
      src: '/assets/slogos/youthalic.webp',
      alt: 'youthalic',
    },
    {
      src: '/assets/slogos/bkt1.webp',
      alt: 'bkt',
    },
    {
      src: '/assets/slogos/thecreators.jpeg',
      alt: 'Thecreators',
    },
    {
      src: '/assets/slogos/t&g.png',
      alt: 'toni&guy',
    },
    {
      src: '/assets/slogos/uniq.jpg',
      alt: 'uniq',
    },
    {
      src: '/assets/slogos/ed.webp',
      alt: 'edgematrix',
    },
    {
      src: '/assets/slogos/youthalic.webp',
      alt: 'youthalic',
    },
    {
      src: '/assets/slogos/bkt1.webp',
      alt: 'bkt',
    },
    {
      src: '/assets/slogos/thecreators.jpeg',
      alt: 'Thecreators',
    },
    {
      src: '/assets/slogos/t&g.png',
      alt: 'toni&guy',
    },
    {
      src: '/assets/slogos/uniq.jpg',
      alt: 'uniq',
    },
    {
      src: '/assets/slogos/ed.webp',
      alt: 'edgematrix',
    },
    {
      src: '/assets/slogos/youthalic.webp',
      alt: 'youthalic',
    },
    {
      src: '/assets/slogos/bkt1.webp',
      alt: 'bkt',
    },
    {
      src: '/assets/slogos/thecreators.jpeg',
      alt: 'Thecreators',
    },
    {
      src: '/assets/slogos/t&g.png',
      alt: 'toni&guy',
    },
    {
      src: '/assets/slogos/uniq.jpg',
      alt: 'uniq',
    },
    {
      src: '/assets/slogos/ed.webp',
      alt: 'edgematrix',
    },
  ];
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="mb-6 font-stranger text-4xl uppercase tracking-widest text-primary md:text-5xl">
          About the Symposium
        </h2>
        <p className="text-lg leading-relaxed text-white md:text-xl">
          This is the<span className="text-primary"> beginning</span>. The inaugural edition of our
          technical symposium marks a new platform built to bring together curiosity, innovation,
          and collaboration. Designed to encourage exploration beyond conventional boundaries, the
          symposium offers a space to learn, compete, and create through a diverse range of
          technical and non-technical events. It is an invitation to push limits, share ideas, and
          be part of something that is just getting started
        </p>
      </div>
      <section className="mt-16 w-full">
        <h2 className="mb-8 text-center font-stranger text-2xl uppercase tracking-widest text-primary md:text-3xl">
          Our sponsors
        </h2>
        <LogoLoop
          logos={sponsors}
          speed={30}
          gap={60}
          logoHeight={100}
          pauseOnHover
          scaleOnHover

        />
      </section>
    </section>
  );
};

export default About;
