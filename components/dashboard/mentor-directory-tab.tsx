"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, User, Briefcase, GraduationCap, Link, X } from "lucide-react"
import { motion } from "framer-motion"

interface Mentor {
  id: number
  firstName: string
  lastName: string
  currentRole: string
  employer: string
  industry: string
  functionalExpertise: string[]
  yearsExperience: number
  biography: string
  linkedinUrl: string
  avatar: string
  careerTimeline: { year: string; title: string; company: string; description?: string }[]
  researchPublications: { title: string; link: string }[]
  achievements: string[]
  education: { degree: string; major: string; university: string; year: string }[]
}

const sampleMentors: Mentor[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Chen",
    currentRole: "Senior AI Research Scientist",
    employer: "Google DeepMind",
    industry: "Artificial Intelligence",
    functionalExpertise: ["Machine Learning", "Deep Learning", "NLP", "AI Ethics"],
    yearsExperience: 10,
    biography:
      "Sarah is a leading AI research scientist with a decade of experience in developing cutting-edge machine learning models. She specializes in natural language processing and ethical AI development, contributing to several open-source projects.",
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    avatar: "/placeholder.svg?height=100&width=100",
    careerTimeline: [
      { year: "2020-Present", title: "Senior AI Research Scientist", company: "Google DeepMind" },
      { year: "2017-2020", title: "AI Research Engineer", company: "OpenAI" },
      { year: "2015-2017", title: "Machine Learning Intern", company: "Microsoft Research" },
    ],
    researchPublications: [
      { title: "Ethical Considerations in Large Language Models", link: "#" },
      { title: "Advancements in Transformer Architectures", link: "#" },
    ],
    achievements: [
      "Led development of a new NLP model, improving accuracy by 15%",
      "Awarded 'Innovator of the Year' at Google DeepMind",
    ],
    education: [
      { degree: "Ph.D.", major: "Computer Science", university: "Stanford University", year: "2015" },
      { degree: "M.S.", major: "Artificial Intelligence", university: "Carnegie Mellon University", year: "2012" },
    ],
  },
  {
    id: 2,
    firstName: "Michael",
    lastName: "Rodriguez",
    currentRole: "Senior Product Manager",
    employer: "Meta",
    industry: "Social Media, Tech",
    functionalExpertise: ["Product Strategy", "User Experience", "Market Analysis", "Team Leadership"],
    yearsExperience: 12,
    biography:
      "Michael is a seasoned product leader with a passion for building impactful consumer products. He has a strong background in scaling platforms and driving user engagement through data-driven strategies.",
    linkedinUrl: "https://linkedin.com/in/michaelrodriguez",
    avatar: "/placeholder.svg?height=100&width=100",
    careerTimeline: [
      { year: "2018-Present", title: "Senior Product Manager", company: "Meta" },
      { year: "2014-2018", title: "Product Manager", company: "Spotify" },
      { year: "2012-2014", title: "Associate Product Manager", company: "LinkedIn" },
    ],
    researchPublications: [],
    achievements: [
      "Launched a new feature increasing user retention by 10%",
      "Mentored 5 junior product managers to senior roles",
    ],
    education: [
      { degree: "MBA", major: "Business Administration", university: "Harvard Business School", year: "2012" },
      { degree: "B.S.", major: "Computer Engineering", university: "University of California, Berkeley", year: "2009" },
    ],
  },
  {
    id: 3,
    firstName: "Emily",
    lastName: "Wang",
    currentRole: "Investment Director",
    employer: "Andreessen Horowitz",
    industry: "Venture Capital",
    functionalExpertise: ["Startup Evaluation", "Financial Modeling", "Deal Sourcing", "Portfolio Management"],
    yearsExperience: 8,
    biography:
      "Emily is an Investment Director at a leading VC firm, focusing on early-stage tech startups. She brings a keen eye for disruptive technologies and a strong network within the startup ecosystem.",
    linkedinUrl: "https://linkedin.com/in/emilywang",
    avatar: "/placeholder.svg?height=100&width=100",
    careerTimeline: [
      { year: "2021-Present", title: "Investment Director", company: "Andreessen Horowitz" },
      { year: "2017-2021", title: "Investment Associate", company: "Sequoia Capital" },
      { year: "2015-2017", title: "Financial Analyst", company: "Goldman Sachs" },
    ],
    researchPublications: [],
    achievements: [
      "Sourced and led investments in 3 successful Series A rounds",
      "Recognized as 'Top 30 Under 30' in Venture Capital",
    ],
    education: [{ degree: "B.A.", major: "Economics", university: "University of Pennsylvania", year: "2015" }],
  },
  {
    id: 4,
    firstName: "David",
    lastName: "Lee",
    currentRole: "Lead Software Engineer",
    employer: "Stripe",
    industry: "Fintech",
    functionalExpertise: ["Backend Development", "Distributed Systems", "API Design", "Mentorship"],
    yearsExperience: 9,
    biography:
      "David is a Lead Software Engineer at Stripe, specializing in building scalable and resilient backend systems. He is passionate about mentoring junior engineers and fostering a culture of technical excellence.",
    linkedinUrl: "https://linkedin.com/in/davidlee",
    avatar: "/placeholder.svg?height=100&width=100",
    careerTimeline: [
      { year: "2019-Present", title: "Lead Software Engineer", company: "Stripe" },
      { year: "2015-2019", title: "Software Engineer", company: "Amazon" },
      { year: "2013-2015", title: "Junior Developer", company: "Tech Startup" },
    ],
    researchPublications: [],
    achievements: [
      "Architected a new payment processing module, reducing latency by 20%",
      "Received 'Outstanding Mentor' award for 3 consecutive years",
    ],
    education: [
      { degree: "M.S.", major: "Computer Science", university: "Georgia Institute of Technology", year: "2013" },
      { degree: "B.S.", major: "Software Engineering", university: "University of Waterloo", year: "2011" },
    ],
  },
]

