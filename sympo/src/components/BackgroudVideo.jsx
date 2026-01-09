const BackgroundVideo = ({ children, heightClass = 'min-h-[60vh]' }) => {
  return (
    <div className={`relative w-full ${heightClass} overflow-hidden`}>
      <video
        className="absolute inset-0 w-full h-full object-cover -z-10"
        src="./../../public/bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default BackgroundVideo;
