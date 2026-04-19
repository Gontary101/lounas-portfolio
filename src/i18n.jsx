// Bilingual content — English & French

export const UI = {
  en: {
    nav: {
      work: 'Work',
      sims: 'Sims',
      experience: 'Experience',
      skills: 'Skills',
      contact: 'Contact',
    },
    hero: {
      badge: 'PORTFOLIO · BUILT IN WEBGL',
      id: 'LG-2026 / RESEARCH|DEVELOPMENT-ORIENTED · ROBOTICS + AI',
      loading: 'loading webgl…',
    },
    sims: {
      num: '§ 02',
      title: 'Interactive sims, live in the page.',
      kicker: 'Three.js · WebGL',
      desc: 'Four self-contained robotics demos. Click, drag, scroll. Each one mirrors a real component of the project work below — global planning, reactive 6DOF navigation, manipulation with inverse kinematics, and probabilistic mapping & localization with an EKF overlay.',
      init: 'initializing scene…',
      astar: {
        title: 'A* // grid planner',
        kicker: '§ planning',
        subtitle: <>click to toggle obstacles · drag <b>start</b> or <b>goal</b></>,
        caption: '8-connected grid with Manhattan-diagonal heuristic, visited cells in moss, frontier in yellow, replan on any edit.',
        btnRandom: 'Randomize',
        btnClear: 'Clear',
        legend: { start: 'start', goal: 'goal', visited: 'visited', frontier: 'frontier', obstacle: 'obstacle' },
      },
      quad: {
        title: '6DOF quad nav // potential field',
        kicker: '§ navigation',
        subtitle: <>drag the <b>red goal</b> · scroll to change altitude</>,
        caption: 'Reactive goal-seeking with obstacle repulsion in XY, altitude hold in Z, bank from lateral accel.',
        btnNew: 'New world',
        legend: { goal: 'goal', obstacle: 'obstacle', trail: 'trail' },
      },
      manip: {
        title: 'Isometric manipulator // pick-and-place',
        kicker: '§ manipulation',
        subtitle: <>autonomous cycle: approach · grasp · lift · transit · place</>,
        caption: '6-DOF arm. Reachable pick/place poses sampled via FK — no IK, no unreachable targets.',
        btnNew: 'New pick · place',
        legend: { payload: 'payload', dropzone: 'drop zone', gripper: 'gripper' },
      },
      slam: {
        title: '2D SLAM // occupancy grid + PF + EKF',
        kicker: '§ perception',
        subtitle: <>diff-drive robot · 120-beam LiDAR · live <b>log-odds</b> map, particle filter, covariance ellipse</>,
        caption: 'Robot patrols a procedural room. LiDAR → log-odds occupancy grid with estimated-pose insertion; 180-particle MCL with scan-matching likelihood; 3-state EKF fuses the PF mean to drive the covariance ellipse. Particle weighting uses the ground-truth map — a 2D mapping demo with truth-assisted localization, not full SLAM.',
        btnNew: 'New world',
        btnReset: 'Reset belief',
        legend: { robot: 'robot', lidar: 'LiDAR hits', particles: 'particles', occupied: 'occupied', free: 'free', ekf2s: 'EKF 2σ', ekfest: 'EKF estimate ⊕' },
        ekf: { predict: 'EKF · PREDICT', update: 'UPDATE' },
      },
    },
    projects: {
      num: '§ 01',
      title: 'Selected work.',
      kicker: '2022 → 2026 · eight entries',
      role: 'Role',
      stack: 'Stack',
      reports: 'Reports',
      highlights: 'Highlights',
      demoVideos: 'Demo videos',
    },
    experience: {
      num: '§ 03',
      title: 'Research & industry.',
      kicker: 'labs · production · field',
      eduNum: '§ 04',
      eduTitle: 'Education.',
    },
    skills: {
      num: '§ 05',
      title: 'Technical inventory.',
      kicker: 'five layers · one profile',
    },
    about: {
      num: '§ 06',
      title: 'What drives the profile.',
      kicker: 'one paragraph, honestly',
      para: (
        <>
          Build autonomous systems where{' '}
          <em style={{ color: 'var(--forest)' }}>
            perception, estimation, planning, control, and software integration
          </em>{' '}
          must work together under real constraints — not isolated modules, but coherent systems.
        </>
      ),
      marks: [
        'mechatronics foundation',
        'robotics & automation specialization',
        'autonomous systems & control',
        'perception & AI for robotics',
        'complete pipelines, not fragments',
      ],
    },
    contact: {
      num: '§ 07',
      title: "Let's talk robots.",
      kicker: 'targeting France · open to relocation',
      bestFits: (
        <>
          Best fits:{' '}
          <b style={{ color: 'var(--ink)' }}>robotics software engineer</b> ·{' '}
          <b style={{ color: 'var(--ink)' }}>perception / AI for robotics</b> ·{' '}
          <b style={{ color: 'var(--ink)' }}>control, planning, autonomy</b> ·{' '}
          <b style={{ color: 'var(--ink)' }}>drone / UAV engineer</b> ·{' '}
          <b style={{ color: 'var(--ink)' }}>research engineer</b>.
        </>
      ),
      email: 'Email',
      linkedin: 'LinkedIn',
      phone: 'Phone',
      print: 'Print / PDF',
    },
    footer: 'Lounas Gana · 2026 · Built in HTML, Three.js & React.',
  },

  fr: {
    nav: {
      work: "Projets",
      sims: "Simulations",
      experience: "Expérience",
      skills: "Compétences",
      contact: "Contact",
    },
    hero: {
      badge: "PORTFOLIO · CONSTRUIT EN WEBGL",
      id: "LG-2026 / ORIENTÉ RECHERCHE|DÉVELOPPEMENT · ROBOTIQUE + IA",
      loading: "chargement webgl…",
    },
    sims: {
      num: "§ 02",
      title: "Simulations interactives, en direct.",
      kicker: "Three.js · WebGL",
      desc: "Quatre démos robotiques autonomes. Cliquez, faites glisser, défilez. Chacune reflète un composant réel des projets ci-dessous — planification globale, navigation 6DDL réactive, manipulation par cinématique directe, et cartographie & localisation probabilistes avec overlay EKF.",
      init: "initialisation…",
      astar: {
        title: "A* // planificateur grille",
        kicker: "§ planification",
        subtitle: <>cliquer pour basculer obstacles · déplacer <b>départ</b> ou <b>arrivée</b></>,
        caption: "Grille 8-connexe avec heuristique Manhattan-diagonale, cellules visitées en vert, frontière en jaune, replanification à chaque modification.",
        btnRandom: "Aléatoire",
        btnClear: "Effacer",
        legend: { start: "départ", goal: "arrivée", visited: "visité", frontier: "frontière", obstacle: "obstacle" },
      },
      quad: {
        title: "Nav quad 6DDL // champ potentiel",
        kicker: "§ navigation",
        subtitle: <>déplacer l&apos;<b>objectif rouge</b> · défilement pour l&apos;altitude</>,
        caption: "Recherche d'objectif réactive avec répulsion d'obstacles en XY, maintien d'altitude en Z, inclinaison par accélération latérale.",
        btnNew: "Nouveau monde",
        legend: { goal: "objectif", obstacle: "obstacle", trail: "trajectoire" },
      },
      manip: {
        title: "Manipulateur isométrique // saisie-dépose",
        kicker: "§ manipulation",
        subtitle: <>cycle autonome : approche · saisie · levée · transit · dépose</>,
        caption: "Bras 6-DDL. Poses de saisie/dépose atteignables calculées par cinématique directe — sans cinématique inverse, sans cibles inaccessibles.",
        btnNew: "Nouvelle saisie · dépose",
        legend: { payload: "charge utile", dropzone: "zone de dépose", gripper: "pince" },
      },
      slam: {
        title: "SLAM 2D // grille occupancy + PF + EKF",
        kicker: "§ perception",
        subtitle: <>robot diff-drive · LiDAR 120 faisceaux · carte <b>log-odds</b> live, filtre particulaire, ellipse de covariance</>,
        caption: "Le robot patrouille une salle procédurale. LiDAR → grille d'occupation log-odds avec insertion par pose estimée ; MCL à 180 particules avec vraisemblance scan-matching ; EKF 3-état fusionne la moyenne PF pour piloter l'ellipse de covariance. La pondération des particules utilise la carte de vérité terrain — démo de cartographie 2D avec localisation assistée, pas un SLAM complet.",
        btnNew: "Nouveau monde",
        btnReset: "Réinitialiser",
        legend: { robot: "robot", lidar: "impacts LiDAR", particles: "particules", occupied: "occupé", free: "libre", ekf2s: "EKF 2σ", ekfest: "estimation EKF ⊕" },
        ekf: { predict: "EKF · PRÉDICTION", update: "MISE À JOUR" },
      },
    },
    projects: {
      num: "§ 01",
      title: "Travaux sélectionnés.",
      kicker: "2022 → 2026 · huit entrées",
      role: "Rôle",
      stack: "Stack",
      reports: "Rapports",
      highlights: "Points clés",
      demoVideos: "Vidéos démo",
    },
    experience: {
      num: "§ 03",
      title: "Recherche & industrie.",
      kicker: "laboratoires · production · terrain",
      eduNum: "§ 04",
      eduTitle: "Formation.",
    },
    skills: {
      num: "§ 05",
      title: "Inventaire technique.",
      kicker: "cinq couches · un profil",
    },
    about: {
      num: "§ 06",
      title: "Ce qui motive le profil.",
      kicker: "un paragraphe, honnêtement",
      para: (
        <>
          Concevoir des systèmes autonomes où{' '}
          <em style={{ color: 'var(--forest)' }}>
            perception, estimation, planification, contrôle et intégration logicielle
          </em>{' '}
          doivent fonctionner ensemble sous contraintes réelles — pas des modules isolés, mais des systèmes cohérents.
        </>
      ),
      marks: [
        "fondation mécatronique",
        "spécialisation robotique & automatique",
        "systèmes autonomes & contrôle",
        "perception & IA pour la robotique",
        "pipelines complets, pas des fragments",
      ],
    },
    contact: {
      num: "§ 07",
      title: "Parlons robots.",
      kicker: "ciblant la France · ouvert à la relocalisation",
      bestFits: (
        <>
          Postes visés :{' '}
          <b style={{ color: 'var(--ink)' }}>ingénieur logiciel robotique</b> ·{' '}
          <b style={{ color: 'var(--ink)' }}>perception / IA pour la robotique</b> ·{' '}
          <b style={{ color: 'var(--ink)' }}>contrôle, planification, autonomie</b> ·{' '}
          <b style={{ color: 'var(--ink)' }}>ingénieur drone / UAV</b> ·{' '}
          <b style={{ color: 'var(--ink)' }}>ingénieur de recherche</b>.
        </>
      ),
      email: "E-mail",
      linkedin: "LinkedIn",
      phone: "Téléphone",
      print: "Imprimer / PDF",
    },
    footer: "Lounas Gana · 2026 · Construit en HTML, Three.js & React.",
  },
};

