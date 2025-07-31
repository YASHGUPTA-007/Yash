'use client';
import { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    setStatusMessage('');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      // Check if the response is JSON before parsing
      const contentType = res.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!isJson) {
        // If it's not JSON, it's likely an HTML error page
        const textResponse = await res.text();
        console.error('Server returned non-JSON response:', textResponse);
        
        setStatus('error');
        setStatusMessage('Server configuration error. Please try again later or contact support.');
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setStatusMessage('Thank you! Your message has been sent successfully.');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setStatusMessage(data.details || data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
      setStatusMessage('Something went wrong. Please try again later.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusClasses = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'loading':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Get In Touch</h2>
        <p className="text-gray-600">I'd love to hear from you. Send me a message and I'll respond as soon as possible.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4 mr-2" />
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 bg-white placeholder-gray-500 ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.name && (
            <p className="text-sm text-red-600 flex items-center">
              <XCircle className="w-4 h-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
            <Mail className="w-4 h-4 mr-2" />
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-gray-900 bg-white placeholder-gray-500 ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center">
              <XCircle className="w-4 h-4 mr-1" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label htmlFor="message" className="flex items-center text-sm font-medium text-gray-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Tell me about your project or just say hello..."
            value={form.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical text-gray-900 bg-white placeholder-gray-500 ${
              errors.message ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.message && (
            <p className="text-sm text-red-600 flex items-center">
              <XCircle className="w-4 h-4 mr-1" />
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
            status === 'loading'
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg'
          }`}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </>
          )}
        </button>

        {/* Status Message */}
        {statusMessage && (
          <div className={`p-4 rounded-lg border flex items-center space-x-2 ${getStatusClasses()}`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">{statusMessage}</span>
          </div>
        )}
      </form>

      {/* Additional Info */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          You can also reach me directly at{' '}
          <a href="mailto:yash.gupta.11.7.2004@gmail.com" className="text-blue-600 hover:text-blue-700 font-medium">
            yash.gupta.11.7.2004@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}