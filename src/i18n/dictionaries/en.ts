// src/i18n/dictionaries/en.ts
//
// Source of truth for every translatable string. The shape of this object
// defines the `Dictionary` type that all other locales satisfy, so a missing or
// renamed key is a type error rather than a silent blank.
//
// Text may contain inline markdown (`**bold**`, `[label](url)`) — see RichText.
//
// TRANSLATION POLICY
// Technology names (React, Laravel, TypeScript…), product names (MacBook Pro,
// Keychron…) and job titles (Frontend Developer & SQA) stay in Latin in every
// locale. Only descriptive prose is translated.

export const en = {
    site: {
        /** Localised in scripts that don't use the Latin alphabet. */
        name: "Zahin",
        fullName: "Zahin Mohammad",
    },

    common: {
        comingSoon: "Content coming soon",
        language: "Language",
        present: "Present",
        retry: "Try again",
        search: "Search...",
        loadMore: "Load more",
    },

    nav: {
        about: "About",
        blogs: "Blogs",
        projects: "Projects",
        home: "Home",
        bucketList: "Bucket List",
        uses: "Uses",
        attribution: "Attribution",
        guestbook: "Guest Book",
        bookNotes: "Book Notes",
        analytics: "Analytics",
        resume: "Resume",
        tools: "Tools",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        general: "General",
        theWebsite: "The Website",
        resources: "Resources",
        legal: "Legal",
        subscribe: "Subscribe",
    },

    footer: {
        builtWith: "Designed & Built with Typescript, React, Tailwind and Next.js ❤",
        backToTop: "Back to top",
    },

    menu: {
        saylo: { title: "Saylo", description: "Thoughts and updates" },
        uses: { title: "Uses", description: "A peek into my digital workspace" },
        sideQuests: { title: "Side Quests", description: "New skills and adventures" },
        guestbook: { description: "Leave me a message" },
        statistics: { title: "Statistics", description: "Crunched up numbers" },
        attribution: { description: "Journey to create this site" },
    },

    notFound: {
        title: "Oops! Page Not Found",
        action: "Go Back Home",
    },

    empty: {
        blogs: {
            title: "Ideas, insights, & inspiration",
            subtitle: "No blogs published yet",
            description:
                "I'm crafting some thoughtful content about web development, design patterns, and technology insights. Check back soon for fresh perspectives and practical guides.",
        },
        projects: {
            title: "Projects I've worked on",
            subtitle: "No projects to showcase yet",
            description:
                "I'm currently working on some exciting projects that showcase modern web development practices. Stay tuned to see what I'm building next.",
        },
        quests: {
            title: "Side Quests & Adventures",
            subtitle: "No quests shared yet",
            description:
                "Life's adventures and side quests are being documented. Check back soon to see hobbies, travels, and experiences that add color beyond the daily grind.",
        },
        saylo: {
            title: "Thoughts, ideas, & moments",
            subtitle: "No says yet",
            description:
                "I'm gathering thoughts and moments to share. Check back soon for quick updates, ideas, and snippets of what's on my mind.",
        },
    },

    article: {
        writtenBy: "Written by",
        publishedOn: "Published on",
        views: "Views",
        comments: "Comments",
        related: "Other blogs you might like 💕",
    },

    pages: {
        blogs: {
            title: "Ideas, insights, & inspiration",
            subtitle:
                "Thoughts on web design, freelancing, and creative growth, shared to inform, encourage, and spark new perspectives",
            searchLabel: "Search blogs",
            error: "Failed to load blogs",
            errorMessage: "We couldn't load the blog posts. Please check your connection and try again.",
            noMatchTitle: "No matching blogs",
            noMatchDescription: "No blogs found matching your search or filters. Try adjusting your criteria.",
        },
        projects: {
            title: "Projects I've worked on",
            subtitle: "Nothing too fancy, just solid websites that do their job.",
            searchLabel: "Search projects",
            error: "Failed to load projects",
            errorMessage: "We couldn't load the projects. Please check your connection and try again.",
            noMatchTitle: "No matching projects",
            noMatchDescription: "No projects found matching your search or filters. Try adjusting your criteria.",
        },
        guestbook: {
            title: "GuestBook",
            subtitle: "Leave whatever you want to say, message, appreciation, suggestions or feedback.",
        },
        bucketList: {
            title: "My Bucket List",
            subtitle: "Dreams, goals, and adventures I'm chasing in this lifetime.",
            error: "Failed to load bucket list",
            emptyTitle: "No items found",
        },
    },

    home: {
        profileHero: {
            headingLead: "Hey, I’m",
            headingTrail: "Coder & Thinker",
            description:
                "I work with **React** & **Laravel** Ecosystem, and write to teach people how to rebuild and redefine fundamental concepts through mental models.",
        },
        hero: {
            badgeLabel: "Crafting Experiences at",
            headingLead: "Hi! I'm",
            paragraphs: [
                "I work with **React** & **Laravel** Ecosystem, and write to teach people how to rebuild and redefine fundamental concepts through mental models.",
                "Need a modern web app that stands out? [Hire me?](/contact)",
            ],
        },
        actions: {
            learnMore: "Learn More",
            moreAboutMe: "More about me",
        },
        cards: {
            location: "Cox's Bazar, Bangladesh",
            codingHours: "Coding Hours",
            codingHoursValue: "15,600 hrs",
            favoriteFramework: "Favorite Framework",
            connect: "Connect",
            stacks: "Languages and Tools",
            seeMore: "Know more about me",
        },
        blogs: {
            title: "Blogs",
            subtitle: "Thoughts on what I'm learning and building in web development",
            seeAll: "See all blogs",
        },
        projects: {
            title: "Projects",
            subtitle: "A select few that I've shipped in the past few months",
            seeAll: "See all projects",
        },
        testimonials: {
            title: "Nice words",
            subtitle: "Some feedback from people that I've had the privilege of working with.",
            items: [
                {
                    quote:
                        "Zahin is a very talented and reliable developer. He understands the product quickly, pays close attention to details, and always focuses on creating a smooth and professional user experience. He is fast, proactive, and genuinely cares about the quality of his work. Working with him has been a great experience.",
                },
                {
                    quote:
                        "Working with Zahin has been an excellent experience. He can take a rough idea and turn it into a polished and modern product with very little guidance. He is highly responsive, thinks beyond the requirements, and often suggests better ways to improve the product. His speed, creativity, and attention to detail make him someone I would happily work with again.",
                },
            ],
        },
        contact: {
            headline: "Any questions about software?",
            subheadline: "Feel free to reach out to me!",
            highlightText: "",
            sendMessage: "Send Message",
        },
    },

    about: {
        heading: {
            title: "About Me",
            subtitle: "How I explored, learned, and finally found my place in tech",
        },
        profile: {
            title: "Software Developer | Frontend Focused",
            location: "Khulshi, Chittagong, BD (UTC+6)",
            paragraphs: [
                "I work with the **React & Laravel ecosystem**, building robust web applications, dashboards, and internal tools. I focus on creating intuitive user experiences, clean interfaces, and maintainable code that performs reliably in real-world scenarios.",
                "Beyond coding, I write to teach and help others rethink fundamental concepts through mental models. My goal is to simplify complex ideas, inspire new ways of thinking, and empower developers to build smarter solutions.",
                "With **2+ years** of experience, I leverage tools like **TypeScript**, **Tailwind CSS**, **Bootstrap**, **Figma**, **Postman**, **Docker**, and **Git** to deliver scalable and high-quality software. I pay attention to details because even small improvements can make a significant difference in usability and performance.",
            ],
        },
        currentStatus: {
            title: "What I'm up to now",
            items: [
                "Currently employed as a Frontend Developer and SQA at [Iconic](http://www.iconicsolutionsbd.com), working on a File Manager web application.",
                "BSE in CSE student at [East Delta University](https://www.eastdelta.edu.bd).",
                "Occasionally work on outsourcing & freelance projects.",
                "Continuously learning modern technologies to stay up to date.",
            ],
        },
        workExperience: {
            title: "Work Experience",
            subtitle: "A little bit about my work experience",
            items: [
                {
                    title: "Frontend Developer & SQA",
                    location: "Chittagong, BD (On Site)",
                    type: "On Site",
                    description:
                        "Progressed from Web Developer Intern to Software Quality Assurance Engineer, and now Frontend Developer, contributing to SaaS applications and real-world projects by combining development and testing expertise.",
                    highlights: [
                        "Developed responsive frontend interfaces using React.js, Next.js, Vue.js, and integrated APIs via Postman and Inertia.js.",
                        "Collaborated with backend teams on Laravel for API development, CRUD operations, and feature integration.",
                        "Performed manual and automated testing using Postman, Puppeteer, Selenium, and Pest.",
                        "Reviewed and enhanced UI/UX in Figma to improve user experience across platforms.",
                        "Built dynamic web projects during internship, practiced API integration, responsive design, and version control (Git).",
                        "Contributed to deploying production-ready SaaS applications and gained full-stack development experience.",
                    ],
                },
            ],
        },
        education: {
            title: "Education",
            subtitle: "Where I studied and grew academically",
            items: [{ degree: "BSc in Computer Science & Engineering" }],
        },
    },

    uses: {
        heading: {
            title: "My Daily Uses",
            subtitle: "A peek into my workspace and the tools that power my creative workflow.",
        },
        hero: {
            alt: "Workspace Setup",
            badges: ["Updated Nov 2025", "Home Office"],
        },
        hardware: {
            title: "Hardware",
            subtitle: "The computing power behind the pixels.",
            primary: {
                subtitle: "M3 Max, 64GB RAM, 2TB SSD",
                description:
                    "The absolute heart of my workflow. The M3 Max chip handles Docker containers, Figma renders, and video editing without spinning up the fans. Space Black finish, naturally.",
                specs: ["16-Core CPU", "22hr Battery"],
            },
            display: {
                subtitle: "27-inch IPS, 5120 x 2880",                imageAlt: "Monitor",
                description:
                    "Pixel-perfect density for interface design. The matte finish helps with glare during the day.",
            },
            secondary: [{ subtitle: "2TB Shield Edition" }, { subtitle: "Router SE" }],
        },
        peripherals: {
            title: "Peripherals",
            subtitle: "Input devices that make work feel like play.",
            items: [
                {
                    subtitle: "Custom Build",
                    description:
                        "Lubed Boba U4T switches for that thocky sound. Aluminum frame adds satisfying weight.",
                },
                {
                    subtitle: "Pale Gray",
                    description:
                        "The electromagnetic wheel is a game changer for scrolling through long documentation.",
                },
                {
                    subtitle: "Noise Cancelling",
                    description:
                        "Essential for deep focus blocks. The transparency mode is surprisingly natural.",
                },
            ],
        },
        software: {
            title: "Software",
            subtitle: "The virtual environment.",
            items: [
                { category: "Editor", description: "My customized editor with the 'Vesper' theme and 'Dank Mono' font." },
                { category: "Terminal", description: "Rust-based terminal that feels like a modern text editor. AI command search is clutch." },
                { category: "Design", description: "Where all UI concepts start. I use it for wireframing, prototyping, and presentations." },
                { category: "Browser", description: "Changed how I browse the web. Spaces and Boosts make it incredibly flexible." },
                { category: "Database", description: "The best GUI for managing SQL databases. Clean, native, and fast." },
                { category: "Productivity", description: "Replaced Spotlight completely. Scripts, window management, and quick calculations." },
                { category: "Security", description: "I don't know any of my passwords, and that's the way I like it." },
            ],
        },
        subscriptions: {
            title: "Subscriptions & Services",
            plans: ["Premium", "AI Assistant", "Standard", "Bundle"],
        },
    },

    attribution: {
        heading: {
            title: "Attribution",
            subtitle: "Journey to create this personal portfolio.",
        },
        intro: {
            title: "Acknowledgments & Attribution",
            paragraphs: [
                "This portfolio was developed by [Zahin](https://github.com/isherezahin) as an open-source template built with Next.js and Tailwind CSS. The source code is publicly available on [GitHub](https://github.com/isherezahin/isherezahin.me) and licensed for personal and educational use with proper attribution.",
                "Initial development began on **October 1, 2025**. The project is actively maintained with continuous improvements and new features.",
                "Building on the work of the open-source community, this project draws inspiration from hundreds of portfolios, design systems, and technical implementations. The following contributors have made notable impact on the web development ecosystem and influenced this work.",
            ],
        },
        people: {
            title: "Design & Development Inspiration",
            descriptions: [
                "Component architecture and blog implementation patterns.",
                "Micro-interaction design and portfolio UX patterns.",
                "Visual design language for testimonials, imagery, and project showcases.",
            ],
        },
        tools: {
            title: "Technology Stack",
            descriptions: [
                "React framework for production-grade web applications.",
                "Utility-first CSS framework.",
                "Static type checking and enhanced developer experience.",
                "Version control and source code management.",
                "Community engagement via GraphQL API integration.",
                "Code quality and consistency enforcement.",
                "Authentication and session management.",
                "Declarative animations and transitions.",
                "Consistent icon system.",
                "Brand and platform iconography.",
                "Interactive 3D globe visualizations.",
                "Document-based data persistence.",
                "Real-time database and backend infrastructure.",
                "Accessible, unstyled component primitives.",
                "Pre-built component library extending Radix UI.",
                "Server state management and caching.",
                "Runtime schema validation.",
                "Performant form state management.",
                "Toast notification system.",
                "Drag and drop interactions.",
                "Media asset management and optimization.",
            ],
        },
        outro: {
            license:
                "This project is released under an open-source license. If you fork or extend this template, please retain this attribution section and acknowledge any additional contributors appropriately.",
            signOff: "Best,",
            contactLead: "For inquiries regarding this project or potential collaborations, reach out at",
        },
    },

    sideQuests: {
        heading: {
            title: "What's a Side Quest?",
            subtitle:
                'In real life, "SIDE QUEST" refers to any activity or experience that is not part of your main responsibilities or goals; for example, a hobby or skill, etc. While it is not mandatory, but it adds new color and experience to life.',
        },
        items: [
            {
                title: "Swimming",
                location: "Cox’s Bazar, BD",
                date: "Around 2009",
                description:
                    "I was born on Maheshkhali, the only one hilly island in Bangladesh, part of the Cox’s Bazar district. My childhood was spent in the calm of the village, where ponds are part of everyday life. We had one at my grandfather’s house, and I used to bathe there all the time. My uncles tried to teach me to swim, but I was always scared. One afternoon, while my grandmother was washing clothes by the pond, I ran and jumped in like I always did it. But that day, I landed in the deep middle of the pond. I was shocked. I remembered the moves my uncles had shown me, I applyed thats tricks, and somehow made it back to the edge, gasping but alive. Then so many times I swim in the open sea at Cox’s Bazar. The point is, nothing’s really impossible, you just need that one brave moment to try.",
            },
        ],
    },
};

/** Every other locale must provide exactly these keys. */
export type Dictionary = typeof en;
