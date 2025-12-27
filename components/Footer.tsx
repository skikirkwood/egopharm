export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Customer</h3>
            <ul className="space-y-2">
              <li><a href="/contact" className="hover:text-gray-300">Contact Us</a></li>
              <li><a href="/brands" className="hover:text-gray-300">Our Brands</a></li>
              <li><a href="/skincare-hub" className="hover:text-gray-300">Skincare Hub</a></li>
              <li><a href="/subscribe" className="hover:text-gray-300">Subscribe</a></li>
              <li><a href="/faqs" className="hover:text-gray-300">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Corporate</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-gray-300">About Us</a></li>
              <li><a href="/news" className="hover:text-gray-300">Latest News</a></li>
              <li><a href="/careers" className="hover:text-gray-300">Careers</a></li>
              <li><a href="/partnerships" className="hover:text-gray-300">Partnerships</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Sustainability</h3>
            <ul className="space-y-2">
              <li><a href="/csr" className="hover:text-gray-300">Corporate Social Responsibility</a></li>
              <li><a href="/recycling" className="hover:text-gray-300">Recycling Guide</a></li>
              <li><a href="/modern-slavery" className="hover:text-gray-300">Modern Slavery</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <p className="text-gray-400 mb-4">
              Always read the label and follow the directions for use.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © Copyright Ego Pharmaceuticals. All Rights Reserved {new Date().getFullYear()}.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="/privacy" className="hover:text-gray-300">Privacy Policy</a>
            <a href="/cookies" className="hover:text-gray-300">Cookie Policy</a>
            <a href="/disclaimer" className="hover:text-gray-300">Disclaimer</a>
            <a href="/terms" className="hover:text-gray-300">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

