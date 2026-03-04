export default function TopBanner() {
  return (
    <div className="bg-quanata-dark text-quanata-light py-2 px-4 border-b border-quanata-slate/20">
      <div className="max-w-7xl mx-auto flex justify-end items-center space-x-6">
        <a
          href="/solutions"
          className="text-sm font-medium hover:text-quanata-accent transition-colors"
        >
          SOLUTIONS
        </a>
        <a
          href="/resources"
          className="text-sm font-medium hover:text-quanata-accent transition-colors"
        >
          RESOURCES
        </a>
        <a
          href="/about"
          className="text-sm font-medium hover:text-quanata-accent transition-colors"
        >
          ABOUT
        </a>
      </div>
    </div>
  );
}