// ── Bilingual data ────────────────────────────────────────────────────────────

const PROFILE_EN = {
  name: 'Lounas Gana',
  role: 'Robotics & AI Engineer',
  tagline: 'Building autonomous systems where perception, planning, control & software must work together — under real constraints.',
  location: 'Clermont-Ferrand, France',
  email: 'lounasgana@gmail.com',
  phone: '+33 7 43 16 66 90',
  linkedin: 'linkedin.com/in/lounasgana',
  status: 'M2 Robotics & Artificial Perception · Université Clermont Auvergne · Graduating 2026',
  stats: [
    { v: '1/16',   l: 'M2 S1 Rank' },
    { v: '15.60',  l: 'M2 S1 Avg /20' },
    { v: '500 Hz', l: 'CLF-CBF-QP loop' },
    { v: '< 6 cm', l: 'Drone pos. RMSE' },
    { v: '≈ 90 %', l: 'PointNet ModelNet40' },
    { v: 'C2 / C2', l: 'FR · EN' },
  ],
};

const PROFILE_FR = {
  ...PROFILE_EN,
  role: "Ingénieur Robotique & IA",
  tagline: "Conception de systèmes autonomes où perception, planification, contrôle et intégration logicielle doivent fonctionner ensemble — sous contraintes réelles.",
  status: "M2 Robotique & Perception Artificielle · Université Clermont Auvergne · Diplôme 2026",
  stats: [
    { v: '1/16',   l: "Rang M2 S1" },
    { v: '15,60',  l: "Moy M2 S1 /20" },
    { v: '500 Hz', l: "Boucle CLF-CBF-QP" },
    { v: '< 6 cm', l: "RMSE pos. drone" },
    { v: '≈ 90 %', l: "PointNet ModelNet40" },
    { v: 'C2 / C2', l: "FR · EN" },
  ],
};

