// data/hr-questions.ts
import { ReactNode } from 'react';
import { Briefcase, GraduationCap, Users, Target, Heart, Award } from 'lucide-react';

export interface Question {
  id: number;
  question: string;
  answer: string;
}

export interface Category {
  id: number;
  name: string;
  icon: ReactNode;
  questions: Question[];
}

// Define categories with questions
const categories: Category[] = [
  {
    id: 1,
    name: 'Expérience Professionnelle',
    icon: <Briefcase className="w-5 h-5" />,
    questions: [
      {
        id: 101,
        question: "Parlez-moi de votre parcours professionnel.",
        answer: "Je commence par un bref aperçu chronologique de mon parcours en mettant l'accent sur la progression logique de ma carrière. Je souligne les expériences les plus pertinentes pour le poste visé, les compétences clés développées, et les réalisations significatives. Je termine en expliquant comment mon parcours m'a préparé pour ce nouveau défi et pourquoi je suis enthousiaste à l'idée de rejoindre cette entreprise."
      },
      {
        id: 102,
        question: "Pourquoi souhaitez-vous quitter votre emploi actuel?",
        answer: "Je présente ma recherche de façon positive, en mettant l'accent sur ce que je souhaite développer plutôt que sur ce que je fuis. J'explique que je recherche de nouvelles opportunités pour développer mes compétences dans [domaine précis], avoir plus de responsabilités ou relever de nouveaux défis. Je mentionne les aspects spécifiques du poste et de l'entreprise qui m'attirent, démontrant ainsi ma motivation et mon intérêt sincère."
      },
      {
        id: 103,
        question: "Quelle a été votre plus grande réussite professionnelle?",
        answer: "Je choisis une réalisation significative en lien avec le poste visé et je la présente selon la méthode STAR: Situation (contexte), Tâche (objectif), Action (ce que j'ai fait personnellement) et Résultat (impact quantifiable). Je mets en avant les compétences démontrées comme la résolution de problèmes, le leadership ou la capacité à atteindre des objectifs ambitieux, tout en soulignant ma contribution spécifique au sein de l'équipe."
      }
    ]
  },
  {
    id: 2,
    name: 'Compétences & Qualifications',
    icon: <GraduationCap className="w-5 h-5" />,
    questions: [
      {
        id: 201,
        question: "Quelles sont vos principales forces et faiblesses?",
        answer: "Pour mes forces, je cite 2-3 qualités pertinentes pour le poste en donnant des exemples concrets qui les illustrent. Pour les faiblesses, je présente une faiblesse authentique mais non critique pour le poste, en mettant l'accent sur les mesures que je prends activement pour m'améliorer. Je démontre ainsi ma capacité d'autoréflexion et ma volonté de progresser continuellement."
      },
      {
        id: 202,
        question: "Comment gérez-vous les situations stressantes ou les délais serrés?",
        answer: "J'explique ma méthode structurée pour gérer le stress: priorisation des tâches, découpage des projets complexes en étapes gérables, et planification rigoureuse. Je partage un exemple concret où j'ai maintenu mon calme et mon efficacité sous pression, en soulignant les techniques spécifiques utilisées (comme des pauses stratégiques ou la délégation). Je conclus sur l'importance d'un équilibre vie professionnelle/personnelle pour maintenir ma productivité à long terme."
      },
      {
        id: 203,
        question: "Comment restez-vous à jour dans votre domaine?",
        answer: "Je décris ma stratégie de veille professionnelle en mentionnant des sources précises (publications, newsletters, groupes professionnels). J'évoque ma participation à des formations continues, conférences ou certifications récentes. Je partage un exemple où j'ai appliqué une nouvelle connaissance ou tendance dans mon travail, démontrant ainsi ma capacité à transformer l'apprentissage en valeur ajoutée pour l'entreprise."
      }
    ]
  },
  {
    id: 3,
    name: 'Travail d\'Équipe & Leadership',
    icon: <Users className="w-5 h-5" />,
    questions: [
      {
        id: 301,
        question: "Comment gérez-vous les conflits au sein d'une équipe?",
        answer: "Je privilégie une approche proactive: identification précoce des tensions, communication ouverte et écoute active. Face à un conflit, j'organise d'abord des discussions individuelles pour comprendre les perspectives, puis une médiation collective axée sur les intérêts communs. Je présente un exemple concret où j'ai transformé un désaccord en opportunité d'amélioration, en soulignant l'importance de séparer les problèmes des personnes et de rechercher des solutions mutuellement bénéfiques."
      },
      {
        id: 302,
        question: "Décrivez votre style de management.",
        answer: "Mon approche de leadership est adaptative, combinant plusieurs styles selon le contexte et les besoins de l'équipe. Je crois fondamentalement au développement des talents et à l'autonomisation. Je fixe des objectifs clairs et ambitieux tout en fournissant les ressources et le soutien nécessaires. Je valorise la transparence, le feedback régulier dans les deux sens et la reconnaissance des réussites. Pour illustrer, je partage une situation où mon style de management a contribué à la réussite d'un projet ou au développement d'un collaborateur."
      },
      {
        id: 303,
        question: "Racontez une situation où vous avez dû faire preuve de leadership.",
        answer: "Je décris une situation précise en utilisant la méthode STAR: le contexte qui nécessitait du leadership, mon objectif, les actions spécifiques entreprises (prise d'initiative, mobilisation de l'équipe, résolution d'obstacles) et les résultats obtenus. Je mets en évidence les compétences de leadership démontrées comme la vision stratégique, la prise de décision, la communication efficace ou la capacité à inspirer. Je conclus sur les enseignements tirés qui ont enrichi ma pratique du leadership."
      }
    ]
  },
  {
    id: 4,
    name: 'Motivation & Objectifs',
    icon: <Target className="w-5 h-5" />,
    questions: [
      {
        id: 401,
        question: "Pourquoi voulez-vous travailler pour notre entreprise?",
        answer: "Je démontre ma recherche approfondie en mentionnant des aspects spécifiques de l'entreprise qui m'attirent: sa culture, ses valeurs, ses projets innovants ou sa position dans le secteur. J'établis un lien clair entre ces éléments et mes propres valeurs et aspirations professionnelles. J'explique comment je peux contribuer aux objectifs de l'entreprise et comment ce poste s'inscrit parfaitement dans mon projet professionnel, créant ainsi une relation mutuellement bénéfique."
      },
      {
        id: 402,
        question: "Où vous voyez-vous dans 5 ans?",
        answer: "Je présente une vision réaliste et ambitieuse qui montre mon engagement à long terme et mon désir de progression sans paraître présomptueux. J'évoque le développement de compétences spécifiques, l'approfondissement de mon expertise dans le domaine et l'évolution vers des responsabilités accrues au sein de l'entreprise. Je souligne ma volonté de créer de la valeur pour l'organisation tout en relevant de nouveaux défis professionnels, démontrant ainsi mon ambition et ma loyauté."
      },
      {
        id: 403,
        question: "Qu'est-ce qui vous motive au quotidien?",
        answer: "J'identifie mes motivations intrinsèques (comme le développement personnel, la résolution de problèmes complexes, l'impact positif) en lien avec les caractéristiques du poste. J'explique comment ces motivations se sont manifestées dans mes expériences précédentes et ont contribué à ma performance. Je démontre une compréhension de l'environnement de l'entreprise et explique pourquoi il constitue un cadre idéal pour maintenir ma motivation et mon engagement sur le long terme."
      }
    ]
  },
  {
    id: 5,
    name: 'Culture & Valeurs',
    icon: <Heart className="w-5 h-5" />,
    questions: [
      {
        id: 501,
        question: "Comment définiriez-vous la culture d'entreprise idéale pour vous?",
        answer: "Je décris les aspects culturels que je valorise (comme la collaboration, l'innovation, l'équilibre vie professionnelle-personnelle) en expliquant pourquoi ils favorisent ma productivité et mon épanouissement. Je fais le lien avec ce que je sais de la culture de l'entreprise, montrant ainsi ma compatibilité. J'illustre par des exemples d'environnements précédents où j'ai excellé et comment j'ai contribué positivement à la culture d'équipe, démontrant que je serai un atout pour renforcer la culture existante."
      },
      {
        id: 502,
        question: "Quelles valeurs professionnelles sont importantes pour vous?",
        answer: "J'articule 3-4 valeurs fondamentales (comme l'intégrité, l'excellence, l'innovation) en expliquant comment elles guident mes décisions et actions professionnelles. Pour chaque valeur, je donne un exemple concret qui illustre son application dans mon parcours. Je fais le lien avec les valeurs affichées de l'entreprise, montrant notre alignement. Je conclus sur l'importance d'un environnement qui permet d'exercer en cohérence avec ces valeurs pour assurer un engagement durable et une performance optimale."
      },
      {
        id: 503,
        question: "Comment contribuez-vous à une ambiance de travail positive?",
        answer: "Je décris mes pratiques concrètes: communication respectueuse et constructive, disponibilité pour soutenir mes collègues, reconnaissance des contributions d'autrui et attitude orientée solutions. Je partage un exemple où j'ai contribué à améliorer l'ambiance d'équipe dans un contexte difficile. J'évoque ma capacité à m'adapter à différentes personnalités et environnements de travail, tout en maintenant une influence positive. Je souligne l'importance d'une ambiance saine pour la créativité, la collaboration et la performance collective."
      }
    ]
  },
  {
    id: 6,
    name: 'Questions Techniques & Spécifiques',
    icon: <Award className="w-5 h-5" />,
    questions: [
      {
        id: 601,
        question: "Expliquez comment vous avez géré un projet complexe de A à Z.",
        answer: "Je sélectionne un projet pertinent pour le poste visé et je le présente de façon structurée: objectifs initiaux, parties prenantes, ressources, contraintes et défis particuliers. Je détaille ma méthodologie de gestion, les outils utilisés et les étapes clés. J'insiste sur mon approche pour surmonter les obstacles rencontrés et mes décisions stratégiques. Je conclus avec les résultats quantifiables obtenus, les enseignements tirés et comment cette expérience m'a préparé à aborder des défis similaires dans le poste convoité."
      },
      {
        id: 602,
        question: "Comment analysez-vous et résolvez-vous un problème complexe?",
        answer: "Je présente ma méthodologie systématique: identification précise du problème et de son contexte, collecte et analyse des données pertinentes, génération de solutions alternatives et évaluation de chacune selon des critères objectifs. J'explique comment j'implique les parties prenantes concernées et comment je gère les contraintes de temps et de ressources. Pour illustrer, je décris un problème complexe que j'ai résolu en suivant cette approche, en soulignant l'importance de la pensée analytique et créative dans le processus."
      },
      {
        id: 603,
        question: "Comment priorisez-vous vos tâches face à des demandes multiples?",
        answer: "J'explique mon système de priorisation combinant l'urgence, l'importance et l'alignement stratégique. Je détaille mes outils et techniques de gestion du temps (comme la matrice d'Eisenhower, la technique Pomodoro ou des outils numériques spécifiques). Je décris comment je communique proactivement avec les parties prenantes pour gérer les attentes et négocier les délais si nécessaire. Je donne un exemple concret de situation à forte charge où ma méthode de priorisation m'a permis d'atteindre tous les objectifs clés sans compromettre la qualité."
      }
    ]
  }
];

export default categories;