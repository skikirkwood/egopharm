export default function TopBanner() {
  return (
    <div className="bg-slate-700 text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex justify-end items-center space-x-6">
        <a
          href="/where-to-buy"
          className="text-sm font-medium hover:text-blue-200 transition-colors"
        >
          WHERE TO BUY
        </a>
        <a
          href="/brands"
          className="text-sm font-medium hover:text-blue-200 transition-colors"
        >
          BRANDS
        </a>
        <button className="flex items-center space-x-1 text-sm font-medium hover:text-blue-200 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>EN</span>
        </button>
      </div>
    </div>
  );
}

