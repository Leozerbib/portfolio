'use client'

export function ProjectsApp() {
  const projects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce solution with modern UI/UX, real-time inventory management, and secure payment processing.',
      image: '🛒',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
      status: 'Completed',
      github: '#',
      demo: '#',
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative project management tool with real-time updates, drag-and-drop functionality, and team collaboration.',
      image: '📋',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Material-UI'],
      status: 'Completed',
      github: '#',
      demo: '#',
    },
    {
      id: 3,
      title: 'Portfolio OS',
      description: 'Interactive portfolio website designed as an operating system interface with 3D elements and animations.',
      image: '💻',
      technologies: ['Next.js', 'Three.js', 'Framer Motion', 'TypeScript', 'Tailwind CSS'],
      status: 'In Progress',
      github: '#',
      demo: '#',
    },
    {
      id: 4,
      title: 'API Gateway',
      description: 'Microservices API gateway with authentication, rate limiting, and request routing capabilities.',
      image: '🌐',
      technologies: ['Node.js', 'Express', 'Redis', 'JWT', 'Docker'],
      status: 'Completed',
      github: '#',
      demo: '#',
    },
    {
      id: 5,
      title: 'Real-time Chat App',
      description: 'Modern chat application with real-time messaging, file sharing, and group chat functionality.',
      image: '💬',
      technologies: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Cloudinary'],
      status: 'Completed',
      github: '#',
      demo: '#',
    },
    {
      id: 6,
      title: 'Data Visualization Dashboard',
      description: 'Interactive dashboard for data visualization with charts, graphs, and real-time data updates.',
      image: '📊',
      technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL'],
      status: 'In Progress',
      github: '#',
      demo: '#',
    },
  ]

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Projects</h1>
          <p className="text-gray-600">
            A collection of projects showcasing my skills in full-stack development, 
            UI/UX design, and modern web technologies.
          </p>
        </div>

        {/* Filter/Stats */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-600">Total Projects: </span>
            <span className="font-semibold text-gray-800">{projects.length}</span>
          </div>
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-600">Completed: </span>
            <span className="font-semibold text-green-600">
              {projects.filter(p => p.status === 'Completed').length}
            </span>
          </div>
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-600">In Progress: </span>
            <span className="font-semibold text-blue-600">
              {projects.filter(p => p.status === 'In Progress').length}
            </span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Project Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{project.image}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        project.status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-gray-800 text-white py-2 px-4 rounded text-sm hover:bg-gray-700 transition-colors">
                    <span className="mr-2">📱</span>
                    View Demo
                  </button>
                  <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm hover:bg-gray-300 transition-colors">
                    <span className="mr-2">💻</span>
                    Source Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Interested in Working Together?</h2>
          <p className="text-gray-600 mb-6">
            I'm always open to discussing new opportunities and exciting projects.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Get In Touch
          </button>
        </div>
      </div>
    </div>
  )
}