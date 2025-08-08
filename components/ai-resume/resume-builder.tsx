"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowRight, Copy, Download, MessageCircle, Sparkles, Briefcase, GraduationCap, Award, Code, Globe, Clock } from 'lucide-react'

interface WorkExperience {
  id: string
  jobTitle: string
  companyName: string
  city: string
  country: string
  startMonth: string
  startYear: string
  endMonth: string
  endYear: string
  description: string
  isCurrentRole: boolean
}

interface Education {
  id: string
  school: string
  schoolLocation: string
  degreeProgram: string
  fieldOfStudy: string
  graduationMonth: string
  graduationYear: string
  additionalDetails: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  year: string
}

interface Language {
  id: string
  language: string
  proficiency: string
}

interface Skill {
  id: string;
  skill: string;
}

export function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState<'input' | 'output'>('input')
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([
    {
      id: '1',
      jobTitle: '',
      companyName: '',
      city: '',
      country: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      description: '',
      isCurrentRole: false
    }
  ])
  const [education, setEducation] = useState<Education[]>([
    {
      id: '1',
      school: '',
      schoolLocation: '',
      degreeProgram: '',
      fieldOfStudy: '',
      graduationMonth: '',
      graduationYear: '',
      additionalDetails: ''
    }
  ])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [skills, setSkills] = useState<Skill[]>([{ id: 'skill_initial_1', skill: '' }]);
  const [languages, setLanguages] = useState<Language[]>([])
  const [targetJobTitle, setTargetJobTitle] = useState('')
  const [targetIndustry, setTargetIndustry] = useState('')
  const [showChatBox, setShowChatBox] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState<any>(null)

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const years = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString())

  const countries = [
    'Vietnam', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Singapore', 'Japan', 'South Korea', 'Germany', 'France'
  ]

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing',
    'Consulting', 'Retail', 'Manufacturing', 'Government', 'Non-profit'
  ]

  const proficiencyLevels = ['Native', 'Fluent', 'Professional', 'Conversational']

  const popularRoles = [
    'Software Engineer', 'Product Manager', 'Marketing Specialist', 'UI/UX Designer',
    'Data Scientist', 'Business Analyst', 'Project Manager', 'Sales Representative',
    'Content Writer', 'Graphic Designer', 'Financial Analyst', 'HR Specialist',
    'Operations Manager', 'Customer Success Manager', 'DevOps Engineer', 'Quality Assurance Engineer',
    'Digital Marketing Manager', 'Account Manager', 'Research Analyst', 'Consultant',
    'Product Designer', 'Software Developer', 'Marketing Manager', 'Business Development Manager',
    'Technical Writer', 'Social Media Manager', 'Data Analyst', 'Frontend Developer',
    'Backend Developer', 'Full Stack Developer'
  ]

  const roleSkillSuggestions = {
    'Software Engineer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'SQL', 'AWS', 'Docker'],
    'Product Manager': ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Roadmapping', 'Stakeholder Management', 'A/B Testing', 'Wireframing'],
    'Marketing Specialist': ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Social Media', 'Email Marketing', 'PPC', 'Brand Management'],
    'UI/UX Designer': ['Figma', 'Adobe Creative Suite', 'User Experience', 'Prototyping', 'Design Systems', 'Sketch', 'Wireframing', 'User Research'],
    'Data Scientist': ['Python', 'R', 'Machine Learning', 'SQL', 'Statistics', 'Pandas', 'TensorFlow', 'Data Visualization'],
    'Business Analyst': ['Requirements Analysis', 'Process Improvement', 'SQL', 'Excel', 'Data Analysis', 'Documentation', 'Stakeholder Management', 'Agile'],
    'Project Manager': ['Project Planning', 'Agile', 'Scrum', 'Risk Management', 'Budget Management', 'Team Leadership', 'Communication', 'Microsoft Project'],
    'Sales Representative': ['CRM', 'Lead Generation', 'Negotiation', 'Customer Relations', 'Sales Strategy', 'Prospecting', 'Cold Calling', 'Account Management'],
    'Content Writer': ['Content Creation', 'SEO Writing', 'Copywriting', 'WordPress', 'Content Strategy', 'Social Media Writing', 'Editing', 'Research'],
    'Graphic Designer': ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Branding', 'Typography', 'Layout Design', 'Print Design', 'Digital Design'],
    'Financial Analyst': ['Financial Modeling', 'Excel', 'SQL', 'Data Analysis', 'Forecasting', 'Budgeting', 'Valuation', 'Financial Reporting'],
    'HR Specialist': ['Recruitment', 'Employee Relations', 'Performance Management', 'HRIS', 'Compensation', 'Training', 'Policy Development', 'Compliance'],
    'Operations Manager': ['Process Optimization', 'Supply Chain', 'Lean Manufacturing', 'Project Management', 'Quality Control', 'Team Leadership', 'Budget Management', 'KPI Tracking'],
    'Customer Success Manager': ['Customer Relationship Management', 'Account Management', 'Onboarding', 'Retention Strategies', 'Data Analysis', 'Communication', 'Problem Solving', 'CRM Software'],
    'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform', 'Ansible', 'Linux', 'CI/CD'],
    'Quality Assurance Engineer': ['Test Planning', 'Automation Testing', 'Selenium', 'Bug Tracking', 'API Testing', 'Performance Testing', 'Manual Testing', 'Test Documentation'],
    'Digital Marketing Manager': ['SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Analytics', 'PPC', 'Marketing Automation'],
    'Account Manager': ['Client Relations', 'Account Planning', 'Sales', 'Negotiation', 'CRM', 'Project Management', 'Communication', 'Revenue Growth'],
    'Research Analyst': ['Data Analysis', 'Research Methodology', 'Statistical Analysis', 'Report Writing', 'Excel', 'SQL', 'Market Research', 'Presentation Skills'],
    'Consultant': ['Problem Solving', 'Strategic Planning', 'Client Management', 'Presentation Skills', 'Data Analysis', 'Project Management', 'Communication', 'Industry Knowledge'],
    'Product Designer': ['Design Thinking', 'Prototyping', 'User Research', 'Figma', 'Sketch', 'Adobe Creative Suite', 'Wireframing', 'Interaction Design'],
    'Software Developer': ['Programming', 'Software Development', 'Debugging', 'Version Control', 'Testing', 'Problem Solving', 'Code Review', 'Documentation'],
    'Marketing Manager': ['Marketing Strategy', 'Campaign Management', 'Brand Management', 'Market Research', 'Budget Management', 'Team Leadership', 'Analytics', 'Digital Marketing'],
    'Business Development Manager': ['Sales Strategy', 'Partnership Development', 'Market Analysis', 'Negotiation', 'Relationship Building', 'Lead Generation', 'CRM', 'Revenue Growth'],
    'Technical Writer': ['Technical Writing', 'Documentation', 'Content Management', 'API Documentation', 'User Manuals', 'Editing', 'Research', 'Communication'],
    'Social Media Manager': ['Social Media Strategy', 'Content Creation', 'Community Management', 'Analytics', 'Paid Social', 'Brand Voice', 'Influencer Marketing', 'Crisis Management'],
    'Data Analyst': ['SQL', 'Excel', 'Python', 'Data Visualization', 'Statistical Analysis', 'Tableau', 'Power BI', 'Data Mining'],
    'Frontend Developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'Responsive Design', 'Version Control'],
    'Backend Developer': ['Server-side Programming', 'Database Management', 'API Development', 'Cloud Services', 'Security', 'Performance Optimization', 'Version Control', 'Testing'],
    'Full Stack Developer': ['Frontend Development', 'Backend Development', 'Database Management', 'API Development', 'Version Control', 'Testing', 'Deployment', 'Problem Solving']
  }

  const addWorkExperience = () => {
    if (workExperiences.length < 3) {
      setWorkExperiences([...workExperiences, {
        id: Date.now().toString(),
        jobTitle: '',
        companyName: '',
        city: '',
        country: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: '',
        isCurrentRole: false
      }])
    }
  }

  const removeWorkExperience = (id: string) => {
    setWorkExperiences(workExperiences.filter(exp => exp.id !== id))
  }

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    setWorkExperiences(workExperiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ))
  }

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      school: '',
      schoolLocation: '',
      degreeProgram: '',
      fieldOfStudy: '',
      graduationMonth: '',
      graduationYear: '',
      additionalDetails: ''
    }])
  }

  const addCertification = () => {
    setCertifications([...certifications, {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      year: ''
    }])
  }

  const removeCertification = (id: string) => {
    setCertifications(certifications.filter(cert => cert.id !== id))
  }

  const addLanguage = () => {
    setLanguages([...languages, {
      id: Date.now().toString(),
      language: '',
      proficiency: ''
    }])
  }

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id))
  }

  const handleChatSubmit = async (experienceId: string) => {
    if (!chatInput.trim()) return

    try {
      const response = await fetch('/api/resume/enhance-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: chatInput,
          jobTitle: workExperiences.find(exp => exp.id === experienceId)?.jobTitle || '',
          companyName: workExperiences.find(exp => exp.id === experienceId)?.companyName || ''
        }),
      })

      if (response.ok) {
        const result = await response.json()
        updateWorkExperience(experienceId, 'description', result.enhancedDescription)
      } else {
        // Fallback to mock enhancement
        const enhancedDescription = `• Accomplished significant improvements in team productivity as measured by 25% reduction in project delivery time, by implementing agile methodologies and cross-functional collaboration
• Delivered high-quality software solutions as measured by 99.5% uptime and zero critical bugs, by establishing comprehensive testing protocols and code review processes
• Led strategic initiatives as measured by $2M cost savings annually, by optimizing system architecture and automating manual processes`
        updateWorkExperience(experienceId, 'description', enhancedDescription)
      }
    } catch (error) {
      console.error('Error enhancing description:', error)
      // Fallback to mock enhancement
      const enhancedDescription = `• Accomplished significant improvements in team productivity as measured by 25% reduction in project delivery time, by implementing agile methodologies and cross-functional collaboration
• Delivered high-quality software solutions as measured by 99.5% uptime and zero critical bugs, by establishing comprehensive testing protocols and code review processes
• Led strategic initiatives as measured by $2M cost savings annually, by optimizing system architecture and automating manual processes`
      updateWorkExperience(experienceId, 'description', enhancedDescription)
    }

    setShowChatBox(null)
    setChatInput('')
  }

  const generateOutput = async () => {
    setIsGenerating(true)

    try {
      const resumeData = {
        workExperiences,
        education,
        certifications,
        skills: skills.filter(skill => skill.skill.trim()),
        languages,
        targetJobTitle,
        targetIndustry
      }

      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      })

      if (response.ok) {
        const result = await response.json()
        setGeneratedResume(result)
      }
    } catch (error) {
      console.error('Error generating resume:', error)
    } finally {
      setIsGenerating(false)
      setCurrentStep('output')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const addSkill = () => {
    if (skills.length < 10) {
      setSkills([...skills, { id: `skill_${Date.now()}_${Math.random()}`, skill: '' }]);
    }
  };

  const removeSkill = (id: string) => {
    if (skills.length > 1) {
      setSkills(skills.filter((skill) => skill.id !== id));
    }
  };

  const updateSkill = (id: string, value: string) => {
    setSkills(
      skills.map((skill) => (skill.id === id ? { ...skill, skill: value } : skill))
    );
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    setCertifications(certifications.map(cert => 
      cert.id === id ? { ...cert, [field]: value } : cert
    ))
  }

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    ))
  }

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role)
  }

  const addSuggestedSkill = (skillName: string) => {
    // Check if skill already exists
    const skillExists = skills.some(skill => skill.skill.toLowerCase() === skillName.toLowerCase())
    if (!skillExists && skills.length < 10) {
      const newSkill = {
        id: `skill_${Date.now()}_${Math.random()}`,
        skill: skillName
      }
      setSkills([...skills, newSkill])
    }
  }

  const getSuggestedSkills = () => {
    return roleSkillSuggestions[selectedRole as keyof typeof roleSkillSuggestions] || []
  }

  if (currentStep === 'output') {
    return (
      <div className="container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-gray-900 mb-4 font-medium">Your AI-Generated Resume</h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-base">
              Copy each section to build your optimized resume
            </p>
          </div>

          <div className="space-y-8">
            {/* Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {generatedResume?.summary || `Results-driven ${targetJobTitle || 'Professional'} with extensive experience in ${targetIndustry || 'various industries'}. Proven track record of delivering scalable solutions that improved system performance and reduced operational costs. Skilled in ${skills.slice(0, 3).map(s => s.skill).join(', ')} and committed to driving innovation and excellence.`}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedResume?.summary || "")}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            {/* Core Competencies */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Core Competencies
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">
                  {skills.filter(s => s.skill.trim()).map(s => `• ${s.skill}`).join(' ')}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(skills.filter(s => s.skill.trim()).map(s => s.skill).join(' • '))}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            {/* Experience */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Experience
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="space-y-6">
                  {workExperiences.filter(exp => exp.jobTitle && exp.companyName).map((exp, index) => (
                    <div key={exp.id}>
                      <h4 className="font-semibold text-gray-900">
                        {exp.companyName} — {exp.jobTitle} ({exp.startMonth} {exp.startYear} – {exp.isCurrentRole ? 'Present' : `${exp.endMonth} ${exp.endYear}`})
                      </h4>
                      {exp.description && (
                        <div className="mt-2 text-gray-700 whitespace-pre-line">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(workExperiences.map(exp => `${exp.companyName} — ${exp.jobTitle}\n${exp.description}`).join('\n\n'))}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Education
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                {education.filter(edu => edu.school && edu.degreeProgram).map((edu, index) => (
                  <div key={edu.id} className="mb-4 last:mb-0">
                    <p className="text-gray-700">
                      {edu.degreeProgram}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''} — {edu.school}, {edu.schoolLocation} ({edu.graduationYear})<br/>
                      {edu.additionalDetails && <span className="whitespace-pre-line">{edu.additionalDetails}</span>}
                    </p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(education.map(edu => `${edu.degreeProgram}, ${edu.fieldOfStudy} — ${edu.school}`).join('\n'))}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Skills
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">
                  {skills.filter(s => s.skill.trim()).map(s => s.skill).join(' • ')}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(skills.filter(s => s.skill.trim()).map(s => s.skill).join(' • '))}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>

            {/* Languages */}
            {languages.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Languages
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">
                    {languages.filter(lang => lang.language && lang.proficiency).map(lang => `${lang.language} – ${lang.proficiency}`).join(' | ')}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(languages.map(lang => `${lang.language} – ${lang.proficiency}`).join(' | '))}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            )}

            {/* Download Section */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Template Download</h3>
              <p className="text-gray-600 mb-6">Choose a resume template to download your AI-optimized resume.</p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Download My Resume
              </Button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <Button variant="outline" onClick={() => setCurrentStep('input')}>
                Back to Edit
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl text-gray-900 mb-4 font-medium">Resume Builder</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            Build your professional resume with AI-powered optimization
          </p>
        </div>

        <div className="space-y-8">
          {/* Work Experience Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Work Experience
              </h2>
              {workExperiences.length < 3 && (
                <Button variant="outline" size="sm" onClick={addWorkExperience}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {workExperiences.map((exp, index) => (
                <div key={exp.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Experience {index + 1}</h3>
                    {workExperiences.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeWorkExperience(exp.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Job Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g., Software Engineer"
                        value={exp.jobTitle}
                        onChange={(e) => updateWorkExperience(exp.id, 'jobTitle', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Company Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g., Google"
                        value={exp.companyName}
                        onChange={(e) => updateWorkExperience(exp.id, 'companyName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g., Ho Chi Minh City"
                        value={exp.city}
                        onChange={(e) => updateWorkExperience(exp.id, 'city', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Country <span className="text-red-500">*</span>
                      </Label>
                      <Select value={exp.country} onValueChange={(value) => updateWorkExperience(exp.id, 'country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(country => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Start Month <span className="text-red-500">*</span>
                      </Label>
                      <Select value={exp.startMonth} onValueChange={(value) => updateWorkExperience(exp.id, 'startMonth', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Start Year <span className="text-red-500">*</span>
                      </Label>
                      <Select value={exp.startYear} onValueChange={(value) => updateWorkExperience(exp.id, 'startYear', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">End Month</Label>
                      <Select 
                        value={exp.endMonth} 
                        onValueChange={(value) => updateWorkExperience(exp.id, 'endMonth', value)}
                        disabled={exp.isCurrentRole}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">End Year</Label>
                      <Select 
                        value={exp.endYear} 
                        onValueChange={(value) => updateWorkExperience(exp.id, 'endYear', value)}
                        disabled={exp.isCurrentRole}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exp.isCurrentRole}
                        onChange={(e) => updateWorkExperience(exp.id, 'isCurrentRole', e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">I currently work here</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowChatBox(exp.id)}
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Next: Add Details
                    </Button>
                  </div>

                  {/* Chat Box */}
                  <AnimatePresence key={`chatbox-${exp.id}`}>
                    {showChatBox === exp.id && (
                      <motion.div
                        key={`chat-content-${exp.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 border border-blue-200 rounded-lg p-4 bg-blue-50"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <MessageCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Describe your responsibilities and achievements in this role."
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              className="mb-2 bg-white"
                            />
                            <p className="text-sm text-gray-600 italic mb-4">
                              Tip: Use the format — Accomplished [X] as measured by [Y], by doing [Z].
                            </p>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleChatSubmit(exp.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Refine with AI
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setShowChatBox(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Display refined description */}
                  {exp.description && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">AI-Optimized Description:</h4>
                      <div className="text-sm text-green-800 whitespace-pre-line">{exp.description}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Education
              </h2>
              <Button variant="outline" size="sm" onClick={addEducation}>
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>

            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={edu.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        School <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="e.g., VinUniversity" 
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        School Location <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="e.g., Hanoi, Vietnam" 
                        value={edu.schoolLocation}
                        onChange={(e) => updateEducation(edu.id, 'schoolLocation', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">
                        Degree or Program <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        placeholder="e.g., Bachelor of Science" 
                        value={edu.degreeProgram}
                        onChange={(e) => updateEducation(edu.id, 'degreeProgram', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Field of Study</Label>
                      <Input 
                        placeholder="e.g., Computer Science" 
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Graduation Month</Label>
                      <Select 
                        value={edu.graduationMonth} 
                        onValueChange={(value) => updateEducation(edu.id, 'graduationMonth', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map(month => (
                            <SelectItem key={month} value={month}>{month}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Graduation Year (or Expected Graduation Year)</Label>
                      <Select 
                        value={edu.graduationYear} 
                        onValueChange={(value) => updateEducation(edu.id, 'graduationYear', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Add any additional education details (optional)</Label>
                      <div className="relative">
                        <Textarea 
                          placeholder={`• GPA\n• Relevant courses\n• Awards or Honors\n• Extracurricular activities`}
                          value={edu.additionalDetails}
                          onChange={(e) => updateEducation(edu.id, 'additionalDetails', e.target.value)}
                          className="min-h-[120px] pr-32"
                        />
                        <Button 
                          size="sm" 
                          className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          Improve with AI
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Certifications
              </h2>
              <Button variant="outline" size="sm" onClick={addCertification}>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>

            {certifications.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No certifications added yet. Click "Add Certification" to get started.</p>
            ) : (
              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Certification Name</Label>
                          <Input 
                            placeholder="e.g., AWS Certified Solutions Architect" 
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeCertification(cert.id)}
                          className="mt-6"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Issuer</Label>
                        <Input 
                          placeholder="e.g., Amazon Web Services" 
                          value={cert.issuer}
                          onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Year</Label>
                        <Select 
                          value={cert.year} 
                          onValueChange={(value) => updateCertification(cert.id, 'year', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map(year => (
                              <SelectItem key={year} value={year}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Skills
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Skills List */}
              <div>
                <div className="space-y-4 mb-4">
                  {skills.length > 0 && skills.map((skill, index) => (
                    <div key={`skill-item-${skill.id}`} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder={`Skill ${index + 1}`}
                          value={skill.skill}
                          onChange={(e) => updateSkill(skill.id, e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeSkill(skill.id)}
                        disabled={skills.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {skills.length < 10 && (
                  <Button variant="outline" size="sm" onClick={addSkill} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add another skill
                  </Button>
                )}
              </div>

              {/* Right side - Role Selection and Suggestions */}
              <div>
                <div className="mb-4">
                  <Select value={selectedRole} onValueChange={handleRoleSelection}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role to get skill recommendations" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skill Suggestions */}
                {selectedRole && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Suggested Skills:</h4>
                    <div className="space-y-2">
                      {getSuggestedSkills().map((suggestedSkill, index) => (
                        <div key={`suggestion-${selectedRole}-${index}-${suggestedSkill}`} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{suggestedSkill}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addSuggestedSkill(suggestedSkill)}
                            disabled={skills.some(skill => skill.skill.toLowerCase() === suggestedSkill.toLowerCase()) || skills.length >= 10}
                          >
                            <Plus className="h-4 w-4 text-blue-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Languages
              </h2>
              <Button variant="outline" size="sm" onClick={addLanguage}>
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </div>

            {languages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No languages added yet. Click "Add Language" to get started.</p>
            ) : (
              <div className="space-y-4">
                {languages.map((lang) => (
                  <div key={lang.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Language</Label>
                          <Input 
                            placeholder="e.g., English" 
                            value={lang.language}
                            onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeLanguage(lang.id)}
                          className="mt-6"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Proficiency</Label>
                        <Select 
                          value={lang.proficiency} 
                          onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select proficiency" />
                          </SelectTrigger>
                          <SelectContent>
                            {proficiencyLevels.map(level => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tailor to Job Section */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tailor To Job</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Target Job Title</Label>
                <Input
                  placeholder="e.g., Senior Software Engineer"
                  value={targetJobTitle}
                  onChange={(e) => setTargetJobTitle(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Industry</Label>
                <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <Button 
              onClick={generateOutput}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-normal text-base"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  Generating Resume...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Generate My Resume
                </div>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
