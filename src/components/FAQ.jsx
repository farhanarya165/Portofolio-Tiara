import React, { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { Plus, Minus } from 'lucide-react';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-beige-light rounded-2xl overflow-hidden mb-4 transition-all bg-white shadow-sm hover:shadow-md">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-5 flex justify-between items-center text-left hover:bg-beige-lighter/30 transition-colors"
      >
        <span className="font-inter font-bold text-gray-800 pr-4">{question}</span>
        <div className="bg-beige-lighter p-1 rounded-full">
          {isOpen ? (
            <Minus className="text-beige-dark shrink-0" size={18} />
          ) : (
            <Plus className="text-beige-dark shrink-0" size={18} />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="p-5 bg-white border-t border-beige-light text-gray-600 font-inter text-sm animate-slideDown leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const Faq = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const loadFaq = async () => {
      const data = await storage.get(STORAGE_KEYS.FAQ);
      if (data) setFaqs(data);
    };
    loadFaq();
  }, []);

  const midIndex = Math.ceil(faqs.length / 2);
  const leftCol = faqs.slice(0, midIndex);
  const rightCol = faqs.slice(midIndex);

  return (
    <section id="faq" className="py-24 px-6 lg:px-12 bg-beige-lightest">
      <div className="container mx-auto">
        {/* Updated Section Header to English */}
        <div className="text-center mb-16 animate-fadeIn">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-800 mb-4">
            Got Any Question?{' '}
            <span className="text-beige-dark font-inter font-extrabold italic block mt-2 lg:mt-0 lg:inline">
              We’ve Got Answers
            </span>
          </h2>
          <p className="text-gray-600 font-inter max-w-2xl mx-auto">
            Find answers to some common questions about collaboration and my creative services.
          </p>
        </div>
        
        {/* Layout Grid FAQ */}
        <div className={`grid gap-x-8 gap-y-0 ${faqs.length > 4 ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
          <div className="flex flex-col animate-slideIn">
            {leftCol.map((faq) => (
              <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
            ))}
          </div>
          {faqs.length > 4 && (
            <div className="flex flex-col animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {rightCol.map((faq) => (
                <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          )}
        </div>

        {faqs.length === 0 && (
          <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-beige-dark/30">
            <p className="text-gray-400 italic font-inter">No questions available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Faq;