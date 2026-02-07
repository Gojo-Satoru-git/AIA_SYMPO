import TextRainBackground from '../components/TextRainBG';
const MaintenancePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <TextRainBackground />
      <div className="flex max-w-xl flex-col gap-8 text-center">
        {/* TITLE */}
        <h1 className="animate-flicker font-stranger text-5xl tracking-widest text-primary md:text-6xl">
          TEKHORA'26
        </h1>
        {/* SUBTITLE */}
        <p className="text-sm uppercase tracking-widest text-white/70">
          System Maintenance In Progress
        </p>

        {/* MESSAGE */}
        <p className="text-sm leading-relaxed text-white/60">
          We're updating some changes to improve relaiblity and experience
          <br />
          <br />
          Registration will be back shortly.
        </p>

        {/* LOADING SIGNAL */}
        <div className="mt-4 flex justify-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary delay-150" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary delay-300" />
        </div>

        {/* OPTIONAL ETA */}
        <p className="mt-6 text-xs text-white/40">Thank you for your patience.</p>
      </div>
    </div>
  );
};

export default MaintenancePage;