const PROJECTS_EN = [
  {
    id: 'mobile-manip', num: '01', year: '2025–26',
    title: 'Mobile Manipulation for Technician Assistance',
    tags: ['ROS2', 'Isaac Sim', 'MoveIt', 'Nav2', 'RGB-D', 'TinyVLA / SmolVLA'],
    blurb: 'A mobile robot that follows a technician, localizes tools via RGB-D, navigates the workspace, manipulates with a Franka FR3, and collects LeRobot/HDF5 data for VLA training & evaluation.',
    role: 'End-to-end integration · perception · manipulation · data pipeline',
    stack: 'ROS2 · Gazebo · Isaac Sim · Nav2 · SLAM · MoveIt · YOLO-Pose + Kalman · TinyVLA · SmolVLA · LeRobot',
    highlights: [
      'Human detection & tracking (YOLO-Pose + Kalman)',
      'RGB-D tool localization & pick-place',
      'Closed-loop VLA rollout evaluation',
      'Automated episode collection pipelines',
    ],
    videos: [
      { src: 'assets/videos/m2_smolvla_isaacsim.mp4', label: 'SmolVLA in Isaac Sim — autonomous screwdriver pick-and-place from vision' },
      { src: 'assets/videos/m2_navigation_gazebo.mp4', label: 'Navigation stack — move-to-goal in Gazebo (4×)' },
    ],
    report: { src: 'assets/reports/M2_mobile_manipulation.pdf', label: 'Project report (PDF)' },
  },
  {
    id: 'drone-stack', num: '02', year: '2025–26',
    title: 'Modular Drone Autonomy Stack',
    tags: ['ROS2', 'PX4', 'MPC', 'RGB-D', 'Safe Corridors'],
    blurb: 'A modular autonomous drone architecture: state estimation, trajectory MPC, local RGB-D mapping, safe-corridor planning, disturbance observer, allocator, PX4 bridges, benchmarking.',
    role: 'Systems architecture · planning/control interfaces · evaluation',
    stack: 'ROS2 · PX4 · Trajectory MPC / MPCC · Safe-Corridor Planner · RGB-D Mapper · Horizon Provider · Allocator',
    highlights: [
      'Local env. representation from RGB-D',
      'Constraint-based motion safety',
      'Clean perception → planning → control seams',
      'Benchmark tooling for rollout replay',
    ],
  },
  {
    id: 'clf-cbf-qp', num: '03', year: '2025',
    title: 'Robust CLF-CBF-QP Drone Control',
    tags: ['Control', 'SE(3)', 'Optimization', 'Gazebo'],
    blurb: 'M1 research internship at Laboratoire DRIVE/ISAT. Geometric control on SE(3) combined with Control Lyapunov & Barrier Functions solved as a QP — robust autonomous obstacle avoidance.',
    role: 'Theory → ROS/Gazebo implementation · validation',
    stack: 'Geometric control SE(3) · CLF · CBF · QP · ROS · Gazebo',
    highlights: [
      'Nominal position RMSE < 6 cm',
      'Controller at 500 Hz — up to 1000 Hz',
      'Obstacle scenarios validated',
      'Safety encoded as convex constraints',
    ],
    report: { src: 'assets/reports/M1_drive_clf_cbf.pdf', label: 'Internship report (PDF)' },
    report2: { src: 'assets/reports/M1_drive_attestation.pdf', label: 'Internship attestation (PDF)' },
  },
  {
    id: 'pointnet', num: '04', year: '2024',
    title: 'PointNet — 3D Point Cloud Classification',
    tags: ['PyTorch', '3D Deep Learning', 'ModelNet40'],
    blurb: 'PointMLP, vanilla PointNet, and PointNet with input T-Net compared on ModelNet40. Explored permutation invariance, symmetric pooling, augmentations.',
    role: 'Training experiments · ablations · analysis',
    stack: 'PyTorch · ModelNet40 · T-Net · jitter/shift/scale/dropout augs',
    highlights: [
      '≈ 90% accuracy (tuned)',
      'T-Net: alignment robustness',
      'Shared MLP + symmetric pooling',
      'Careful augmentation study',
    ],
    report: { src: 'assets/reports/PointNet_3DML.pdf', label: '3D ML report (PDF)' },
  },
  {
    id: 'ur3e', num: '05', year: '2025',
    title: 'UR3e Pick-and-Place — ROS2 + MoveIt',
    tags: ['UR3e', 'MoveIt', 'Polyscope', 'Contact Sensing'],
    blurb: 'Industrial arm programming: Polyscope pick-and-place, contact sensing, ROS2 + UR driver + MoveIt trajectory planning. Work-frame / TCP understanding in practice.',
    role: 'Lab project — manipulator integration',
    stack: 'UR3e · Polyscope · ROS2 · UR driver · MoveIt',
    highlights: ['Work-frame / TCP setup', 'Contact-aware programs', 'MoveIt trajectories on real hardware'],
    report: { src: 'assets/reports/UR3e_ROS2.pdf', label: 'Lab report (PDF)' },
  },
  {
    id: 'spherical', num: '06', year: '2024',
    title: 'Spherical Robot — CAD to ROS2/Gazebo',
    tags: ['Onshape', 'URDF/SDF', 'ROS2', 'Reaction Wheels'],
    blurb: 'RT-G inspired spherical robot: outer rolling shell, level inner frame, four reaction wheels, IMU, stereo pair. Full CAD → URDF → Gazebo workflow.',
    role: 'Mechanism design · simulation bringup',
    stack: 'Onshape · URDF/SDF · ROS2 control · Gazebo · IMU · stereo RGB',
    highlights: ['Nonstandard locomotion', 'CAD-to-sim pipeline', 'Attitude-control concepts'],
    videos: [{ src: 'assets/videos/spherical_bot.mp4', label: 'Spherical robot in Gazebo' }],
  },
  {
    id: 'maze', num: '07', year: '2023',
    title: 'Maze Solver — Webots + Real Robot',
    tags: ['Visual Servoing', 'DFS', 'OpenCV', 'Embedded'],
    blurb: 'Unknown-maze explorer. Two-pass: DFS until goal, then direct replay of simplified shortest path. Binary thresholding + image moments + PID steering.',
    role: 'Sim-first, then hardware — competition build',
    stack: 'Webots · OpenCV thresholding · moments/centroid · PID · turn encoding L/F/R/B',
    highlights: ['DFS exploration', 'Path simplification on backtrack', 'Visual line following'],
  },
  {
    id: 'africa-cup', num: '08', year: '2022–23',
    title: 'League of Robotics Africa — Competition',
    tags: ['Raspberry Pi', 'OpenCV', 'PID', 'Teamwork'],
    blurb: 'Team of 5. Two robots: (1) teleop miniature mobile manipulator for 1v1, (2) autonomous loading/unloading robot with visual-servoing line following on Pi 4 + HD camera.',
    role: 'Robotics maker · embedded · vision',
    stack: 'Raspberry Pi 4 · HD Camera · OpenCV · PID steering',
    highlights: ['Two distinct robots shipped', 'Line-following via moments', 'Competition-grade build'],
  },
];

