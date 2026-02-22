import { PrismaClient, Role, MenuLocation } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // ==================== USERS ====================
  console.log('Creating users...');
  
  const superAdminPassword = await bcrypt.hash('SuperAdmin123!', 10);
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const userPassword = await bcrypt.hash('User123!', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@aaea.com' },
    update: {},
    create: {
      email: 'superadmin@aaea.com',
      password: superAdminPassword,
      name: 'Super Administrateur',
      role: Role.SUPER_ADMIN,
      active: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@aaea.com' },
    update: {},
    create: {
      email: 'admin@aaea.com',
      password: adminPassword,
      name: 'Administrateur',
      role: Role.ADMIN,
      active: true,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@aaea.com' },
    update: {},
    create: {
      email: 'user@aaea.com',
      password: userPassword,
      name: 'Utilisateur',
      role: Role.USER,
      active: true,
    },
  });

  console.log(`Created users: ${superAdmin.email}, ${admin.email}, ${user.email}`);

  // ==================== SITE SETTINGS ====================
  console.log('Creating site settings...');

  await prisma.siteSettings.upsert({
    where: { id: 'site-settings' },
    update: {},
    create: {
      id: 'site-settings',
      logoUrl: '/logo_aaea.jpg',
      logoAltFr: 'AAEA - Logo',
      logoAltEn: 'AAEA - Logo',
      color1: '#362981',
      color2: '#009446',
      color3: '#029CB1',
      color4: '#9AD2E2',
      siteNameFr: 'AAEA',
      siteNameEn: 'AAEA',
      siteDescriptionFr: 'Association pour l\'Avancement de l\'Environnement et de l\'Agriculture',
      siteDescriptionEn: 'Association for the Advancement of Environment and Agriculture',
      address: '123 Rue Example, Paris 75001, France',
      email: 'contact@aaea.org',
      phone: '+33 1 23 45 67 89',
      phone2: '+33 1 23 45 67 90',
      workingHoursFr: 'Lundi - Vendredi: 9h00 - 18h00',
      workingHoursEn: 'Monday - Friday: 9:00 AM - 6:00 PM',
      socialLinks: JSON.stringify({
        facebook: 'https://facebook.com/aaea',
        twitter: 'https://twitter.com/aaea',
        linkedin: 'https://linkedin.com/company/aaea',
        instagram: 'https://instagram.com/aaea',
        youtube: 'https://youtube.com/aaea',
      }),
      mapLatitude: 48.8566,
      mapLongitude: 2.3522,
      mapZoom: 15,
    },
  });

  // ==================== MENU ITEMS ====================
  console.log('Creating menu items...');

  const menuItems = [
    // Header menu
    { slug: 'accueil', route: '/', labelFr: 'Accueil', labelEn: 'Home', location: MenuLocation.HEADER, order: 0 },
    { slug: 'a-propos', route: '/a-propos', labelFr: 'À propos', labelEn: 'About', location: MenuLocation.HEADER, order: 1 },
    { slug: 'solutions', route: '/solutions', labelFr: 'Solutions', labelEn: 'Solutions', location: MenuLocation.HEADER, order: 2 },
    { slug: 'realisations', route: '/realisations', labelFr: 'Réalisations', labelEn: 'Projects', location: MenuLocation.HEADER, order: 3 },
    { slug: 'ressources', route: '/ressources', labelFr: 'Ressources', labelEn: 'Resources', location: MenuLocation.HEADER, order: 4 },
    { slug: 'evenements', route: '/evenements', labelFr: 'Événements', labelEn: 'Events', location: MenuLocation.HEADER, order: 5 },
    { slug: 'contact', route: '/contact', labelFr: 'Contact', labelEn: 'Contact', location: MenuLocation.HEADER, order: 6 },
    // Footer menu
    { slug: 'mentions-legales', route: '/mentions-legales', labelFr: 'Mentions légales', labelEn: 'Legal notice', location: MenuLocation.FOOTER, order: 0 },
    { slug: 'politique-confidentialite', route: '/politique-confidentialite', labelFr: 'Politique de confidentialité', labelEn: 'Privacy policy', location: MenuLocation.FOOTER, order: 1 },
    { slug: 'conditions-utilisation', route: '/conditions-utilisation', labelFr: "Conditions d'utilisation", labelEn: 'Terms of use', location: MenuLocation.FOOTER, order: 2 },
  ];

  // Create menu items one by one, checking for existence
  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({
      where: { slug: item.slug, deletedAt: null },
    });
    if (!existing) {
      await prisma.menuItem.create({ data: item });
    }
  }

  // ==================== HOME PAGE SECTIONS ====================
  console.log('Creating home page sections...');

  // Sliders - 4 sliders
  const existingSliders = await prisma.slider.count();
  if (existingSliders < 4) {
    // Delete existing sliders to re-seed
    await prisma.slider.deleteMany();
    
    await prisma.slider.createMany({
      data: [
        {
          titleFr: 'Bienvenue à l\'AAEA',
          titleEn: 'Welcome to AAEA',
          subtitleFr: 'Ensemble pour un avenir durable et une agriculture responsable',
          subtitleEn: 'Together for a sustainable future and responsible agriculture',
          buttonTextFr: 'Découvrir',
          buttonTextEn: 'Discover',
          buttonUrl: '/a-propos',
          imageUrl: '/images/slider-1.jpg',
          imageAltFr: 'Paysage naturel et agriculture',
          imageAltEn: 'Natural landscape and agriculture',
          order: 0,
          visible: true,
        },
        {
          titleFr: 'Nos Solutions Innovantes',
          titleEn: 'Our Innovative Solutions',
          subtitleFr: 'Technologies durables pour l\'agriculture de demain',
          subtitleEn: 'Sustainable technologies for tomorrow\'s agriculture',
          buttonTextFr: 'En savoir plus',
          buttonTextEn: 'Learn more',
          buttonUrl: '/solutions',
          imageUrl: '/images/slider-2.jpg',
          imageAltFr: 'Agriculture moderne et technologie',
          imageAltEn: 'Modern agriculture and technology',
          order: 1,
          visible: true,
        },
        {
          titleFr: 'Formez-vous avec nous',
          titleEn: 'Train with us',
          subtitleFr: 'Programmes de formation pour les agriculteurs et les communautés rurales',
          subtitleEn: 'Training programs for farmers and rural communities',
          buttonTextFr: 'Nos formations',
          buttonTextEn: 'Our training',
          buttonUrl: '/solutions',
          imageUrl: '/images/slider-3.jpg',
          imageAltFr: 'Formation agricole',
          imageAltEn: 'Agricultural training',
          order: 2,
          visible: true,
        },
        {
          titleFr: 'Engagez-vous pour l\'environnement',
          titleEn: 'Commit to the environment',
          subtitleFr: 'Rejoignez notre mission pour protéger la biodiversité et les ressources naturelles',
          subtitleEn: 'Join our mission to protect biodiversity and natural resources',
          buttonTextFr: 'Nous rejoindre',
          buttonTextEn: 'Join us',
          buttonUrl: '/contact',
          imageUrl: '/images/slider-4.jpg',
          imageAltFr: 'Protection de l\'environnement',
          imageAltEn: 'Environmental protection',
          order: 3,
          visible: true,
        },
      ],
    });
  }

  // Home About
  await prisma.homeAbout.upsert({
    where: { id: 'home-about' },
    update: {},
    create: {
      id: 'home-about',
      titleFr: 'Qui sommes-nous',
      titleEn: 'Who we are',
      contentFr: 'L\'AAEA est une organisation dédiée à la promotion de pratiques agricoles durables et à la protection de l\'environnement. Nous travaillons avec les communautés locales, les agriculteurs et les décideurs pour créer un avenir plus vert.',
      contentEn: 'AAEA is an organization dedicated to promoting sustainable agricultural practices and protecting the environment. We work with local communities, farmers, and policymakers to create a greener future.',
      imageUrl: '/images/about.jpg',
      imageAltFr: 'Notre équipe en action',
      imageAltEn: 'Our team in action',
      buttonTextFr: 'En savoir plus',
      buttonTextEn: 'Learn more',
      buttonUrl: '/a-propos',
    },
  });

  // Services
  const services = [
    {
      titleFr: 'Formation Agricole',
      titleEn: 'Agricultural Training',
      descriptionFr: 'Programmes de formation pour les agriculteurs sur les pratiques durables.',
      descriptionEn: 'Training programs for farmers on sustainable practices.',
      icon: 'GraduationCap',
      order: 0,
    },
    {
      titleFr: 'Consultation Environnementale',
      titleEn: 'Environmental Consulting',
      descriptionFr: 'Conseils experts pour les projets de développement durable.',
      descriptionEn: 'Expert advice for sustainable development projects.',
      icon: 'Leaf',
      order: 1,
    },
    {
      titleFr: 'Recherche & Innovation',
      titleEn: 'Research & Innovation',
      descriptionFr: 'Recherche sur les technologies agricoles innovantes.',
      descriptionEn: 'Research on innovative agricultural technologies.',
      icon: 'Lightbulb',
      order: 2,
    },
    {
      titleFr: 'Développement Communautaire',
      titleEn: 'Community Development',
      descriptionFr: 'Programmes de développement pour les communautés rurales.',
      descriptionEn: 'Development programs for rural communities.',
      icon: 'Users',
      order: 3,
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  // Testimonials
  const testimonials = [
    {
      name: 'Marie Dupont',
      company: 'AgriTech Solutions',
      textFr: 'L\'AAEA nous a aidés à transformer nos pratiques agricoles. Les résultats sont remarquables.',
      textEn: 'AAEA helped us transform our agricultural practices. The results are remarkable.',
      rating: 5,
      order: 0,
    },
    {
      name: 'Jean Martin',
      company: 'Coopérative Agricole du Sud',
      textFr: 'Une équipe professionnelle et passionnée. Nos agriculteurs ont beaucoup appris.',
      textEn: 'A professional and passionate team. Our farmers have learned a lot.',
      rating: 5,
      order: 1,
    },
    {
      name: 'Sophie Bernard',
      company: 'Green Future Foundation',
      textFr: 'Un partenaire incontournable pour tout projet de développement durable.',
      textEn: 'An essential partner for any sustainable development project.',
      rating: 5,
      order: 2,
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  // Partners (10+ partners for carousel)
  const existingPartners = await prisma.partner.count();
  if (existingPartners === 0) {
    const partners = [
      { name: 'Ministère de l\'Agriculture', logoUrl: '/images/partners/ministere.png', website: 'https://agriculture.gouv.fr', order: 0 },
      { name: 'FAO', logoUrl: '/images/partners/fao.png', website: 'https://fao.org', order: 1 },
      { name: 'Banque Mondiale', logoUrl: '/images/partners/worldbank.png', website: 'https://worldbank.org', order: 2 },
      { name: 'Union Européenne', logoUrl: '/images/partners/eu.png', website: 'https://europa.eu', order: 3 },
      { name: 'USAID', logoUrl: '/images/partners/usaid.png', website: 'https://usaid.gov', order: 4 },
      { name: 'GIZ', logoUrl: '/images/partners/giz.png', website: 'https://giz.de', order: 5 },
      { name: 'AFD', logoUrl: '/images/partners/afd.png', website: 'https://afd.fr', order: 6 },
      { name: 'CIRAD', logoUrl: '/images/partners/cirad.png', website: 'https://cirad.fr', order: 7 },
      { name: 'IRD', logoUrl: '/images/partners/ird.png', website: 'https://ird.fr', order: 8 },
      { name: 'CGIAR', logoUrl: '/images/partners/cgiar.png', website: 'https://cgiar.org', order: 9 },
      { name: 'Bill & Melinda Gates Foundation', logoUrl: '/images/partners/gates.png', website: 'https://gatesfoundation.org', order: 10 },
      { name: 'WWF', logoUrl: '/images/partners/wwf.png', website: 'https://wwf.org', order: 11 },
    ];

    for (const partner of partners) {
      await prisma.partner.create({
        data: partner,
      });
    }
  }

  // Home CTA
  await prisma.homeCTA.upsert({
    where: { id: 'home-cta' },
    update: {},
    create: {
      id: 'home-cta',
      titleFr: 'Prêt à faire la différence ?',
      titleEn: 'Ready to make a difference?',
      subtitleFr: 'Rejoignez-nous dans notre mission pour un avenir durable.',
      subtitleEn: 'Join us in our mission for a sustainable future.',
      buttonTextFr: 'Contactez-nous',
      buttonTextEn: 'Contact us',
      buttonUrl: '/contact',
    },
  });

  // ==================== CATEGORIES ====================
  console.log('Creating categories...');

  // Realisation categories
  const realisationCategories = [
    { nameFr: 'Agriculture Durable', nameEn: 'Sustainable Agriculture', slug: 'agriculture-durable', order: 0 },
    { nameFr: 'Énergies Renouvelables', nameEn: 'Renewable Energies', slug: 'energies-renouvelables', order: 1 },
    { nameFr: 'Gestion de l\'Eau', nameEn: 'Water Management', slug: 'gestion-eau', order: 2 },
    { nameFr: 'Biodiversité', nameEn: 'Biodiversity', slug: 'biodiversite', order: 3 },
  ];

  for (const cat of realisationCategories) {
    await prisma.realisationCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Resource categories
  const resourceCategories = [
    { nameFr: 'Guides & Manuels', nameEn: 'Guides & Manuals', slug: 'guides-manuels', order: 0 },
    { nameFr: 'Rapports', nameEn: 'Reports', slug: 'rapports', order: 1 },
    { nameFr: 'Présentations', nameEn: 'Presentations', slug: 'presentations', order: 2 },
    { nameFr: 'Documents Techniques', nameEn: 'Technical Documents', slug: 'documents-techniques', order: 3 },
  ];

  for (const cat of resourceCategories) {
    await prisma.resourceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Article categories
  const articleCategories = [
    { nameFr: 'Actualités', nameEn: 'News', slug: 'actualites', order: 0 },
    { nameFr: 'Conseils', nameEn: 'Tips', slug: 'conseils', order: 1 },
    { nameFr: 'Études', nameEn: 'Studies', slug: 'etudes', order: 2 },
  ];

  for (const cat of articleCategories) {
    await prisma.articleCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // ==================== SAMPLE CONTENT ====================
  console.log('Creating sample content...');

  // Sample articles
  const articleCategory = await prisma.articleCategory.findFirst({ where: { slug: 'actualites' } });
  if (articleCategory) {
    await prisma.article.upsert({
      where: { slug: 'lancement-programme-formation' },
      update: {},
      create: {
        titleFr: 'Lancement de notre nouveau programme de formation',
        titleEn: 'Launch of our new training program',
        slug: 'lancement-programme-formation',
        contentFr: '<p>Nous sommes ravis d\'annoncer le lancement de notre nouveau programme de formation agricole. Ce programme vise à former 1000 agriculteurs d\'ici 2025.</p>',
        contentEn: '<p>We are excited to announce the launch of our new agricultural training program. This program aims to train 1000 farmers by 2025.</p>',
        excerptFr: 'Découvrez notre nouveau programme de formation agricole.',
        excerptEn: 'Discover our new agricultural training program.',
        published: true,
        featured: true,
        publishedAt: new Date(),
        authorId: superAdmin.id,
        categoryId: articleCategory.id,
      },
    });
  }

  // Contact Info
  await prisma.contactInfo.upsert({
    where: { id: 'contact-info' },
    update: {},
    create: {
      id: 'contact-info',
      titleFr: 'Contactez-nous',
      titleEn: 'Contact us',
      descriptionFr: 'Nous sommes à votre disposition pour répondre à toutes vos questions.',
      descriptionEn: 'We are at your disposal to answer all your questions.',
      address: '123 Rue Example, Paris 75001, France',
      email: 'contact@aaea.org',
      phone: '+33 1 23 45 67 89',
      phone2: '+33 1 23 45 67 90',
      workingHoursFr: 'Lundi - Vendredi: 9h00 - 18h00',
      workingHoursEn: 'Monday - Friday: 9:00 AM - 6:00 PM',
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
