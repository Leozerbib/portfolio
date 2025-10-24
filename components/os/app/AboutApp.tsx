'use client'

export function AboutApp() {
  return (
    <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
            👤
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Me</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Passionate developer with a love for creating innovative solutions and beautiful user experiences
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Bio Section */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Story</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Hello! I'm a passionate full-stack developer with over 3 years of experience in creating 
                web applications that combine functionality with beautiful design. My journey in tech started 
                with a curiosity about how websites work, which quickly evolved into a deep passion for 
                building digital experiences that make a difference.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                I specialize in modern web technologies including React, Next.js, and TypeScript on the frontend, 
                and Node.js, Python, and various databases on the backend. I'm particularly interested in 
                creating intuitive user interfaces and optimizing application performance.
              </p>
              <p className="text-gray-600 leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source 
                projects, or sharing knowledge with the developer community through blog posts and mentoring.
              </p>
            </div>
          </div>

          {/* Skills & Expertise */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Technical Skills</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Frontend Development</span>
                    <span className="text-sm text-gray-500">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Backend Development</span>
                    <span className="text-sm text-gray-500">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">UI/UX Design</span>
                    <span className="text-sm text-gray-500">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">DevOps & Cloud</span>
                    <span className="text-sm text-gray-500">80%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Experience</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Senior Full-Stack Developer</h4>
                  <p className="text-sm text-gray-600 mb-2">Tech Company • 2022 - Present</p>
                  <p className="text-sm text-gray-600">
                    Leading development of scalable web applications and mentoring junior developers.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Full-Stack Developer</h4>
                  <p className="text-sm text-gray-600 mb-2">Startup Inc • 2021 - 2022</p>
                  <p className="text-sm text-gray-600">
                    Built and maintained multiple client projects using modern web technologies.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-800">Frontend Developer</h4>
                  <p className="text-sm text-gray-600 mb-2">Digital Agency • 2020 - 2021</p>
                  <p className="text-sm text-gray-600">
                    Developed responsive websites and web applications for various clients.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interests & Hobbies */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Beyond Code</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <h4 className="font-medium text-gray-800 mb-1">Learning</h4>
                <p className="text-sm text-gray-600">Always exploring new technologies and frameworks</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎨</div>
                <h4 className="font-medium text-gray-800 mb-1">Design</h4>
                <p className="text-sm text-gray-600">Creating beautiful and functional user interfaces</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌱</div>
                <h4 className="font-medium text-gray-800 mb-1">Open Source</h4>
                <p className="text-sm text-gray-600">Contributing to community projects and libraries</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-medium text-gray-800 mb-1">Mentoring</h4>
                <p className="text-sm text-gray-600">Helping others learn and grow in their careers</p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Let's Work Together</h3>
            <p className="mb-6 opacity-90">
              I'm always interested in new opportunities and exciting projects. 
              Let's discuss how we can bring your ideas to life!
            </p>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}