const PROJECTS_FR = [
  {
    id: "mobile-manip", num: "01", year: "2025–26",
    title: "Manipulation Mobile pour Assistance Technicien",
    tags: ["ROS2", "Isaac Sim", "MoveIt", "Nav2", "RGB-D", "TinyVLA / SmolVLA"],
    blurb: "Robot mobile qui suit un technicien, localise les outils par RGB-D, navigue dans l'espace de travail, manipule avec un Franka FR3 et collecte des données LeRobot/HDF5 pour l'entraînement et l'évaluation de modèles VLA.",
    role: "Intégration bout en bout · perception · manipulation · pipeline données",
    stack: "ROS2 · Gazebo · Isaac Sim · Nav2 · SLAM · MoveIt · YOLO-Pose + Kalman · TinyVLA · SmolVLA · LeRobot",
    highlights: [
      "Détection & suivi humain (YOLO-Pose + Kalman)",
      "Localisation d'outils RGB-D & préhension",
      "Évaluation de rollout VLA en boucle fermée",
      "Pipelines de collecte d'épisodes automatisés",
    ],
    videos: [
      { src: "assets/videos/m2_smolvla_isaacsim.mp4", label: "SmolVLA dans Isaac Sim — saisie autonome de tournevis par vision" },
      { src: "assets/videos/m2_navigation_gazebo.mp4", label: "Stack de navigation — déplacement vers objectif dans Gazebo (4×)" },
    ],
    report: { src: "assets/reports/M2_mobile_manipulation.pdf", label: "Rapport de projet (PDF)" },
  },
  {
    id: "drone-stack", num: "02", year: "2025–26",
    title: "Architecture Autonome Drone Modulaire",
    tags: ["ROS2", "PX4", "MPC", "RGB-D", "Corridors sûrs"],
    blurb: "Architecture drone autonome modulaire : estimation d'état, MPC de trajectoire, cartographie RGB-D locale, planification par corridors sûrs, observateur de perturbations, allocateur, ponts PX4, outils de benchmark.",
    role: "Architecture système · interfaces planification/contrôle · évaluation",
    stack: "ROS2 · PX4 · Trajectory MPC / MPCC · Safe-Corridor Planner · RGB-D Mapper · Horizon Provider · Allocateur",
    highlights: [
      "Représentation locale de l'environnement par RGB-D",
      "Sécurité de mouvement par contraintes",
      "Interfaces propres perception → planification → contrôle",
      "Outils de benchmark pour rejeu de rollout",
    ],
  },
  {
    id: "clf-cbf-qp", num: "03", year: "2025",
    title: "Contrôle Drone Robuste CLF-CBF-QP",
    tags: ["Contrôle", "SE(3)", "Optimisation", "Gazebo"],
    blurb: "Stage de recherche M1 au Laboratoire DRIVE/ISAT. Contrôle géométrique sur SE(3) combiné à des fonctions de Lyapunov et de barrière de contrôle résolues comme QP — évitement d'obstacles autonome robuste.",
    role: "Théorie → implémentation ROS/Gazebo · validation",
    stack: "Contrôle géométrique SE(3) · CLF · CBF · QP · ROS · Gazebo",
    highlights: [
      "RMSE position nominale < 6 cm",
      "Contrôleur à 500 Hz — jusqu'à 1000 Hz",
      "Scénarios d'obstacles validés",
      "Sécurité encodée comme contraintes convexes",
    ],
    report: { src: "assets/reports/M1_drive_clf_cbf.pdf", label: "Rapport de stage (PDF)" },
    report2: { src: "assets/reports/M1_drive_attestation.pdf", label: "Attestation de stage (PDF)" },
  },
  {
    id: "pointnet", num: "04", year: "2024",
    title: "PointNet — Classification de Nuages de Points 3D",
    tags: ["PyTorch", "Apprentissage 3D", "ModelNet40"],
    blurb: "PointMLP, PointNet classique et PointNet avec T-Net d'entrée comparés sur ModelNet40. Exploration de l'invariance à la permutation, du pooling symétrique et des augmentations.",
    role: "Expériences d'entraînement · ablations · analyse",
    stack: "PyTorch · ModelNet40 · T-Net · augmentations jitter/shift/scale/dropout",
    highlights: [
      "≈ 90 % de précision (optimisé)",
      "T-Net : robustesse à l'alignement",
      "MLP partagé + pooling symétrique",
      "Étude approfondie des augmentations",
    ],
    report: { src: "assets/reports/PointNet_3DML.pdf", label: "Rapport 3D ML (PDF)" },
  },
  {
    id: "ur3e", num: "05", year: "2025",
    title: "UR3e Saisie et Dépose — ROS2 + MoveIt",
    tags: ["UR3e", "MoveIt", "Polyscope", "Détection contact"],
    blurb: "Programmation de bras industriel : saisie/dépose Polyscope, détection de contact, ROS2 + driver UR + planification de trajectoire MoveIt. Compréhension pratique des repères de travail et TCP.",
    role: "Projet de TP — intégration manipulateur",
    stack: "UR3e · Polyscope · ROS2 · driver UR · MoveIt",
    highlights: ["Configuration repère de travail / TCP", "Programmes sensibles au contact", "Trajectoires MoveIt sur matériel réel"],
    report: { src: "assets/reports/UR3e_ROS2.pdf", label: "Rapport de TP (PDF)" },
  },
  {
    id: "spherical", num: "06", year: "2024",
    title: "Robot Sphérique — CAO vers ROS2/Gazebo",
    tags: ["Onshape", "URDF/SDF", "ROS2", "Roues de réaction"],
    blurb: "Robot sphérique inspiré du RT-G : coque roulante extérieure, cadre intérieur stable, quatre roues de réaction, IMU, paire stéréo. Workflow complet CAO → URDF → Gazebo.",
    role: "Conception mécanique · mise en simulation",
    stack: "Onshape · URDF/SDF · ROS2 control · Gazebo · IMU · RGB stéréo",
    highlights: ["Locomotion non conventionnelle", "Pipeline CAO vers simulation", "Concepts de contrôle d'attitude"],
    videos: [{ src: "assets/videos/spherical_bot.mp4", label: "Robot sphérique dans Gazebo" }],
  },
  {
    id: "maze", num: "07", year: "2023",
    title: "Résolution de Labyrinthe — Webots + Robot Réel",
    tags: ["Asservissement visuel", "DFS", "OpenCV", "Embarqué"],
    blurb: "Explorateur de labyrinthe inconnu. Deux passes : DFS jusqu'à l'objectif, puis rejeu du plus court chemin simplifié. Seuillage binaire + moments d'image + guidage PID.",
    role: "Simulation d'abord, puis matériel — build de compétition",
    stack: "Webots · seuillage OpenCV · moments/centroïde · PID · encodage virages G/A/D/AR",
    highlights: ["Exploration DFS", "Simplification de chemin au retour", "Suivi de ligne visuel"],
  },
  {
    id: "africa-cup", num: "08", year: "2022–23",
    title: "Ligue de Robotique Afrique — Compétition",
    tags: ["Raspberry Pi", "OpenCV", "PID", "Travail en équipe"],
    blurb: "Équipe de 5. Deux robots : (1) manipulateur mobile miniature téléopéré pour 1v1, (2) robot autonome de chargement/déchargement avec suivi de ligne par asservissement visuel sur Pi 4 + caméra HD.",
    role: "Concepteur robotique · embarqué · vision",
    stack: "Raspberry Pi 4 · Caméra HD · OpenCV · guidage PID",
    highlights: ["Deux robots distincts livrés", "Suivi de ligne par moments", "Build niveau compétition"],
  },
];

