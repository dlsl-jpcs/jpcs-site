export type Program = {
  slug: string;
  short: string;
  title: string;
  tagline: string;
  duration: string;
  degree: string;
  accreditation: string;
  overview: string;
  curriculum: string[];
  careers: string[];
  highlights: { title: string; desc: string }[];
};

export const programs: Program[] = [
  {
    slug: "bscs",
    short: "BSCS",
    title: "Computer Science",
    tagline:
      "Master algorithms, software engineering, AI, and advanced computing theories for research and tech leadership.",
    duration: "4 Years",
    degree: "BS Degree",
    accreditation: "CHED",
    overview:
      "The BS Computer Science program equips students with deep theoretical foundations and practical skills in software development, algorithms, and computing systems. Students explore areas ranging from artificial intelligence and machine learning to software engineering and theory of computation. Graduates are prepared for careers in tech leadership, software development, research, or graduate studies.",
    curriculum: [
      "Data Structures & Algorithms",
      "Discrete Mathematics",
      "Object-Oriented Programming",
      "Computer Architecture & Organization",
      "Operating Systems",
      "Database Management Systems",
      "Software Engineering",
      "Artificial Intelligence",
      "Machine Learning",
      "Theory of Computation",
      "Programming Languages",
      "Human-Computer Interaction",
      "Capstone Project",
    ],
    careers: [
      "Software Engineer",
      "Data Scientist",
      "AI / ML Engineer",
      "Systems Architect",
      "Research Scientist",
      "Backend / Full-Stack Developer",
      "CTO / Tech Lead",
    ],
    highlights: [
      {
        title: "Theory + Practice",
        desc: "Strong algorithmic foundations for innovation and research.",
      },
      {
        title: "Grad School Ready",
        desc: "Direct pathway to MS/PhD programs locally and abroad.",
      },
      {
        title: "High Industry Demand",
        desc: "Top-paying roles at leading tech companies.",
      },
    ],
  },
  {
    slug: "bsit",
    short: "BSIT",
    title: "Information Technology",
    tagline:
      "Develop practical skills in web development, cybersecurity, cloud computing, and enterprise solutions.",
    duration: "4 Years",
    degree: "BS Degree",
    accreditation: "CHED",
    overview:
      "The BS Information Technology program develops industry-ready professionals skilled in deploying, managing, and securing technology systems for businesses. Students gain hands-on experience in web development, network administration, cybersecurity, cloud platforms, and enterprise IT solutions. Graduates are equipped to immediately contribute to organizations across all industries.",
    curriculum: [
      "Web Systems & Technologies",
      "Network Administration",
      "Cybersecurity Fundamentals",
      "Cloud Computing (AWS / Azure)",
      "Database Administration",
      "Systems Integration & Architecture",
      "IT Project Management",
      "Enterprise Resource Planning (ERP)",
      "Information Assurance & Security",
      "Mobile Application Development",
      "Technical Documentation",
      "Capstone Project",
    ],
    careers: [
      "Web Developer / Full-Stack Developer",
      "IT Manager",
      "Cybersecurity Analyst",
      "Cloud Solutions Architect",
      "Systems Administrator",
      "DevOps Engineer",
      "IT Consultant",
    ],
    highlights: [
      {
        title: "Industry-Ready Skills",
        desc: "Practical curriculum aligned with real-world IT environments.",
      },
      {
        title: "Broad Coverage",
        desc: "From web dev to cloud to security, all in one program.",
      },
      {
        title: "Fast Career Entry",
        desc: "High demand for IT professionals across every industry.",
      },
    ],
  },
  {
    slug: "act",
    short: "ACT",
    title: "Computer Technology",
    tagline:
      "Two-year intensive program with foundational skills in programming, networking, and hardware.",
    duration: "2 Years",
    degree: "Associate Degree",
    accreditation: "TESDA / CHED",
    overview:
      "The Associate in Computer Technology program is a two-year course providing students with essential skills in computer programming, hardware servicing, networking, and technical support. Designed for students who want to enter the IT workforce quickly or build a strong foundation before pursuing a bachelor's degree, ACT combines practical training with industry-relevant certifications.",
    curriculum: [
      "Computer Programming Fundamentals",
      "Computer Hardware Servicing & Troubleshooting",
      "Network Fundamentals (Cisco NetAcad)",
      "Web Design & Development Basics",
      "Office Productivity & Desktop Support",
      "Technical Support & Help Desk Operations",
      "Database Fundamentals",
      "Cybersecurity Awareness",
    ],
    careers: [
      "Computer Technician",
      "IT Support Specialist / Help Desk Analyst",
      "Web Designer",
      "Network Technician",
      "Desktop Support Engineer",
      "Junior Developer",
    ],
    highlights: [
      {
        title: "Shorter Duration",
        desc: "Enter the workforce in 2 years with in-demand technical skills.",
      },
      {
        title: "Certification Paths",
        desc: "Aligned with TESDA NC II and Cisco certifications.",
      },
      {
        title: "Stepping Stone",
        desc: "Solid foundation for advancing to BSIT or BSCS.",
      },
    ],
  },
];
