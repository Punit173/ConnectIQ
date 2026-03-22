'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Code2, 
  Beaker, 
  PenTool, 
  Briefcase, 
  Play, 
  FileText, 
  UploadCloud
} from 'lucide-react'

// Job Roles Config
const jobRoles = [
  {
    id: 'sde-intern',
    title: 'SDE Intern',
    icon: Code2,
    color: 'bg-blue-500',
    description: 'Data structures, algorithms, and core CS fundamentals.',
    skills: ['Java/C++', 'DSA', 'OOPs', 'System Design Basics']
  },
  {
    id: 'full-stack',
    title: 'Full Stack Developer',
    icon:  Building2,
    color: 'bg-purple-500',
    description: 'React, Node.js, databases, and API design.',
    skills: ['React', 'Node.js', 'SQL/NoSQL', 'REST APIs']
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    icon: Beaker,
    color: 'bg-green-500',
    description: 'Statistics, machine learning models, and data visualization.',
    skills: ['Python', 'SQL', 'ML Algorithms', 'Pandas']
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    icon: Briefcase,
    color: 'bg-orange-500',
    description: 'Product sense, metrics, and stakeholder management.',
    skills: ['Strategy', 'UX', 'Agile', 'Analytics']
  },
  {
    id: 'research-analyst',
    title: 'Research Analyst',
    icon: PenTool,
    color: 'bg-pink-500',
    description: 'Market research, financial modeling, and trend analysis.',
    skills: ['Excel', 'Research', 'Financial Modeling', 'Reporting']
  }
]

export default function InterviewSetupPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('Entry Level')
  const [step, setStep] = useState(1)
  const [isUploading, setIsUploading] = useState(false)

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;
    setIsUploading(true)
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map((item: any) => item.str).join(' ')
        fullText += pageText + ' '
      }
      setResumeText(fullText.substring(0, 5000)) // Protect prompt token limits
    } catch (err) {
      console.error(err)
      alert('Could not read PDF. Please paste manually.')
    }
    setIsUploading(false)
  }

  const handleStart = () => {
    if (selectedRole) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('interview_resume', resumeText)
        sessionStorage.setItem('interview_jd', jobDescription)
      }
      // Pass config via query params or context (using query params for simplicity here)
      router.push(`/dashboard/interview/${selectedRole}?exp=${experienceLevel}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
         <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div 
               className="h-full bg-primary"
               initial={{ width: 0 }}
               animate={{ width: `${(step / 3) * 100}%` }}
            />
         </div>
         <span className="ml-4 text-sm font-medium text-muted-foreground">Step {step} of 3</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
             <div className="text-center">
               <h1 className="text-3xl font-bold mb-2">Select Your Target Role</h1>
               <p className="text-muted-foreground">Choose the position you want to simulate an interview for.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {jobRoles.map((role) => (
                 <div
                   key={role.id}
                   onClick={() => { setSelectedRole(role.id); setStep(2); }}
                   className={`cursor-pointer rounded-2xl p-6 border transition-all hover:scale-105 ${
                     selectedRole === role.id 
                       ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                       : 'border-border bg-card hover:border-primary/50'
                   }`}
                 >
                   <div className={`w-12 h-12 rounded-xl ${role.color} bg-opacity-20 flex items-center justify-center text-white mb-4`}>
                     <role.icon className={`w-6 h-6 ${role.color.replace('bg-', 'text-')}`} />
                   </div>
                   <h3 className="font-bold text-lg mb-2">{role.title}</h3>
                   <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                   <div className="flex flex-wrap gap-2">
                     {role.skills.map(skill => (
                       <span key={skill} className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground">
                         {skill}
                       </span>
                     ))}
                   </div>
                 </div>
               ))}
             </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 max-w-2xl mx-auto"
          >
             <div className="text-center">
               <h1 className="text-3xl font-bold mb-2">Customize Experience</h1>
               <p className="text-muted-foreground">Tailor the difficulty and focus area.</p>
             </div>

             <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
                <div>
                   <label className="block text-sm font-medium mb-3">Experience Level</label>
                   <div className="grid grid-cols-3 gap-4">
                     {['Entry Level', 'Mid-Senior', 'Lead/Manager'].map((level) => (
                       <button
                         key={level}
                         onClick={() => setExperienceLevel(level)}
                         className={`py-3 px-4 rounded-xl text-sm font-medium transition-colors border ${
                           experienceLevel === level 
                             ? 'bg-primary text-primary-foreground border-primary' 
                             : 'bg-secondary/50 hover:bg-secondary border-transparent'
                         }`}
                       >
                         {level}
                       </button>
                     ))}
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium mb-3">Paste Job Description (Optional)</label>
                   <div className="relative">
                      <FileText className="absolute top-3 left-3 w-5 h-5 text-muted-foreground" />
                      <textarea 
                        className="w-full min-h-[100px] bg-secondary/50 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        placeholder="Paste the JD here for tailored questions..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium mb-3 mt-4">Provide Resume (Optional)</label>
                   <div className="flex items-center gap-4 mb-3">
                      <label className="flex-1 cursor-pointer border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl p-4 hover:bg-primary/10 transition-colors text-center">
                        <UploadCloud className="w-6 h-6 text-primary mx-auto mb-2" />
                        <span className="text-sm font-medium text-primary">
                          {isUploading ? 'Analyzing...' : 'Upload PDF Resume'}
                        </span>
                        <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
                      </label>
                      <div className="flex-1 text-center text-sm text-muted-foreground">
                         OR paste raw text directly below.
                      </div>
                   </div>
                   <div className="relative">
                      <FileText className="absolute top-3 left-3 w-5 h-5 text-muted-foreground" />
                      <textarea 
                        className="w-full min-h-[100px] bg-secondary/50 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        placeholder={isUploading ? "Parsing PDF..." : "Resume text will appear here... you can also edit/paste directly."}
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                      />
                   </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-border hover:bg-secondary transition-colors">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
                    Continue
                  </button>
                </div>
             </div>
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-8 max-w-2xl mx-auto py-12"
          >
             <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Play className="w-10 h-10 text-primary ml-1" />
             </div>
             
             <div>
               <h1 className="text-4xl font-bold mb-4">You're All Set!</h1>
               <p className="text-xl text-muted-foreground">
                 Your <span className="text-primary font-semibold">{selectedRole?.replace('-', ' ')}</span> interview ({experienceLevel}) is ready.
               </p>
               <p className="text-sm text-yellow-500 mt-4 bg-yellow-500/10 inline-block px-4 py-2 rounded-full border border-yellow-500/20">
                 ⚠️ This session is proctored. Full screen mode will be enabled.
               </p>
             </div>

             <button 
               onClick={handleStart}
               className="px-12 py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform"
             >
               Enter Interview Room
             </button>
             
             <button onClick={() => setStep(2)} className="block mx-auto text-sm text-muted-foreground hover:text-foreground">
               Adjust Settings
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
