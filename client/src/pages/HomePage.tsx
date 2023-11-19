// src/components/Homepage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Homepage: React.FC = () => {
  return (
    <>
      <Link to={"/login"}>
        <p> Login </p>
      </Link>

      <Link to={"/singUp"}>
        <p> SignUp </p>
      </Link>
      
    </>
  );
};

export default Homepage;
