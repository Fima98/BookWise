import React from "react";
import Header from "@/components/Header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root-container">
      <Header />
      <div className="mt-20 pb-20">{children}</div>
    </main>
  );
};

export default layout;
