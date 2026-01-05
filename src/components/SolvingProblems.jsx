import { Sparkles, Users, Video, Megaphone } from 'lucide-react';

const SolvingProblems = () => {
  const services = [
    {
      icon: Users,
      number: '01',
      title: 'Social Media',
      description: 'Strategic social media management',
      items: ['Brand awareness campaigns', 'Social media planning']
    },
    {
      icon: Sparkles,
      number: '02',
      title: 'Content Creator',
      description: 'Engaging content creation',
      items: ['Visual storytelling', 'Content strategy']
    },
    {
      icon: Video,
      number: '03',
      title: 'Content Production',
      description: 'Professional content production',
      items: ['Video production', 'Photo shooting']
    },
    {
      icon: Megaphone,
      number: '04',
      title: 'Creative Campaign',
      description: 'Innovative campaign strategies',
      items: ['Campaign planning', 'Brand positioning']
    }
  ];

  return (
    <section className="py-20 px-6 lg:px-12 bg-[#FAF9F6]">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-slideIn">
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-800 mb-4">
              Solving problems through{' '}
              <span className="text-beige-dark font-inter font-extrabold italic">
                creative content
              </span>
            </h2>
            <p className="text-gray-600 font-inter leading-relaxed">
              I help brands and businesses communicate effectively through strategic digital content and creative campaigns. From concept to execution, I deliver results that matter.
            </p>
          </div>

          {/* Right Content - Services List */}
          <div className="space-y-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 card-hover animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-beige-lighter flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-beige-dark" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-beige-dark font-inter font-bold text-sm">
                      {service.number}
                    </span>
                    <h3 className="text-xl font-playfair font-bold text-gray-800">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 font-inter text-sm mb-2">
                    {service.description}
                  </p>
                  <ul className="space-y-1">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="text-gray-500 font-inter text-xs flex items-center">
                        <span className="w-1.5 h-1.5 bg-beige-dark rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolvingProblems;