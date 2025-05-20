import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I choose a plant?",
      answer:
        "To choose a plant, consider factors like light levels, watering needs, space size, and maintenance requirements.",
    },
    {
      question: "How often should I prune my bonsai to maintain its shape?",
      answer:
        "You should prune your bonsai every 4-6 weeks during the growing season to maintain its shape and encourage healthy growth.",
    },
    {
      question: "Which bonsai species are easiest to shape for beginners?",
      answer:
        "Ficus, Juniper, and Chinese Elm are some of the easiest bonsai species for beginners due to their resilience and adaptability.",
    },
    {
      question:
        "How long does it take for a bonsai tree to develop its final form?",
      answer:
        "It can take anywhere from 3 to 10 years for a bonsai tree to develop its final form, depending on the species and care provided.",
    },
    {
      question: "How do I shape my bonsai tree to achieve a natural look?",
      answer:
        "Prune selectively, wire branches gently, and mimic how trees grow in nature. Avoid overly symmetrical shapes.",
    },
    {
      question:
        "What is the difference between formal and informal bonsai styles?",
      answer:
        "Formal bonsai styles have straight, upright trunks and symmetrical branches, while informal styles feature curved trunks and asymmetry.",
    },
    {
      question: "Can I correct a poorly shaped bonsai? If so, how?",
      answer:
        "Yes, you can correct a poorly shaped bonsai by pruning, wiring, and sometimes repotting. Be patient, reshaping may take several seasons.",
    },
    {
      question: "What tools do I need for bonsai styling and shaping?",
      answer:
        "Basic tools include pruning shears, concave cutters, wire cutters, and bonsai wire for shaping branches.",
    },
    {
      question: "What is the best way to care for a bonsai tree?",
      answer:
        "The best way to care for a bonsai tree is to water it regularly, fertilize it, and prune it regularly.",
    },
    {
      question: "What is the best way to care for a bonsai tree?",
      answer:
        "The best way to care for a bonsai tree is to water it regularly, fertilize it, and prune it regularly.",
    },
  ];

  const handleToggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section
      className="w-full min-h-screen py-12 px-6 md:px-20 flex items-center-safe"
      style={{
        backgroundColor: '#1A2C2A',
      }}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-start mb-4">
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{
              background: 'linear-gradient(to right, #2DBC3C 0%, #FAFAFA 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Still have a question? <br /> About plant posing.
          </h2>
        </div>
        <hr className="border-t border-gray-500 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex items-start cursor-pointer"
              onClick={() => handleToggle(index)}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 mr-3 text-white bg-green-600 rounded-full transition-all">
                {openIndex === index ? <FiMinus size={16} /> : <FiPlus size={16} />}
              </span>
              <div>
                <h3 className="text-md font-medium text-gray-800">{faq.question}</h3>
                {openIndex === index && faq.answer && (
                  <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
