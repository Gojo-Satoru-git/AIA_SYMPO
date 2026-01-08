import React from "react";

const Header = () => {
  return (
    <>
      <nav className="flex justify-center p-4 animate-fade-in-down">
        <ul className="bg-primary flex gap-10 p-6 rounded-full w-fit z-auto">
          <li className="hover:underline transition duration-75 hover:scale-110 cursor-pointer ">
            Home
          </li>
          <li className="hover:underline transition duration-75 hover:scale-110 cursor-pointer">
            Events
          </li>
          <li className="hover:underline transition duration-75 hover:scale-110 cursor-pointer">
            contact us
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
