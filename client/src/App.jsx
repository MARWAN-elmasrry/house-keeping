import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar";
import { Footer } from "./components/footer";
import Hero from "./components/landing/hero";
import WhoIsUs from "./components/landing/whoisus";
import WhatServ from "./components/landing/whatserv";
import Contant from "./components/landing/contact";
import Products from "./components/product/prod";
import Login from "./components/login";
import SignIn from "./components/sign";
import Cart from "./components/product/cart";
import User from "./components/user/user";
import Chat from "./components/user/chat";
import HowItWorks from "./components/landing/HowIt"
import DualBenefits from "./components/landing/DualBenefits"
const App = () => {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<>
            <Hero />
            <WhoIsUs />
            <WhatServ />
            <HowItWorks />
            <DualBenefits />
            <Contant />
          </>} />
          <Route path="/prod" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<SignIn />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/user" element={<User />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;