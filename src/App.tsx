import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Shield, 
  Code, 
  Network, 
  Bug, 
  Coffee, 
  Search,
  Instagram,
  Star,
  ArrowRight,
  CheckCircle,
  Loader
} from 'lucide-react';
import { loadRazorpayScript, initiateRazorpayPayment } from './utils/razorpay';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import vpaIcon from './assets/vpa icon.png';
import ImageSlideshow from './components/ImageSlideshow';
import cyber1 from './assets/cyber1.jpg';
import cyber2 from './assets/cyber2.jpg';
// Payment imports kept for future use
// import { fetchCourses } from './utils/api';
// import { initiateEnrollment } from './utils/api';
// import { initiateRazorpayPayment } from './utils/razorpay';

const VisionaryPhoenixAcademy = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Define Course interface
  interface Course {
    _id: string;
    name: string;
    price: number;
    description?: string;
  }

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  // const [enrolling, setEnrolling] = useState<string | null>(null); // For future payment integration
  
  interface FormData {
    name: string;
    email: string;
    phone: string;
    course: string;
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    course: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Visionary Phoenix Academy',
    url: typeof window !== 'undefined' ? window.location.origin : undefined,
    logo: undefined,
    sameAs: [
      'https://instagram.com/visionary_phoenix_official'
    ],
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+91-8220397552',
      email: 'visionaryphoenixacademy@gmail.com'
    }],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1st floor, Mettupalayam Road, next to petrol bunk, Periyanaickenpalayam',
      addressRegion: 'Tamil Nadu',
      postalCode: '641020',
      addressCountry: 'IN'
    }
  } as const;

  // Icon mapping for courses (fallback for display)
  const courseIcons = {
    'Ethical Hacking': { icon: Bug, color: 'text-red-500', bgColor: 'bg-red-50' },
    'Cybersecurity': { icon: Shield, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    'SOC Analyst': { icon: Search, color: 'text-green-500', bgColor: 'bg-green-50' },
    'CCNA': { icon: Network, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    'Java': { icon: Coffee, color: 'text-orange-500', bgColor: 'bg-orange-50' },
    'Python': { icon: Code, color: 'text-yellow-500', bgColor: 'bg-yellow-50' }
  };

  // Static course data - no need for API call
  useEffect(() => {
    // Set static course data
    setCourses([
      { _id: '1', name: 'Ethical Hacking', price: 10000, description: 'Master ethical hacking with hands-on training from industry experts.' },
      { _id: '2', name: 'Cybersecurity', price: 10000, description: 'Master cybersecurity with hands-on training from industry experts.' },
      { _id: '3', name: 'SOC Analyst', price: 12000, description: 'Master SOC analyst skills with hands-on training from industry experts.' },
      { _id: '4', name: 'CCNA', price: 10000, description: 'Master CCNA with hands-on training from industry experts.' },
      { _id: '5', name: 'Java', price: 8000, description: 'Master Java with hands-on training from industry experts.' },
      { _id: '6', name: 'Python', price: 8000, description: 'Master Python with hands-on training from industry experts.' }
    ]);
    setLoading(false);
  }, []);

  const jobOpportunities = [
    'SOC Analyst',
    'Penetration Tester',
    'Security Architect',
    'Incident Responder',
    'Security Analyst',
    'Cybersecurity Consultant',
    'Chief Information Security Officer (CISO)'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle course enrollment - scroll to contact form and pre-fill course
  const handleEnrollment = (courseName: string) => {
    // Pre-fill the course selection in the form
    setFormData({
      ...formData,
      course: courseName
    });
    
    // Scroll to the contact form section smoothly
    scrollToSection('enroll');
  };

  // Keep the payment integration function for future use (commented out)
  /*
  const handlePaymentEnrollment = async (courseId: string) => {
    try {
      setEnrolling(courseId);
      
      // Step 1: Initiate enrollment with backend
      const orderData = await initiateEnrollment(courseId);
      
      // Step 2: Initialize Razorpay payment
      await initiateRazorpayPayment(
        orderData,
        formData, // User details for prefill
        (verificationResult: any) => {
          // Payment successful - redirect to success page
          console.log('Payment verified successfully:', verificationResult);
          navigate('/success');
        },
        (error: any) => {
          // Payment failed - redirect to failure page
          console.error('Payment failed:', error);
          navigate('/failure');
        }
      );
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Failed to initiate enrollment. Please try again.');
    } finally {
      setEnrolling(null);
    }
  };
  */

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Load Razorpay script first
      await loadRazorpayScript();

      // Call enroll API with form data
      const response = await fetch('https://my-backend-mjuk.onrender.com/api/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course: formData.course
        })
      });
      
      if (response.ok) {
        const result = await response.json();
      
        
        // Initialize Razorpay payment with order details
        await initiateRazorpayPayment(
          {
            order_id: result.orderId,
            amount: result.amount,
            currency: result.currency,
            key_id: result.key
          },
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          async () => {
            // Success callback - payment verification is handled in razorpay.ts
            setIsProcessing(false);
            navigate('/success');
          },
          (error: any) => {
            // Failure callback
            console.error('Payment failed:', error);
            setIsProcessing(false);
            navigate('/failure');
          }
        );
        
        // Reset form after payment is initiated
        setFormData({ name: '', email: '', phone: '', course: '' });
      } else {
        setIsProcessing(false);
        throw new Error('Enrollment failed');
      }
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      setIsProcessing(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Visionary Phoenix Academy | Cybersecurity & Tech Training</title>
        <meta name="description" content="Transform your career with cutting-edge cybersecurity, ethical hacking, SOC analyst, CCNA, Java and Python training. Hands-on learning and 100% placement support." />
        <meta property="og:title" content="Visionary Phoenix Academy" />
        <meta property="og:description" content="Rise like a phoenix in the digital world with industry-led training and placement support." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src={vpaIcon}
                alt="Visionary Phoenix Academy logo"
                width={48}
                height={48}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Visionary Phoenix</h1>
                <p className="text-sm text-gray-600">Academy</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('courses')} className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                Courses
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-orange-500 transition-colors font-medium">
                About Us
              </button>
              <button onClick={() => scrollToSection('enroll')} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all font-medium">
                Enroll
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-3 pt-4">
                <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-left">
                  Home
                </button>
                <button onClick={() => scrollToSection('courses')} className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-left">
                  Courses
                </button>
                <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-orange-500 transition-colors font-medium text-left">
                  About Us
                </button>
                <button onClick={() => scrollToSection('enroll')} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all font-medium w-fit">
                  Enroll
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Landing Page */}
      <section id="home" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent">
                Born from Ashes,
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Built to Lead
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              Transform your career with cutting-edge cybersecurity and technology training. 
              Rise like a phoenix in the digital world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('enroll')}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Enroll Now <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Courses</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Master the skills that matter in today's digital landscape
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-8 h-8 animate-spin text-orange-500" />
              <span className="ml-2 text-gray-600">Loading courses...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course, index) => {
                const courseIcon = courseIcons[course.name as keyof typeof courseIcons] || { icon: Code, color: 'text-blue-500', bgColor: 'bg-blue-50' };
                const IconComponent = courseIcon.icon;
                
                return (
                  <div key={course._id || index} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 p-8 border border-gray-100">
                    <div className={`w-16 h-16 ${courseIcon.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                      <IconComponent className={`w-8 h-8 ${courseIcon.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{course.name}</h3>
                    <p className="text-gray-600 mb-4">
                      {course.description || `Master ${course.name.toLowerCase()} with hands-on training from industry experts.`}
                    </p>
                    {course.price && (
                      <div className="mb-6">
                        <span className="text-3xl font-bold text-orange-500">₹{course.price.toLocaleString()}</span>
                        <span className="text-gray-500 ml-2">/ course</span>
                      </div>
                    )}
                    <button 
                      onClick={() => handleEnrollment(course.name)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      Enroll Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Job Opportunities Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Career Opportunities
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Launch your career in high-demand cybersecurity roles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobOpportunities.map((job, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <h3 className="text-lg font-semibold text-white">{job}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-blue-100 text-lg mb-6">
              Average salary range: ₹4,00,000 - ₹25,00,000+ per annum
            </p>
            <button 
              onClick={() => scrollToSection('enroll')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Your Journey
            </button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center">
              About <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Us</span>
            </h2>
            
            {/* Image Slideshow */}
            <div className="mb-12 max-w-4xl mx-auto">
              <ImageSlideshow 
                images={[cyber1, cyber2]} 
                interval={3000}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">Why Choose Visionary Phoenix Academy?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">Training from Industrial Experts with real-world experience</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">100% Placement Support with top companies</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">Hands-on practical training with latest tools</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600">Industry-recognized certifications</p>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl text-white">
                  <h4 className="text-xl font-bold mb-3">Our Mission</h4>
                  <p className="text-blue-100 leading-relaxed">
                    To empower the next generation of cybersecurity professionals with cutting-edge skills, 
                    practical knowledge, and the confidence to lead in an ever-evolving digital landscape.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Our Approach</h3>
                  <p className="text-gray-600 mb-4">
                    At Visionary Phoenix Academy, we believe in learning by doing. Our curriculum is designed to provide hands-on experience with real-world scenarios, ensuring you're job-ready from day one.
                  </p>
                  <p className="text-gray-600">
                    Our state-of-the-art facilities and industry-standard tools create an immersive learning environment that mirrors real cybersecurity challenges.
                  </p>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <h3 className="text-xl font-bold text-orange-800 mb-4">Success Stories</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">1000+ Students Trained</p>
                        <p className="text-sm text-gray-600">in cybersecurity and ethical hacking</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">90% Placement Rate</p>
                        <p className="text-sm text-gray-600">in top cybersecurity firms</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Enrollment Form Section */}
      <section id="enroll" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Start Your <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Journey</span>
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands of successful professionals who transformed their careers with us
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Enroll With Us?</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Training from Industrial Experts</h4>
                        <p className="text-gray-600">Learn from professionals currently working in top cybersecurity firms</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">100% Placement Support</h4>
                        <p className="text-gray-600">Dedicated placement cell to help you land your dream job</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="preferred-course" className="block text-gray-700 font-semibold mb-2">Preferred Course *</label>
                    <select
                      id="preferred-course"
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select a course</option>
                      {courses.map((course, index) => (
                        <option key={course._id || index} value={course.name}>{course.name}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-lg text-lg font-semibold transition-all transform ${
                      isProcessing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-xl hover:scale-105'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader className="w-5 h-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      'Enroll Now'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">VP</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Visionary Phoenix Academy</h3>
                  <p className="text-gray-400">Rise. Learn. Lead.</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Empowering the next generation of cybersecurity professionals with industry-leading training and placement support.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <a href="mailto:visionaryphoenixacademy@gmail.com" className="text-gray-300 hover:text-orange-500 transition-colors">
                    visionaryphoenixacademy@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <a href="tel:8220397552" className="text-gray-300 hover:text-orange-500 transition-colors">
                    8220397552
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <Instagram className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <a href="https://instagram.com/visionary_phoenix_official" className="text-gray-300 hover:text-orange-500 transition-colors">
                    @visionary_phoenix_official
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-6">Visit Us</h4>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <address className="text-gray-300 not-italic leading-relaxed">
                  1st floor, Mettupalayam Road,<br />
                  next to petrol bunk,<br />
                  Periyanaickenpalayam,<br />
                  Tamil Nadu - 641020
                </address>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Visionary Phoenix Academy. All rights reserved. Built with passion for education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VisionaryPhoenixAcademy;