const EXPERIENCE_EN = [
  {
    date: 'Mar → Sep 2026',
    title: 'Research Internship — VLA for Robotic Exploration',
    org: 'Institut Pascal · UCA · Aubière',
    points: [
      'Vision-Language-Action models guiding exploration toward unseen static objects',
      'Language-defined goals without direct target image',
      'Adaptation / fine-tuning of VLA systems, multimodal fusion',
      'Contact-based exploration, short-range sensing',
    ],
  },
  {
    date: 'Apr → Sep 2025',
    title: 'M1 Research Internship — Drone Control & Obstacle Avoidance',
    org: 'Laboratoire DRIVE / ISAT · UB Europe · Nevers',
    points: [
      'Robust CLF-CBF-QP for autonomous drone navigation',
      'Geometric control on SE(3), optimization-based safety constraints',
      'ROS / Gazebo implementation, RMSE < 6 cm, 500–1000 Hz loops',
    ],
  },
  {
    date: '2024',
    title: 'Industrial Internship — LD Azouaou',
    org: 'Agricultural / lifting machinery · Algeria',
    points: ['Fabrication, assembly, machining', 'Reverse engineering & SolidWorks', 'Production exposure'],
  },
  {
    date: '2023',
    title: 'Industrial Internship — SPA Somedial',
    org: 'Pharmaceutical production · Algeria',
    points: ['Maintenance & utilities', 'Automated production lines', 'Real-industry system exposure'],
  },
];

