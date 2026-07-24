import { useState } from 'react';
import { Mail, User, DollarSign, MessageSquare, Loader2, CheckCircle, Zap, LayoutDashboard, LineChart } from 'lucide-react';
import { validateLeadForm, BUDGET_OPTIONS } from '../utils/validation';
import { apiPost } from '../utils/api';
import { useToast } from '../components/Toast';

const LandingPage = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { isValid, errors: validationErrors } = validateLeadForm(formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await apiPost('/api/leads', formData);
      setIsSuccess(true);
      addToast('Message sent successfully! We will be in touch soon.', 'success');
      
      // Reset after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', budget: '', message: '' });
      }, 5000);
      
    } catch (error) {
      addToast(error.message || 'Failed to submit form', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-16">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-[pulse-glow_8s_ease-in-out_infinite]" />
        <div className="absolute top-[40%] right-[-10%] w-[30rem] h-[30rem] bg-accent/20 rounded-full blur-[120px] animate-[pulse-glow_10s_ease-in-out_infinite_reverse]" />
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 animate-fadeIn">
        
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto animate-slideUp">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Capture. <span className="text-gradient">Convert.</span> Close.
          </h1>
          <p className="text-xl text-text-muted mb-8 leading-relaxed">
            Streamline your lead management with LeadDesk. The smartest way to organize, track, and convert your prospects into paying customers.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-text-muted">
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              500+ Leads Captured
            </div>
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              98% Response Rate
            </div>
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              3x Conversion
            </div>
          </div>
        </div>

        {/* Form and Features Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-16">
          
          {/* Features */}
          <div className="space-y-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-3xl font-bold mb-8">Why choose LeadDesk?</h2>
            
            <div className="glass p-6 rounded-2xl flex gap-4 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-primary/20 p-3 rounded-lg h-fit text-primary">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Instant Capture</h3>
                <p className="text-text-muted leading-relaxed">
                  Never lose a lead again. Our optimized forms capture prospect data instantly and securely.
                </p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl flex gap-4 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-accent/20 p-3 rounded-lg h-fit text-accent">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Smart Dashboard</h3>
                <p className="text-text-muted leading-relaxed">
                  A beautiful, intuitive interface to manage all your prospects in one centralized location.
                </p>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl flex gap-4 hover:-translate-y-1 transition-all duration-300">
              <div className="bg-success/20 p-3 rounded-lg h-fit text-success">
                <LineChart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Status Tracking</h3>
                <p className="text-text-muted leading-relaxed">
                  Monitor the journey of every lead from 'New' to 'Closed' with powerful pipeline visualization.
                </p>
              </div>
            </div>
          </div>

          {/* Lead Form */}
          <div className="glass p-8 rounded-3xl animate-slideUp relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
            {isSuccess ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-sm z-10 animate-fadeIn">
                <CheckCircle className="w-20 h-20 text-success mb-4" />
                <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                <p className="text-text-muted text-center max-w-sm">
                  We've received your message and will get back to you shortly.
                </p>
              </div>
            ) : null}

            <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.name ? 'border-danger' : 'border-surface-light'} rounded-xl bg-surface/50 text-text placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none`}
                    placeholder="Shiv Prakash"
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-danger">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-text-muted" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-danger' : 'border-surface-light'} rounded-xl bg-surface/50 text-text placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none`}
                    placeholder="shiv@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-danger">{errors.email}</p>}
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-text-muted mb-2">Estimated Budget</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-text-muted" />
                  </div>
                  <select
                    name="budget"
                    id="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-3 border ${errors.budget ? 'border-danger' : 'border-surface-light'} rounded-xl bg-surface/50 text-text focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none appearance-none`}
                  >
                    <option value="" disabled>Select a budget...</option>
                    {BUDGET_OPTIONS.map(option => (
                      <option key={option} value={option} className="bg-surface">{option}</option>
                    ))}
                  </select>
                </div>
                {errors.budget && <p className="mt-1 text-sm text-danger">{errors.budget}</p>}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-2">Your Message</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-text-muted" />
                  </div>
                  <textarea
                    name="message"
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 border ${errors.message ? 'border-danger' : 'border-surface-light'} rounded-xl bg-surface/50 text-text placeholder:text-text-muted focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 outline-none resize-none`}
                    placeholder="Tell us about your project..."
                  />
                </div>
                {errors.message && <p className="mt-1 text-sm text-danger">{errors.message}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-primary to-accent hover:from-primary-dark hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
