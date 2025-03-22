import React, { useState, useEffect } from 'react';
import { Car, Briefcase, GraduationCap, Languages, Award, Mail, Phone, MapPin, ChevronRight, PenTool as Tool, Gauge, Target, LogOut, User } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ReactNode> = {
  Gauge: <Gauge className="w-12 h-12 text-blue-400 mx-auto mb-4" />,
  Target: <Target className="w-12 h-12 text-blue-400 mx-auto mb-4" />,
  Tool: <Tool className="w-12 h-12 text-blue-400 mx-auto mb-4" />
};

function Resume() {
  const { data } = useResume();
  const { isAuthenticated, user, logout } = useAuth();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogout = async () => {
    await logout();
    // Force a page refresh to ensure all auth state is cleared
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Auth Buttons */}
      <div className="absolute top-4 right-4 z-20 flex space-x-4">
        {isAuthenticated ? (
          <>
            <Link 
              to="/admin" 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow transition-colors flex items-center"
            >
              <User className="w-4 h-4 mr-2" />
              Admin Panel
            </Link>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow transition-colors flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
      
      {/* Hero Section */}
      <header className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <div className="absolute inset-0">
            <div className="absolute w-full h-full">
              {/* Animated background shapes */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full mix-blend-overlay"
                  style={{
                    width: `${Math.random() * 300 + 100}px`,
                    height: `${Math.random() * 300 + 100}px`,
                    background: `radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.1) 100%)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `translate(${mousePosition.x * (i + 1) * 0.3}px, ${mousePosition.y * (i + 1) * 0.3}px)`,
                    transition: 'transform 0.2s ease-out'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="z-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <div 
              className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center"
              style={{
                transform: `translate(${mousePosition.x * -0.5}px, ${mousePosition.y * -0.5}px)`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              <Car className="w-12 h-12" />
            </div>
          </div>
          <div
            style={{
              transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
              transition: 'transform 0.2s ease-out'
            }}
          >
            <h1 className="text-5xl font-bold mb-4">{data.profile.name}</h1>
            <h2 className="text-2xl text-gray-300">{data.profile.title}</h2>
            <div className="flex items-center justify-center gap-6 mt-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <a href={`mailto:${data.profile.email}`} className="hover:text-white">{data.profile.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span>{data.profile.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{data.profile.location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {data.stats.map((stat) => (
            <div key={stat.id} className="bg-gray-800 p-6 rounded-lg shadow-xl text-center transform hover:scale-105 transition-transform">
              {iconMap[stat.icon]}
              <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Profile Section */}
        <section className="mb-16 bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <Car className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold">Profile</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">
            {data.profile.description}
          </p>
        </section>

        {/* Experience Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Briefcase className="w-8 h-8 text-blue-400" />
            <h2 className="text-2xl font-bold">Professional Experience</h2>
          </div>
          
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-12 bg-gray-800 p-8 rounded-lg shadow-xl transform hover:scale-[1.02] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-400">{exp.company}</h3>
                  <p className="text-lg">{exp.position}</p>
                </div>
                <span className="text-gray-400">{exp.period}</span>
              </div>
              <ul className="space-y-4">
                {exp.challenges.map((item) => (
                  <li key={item.id} className="flex items-start gap-2">
                    <ChevronRight className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-300">Challenge: {item.challenge}</p>
                      <p className="text-gray-400 mt-1">{item.result}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-gray-800 p-8 rounded-lg shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              <h2 className="text-2xl font-bold">Education</h2>
            </div>
            <ul className="space-y-4">
              {data.education.map((edu) => (
                <li key={edu.id}>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-gray-400">{edu.institution}</p>
                  <p className="text-gray-500">{edu.period}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-800 p-8 rounded-lg shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <Award className="w-8 h-8 text-blue-400" />
              <h2 className="text-2xl font-bold">Skills & Tools</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills
                    .filter(skill => skill.category === 'core')
                    .map((skill) => (
                      <span key={skill.id} className="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full text-sm">
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-400">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {data.skills
                    .filter(skill => skill.category === 'tool')
                    .map((skill) => (
                      <span key={skill.id} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                        {skill.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gray-900 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <p className="text-gray-400">© 2024 {data.profile.name}</p>
          <div className="flex items-center gap-4">
            <Languages className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">{data.languages.join(', ')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Resume;