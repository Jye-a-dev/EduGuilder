import type { ReactNode } from "react";

type BaseFooterProps = {
  left: ReactNode;
  right?: ReactNode;
};

export default function BaseFooter({ left, right }: BaseFooterProps) {
  return (
    <footer
      className="py-16 text-sm backdrop-blur-md"
      style={{
        borderTop: "1px solid var(--footer-border)",
        backgroundColor: "var(--surface-2)",
        color: "var(--body-muted)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
        <div>{left}</div>
        {right ? <div>{right}</div> : null}
      </div>
    </footer>
  );
}
