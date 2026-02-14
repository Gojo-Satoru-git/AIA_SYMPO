import { Resend } from "resend";
import { RESEND_API_KEY, OTP_EXPIRY_MINUTES } from "../config/env1.js"; // change to env.js for Firebase

const sendOtpEmail = async (email, otp) => {
  const resend = new Resend(RESEND_API_KEY());

  const otpExpiry = OTP_EXPIRY_MINUTES() || "5";

  const { data, error } = await resend.emails.send({
    from: "Tekhora <noreply@tekhora26.live>",
    to: email,
    subject: "⚡ TEKHORA'26 — Verify Your Identity",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TEKHORA'26 OTP</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Share+Tech+Mono&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #0a0a0f;
      font-family: 'Share Tech Mono', monospace;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #0a0a0f;
      border: 1px solid #1a1a2e;
    }

    /* ── HEADER ── */
    .header {
      position: relative;
      background: linear-gradient(180deg, #0d0d1a 0%, #0a0a0f 100%);
      padding: 40px 40px 30px;
      text-align: center;
      border-bottom: 2px solid #cc0000;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background:
        radial-gradient(ellipse 80% 60% at 50% -10%, rgba(204,0,0,0.18) 0%, transparent 70%),
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.012) 2px,
          rgba(255,255,255,0.012) 4px
        );
      pointer-events: none;
    }

    .upside-down-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      letter-spacing: 6px;
      color: #cc0000;
      text-transform: uppercase;
      margin-bottom: 14px;
      opacity: 0.85;
    }

    .logo-text {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 64px;
      letter-spacing: 8px;
      color: #ffffff;
      line-height: 1;
      text-shadow:
        0 0 12px rgba(204,0,0,0.9),
        0 0 40px rgba(204,0,0,0.5),
        0 0 80px rgba(204,0,0,0.25),
        2px 2px 0 #7a0000,
        -1px -1px 0 #ff3333;
      position: relative;
      z-index: 1;
      white-space: nowrap;
    }

    .logo-text .year {
      color: #cc0000;
      text-shadow:
        0 0 12px rgba(204,0,0,1),
        0 0 40px rgba(204,0,0,0.7),
        0 0 80px rgba(204,0,0,0.4);
    }

    .vine-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 20px;
    }

    .vine-line {
      height: 1px;
      width: 80px;
      background: linear-gradient(90deg, transparent, #cc0000 60%, transparent);
    }

    .vine-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: #cc0000;
      box-shadow: 0 0 6px #cc0000;
    }

    /* ── PARTICLE LIGHTS ── */
    .lights-row {
      background: #0a0a0f;
      padding: 10px 40px;
      display: flex;
      gap: 0;
      align-items: center;
      justify-content: space-between;
    }

    .light-bulb {
      display: inline-block;
      width: 10px;
      height: 13px;
      border-radius: 50% 50% 40% 40%;
      position: relative;
    }

    .light-bulb::after {
      content: '';
      display: block;
      width: 4px;
      height: 4px;
      background: rgba(255,255,255,0.3);
      border-radius: 1px;
      margin: 0 auto;
    }

    .l-red    { background: #cc0000; box-shadow: 0 0 8px #cc0000, 0 0 20px rgba(204,0,0,0.6); }
    .l-blue   { background: #1e90ff; box-shadow: 0 0 8px #1e90ff, 0 0 20px rgba(30,144,255,0.6); }
    .l-green  { background: #00cc44; box-shadow: 0 0 8px #00cc44, 0 0 20px rgba(0,204,68,0.6); }
    .l-yellow { background: #ffcc00; box-shadow: 0 0 8px #ffcc00, 0 0 20px rgba(255,204,0,0.6); }
    .l-orange { background: #ff6600; box-shadow: 0 0 8px #ff6600, 0 0 20px rgba(255,102,0,0.6); }
    .l-purple { background: #9900cc; box-shadow: 0 0 8px #9900cc, 0 0 20px rgba(153,0,204,0.6); }
    .l-pink   { background: #ff0066; box-shadow: 0 0 8px #ff0066, 0 0 20px rgba(255,0,102,0.6); }
    .l-white  { background: #ffffff; box-shadow: 0 0 8px #ffffff, 0 0 20px rgba(255,255,255,0.5); }

    .wire {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, rgba(80,80,80,0.4), rgba(80,80,80,0.7), rgba(80,80,80,0.4));
    }

    /* ── BODY ── */
    .body {
      padding: 40px 48px;
      background: #0c0c14;
      background-image:
        radial-gradient(ellipse 90% 50% at 50% 100%, rgba(204,0,0,0.07) 0%, transparent 70%);
    }

    .greeting {
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px;
      color: #888;
      letter-spacing: 2px;
      margin-bottom: 20px;
      text-transform: uppercase;
    }

    .greeting span { color: #cc3333; }

    .message-block {
      border-left: 3px solid #cc0000;
      padding-left: 18px;
      margin-bottom: 36px;
    }

    .message-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      letter-spacing: 4px;
      color: #ffffff;
      margin-bottom: 8px;
      line-height: 1.1;
    }

    .message-body {
      font-family: 'Share Tech Mono', monospace;
      font-size: 12.5px;
      color: #888;
      line-height: 1.8;
      letter-spacing: 0.5px;
    }

    .message-body strong { color: #cc3333; }

    /* ── OTP BOX ── */
    .otp-container {
      text-align: center;
      margin: 36px 0;
    }

    .otp-label {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      letter-spacing: 5px;
      color: #555;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    .otp-frame {
      display: inline-block;
      position: relative;
      padding: 28px 48px;
      border: 1px solid #2a0000;
      background:
        linear-gradient(135deg, #110000 0%, #0a0a0f 50%, #100010 100%);
      border-radius: 4px;
    }

    .otp-frame::before,
    .otp-frame::after {
      content: '';
      position: absolute;
      width: 12px; height: 12px;
      border-color: #cc0000;
      border-style: solid;
    }

    .otp-frame::before {
      top: -1px; left: -1px;
      border-width: 2px 0 0 2px;
    }

    .otp-frame::after {
      bottom: -1px; right: -1px;
      border-width: 0 2px 2px 0;
    }

    .otp-corners-tr {
      position: absolute;
      top: -1px; right: -1px;
      width: 12px; height: 12px;
      border-top: 2px solid #cc0000;
      border-right: 2px solid #cc0000;
    }

    .otp-corners-bl {
      position: absolute;
      bottom: -1px; left: -1px;
      width: 12px; height: 12px;
      border-bottom: 2px solid #cc0000;
      border-left: 2px solid #cc0000;
    }

    .otp-code {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 72px;
      letter-spacing: 18px;
      color: #ffffff;
      text-shadow:
        0 0 10px rgba(204,0,0,1),
        0 0 30px rgba(204,0,0,0.7),
        0 0 60px rgba(204,0,0,0.4),
        0 0 100px rgba(204,0,0,0.2);
      display: block;
      line-height: 1;
      padding-right: 18px; /* offset for letter-spacing */
    }

    .otp-glow-bar {
      height: 1px;
      margin-top: 16px;
      background: linear-gradient(90deg, transparent, #cc0000, #ff4444, #cc0000, transparent);
      opacity: 0.6;
    }

    /* ── EXPIRY ── */
    .expiry-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(204,0,0,0.08);
      border: 1px solid rgba(204,0,0,0.25);
      border-radius: 3px;
      padding: 8px 16px;
      margin-top: 16px;
    }

    .expiry-icon {
      font-size: 14px;
    }

    .expiry-text {
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      color: #cc3333;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    /* ── WARNING ── */
    .warning-box {
      margin-top: 36px;
      padding: 16px 20px;
      background: rgba(255,200,0,0.04);
      border: 1px solid rgba(255,200,0,0.15);
      border-radius: 3px;
    }

    .warning-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 14px;
      letter-spacing: 3px;
      color: #cc9900;
      margin-bottom: 6px;
    }

    .warning-text {
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      color: #666;
      line-height: 1.7;
      letter-spacing: 0.3px;
    }

    /* ── FOOTER ── */
    .footer-lights {
      background: #0a0a0f;
      padding: 8px 40px;
    }

    .footer {
      background: #070710;
      padding: 28px 48px;
      border-top: 1px solid #1a0000;
    }

    .footer-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #2a0000, #cc0000, #2a0000, transparent);
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .footer-logo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px;
      letter-spacing: 6px;
      color: #cc0000;
      opacity: 0.7;
      text-align: center;
      margin-bottom: 10px;
    }

    .footer-text {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      color: #333;
      text-align: center;
      line-height: 1.8;
      letter-spacing: 0.5px;
    }

    .footer-text a {
      color: #555;
      text-decoration: underline;
    }

    .static-bar {
      height: 3px;
      background: repeating-linear-gradient(
        90deg,
        #cc0000 0px, #cc0000 2px,
        transparent 2px, transparent 6px,
        #880000 6px, #880000 8px,
        transparent 8px, transparent 14px
      );
      opacity: 0.5;
    }
  </style>
</head>
<body>
<div class="wrapper">

  <!-- Static bar top -->
  <div class="static-bar"></div>

  <!-- HEADER -->
  <div class="header">
    <div class="upside-down-label">⚡ Symposium Access Portal ⚡</div>
    <div class="logo-text">TEKHORA<span class="year">'26</span></div>
    <div class="vine-divider">
      <div class="vine-line"></div>
      <div class="vine-dot"></div>
      <div class="vine-line"></div>
    </div>
  </div>

  <!-- CHRISTMAS LIGHTS -->
  <div class="lights-row">
    <span class="light-bulb l-red"></span>
    <span class="wire"></span>
    <span class="light-bulb l-blue"></span>
    <span class="wire"></span>
    <span class="light-bulb l-yellow"></span>
    <span class="wire"></span>
    <span class="light-bulb l-green"></span>
    <span class="wire"></span>
    <span class="light-bulb l-red"></span>
    <span class="wire"></span>
    <span class="light-bulb l-purple"></span>
    <span class="wire"></span>
    <span class="light-bulb l-orange"></span>
    <span class="wire"></span>
    <span class="light-bulb l-white"></span>
    <span class="wire"></span>
    <span class="light-bulb l-pink"></span>
    <span class="wire"></span>
    <span class="light-bulb l-blue"></span>
    <span class="wire"></span>
    <span class="light-bulb l-red"></span>
    <span class="wire"></span>
    <span class="light-bulb l-yellow"></span>
    <span class="wire"></span>
    <span class="light-bulb l-green"></span>
    <span class="wire"></span>
    <span class="light-bulb l-purple"></span>
    <span class="wire"></span>
    <span class="light-bulb l-orange"></span>
    <span class="wire"></span>
    <span class="light-bulb l-white"></span>
  </div>

  <!-- BODY -->
  <div class="body">

    <div class="greeting">
      [ SIGNAL RECEIVED — <span>IDENTITY CHECK INITIATED</span> ]
    </div>

    <div class="message-block">
      <div class="message-title">The Gate Is Opening.</div>
      <div class="message-body">
        You've requested access to <strong>TEKHORA'26</strong>.<br/>
        Before we let you through, we need to confirm you're from the right side.<br/><br/>
        Enter the code below to verify your identity and proceed.
      </div>
    </div>

    <!-- OTP -->
    <div class="otp-container">
      <div class="otp-label">// Your Access Code //</div>
      <div class="otp-frame">
        <div class="otp-corners-tr"></div>
        <div class="otp-corners-bl"></div>
        <span class="otp-code">${otp}</span>
        <div class="otp-glow-bar"></div>
      </div>
      <div style="margin-top: 12px;">
        <span class="expiry-badge">
          <span class="expiry-icon">⏳</span>
          <span class="expiry-text">Expires in ${otpExpiry} minutes</span>
        </span>
      </div>
    </div>

    <!-- WARNING -->
    <div class="warning-box">
      <div class="warning-title">⚠ &nbsp;Warning from Hawkins Lab</div>
      <div class="warning-text">
        Do not share this code with anyone — not even Dr. Brenner.<br/>
        If you didn't request this, someone may be trying to breach the gate.<br/>
        Ignore this message and stay vigilant. The Mind Flayer is always watching.
      </div>
    </div>

  </div>

  <!-- BOTTOM LIGHTS -->
  <div class="footer-lights">
    <div class="lights-row" style="padding: 4px 0;">
      <span class="light-bulb l-green"></span>
      <span class="wire"></span>
      <span class="light-bulb l-orange"></span>
      <span class="wire"></span>
      <span class="light-bulb l-red"></span>
      <span class="wire"></span>
      <span class="light-bulb l-white"></span>
      <span class="wire"></span>
      <span class="light-bulb l-blue"></span>
      <span class="wire"></span>
      <span class="light-bulb l-yellow"></span>
      <span class="wire"></span>
      <span class="light-bulb l-pink"></span>
      <span class="wire"></span>
      <span class="light-bulb l-purple"></span>
      <span class="wire"></span>
      <span class="light-bulb l-green"></span>
      <span class="wire"></span>
      <span class="light-bulb l-red"></span>
      <span class="wire"></span>
      <span class="light-bulb l-orange"></span>
      <span class="wire"></span>
      <span class="light-bulb l-white"></span>
      <span class="wire"></span>
      <span class="light-bulb l-blue"></span>
      <span class="wire"></span>
      <span class="light-bulb l-yellow"></span>
      <span class="wire"></span>
      <span class="light-bulb l-pink"></span>
      <span class="wire"></span>
      <span class="light-bulb l-purple"></span>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-divider"></div>
    <div class="footer-logo">TEKHORA '26</div>
    <div class="footer-text">
      This is an automated message from TEKHORA'26 Symposium.<br/>
      © 2026 TEKHORA. All rights reserved.<br/><br/>
      <span style="color:#222;">Questions? Contact us at support@tekhora26.live</span>
    </div>
  </div>

  <!-- Static bar bottom -->
  <div class="static-bar"></div>

</div>
</body>
</html>
      `,
  });

  if (error) throw new Error(error.message || "Failed to send email");
  return data;
};

export { sendOtpEmail };
