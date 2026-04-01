export type Program = {
  slug: string;
  short: string;
  title: string;
  tagline: string;
  duration: string;
  degree: string;
  accreditation: string;
  overviewParagraphs: string[];
  curriculum: string[];
  careers: { name: string; tag: string; desc: string; subTags: string[] }[];
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
    overviewParagraphs: [
      "The **BS Computer Science program** equips students with deep theoretical foundations and practical skills in software development, algorithms, and computing systems.",
      "Students explore areas ranging from **artificial intelligence and machine learning** to software engineering and theory of computation. The curriculum is designed to develop both technical depth and the critical thinking required for innovation.",
      "Graduates are prepared for careers in **tech leadership, software development, and research**, or direct entry into graduate studies at world-class institutions.",
    ],
    curriculum: [
      "Data Structures & Algorithms",
      "Discrete Mathematics",
      "Object-Oriented Programming",
      "Web Development",
      "Mobile Application Development",
      "Data Science",
      "Software Engineering",
      "Networking and Communications",
      "Data Structures and Algorithms",
      "Architecture and Organization",
      "Information Management",
      "Information Assurance and Security",
      "Project Management",
      "Operating Systems",
      "Programming Languages",
      "Human-Computer Interaction",
      "Automata and Theory Formal Languages",
    ],
    careers: [
      { name: "Software Engineer", tag: "High Demand", desc: "Design and build scalable software systems at product companies, startups, or enterprise environments. The highest-volume role for CS graduates globally.", subTags: ["Backend", "Frontend", "Full-Stack", "Mobile"] },
      { name: "Data Scientist", tag: "Growing Fast", desc: "Analyze complex datasets to drive business decisions and build predictive models using statistical methods and machine learning.", subTags: ["Analytics", "ML", "Python", "Statistics"] },
      { name: "AI / ML Engineer", tag: "Cutting Edge", desc: "Build and deploy machine learning models and AI systems at scale for real-world products and research pipelines.", subTags: ["Deep Learning", "NLP", "Computer Vision", "MLOps"] },
      { name: "Systems Architect", tag: "Senior Level", desc: "Design high-level software and hardware infrastructure for enterprise-scale distributed systems.", subTags: ["Cloud", "Distributed Systems", "DevOps", "Infrastructure"] },
      { name: "Research Scientist", tag: "PhD Pathway", desc: "Conduct cutting-edge research in algorithms, artificial intelligence, or theoretical computer science at academia or industry labs.", subTags: ["Academia", "R&D", "Publications", "PhD Track"] },
      { name: "Backend / Full-Stack Developer", tag: "Full Stack", desc: "Build server-side logic, APIs, and end-to-end web applications that power products used by millions.", subTags: ["Node.js", "Python", "Databases", "REST APIs"] },
      { name: "CTO / Tech Lead", tag: "Leadership", desc: "Lead engineering teams and define the technical vision and architecture strategy for organizations.", subTags: ["Leadership", "Strategy", "Architecture", "Management"] },
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
    overviewParagraphs: [
      "The **BS Information Technology program** develops industry-ready professionals skilled in deploying, managing, and securing technology systems for businesses.",
      "Students gain hands-on experience in **web development, network administration, cybersecurity**, cloud platforms, and enterprise IT solutions. The program bridges theoretical knowledge with practical, job-ready skills.",
      "Graduates are equipped to immediately contribute to organizations across all industries, in roles spanning **IT management, cloud architecture, and cybersecurity**.",
    ],
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
      { name: "Web Developer / Full-Stack Developer", tag: "High Demand", desc: "Build and maintain websites and web applications for clients across all industries using modern frameworks and tools.", subTags: ["HTML/CSS", "JavaScript", "React", "Node.js"] },
      { name: "IT Manager", tag: "Leadership", desc: "Oversee IT infrastructure, teams, and technology strategy to align systems with business objectives.", subTags: ["Management", "Strategy", "Budgeting", "Teams"] },
      { name: "Cybersecurity Analyst", tag: "Critical", desc: "Protect systems and networks from digital attacks, breaches, and vulnerabilities across enterprise environments.", subTags: ["Penetration Testing", "SIEM", "Compliance", "Forensics"] },
      { name: "Cloud Solutions Architect", tag: "Cloud", desc: "Design and implement scalable cloud infrastructure on platforms like AWS and Azure for modern organizations.", subTags: ["AWS", "Azure", "DevOps", "Infrastructure"] },
      { name: "Systems Administrator", tag: "Infra", desc: "Maintain, configure, and troubleshoot servers, networks, and IT systems that keep businesses running.", subTags: ["Linux", "Windows Server", "Networking", "Virtualization"] },
      { name: "DevOps Engineer", tag: "Infra", desc: "Bridge development and operations to improve deployment pipelines, automation, and system reliability.", subTags: ["CI/CD", "Docker", "Kubernetes", "Automation"] },
      { name: "IT Consultant", tag: "Consulting", desc: "Advise organizations on technology solutions and strategies to improve efficiency and competitive advantage.", subTags: ["Strategy", "Analysis", "Solutions", "Communication"] },
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
    overviewParagraphs: [
      "The **Associate in Computer Technology program** is a two-year course providing students with essential skills in computer programming, hardware servicing, networking, and technical support.",
      "Designed for students who want to enter the IT workforce quickly, ACT combines **practical training with industry-relevant certifications** aligned to TESDA NC II and Cisco NetAcad standards.",
      "Graduates are ready to step into roles in **technical support, hardware servicing, and web design** — or continue their education with a solid foundation for BSIT or BSCS.",
    ],
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
      { name: "Computer Technician", tag: "Entry Level", desc: "Install, maintain, and repair computer hardware, peripherals, and software for businesses and individuals.", subTags: ["Hardware", "Troubleshooting", "Repair", "Maintenance"] },
      { name: "IT Support Specialist / Help Desk Analyst", tag: "High Demand", desc: "Provide technical support and resolve IT issues for end users, ensuring systems run smoothly day to day.", subTags: ["Help Desk", "Ticketing", "Remote Support", "Customer Service"] },
      { name: "Web Designer", tag: "Creative", desc: "Create visually appealing website layouts and user interfaces that deliver great digital experiences.", subTags: ["UI/UX", "Figma", "HTML/CSS", "Graphics"] },
      { name: "Network Technician", tag: "Infra", desc: "Install and maintain network infrastructure including routers, switches, and cabling for organizations.", subTags: ["Cisco", "Networking", "Cabling", "Troubleshooting"] },
      { name: "Desktop Support Engineer", tag: "Entry Level", desc: "Provide on-site technical support for desktop systems, resolving hardware and software issues quickly.", subTags: ["Windows", "Hardware", "Software", "Support"] },
      { name: "Junior Developer", tag: "Growing Fast", desc: "Write code and assist senior developers in building software applications, growing into a full engineering role.", subTags: ["Programming", "Git", "Debugging", "Collaboration"] },
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
