export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between flex-col md:flex-row gap-4">
          <div className="flex justify-center md:justify-start">
            <p className="text-gray-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Graduate Admission Prediction System.
            </p>
          </div>
          <div className="flex justify-center md:justify-end gap-6 text-sm text-gray-400">
             <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
