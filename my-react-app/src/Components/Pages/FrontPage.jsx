import React, { useState } from "react";
import Navbar from "../FrontPage/Navbar";
import MainContent from "../FrontPage/MainContent";
import Footer from "../FrontPage/Footer";

const FrontPage = () => {
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const isLoggedIn = () => {
    return !!username;
  };

  return (
    <>
      <Navbar
        username={username}
        isLoggedIn={isLoggedIn}
        setUsername={setUsername}
      />
      <MainContent isLoggedIn={isLoggedIn} />
      <Footer />
    </>
  );
};

export default FrontPage;