export function MentorDirectoryTab() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredMentors = sampleMentors.filter((mentor) =>
    `${mentor.firstName} ${mentor.lastName} ${mentor.currentRole} ${mentor.employer} ${mentor.industry} ${mentor.functionalExpertise.join(" ")}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  )

  const openMentorModal = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setIsModalOpen(true)
  }

  const closeMentorModal = () => {
    setSelectedMentor(null)
    setIsModalOpen(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {" "}
      {/* Adjusted margin and padding */}
      {/* Header */}
      <div>
        <h1 className="text-2xl font-light text-gray-900 mb-2">Mentor Directory</h1>
        <p className="text-gray-600 font-light">Browse available mentors and their profiles</p>
      </div>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search mentors by name, role, company, or expertise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 pr-4 h-11 w-full rounded-lg border border-gray-200 focus:border-primary focus:ring-primary/20"
        />
      </div>
      {/* Mentor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.map((mentor) => (
          <motion.div
            key={mentor.id}
            className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: mentor.id * 0.1 }}
            onClick={() => openMentorModal(mentor)}
          >
            <img
              src={mentor.avatar || "/placeholder.svg"}
              alt={`${mentor.firstName} ${mentor.lastName}`}
              className="h-20 w-20 rounded-full object-cover mb-4 border-2 border-primary/20"
            />
            <h3 className="text-lg font-medium text-gray-900">
              {mentor.firstName} {mentor.lastName}
            </h3>
            <p className="text-sm text-gray-600">{mentor.currentRole}</p>
            <p className="text-xs text-gray-500 mb-3">{mentor.employer}</p>
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {mentor.functionalExpertise.map((expertise) => (
                <Badge
                  key={expertise}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary border-primary/20 border"
                >
                  {expertise}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-700 line-clamp-3 mb-4">{mentor.biography}</p>
            <Button
              variant="outline"
              className="mt-auto w-full rounded-lg bg-transparent"
              onClick={(e) => {
                e.stopPropagation() // Prevent modal from opening when button is clicked
                openMentorModal(mentor)
              }}
            >
              View Profile
            </Button>
          </motion.div>
        ))}
      </div>
      {/* Mentor Profile Modal */}
      {selectedMentor && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-xl">
            <div className="relative h-48 bg-gradient-to-r from-primary/20 to-blue-200 flex items-center justify-center">
              <img
                src={selectedMentor.avatar || "/placeholder.svg"}
                alt={`${selectedMentor.firstName} ${selectedMentor.lastName}`}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 hover:text-white"
                onClick={closeMentorModal}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-150px)]">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedMentor.firstName} {selectedMentor.lastName}
                </h2>
                <p className="text-lg text-gray-700">
                  {selectedMentor.currentRole} at {selectedMentor.employer}
                </p>
                <p className="text-md text-gray-500">{selectedMentor.industry}</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {selectedMentor.functionalExpertise.map((expertise) => (
                    <Badge key={expertise} className="px-3 py-1 bg-primary/10 text-primary border-primary/20 border">
                      {expertise}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  About Me
                </h3>
                <p className="text-gray-700 leading-relaxed">{selectedMentor.biography}</p>
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{selectedMentor.yearsExperience} Years of Professional Experience</span>
                </div>
                <a
                  href={selectedMentor.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <Link className="h-4 w-4" />
                  LinkedIn Profile
                </a>
              </div>

              {selectedMentor.careerTimeline.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    Career Timeline
                  </h3>
                  <ol className="relative border-l border-gray-200 ml-4">
                    {selectedMentor.careerTimeline.map((item, index) => (
                      <li key={index} className="mb-6 ml-6">
                        <span className="absolute flex items-center justify-center w-3 h-3 bg-primary-foreground rounded-full -left-1.5 ring-8 ring-white" />
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.company}</p>
                        <time className="block mb-2 text-xs font-normal leading-none text-gray-400">{item.year}</time>
                        {item.description && <p className="text-sm text-gray-700">{item.description}</p>}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedMentor.education.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Education
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedMentor.education.map((edu, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                        <p className="text-sm text-gray-700">{edu.major}</p>
                        <p className="text-xs text-gray-500">
                          {edu.university}, {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedMentor.researchPublications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Link className="h-5 w-5 text-primary" />
                    Research & Publications
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {selectedMentor.researchPublications.map((pub, index) => (
                      <li key={index}>
                        <a href={pub.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {pub.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMentor.achievements.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Badge className="h-5 w-5 text-primary" /> {/* Using Badge icon for achievements */}
                    Achievements
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {selectedMentor.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