const EXPERIENCE_FR = [
  {
    date: "Mar → Sep 2026",
    title: "Stage de Recherche — VLA pour l'Exploration Robotique",
    org: "Institut Pascal · UCA · Aubière",
    points: [
      "Modèles Vision-Langage-Action guidant l'exploration vers des objets statiques inconnus",
      "Objectifs définis par le langage sans image cible directe",
      "Adaptation / fine-tuning de systèmes VLA, fusion multimodale",
      "Exploration par contact, perception courte portée",
    ],
  },
  {
    date: "Avr → Sep 2025",
    title: "Stage de Recherche M1 — Contrôle Drone & Évitement d'Obstacles",
    org: "Laboratoire DRIVE / ISAT · UB Europe · Nevers",
    points: [
      "CLF-CBF-QP robuste pour la navigation autonome de drones",
      "Contrôle géométrique sur SE(3), contraintes de sécurité par optimisation",
      "Implémentation ROS/Gazebo, RMSE < 6 cm, boucles 500–1000 Hz",
    ],
  },
  {
    date: "2024",
    title: "Stage Industriel — LD Azouaou",
    org: "Machines agricoles/de levage · Algérie",
    points: ["Fabrication, assemblage, usinage", "Rétro-ingénierie & SolidWorks", "Exposition à la production"],
  },
  {
    date: "2023",
    title: "Stage Industriel — SPA Somedial",
    org: "Production pharmaceutique · Algérie",
    points: ["Maintenance & utilités", "Lignes de production automatisées", "Exposition aux systèmes industriels réels"],
  },
];

