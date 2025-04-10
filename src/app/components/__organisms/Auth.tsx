import React from 'react'
import Secondheader from '../__molecules/Secondheader';
import Secondfooter from '../__molecules/Secondfooter';

const Auth = () => {
  const userid = "user123"; 
  return (
    <div className="flex flex-col h-screen">
      <Secondheader userId={userid} />
      <Secondfooter />
    </div>
  );
};

export default Auth