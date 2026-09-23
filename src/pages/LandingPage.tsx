import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  Wand2,
  Box,
  Download,
  Shield,
  Zap,
  Layers,
  ArrowRight,
  Sparkles,
  Globe,
  Palette,
} from 'lucide-react';
import HeroScene from '../three/HeroScene';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ModelForge</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How it Works</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-indigo-300">AI-Powered 3D Generation</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Create 3D Models
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  From Imagination
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                Transform your ideas into stunning 3D models with our AI-powered platform.
                Generate, customize, and export professional-quality 3D assets in seconds.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl font-medium hover:opacity-90 transition-opacity text-lg"
                >
                  Start Creating
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl font-medium hover:bg-gray-800 transition-colors text-lg"
                >
                  Learn More
                </a>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-white">10K+</p>
                  <p className="text-sm text-gray-500">Models Created</p>
                </div>
                <div className="w-px h-10 bg-gray-800" />
                <div>
                  <p className="text-2xl font-bold text-white">5K+</p>
                  <p className="text-sm text-gray-500">Active Users</p>
                </div>
                <div className="w-px h-10 bg-gray-800" />
                <div>
                  <p className="text-2xl font-bold text-white">99%</p>
                  <p className="text-sm text-gray-500">Satisfaction</p>
                </div>
              </div>
            </div>

            <div className="relative h-[500px] rounded-3xl overflow-hidden border border-gray-800/50 bg-gray-900/50">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              }>
                <HeroScene />
              </Suspense>
              <div className="absolute bottom-4 left-4 right-4 bg-gray-900/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Live 3D Preview</p>
                    <p className="text-xs text-gray-400">Interactive Three.js viewport</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to create, edit, and manage 3D models in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Wand2,
                title: 'AI Generation',
                description: 'Generate 3D models from text descriptions with advanced AI algorithms.',
                color: 'from-indigo-500 to-blue-500',
              },
              {
                icon: Box,
                title: '3D Editor',
                description: 'Full-featured editor with transform controls, materials, and lighting.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Download,
                title: 'Export Anywhere',
                description: 'Export to GLTF, GLB, and OBJ formats for use in any 3D application.',
                color: 'from-cyan-500 to-blue-500',
              },
              {
                icon: Palette,
                title: 'Material Editor',
                description: 'Customize colors, roughness, metalness, and wireframe rendering.',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: Shield,
                title: 'Secure Storage',
                description: 'Your models are safely stored with JWT authentication and encryption.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Globe,
                title: 'Web-Based',
                description: 'No downloads needed. Access from any modern web browser instantly.',
                color: 'from-pink-500 to-rose-500',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-gray-900/50 border border-gray-800/50 rounded-2xl hover:border-gray-700/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 text-lg">Three simple steps to create your 3D model</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Describe', desc: 'Enter a text prompt describing your desired 3D model, choose category and style.' },
              { step: '02', title: 'Generate', desc: 'Our AI processes your request and generates a high-quality 3D model in seconds.' },
              { step: '03', title: 'Export', desc: 'Preview, customize, and export your model in GLTF, GLB, or OBJ format.' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="text-6xl font-bold text-indigo-500/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl">
            <h2 className="text-4xl font-bold mb-4">Ready to Create?</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of creators building amazing 3D models with ModelForge.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl font-medium hover:opacity-90 transition-opacity text-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">ModelForge</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 ModelForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
