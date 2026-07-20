import type { ReactNode } from "react";

type BaseNavbarProps = {
  brand: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
};

export default function BaseNavbar({ brand, children, action }: BaseNavbarProps) {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{ backgroundColor: "var(--navbar-bg)", borderBottom: "1px solid var(--nav-border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div>{brand}</div>
        {children ? <div>{children}</div> : null}
        {action ? <div>{action}</div> : null}
      </div>
    </header>
  );
}
