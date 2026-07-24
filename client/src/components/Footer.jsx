const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-surface-light mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-text-muted mb-4 md:mb-0 text-center md:text-left">
          &copy; {new Date().getFullYear()} LeadDesk. All rights reserved.
        </p>
        <p className="text-sm text-text-muted text-center md:text-right">
          Built for{' '}
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark transition-colors duration-300"
          >
            Digital Heroes Training Task
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
