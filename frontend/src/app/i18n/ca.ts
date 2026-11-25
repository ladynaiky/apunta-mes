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
  /** Roles (iteración 1). `parent` y `teacher` son los de antes (datos guardados). */
  roles: {
    student: 'Alumne',
    student_f: 'Alumna',
    father: 'Pare',
    mother: 'Mare',
    tutor_m: 'Tutor',
    tutor_f: 'Tutora',
    teacher_m: 'Professor',
    teacher_f: 'Professora',
    other: 'Altres',
    parent: 'Pare/Mare',
    teacher: 'Professor/a',
  } as Record<string, string>, // (nou)
  task: {
    todo: 'Per fer',
    done: 'Feta',
    highPriority: 'Prioritat alta',
    options: 'Opcions de la tasca',
    markDone: (title: string) => `Marcar com a feta: ${title}`,
    unmarkDone: (title: string) => `Desmarcar: ${title}`,
    birthday: (name: string) => `Aniversari de ${name}`, // (nou)
    birthdayAge: (age: number) => `Fa ${age} anys`, // (nou)
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
    forgot: 'Has oblidat la contrasenya?', // (nou)
    noAccount: 'No tens compte?',
    register: 'Registra’t',
  },
  /** «Has oblidat la contrasenya?» (iteración 1, simulado) */
  forgot: {
    title: 'Recuperar la contrasenya', // (nou)
    intro: 'Escriu el correu del teu compte i t’enviarem un enllaç per canviar la contrasenya.', // (nou)
    submit: 'Enviar l’enllaç', // (nou)
    sentTitle: 'T’hem enviat un correu', // (nou)
    sentText: (email: string) =>
      `Si hi ha un compte amb ${email}, hi trobaràs un enllaç per canviar la contrasenya. Mira també el correu brossa.`, // (nou)
    backToLogin: 'Tornar a iniciar sessió', // (nou)
  },
  register: {
    title: 'Registre',
    name: 'Nom',
    namePlaceholder: 'Escriu el teu nom',
    role: 'Rol',
    rolePlaceholder: 'Tria el teu rol',
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
  sheet: {
    kind: { task: 'Tasca', exam: 'Examen', trip: 'Excursió', birthday: 'Aniversari' } as Record<string, string>,
    deleteQuestion: {
      task: 'Vols esborrar aquesta tasca? No es podrà recuperar.',
      exam: 'Vols esborrar aquest examen? No es podrà recuperar.',
      trip: 'Vols esborrar aquesta excursió? No es podrà recuperar.',
      birthday: 'Vols esborrar aquest aniversari? No es podrà recuperar.',
    } as Record<string, string>,
    edit: 'Editar',
    share: 'Compartir',
    delete: 'Esborrar',
    back: 'Tornar enrere',
    accept: 'Acceptar',
    date: 'Data',
    tags: 'Etiquetes',
    notes: 'Notes',
    notesPlaceholder: 'Afegeix una nota',
    noNotes: 'Sense descripció',
    page: (p: string) => `Pàg. ${p}`,
    examType: { written: 'Examen escrit', oral: 'Examen oral', project: 'Examen treball' } as Record<string, string>,
    topic: (t: string) => `Tema: ${t}`,
    tripTimes: (a: string, b: string) => `Sortida ${a} · Tornada ${b}`,
    whatToBring: 'Què cal portar',
    reminder: (days: number, time: string) =>
      `${days === 0 ? 'El mateix dia' : days === 7 ? '1 setmana abans' : days === 1 ? '1 dia abans' : `${days} dies abans`} · ${time}`,
    saved: 'Tasca desada',
    deleted: 'Tasca esborrada.',
    close: 'Tancar',
  },
  home: {
    today: (dayMonth: string) => `Avui és ${dayMonth}.`,
    subjects: 'Assignatures',
    subjectsLabel: 'Assignatures amb tasques pendents',
    newSubject: 'Crear nova assignatura',
    todayTasks: 'Tasques d’avui',
    weekTasks: 'Tasques d’aquesta setmana',
    noToday: 'No tens res per a avui',
    noTodayText: 'Quan apuntis una tasca, la veuràs aquí.',
    loadError: 'No s’han pogut carregar les tasques',
  },
  calendar: {
    title: 'Calendari',
    viewLabel: 'Vista del calendari',
    week: 'Setmana',
    month: 'Mes',
    dayLabel: (dayMonth: string, n: number) =>
      `Tasques del ${dayMonth}${n ? `, ${n} ${n === 1 ? 'cosa apuntada' : 'coses apuntades'}` : ''}`,
    search: 'Buscar o filtrar tasques',
    exams: 'Veure exàmens',
    trips: 'Veure excursions',
    todayOrWeek: 'Veure tasques d’avui o de la setmana',
    loadError: 'No s’ha pogut carregar el calendari',
  },
  tasks: {
    title: 'Tasques',
    todayTasks: 'Tasques d’avui',
    search: 'Buscar o filtrar tasques',
    list: 'Veure el llistat de tasques',
    history: 'Veure l’historial de tasques',
    share: 'Compartir tasques',
    noToday: 'No tens cap tasca pendent',
    noTodayText: 'Quan n’apuntis una, la veuràs aquí.',
  },
  ai: {
    title: 'IA',
    subtitle: 'Suport d’estudi quan el necessitis.',
    conversation: 'Conversa',
    yes: 'Sí, apunta-ho',
    notNow: 'Ara no',
    askLabel: 'Què vols consultar?',
    askPlaceholder: 'Escriu la teva pregunta',
    send: 'Enviar la pregunta',
    demoReply: 'De moment només sóc una demostració. Aviat podré respondre més preguntes.', // (nou)
    loadError: 'No s’ha pogut carregar la conversa',
  },
  me: {
    title: 'El meu espai',
    tabs: { reminders: 'Avisos', share: 'Compartir', customize: 'Personalitzar', contacts: 'Contactes' },
    reviewReminders: 'Revisar la llista d’avisos',
    noReminders: 'No tens cap avís pendent',
    noRemindersText: 'Quan una tasca estigui a punt d’acabar, t’avisarem.',
    daysLeft: (n: number) => (n === 0 ? 'Acaba avui' : n === 1 ? 'Acaba demà' : `Acaba d’aquí a ${n} dies`), // demà i «d’aquí a» (nou)
    shareIntro: 'Marca les tasques que vols compartir amb la família. Les altres només les veus tu.',
    daily: 'Diàries',
    weekly: 'Setmanals',
    shareTask: (title: string) => `Compartir: ${title}`,
    alreadyShared: 'Tasques ja compartides',
    noShared: 'Encara no has compartit cap tasca', // (nou)
    noSharedText: 'Marca-les a dalt i les veuràs aquí.', // (nou)
    sharedLoadError: 'No s’han pogut carregar les tasques compartides', // (nou)
    sharedSummary: (tasks: number, contacts: number) =>
      `${tasks} ${tasks === 1 ? 'tasca compartida' : 'tasques compartides'} amb ${contacts} ${contacts === 1 ? 'contacte' : 'contactes'}`,
    shareMarked: 'Compartir les tasques marcades',
    customizeIntro: 'Agrupa les tasques com et vagi millor.',
    groupBy: 'Agrupar les tasques per',
    groupOptions: { subjects: 'Assignatures', priority: 'Prioritat', date: 'Data de lliurament' },
    markWith: 'Marcar-les amb',
    markOptions: { colors: 'Colors', tags: 'Etiquetes' },
    preview: 'Així es veuran les tasques',
    subjectColors: 'Color de cada assignatura',
    subjectsLabel: 'Assignatures', // (nou)
    subjectOptions: (name: string) => `Editar o esborrar ${name}`, // (nou)
    editSubject: 'Editar assignatura', // (nou)
    subjectName: 'Nom', // (nou)
    subjectColor: 'Color', // (nou)
    subjectNameRequired: 'Escriu el nom de l’assignatura.', // (nou)
    saveSubject: 'Desar', // (nou)
    deleteSubject: 'Esborrar l’assignatura', // (nou)
    deleteSubjectQuestion: (name: string) => `Vols esborrar ${name}? No es podrà recuperar.`, // (nou)
    deleteSubjectConfirm: 'Esborrar', // (nou)
    subjectInUse: 'Aquesta assignatura té coses apuntades. Esborra-les o canvia-les d’assignatura abans.', // (nou)
    subjectSaved: 'Assignatura desada', // (nou)
    subjectDeleted: 'Assignatura esborrada', // (nou)
    addSubject: 'Nova assignatura', // (nou)
    colorOf: (name: string) => `Color de ${name}`,
    colorNames: {
      taronja: 'Taronja',
      groc: 'Groc',
      lila: 'Lila',
      verd: 'Verd',
      turquesa: 'Turquesa',
      rosa: 'Rosa',
      blau: 'Blau',
    } as Record<string, string>,
    visibleTags: 'Etiquetes que es mostren',
    showTag: (name: string) => `Mostrar l’etiqueta ${name}`,
    tags: [
      { key: 'todo', name: 'Per fer', desc: 'Tasques pendents' },
      { key: 'done', name: 'Feta', desc: 'Tasques acabades' },
      { key: 'highPriority', name: 'Prioritat alta', desc: 'Cal fer-la primer' },
      { key: 'lowPriority', name: 'Prioritat baixa', desc: 'Pot esperar' },
    ],
    syncStatusLabel: 'Estat',
    lastSync: (when: string) => `Última sincronització: ${when}`,
    syncing: 'Sincronitzant…',
    syncingStatus: 'Sincronitzant amb els contactes…',
    synced: '✓ Sincronitzat ara mateix',
    syncButton: 'Sincronitzar les tasques compartides',
    neverSynced: 'Encara no s’ha sincronitzat', // (nou)
    contactsIntro: 'Persones amb qui comparteixes les tasques.',
    addContact: 'Afegir contacte',
    editContact: 'Editar contacte',
    saveChanges: 'Desar canvis',
    contactEmail: 'Correu electrònic',
    contactEmailPlaceholder: 'nom@exemple.com',
    contactName: 'Nom d’usuari',
    contactNamePlaceholder: 'Escriu el nom d’usuari',
    contactRole: 'Rol',
    contactRolePlaceholder: 'Tria un rol',
    contactNameRequired: 'Escriu almenys el nom del contacte.',
    addedContacts: 'Contactes afegits',
    noContacts: 'Encara no has afegit cap contacte.',
    editContactLabel: (name: string) => `Editar contacte: ${name}`,
    deleteContactLabel: (name: string) => `Esborrar contacte: ${name}`,
    deleteContactTitle: 'Esborrar contacte?',
    deleteContactText: (name: string) => `Vols esborrar ${name} dels teus contactes? Aquesta acció no es pot desfer.`,
    delete: 'Esborrar',
    saved: 'Canvis desats', // (nou)
    loadError: 'No s’han pogut carregar les dades',
    demo: {
      title: 'Mode demostració', // (nou)
      intro: 'Serveix per ensenyar com es veuen les pantalles buides o amb error.', // (nou)
      label: 'Estat de les dades', // (nou)
      options: { normal: 'Normal', empty: 'Buit', error: 'Error' } as Record<string, string>, // (nou)
    },
  },
  newEntry: {
    titles: { task: 'Apuntar nova tasca', exam: 'Apuntar examen', trip: 'Apuntar excursió', birthday: 'Apuntar aniversari' } as Record<string, string>,
    confirm: { task: 'Confirmar tasca', exam: 'Desar l’examen', trip: 'Desar l’excursió', birthday: 'Desar l’aniversari' } as Record<string, string>,
    editTitles: { task: 'Editar tasca', exam: 'Editar examen', trip: 'Editar excursió', birthday: 'Editar aniversari' } as Record<string, string>, // (nou)
    saveChanges: 'Desar els canvis', // (nou)
    saved: 'Canvis desats', // (nou)
    priority: 'Etiquetes', // (nou)
    loadError: 'No s’ha pogut carregar per editar-la', // (nou)
    tabs: { task: 'Tasca', exam: 'Exàmens', trip: 'Excursions', birthday: 'Aniversaris' } as Record<string, string>,
    tabsLabel: 'Tipus',
    subjects: 'Assignatures',
    subjectLabel: 'Assignatura',
    newSubject: 'Crear nova assignatura',
    name: 'Nom',
    taskNamePlaceholder: 'Nom de la tasca',
    date: 'Data',
    datePlaceholder: 'Busca el dia',
    dateLabel: (d: string) => `Data: ${d}`,
    page: 'Pàg.',
    activity: 'Activitat',
    description: 'Descripció',
    descriptionPlaceholder: 'Fer exercicis, acolorir…',
    examOf: 'Examen de',
    examOfPlaceholder: 'Tema o unitat',
    examType: 'Tipus d’examen',
    examTypes: { written: 'Escrit', oral: 'Oral', project: 'Treball' } as Record<string, string>,
    toStudy: 'Què he d’estudiar',
    toStudyPlaceholder: 'Temes, pàgines, apunts…',
    where: 'On anireu?',
    tripNamePlaceholder: 'Nom de l’excursió',
    departure: 'Sortida',
    return: 'Tornada',
    bring: 'Què cal portar',
    bringPlaceholder: 'Escriu què cal portar',
    add: 'Afegeix',
    editItem: (n: string) => `Editar: ${n}`,
    deleteItem: (n: string) => `Esborrar: ${n}`,
    saveItem: 'Desar',
    observations: 'Observacions',
    observationsPlaceholder: 'Preu, punt de trobada, telèfon…',
    who: 'Qui fa anys?',
    age: 'Edat',
    agePlaceholder: 'Quants en fa?',
    relation: 'És…',
    relations: { friend: 'Amic/ga', family: 'Família', class: 'De classe' } as Record<string, string>,
    gifts: 'Idees de regal',
    giftsPlaceholder: 'Un llibre, un joc, fer-li un dibuix…',
    reminder: 'Avisa’m abans',
    reminderLabel: (r: string) => `Avisa’m abans: ${r}. Canviar`,
    reminderDays: 'Quants dies abans',
    reminderTime: 'Hora de l’avís',
    done: 'Fet',
    dayOptions: { 0: 'El mateix dia', 1: '1 dia', 2: '2 dies', 3: '3 dies', 7: '1 setmana' } as Record<number, string>,
    pickDay: 'Tria el dia',
    discard: 'Descartar',
    confirmDay: 'Confirmar',
  },
  created: {
    titles: { task: 'Tasca creada', exam: 'Examen creat', trip: 'Excursió creada', birthday: 'Aniversari creat' } as Record<string, string>,
    text: 'Ja la tens al calendari.',
    share: 'Vols compartir?',
    no: 'No',
    yes: 'Sí',
    noLabel: 'No, tornar a Inici',
    noBackLabel: 'No, tornar enrere', // (nou)
    yesLabel: 'Sí, compartir',
  },
  newSubject: {
    title: 'Crear nova assignatura',
    name: 'Nom de l’assignatura',
    namePlaceholder: 'Escriu el nom',
    color: 'Color de l’assignatura',
    create: 'Crear assignatura',
    nameRequired: 'Escriu el nom de l’assignatura.', // (nou)
  },
  month: {
    title: 'Calendari',
    previous: 'Mes anterior',
    next: 'Mes següent',
    empty: 'No hi ha tasques aquest mes',
    emptyText: 'Quan n’apuntis una, la veuràs al calendari.',
  },
  day: {
    title: (dayMonth: string) => `Tasca del dia ${dayMonth}`,
    emptyTitle: 'Dia sense tasques',
    label: 'Tasques d’aquest dia',
    empty: 'No hi ha tasques apuntades per a aquest dia',
    emptyText: 'Si vols, pots apuntar-ne una ara.',
    newTask: 'Nova tasca',
    loadError: 'No s’han pogut carregar les tasques d’aquest dia', // (nou)
  },
  exams: {
    title: 'Exàmens',
    empty: 'No hi ha exàmens',
    emptyText: 'Quan n’apuntis, els veuràs aquí.',
    error: 'No s’han pogut carregar els exàmens',
    add: 'Nou examen',
  },
  trips: {
    title: 'Excursions',
    empty: 'No hi ha excursions',
    emptyText: 'Quan n’apuntis, les veuràs aquí.',
    error: 'No s’han pogut carregar les excursions',
    add: 'Nova excursió',
  },
  taskViews: {
    todayWeekTitle: 'Tasca d’avui/setmanal',
    today: 'Avui',
    week: 'Setmana',
    viewLabel: 'Tasques d’avui o de la setmana',
    noToday: 'No tens cap tasca per a avui', // (nou)
    noWeek: 'No tens cap tasca aquesta setmana', // (nou)
    noTasksText: 'Quan n’apuntis una, la veuràs aquí.',
    listTitle: 'Llistat de tasques',
    listEmpty: 'No tens cap tasca pendent',
    listError: 'No s’ha pogut carregar el llistat',
    search: 'Buscar o filtrar tasques',
    historyTitle: 'Historial de tasques',
    monthLabel: (m: string) => `Mes: ${m}`,
    month: 'Mes',
    year: 'Any',
    prevYear: 'Any anterior',
    nextYear: 'Any següent',
    doneOn: (dayMonth: string) => `Feta el ${dayMonth}`,
    historyListLabel: 'Tasques fetes',
    historyEmpty: 'Encara no has fet cap tasca',
    historyEmptyText: 'Quan en marquis una com a feta, la veuràs aquí.',
    historyMonthEmpty: 'Cap tasca feta en aquest mes',
    historyMonthEmptyText: (label: string) => `${label}. Prova amb un altre mes o any.`,
    historyError: 'No s’ha pogut carregar l’historial', // (nou)
    seeList: 'Veure el llistat de tasques',
    months: ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'],
    loadError: 'No s’han pogut carregar les tasques',
  },
  search: {
    title: 'Buscar/Filtrar',
    search: 'Buscar',
    placeholder: 'Nom de la tasca',
    subject: 'Assignatura',
    allSubjects: 'Totes',
    date: 'Data',
    allDates: 'Totes les dates',
    clearDate: 'Treure la data', // (nou)
    submit: 'Buscar la tasca',
    resultsTitle: 'Tasca trobada',
    resultsLabel: 'Resultat de la cerca',
    noResults: 'No s’ha trobat res', // (nou)
    noResultsText: 'Prova amb un altre nom, assignatura o data.', // (nou)
    error: 'No s’ha pogut fer la cerca', // (nou)
    newTask: 'Nova tasca',
  },
  share: {
    title: 'Compartir',
    tasksTitle: 'Compartir tasques',
    type: 'Tipus de contingut',
    typePlaceholder: 'Seleccionar contingut',
    types: { tasks: 'Tasques', calendar: 'Calendari' } as Record<string, string>,
    contacts: 'Contactes',
    contactsPlaceholder: 'Seleccionar contactes',
    contactsSelected: (n: number) => `${n} ${n === 1 ? 'contacte' : 'contactes'}`, // (nou)
    groups: { student: 'Alumnes', family: 'Família', teacher: 'Professors', other: 'Altres' } as Record<string, string>, // (nou: «Família»)
    emptyGroup: 'Encara no hi ha contactes en aquesta categoria.',
    addContact: 'Afegir contacte',
    editContact: 'Editar contacte',
    contactIntro: 'Escriu les dades de la persona amb qui vols compartir.',
    name: 'Nom',
    namePlaceholder: 'Ex.: Avi Joan',
    emailOrPhone: 'Correu o telèfon',
    emailOrPhonePlaceholder: 'nom@exemple.cat',
    role: 'Rol',
    rolePlaceholder: 'Seleccionar rol',
    nameRequired: 'Escriu almenys el nom del contacte.',
    add: 'Afegir',
    save: 'Desar',
    deleteTitle: 'Esborrar contacte?',
    deleteText: (name: string) => `Vols esborrar ${name} dels teus contactes? Aquesta acció no es pot desfer.`,
    delete: 'Esborrar',
    selectContact: (name: string) => `Compartir amb ${name}`, // (nou)
    editLabel: (name: string) => `Editar contacte: ${name}`,
    deleteLabel: (name: string) => `Esborrar contacte: ${name}`,
    typeRequired: 'Tria què vols compartir.', // (nou)
    contactsRequired: 'Tria almenys un contacte.', // (nou)
    generate: 'Generar l’enllaç',
    linkTitle: 'Generar enllaç',
    linkText: 'L’enllaç porta al contingut que has triat.',
    link: 'Enllaç',
    linkLabel: 'Enllaç generat',
    copy: 'Copiar l’enllaç',
    copyFailed: 'No s’ha pogut copiar. Selecciona l’enllaç i copia’l a mà.', // (nou)
    copiedTitle: 'Compartir enllaç',
    copied: 'Enllaç copiat',
    copiedText: 'Enganxa’l on vulguis per compartir el calendari.',
    backHome: 'Tornar a Inici',
    done: 'Fet', // (nou)
    loadError: 'No s’han pogut carregar els contactes', // (nou)
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
  'title.required': 'Escriu el nom.', // (nou)
  'subject.required': 'Tria una assignatura.', // (nou)
  'subject.notFound': 'Tria una assignatura.', // (nou)
  'date.required': 'Tria el dia.', // (nou)
  'date.invalid': 'Tria el dia.', // (nou)
  'personName.required': 'Escriu qui fa anys.', // (nou)
  'colorToken.required': 'Tria un color.', // (nou)
  SUBJECT_EXISTS: 'Ja tens una assignatura amb aquest nom.', // (nou)
  SUBJECT_IN_USE: 'Aquesta assignatura té coses apuntades. Esborra-les o canvia-les d’assignatura abans.', // (nou)
  NETWORK: 'No s’ha pogut connectar amb el servidor. Comprova la connexió i torna-ho a provar.', // (nou)
  SERVER: 'Alguna cosa no ha anat bé. Torna-ho a provar d’aquí a una estona.', // (nou)
};
