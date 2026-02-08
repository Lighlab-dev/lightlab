import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const translations = {
  en: {
    nav: {
      services: 'Services',
      projects: 'Projects',
      caseStudies: 'Case Studies',
      about: 'About',
      contact: 'Contact',
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
      ctaMeta: 'Response time',
      ctaMetaValue: 'Within 24 hours',
      ctaButton: 'Contact Lightlab',
    },
    services: {
      title: 'Built to Scale',
      subtitle: 'Clear service tracks for AI automation, product development, and paid media growth.',
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
  },
  fr: {
    nav: {
      services: 'Services',
      projects: 'Projets',
      caseStudies: 'Cas clients',
      about: 'A propos',
      contact: 'Contact',
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
      ctaMeta: 'Temps de reponse',
      ctaMetaValue: 'Moins de 24 heures',
      ctaButton: 'Contacter Lightlab',
    },
    services: {
      title: 'Concu pour scaler',
      subtitle: 'Tracks clairs pour l automation IA, le developpement produit et la croissance media.',
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