const EDUCATION_EN = [
  { date: '2025–26', title: 'M2 Robotics & Artificial Perception',      org: 'Université Clermont Auvergne', note: 'S1: 15.60/20 · Rank 1/16' },
  { date: '2024–25', title: 'M1 Automation & Robotics',                 org: 'Université Clermont Auvergne', note: '15.16/20 · Rank 3/42' },
  { date: '2020–24', title: 'Engineering Degree — Mechatronics (BAC+4)', org: 'ENSTA Algeria',                note: 'Valedictorian 1/17 · Avg 14.69/20' },
];

const EDUCATION_FR = [
  { date: "2025–26", title: "M2 Robotique & Perception Artificielle",     org: "Université Clermont Auvergne", note: "S1 : 15,60/20 · Rang 1/16" },
  { date: "2024–25", title: "M1 Automatique & Robotique",                 org: "Université Clermont Auvergne", note: "15,16/20 · Rang 3/42" },
  { date: "2020–24", title: "Diplôme d'Ingénieur — Mécatronique (BAC+4)", org: "ENSTA Algérie",               note: "Major de promotion 1/17 · Moy 14,69/20" },
];

const SKILL_GROUPS_EN = [
  { title: 'Robotics Middleware & Simulation',    items: ['ROS2', 'Gazebo', 'Isaac Sim', 'Nav2', 'MoveIt', 'TF2', 'URDF/Xacro', 'PX4'] },
  { title: 'Perception & AI',                     items: ['PyTorch', 'OpenCV', 'YOLO', 'PointNet', 'TinyVLA / SmolVLA', 'RGB-D', 'Multimodal fusion', '3D vision'] },
  { title: 'Control · Estimation · Optimization', items: ['CLF-CBF-QP', 'MPC / MPCC', 'PID', 'Kalman', 'Geometric ctrl SE(3)', 'Trajectory tracking', 'Safe corridors'] },
  { title: 'Programming & Tools',                 items: ['Python', 'C++', 'Linux', 'Git', 'Docker', 'HDF5 / LeRobot'] },
  { title: 'CAD · Mechanical',                    items: ['SolidWorks', 'Onshape', 'Reverse engineering', '3D printing'] },
  { title: 'Languages',                           items: ['French · C2', 'English · C2'] },
];

