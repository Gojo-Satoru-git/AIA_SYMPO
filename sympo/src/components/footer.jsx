const Footer = () => {
  return (
    <footer className="bg-black text-white px-6 py-16">
      <div
        className="
          max-w-7xl mx-auto
          flex flex-col items-center gap-12
          md:grid md:grid-cols-2 md:items-start
        "
      >
        <div className="w-full flex flex-col items-center md:items-start">
          <h3 className="text-primary text-xl mb-4 tracking-widest text-center md:text-left">
            Locate us
          </h3>

          <div
            className="
              w-full max-w-md md:max-w-none
              h-[220px] sm:h-[260px] md:h-[280px]
              rounded-xl overflow-hidden
              border border-primary
              shadow-stGlow
            "
          >
            <iframe
              title="Madras Institute of Technology"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.366634572679!2d80.13709327485395!3d12.948375387364827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525fac595c29ff%3A0xb76082ae18b51418!2sMadras%20Institute%20of%20Technology%2C%20Anna%20University!5e0!3m2!1sen!2sin!4v1768108284805!5m2!1sen!2sin"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 md:items-start">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-primary text-xl mb-4 tracking-widest text-center md:text-left">
              Connect
            </h3>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="
                group
                flex items-center gap-4
                px-6 py-3
                border border-primary
                rounded-full
                transition-all duration-300
                hover:shadow-stGlowStrong
                hover:bg-primary/10
              "
            >
              <div
                className="
                  w-10 h-10
                  rounded-full
                  flex items-center justify-center
                  transition-transform duration-300
                  animated-border
                  group-hover:rotate-6 group-hover:scale-110
                "
              >
                <img src="./assets/instagramo.png" alt="Instagram" className="w-6 h-6" />
              </div>

              <span className="uppercase tracking-widest text-sm">Follow us</span>
            </a>
          </div>

          {/* REACH OUT */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-primary text-xl mb-4 tracking-widest text-center md:text-left">
              Reach Out
            </h3>

            <p className="text-white/80 text-sm text-center md:text-left leading-relaxed max-w-sm">
              Chromepet, Chennai – 600044, Tamil Nadu
            </p>

            <p className="mt-3 text-white/80 text-sm text-center md:text-left">
              example@example.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
