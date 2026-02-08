import { useState } from "react";

const Footer = () => {
  const [activePolicy, setActivePolicy] = useState(null); // "cancel" | "privacy" | null

  return (
    <>
      {/* ===== EXISTING FOOTER (UNCHANGED) ===== */}
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
                  <img
                    src="./assets/instagramo.png"
                    alt="Instagram"
                    className="h-6 w-6"
                  />
                </div>

                <span className="text-sm uppercase tracking-widest">
                  Follow us
                </span>
              </a>
            </div>

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

        {/* ===== ADDED BOTTOM BAR ===== */}
        <div className="mt-16 border-t border-white/10 pt-6 text-center text-xs text-white/70 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-6">
          <button
            onClick={() => setActivePolicy("cancel")}
            className="hover:text-primary transition"
          >
            Cancellation Policy
          </button>

          <span className="hidden sm:inline">|</span>

          <span>© 2026 AIA. All rights reserved.</span>

          <span className="hidden sm:inline">|</span>

          <button
            onClick={() => setActivePolicy("privacy")}
            className="hover:text-primary transition"
          >
            Privacy Policy
          </button>
        </div>
      </footer>

      {/* PRIVACY POLICY */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-black p-6 text-white shadow-xl sm:p-10">
            {activePolicy === "cancel" && (
              <>
                <h2 className="mb-4 text-2xl font-semibold text-primary">
                  Cancellation Policy
                </h2>

                <p className="text-sm leading-relaxed text-white/80">
                  At Tekhora26, all purchases are final. We strictly do not allow
                  cancellations, refunds, or exchanges under any circumstances.
                  <br />
                  <br />
                  By making a purchase on our platform, you acknowledge and
                  agree to this policy.
                  <br />
                  <br />
                  If you have any concerns regarding your order, please contact
                  us at <strong>+91   91598 12736</strong>.
                </p>
              </>
            )}

            {activePolicy === "privacy" && (
              <>
                <h2 className="mb-2 text-2xl font-semibold text-primary">
                  Privacy Policy
                </h2>

             <div className="space-y-6 text-sm text-white/80">
  <p className="text-xs text-white/60">
    Effective Date: 22/02/2026
  </p>

  <div>
    <strong className="text-white/60">1. Information We Collect</strong>
    <ul className="mt-2 list-disc space-y-1 pl-5">
      <li>Personal details (name, email, phone number)</li>
      <li>Payment details (processed securely via third-party providers)</li>
      <li>Usage data (website interactions, device info, cookies)</li>
    </ul>
  </div>

  <div>
    <strong className="text-white/60">2. How We Use Your Information</strong>
    <ul className="mt-2 list-disc space-y-1 pl-5">
      <li>To process transactions and provide services</li>
      <li>To improve our website and user experience</li>
      <li>To respond to inquiries and provide support</li>
      <li>To comply with legal and regulatory requirements</li>
    </ul>
    <p className="mt-2 text-white/60">
      <strong>No Marketing Communications:</strong> We do not use your data for promotional or marketing purposes.
    </p>
  </div>

  <div>
    <strong className="text-white/60">3. Data Protection & Security</strong>
    <p className="mt-2">
      We implement strict security measures to protect your personal information
      from unauthorized access, alteration, or misuse.
    </p>
  </div>

  <div>
    <strong className="text-white/60">4. Third-Party Sharing</strong>
    <p className="mt-2">
      We do not sell, rent, or trade your personal information. Data is shared
      only with trusted third-party service providers (such as payment processors)
      to securely deliver our services.
    </p>
  </div>

  <div>
    <strong className="text-white/60">5. Your Rights</strong>
    <ul className="mt-2 list-disc space-y-1 pl-5">
      <li>Access and review your personal data</li>
      <li>Request corrections or deletions</li>
      <li>Opt out of non-essential data collection</li>
    </ul>
    <p className="mt-2">
      Contact: <strong>+91  91598 12736</strong>
    </p>
  </div>

  <div>
    <strong className="text-white/60">6. Changes to This Policy</strong>
    <p className="mt-2">
      We may update this Privacy Policy as needed. Any changes will be posted on
      this page with the updated effective date.
    </p>
  </div>

  <p className="pt-4 text-white/90">
    By using Tekhora26, you agree to the terms outlined in this Privacy Policy.
  </p>
</div>

              </>
            )}

            <button
              onClick={() => setActivePolicy(null)}
              className="mt-8 rounded-full border border-primary px-6 py-2 text-sm transition hover:bg-primary hover:text-black"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
