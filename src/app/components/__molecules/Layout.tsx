import React from "react";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
} & React.ComponentProps<typeof Header>; 

const Layout = ({ children, ...headerProps }: LayoutProps) => {
  return (
    <div>
      <Header {...headerProps} /> 
      <main>{children}</main>
    </div>
  );
};

export default Layout;