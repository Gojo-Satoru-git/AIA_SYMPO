const Footer = () => {
  return (
    <footer className="px-6 py-16 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 md:grid md:grid-cols-2 md:items-start">
        <div className="flex w-full flex-col items-center md:items-start">
          <h3 className="mb-4 text-center text-xl tracking-widest text-primary md:text-left">
            Locate us
          </h3>

          <div className="h-[220px] w-full max-w-md overflow-hidden rounded-xl border border-primary shadow-stGlow sm:h-[260px] md:h-[280px] md:max-w-none">
            <iframe
              title="Madras Institute of Technology"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.366634572679!2d80.13709327485395!3d12.948375387364827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525fac595c29ff%3A0xb76082ae18b51418!2sMadras%20Institute%20of%20Technology%2C%20Anna%20University!5e0!3m2!1sen!2sin!4v1768108284805!5m2!1sen!2sin"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 md:items-start">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-center text-xl tracking-widest text-primary md:text-left">
              Connect
            </h3>

            <a
              href="https://www.instagram.com/aia_mit/"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-full border border-primary px-6 py-3 transition-all duration-300 hover:bg-primary/10 hover:shadow-stGlowStrong"
            >
              <div className="animated-border flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <img src="./assets/instagramo.png" alt="Instagram" className="h-6 w-6" />
              </div>

              <span className="text-sm uppercase tracking-widest">Follow us</span>
            </a>
          </div>

          {/* REACH OUT */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-center text-xl tracking-widest text-primary md:text-left">
              Reach Out
            </h3>

            <p className="max-w-sm text-center text-sm leading-relaxed text-white/80 md:text-left">
              Chromepet, Chennai – 600044, Tamil Nadu
            </p>

            <p className="mt-3 text-center text-sm text-white/80 md:text-left">
              aia.mit.india@gmail.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
