import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ExternalLink, Wrench } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProject = async () => {
    setLoading(true);
    const projects = await storage.get(STORAGE_KEYS.PROJECTS);
    
    if (projects) {
      // UPDATE: Memastikan pencarian ID bekerja dengan benar (string comparison)
      const currentProject = projects.find(p => String(p.id) === String(id));
      setProject(currentProject);

      // Get related projects (same category, exclude current)
      if (currentProject) {
        const related = projects
          .filter(p => p.category === currentProject.category && String(p.id) !== String(id))
          .slice(0, 3);
        setRelatedProjects(related);
      }
    }
    
    setLoading(false);
  };

  // UPDATE: Memperbaiki format tanggal agar lebih rapi dan menangani jika date kosong
  const formatDate = (dateString) => {
    if (!dateString) return "Recent Project";
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-beige-dark border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-inter">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-4">Project Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-beige-dark transition-colors mb-8 animate-slideIn"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-inter font-medium">Back to Portfolio</span>
          </button>

          {/* Project Header */}
          <div className="animate-fadeIn">
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-beige-dark text-white text-sm font-inter font-semibold rounded-full uppercase tracking-wider">
                {project.category}
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-playfair font-bold text-gray-800 mb-6 leading-tight">
              {project.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 font-inter">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-beige-dark" />
                {/* UPDATE: Menggunakan field date dari database */}
                <span className="font-medium text-gray-700">{formatDate(project.date)}</span>
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-beige-dark hover:text-beige transition-colors font-medium border-b border-transparent hover:border-beige-dark"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Live Project</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Image */}
      <section className="pb-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-3xl overflow-hidden shadow-2xl animate-scaleIn border-[12px] border-white bg-white">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto object-cover"
              style={{ maxHeight: '600px' }}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&background=D2BD96&color=fff&size=800`;
              }}
            />
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-12 px-6 lg:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 animate-fadeIn">
              <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-6 border-b border-beige-lighter pb-4">
                About This Project
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 font-inter leading-relaxed whitespace-pre-line">
                  {/* UPDATE: Mendukung field full_description atau fallback ke description */}
                  {project.full_description || project.description}
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {/* Tools Used */}
              {project.tools && project.tools.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-beige-lighter">
                  <div className="flex items-center space-x-2 mb-4">
                    <Wrench className="w-5 h-5 text-beige-dark" />
                    <h3 className="font-inter font-bold text-gray-800">Tools Used</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-beige-lighter text-beige-dark text-sm font-inter font-medium rounded-full"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Info Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-beige-lighter">
                <h3 className="font-inter font-bold text-gray-800 mb-4 border-b pb-2">Project Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-inter">Category</span>
                    <p className="text-gray-800 font-inter font-bold uppercase">{project.category}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-inter">Release Date</span>
                    <p className="text-gray-800 font-inter font-bold">{formatDate(project.date)}</p>
                  </div>
                  {project.link && (
                    <div className="pt-2">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full btn-primary text-center flex items-center justify-center gap-2"
                      >
                        Visit Project <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 px-6 lg:px-12 bg-white border-t border-beige-lighter">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-playfair font-bold text-gray-800 mb-12 text-center">
              More Projects In <span className="text-beige-dark italic">{project.category}</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((relatedProject, index) => (
                <div
                  key={relatedProject.id}
                  className="bg-[#FAF9F6] rounded-2xl overflow-hidden shadow-lg card-hover animate-fadeIn cursor-pointer border border-beige-lighter"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/project/${relatedProject.id}`)}
                >
                  <div className="relative h-48 overflow-hidden bg-beige-lighter">
                    <img
                      src={relatedProject.image}
                      alt={relatedProject.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(relatedProject.title)}&background=D2BD96&color=fff&size=400`;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-beige-lighter text-beige-dark text-xs font-inter font-bold rounded-full mb-3 uppercase tracking-wider">
                      {relatedProject.category}
                    </span>
                    <h3 className="text-xl font-playfair font-bold text-gray-800 mb-2 truncate">
                      {relatedProject.title}
                    </h3>
                    <p className="text-gray-600 font-inter text-sm line-clamp-2">
                      {relatedProject.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default ProjectDetail;