'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function ContactApp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  if (submitted) {
    return (
      <div className="h-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for reaching out. I'll get back to you as soon as possible.
          </p>
          <Button 
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send Another Message
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-cyan-50 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a project in mind or just want to chat? I'd love to hear from you!
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">your.email@example.com</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💼</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">LinkedIn</h3>
                    <p className="text-gray-600">linkedin.com/in/yourprofile</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💻</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">GitHub</h3>
                    <p className="text-gray-600">github.com/yourusername</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Website</h3>
                    <p className="text-gray-600">yourportfolio.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Freelance Projects</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Full-time Opportunities</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Open to Discuss</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Consulting</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="mt-1 min-h-[120px]"
                  placeholder="Tell me about your project or just say hello!"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                I typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">What's your typical response time?</h3>
                <p className="text-gray-600 text-sm">
                  I usually respond to emails within 24 hours during business days. For urgent matters, 
                  feel free to mention it in your message.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Do you work on small projects?</h3>
                <p className="text-gray-600 text-sm">
                  Absolutely! I enjoy working on projects of all sizes, from small website updates 
                  to large-scale applications.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">What's your preferred way to communicate?</h3>
                <p className="text-gray-600 text-sm">
                  Email is great for initial contact, but I'm flexible and can adapt to your preferred 
                  communication method (Slack, Discord, video calls, etc.).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}