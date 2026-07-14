export default function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-gray-950 bg-cyber-bg/90 py-8 font-mono text-xs text-gray-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
        <p>&copy; 2026 EduPath Enterprise System. Secure Client Administration Endpoint.</p>
        <div className="flex gap-4 text-gray-400">
          <span>
            Node Version: <span className="font-bold text-cyber-cyan">20.11.0</span>
          </span>
          <span>•</span>
          <span>
            NestJS Engine: <span className="font-bold text-cyber-primary">10.3.0</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

