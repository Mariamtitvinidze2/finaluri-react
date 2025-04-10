import React from "react";
import Header from "./Header";
import Secondheader from "./Secondheader";
const Layout = ({ children, userId }: { children: React.ReactNode; userId: string }) => {
  return (
    <div>
      <Header userId={userId} />
     <Secondheader userId={userId} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;