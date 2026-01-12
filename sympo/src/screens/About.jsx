const About = () => {
  return (
    <section className="min-h-screen bg-black text-white px-6 py-24 flex items-center">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-16">
        <div className="text-center">
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

          <p className="max-w-3xl mx-auto text-white/80 text-sm md:text-base leading-relaxed">
            This is the beginning. The inaugural edition of our technical symposium. A convergence
            of curiosity, code, and the unknown.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div
            className="
              bg-darkCard
              border border-primary/40
              rounded-2xl
              p-8
              shadow-stGlow
            "
          >
            <h3 className="text-primary text-xl tracking-widest mb-4 uppercase">Our Vision</h3>

            <p className="text-white/80 text-sm leading-relaxed">
              To create a launchpad for innovation where students explore, experiment, and express
              ideas beyond conventional boundaries. A space built for learning, collaboration, and
              discovery.
            </p>
          </div>

          <div
            className="
              bg-darkCard
              border border-primary/40
              rounded-2xl
              p-8
              shadow-stGlow
            "
          >
            <h3 className="text-primary text-xl tracking-widest mb-4 uppercase">Our Mission</h3>

            <p className="text-white/80 text-sm leading-relaxed">
              To host engaging technical events, talks, and hands-on sessions that inspire
              participants, nurture skills, and ignite curiosity across disciplines.
            </p>
          </div>
        </div>

        {/* ================= CLOSING LINE ================= */}
        <div className="text-center">
          <p className="text-primary tracking-widest uppercase text-sm">
            The first step into something bigger
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
