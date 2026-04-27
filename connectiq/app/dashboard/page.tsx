'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart2, 
  MessageCircle, 
  Code2, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  PlayCircle,
  Activity,
  X,
  FileText,
  AlertCircle
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface UserStats {
  interviewsCompleted: number
  avgWpm: number
  hoursPracticed: number
}

const StatCard = ({ title, icon, value, subtext, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:shadow-lg transition-all border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</h3>
      <div className={`p-2 rounded-lg bg-secondary/50 text-foreground`}>
        {icon}
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-sm text-green-500 font-medium flex items-center">
        <TrendingUp className="w-3 h-3 mr-1" />
        {subtext}
      </span>
    </div>
  </motion.div>
)

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UserStats>({
    interviewsCompleted: 0,
    avgWpm: 0,
    hoursPracticed: 0,
  })
  const [recentInterviews, setRecentInterviews] = useState<any[]>([])
  const [selectedSession, setSelectedSession] = useState<any | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
         setLoading(false)
         return
      }

      // Fetch recent sessions
      const { data: sessions, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (sessions && !error) {
        const total = sessions.length
        
        // Calculate Total Hours Used
        const totalSeconds = sessions.reduce((acc, curr) => acc + (curr.duration_seconds || 0), 0)
        const hours = parseFloat((totalSeconds / 3600).toFixed(1))

        // Calculate Average WPM
        const averageWpm = total > 0 
           ? Math.round(sessions.reduce((acc, curr) => acc + (curr.average_wpm || 0), 0) / total) 
           : 0

        setStats({
          interviewsCompleted: total,
          avgWpm: averageWpm,
          hoursPracticed: hours
        })

        // Give the top 3 for the activity feed
        setRecentInterviews(sessions.slice(0, 3))
      }
      setLoading(false)
    }
    
    checkAuthAndFetchData()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {selectedSession && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-secondary/20">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Interview Report ({selectedSession.role ? selectedSession.role.replace('-', ' ') : 'Practice'})
                </h2>
                <button 
                  onClick={() => setSelectedSession(null)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {selectedSession.report ? (
                  <div className="prose prose-invert prose-emerald max-w-none">
                    <ReactMarkdown>{selectedSession.report}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No detailed AI report was generated for this session.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground mt-1">Track your progress and start your next session.</p>
        </div>
        
        <Link href="/dashboard/interview" 
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all hover:scale-105"
        >
          <PlayCircle className="w-5 h-5 mr-2" />
          Start New Interview
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Interviews" 
          value={stats.interviewsCompleted} 
          icon={<MessageCircle className="w-5 h-5 text-blue-500" />}
          subtext="Lifetime Total"
          color="border-l-blue-500"
        />
        <StatCard 
          title="Avg. Speech Pace" 
          value={`${stats.avgWpm} WPM`} 
          icon={<BarChart2 className="w-5 h-5 text-green-500" />}
          subtext={stats.avgWpm > 100 && stats.avgWpm < 160 ? "Healthy Pace" : stats.avgWpm === 0 ? "No Data" : "Needs Adjusting"}
          color="border-l-green-500"
        />
        <StatCard 
          title="Total Practice Time" 
          value={`${stats.hoursPracticed}h`} 
          icon={<Clock className="w-5 h-5 text-purple-500" />}
          subtext="Keep going!"
          color="border-l-purple-500"
        />
        <StatCard 
          title="Coding Challenges" 
          value="0" 
          icon={<Code2 className="w-5 h-5 text-orange-500" />}
          subtext="Coming soon"
          color="border-l-orange-500"
        />
      </div>

      {/* Analytics Charts */}
      {recentInterviews.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
             <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-primary" />
                Speech Pace Trend (WPM)
             </h2>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={[...recentInterviews].reverse()}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="created_at" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} stroke="#888" fontSize={12} />
                   <YAxis stroke="#888" fontSize={12} />
                   <RechartsTooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }} />
                   <Line type="monotone" dataKey="average_wpm" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2 }} activeDot={{ r: 8 }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-sm">
             <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
                <BarChart2 className="w-5 h-5 text-destructive" />
                Filler Words Count
             </h2>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[...recentInterviews].reverse()}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                   <XAxis dataKey="created_at" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} stroke="#888" fontSize={12} />
                   <YAxis stroke="#888" fontSize={12} />
                   <RechartsTooltip contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                   <Bar dataKey="total_filler_words" fill="#ef4444" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>
      )}

      {/* Recent Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentInterviews.length > 0 ? (
              recentInterviews.map((session, i) => {
                const date = new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                return (
                  <div 
                    key={session.id || i} 
                    onClick={() => setSelectedSession(session)}
                    className="p-4 rounded-xl border border-border bg-card/50 hover:bg-secondary/30 transition-colors flex flex-col md:flex-row md:items-center justify-between group cursor-pointer space-y-4 md:space-y-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase shrink-0">
                        {session.role ? session.role.substring(0, 2) : 'AI'}
                      </div>
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors capitalize">
                          {session.role ? `${session.role.replace('-', ' ')} Interview` : 'Practice Session'}
                        </h4>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <span>{date}</span>
                          <span>•</span>
                          <span>{Math.round((session.duration_seconds || 0) / 60)} min</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-medium md:ml-auto">
                        <div className="text-pink-400 bg-pink-500/10 px-3 py-1.5 rounded-md">
                          Fillers: {session.total_filler_words || 0}
                        </div>
                        <div className={`px-3 py-1.5 rounded-md ${session.dominant_emotion === 'Nervous' ? 'text-orange-400 bg-orange-500/10' : 'text-emerald-400 bg-emerald-500/10'}`}>
                          Mood: {session.dominant_emotion || 'Neutral'}
                        </div>
                    </div>
                  </div>
                )
              })
            ) : (
               <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                 No interviews completed yet. Start your first session to see analytics!
               </div>
            )}
          </div>
        </div>
        
        {/* Recommended Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Recommendations
          </h2>
          
          {stats.interviewsCompleted > 0 && recentInterviews[0]?.total_filler_words > 10 ? (
             <div className="p-6 rounded-xl border border-dashed border-red-500/30 bg-red-500/5 space-y-4">
                <h3 className="font-medium text-red-400">Reduce Filler Words</h3>
                <p className="text-sm text-muted-foreground">You used {recentInterviews[0].total_filler_words} filler words in your last session. Try pausing momentarily instead of saying "um".</p>
                <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors">
                  Review Transcript
                </button>
             </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-primary/30 bg-primary/5 space-y-4">
              <h3 className="font-medium text-primary">Solid Tone & Confidence</h3>
              <p className="text-sm text-muted-foreground">Your recent sessions indicate great confidence and steady pacing. Time to test your technical depth next!</p>
              <Link href="/dashboard/interview" className="block text-center w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors">
                Start Technical Drill
              </Link>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  )
}
