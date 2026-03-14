import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="app-shell-main">
      <div className="app-shell-main__inner">{children}</div>
    </div>
  );
};

export default PageLayout;
