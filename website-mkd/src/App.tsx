import { useState, useEffect } from 'react';
import { useInView } from './hooks/useInView';
import {
  Shield, CheckCircle2, ArrowRight,
  Phone, Mail, MapPin, Clock, Star, ChevronDown,
  Filter, Gauge, Zap, Award, Users, Menu, X,
  ScanLine, Sparkles, ThumbsUp, Settings
} from 'lucide-react';

/* ─────────────────── Animated Section Wrapper ─────────────────── */
function AnimatedSection({
  children,
  className = '',
  animation = 'fade-in-up',
  delay = '',
}: {
  children: React.ReactNode;
  className?: string;
  animation?: string;
  delay?: string;
}) {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      className={`${animation} ${delay} ${isInView ? 'visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

/* ─────────────────── Counter Component ─────────────────── */
function Counter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="animate-count">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ─────────────────── FAQ Item ─────────────────── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="light-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50/50 transition-colors"
      >
        <span className="font-semibold text-lg text-gray-800 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary-500 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div className={`faq-content ${isOpen ? 'open' : ''}`}>
        <div className="px-6 pb-6 text-gray-500 leading-relaxed">{answer}</div>
      </div>
    </div>
  );
}

/* ─────────────────── Navbar ─────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const ripple = useRipple();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Active section detection
      const sections = ['about', 'services', 'process', 'faq', 'contact'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection('');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'За нас', href: '#about' },
    { label: 'Услуги', href: '#services' },
    { label: 'Процес', href: '#process' },
    { label: 'Прашања', href: '#faq' },
    { label: 'Контакт', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'nav-glass bg-white/90 shadow-lg shadow-black/[0.04] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-[family-name:var(--font-heading)] text-xl font-extrabold tracking-tight text-gray-900">
              dpf.mk
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-primary-500 after:to-accent-400 after:transition-all ${
                  isActive
                    ? 'text-primary-600 after:w-full'
                    : 'text-gray-600 hover:text-primary-600 after:w-0 hover:after:w-full'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="tel:+38923294700"
            onClick={ripple}
            className="ripple-container ml-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold rounded-lg hover:from-primary-400 hover:to-primary-500 transition-all shadow-lg shadow-primary-500/20 hover:shadow-primary-500/35 inline-flex items-center gap-1.5 btn-press"
          >
            <Phone className="w-4 h-4" />
            Јавете се!
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-800 p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden nav-glass bg-white/95 border-t border-gray-100 mt-3">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 hover:text-primary-600 font-medium py-2 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+38923294700"
              onClick={(e) => { setMobileOpen(false); ripple(e); }}
              className="ripple-container mt-2 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-lg text-center inline-flex items-center justify-center gap-2 btn-press"
            >
              <Phone className="w-4 h-4" />
              Јавете се!
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────── Hero Section ─────────────────── */
function Hero() {
  const ripple = useRipple();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="/images/dpf-filter-hero.jpg"
        >
          <source
            src="https://cdn.pixabay.com/video/2023/11/02/187611-880737123_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent-400/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
        <div className="max-w-3xl">
          <div className="fade-in-up visible mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-sm font-medium">
              <Shield className="w-4 h-4" />
              Доверба од 200+ возила
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] mb-6 text-gray-900">
            <span className="gradient-text">Чист мотор.</span>
            <br />
            <span className="gradient-text">Безбеден пат.</span>
            <br />
            <span className="gradient-text">Чист воздух.</span>
          </h1>

          <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl">
            Професионално  чистење, дијагностика и замена на дизел филтри за честички на тешки возила. Продолжете го животот на моторот и останете во чекор со еколошките стандарди.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+38923294700"
              onClick={ripple}
              className="ripple-container group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:from-primary-400 hover:to-primary-500 transition-all shadow-2xl shadow-primary-500/25 hover:shadow-primary-500/40 text-lg btn-press pulse-glow"
            >
              <Phone className="w-5 h-5" />
              Јавете се!
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-4 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-white/60 hover:border-primary-200 transition-all text-lg bg-white/40 btn-press"
            >
              Нашите услуги
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-start gap-8">
            {/* Certificates table */}
            <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-2.5 bg-gradient-to-r from-primary-50 to-accent-50 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-bold text-gray-800">Сертификати</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  'ISO 9001:2015',
                  'CE сертификат',
                  'SGS сертификат',
                  'RoHS сертификат',
                  'MSDS сертификат',
                ].map((cert) => (
                  <div key={cert} className="cert-badge flex items-center gap-2.5 px-4 py-2 rounded-lg cursor-default">
                    <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Other badges */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Zap className="w-5 h-5 text-primary-500" />
                Сервис истиот ден
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Shield className="w-5 h-5 text-primary-500" />
1-годишна гаранција
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── About Section ─────────────────── */
function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32 bg-white">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <AnimatedSection animation="fade-in-left">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/60">
                <img
                  src="/images/dpf-filter-closeup.jpg"
                  alt="ДПФ филтер од близина"
                  className="w-full h-[480px] object-cover"
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-5 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">98.7%</div>
                    <div className="text-sm text-gray-500">Ефикасност на филтрација</div>
                  </div>
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary-400/10 rounded-full blur-2xl" />
            </div>
          </AnimatedSection>

          {/* Text */}
          <AnimatedSection animation="fade-in-right">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
              Што правиме
            </span>
            <h2 className="font-[family-name:var(--font-heading)] text-4xl lg:text-5xl font-extrabold mt-3 mb-6 leading-tight gradient-text">
              Срцето на чистата дизел моќ
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Дизел филтерот за честички (ДПФ) е клучен дел од системот за контрола на емисии — ги заробува саѓите и штетните честички пред да стигнат во атмосферата. Со тек на време, филтерот се запушува и бара професионално чистење или замена за да работи моторот беспрекорно и да ги исполни еколошките прописи.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Во <span className="gradient-text font-semibold">DPF.MK</span>, ги спојуваме најсовремената технологија за термичко чистење со долгогодишно искуство во дизел системи — за да го вратиме вашиот филтер во состојба блиска до нов, штедејќи ви илјадници евра во споредба со купување нов дел.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                'Ги намалува штетните емисии за 85%+',
                'Го враќа потрошувачката ефикасност',
                'Спречува скапи оштетувања на моторот',
                'Го продолжува животот на ДПФ за 3x',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <a
              href="#services"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-500 transition-colors group"
            >
              Погледни ги нашите услуги
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Services Section ─────────────────── */
function Services() {
  const services = [
    {
      icon: Sparkles,
      title: 'Длабоко чистење на ДПФ',
      gradientTitle: true,
      description:
        'Нашиот напреден процес на водено перење ги омекнува натрупаните саѓи и пепел на контролирани температури, враќајќи го филтерот во врвна состојба.',
      features: ['Хидропневматско чистење', 'Завршува истиот ден', 'До 100% отстранување на саѓите', 'Од 95%-98% отстранување на пепелта'],
    },
    {
      icon: Settings,
      title: 'Замена на ДПФ',
      gradientTitle: true,
      description:
        'Кога чистењето не е доволно, нудиме оригинални и квалитетни заменети ДПФ единици за сите марки и модели. Секоја замена вклучува целосен преглед на издувниот систем и 1-годишна гаранција.',
      features: ['Оригинални и заменети делови', 'Целосен преглед на издувниот систем', '1-годишна гаранција вклучена'],
    },
    {
      icon: ScanLine,
      title: 'Дијагностика и тестирање',
      gradientTitle: true,
      description:
        'Со најсовремена OBD дијагностика и тестирање на противпритисок, прецизно утврдуваме што предизвикува проблеми со вашиот ДПФ — без претпоставки, само точни резултати и искрени препораки.',
      features: ['Анализа на податоци во живо', 'Тестирање на противпритисок', 'Детален писмен извештај'],
    },
  ];

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-gray-50">
      <div className="section-divider mb-24" />
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-400/[0.04] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Нашите услуги
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl lg:text-5xl font-extrabold mt-3 mb-5 gradient-text">
            Целосна ДПФ нега, од почеток до крај
          </h2>
          <p className="text-gray-500 text-lg">
            Од рутинско чистење до целосна замена — нудиме сеопфатни решенија за филтри за дизел честички за секој тип на тешки возила.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <AnimatedSection
              key={service.title}
              animation="fade-in-up"
              delay={`delay-${(i + 1) * 100}`}
            >
              <div className="service-card tilt-card light-card p-8 h-full group cursor-default" onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8; const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8; e.currentTarget.style.transform = `translateY(-8px) perspective(800px) rotateX(${y}deg) rotateY(${x}deg)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center mb-6 group-hover:from-primary-100 group-hover:to-accent-100 transition-colors border border-primary-100">
                  <service.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className={`font-[family-name:var(--font-heading)] text-xl font-bold mb-3 ${service.gradientTitle ? 'gradient-text' : 'text-gray-900'}`}>
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-5 text-sm">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── How It Works Section ─────────────────── */
function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Phone,
      title: 'Јавете се за консултација',
      description: 'Јавете ни се за да најдеме удобен термин за преглед на вашето возило.',
    },
    {
      number: '02',
      icon: ScanLine,
      title: 'Дијагностицирајте',
      description: 'Нашите сертифицирани техничари вршат целосна дијагностичка скенирање за да го утврдат вистинскиот корен на проблемот со ДПФ.',
    },
    {
      number: '03',
      icon: Sparkles,
      title: 'Исчистете или заменете',
      description: 'Врз основа на дијагностиката, го чистиме длабоко постојниот филтер или инсталираме квалитетна замена — по ваш избор.',
    },
    {
      number: '04',
      icon: ThumbsUp,
      title: 'Назад на патот',
      description: 'Се уверуваме во се со тест по сервисирањето, ги ресетираме ECU кодовите и ве враќаме на пат со доверба.',
    },
  ];

  return (
    <section id="process" className="relative py-24 lg:py-32 bg-white">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Како работи
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl lg:text-5xl font-extrabold mt-3 mb-5 gradient-text">
            Едноставно. Брзо. Делотворно.
          </h2>
          <p className="text-gray-500 text-lg">
            Сервисирањето на вашиот ДПФ никогаш не било полесно. Четири јасни чекори до почист, поефикасен мотор.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <AnimatedSection
              key={step.number}
              animation="fade-in-up"
              delay={`delay-${(i + 1) * 100}`}
            >
              <div className="relative text-center group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-40px)] h-[2px] bg-gradient-to-r from-primary-200 to-transparent" />
                )}

                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-white border-2 border-primary-100 mb-6 group-hover:border-primary-300 transition-colors shadow-sm">
                  <step.icon className="w-8 h-8 text-primary-500" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 text-white text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold mb-3 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Stats Section ─────────────────── */
