import React from "react";
import Header from "./Header";
const Layout = ({ children, userId }: { children: React.ReactNode; userId: string }) => {
  return (
    <div>
      <Header userId={userId} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;