import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const translations = {
  en: {
    nav: {
      services: 'Services',
      method: 'Method',
      projects: 'Projects',
      caseStudies: 'Case Studies',
      about: 'About',
      contact: 'Contact',
      cta: 'Start a Project',
      menuOpen: 'Menu',
      menuClose: 'Close',
    },
    footer: {
      summary: 'AI solutions, development systems, and media buying strategies built for performance and clarity.',
      servicesTitle: 'Services',
      services: ['AI Solutions', 'Development Solutions', 'Media Buying'],
      contactTitle: 'Contact',
      email: 'hello@lightlab.dev',
      location: 'Remote-first, global delivery',
      cta: 'Start a Project',
    },
    home: {
      heroTag: 'AI Solutions · Development · Media Buying',
      heroTitle1: 'Growth',
      heroTitle2: 'Systems.',
      heroMeta: 'Lightlab Studio ©2026',
      heroCopy: 'We build AI automation, product engineering, and paid media systems so your team ships faster and grows with clarity.',
      coreLabel: 'Core Services',
      servicesTitleLine1: 'Built to',
      servicesTitleLine2: 'Scale',
      servicesCta: 'Explore',
      bentoCards: [
        { title: 'Identity', copy: 'Visual systems for visionary brands.', span: 'md:col-span-1' },
        { title: 'Engineering', copy: 'High-performance headless commerce.', span: 'md:col-span-2' },
        { title: 'Motion', copy: 'Interactive storytelling through code.', span: 'md:col-span-2' },
        { title: 'Scale', copy: 'Data-driven growth architectures.', span: 'md:col-span-1' },
      ],
      clarity: [
        {
          title: 'What we do',
          lead: 'Build systems that run the business',
          copy: 'We design the automation, product platform, and paid growth engine to move from strategy to revenue fast.',
        },
        {
          title: 'Who we help',
          lead: 'Teams ready to scale',
          copy: 'Growth teams, founders, and operators who need execution velocity without losing quality.',
        },
        {
          title: 'How it works',
          lead: 'Clear plan, weekly delivery',
          copy: 'We start with a diagnostic, ship in sprints, and report outcomes every week.',
        },
      ],
      servicesTitle: 'Built to Scale',
      servicesSubtitle: 'Choose one track or combine all three into a single delivery roadmap.',
      serviceTracks: [
        {
          title: 'AI Solutions',
          copy: 'Agent workflows, internal copilots, and automation layers that reduce cycle time and unlock 24/7 execution.',
          href: '/services/ai',
        },
        {
          title: 'Development Solutions',
          copy: 'Full-stack product delivery with performance-first architecture, modern UI systems, and scalable APIs.',
          href: '/services/development',
        },
        {
          title: 'Media Buying',
          copy: 'Performance creative, funnel analytics, and growth experiments engineered for measurable ROAS.',
          href: '/services/media-buying',
        },
      ],
      impactStats: [
        { label: 'Average launch window', value: '6-10 weeks' },
        { label: 'Automation hours saved', value: '1,200+' },
        { label: 'Media efficiency lift', value: '24-41%' },
      ],
      methodTitle: 'The Method',
      methodCards: [
        {
          title: 'Architecture',
          copy: 'A rigorous process so every pixel and every line of code serves performance.',
          align: 'left',
        },
        {
          title: 'Execution',
          copy: 'Weekly sprints, real-time feedback, and total visibility into delivery.',
          align: 'right',
        },
        {
          title: 'Deployment',
          copy: 'Secure launches, growth monitoring, and continuous optimization driven by data.',
          align: 'left',
        },
      ],
      methodSteps: ['Architecture', 'Interface', 'Deployment'],
      methodCopy: 'A rigorous process ensuring that every pixel serves a purpose and every line of code drives performance.',
      testimonialsTitle: 'Proof of Work',
      testimonialsSubtitle: 'We operate like an internal product team, aligned to outcomes and accountable to performance.',
      testimonials: [
        {
          quote: 'The automations paid for themselves in the first 45 days. Their team moves like a product studio.',
          name: 'Amina Patel',
          role: 'COO, Meridian Commerce',
        },
        {
          quote: 'Lightlab rebuilt our acquisition funnel and our CAC dropped while conversion climbed.',
          name: 'Jordan Lee',
          role: 'VP Growth, Nova Health',
        },
      ],
      ctaTitle: 'Start a project',
      ctaCopy: 'Share your goals. We will design a delivery plan that covers automation, development, and paid growth.',
      ctaLabel: 'Next Move',
      ctaMeta: 'Response time',
      ctaMetaValue: 'Within 24 hours',
      ctaButton: 'Contact Lightlab',
    },
    services: {
      title: 'Built to Scale',
      subtitle: 'Clear service tracks for AI automation, product development, and paid media growth.',
      overview: {
        heroEyebrow: 'Expertise & Delivering',
        heroTitleLine1: 'Our',
        heroTitleLine2: 'Expertise.',
        heroSubtitle: 'Three core pillars to build, automate, and accelerate your digital assets.',
        tracks: [
          {
            title: 'AI Solutions',
            description: 'Agents, copilots, and automations that reduce cycle time 24/7.',
            deliverables: [
              'RAG & Knowledge base',
              'n8n/Make automation agents',
              'Custom chat interface',
              'LLM fine-tuning',
            ],
            tech: ['OPENAI', 'LANGCHAIN', 'PINECONE'],
            icon: 'ai',
            hint: 'Hover for details',
          },
          {
            title: 'Engineering',
            description: 'Full-stack delivery with performance architecture and modern UX.',
            deliverables: [
              'SaaS & dashboards',
              'Progressive web apps',
              'Design systems',
              'API & microservices',
            ],
            tech: ['NEXT.JS', 'TYPESCRIPT', 'SUPABASE'],
            icon: 'code',
            hint: 'Hover for details',
          },
          {
            title: 'Media Buying',
            description: 'Performance creative and funnel analytics for measurable ROAS.',
            deliverables: [
              'Meta & Google Ads',
              'Creative strategy',
              'Landing page CRO',
              'Attribution tracking',
            ],
            tech: ['AD LIBRIS', 'SEGMENT', 'HYROS'],
            icon: 'stats',
            hint: 'Hover for details',
          },
        ],
        workflowEyebrow: 'Our Method',
        workflowTitleLine1: 'Lightlab',
        workflowTitleLine2: 'Workflow.',
        workflowSteps: [
          {
            label: '01 / DISCOVERY',
            title: 'Diagnostic',
            copy: 'Analyze bottlenecks and define priority KPIs.',
          },
          {
            label: '02 / BLUEPRINT',
            title: 'Architecture',
            copy: 'Design automation flows and the technology stack.',
          },
          {
            label: '03 / BUILD',
            title: 'Sprints',
            copy: 'Iterative delivery with tangible releases every week.',
          },
          {
            label: '04 / OPTIMIZE',
            title: 'Scaling',
            copy: 'Maintenance, performance monitoring, and system expansion.',
          },
        ],
        ctaEyebrow: 'Ready to start?',
        ctaTitle: 'Launch your',
        ctaTitleEmphasis: 'Track',
        ctaCopy: 'Whether for an AI audit or a full engineering rebuild, we are ready.',
        ctaMetaLabel: 'Availability',
        ctaMetaValue: 'Open for 2 new projects this quarter',
        ctaButton: 'Book a diagnostic',
        },
      items: [
        {
          title: 'AI Solutions',
          summary: 'Agentic workflows, copilots, and automation layers that eliminate friction and unlock execution speed.',
          points: ['Automation discovery', 'Agent orchestration', 'Analytics and monitoring'],
        },
        {
          title: 'Development Solutions',
          summary: 'Modern product engineering with performance, stability, and design in sync from day one.',
          points: ['Product strategy', 'Full-stack builds', 'Launch and growth'],
        },
        {
          title: 'Media Buying',
          summary: 'Performance media systems blending creative testing, funnel analytics, and optimization loops.',
          points: ['Paid social + search', 'Creative lab', 'Conversion systems'],
        },
      ],
      stackTitle: 'Integrated delivery',
      stackIntro: 'Capability Stack',
      stackItems: ['AI workflow automation', 'Full-stack product builds', 'Paid media + creative lab', 'Analytics + reporting'],
      engagementTitle: 'Engagement Models',
      engagements: [
        {
          title: 'Sprint Build',
          copy: 'Focused delivery for a single product or automation system with weekly releases.',
        },
        {
          title: 'Growth Retainer',
          copy: 'Ongoing experimentation across AI, development, and paid media with KPI tracking.',
        },
        {
          title: 'Embedded Squad',
          copy: 'A dedicated pod integrated with your team for high-velocity product and growth execution.',
        },
      ],
      ctaTitle: 'Let us map the delivery plan.',
      ctaButton: 'Start a Project',
    },
    caseStudies: {
      title: 'Proof in numbers',
      subtitle: 'Selected engagements showing measurable outcomes across automation, product, and media systems.',
      overview: {
        heroEyebrow: 'Portfolio archive',
        heroTitleLine1: 'Case',
        heroTitleLine2: 'Studies.',
        filters: ['All', 'Automations', 'Product', 'Growth', 'Brand'],
        projects: [
          {
            title: 'Meridian AI',
            category: 'Automation & Software',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ71Fus2p8JOIY-GWcJwkQqiqdcAcwEgDOftcaBtYBjufs1tJi5IMDbIA4ou1VVoS_kS9zMjWFwleDXJ-qWGTRKUgE8bRzpe64eKKLSkNOEzTF8JlcOiCnktEZrMCtm3V10wipIcx9rlHnwa6l3iBbSd6n9tSq00j1u4eN9yV_ERWyW2eJa5hkbjKivIV5qsHQ_ATJf-MVMezNtlDXunbxOm7JmTMtTKAVl9b4ab_-qghQb-QgmFApjdR1cXp9X2akOEHRNKUACXA',
            span: 'lg:col-span-8',
            aspect: 'aspect-[16/10]',
            offset: '',
          },
          {
            title: 'Nova Health',
            category: 'Growth & Acquisition',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuA5PHVwWrsS5BPBFR86hSkQ0T4PBQYIFKRVKVQgCurmV6EjAh9wdSdeQIifEZ-ONvJFAqlN0raVIKfDkmD3UdnktrdtrZ-zz2Wmj0Eek2KIejRPBaqNYv6vjVnbY7FNzDPi7FKRdOB3gMKGyin77zfghfE3-44O-UXsdZy5rpXXyaEqG8hsS1EthA2xtFoaFx7XHkbZ_BAZyPIGAwSqWZnOrcXQrvn3wPQs7FBWcPnhJg91G4BmrCUTFx_m4ELPdfMq1ZFjgQ1EJ7w',
            span: 'lg:col-span-4',
            aspect: 'aspect-[4/5]',
            offset: 'lg:mt-24',
          },
          {
            title: 'Lumina',
            category: 'Visual identity',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuA6kC-ASkpUsUGCqMXdmA7_7RMNR_MkPKSogMYDDf48XnYihru2s6mDm3ajpklvXEaExuSSSeQmaaXSykocxRg1iG63cZ-aQgAGR4_hySDeeHiW4m65asETbmOMePmWkuJ5164C5xX1X1nP3QgE0f5QKMKwveOCBn7Hgai83z8L6xL27PUmYedAF5vyGLbhVjgyf90j2cFC9WGLovUBJsklZfpu4KdKLSR-fPb6KT5Zk4NjDVPn7Jy8guVo9zlKbi-DXgpL0D0bqeQ',
            span: 'lg:col-span-5',
            aspect: 'aspect-[1/1]',
            offset: 'lg:-mt-12',
          },
          {
            title: 'Ethereal',
            category: 'Product platform',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDHQVKfpkLgTT1oH6Q9NVWrsZr4O223CGt5LJWBI4YRBj1c-bKnFnAle2w0A-tUnOHehYG-mSjbA0K6KAAtPuZtKN4-uOUWvQPauW90gilYyLhyIhK_oECQKBzgVkXBQES-njcdib8GPKrWngR0K2oFMbGS-GVKyYie85LUoOpOcH_atFPe7MUl5HZbJkD8_hL82W4xZ4poqu5exXkSudhzhsN-CjQNHZqqJ8Wiyz_Q24xgorRBKS8Lk8AxdekHx2NtlnPgTl_O_4Y',
            span: 'lg:col-span-7',
            aspect: 'aspect-[16/11]',
            offset: '',
          },
          {
            title: 'Vertex',
            category: 'Creative engineering',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAxxaNSkX-mN_1f_o6ZmuAFHsHwz6h1ljD3gHw9W9HJgaEzW8imFoX0fG6TXLMZX4EHU6696ZzBl0nLRheflF0lZPz6TS8SV9RcdUCs0PYZNhqfDnNEWJnKBgHjmAjj_h2dcVmcx7ZjqVct7EGFQxP_auz80UmwQR_wRuUHN0JlWMXGDVkSc8fxdFGgMk4lA7cKEpHi_uwwD8WEwM99iEaRYmvtWsdjjqM_IKYMOGHhTMdFcp9dsSfU-JDaS4lP7nsMNO4OeXP4sYI',
            span: 'lg:col-span-4',
            aspect: 'aspect-[3/4]',
            offset: 'lg:mt-8',
          },
          {
            title: 'Oasis Pay',
            category: 'Fintech scale',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rV7eEpcIsWM8cs-vJAXoIW29vE6tUBbk-g8Bi_5o7MrJjznqbt6nhzgzlGBq0KVWCKC0-5j3vxYdYu2QLttdULWyujlTc-YGNy61FkEv7_6emgRFcKexDoq8CJijjgjEPEpo5mgXnAM2aeSQeHeeOl4CTwPdRf2MAVxGZi6qrfOJoXSPkq-Fa-BvSV8dOEhkqPhdcefFawfMkjrhOo5Yt_SbJauRi-GO95Oz-3aWDkj25CcE2Ntx-E70PTKV9OfeVGMIjDmSFYk',
            span: 'lg:col-span-8',
            aspect: 'aspect-[16/9]',
            offset: 'lg:-mt-32',
          },
        ],
        ctaEyebrow: 'Your turn',
        ctaTitleLine1: 'Write the',
        ctaTitleLine2: 'next chapter.',
        ctaCopy: 'We select a few projects per quarter to guarantee excellence in execution.',
        ctaMetaLabel: 'Availability',
        ctaMetaValue: 'Open for Q4 2024',
        ctaButton: 'Talk about your project',
      },
      outcomes: [
        { label: 'Revenue lift', value: '+18-36%' },
        { label: 'Automation ROI', value: '3.4x' },
        { label: 'Speed to launch', value: '6-9 weeks' },
      ],
      studies: [
        { title: 'AI Ops Automation', result: '42% faster fulfillment, 18% lower support load.', sector: 'Commerce' },
        { title: 'Product Platform Rebuild', result: '3x release velocity with a new modular stack.', sector: 'SaaS' },
        { title: 'Paid Media System', result: '30% CAC reduction with multi-channel optimization.', sector: 'Health' },
      ],
      flowTitle: 'From audit to compounding growth',
      flowSteps: ['Audit and data capture', 'System design + roadmap', 'Build, test, and launch', 'Optimize with weekly reporting'],
      ctaTitle: 'Want a deeper breakdown?',
      ctaCopy: 'We can share private performance decks on request.',
      ctaButton: 'Request Access',
    },
    about: {
      title: 'The Lightlab method',
      subtitle: 'We are a hybrid strategy and execution partner helping teams scale through AI, product engineering, and performance media systems.',
      overview: {
        heroEyebrow: 'Studio essence',
        heroTitleLine1: 'The team &',
        heroTitleLine2: 'The philosophy.',
        manifestoLabel: 'Our manifesto',
        manifestoLead: 'We believe technology should multiply talent, not slow it down.',
        manifestoCopy: 'Lightlab was born to reconcile high-end design with the raw power of automation. We are not only builders, we are system architects.',
        sinceLabel: 'Since 2018',
        team: [
          {
            name: 'Marc-Antoine D.',
            role: 'Founder & strategy',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-WiObxVsPmkQ60BBlUemaZyqfGhIww0J1dJP_oOdna1eSdrOLpiyMXwksm7kMFspOfi2Z2YqDnT-CVgxidujxjq8YNN37waeaOo8hQe1qi52-5A9zqwA0Yfj-wn9Vvoz4oPUjlI5gA8iAKhjuTCms6fC1jJKw3dp6NSF2QGgy3ykKecpdMFTeMW4-zCpR0pUFkGCqM6SPiRJajdyDa9qO3BjpclHg3o4TG_e2L7-uz50x1pHX_HDwd6NvKsUHo8R80o0DXRHQjSI',
            offset: '',
          },
          {
            name: 'Elena S.',
            role: 'Creative director',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDCdDFo6HpNgyg1fFtXhXfsr8mJ2k-QvlmDL1Rr33jOElVv_DHEPOj8_FRaXB96sEahbvXjV69e7qh5bQ3SHpezfKSy5h9NLfvVvcvmc2Iali1I0neV2ryRVFOkLcg-zTXQa1ltJD_iNuHVUDiiZjTBXtnvLnWdL7L3GiL-PZpqXtDWZpmHKH7bB75CuGtQtHUvGJbF7Myawi3Qd5s8CMqEKbqDczSTOSfW-QEZ17N6tqOcS9vVE_H4RwfHZyUAgxCT7IU-ffBQOw',
            offset: 'md:mt-12',
          },
          {
            name: 'Thomas L.',
            role: 'Lead engineering',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABLLseZ3w1row4yMcDl1gCIMRYkOzbvDCRInKr5PZoKZXsqtqVo0moJg5q_O6iopvPqpUXc2T3UdAU1IRZrkWhTVj_PMytzHooKJb05090DMGyYevWMoaBxYj4sVTm-8g3ME4YuOqGZV_N3QqTQA0glZewL-Xz08yernZKWscLXeYm_NqMcmB4CoONZ5q9D32miypw_hZT8FFQNumyJvX7OqAYNZhmDkaToCSzzdNjZe-dY2qXSs_eFV3uOD_Bk83ENRMucT_hVDQ',
            offset: '',
          },
          {
            name: 'Sarah B.',
            role: 'Growth & media',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpReR8Pb0tc3bRZ5T6tIm32i4tfgWjSVslYF2U4w8rRJW_OXx_MOJ7wFyYk3nunfcwGTgXAU6imN6Iuchb7_gLYCTvCpgGEE-OObRypilK04Zhul8Il6KdT-fozXiYm5tJ-WiWIXJOHYD8xRzW5DVSAovTKN5CnDBf3bqhHNsSjftOySAhiRx1o8pgYjA7JMGfXo1F5iTWhzIIvja7A3gYKfjChcJYBfXpWTcppCPPHmKS65xwj5yuGv7z8C5K8LDWWr9306aD9T0',
            offset: 'md:mt-12',
          },
        ],
        pillars: [
          {
            label: '01. Technical integrity',
            title: 'No debt, only value.',
            copy: 'Every system we ship is built to last. We refuse shortcuts that compromise future scale.',
          },
          {
            label: '02. Invisible design',
            title: 'Utility before artifice.',
            copy: 'Great design is the one you do not notice because it works perfectly.',
          },
          {
            label: '03. Outcome culture',
            title: 'Impact as the only metric.',
            copy: 'If a project does not improve time or revenue within 90 days, we revisit the approach.',
          },
        ],
        journeyEyebrow: 'Our journey',
        journeyTitle: 'Milestones.',
        milestones: [
          {
            date: 'January 2018',
            title: 'Genesis',
            copy: 'Lightlab is founded in a small Paris studio with one vision: automate creativity.',
            align: 'left',
          },
          {
            date: 'March 2020',
            title: 'Pivot scale',
            copy: 'We launched our first Engineering & Growth track for hyper-growth startups.',
            align: 'right',
          },
          {
            date: 'September 2022',
            title: 'Intelligence',
            copy: 'We embedded AI agents deeply into our internal and client workflows.',
            align: 'left',
          },
          {
            date: 'Today',
            title: 'Global studio',
            copy: 'A distributed team, 50+ systems shipped, and a culture of uncompromising craft.',
            align: 'right',
          },
        ],
        ctaEyebrow: 'Join the journey',
        ctaTitle: 'Shall we talk?',
        ctaCopy: 'Whether you are a future collaborator or partner, our door is open to sharp minds.',
        ctaMetaLabel: 'Availability',
        ctaMetaValue: 'Next slots: Q3 2024',
        ctaButton: 'Contact Lightlab',
      },
      values: [
        'Execution velocity without sacrificing craft.',
        'Systems thinking across automation, product, and media.',
        'Transparent reporting and measurable outcomes.',
      ],
      principlesTitle: 'Operating principles',
      principles: [
        { title: 'Strategic clarity', copy: 'Every engagement starts with a clear outcome and the metrics that define success.' },
        { title: 'Crafted execution', copy: 'Design, engineering, and growth are built together for seamless delivery.' },
        { title: 'Compounding loops', copy: 'We build systems that improve with every release and campaign.' },
      ],
      teamTitle: 'Team stack',
      teamSubtitle: 'Multi-disciplinary pods',
      teamStack: ['AI automation engineers', 'Full-stack product builders', 'Performance media strategists', 'Creative technologists'],
      ctaTitle: 'Let us build your next flagship.',
      ctaButton: 'Schedule a Call',
    },
    projects: {
      title: 'Selected builds',
      subtitle: 'A snapshot of recent systems spanning AI automation, software development, and media buying.',
      items: [
        { title: 'Helios Automation Suite', focus: 'AI + Ops', result: 'Reduced support workload by 22% in 60 days.' },
        { title: 'Pulse Commerce Build', focus: 'Development', result: '3x release velocity with a modular storefront.' },
        { title: 'Nova Media Engine', focus: 'Media Buying', result: 'CAC down 28% with multi-channel testing.' },
        { title: 'Beacon Growth Stack', focus: 'AI + Media', result: 'ROAS lift of 32% after automation rollout.' },
      ],
      focusTitle: 'Where we build',
      focusItems: [
        'Automation systems for operations teams',
        'Product platforms with high-velocity releases',
        'Paid media engines optimized for compounding ROI',
      ],
      ctaTitle: 'Ready to bring your next platform to life? We can map the roadmap this week.',
      ctaButton: 'Start a Project',
    },
    contact: {
      title: 'Start the build',
      subtitle: 'Tell us about your goals. We will map the strategy and assemble the right automation, build, or media stack to deliver.',
      heroEyebrow: 'Start a conversation',
      heroTitleLine1: 'Let us talk about',
      heroTitleLine2: 'your project.',
      serviceQuestion: '01 — What service do you need?',
      nameLabel: '02 — Your name',
      emailLabel: '03 — Your email',
      detailsLabel: '04 — Project details',
      namePlaceholder: 'Jordan Lee',
      emailPlaceholder: 'you@company.com',
      detailsPlaceholder: 'Describe your growth goals...',
      sendLabel: 'Send message',
      statusLabel: 'Status: Available for new projects',
      studioLabel: 'Studio info',
      followLabel: 'Follow us',
      processLabel: 'Process time',
      processCopy: 'Reply guaranteed within 24 business hours.',
      socials: ['LinkedIn', 'X / Twitter', 'Instagram'],
      meta: {
        response: 'Response time',
        responseValue: 'Within 24 hours',
        emailLabel: 'Email',
        locationLabel: 'Location',
        locationValue: 'Remote-first · Global delivery',
      },
      form: {
        name: 'Name',
        email: 'Email',
        company: 'Company (optional)',
        projectType: 'Project Type',
        letter: 'Letter',
        selectPlaceholder: 'Choose a track',
        submit: 'Submit Request',
      },
      projectTypes: ['AI Solutions', 'Development Solutions', 'Media Buying'],
      faqTitle: 'What to expect',
      faqSubtitle: 'We keep discovery fast and execution structured so you can move quickly with clarity.',
      faqs: [
        {
          q: 'How fast can we start?',
          a: 'Discovery can start within a week. Build timelines range from 6-10 weeks depending on scope.',
        },
        {
          q: 'Do you handle strategy + execution?',
          a: 'Yes. We align on KPIs, map the system, and deliver in weekly sprints with reporting.',
        },
        {
          q: 'Which industries do you serve?',
          a: 'Commerce, SaaS, healthcare, and service businesses focused on measurable growth.',
        },
      ],
    },
    method: {
      heroEyebrow: 'Workflow & rigor',
      heroTitleLine1: 'Our',
      heroTitleLine2: 'Method.',
      heroCopy: 'A rigorous delivery framework designed to turn ambition into predictable growth systems.',
      steps: [
        {
          number: '01',
          title: 'Diagnostic',
          copy: 'We immerse in your ecosystem, identify friction points, and surface automation leverage.',
          deliverablesLabel: 'Deliverables',
          deliverables: ['AI process audit', 'Tech stack analysis', 'Bottleneck mapping'],
          metaLabel: 'Duration',
          metaValue: 'Week 01 — Immersion',
        },
        {
          number: '02',
          title: 'Blueprint',
          copy: 'We design the technical and strategic architecture before any line of code is written.',
          deliverablesLabel: 'Deliverables',
          deliverables: ['Delivery roadmap', 'AI architecture schema', 'Low-fidelity prototype'],
          metaLabel: 'Duration',
          metaValue: 'Week 02 — Design',
        },
        {
          number: '03',
          title: 'Sprints',
          copy: 'Weekly delivery cycles with production-ready features and clear progress visibility.',
          deliverablesLabel: 'Deliverables',
          deliverables: ['Weekly sprint review', 'GitHub repository access', 'Staging environment'],
          metaLabel: 'Duration',
          metaValue: '7-day cycles — Delivery',
        },
        {
          number: '04',
          title: 'Scaling',
          copy: 'Launch, monitor KPIs, and optimize the system to support increasing load.',
          deliverablesLabel: 'Deliverables',
          deliverables: ['Performance dashboard', 'Maintenance plan', 'Quarterly ROI review'],
          metaLabel: 'Goal',
          metaValue: 'Exponential growth',
        },
      ],
      ctaTitleLine1: 'Ready to',
      ctaTitleLine2: 'structure?',
      ctaCopy: 'Every project starts with a conversation. Let us review your current systems.',
      ctaPrimary: 'Book a diagnostic',
      ctaSecondary: 'View our projects',
    },
  },
  fr: {
    nav: {
      services: 'Services',
      method: 'Methode',
      projects: 'Projets',
      caseStudies: 'Cas clients',
      about: 'A propos',
      contact: 'Contact',
      cta: 'Demarrer un projet',
      menuOpen: 'Menu',
      menuClose: 'Fermer',
    },
    footer: {
      summary: 'Solutions IA, developpement produit et media buying pour une croissance claire et mesurable.',
      servicesTitle: 'Services',
      services: ['Solutions IA', 'Developpement', 'Media Buying'],
      contactTitle: 'Contact',
      email: 'hello@lightlab.dev',
      location: 'Remote-first, livraison globale',
      cta: 'Demarrer un projet',
    },
    home: {
      heroTag: 'Solutions IA · Developpement · Media Buying',
      heroTitle1: 'Systemes',
      heroTitle2: 'de croissance.',
      heroMeta: 'Lightlab Studio ©2026',
      heroCopy: 'Nous construisons l automation IA, le developpement produit et les systemes media pour que votre equipe livre plus vite.',
      coreLabel: 'Services',
      servicesTitleLine1: 'Concu pour',
      servicesTitleLine2: 'scaler',
      servicesCta: 'Explorer',
      bentoCards: [
        { title: 'Identite', copy: 'Systemes visuels pour marques ambitieuses.', span: 'md:col-span-1' },
        { title: 'Engineering', copy: 'Plateformes performantes et scalables.', span: 'md:col-span-2' },
        { title: 'Motion', copy: 'Narration interactive par le code.', span: 'md:col-span-2' },
        { title: 'Scale', copy: 'Architectures de croissance data-driven.', span: 'md:col-span-1' },
      ],
      clarity: [
        {
          title: 'Ce que nous faisons',
          lead: 'Des systemes qui font tourner le business',
          copy: 'Nous concevons l automation, la plateforme produit et la machine media pour passer de la strategie au revenu.',
        },
        {
          title: 'Pour qui',
          lead: 'Equipes en phase de scale',
          copy: 'Growth teams, fondateurs et operators qui veulent livrer vite sans perdre en qualite.',
        },
        {
          title: 'Notre methode',
          lead: 'Plan clair, execution hebdo',
          copy: 'Diagnostic, sprints, et reporting toutes les semaines avec des resultats concrets.',
        },
      ],
      servicesTitle: 'Concu pour scaler',
      servicesSubtitle: 'Choisissez un track ou combinez les trois dans une roadmap unique.',
      serviceTracks: [
        {
          title: 'Solutions IA',
          copy: 'Agents, copilots internes et automations qui reduisent le cycle time 24/7.',
          href: '/services/ai',
        },
        {
          title: 'Developpement',
          copy: 'Delivery full-stack avec architecture performante, UX moderne et APIs scalables.',
          href: '/services/development',
        },
        {
          title: 'Media Buying',
          copy: 'Creatifs performants, analytics de funnel et experiments pour un ROAS mesurable.',
          href: '/services/media-buying',
        },
      ],
      impactStats: [
        { label: 'Delai moyen de lancement', value: '6-10 semaines' },
        { label: 'Heures automatisees', value: '1,200+' },
        { label: 'Gain d efficacite media', value: '24-41%' },
      ],
      methodTitle: 'La methode',
      methodCards: [
        {
          title: 'Architecture',
          copy: 'Un process rigoureux pour que chaque pixel et chaque ligne de code servent la performance.',
          align: 'left',
        },
        {
          title: 'Execution',
          copy: 'Des sprints hebdomadaires, des feedbacks en temps reel et une visibilite totale sur l avancement.',
          align: 'right',
        },
        {
          title: 'Deploiement',
          copy: 'Mise en production securisee, monitoring de croissance et optimisation continue basee sur la donnee.',
          align: 'left',
        },
      ],
      methodSteps: ['Architecture', 'Interface', 'Deploiement'],
      methodCopy: 'Un process rigoureux pour que chaque pixel et chaque ligne de code servent la performance.',
      testimonialsTitle: 'Preuves concretes',
      testimonialsSubtitle: 'Nous operons comme une equipe produit interne, alignee aux resultats.',
      testimonials: [
        {
          quote: 'Les automations se sont rentabilisees en 45 jours. Leur equipe travaille comme un studio produit.',
          name: 'Amina Patel',
          role: 'COO, Meridian Commerce',
        },
        {
          quote: 'Lightlab a reconstruit notre funnel et le CAC a baisse pendant que la conversion montait.',
          name: 'Jordan Lee',
          role: 'VP Growth, Nova Health',
        },
      ],
      ctaTitle: 'Demarrer un projet',
      ctaCopy: 'Partagez vos objectifs. Nous concevons un plan qui couvre automation, dev et media.',
      ctaLabel: 'Prochaine etape',
      ctaMeta: 'Temps de reponse',
      ctaMetaValue: 'Moins de 24 heures',
      ctaButton: 'Contacter Lightlab',
    },
    services: {
      title: 'Concu pour scaler',
      subtitle: 'Tracks clairs pour l automation IA, le developpement produit et la croissance media.',
      overview: {
        heroEyebrow: 'Expertise & Delivery',
        heroTitleLine1: 'Nos',
        heroTitleLine2: 'Expertises.',
        heroSubtitle: 'Trois piliers fondamentaux pour construire, automatiser et propulser vos actifs digitaux.',
        tracks: [
          {
            title: 'Solutions IA',
            description: 'Agents, copilots et automations qui reduisent le cycle time 24/7.',
            deliverables: [
              'RAG & Base de connaissance',
              'Agents d automation n8n/Make',
              'Interface chat custom',
              'Fine-tuning LLM',
            ],
            tech: ['OPENAI', 'LANGCHAIN', 'PINECONE'],
            icon: 'ai',
            hint: 'Survoler pour details',
          },
          {
            title: 'Engineering',
            description: 'Delivery full-stack avec architecture performante et UX moderne.',
            deliverables: [
              'SaaS & dashboards',
              'Progressive web apps',
              'Design systems',
              'API & microservices',
            ],
            tech: ['NEXT.JS', 'TYPESCRIPT', 'SUPABASE'],
            icon: 'code',
            hint: 'Survoler pour details',
          },
          {
            title: 'Media Buying',
            description: 'Creatifs performants et analytics de funnel pour un ROAS mesurable.',
            deliverables: [
              'Meta & Google Ads',
              'Creative strategy',
              'Landing page CRO',
              'Attribution tracking',
            ],
            tech: ['AD LIBRIS', 'SEGMENT', 'HYROS'],
            icon: 'stats',
            hint: 'Survoler pour details',
          },
        ],
        workflowEyebrow: 'Notre Methode',
        workflowTitleLine1: 'Le Workflow',
        workflowTitleLine2: 'Lightlab.',
        workflowSteps: [
          {
            label: '01 / DISCOVERY',
            title: 'Diagnostic',
            copy: 'Analyse de vos goulots d etranglement et definition des KPIs prioritaires.',
          },
          {
            label: '02 / BLUEPRINT',
            title: 'Architecture',
            copy: 'Conception des flux d automatisation et de la stack technologique.',
          },
          {
            label: '03 / BUILD',
            title: 'Sprints',
            copy: 'Developpement iteratif avec des livraisons chaque semaine.',
          },
          {
            label: '04 / OPTIMIZE',
            title: 'Scaling',
            copy: 'Maintenance, monitoring de la performance et expansion du systeme.',
          },
        ],
        ctaEyebrow: 'Pret a demarrer ?',
        ctaTitle: 'Lancez votre',
        ctaTitleEmphasis: 'Track',
        ctaCopy: 'Que ce soit pour un audit IA ou une refonte complete de votre engineering, nous sommes prets.',
        ctaMetaLabel: 'Disponibilite',
        ctaMetaValue: 'Ouvert pour 2 nouveaux projets ce trimestre',
        ctaButton: 'Reserver un diagnostic',
      },
      items: [
        {
          title: 'Solutions IA',
          summary: 'Workflows agents, copilots et automations qui eliminent les frictions.',
          points: ['Discovery automation', 'Orchestration agents', 'Analytics et monitoring'],
        },
        {
          title: 'Developpement',
          summary: 'Engineering moderne avec performance, stabilite et design alignes.',
          points: ['Strategie produit', 'Build full-stack', 'Lancement + growth'],
        },
        {
          title: 'Media Buying',
          summary: 'Systemes media qui combinent creatifs, analytics et optimisation continue.',
          points: ['Paid social + search', 'Creative lab', 'Optimisation conversion'],
        },
      ],
      stackTitle: 'Delivery integree',
      stackIntro: 'Capability Stack',
      stackItems: ['Automation workflows IA', 'Builds full-stack', 'Paid media + creative lab', 'Analytics + reporting'],
      engagementTitle: 'Modeles de collaboration',
      engagements: [
        {
          title: 'Sprint Build',
          copy: 'Delivery cible pour un produit ou un systeme automation avec releases hebdo.',
        },
        {
          title: 'Growth Retainer',
          copy: 'Experimentation continue sur IA, dev et media avec KPIs suivis.',
        },
        {
          title: 'Embedded Squad',
          copy: 'Une equipe dediee integree a la votre pour une execution rapide.',
        },
      ],
      ctaTitle: 'Cartographions le plan de delivery.',
      ctaButton: 'Demarrer un projet',
    },
    caseStudies: {
      title: 'Preuves chiffre',
      subtitle: 'Engagements selectionnes avec des resultats mesurables sur automation, produit et media.',
      overview: {
        heroEyebrow: 'Portfolio archive',
        heroTitleLine1: 'Etudes',
        heroTitleLine2: 'de cas.',
        filters: ['Tout', 'Automations', 'Product', 'Growth', 'Brand'],
        projects: [
          {
            title: 'Meridian AI',
            category: 'Automation & Logiciel',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBJ71Fus2p8JOIY-GWcJwkQqiqdcAcwEgDOftcaBtYBjufs1tJi5IMDbIA4ou1VVoS_kS9zMjWFwleDXJ-qWGTRKUgE8bRzpe64eKKLSkNOEzTF8JlcOiCnktEZrMCtm3V10wipIcx9rlHnwa6l3iBbSd6n9tSq00j1u4eN9yV_ERWyW2eJa5hkbjKivIV5qsHQ_ATJf-MVMezNtlDXunbxOm7JmTMtTKAVl9b4ab_-qghQb-QgmFApjdR1cXp9X2akOEHRNKUACXA',
            span: 'lg:col-span-8',
            aspect: 'aspect-[16/10]',
            offset: '',
          },
          {
            title: 'Nova Health',
            category: 'Growth & Acquisition',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuA5PHVwWrsS5BPBFR86hSkQ0T4PBQYIFKRVKVQgCurmV6EjAh9wdSdeQIifEZ-ONvJFAqlN0raVIKfDkmD3UdnktrdtrZ-zz2Wmj0Eek2KIejRPBaqNYv6vjVnbY7FNzDPi7FKRdOB3gMKGyin77zfghfE3-44O-UXsdZy5rpXXyaEqG8hsS1EthA2xtFoaFx7XHkbZ_BAZyPIGAwSqWZnOrcXQrvn3wPQs7FBWcPnhJg91G4BmrCUTFx_m4ELPdfMq1ZFjgQ1EJ7w',
            span: 'lg:col-span-4',
            aspect: 'aspect-[4/5]',
            offset: 'lg:mt-24',
          },
          {
            title: 'Lumina',
            category: 'Identite visuelle',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuA6kC-ASkpUsUGCqMXdmA7_7RMNR_MkPKSogMYDDf48XnYihru2s6mDm3ajpklvXEaExuSSSeQmaaXSykocxRg1iG63cZ-aQgAGR4_hySDeeHiW4m65asETbmOMePmWkuJ5164C5xX1X1nP3QgE0f5QKMKwveOCBn7Hgai83z8L6xL27PUmYedAF5vyGLbhVjgyf90j2cFC9WGLovUBJsklZfpu4KdKLSR-fPb6KT5Zk4NjDVPn7Jy8guVo9zlKbi-DXgpL0D0bqeQ',
            span: 'lg:col-span-5',
            aspect: 'aspect-[1/1]',
            offset: 'lg:-mt-12',
          },
          {
            title: 'Ethereal',
            category: 'Plateforme produit',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuDHQVKfpkLgTT1oH6Q9NVWrsZr4O223CGt5LJWBI4YRBj1c-bKnFnAle2w0A-tUnOHehYG-mSjbA0K6KAAtPuZtKN4-uOUWvQPauW90gilYyLhyIhK_oECQKBzgVkXBQES-njcdib8GPKrWngR0K2oFMbGS-GVKyYie85LUoOpOcH_atFPe7MUl5HZbJkD8_hL82W4xZ4poqu5exXkSudhzhsN-CjQNHZqqJ8Wiyz_Q24xgorRBKS8Lk8AxdekHx2NtlnPgTl_O_4Y',
            span: 'lg:col-span-7',
            aspect: 'aspect-[16/11]',
            offset: '',
          },
          {
            title: 'Vertex',
            category: 'Creative engineering',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAxxaNSkX-mN_1f_o6ZmuAFHsHwz6h1ljD3gHw9W9HJgaEzW8imFoX0fG6TXLMZX4EHU6696ZzBl0nLRheflF0lZPz6TS8SV9RcdUCs0PYZNhqfDnNEWJnKBgHjmAjj_h2dcVmcx7ZjqVct7EGFQxP_auz80UmwQR_wRuUHN0JlWMXGDVkSc8fxdFGgMk4lA7cKEpHi_uwwD8WEwM99iEaRYmvtWsdjjqM_IKYMOGHhTMdFcp9dsSfU-JDaS4lP7nsMNO4OeXP4sYI',
            span: 'lg:col-span-4',
            aspect: 'aspect-[3/4]',
            offset: 'lg:mt-8',
          },
          {
            title: 'Oasis Pay',
            category: 'Fintech scale',
            image:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rV7eEpcIsWM8cs-vJAXoIW29vE6tUBbk-g8Bi_5o7MrJjznqbt6nhzgzlGBq0KVWCKC0-5j3vxYdYu2QLttdULWyujlTc-YGNy61FkEv7_6emgRFcKexDoq8CJijjgjEPEpo5mgXnAM2aeSQeHeeOl4CTwPdRf2MAVxGZi6qrfOJoXSPkq-Fa-BvSV8dOEhkqPhdcefFawfMkjrhOo5Yt_SbJauRi-GO95Oz-3aWDkj25CcE2Ntx-E70PTKV9OfeVGMIjDmSFYk',
            span: 'lg:col-span-8',
            aspect: 'aspect-[16/9]',
            offset: 'lg:-mt-32',
          },
        ],
        ctaEyebrow: 'Votre tour',
        ctaTitleLine1: 'Ecrivons le',
        ctaTitleLine2: 'prochain chapitre.',
        ctaCopy: 'Nous selectionnons quelques projets par trimestre pour garantir une excellence absolue dans l execution.',
        ctaMetaLabel: 'Disponibilite',
        ctaMetaValue: 'Ouvert pour Q4 2024',
        ctaButton: 'Parler de votre projet',
      },
      outcomes: [
        { label: 'Croissance revenu', value: '+18-36%' },
        { label: 'ROI automation', value: '3.4x' },
        { label: 'Delai de lancement', value: '6-9 semaines' },
      ],
      studies: [
        { title: 'AI Ops Automation', result: '42% plus rapide, 18% moins de support.', sector: 'Commerce' },
        { title: 'Rebuild plateforme', result: '3x vitesse de release avec stack modulaire.', sector: 'SaaS' },
        { title: 'Systeme media', result: 'CAC -30% avec optimisation multi-canal.', sector: 'Health' },
      ],
      flowTitle: 'De l audit a la croissance',
      flowSteps: ['Audit et capture data', 'System design + roadmap', 'Build, test, launch', 'Optimisation hebdo'],
      ctaTitle: 'Besoin d un detail complet ?',
      ctaCopy: 'Nous partageons des decks performance sur demande.',
      ctaButton: 'Demander acces',
    },
    about: {
      title: 'La methode Lightlab',
      subtitle: 'Partenaire hybride strategie + execution pour scaler via IA, engineering produit et media performance.',
      overview: {
        heroEyebrow: 'L essence du studio',
        heroTitleLine1: 'L equipe &',
        heroTitleLine2: 'La philosophie.',
        manifestoLabel: 'Notre manifeste',
        manifestoLead: 'Nous croyons que la technologie doit multiplier le talent, pas le freiner.',
        manifestoCopy: 'Lightlab est ne pour reconcilier l esthetique du design haut de gamme avec la puissance de l automation. Nous ne sommes pas seulement des builders, nous sommes des architectes de systemes.',
        sinceLabel: 'Depuis 2018',
        team: [
          {
            name: 'Marc-Antoine D.',
            role: 'Fondateur & strategie',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-WiObxVsPmkQ60BBlUemaZyqfGhIww0J1dJP_oOdna1eSdrOLpiyMXwksm7kMFspOfi2Z2YqDnT-CVgxidujxjq8YNN37waeaOo8hQe1qi52-5A9zqwA0Yfj-wn9Vvoz4oPUjlI5gA8iAKhjuTCms6fC1jJKw3dp6NSF2QGgy3ykKecpdMFTeMW4-zCpR0pUFkGCqM6SPiRJajdyDa9qO3BjpclHg3o4TG_e2L7-uz50x1pHX_HDwd6NvKsUHo8R80o0DXRHQjSI',
            offset: '',
          },
          {
            name: 'Elena S.',
            role: 'Directrice artistique',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDCdDFo6HpNgyg1fFtXhXfsr8mJ2k-QvlmDL1Rr33jOElVv_DHEPOj8_FRaXB96sEahbvXjV69e7qh5bQ3SHpezfKSy5h9NLfvVvcvmc2Iali1I0neV2ryRVFOkLcg-zTXQa1ltJD_iNuHVUDiiZjTBXtnvLnWdL7L3GiL-PZpqXtDWZpmHKH7bB75CuGtQtHUvGJbF7Myawi3Qd5s8CMqEKbqDczSTOSfW-QEZ17N6tqOcS9vVE_H4RwfHZyUAgxCT7IU-ffBQOw',
            offset: 'md:mt-12',
          },
          {
            name: 'Thomas L.',
            role: 'Lead engineering',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABLLseZ3w1row4yMcDl1gCIMRYkOzbvDCRInKr5PZoKZXsqtqVo0moJg5q_O6iopvPqpUXc2T3UdAU1IRZrkWhTVj_PMytzHooKJb05090DMGyYevWMoaBxYj4sVTm-8g3ME4YuOqGZV_N3QqTQA0glZewL-Xz08yernZKWscLXeYm_NqMcmB4CoONZ5q9D32miypw_hZT8FFQNumyJvX7OqAYNZhmDkaToCSzzdNjZe-dY2qXSs_eFV3uOD_Bk83ENRMucT_hVDQ',
            offset: '',
          },
          {
            name: 'Sarah B.',
            role: 'Expert growth & media',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpReR8Pb0tc3bRZ5T6tIm32i4tfgWjSVslYF2U4w8rRJW_OXx_MOJ7wFyYk3nunfcwGTgXAU6imN6Iuchb7_gLYCTvCpgGEE-OObRypilK04Zhul8Il6KdT-fozXiYm5tJ-WiWIXJOHYD8xRzW5DVSAovTKN5CnDBf3bqhHNsSjftOySAhiRx1o8pgYjA7JMGfXo1F5iTWhzIIvja7A3gYKfjChcJYBfXpWTcppCPPHmKS65xwj5yuGv7z8C5K8LDWWr9306aD9T0',
            offset: 'md:mt-12',
          },
        ],
        pillars: [
          {
            label: '01. Integrite technique',
            title: 'Pas de dette, juste de la valeur.',
            copy: 'Chaque systeme livre est pense pour durer. Aucun raccourci qui sacrifie la scalabilite.',
          },
          {
            label: '02. Design invisible',
            title: 'L utilite avant l artifice.',
            copy: 'Le bon design est celui qu on ne remarque pas parce qu il fonctionne parfaitement.',
          },
          {
            label: '03. Culture du resultat',
            title: 'L impact comme metrique.',
            copy: 'Si un projet ne cree pas un gain mesurable sous 90 jours, on revoit l execution.',
          },
        ],
        journeyEyebrow: 'Notre parcours',
        journeyTitle: 'Milestones.',
        milestones: [
          {
            date: 'Janvier 2018',
            title: 'Genese',
            copy: 'Fondation de Lightlab dans un petit studio a Paris avec une vision unique.',
            align: 'left',
          },
          {
            date: 'Mars 2020',
            title: 'Pivot scale',
            copy: 'Lancement du track Engineering & Growth pour accompagner les startups en hyper-croissance.',
            align: 'right',
          },
          {
            date: 'Septembre 2022',
            title: 'Intelligence',
            copy: 'Integration massive des agents IA dans nos workflows internes et clients.',
            align: 'left',
          },
          {
            date: 'Aujourd hui',
            title: 'Global studio',
            copy: 'Equipe distribuee, plus de 50 systemes livres et une culture de l excellence.',
            align: 'right',
          },
        ],
        ctaEyebrow: 'Rejoindre l aventure',
        ctaTitle: 'On discute ?',
        ctaCopy: 'Que vous soyez un futur collaborateur ou un partenaire, notre porte est ouverte.',
        ctaMetaLabel: 'Disponibilite',
        ctaMetaValue: 'Prochains slots : Q3 2024',
        ctaButton: 'Contacter Lightlab',
      },
      values: [
        'Vitesse d execution sans compromis sur la qualite.',
        'Systemes IA, produit et media alignes.',
        'Reporting transparent et outcomes mesurables.',
      ],
      principlesTitle: 'Principes',
      principles: [
        { title: 'Clarte strategique', copy: 'Chaque mission demarre avec des KPIs precis et partages.' },
        { title: 'Execution soignee', copy: 'Design, engineering et growth construits ensemble.' },
        { title: 'Boucles de progression', copy: 'Des systemes qui s ameliorent a chaque release.' },
      ],
      teamTitle: 'Team stack',
      teamSubtitle: 'Pods multidisciplinaires',
      teamStack: ['Engineers automation IA', 'Builders full-stack', 'Strateges media performance', 'Creative technologists'],
      ctaTitle: 'Construisons votre prochain flagship.',
      ctaButton: 'Planifier un call',
    },
    projects: {
      title: 'Builds selectionnes',
      subtitle: 'Apercu des systemes IA, developpement logiciel et media buying recents.',
      items: [
        { title: 'Helios Automation Suite', focus: 'IA + Ops', result: 'Charge support -22% en 60 jours.' },
        { title: 'Pulse Commerce Build', focus: 'Developpement', result: '3x vitesse de release avec storefront modulaire.' },
        { title: 'Nova Media Engine', focus: 'Media Buying', result: 'CAC -28% avec tests multi-canal.' },
        { title: 'Beacon Growth Stack', focus: 'IA + Media', result: 'ROAS +32% apres automation.' },
      ],
      focusTitle: 'Zones de delivery',
      focusItems: [
        'Automations pour ops',
        'Plateformes produit a haute cadence',
        'Engines media optimisees pour ROI',
      ],
      ctaTitle: 'Pret a lancer votre prochaine plateforme ?',
      ctaButton: 'Demarrer un projet',
    },
    contact: {
      title: 'Demarrer un projet',
      subtitle: 'Partagez vos objectifs. Nous assemblerons la stack automation, dev et media pour livrer.',
      heroEyebrow: 'Demarrer une conversation',
      heroTitleLine1: 'Parlons de',
      heroTitleLine2: 'votre projet.',
      serviceQuestion: '01 — Quel service vous interesse ?',
      nameLabel: '02 — Votre nom',
      emailLabel: '03 — Votre email',
      detailsLabel: '04 — Details du projet',
      namePlaceholder: 'Jean Dupont',
      emailPlaceholder: 'jean@compagnie.fr',
      detailsPlaceholder: 'Decrivez vos objectifs de croissance...',
      sendLabel: 'Envoyer le message',
      statusLabel: 'Status: Disponible pour de nouveaux projets',
      studioLabel: 'Studio info',
      followLabel: 'Suivez-nous',
      processLabel: 'Process time',
      processCopy: 'Reponse garantie sous 24h ouvrees.',
      socials: ['LinkedIn', 'X / Twitter', 'Instagram'],
      meta: {
        response: 'Temps de reponse',
        responseValue: 'Moins de 24 heures',
        emailLabel: 'Email',
        locationLabel: 'Localisation',
        locationValue: 'Remote-first · Global',
      },
      form: {
        name: 'Nom',
        email: 'Email',
        company: 'Entreprise (optionnel)',
        projectType: 'Type de projet',
        letter: 'Message',
        selectPlaceholder: 'Choisir un track',
        submit: 'Envoyer la demande',
      },
      projectTypes: ['Solutions IA', 'Developpement', 'Media Buying'],
      faqTitle: 'A quoi s attendre',
      faqSubtitle: 'Discovery rapide et execution structuree pour avancer avec clarte.',
      faqs: [
        {
          q: 'Quand pouvons-nous demarrer ?',
          a: 'La discovery peut demarrer en une semaine. Le build prend 6-10 semaines selon le scope.',
        },
        {
          q: 'Strategie + execution ?',
          a: 'Oui. KPIs, systeme, delivery en sprints et reporting hebdo.',
        },
        {
          q: 'Quels secteurs ?',
          a: 'Commerce, SaaS, health et services avec focus croissance.',
        },
      ],
    },
    method: {
      heroEyebrow: 'Workflow & rigueur',
      heroTitleLine1: 'Notre',
      heroTitleLine2: 'Methode.',
      heroCopy: 'Un cadre de travail rigoureux concu pour transformer l ambition en systemes de croissance previsibles.',
      steps: [
        {
          number: '01',
          title: 'Diagnostic',
          copy: 'Immersion totale, identification des frictions et leviers d automation.',
          deliverablesLabel: 'Livrables',
          deliverables: ['Audit des processus IA', 'Analyse de la tech stack', 'Cartographie des goulots'],
          metaLabel: 'Duree',
          metaValue: 'Semaine 01 — Immersion',
        },
        {
          number: '02',
          title: 'Blueprint',
          copy: 'Architecture technique et strategique, pas de code sans plan.',
          deliverablesLabel: 'Livrables',
          deliverables: ['Roadmap de developpement', 'Schema d architecture IA', 'Prototype basse fidelite'],
          metaLabel: 'Duree',
          metaValue: 'Semaine 02 — Conception',
        },
        {
          number: '03',
          title: 'Sprints',
          copy: 'Execution en cycles courts, livraisons concretes chaque semaine.',
          deliverablesLabel: 'Livrables',
          deliverables: ['Revue de sprint hebdo', 'Acces repository GitHub', 'Environnement de staging'],
          metaLabel: 'Duree',
          metaValue: 'Cycles de 7 jours — Delivery',
        },
        {
          number: '04',
          title: 'Scaling',
          copy: 'Lancement, monitoring des KPIs et optimisation continue.',
          deliverablesLabel: 'Livrables',
          deliverables: ['Dashboard de performance', 'Plan de maintenance', 'Revue ROI trimestrielle'],
          metaLabel: 'Objectif',
          metaValue: 'Croissance exponentielle',
        },
      ],
      ctaTitleLine1: 'Pret a',
      ctaTitleLine2: 'structurer ?',
      ctaCopy: 'Chaque projet commence par une conversation. Parlons de vos systemes actuels.',
      ctaPrimary: 'Reserver un diagnostic',
      ctaSecondary: 'Voir nos projets',
    },
  },
} as const

export type Language = keyof typeof translations
export type Copy = typeof translations[Language]

type LanguageContextValue = {
  language: Language
  setLanguage: (next: Language) => void
  copy: Copy
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'fr'
    }
    const stored = localStorage.getItem('lightlab_language')
    return stored === 'en' || stored === 'fr' ? stored : 'fr'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('lightlab_language', language)
    document.documentElement.setAttribute('lang', language)
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, copy: translations[language] }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
