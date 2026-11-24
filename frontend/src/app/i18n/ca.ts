/**
 * Todos los textos de la interfaz, en catalán, en un solo sitio.
 * Copiados exactamente de la alta fidelidad. Los marcados con «(nou)» no
 * estaban en el diseño y se aprobaron en la fase 0 (CLAUDE.md, 2.2).
 */
export const ca = {
  app: {
    name: 'Apunta+',
  },
  nav: {
    home: 'Inici',
    calendar: 'Calendari',
    tasks: 'Tasques',
    ai: 'IA',
    me: 'El meu espai',
  },
  topBar: {
    back: 'Enrere',
    /** aria-label del perfil con avisos: «El meu espai: 3 tasques pendents per a avui». */
    meWithPending: (n: number) =>
      `El meu espai: ${n} ${n === 1 ? 'tasca pendent' : 'tasques pendents'} per a avui`,
  },
  fab: {
    open: 'Apuntar: tasca, examen, excursió o aniversari',
    close: 'Tancar el menú',
    menuLabel: 'Què vols apuntar?',
    task: 'Tasca',
    exams: 'Exàmens',
    trips: 'Excursions',
    birthdays: 'Aniversaris',
  },
  task: {
    todo: 'Per fer',
    done: 'Feta',
    highPriority: 'Prioritat alta',
    options: 'Opcions de la tasca',
    markDone: (title: string) => `Marcar com a feta: ${title}`,
    unmarkDone: (title: string) => `Desmarcar: ${title}`,
    details: (title: string) => `Veure detalls: ${title}`,
    forToday: 'Per a avui',
  },
  field: {
    showPassword: 'Mostrar la contrasenya',
    hidePassword: 'Amagar la contrasenya',
  },
  state: {
    retry: 'Torna-ho a provar',
    checkConnection: 'Comprova la connexió i torna-ho a provar.',
  },
  common: {
    cancel: 'Cancel·lar',
    close: 'Tancar',
    undo: 'Desfer',
  },
  login: {
    email: 'Correu electrònic',
    emailPlaceholder: 'nom@exemple.com',
    password: 'Contrasenya',
    passwordPlaceholder: 'Escriu la contrasenya',
    submit: 'Entrar',
    noAccount: 'No tens compte?',
    register: 'Registra’t',
  },
  register: {
    title: 'Registre',
    name: 'Nom',
    namePlaceholder: 'Escriu el teu nom',
    role: 'Rol',
    rolePlaceholder: 'Tria el teu rol',
    roles: { student: 'Alumne', parent: 'Pares', teacher: 'Profe' },
    email: 'Correu electrònic',
    emailPlaceholder: 'nom@exemple.com',
    password: 'Contrasenya',
    passwordPlaceholder: 'Escriu una contrasenya',
    passwordHelp: 'Mínim 8 caràcters.',
    password2: 'Repeteix la contrasenya',
    password2Placeholder: 'Torna-la a escriure',
    passwordsMatch: '✓ Les contrasenyes coincideixen.',
    submit: 'Crear el compte',
  },
  accountCreated: {
    title: 'Compte creat',
    welcome: 'Benvingut/da a Apunta+!',
    text: 'El teu compte s’ha creat correctament. Ja pots començar a organitzar les tasques de l’escola.',
    whatNow: 'Què pots fer ara',
    items: [
      { icon: 'assignment', title: 'Apuntar tasques i exàmens', text: 'Tot el que cal fer, en un sol lloc' },
      { icon: 'calendar_month', title: 'Veure-ho al calendari', text: 'Per dies, setmanes o mesos' },
      { icon: 'share', title: 'Compartir-ho amb la família', text: 'Pares i professors al cas' },
    ],
    start: 'Començar',
  },
  session: {
    logout: 'Tancar la sessió', // (nou)
    logoutQuestion: 'Vols tancar la sessió?', // (nou)
  },
} as const;

/**
 * Códigos de error de la API → mensaje del diseño.
 * La API nunca envía textos (CLAUDE.md, 2.7b).
 */
export const apiErrors: Record<string, string> = {
  // Validación por campo
  'name.required': 'Escriu el teu nom.',
  'name.maxLength': 'El nom és massa llarg (màxim 60 caràcters).', // (nou)
  'role.required': 'Tria un rol.',
  'email.required': 'Escriu el correu electrònic.',
  'email.invalid': 'Format de correu no vàlid (ex.: nom@exemple.cat).',
  'password.required': 'Escriu la contrasenya.',
  'password.minLength': 'Ha de tenir almenys 8 caràcters.',
  'password.maxLength': 'Ha de tenir com a màxim 72 caràcters.', // (nou)
  'password.mismatch': 'Les contrasenyes no coincideixen.',
  'password2.required': 'Torna a escriure la contrasenya.',
  // Respuestas de la API
  EMAIL_TAKEN: 'Aquest correu ja té un compte. Inicia sessió o fes servir un altre correu.', // (nou)
  INVALID_CREDENTIALS: 'El correu o la contrasenya no són correctes. Revisa-ho i torna-ho a provar.', // (nou)
  UNAUTHORIZED: 'La sessió ha caducat. Torna a iniciar sessió.', // (nou)
  NETWORK: 'No s’ha pogut connectar amb el servidor. Comprova la connexió i torna-ho a provar.', // (nou)
  SERVER: 'Alguna cosa no ha anat bé. Torna-ho a provar d’aquí a una estona.', // (nou)
};
