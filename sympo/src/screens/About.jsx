const About = () => {
  return (
    <section className="min-h-screen  flex items-center px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="
              text-primary
              text-4xl md:text-5xl
              tracking-widest
              uppercase
              font-stranger
              mb-6
            "
        >
          About the Symposium
        </h2>
        <p className="text-white text-lg md:text-xl leading-relaxed">
          This is the<span className="text-primary"> beginning</span>. The inaugural edition of our
          technical symposium marks a new platform built to bring together curiosity, innovation,
          and collaboration. Designed to encourage exploration beyond conventional boundaries, the
          symposium offers a space to learn, compete, and create through a diverse range of
          technical and non-technical events. It is an invitation to push limits, share ideas, and
          be part of something that is just getting started
        </p>
      </div>
    </section>
  );
};

export default About;
