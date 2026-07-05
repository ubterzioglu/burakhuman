import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell">
      <div className="page-content">
        <Header />
        {children}
      </div>
      <Footer />
    </div>
  );
}
