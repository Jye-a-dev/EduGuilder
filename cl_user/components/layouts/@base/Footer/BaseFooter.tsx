import type { ReactNode } from "react";

type BaseFooterProps = {
  left: ReactNode;
  right?: ReactNode;
};

export default function BaseFooter({ left, right }: BaseFooterProps) {
  return (
    <footer className="border-t border-gray-950 bg-brand-dark/80 py-16 text-sm text-gray-500 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
        <div>{left}</div>
        {right ? <div>{right}</div> : null}
      </div>
    </footer>
  );
}
