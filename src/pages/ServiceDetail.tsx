import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

const serviceDetailsByLanguage = {
  en: {
    ai: {
      title: 'AI Solutions',
      summary: 'Agent orchestration, copilots, and automation frameworks tuned for operational velocity.',
      deliverables: ['Workflow mapping', 'Automation build', 'Monitoring + optimization'],
      outcomes: ['Reduced manual load', 'Faster execution cycles', 'Visibility across workflows'],
      nextStepCopy: 'Share your objectives and we will map a tailored execution plan.',
    },
    development: {
      title: 'Development Solutions',
      summary: 'Product engineering that unifies design, performance, and scalable infrastructure.',
      deliverables: ['Product strategy', 'Full-stack build', 'Launch systems'],
      outcomes: ['Stable releases', 'High-performance UX', 'Scalable infrastructure'],
      nextStepCopy: 'Share your objectives and we will map a tailored execution plan.',
    },
    'media-buying': {
      title: 'Media Buying',
      summary: 'Performance media stacks engineered for efficiency and predictable growth.',
      deliverables: ['Channel strategy', 'Creative testing', 'Conversion optimization'],
      outcomes: ['Improved ROAS', 'Lower CAC', 'Data-driven scaling'],
      nextStepCopy: 'Share your objectives and we will map a tailored execution plan.',
    },
  },
  fr: {
    ai: {
      title: 'Solutions IA',
      summary: 'Orchestration d agents, copilots et automations adaptes a une execution operationnelle rapide.',
      deliverables: ['Cartographie des workflows', 'Build des automations', 'Monitoring + optimisation'],
      outcomes: ['Moins de taches manuelles', 'Cycles d execution plus rapides', 'Visibilite complete des workflows'],
      nextStepCopy: 'Partagez vos objectifs et nous construirons un plan d execution sur mesure.',
    },
    development: {
      title: 'Developpement',
      summary: 'Engineering produit qui aligne design, performance et infrastructure scalable.',
      deliverables: ['Strategie produit', 'Build full-stack', 'Systemes de lancement'],
      outcomes: ['Releases stables', 'UX haute performance', 'Infrastructure evolutive'],
      nextStepCopy: 'Partagez vos objectifs et nous construirons un plan d execution sur mesure.',
    },
    'media-buying': {
      title: 'Media Buying',
      summary: 'Systemes media performants concus pour l efficacite et une croissance previsible.',
      deliverables: ['Strategie de canaux', 'Tests creatifs', 'Optimisation conversion'],
      outcomes: ['ROAS ameliore', 'CAC reduit', 'Scaling pilote par la data'],
      nextStepCopy: 'Partagez vos objectifs et nous construirons un plan d execution sur mesure.',
    },
  },
  ar: {
    ai: {
      title: 'حلول الذكاء الاصطناعي',
      summary: 'تنسيق الوكلاء والمساعدين والأتمتة لرفع سرعة التشغيل وتحسين التنفيذ اليومي.',
      deliverables: ['خريطة سير العمل', 'بناء الأتمتة', 'مراقبة وتحسين مستمر'],
      outcomes: ['تقليل العمل اليدوي', 'دورات تنفيذ أسرع', 'رؤية أوضح عبر workflows'],
      nextStepCopy: 'شارك أهدافك وسنضع خطة تنفيذ مخصصة تناسب احتياجك.',
    },
    development: {
      title: 'حلول التطوير',
      summary: 'هندسة منتجات تجمع بين التصميم والأداء والبنية القابلة للتوسع.',
      deliverables: ['استراتيجية المنتج', 'تطوير Full-stack', 'أنظمة الإطلاق'],
      outcomes: ['إصدارات مستقرة', 'تجربة استخدام عالية الأداء', 'بنية قابلة للنمو'],
      nextStepCopy: 'شارك أهدافك وسنضع خطة تنفيذ مخصصة تناسب احتياجك.',
    },
    'media-buying': {
      title: 'شراء الوسائط',
      summary: 'أنظمة وسائط أدائية مصممة للكفاءة وتحقيق نمو قابل للتنبؤ.',
      deliverables: ['استراتيجية القنوات', 'اختبارات إبداعية', 'تحسين التحويل'],
      outcomes: ['تحسن ROAS', 'انخفاض CAC', 'توسع قائم على البيانات'],
      nextStepCopy: 'شارك أهدافك وسنضع خطة تنفيذ مخصصة تناسب احتياجك.',
    },
  },
} as const

function ServiceDetail() {
  const { slug } = useParams()
  const { copy, language } = useLanguage()
  const languageDetails = serviceDetailsByLanguage[language]
  const data = useMemo(() => languageDetails[slug as keyof typeof languageDetails] ?? languageDetails.ai, [languageDetails, slug])

  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-10 border-b border-[var(--accent-line)]">
          <div>
            <p className="reveal text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.ui.serviceDetail}</p>
            <h1 className="reveal text-[7vw] md:text-[4vw] font-serif uppercase tracking-tight">{data.title}</h1>
          </div>
          <p className="reveal max-w-xl text-sm md:text-base text-[var(--muted)] leading-relaxed">
            {data.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.ui.deliverables}</p>
            <ul className="mt-6 space-y-2 text-sm text-[var(--muted)]">
              {data.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.ui.nextStep}</p>
              <p className="mt-4 text-lg text-[var(--fg)]">
                {data.nextStepCopy}
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-6 px-10 py-4 bg-[var(--fg)] text-[var(--bg)] rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
            >
              {copy.footer.cta}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {data.outcomes.map((item) => (
            <div key={item} className="bento-item bg-[var(--card-bg)] p-8 rounded-2xl">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--muted)]">{copy.ui.outcome}</p>
              <p className="text-lg font-serif mt-3">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceDetail
