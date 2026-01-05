import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const projectsData = await storage.get(STORAGE_KEYS.PROJECTS);
    if (projectsData) {
      // Sort berdasarkan ID terbaru (Urutan descending)
      const sortedProjects = [...projectsData]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);
      setProjects(sortedProjects);
    }
  };

  const scrollToPortfolio = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="py-20 px-6 lg:px-12 bg-beige-lightest">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-800">
              My Featured{' '}
              <span className="text-beige-dark font-inter font-extrabold italic text-4xl lg:text-5xl">
                Project
              </span>
            </h2>
          </div>
          <button
            onClick={scrollToPortfolio}
            className="hidden md:flex items-center space-x-2 text-beige-dark font-inter font-semibold hover:text-beige transition-colors group"
          >
            <span>View More</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover animate-fadeIn cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => navigate(`/project/${project.id}`)}
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden bg-beige-lighter">
                <img
                  src={Array.isArray(project.image) ? project.image[0] : project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&background=D2BD96&color=fff&size=512`;
                  }}
                />
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-beige-dark hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()} // Mencegah navigasi detail saat ikon eksternal diklik
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-beige-lighter text-beige-dark text-xs font-inter font-semibold rounded-full uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-2 truncate">
                  {project.title}
                </h3>
                <p className="text-gray-600 font-inter text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center space-x-2 text-beige-dark font-inter font-semibold hover:text-beige transition-colors group">
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View More Button */}
        <div className="md:hidden mt-8 text-center">
          <button
            onClick={scrollToPortfolio}
            className="px-8 py-3 bg-beige-dark text-white rounded-full font-bold shadow-lg active:scale-95 transition-all"
          >
            View More Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;