function Stats() {
  const stats = [
    { value: 25, suffix: '+', label: 'Години искуство', icon: Award },
    { value: 15000, suffix: '+', label: 'Обслужени филтри', icon: Filter },
    { value: 98, suffix: '%', label: 'Задоволство на клиенти', icon: ThumbsUp },
    { value: 15, suffix: '+', label: 'Партнери во возни паркови', icon: Users },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="section-divider mb-20" />
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("https://images.pexels.com/photos/31310050/pexels-photo-31310050.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-800/85 to-accent-900/90" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <AnimatedSection key={stat.label} animation="fade-in-scale" className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-4">
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <div className="font-[family-name:var(--font-heading)] text-4xl lg:text-5xl font-extrabold text-white mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/70 font-medium">{stat.label}</div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Testimonials Section ─────────────────── */
function Testimonials() {
  const testimonials = [
    {
      name: 'Марко Јовановски',
      image: '/images/review-marco.jpg',
      text: 'Веке три години ги чистиме филтрите кај нив и нема поплака. Возниот парк има над 20 камиони и редовно сервисиране кај нив секогаш се на време',
      rating: 5,
    },
    {
      name: 'Елена Петровска',
      image: 'https://images.pexels.com/photos/7538666/pexels-photo-7538666.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=200',
      text: 'Бев на две места да прашам што ми е со камионот но никој не можеше да ми помогне, но кај DPF.MK тие одма ми најдоа дека сум имла расипан EGR вентил, влече сега камионот како нов',
      rating: 5,
    },
    {
      name: 'Илија Крстевски',
      image: 'https://images.pexels.com/photos/20503251/pexels-photo-20503251.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=200',
      text: 'Почна камионот да ми бара многу гориво и незнаев што се дешава, отидов на мајстор и ми рекоа едка е до дпф филтерот и ми го препорачаа овој мајстор за чистење дпф филтри, супер е камионот буквално како нов а и за ниска цена беше исто',
      rating: 5,
    },
  ];

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-white">
      <div className="section-divider mb-24" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-400/[0.04] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Искуства
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl lg:text-5xl font-extrabold mt-3 mb-5 gradient-text">
            Доверба од возачи низ цела земја
          </h2>
          <p className="text-gray-500 text-lg">
            Не верувајте само нам — прочитајте што имаат да кажат нашите клиенти за соработката со <span className="gradient-text font-semibold">DPF.MK</span>.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <AnimatedSection
              key={t.name}
              animation="fade-in-up"
              delay={`delay-${(i + 1) * 100}`}
            >
              <div className="light-card p-8 h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star
                      key={si}
                      className="w-5 h-5 fill-primary-400 text-primary-400"
                    />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed mb-6 flex-1 italic">
                  „{t.text}"
                </p>

                <div className="flex items-center gap-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="font-semibold text-gray-900">{t.name}</div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── FAQ Section ─────────────────── */
function FAQ() {
  const faqs = [
    {
      question: 'Колку често треба да го чистам ДПФ филтерот?',
      answer:
        'Кај повеќето лични возила, чистењето на ДПФ се препорачува на секои 80.000 до 120.000 километри, во зависност од условите на возење. Камионите што возат во градски сообраќај може да имаат потреба од почесто сервисирање — околу 50.000 до 80.000 км. Нашата дијагностика може прецизно да ја утврди состојбата на вашиот филтер.',
    },
    {
      question: 'Кои се знаците на запушен ДПФ?',
      answer:
        'Најчести симптоми се: светната ДПФ предупредувачка светилка на командната табла, намалена моќност на моторот (режим на ограничена моќ), зголемена потрошувачка на гориво, прекумер чад од издувниот систем, силен мирис на горење и чести автоматски циклуси на регенерација. Ако забележите било кој од овие знаци, веднаш закажете дијагностички преглед.',
    },
    {
      question: 'Може ли запушен ДПФ да го оштети моторот?',
      answer:
        'Апсолутно, да. Сериозно запушен ДПФ го зголемува противпритисокот во издувниот систем, што може да ги истурка саѓите назад во моторот, да ја контаминира моторната маст, да ги оштети турбо полначите, а во екстремни случаи — да предизвика целосно откажување на моторот. Навремената интервенција може да ви заштеди илјадници евра во трошоци за поправка.',
    },
    {
      question: 'Колку време трае процесот на чистење?',
      answer:
        'Стандардно хидропневматско чистење трае приближно 2 часа. Возилото можете да си го подигнете истиот ден!',
    },
    {
      question: 'Дали е подобро чистење или замена на ДПФ?',
      answer:
        'Во повеќето случаи — чистењето. Професионалното хидропневматско чистење може да го врати ДПФ на 90–95% од оригиналниот капацитет на проток, за дел од цената на нов филтер. Нов ДПФ за тежок камион може да чини од 3.000 до 8.000 евра, додека чистењето е драстично поевтино од тоа!',
    },

  ];

  return (
    <section id="faq" className="relative py-24 lg:py-32 bg-gray-50">
      <div className="section-divider mb-24" />
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Прашања
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl lg:text-5xl font-extrabold mt-3 mb-5 gradient-text">
            Често поставувани прашања
          </h2>
          <p className="text-gray-500 text-lg">
            Сè што треба да знаете за одржувањето на ДПФ, чистењето и нашите услуги.
          </p>
        </AnimatedSection>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} animation="fade-in-up" delay={`delay-${((i % 3) + 1) * 100}`}>
              <FAQItem question={faq.question} answer={faq.answer} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Working Hours Section ─────────────────── */
function WorkingHours() {
  const hours = [
    { day: 'Понеделник', time: '07:00 – 18:00', closed: false },
    { day: 'Вторник', time: '07:00 – 18:00', closed: false },
    { day: 'Среда', time: '07:00 – 18:00', closed: false },
    { day: 'Четврток', time: '07:00 – 18:00', closed: false },
    { day: 'Петок', time: '07:00 – 18:00', closed: false },
    { day: 'Сабота', time: '08:00 – 14:00', closed: false },
    { day: 'Недела', time: '', closed: true },
  ];

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-white">
      <div className="section-divider mb-24" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
            Работно време
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl lg:text-5xl font-extrabold mt-3 mb-5 gradient-text">
            Кога работиме
          </h2>
          <p className="text-gray-500 text-lg">
            Закажете термин во наше работно време или јавете се за итен сервис.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Working Hours Card */}
          <AnimatedSection animation="fade-in-left">
            <div className="light-card overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-primary-500 to-accent-400 flex items-center gap-3">
                <Clock className="w-5 h-5 text-white" />
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
                  Распоред на работа
                </h3>
              </div>

              {/* Table */}
              <div className="divide-y divide-gray-100 flex-1">
                {hours.map((h, i) => (
                  <div
                    key={h.day}
                    className={`flex items-center justify-between px-6 py-4 transition-colors ${
                      h.closed
                        ? 'bg-red-50/50'
                        : i % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50/50'
                    }`}
                  >
                    <span className={`font-semibold ${h.closed ? 'text-red-600' : 'text-gray-800'}`}>
                      {h.day}
                    </span>
                    {h.closed ? (
                      <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm font-bold tracking-wide shadow-md shadow-red-500/20 animate-pulse">
                        Затворени!
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-gray-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                        {h.time}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Google Maps Card */}
          <AnimatedSection animation="fade-in-right">
            <div className="light-card overflow-hidden flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-accent-400 to-primary-500 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white" />
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-white">
                  Каде се наоѓаме
                </h3>
              </div>

              {/* Map */}
              <div className="relative w-full flex-1 min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2964.0!2d21.4254!3d41.9981!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135415f06a219ce9%3A0x45c4a1c2c8e28e2e!2z0JjQvdC00YPRgdGC0YDQuNGY0YHQutCwIDQ4LzIwLCDQodC60L7Qv9C1IDEwMDA!5e0!3m2!1smk!2smk!4v1700000000000!5m2!1smk!2smk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="dpf.mk локација"
                  className="w-full h-full absolute inset-0"
                />
              </div>

              {/* Address footer */}
              <div className="px-6 py-4 bg-gradient-to-r from-accent-50 to-primary-50 border-t border-accent-100">
                <div className="flex items-center gap-2 text-sm text-primary-700 font-medium">
                  <MapPin className="w-4 h-4" />
                  Индустриска 48/20, 1000 Скопје, Северна Македонија
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Footer ─────────────────── */
function Footer() {
  return (
    <footer className="relative pt-16 pb-8 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-[family-name:var(--font-heading)] text-xl font-extrabold tracking-tight text-white">
                  dpf.mk
                </span>
              </div>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Професионално чистење, дијагностика и замена на дизел филтри за честички на тешки возила од 2009 година.
            </p>
            <div className="flex gap-3">
              {['Facebook', 'Twitter', 'LinkedIn'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-500/30 transition-colors text-xs font-bold"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Брзи врски</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'За нас', href: '#about' },
                { label: 'Услуги', href: '#services' },
                { label: 'Возни паркови', href: '#services' },
                { label: 'Прашања', href: '#faq' },
              ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Услуги</h4>
            <ul className="space-y-2.5">
              {[
                'Длабоко чистење на ДПФ',
                'Замена на ДПФ',
                'Дијагностика и тестирање',
                'Одржување на возни паркови',
                'Итен сервис',
                'Ремапирање на ECU',
              ].map((link) => (
                <li key={link}>
                  <a
                    href="#services"
                    className="text-gray-400 text-sm hover:text-primary-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Контакт</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">
                  Индустриска 48/20
                  <br />
                  1000 Скопје, Северна Македонија
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span className="text-gray-400">(02) 932-4700</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span className="text-gray-400">servis@dpf.mk</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">
                  Пон–Пет: 7:00–18:00
                  <br />
                  Саб: 8:00–14:00
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-800 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} dpf.mk. Сите права задржани.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-400 transition-colors">
              Политика за приватност
            </a>
            <a href="#" className="hover:text-primary-400 transition-colors">
              Услови за користење
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────── Main App ─────────────────── */
/* ─────────────────── Scroll Progress Bar ─────────────────── */
function ScrollProgressBar({ progress }: { progress: number }) {
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}

/* ─────────────────── Back to Top Button ─────────────────── */
function BackToTopButton({ visible }: { visible: boolean }) {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`back-to-top fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center hover:shadow-primary-500/50 transition-shadow btn-press ${visible ? 'visible' : ''}`}
      aria-label="Back to top"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

/* ─────────────────── Ripple Hook ─────────────────── */
function useRipple() {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };
  return handleClick;
}

/* ─────────────────── Main App ─────────────────── */
export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <ScrollProgressBar progress={scrollProgress} />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <FAQ />
      <WorkingHours />
      <BackToTopButton visible={showBackToTop} />
      <Footer />
    </div>
  );
}