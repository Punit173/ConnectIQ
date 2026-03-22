'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Code2, 
  MessageCircle, 
  Play, 
  Settings2,
  AlertTriangle 
} from 'lucide-react'

const interviewTypes = [
  {
    id: 'behavioral',
    title: 'Behavioral & HR',
    description: 'Test your soft skills. "Tell me about yourself", adaptability, and culture fit.',
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
    questions: 10
  },
  {
    id: 'technical',
    title: 'Technical Coding',
    description: 'Solve algorithmic challenges and explain your logic in real-time.',
    icon: Code2,
    color: 'from-emerald-500 to-teal-500',
    questions: 5
  },
  {
    id: 'domain',
    title: 'Domain Specific',
    description: 'Deep dive into specialized roles like Frontend, Backend, AI, or Data Science.',
    icon: Settings2,
    color: 'from-orange-500 to-red-500',
    questions: 15
  }
]

export default function InterviewSelectionPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleStart = () => {
    if (selectedType) {
      router.push(`/dashboard/interview/${selectedType}`)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-2">
          Select Interview Type
        </h1>
        <p className="text-muted-foreground">Choose the simulation that matches your goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {interviewTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedType(type.id)}
            className={`cursor-pointer rounded-2xl p-6 border transition-all relative overflow-hidden group ${
              selectedType === type.id 
                ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                : 'border-border bg-card/50 hover:border-primary/50'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${type.color} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity`} />
            
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
              <type.icon className="w-6 h-6" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">{type.title}</h3>
            <p className="text-muted-foreground text-sm mb-6 min-h-[40px]">
              {type.description}
            </p>
            
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <MessageCircle className="w-4 h-4 mr-2" />
              {type.questions} Questions
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end pt-8 border-t border-border">
        <button
          onClick={handleStart}
          disabled={!selectedType}
          className="flex items-center px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          Begin Simulation
          <Play className="ml-2 w-5 h-5 fill-current" />
        </button>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
        <div>
          <h4 className="font-semibold text-yellow-500 mb-1">Pre-Check Required</h4>
          <p className="text-sm text-yellow-500/80">Make sure your camera and microphone are working. Find a quiet, well-lit environment for the best AI analysis results.</p>
        </div>
      </div>
    </div>
  )
}
