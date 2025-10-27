'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MinimalTiptap } from '@/components/ui/shadcn-io/minimal-tiptap'
import { Send, CheckCircle, AlertCircle, Loader2, Paperclip, Smile, Link } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailFormData {
  to: string
  cc?: string
  subject: string
  message: string
}

interface EmailValidationErrors {
  to?: string
  cc?: string
  subject?: string
  message?: string
}

type SendingStatus = 'idle' | 'sending' | 'success' | 'error'

export function EmailApp() {
  const [formData, setFormData] = useState<EmailFormData>({
    to: '',
    cc: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState<EmailValidationErrors>({})
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [showCc, setShowCc] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: EmailValidationErrors = {}

    // Validate recipient
    if (!formData.to.trim()) {
      newErrors.to = 'Recipient is required'
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    // Validate message
    if (!formData.message.trim() || formData.message === '<p></p>') {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof EmailFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Reset status when user modifies form
    if (sendingStatus !== 'idle') {
      setSendingStatus('idle')
      setStatusMessage('')
    }
  }

  const simulateEmailSending = async (): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    // Simulate random success/failure (95% success rate)
    if (Math.random() > 0.05) {
      return
    }
    throw new Error('Failed to send message. Please try again.')
  }

  const handleSendEmail = async () => {
    if (!validateForm()) {
      return
    }

    setSendingStatus('sending')
    setStatusMessage('Sending your message...')

    try {
      await simulateEmailSending()
      setSendingStatus('success')
      setStatusMessage('Message sent successfully!')
      
      // Reset form after successful send
      setTimeout(() => {
        setFormData({ to: '', cc: '', subject: '', message: '' })
        setSendingStatus('idle')
        setStatusMessage('')
        setShowCc(false)
      }, 2500)
      
    } catch (error) {
      setSendingStatus('error')
      setStatusMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  return (
    <div className="z-50 h-full bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-lg font-medium text-nowrap text-foreground">Nouveau message or contact me at <Button variant="link" className='link'>leospoutnik@gmail.com</Button></h1>
      </div>

      {/* Email Form */}
      <div className="flex-1 flex flex-col">
        {/* Recipients Section */}
        <div className="border-b border-border">
          {/* To Field */}
          <div className="flex items-center gap-3 p-2 border-b border-border">
            <span className="text-sm text-foreground w-24 flex-shrink-0">From</span>
            <Input
              size={1}
              type="text"
              placeholder="Set to 'anonymous' if you want to send an anonymous message"
              value={formData.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              className={cn(
                "border-0 shadow-none focus-visible:ring-0 px-2",
                errors.to && "text-red-500"
              )}
              disabled={sendingStatus === 'sending'}
            />
            <div className="flex items-center gap-2 text-sm text-foreground">
              <button 
                onClick={() => setShowCc(!showCc)}
                className="hover:text-foreground/80"
              >
                Contact
              </button>
            </div>
          </div>

          {/* CC Field (conditional) */}
          {showCc && (
            <div className="flex items-center gap-3 p-2 border-b border-border">
              <span className="text-sm text-foreground w-24 flex-shrink-0">Contact</span>
              <Input
                type="text"
                placeholder="Add a contact email if you want to receive a reply"
                value={formData.cc}
                onChange={(e) => handleInputChange('cc', e.target.value)}
                className={cn(
                  "border-0 shadow-none focus-visible:ring-0 px-2",
                  errors.cc && "text-red-500"
                )}
                disabled={sendingStatus === 'sending'}
              />
            </div>
          )}

          {/* Subject Field */}
          <div className="flex items-center gap-3 p-2 border-b border-border">
            <span className="text-sm text-foreground w-24 flex-shrink-0">Object</span>
            <Input
              type="text"
              placeholder=""
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className={cn(
                "border-0 shadow-none focus-visible:ring-0 px-2",
                errors.subject && "text-red-500"
              )}
              disabled={sendingStatus === 'sending'}
            />
          </div>
        </div>

        {/* Message Body */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <MinimalTiptap
              content={formData.message}
              onChange={(content) => handleInputChange('message', content)}
              placeholder=""
              editable={sendingStatus !== 'sending'}
              className={cn(
                "border-0 shadow-none min-h-[300px]",
                errors.message && "text-red-500"
              )}
            />
          </div>

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSendEmail}
                disabled={sendingStatus === 'sending'}
                className={cn(
                  "bg-blue-600 hover:bg-blue-700 text-foreground px-6",
                  sendingStatus === 'success' && "bg-green-500 hover:bg-green-600"
                )}
              >
                {sendingStatus === 'sending' ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : sendingStatus === 'success' ? (
                  <CheckCircle className="h-4 w-4 mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {sendingStatus === 'sending' ? 'Envoi...' : 
                 sendingStatus === 'success' ? 'Envoyé!' : 'Envoyer'}
              </Button>

              {/* Simplified Toolbar */}
              <div className="flex items-center gap-1 ml-4">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Link className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className={cn(
                "flex items-center gap-2 text-sm px-3 py-1 rounded",
                sendingStatus === 'sending' && "text-blue-600",
                sendingStatus === 'success' && "text-green-600",
                sendingStatus === 'error' && "text-red-600"
              )}>
                {sendingStatus === 'error' && <AlertCircle className="h-4 w-4" />}
                {statusMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}