const SKILL_GROUPS_FR = [
  { title: "Middleware Robotique & Simulation",    items: ["ROS2", "Gazebo", "Isaac Sim", "Nav2", "MoveIt", "TF2", "URDF/Xacro", "PX4"] },
  { title: "Perception & IA",                      items: ["PyTorch", "OpenCV", "YOLO", "PointNet", "TinyVLA / SmolVLA", "RGB-D", "Fusion multimodale", "Vision 3D"] },
  { title: "Contrôle · Estimation · Optimisation", items: ["CLF-CBF-QP", "MPC / MPCC", "PID", "Kalman", "Contrôle géom. SE(3)", "Suivi de trajectoire", "Corridors sûrs"] },
  { title: "Programmation & Outils",               items: ["Python", "C++", "Linux", "Git", "Docker", "HDF5 / LeRobot"] },
  { title: "CAO · Mécanique",                      items: ["SolidWorks", "Onshape", "Rétro-ingénierie", "Impression 3D"] },
  { title: "Langues",                              items: ["Français · C2", "Anglais · C2"] },
];

export const DATA = {
  en: {
    PROFILE: PROFILE_EN,
    PROJECTS: PROJECTS_EN,
    EXPERIENCE: EXPERIENCE_EN,
    EDUCATION: EDUCATION_EN,
    SKILL_GROUPS: SKILL_GROUPS_EN,
  },
  fr: {
    PROFILE: PROFILE_FR,
    PROJECTS: PROJECTS_FR,
    EXPERIENCE: EXPERIENCE_FR,
    EDUCATION: EDUCATION_FR,
    SKILL_GROUPS: SKILL_GROUPS_FR,
  },
};
