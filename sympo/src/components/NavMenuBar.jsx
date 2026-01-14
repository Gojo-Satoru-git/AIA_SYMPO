import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const NavMenubar = ({ HomeRef, AboutRef, EventsRef, ContactRef, FAQsRef, RegisterRef }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    handleMenuClose();
    navigate("/");
  };

  const registerBtnRef = useRef(null);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [jitterTransform, setJitterTransform] = useState('translate(0, 0)');
  const shakeArmedRef = useRef(true);

  const scrollTo = (ref) => {
    ref?.current?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!registerBtnRef.current) return;

      const rect = registerBtnRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const SHAKE_OUT_DISTANCE = 220;
      const SHAKE_IN_MAX = 160;
      if (!shakeArmedRef.current) {
        if (shakeIntensity !== 0) setShakeIntensity(0);

        if (distance > SHAKE_OUT_DISTANCE) {
          shakeArmedRef.current = true;
        }
        return;
      }

      if (distance < 50) setShakeIntensity(3);
      else if (distance < 100) setShakeIntensity(2);
      else if (distance < SHAKE_IN_MAX) setShakeIntensity(1);
      else setShakeIntensity(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shakeIntensity]);

  useEffect(() => {
    if (shakeIntensity === 0) {
      setJitterTransform('translate(0, 0)');
      return;
    }

    const interval = setInterval(() => {
      const amount = shakeIntensity * 1.5;
      const x = (Math.random() - 0.5) * amount;
      const y = (Math.random() - 0.5) * amount;
      setJitterTransform(`translate(${x}px, ${y}px)`);
    }, 50);

    return () => clearInterval(interval);
  }, [shakeIntensity]);

  const tabItems = [
    { id: 1, name: 'Home', ref: HomeRef },
    { id: 2, name: 'About', ref: AboutRef },
    { id: 3, name: 'Events', ref: EventsRef },
    { id: 5, name: 'FAQs', ref: FAQsRef },
    { id: 4, name: 'Contact us', ref: ContactRef },
    { id: 6, name: 'Register', ref: RegisterRef, cta: true },
  ];

  return (
    <>
      <nav className="fixed top-5 left-0 w-full justify-center p-4 z-50 animate-fade-in-down hidden lg:flex">
        <div
          className="
            bg-black/60 backdrop-blur-md
            border border-primary
            flex gap-8 pl-8 pr-1 rounded-full w-fit
            shadow-stGlow
          "
        >
          {tabItems.map((item) =>
            item.cta ? (
              <button
                key={item.id}
                ref={registerBtnRef}
                onClick={() => {
                  scrollTo(RegisterRef);
                  setShakeIntensity(0);
                  shakeArmedRef.current = false;
                }}
                style={{ transform: jitterTransform }}
                className="
                  px-6 py-2 my-1
                  bg-primary text-black
                  uppercase tracking-widest text-sm font-semibold
                  rounded-full
                  shadow-stGlowStrong
                  transition-transform duration-75
                "
              >
                {item.name}
              </button>
            ) : (
              <button
                key={item.id}
                onClick={() => scrollTo(item.ref)}
                className="
                  relative
                  py-5
                  text-primary uppercase tracking-widest text-sm
                  transition-all duration-300 ease-out
                  hover:text-white hover:-translate-y-1

                  after:absolute after:bottom-4
                  after:left-1/2 after:-translate-x-1/2
                  after:h-[2px] after:w-0
                  after:bg-primary
                  after:shadow-stGlowStrong
                  after:transition-all after:duration-300 after:delay-150
                  hover:after:w-full
                "
              >
                {item.name}
              </button>
            )
          )}
        </div>

        {/* --- AUTH UI FOR DESKTOP --- */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          {!loading && !user && (
            <button
              onClick={() => navigate("/signin")}
              className="px-6 py-4 bg-primary text-black uppercase tracking-widest text-sm font-semibold rounded-full shadow-stGlow"
            >
              Sign In
            </button>
          )}
          {!loading && user && (
            <>
              <Avatar
                onClick={handleMenuOpen}
                sx={{ bgcolor: "#e50914", cursor: "pointer", fontWeight: 700 }}
              >
                {user.displayName?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem disabled>{user.email}</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </div>
      </nav>

      {/* mobile */}
      <nav className="fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center lg:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="text-primary text-2xl">
            ☰
          </button>
          <span className="text-primary uppercase tracking-widest">SYMPOSIUM</span>
        </div>

        {/* --- AUTH UI FOR MOBILE --- */}
        <div className="flex items-center">
          {!loading && !user && (
            <button
              onClick={() => navigate("/signin")}
              className="px-4 py-1.5 text-[11px] uppercase tracking-widest font-semibold rounded-full bg-primary text-white shadow-stGlow"
            >
              Sign In
            </button>
          )}
          {!loading && user && (
            <Avatar
              onClick={handleMenuOpen}
              sx={{ bgcolor: "#e50914", cursor: "pointer", width: 32, height: 32 }}
            >
              {user.displayName?.[0]?.toUpperCase() || "U"}
            </Avatar>
          )}
        </div>
      </nav>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed right-4 top-20
          w-64
          bg-black/80 backdrop-blur-md
          border border-primary
          rounded-2xl
          shadow-stGlowStrong
          z-50 md:hidden

          transform transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto visible' : 'opacity-0 translate-x-20 scale-95 pointer-events-none invisible'}
        `}
      >
        <div className="flex flex-col gap-6 p-8">
          {tabItems.map((item) =>
            item.cta ? (
              <button
                key={item.id}
                onClick={() => scrollTo(RegisterRef)}
                className="
                  mt-4
                  bg-primary text-black
                  px-4 py-3 rounded-lg
                  uppercase tracking-widest text-sm font-semibold
                  shadow-stGlow
                "
              >
                {item.name}
              </button>
            ) : (
              <button
                key={item.id}
                onClick={() => scrollTo(item.ref)}
                className="
                  text-primary uppercase tracking-widest text-sm
                  text-left transition-all duration-300
                  hover:text-white hover:translate-x-2
                "
              >
                {item.name}
              </button>
            )
          )}
        </div>
      </aside>
    </>
  );
};

export default NavMenubar;