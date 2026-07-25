import { useState, useEffect, useRef } from 'react';
import { Mail, User, DollarSign, MessageSquare, Loader2, CheckCircle, Zap, LayoutDashboard, LineChart, ArrowRight, Sparkles, Shield, TrendingUp, Star, ChevronDown } from 'lucide-react';
import { validateLeadForm, BUDGET_OPTIONS } from '../utils/validation';
import { apiPost } from '../utils/api';
import { useToast } from '../components/Toast';

// Animated counter hook
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const increment = end / (duration / 16);
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return [count, ref];
};

// Floating particles
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-primary/10"
        style={{
          width: `${Math.random() * 6 + 2}px`,
          height: `${Math.random() * 6 + 2}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `particle-float ${Math.random() * 10 + 10}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>
);

const LandingPage = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', budget: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const [leadsCount, leadsRef] = useCountUp(500, 2000);
  const [responseRate, responseRef] = useCountUp(98, 1500);
  const [conversion, conversionRef] = useCountUp(3, 1000);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateLeadForm(formData);
    if (!isValid) { setErrors(validationErrors); return; }
    setIsSubmitting(true);
    try {
      await apiPost('/api/leads', formData);
      setIsSuccess(true);
      addToast('Message sent successfully! We will be in touch soon.', 'success');
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

  const inputClass = (field) =>
    `block w-full pl-11 pr-4 py-3.5 border ${
      errors[field] ? 'border-danger/60' : activeField === field ? 'border-primary/50' : 'border-surface-light/50'
    } rounded-xl bg-surface-dark/50 text-text placeholder:text-text-dim focus:border-primary/50 transition-all duration-300 outline-none input-glow`;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-16 noise">
      {/* === ANIMATED BACKGROUND === */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-primary/15 rounded-full blur-[120px] animate-[pulse-glow_8s_ease-in-out_infinite]" />
        <div className="absolute top-[30%] right-[-15%] w-[35rem] h-[35rem] bg-accent/15 rounded-full blur-[130px] animate-[pulse-glow_10s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[100px] animate-[pulse-glow_12s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <FloatingParticles />
        <div className="absolute top-[15%] right-[20%] w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 animate-blob animate-float-slow" />
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        
        {/* === HERO === */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-slideDown inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-text-muted mb-8 hover-lift cursor-default">
            <Sparkles className="w-4 h-4 text-warning" />
            <span>The #1 Lead Management Platform</span>
            <ArrowRight className="w-3 h-3" />
          </div>
          
          <h1 className="animate-slideUp text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95]">
            Capture.
            <br />
            <span className="text-gradient">Convert.</span>
            <br />
            Close.
          </h1>
          
          <p className="animate-slideUp stagger-2 text-lg sm:text-xl text-text-muted mb-10 leading-relaxed max-w-2xl mx-auto">
            The smartest way to organize, track, and convert your prospects into paying customers. Stop losing leads — start closing deals.
          </p>
          
          {/* CTA Buttons */}
          <div className="animate-slideUp stagger-3 flex flex-wrap justify-center gap-4 mb-16">
            <a href="#lead-form" className="btn-gradient px-8 py-4 rounded-xl text-white font-semibold text-base flex items-center gap-2 group">
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#features" className="px-8 py-4 rounded-xl glass-card text-text font-semibold text-base hover-lift flex items-center gap-2">
              <span>Learn More</span>
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          {/* Animated Stats */}
          <div className="animate-slideUp stagger-4 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
            <div ref={leadsRef} className="glass-card rounded-2xl p-4 sm:p-6 hover-lift">
              <p className="text-2xl sm:text-3xl font-bold text-gradient">{leadsCount}+</p>
              <p className="text-xs sm:text-sm text-text-muted mt-1">Leads Captured</p>
            </div>
            <div ref={responseRef} className="glass-card rounded-2xl p-4 sm:p-6 hover-lift">
              <p className="text-2xl sm:text-3xl font-bold text-gradient-gold">{responseRate}%</p>
              <p className="text-xs sm:text-sm text-text-muted mt-1">Response Rate</p>
            </div>
            <div ref={conversionRef} className="glass-card rounded-2xl p-4 sm:p-6 hover-lift">
              <p className="text-2xl sm:text-3xl font-bold text-gradient">{conversion}x</p>
              <p className="text-xs sm:text-sm text-text-muted mt-1">Conversion</p>
            </div>
          </div>
        </div>

        {/* === FEATURES === */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            { icon: Zap, color: 'primary', title: 'Instant Capture', desc: 'Never lose a lead again. Our optimized forms capture prospect data instantly and securely with real-time validation.' },
            { icon: LayoutDashboard, color: 'accent', title: 'Smart Dashboard', desc: 'A beautiful, intuitive admin panel to manage all your leads in one centralized place with powerful search & filters.' },
            { icon: LineChart, color: 'success', title: 'Status Tracking', desc: 'Monitor the journey of every lead from New to Closed with elegant pipeline visualization and one-click updates.' },
          ].map((feature, i) => (
            <div key={feature.title} className={`glass-card rounded-2xl p-8 hover-lift hover-glow group animate-slideUp stagger-${i + 2}`}>
              <div className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center text-${feature.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-text-muted leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* === FORM SECTION === */}
        <div id="lead-form" className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Social proof */}
          <div className="space-y-8">
            <div className="animate-slideUp">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                Ready to <span className="text-gradient">grow?</span>
                <br />Let's talk.
              </h2>
              <p className="text-text-muted text-lg leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours. No spam, no commitments.
              </p>
            </div>
            
            <div className="space-y-4 animate-slideUp stagger-2">
              {[
                { icon: Shield, text: 'Your data is encrypted and secure' },
                { icon: TrendingUp, text: 'Join 500+ businesses already growing' },
                { icon: Star, text: 'Rated 4.9/5 by our clients' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-text-muted">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="animate-slideUp stagger-3">
            <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden border-gradient">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[60px] pointer-events-none" />
              
              {isSuccess ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-dark/95 backdrop-blur-sm z-10 animate-fadeIn">
                  <div style={{ animation: 'success-check 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                    <CheckCircle className="w-20 h-20 text-success mb-4" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
                  <p className="text-text-muted text-center max-w-sm">We've received your message and will get back to you within 24 hours.</p>
                </div>
              ) : null}

              <h2 className="text-2xl font-bold mb-2">Get in touch</h2>
              <p className="text-text-dim text-sm mb-6">Fill in your details and we'll reach out</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className={`h-4 w-4 transition-colors duration-300 ${activeField === 'name' ? 'text-primary' : 'text-text-dim'}`} />
                    </div>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange}
                      onFocus={() => setActiveField('name')} onBlur={() => setActiveField(null)}
                      className={inputClass('name')} placeholder="John Doe" />
                  </div>
                  {errors.name && <p className="mt-1.5 text-xs text-danger flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-danger" />{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className={`h-4 w-4 transition-colors duration-300 ${activeField === 'email' ? 'text-primary' : 'text-text-dim'}`} />
                    </div>
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
                      onFocus={() => setActiveField('email')} onBlur={() => setActiveField(null)}
                      className={inputClass('email')} placeholder="john@company.com" />
                  </div>
                  {errors.email && <p className="mt-1.5 text-xs text-danger flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-danger" />{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-text-muted mb-2">Estimated Budget</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <DollarSign className={`h-4 w-4 transition-colors duration-300 ${activeField === 'budget' ? 'text-primary' : 'text-text-dim'}`} />
                    </div>
                    <select name="budget" id="budget" value={formData.budget} onChange={handleChange}
                      onFocus={() => setActiveField('budget')} onBlur={() => setActiveField(null)}
                      className={`${inputClass('budget')} appearance-none pr-10`}>
                      <option value="" disabled>Select a budget range...</option>
                      {BUDGET_OPTIONS.map(option => (
                        <option key={option} value={option} className="bg-surface-dark">{option}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-text-dim" />
                    </div>
                  </div>
                  {errors.budget && <p className="mt-1.5 text-xs text-danger flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-danger" />{errors.budget}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-muted mb-2">Your Message</label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-3.5 pointer-events-none">
                      <MessageSquare className={`h-4 w-4 transition-colors duration-300 ${activeField === 'message' ? 'text-primary' : 'text-text-dim'}`} />
                    </div>
                    <textarea name="message" id="message" rows="4" value={formData.message} onChange={handleChange}
                      onFocus={() => setActiveField('message')} onBlur={() => setActiveField(null)}
                      className={`${inputClass('message')} resize-none`}
                      placeholder="Tell us about your project and goals..." />
                  </div>
                  {errors.message && <p className="mt-1.5 text-xs text-danger flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-danger" />{errors.message}</p>}
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="w-full py-4 rounded-xl text-base font-semibold text-white btn-gradient flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                  ) : (
                    <><span>Send Message</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
