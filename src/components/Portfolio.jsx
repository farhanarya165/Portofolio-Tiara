import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../utils/storage';

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayCount, setDisplayCount] = useState(6);
  const navigate = useNavigate();

  const categories = [
    'All',
    'Social Media',
    'Content Creator',
    'Content Production',
    'Creative Campaign'
  ];

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [activeCategory, projects]);

  const loadProjects = async () => {
    const projectsData = await storage.get(STORAGE_KEYS.PROJECTS);
    if (projectsData) {
      // Urutkan berdasarkan tanggal terbaru
      const sortedProjects = projectsData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setProjects(sortedProjects);
    }
  };

  const filterProjects = () => {
    if (activeCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === activeCategory));
    }
    setDisplayCount(6);
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  return (
    <section id="portfolio" className="py-20 px-6 lg:px-12 bg-beige-lightest">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold mb-4">
            Let's take a look at{' '}
            <span className="text-beige-dark font-inter font-extrabold italic">
              my Portfolio
            </span>
          </h2>
          <p className="text-gray-600 font-inter max-w-2xl mx-auto">
            Explore my creative projects — from social media campaigns to content production and creative strategies.
          </p>
        </div>

        {/* Filter Kategori */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2.5 rounded-full font-inter font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-beige-dark text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-beige-lighter hover:text-beige-dark'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid Proyek */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.slice(0, displayCount).map((project, index) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative h-56 overflow-hidden bg-beige-lighter">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300/D2BD96/FFFFFF?text=Project+Image';
                  }}
                />
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-beige-dark hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>

              <div className="p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-beige-lighter text-beige-dark text-xs font-inter font-semibold rounded-full">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-playfair font-bold text-gray-800 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 font-inter text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                <button
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="flex items-center space-x-2 text-beige-dark font-inter font-semibold hover:text-beige transition-colors group"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length > displayCount && (
          <div className="text-center mt-12">
            <button onClick={loadMore} className="btn-primary">View More Projects</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;