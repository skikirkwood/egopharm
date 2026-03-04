export default function Footer() {
  return (
    <footer className="bg-quanata-navy text-quanata-light py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Solutions</h3>
            <ul className="space-y-2">
              <li><a href="/fleet" className="hover:text-quanata-accent transition-colors">For Fleets</a></li>
              <li><a href="/insurers" className="hover:text-quanata-accent transition-colors">For Insurers</a></li>
              <li><a href="/drivers" className="hover:text-quanata-accent transition-colors">For Drivers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-quanata-accent transition-colors">About Us</a></li>
              <li><a href="/careers" className="hover:text-quanata-accent transition-colors">Careers</a></li>
              <li><a href="/news" className="hover:text-quanata-accent transition-colors">News</a></li>
              <li><a href="/contact" className="hover:text-quanata-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li><a href="/blog" className="hover:text-quanata-accent transition-colors">Blog</a></li>
              <li><a href="/case-studies" className="hover:text-quanata-accent transition-colors">Case Studies</a></li>
              <li><a href="/documentation" className="hover:text-quanata-accent transition-colors">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Get Started</h3>
            <p className="text-quanata-light/80 mb-4">
              Transform your fleet operations with AI-powered insights.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-quanata-accent hover:bg-quanata-accent-light text-quanata-dark px-5 py-2 rounded-md font-semibold transition-colors"
            >
              Book a demo
            </a>
          </div>
        </div>
        <div className="border-t border-quanata-slate/30 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-quanata-light/70 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Quanata. All Rights Reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="text-quanata-light/70 hover:text-quanata-accent transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-quanata-light/70 hover:text-quanata-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

