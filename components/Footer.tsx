export default function Footer() {
  return (
    <footer className="bg-[#0072ce] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Customer</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="hover:text-blue-200">Contact Us</a></li>
              <li><a href="/brands" className="hover:text-blue-200">Our Brands</a></li>
              <li><a href="/skincare-hub" className="hover:text-blue-200">Skincare Hub</a></li>
              <li><a href="/subscribe" className="hover:text-blue-200">Subscribe</a></li>
              <li><a href="/faqs" className="hover:text-blue-200">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Corporate</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-blue-200">About Us</a></li>
              <li><a href="/news" className="hover:text-blue-200">Latest News</a></li>
              <li><a href="/careers" className="hover:text-blue-200">Careers</a></li>
              <li><a href="/partnerships" className="hover:text-blue-200">Partnerships</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Sustainability</h3>
            <ul className="space-y-2">
              <li><a href="/csr" className="hover:text-blue-200">Corporate Social Responsibility</a></li>
              <li><a href="/recycling" className="hover:text-blue-200">Recycling Guide</a></li>
              <li><a href="/modern-slavery" className="hover:text-blue-200">Modern Slavery</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <p className="text-blue-100 mb-4">
              Always read the label and follow the directions for use.
            </p>
          </div>
        </div>
        <div className="border-t border-blue-400 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-100 text-sm mb-4 md:mb-0">
            © Copyright Ego Pharmaceuticals. All Rights Reserved {new Date().getFullYear()}.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="hover:text-blue-200">Privacy Policy</a>
            <a href="/cookies" className="hover:text-blue-200">Cookie Policy</a>
            <a href="/disclaimer" className="hover:text-blue-200">Disclaimer</a>
            <a href="/terms" className="hover:text-blue-200">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

