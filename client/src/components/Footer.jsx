import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-surface-light/10 mt-auto bg-surface-dark/50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="text-sm font-semibold text-gradient">LeadDesk</span>
            <span className="text-text-dim text-sm">© {new Date().getFullYear()}</span>
          </div>
          <p className="text-sm text-text-dim flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-danger inline-block animate-bounce-gentle" /> for{' '}
            <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer"
              className="text-primary hover:text-primary-light transition-colors duration-300 font-medium">
              Digital Heroes Training Task
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
