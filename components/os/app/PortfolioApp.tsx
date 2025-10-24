'use client'

export function PortfolioApp() {
  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
            P
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to My Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Full-Stack Developer passionate about creating beautiful, functional, and user-friendly applications
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">3+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
            <div className="text-gray-600">Technologies</div>
          </div>
        </div>

        {/* Featured Skills */}
        <div className="bg-white rounded-lg p-8 shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Core Technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'React', icon: '⚛️', color: 'bg-blue-100 text-blue-800' },
              { name: 'Next.js', icon: '▲', color: 'bg-gray-100 text-gray-800' },
              { name: 'TypeScript', icon: '📘', color: 'bg-blue-100 text-blue-800' },
              { name: 'Node.js', icon: '🟢', color: 'bg-green-100 text-green-800' },
              { name: 'Python', icon: '🐍', color: 'bg-yellow-100 text-yellow-800' },
              { name: 'PostgreSQL', icon: '🐘', color: 'bg-blue-100 text-blue-800' },
              { name: 'AWS', icon: '☁️', color: 'bg-orange-100 text-orange-800' },
              { name: 'Docker', icon: '🐳', color: 'bg-blue-100 text-blue-800' },
            ].map((tech) => (
              <div key={tech.name} className={`${tech.color} rounded-lg p-3 text-center`}>
                <div className="text-2xl mb-1">{tech.icon}</div>
                <div className="text-sm font-medium">{tech.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Work */}
        <div className="bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Work</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                E-commerce Platform
              </h3>
              <p className="text-gray-600 mb-2">
                Full-stack e-commerce solution built with Next.js, featuring real-time inventory management, 
                payment processing, and admin dashboard.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Next.js</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">PostgreSQL</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Stripe</span>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Task Management App
              </h3>
              <p className="text-gray-600 mb-2">
                Collaborative task management application with real-time updates, 
                drag-and-drop functionality, and team collaboration features.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">React</span>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Socket.io</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">MongoDB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}