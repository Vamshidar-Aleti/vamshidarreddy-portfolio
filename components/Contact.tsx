import React, { useState, useRef } from 'react';
import { CONTACT } from '../constants';
import { SendIcon } from './Icons';
import useScrollAnimation from '../hooks/useScrollAnimation';

// Since emailjs is loaded from a script tag in index.html, we declare it to TypeScript
// to avoid type errors.
declare const emailjs: {
  sendForm: (
    serviceID: string,
    templateID: string,
    form: HTMLFormElement
  ) => Promise<{ status: number; text: string }>;
};

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [titleRef, isTitleVisible] = useScrollAnimation<HTMLDivElement>();
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [infoRef, isInfoVisible] = useScrollAnimation<HTMLDivElement>();
  // FIX: Explicitly provide HTMLDivElement type to the generic useScrollAnimation hook.
  const [formCardRef, isFormCardVisible] = useScrollAnimation<HTMLDivElement>();

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    // Basic validation
    const formData = new FormData(formRef.current);
    if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
      setStatus('error');
      setStatusMessage('Please fill out all fields before sending.');
      return;
    }

    setStatus('sending');
    setStatusMessage('');

    // --- ACTION REQUIRED ---
    // 2. PASTE YOUR SERVICE ID HERE
    // Find this on the "Email Services" page in your EmailJS dashboard.
    const serviceID = 'service_ld153cg';

    // 3. PASTE YOUR TEMPLATE ID HERE
    // Find this on the "Settings" tab of the email template you just created.
    const templateID = 'template_db12z0n';

    emailjs.sendForm(serviceID, templateID, formRef.current)
      .then(() => {
        setStatus('success');
        setStatusMessage('Message sent successfully! I will get back to you soon.');
        formRef.current?.reset();
      }, (error) => {
        setStatus('error');
        setStatusMessage('Failed to send message. Please try again later.');
        console.error('EmailJS Error:', error);
      });
  };

  const isSending = status === 'sending';

  return (
    <section id="contact" className="py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div 
          ref={titleRef}
          className={`text-center mb-12 scroll-reveal ${isTitleVisible ? 'scroll-reveal--visible' : ''}`}
        >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get In <span className="gradient-text">Touch</span>
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-slate-400">
              {CONTACT.description}
            </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information Card */}
          <div 
            ref={infoRef}
            className={`bg-slate-900/50 p-8 rounded-lg border border-slate-700 scroll-reveal ${isInfoVisible ? 'scroll-reveal--visible' : ''}`}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
            <ul className="space-y-2">
              {CONTACT.info.map((item) => {
                const IconComponent = item.icon;
                const content = (
                  <>
                    <div className="flex-shrink-0 p-2 bg-slate-800 rounded-full border border-slate-700 text-orange-400">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-300">{item.name}</h4>
                      <p className={`text-slate-400 break-all ${item.href ? 'group-hover:text-orange-400 transition-colors' : ''}`}>
                        {item.value}
                      </p>
                    </div>
                  </>
                );

                return (
                  <li key={item.name}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-4 p-4 rounded-lg transition-colors duration-300 hover:bg-slate-800"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-start gap-4 p-4 rounded-lg">
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Form Card */}
          <div 
            ref={formCardRef}
            className={`bg-slate-900/50 p-8 rounded-lg border border-slate-700 scroll-reveal ${isFormCardVisible ? 'scroll-reveal--visible' : ''}`}
            style={{ transitionDelay: '200ms' }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Send a Message</h3>
            <form ref={formRef} onSubmit={sendEmail} noValidate>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="sr-only">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Your Name"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Your Email"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    placeholder="Your Message"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-md py-3 px-4 text-slate-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition resize-none"
                  ></textarea>
                </div>
              </div>
              <button 
                type="submit"
                disabled={isSending}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-slate-100 disabled:bg-slate-500 disabled:cursor-not-allowed"
              >
                <SendIcon className="w-5 h-5" />
                <span>{isSending ? 'Sending...' : 'Send Message'}</span>
              </button>
              {status !== 'idle' && status !== 'sending' && (
                <p className={`mt-4 text-center text-sm font-medium ${
                    status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;