const boardElement = document.getElementById("board");
const currentStop = document.getElementById("current-stop");
const currentPosition = document.getElementById("current-position");
const moveCount = document.getElementById("move-count");
const rollResult = document.getElementById("roll-result");
const rollMode = document.getElementById("roll-mode");
const spinButton = document.getElementById("spin-btn");
const resetButton = document.getElementById("reset-btn");
const spinnerWheel = document.getElementById("spinner-wheel");
const langSwitch = document.getElementById("lang-switch");

const backdrop = document.getElementById("backdrop");
const questionModal = document.getElementById("question-modal");
const questionStop = document.getElementById("question-stop");
const questionTitle = document.getElementById("question-title");
const questionBadge = document.getElementById("question-badge");
const questionText = document.getElementById("question-text");
const questionOptions = document.getElementById("question-options");
const questionFeedback = document.getElementById("question-feedback");
const continueButton = document.getElementById("continue-btn");

const finishModal = document.getElementById("finish-modal");
const finishResetButton = document.getElementById("finish-reset");
const spinModal = document.getElementById("spin-modal");
const spinResult = document.getElementById("spin-result");
const confettiCanvas = document.getElementById("confetti-canvas");
const confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;

const STEP_DURATION = 520;
const CONFETTI_DURATION = 5000;
const CONFETTI_COLORS = [
  "#f8d38f",
  "#f3b574",
  "#e79b5b",
  "#f1c78b",
  "#d9b27d",
  "#f7e6c6",
  "#6e8f62",
  "#c94f3d",
];

const boardRows = [
  [21, 22, 23, 24, 25],
  [20, 19, 18, 17, 16],
  [11, 12, 13, 14, 15],
  [10, 9, 8, 7, 6],
  [1, 2, 3, 4, 5],
];

const positionMap = new Map();
boardRows.forEach((row, rowIndex) => {
  row.forEach((number, colIndex) => {
    positionMap.set(number, { row: rowIndex, col: colIndex });
  });
});

const translations = {
  en: {
    pageTitle: "Farm to Table Game",
    heroEyebrow: "Board game concept",
    heroTitle: "Farm to Table Game",
    heroSubhead:
      "Spin the wheel to follow the freight truck's route from the farm to the customer.",
    statusStop: "Current stop",
    statusPosition: "Position",
    statusMoves: "Moves",
    languageLabel: "Language",
    languageToggleAria: "Switch language to Spanish",
    boardTitle: "Redmond Farm Kitchen & Market Board",
    boardSubtitle: "Start at the freight truck and deliver to the customer.",
    legendHazard: "Flat Tire",
    legendFinish: "Finish",
    startEyebrow: "Start here",
    startTitle: "Freight Truck",
    spinTitle: "Spin the wheel",
    spinSubtitle: "Tap to generate 1-6 and move.",
    spinButton: "Spin",
    resultLabel: "Result:",
    spinModalEyebrow: "Spin the wheel",
    spinModalTitle: "Ready to move?",
    spinModalBadge: "Spinner",
    spinResultLabel: "Result",
    rulesTitle: "Quick rules",
    rule1: "Every labeled stop unlocks a question.",
    rule2: "Correct answer: Keep advancing!",
    rule3: "Incorrect Answer: Flat Tire! Go back 3 spaces.",
    rule4: "Deliver raw milk from the farm to the customer to win the game!",
    resetButton: "Restart game",
    continueButton: "Continue",
    finishEyebrow: "Delivery complete",
    finishTitle: "You won!",
    finishBody:
      "You delivered the raw milk from the farm to the customer.",
    finishReset: "Restart",
    stopLabel: "Stop",
    badgeQuestion: "Question",
    badgeHazard: "Restart",
    flatTire: "Flat Tire",
    truckIssue: "Flat Tire!",
    hazardText: "Go back 3 spaces.",
    feedbackCorrect: "Correct! Keep moving.",
    feedbackWrong: "Incorrect Answer: Flat Tire! Go back 3 spaces.",
    startTileAlt: "Farmer at the farm",
    finishTileAlt: "Customer team",
    farmPath: "Farm Path",
    modes: {
      waiting: "waiting",
      spin: "spin",
    },
  },
  es: {
    pageTitle: "Juego De La Granja a la Mesa",
    heroEyebrow: "Concepto de juego de mesa",
    heroTitle: "Juego De La Granja a la Mesa",
    heroSubhead:
      "Gira la ruleta para seguir la ruta del camión de carga desde la granja hasta el cliente.",
    statusStop: "Parada actual",
    statusPosition: "Posición",
    statusMoves: "Movimientos",
    languageLabel: "Idioma",
    languageToggleAria: "Cambiar idioma a inglés",
    boardTitle: "Tablero Redmond Farm Kitchen & Market",
    boardSubtitle: "Empieza en el camión de carga y entrega al cliente.",
    legendHazard: "Llanta pinchada",
    legendFinish: "Meta",
    startEyebrow: "Empieza aquí",
    startTitle: "Camión de carga",
    spinTitle: "Gira la ruleta",
    spinSubtitle: "Toca para generar 1-6 y avanzar.",
    spinButton: "Girar",
    resultLabel: "Resultado:",
    spinModalEyebrow: "Gira la ruleta",
    spinModalTitle: "¿Listo para avanzar?",
    spinModalBadge: "Ruleta",
    spinResultLabel: "Resultado",
    rulesTitle: "Reglas rápidas",
    rule1: "Cada parada con etiqueta desbloquea una pregunta.",
    rule2: "Respuesta correcta: sigue avanzando.",
    rule3: "Respuesta incorrecta: llanta pinchada. Retrocede 3 espacios.",
    rule4: "Entrega leche cruda desde la granja hasta el cliente para ganar.",
    resetButton: "Reiniciar juego",
    continueButton: "Continuar",
    finishEyebrow: "Entrega completada",
    finishTitle: "¡Ganaste!",
    finishBody:
      "Entregaste la leche cruda desde la granja hasta el cliente.",
    finishReset: "Reiniciar",
    stopLabel: "Parada",
    badgeQuestion: "Pregunta",
    badgeHazard: "Reinicio",
    flatTire: "Llanta pinchada",
    truckIssue: "Llanta pinchada",
    hazardText: "Retrocede 3 espacios.",
    feedbackCorrect: "¡Correcto! Sigue avanzando.",
    feedbackWrong: "Respuesta incorrecta: llanta pinchada. Retrocede 3 espacios.",
    startTileAlt: "Granjero en la granja",
    finishTileAlt: "Equipo de clientes",
    farmPath: "Camino de granja",
    modes: {
      waiting: "en espera",
      spin: "giro",
    },
  },
};

const spaceDetails = {
  1: { label: { en: "Heritage Farm", es: "Heritage Farm" }, type: "start" },
  6: { label: { en: "Flat Tire", es: "Llanta pinchada" }, type: "hazard" },
  25: { label: { en: "Finish", es: "Meta" }, type: "finish" },
};

const questions = [
  {
    topic: { en: "Market and Kitchen", es: "Market and Kitchen" },
    prompt: {
      en: "What is the official name of the Farms Collection within Redmond Inc.?",
      es: "¿Cuál es el nombre oficial de la colección de granjas dentro de Redmond Inc.?",
    },
    options: {
      en: ["Redmond Farm Store and Café", "Redmond Farm Market and Kitchen", "Farm Kitchen"],
      es: ["Redmond Farm Store and Café", "Redmond Farm Market and Kitchen", "Farm Kitchen"],
    },
    answer: 1,
  },
  {
    topic: { en: "Market and Kitchen", es: "Market and Kitchen" },
    prompt: {
      en: "Why was Redmond Farm Market and Kitchen originally established?",
      es: "¿Por qué se estableció originalmente Redmond Farm Market and Kitchen?",
    },
    options: {
      en: [
        "Because the founder, Rhett Roberts had a desire to make nutrient-dense foods more accessible to his community.",
        "Because there was no way to purchase Raw Milk in the state of Utah.",
        "Because the Redmond team thought cows were really cute, and selling raw milk was the best way to keep them as pets.",
      ],
      es: [
        "Porque el fundador, Rhett Roberts, deseaba hacer que los alimentos densos en nutrientes fueran más accesibles para su comunidad.",
        "Porque no había manera de comprar leche cruda en el estado de Utah.",
        "Porque el equipo de Redmond pensó que las vacas eran muy tiernas, y vender leche cruda era la mejor manera de tenerlas como mascotas.",
      ],
    },
    answer: 0,
  },
  {
    topic: { en: "Market and Kitchen", es: "Market and Kitchen" },
    prompt: {
      en: "Redmond Farm Market and Kitchen’s purpose statement is: “We connect people to ________ sourced, ________ crafted food that prioritizes the wellbeing of people, animals, and the environment.”",
      es: "La declaración de propósito de Redmond Farm Market and Kitchen es: “Conectamos a las personas con alimentos ________ y ________ que priorizan el bienestar de las personas, los animales y el medio ambiente.”",
    },
    options: {
      en: ["Thoughtfully, Carefully", "Ethically, Lovingly", "Intentionally, Scratch"],
      es: [
        "Reflexivamente, cuidadosamente",
        "Éticamente, con amor",
        "Intencionalmente, desde cero",
      ],
    },
    answer: 0,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "Which example best reflects Redmond’s core value of Ubuntu?",
      es: "¿Qué ejemplo refleja mejor el valor central de Ubuntu en Redmond?",
    },
    options: {
      en: [
        "One associate notices another team member looking sad and decides to crack a joke to help them feel seen and valued.",
        "One associate notices a team member struggling to keep up with a rush in the Farm Kitchen and takes over their job because they know a slow pace ruins the flow of the kitchen.",
        "A truck driver develops an SOP for streamlining the process of dropping off items at each market location to make their job more efficient.",
      ],
      es: [
        "Un asociado nota que otro miembro del equipo se ve triste y decide hacer un chiste para ayudarlo a sentirse visto y valorado.",
        "Un asociado nota que un miembro del equipo está batallando para seguir el ritmo en la Farm Kitchen y toma su puesto porque sabe que un ritmo lento arruina el flujo de la cocina.",
        "Un conductor desarrolla un SOP para agilizar el proceso de entrega en cada ubicación del mercado y hacer su trabajo más eficiente.",
      ],
    },
    answer: 0,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "Redmond’s Five Principles of Hospitality are:",
      es: "Los cinco principios de hospitalidad de Redmond son:",
    },
    options: {
      en: [
        "Smiling, Greeting Customers, Anticipating Others’ Needs, Being Helpful, Kind, and Courteous, and Creating a Welcoming Environment.",
        "Being Present, Putting People First, Anticipating Others’ Needs, Being Helpful, Kind, and Courteous, and Creating a Welcoming Environment.",
        "Being Present, Putting People First, Anticipating Others’ Needs, Being Friendly, Caring, and Kind, and Creating a Welcoming Environment.",
      ],
      es: [
        "Sonreír, saludar a los clientes, anticipar las necesidades de los demás, ser servicial, amable y cortés, y crear un ambiente acogedor.",
        "Estar presente, poner a las personas primero, anticipar las necesidades de los demás, ser servicial, amable y cortés, y crear un ambiente acogedor.",
        "Estar presente, poner a las personas primero, anticipar las necesidades de los demás, ser cordial, atento y amable, y crear un ambiente acogedor.",
      ],
    },
    answer: 1,
  },
  {
    topic: { en: "Milk Testing Facility", es: "Instalación de análisis de leche" },
    prompt: {
      en: "The sourcing standards of Redmond Farm Market and Kitchen includes a commitment to foods that have which three qualities?",
      es: "Los estándares de abastecimiento de Redmond Farm Market and Kitchen incluyen un compromiso con alimentos que tengan estas tres cualidades:",
    },
    options: {
      en: [
        "Certified Organic, Nutrient-Dense, Minimally Processed",
        "Mineral Rich, High-Quality, Vegetarian",
        "Nutrient Rich, Always Real, Intentionally Sourced",
      ],
      es: [
        "Orgánico certificado, denso en nutrientes, mínimamente procesado",
        "Rico en minerales, de alta calidad, vegetariano",
        "Rico en nutrientes, siempre real, obtenido con intención",
      ],
    },
    answer: 2,
  },
  {
    topic: { en: "Market and Kitchen", es: "Market and Kitchen" },
    prompt: {
      en: "Which person would most likely NOT be a customer at Redmond Farm Market and Kitchen?",
      es: "¿Qué persona probablemente NO sería cliente de Redmond Farm Market and Kitchen?",
    },
    options: {
      en: [
        "A mom of two small children who is trying to intentionally prioritize the wellbeing of herself and her family.",
        "A frugal individual who often chooses to prioritize price over quality when it comes to their food.",
        "A top tier athlete who wants to learn more about how to fuel their body in the most impactful way.",
      ],
      es: [
        "Una mamá de dos niños pequeños que intenta priorizar intencionalmente el bienestar suyo y de su familia.",
        "Una persona frugal que a menudo elige priorizar el precio sobre la calidad cuando se trata de su comida.",
        "Un atleta de alto nivel que quiere aprender más sobre cómo nutrir su cuerpo de la manera más efectiva.",
      ],
    },
    answer: 1,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "We currently have Redmond Farm Market locations in these five locations:",
      es: "Actualmente tenemos ubicaciones de Redmond Farm Market en estas cinco localidades:",
    },
    options: {
      en: [
        "Sugarhouse, Orem, Roy, Heber, and Springville.",
        "Orem, Heber, Layton, Sugarhouse, and Tooele.",
        "Admiralty Island (AK), Sugarhouse, Springville, Heber, and Roy.",
      ],
      es: [
        "Sugarhouse, Orem, Roy, Heber y Springville.",
        "Orem, Heber, Layton, Sugarhouse y Tooele.",
        "Admiralty Island (AK), Sugarhouse, Springville, Heber y Roy.",
      ],
    },
    answer: 0,
  },
  {
    topic: { en: "Heritage Farm", es: "Heritage Farm" },
    prompt: {
      en: "The Heritage Farm property was purchased for the purpose of growing:",
      es: "La propiedad de Heritage Farm se compró con el propósito de criar:",
    },
    options: {
      en: [
        "A Drive-Through Zoo for the Surrounding Community",
        "Healthy Cows that Produce Raw Milk",
        "Organic Vegetables",
      ],
      es: [
        "Un zoológico tipo drive-through para la comunidad",
        "Vacas saludables que producen leche cruda",
        "Vegetales orgánicos",
      ],
    },
    answer: 1,
  },
  {
    topic: { en: "Production Kitchen", es: "Cocina de producción" },
    prompt: {
      en: "The production kitchen in Springville produces what kind of House Made items?",
      es: "¿Qué tipo de productos House Made produce la cocina de producción en Springville?",
    },
    options: {
      en: [
        "Sprouted Corn Chips, Cinnamon Almonds, Custards, and Salad Dressings.",
        "Organic, whole-wheat breads and pastries distributed to local bakeries.",
        "Probiotic sodas, naturally sweetened cookies, and coconut oil fried potato chips.",
      ],
      es: [
        "Chips de maíz germinado, almendras con canela, natillas y aderezos para ensalada.",
        "Panes y pasteles orgánicos integrales distribuidos a panaderías locales.",
        "Refrescos probióticos, galletas endulzadas naturalmente y papas fritas en aceite de coco.",
      ],
    },
    answer: 0,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "What is the freight truck’s purpose?",
      es: "¿Cuál es el propósito del camión de carga?",
    },
    options: {
      en: [
        "To offer extra refrigerated storage for raw milk.",
        "To transfer Redmond cows in a safe and reliable way.",
        "To connect and transfer products between the different sections of the farms business unit in a safe and reliable way.",
      ],
      es: [
        "Ofrecer almacenamiento refrigerado extra para la leche cruda.",
        "Trasladar vacas de Redmond de manera segura y confiable.",
        "Conectar y transferir productos entre las diferentes secciones de la unidad de negocios de granjas de manera segura y confiable.",
      ],
    },
    answer: 2,
  },
  {
    topic: { en: "Farm Market Truck", es: "Camión del Farm Market" },
    prompt: {
      en: "The Farm Market Truck travels to five different locations, bringing ________ and ________ to surrounding communities.",
      es: "El camión de Farm Market viaja a cinco ubicaciones distintas, llevando ________ y ________ a las comunidades cercanas.",
    },
    options: {
      en: [
        "Christmas Presents, Joy",
        "Farm Staples, House Made Products",
        "Redmond Equine Products, Trophy Rock Salt Licks",
      ],
      es: [
        "Regalos de Navidad, alegría",
        "Básicos de granja, productos hechos en casa",
        "Productos equinos Redmond, bloques de sal Trophy Rock",
      ],
    },
    answer: 1,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "What animals are raised at the Redmond Heritage Farm?",
      es: "¿Qué animales se crían en Redmond Heritage Farm?",
    },
    options: {
      en: [
        "Goats, Chicken, Pigs, and Cows",
        "Cows and Pigs",
        "Chickens, pigs, cows, and a couple of guard dogs",
      ],
      es: [
        "Cabras, gallinas, cerdos y vacas",
        "Vacas y cerdos",
        "Gallinas, cerdos, vacas y un par de perros guardianes",
      ],
    },
    answer: 2,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "Which example best portrays Redmond’s core value of Reflection?",
      es: "¿Qué ejemplo retrata mejor el valor central Reflection de Redmond?",
    },
    options: {
      en: [
        "A customer telling an associate about a journal they have been writing for the past five years.",
        "A kitchen associate taking time during a slow period to think about their most recent rush, weighing what went well and what can be improved.",
        "An associate going home after work and eating a nourishing meal before taking a long nap to feel rejuvenated and ready for their next shift.",
      ],
      es: [
        "Un cliente contándole a un asociado sobre un diario que ha escrito durante los últimos cinco años.",
        "Un asociado de cocina que aprovecha un momento lento para pensar en su rush más reciente, sopesando lo que salió bien y lo que puede mejorar.",
        "Un asociado que llega a casa después del trabajo y come una comida nutritiva antes de tomar una siesta larga para sentirse renovado y listo para su siguiente turno.",
      ],
    },
    answer: 1,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "The customers that choose to support Redmond Farm Market and Kitchen are those that:",
      es: "Los clientes que eligen apoyar a Redmond Farm Market and Kitchen son aquellos que:",
    },
    options: {
      en: [
        "Embrace a highly intentional way of life, choosing products and experiences with care and curiosity.",
        "Are looking for home décor that aligns with a farm and market aesthetic.",
        "Consider price and efficiency a top priority in life, choosing cheaper, rather than quality products.",
      ],
      es: [
        "Adoptan una forma de vida muy intencional, eligiendo productos y experiencias con cuidado y curiosidad.",
        "Buscan decoración para el hogar que combine con una estética de granja y market.",
        "Consideran el precio y la eficiencia como una prioridad máxima en la vida, eligiendo productos más baratos en lugar de productos de calidad.",
      ],
    },
    answer: 0,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "Which example best portrays Redmond’s core value of Passion for Contribution?",
      es: "¿Qué ejemplo retrata mejor el valor central Passion for Contribution de Redmond?",
    },
    options: {
      en: [
        "A team member prioritizing sleep and rest when away from work so that they can keep doing meaningful work in an energizing way.",
        "A team together leaning in to where they are the most helpful to serve each other and the greater mission of elevating the human experience.",
        "A customer dropping off flowers for an associate during business hours and asking for their number.",
      ],
      es: [
        "Un miembro del equipo que prioriza dormir y descansar fuera del trabajo para poder seguir haciendo un trabajo significativo de forma energizante.",
        "Un equipo que se inclina hacia donde puede ser más útil para servirse mutuamente y servir la misión mayor de elevar la experiencia humana.",
        "Un cliente que deja flores para un asociado durante el horario laboral y le pide su número.",
      ],
    },
    answer: 1,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "The definition of Occhiolism that most resonates with Redmond is:",
      es: "La definición de Occhiolism que más resuena con Redmond es:",
    },
    options: {
      en: [
        "The awareness of the smallness of your perspective which leads to a thirst for understanding.",
        "Caring for yourself in body, heart, mind, and spirit.",
        "A belief that there is only one true way to view life, and that any other way is less-than or unimportant.",
      ],
      es: [
        "La conciencia de lo pequeña que es tu perspectiva, lo que conduce a una sed de entendimiento.",
        "Cuidarte en cuerpo, corazón, mente y espíritu.",
        "La creencia de que solo hay una forma verdadera de ver la vida y que cualquier otra forma es inferior o poco importante.",
      ],
    },
    answer: 0,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "Which example best portrays Redmond’s core value of Renewal?",
      es: "¿Qué ejemplo retrata mejor el valor central Renewal de Redmond?",
    },
    options: {
      en: [
        "Meditating at least twenty minutes a day and getting a full eight hours of sleep every night.",
        "Each market associate visiting the Heritage Farm twice a year to renew their love of raw milk.",
        "A team member trying to solve a problem in a new way after reflecting on what didn’t work last time.",
      ],
      es: [
        "Meditar al menos veinte minutos al día y dormir ocho horas completas cada noche.",
        "Cada asociado del market visitando Heritage Farm dos veces al año para renovar su amor por la leche cruda.",
        "Un miembro del equipo intentando resolver un problema de una nueva manera después de reflexionar sobre lo que no funcionó la vez pasada.",
      ],
    },
    answer: 2,
  },
  {
    topic: { en: "Freight Truck", es: "Camión de carga" },
    prompt: {
      en: "Which stop does the Freight Truck NOT make when transferring products from the farm to our markets?",
      es: "¿Qué parada NO hace el Freight Truck cuando transfiere productos desde la granja hasta nuestros markets?",
    },
    options: {
      en: [
        "A state-certified lab for milk testing.",
        "Cactus and Tropical to pick up plants displayed in the markets.",
        "The meat packer that processes and sources Redmond’s meat.",
      ],
      es: [
        "Un laboratorio certificado por el estado para analizar la leche.",
        "Cactus and Tropical para recoger plantas que se exhiben en los markets.",
        "La empacadora de carne que procesa y abastece la carne de Redmond.",
      ],
    },
    answer: 1,
  },
  {
    topic: { en: "Market and Kitchen", es: "Market and Kitchen" },
    prompt: {
      en: "The Redmond Farm Kitchen was created for what reason?",
      es: "¿Por qué razón se creó Redmond Farm Kitchen?",
    },
    options: {
      en: [
        "To provide a high-quality, nutrient-dense dining option for the community.",
        "To give the CEO and his family a private dining experience away from all the hustle and bustle of other restaurants.",
        "To make food for the team members of the Heritage Farm when they break for lunch from caring for the animals.",
      ],
      es: [
        "Para ofrecer a la comunidad una opción gastronómica de alta calidad y densa en nutrientes.",
        "Para dar al CEO y a su familia una experiencia privada para comer lejos del ajetreo de otros restaurantes.",
        "Para preparar comida para los miembros del equipo de Heritage Farm cuando toman su descanso de almuerzo tras cuidar a los animales.",
      ],
    },
    answer: 0,
  },
  {
    topic: { en: "Production Kitchen", es: "Cocina de producción" },
    prompt: {
      en: "Where is the Production Kitchen (which provides Redmond’s House Made products) located?",
      es: "¿Dónde se encuentra la Production Kitchen (que provee los productos House Made de Redmond)?",
    },
    options: {
      en: ["Heber, UT", "Springville, UT", "Orem, UT"],
      es: ["Heber, UT", "Springville, UT", "Orem, UT"],
    },
    answer: 1,
  },
  {
    topic: { en: "Market and Kitchen", es: "Market and Kitchen" },
    prompt: {
      en: "The Redmond Farm Market exists for what reason?",
      es: "¿Por qué razón existe Redmond Farm Market?",
    },
    options: {
      en: [
        "To provide nourishing foods and products from the Heritage Farm and local suppliers to the wider Utah community.",
        "To act as an indoor farmers market, providing goods from all the local farms in the area.",
        "To offer an in-person farm-animal petting zoo experience and educate the community on what it means to be a “farm-to-table” market.",
      ],
      es: [
        "Para ofrecer alimentos y productos nutritivos de Heritage Farm y proveedores locales a la comunidad más amplia de Utah.",
        "Para funcionar como un mercado de agricultores bajo techo, ofreciendo productos de todas las granjas locales del área.",
        "Para ofrecer una experiencia presencial de zoológico de animales de granja y educar a la comunidad sobre lo que significa ser un market “farm-to-table”.",
      ],
    },
    answer: 0,
  },
  {
    topic: { en: "Farm Path", es: "Camino de granja" },
    prompt: {
      en: "What role do the Redmond Core Values play in the Redmond Farm Market and Kitchen business model?",
      es: "¿Qué papel juegan los valores centrales de Redmond en el modelo de negocio de Redmond Farm Market and Kitchen?",
    },
    options: {
      en: [
        "They are the black-and-white rules of Redmond Farm Market and Kitchen and must be adhered to no matter what.",
        "They guide everything we do as a business!",
        "They offer insights that are sometimes valuable in our company growth and sometimes not.",
      ],
      es: [
        "Son las reglas absolutas de Redmond Farm Market and Kitchen y deben seguirse pase lo que pase.",
        "¡Guían todo lo que hacemos como negocio!",
        "Ofrecen ideas que a veces son valiosas para el crecimiento de nuestra empresa y a veces no.",
      ],
    },
    answer: 1,
  },
];

const standardQuestionSpaceOrder = Array.from({ length: 24 }, (_, index) => index + 2).filter(
  (spaceNumber) => spaceNumber !== 6
);

const questionIndexBySpace = standardQuestionSpaceOrder.reduce(
  (mapping, spaceNumber, index) => {
    mapping[spaceNumber] = index;
    return mapping;
  },
  {}
);
const TRUCK_TOKEN_IMAGE = "assets/Truck 2.png";

const state = {
  position: 1,
  moves: 0,
  completed: new Set(),
  isBusy: false,
  pendingMove: 0,
  activeModal: null,
  activeSpaceNumber: null,
  activeQuestionIndex: null,
  selectedOptionIndex: null,
  answerLocked: false,
  facing: "right",
};

let currentLang = "en";
let currentMode = "waiting";
let pendingOutcome = null;
let audioContext = null;
let applauseBuffer = null;
let confettiParticles = [];
let confettiFrame = null;
let confettiTimer = null;
let confettiUntil = 0;
let confettiLastEmit = 0;

function t(key) {
  return translations[currentLang][key];
}

function getModeLabel(mode) {
  const modes = translations[currentLang].modes || {};
  return modes[mode] || mode;
}

function getSpace(number) {
  const detail = spaceDetails[number];
  const questionIndex = getQuestionIndexForSpace(number);
  const question = questionIndex === null ? null : questions[questionIndex];
  return {
    number,
    label: detail?.label?.[currentLang] || question?.topic?.[currentLang] || t("farmPath"),
    type: detail?.type || "stop",
  };
}

function getQuestionIndexForSpace(spaceNumber) {
  return Number.isInteger(questionIndexBySpace[spaceNumber])
    ? questionIndexBySpace[spaceNumber]
    : null;
}

function createTileIllustration(space) {
  return null;
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });

  langSwitch.setAttribute("aria-label", t("languageToggleAria"));
  rollMode.textContent = getModeLabel(currentMode);
  buildBoard();
  updateBoard();

  if (!questionModal.classList.contains("hidden")) {
    if (state.activeModal === "hazard") {
      renderHazardModal();
    } else if (state.activeModal === "question") {
      renderQuestionModal();
    }
  }
}

function buildBoard() {
  boardElement.innerHTML = "";
  const pathOrder = Array.from({ length: 25 }, (_, idx) => idx + 1);
  const pathMeta = new Map();

  function dirBetween(from, to) {
    if (!from || !to) return null;
    if (to.row < from.row) return "N";
    if (to.row > from.row) return "S";
    if (to.col > from.col) return "E";
    if (to.col < from.col) return "W";
    return null;
  }

  pathOrder.forEach((number, index) => {
    const current = positionMap.get(number);
    const prev = positionMap.get(pathOrder[index - 1]);
    const next = positionMap.get(pathOrder[index + 1]);
    const prevDir = dirBetween(current, prev);
    const nextDir = dirBetween(current, next);
    const dirs = [prevDir, nextDir].filter(Boolean);
    let shape = "path-h";
    if (dirs.length === 1) {
      shape = dirs[0] === "N" || dirs[0] === "S" ? "path-v" : "path-h";
    } else if (dirs.length === 2) {
      const hasN = dirs.includes("N");
      const hasS = dirs.includes("S");
      const hasE = dirs.includes("E");
      const hasW = dirs.includes("W");
      if ((hasE || hasW) && (hasN || hasS)) {
        if (hasN && hasE) shape = "corner-ne";
        else if (hasN && hasW) shape = "corner-nw";
        else if (hasS && hasE) shape = "corner-se";
        else if (hasS && hasW) shape = "corner-sw";
      } else if (hasN || hasS) {
        shape = "path-v";
      } else {
        shape = "path-h";
      }
    }
    pathMeta.set(number, { shape, dirs });
  });

  boardRows.flat().forEach((number) => {
    const space = getSpace(number);
    const tile = document.createElement("div");
    const meta = pathMeta.get(number) || { shape: "path-h", dirs: [] };
    tile.className = `tile ${space.type} ${meta.shape}`;
    meta.dirs.forEach((dir) => {
      if (dir === "N") tile.classList.add("join-top");
      if (dir === "S") tile.classList.add("join-bottom");
      if (dir === "E") tile.classList.add("join-right");
      if (dir === "W") tile.classList.add("join-left");
    });
    tile.dataset.number = number;

    const numberEl = document.createElement("div");
    numberEl.className = "number";
    numberEl.textContent = number;

    const labelEl = document.createElement("div");
    labelEl.className = "label";
    labelEl.textContent = space.type === "finish" ? "" : space.label;

    const illustration = createTileIllustration(space);
    tile.append(numberEl, labelEl);
    if (illustration) {
      tile.appendChild(illustration);
    }
    boardElement.appendChild(tile);
  });
}

function updateBoard() {
  const tiles = boardElement.querySelectorAll(".tile");
  tiles.forEach((tile) => {
    const number = Number(tile.dataset.number);
    tile.classList.toggle("is-current", number === state.position);
    tile.classList.toggle("is-complete", state.completed.has(number));
    const existingToken = tile.querySelector(".token");
    if (number === state.position) {
      if (!existingToken) {
        const token = document.createElement("div");
        token.className = "token";
        token.setAttribute("aria-hidden", "true");
        const truckImage = document.createElement("img");
        truckImage.src = TRUCK_TOKEN_IMAGE;
        truckImage.alt = "";
        truckImage.className = "token-image";
        truckImage.draggable = false;
        token.appendChild(truckImage);
        if (state.facing === "right") {
          token.classList.add("facing-right");
        }
        tile.appendChild(token);
      }
    } else if (existingToken) {
      existingToken.remove();
    }
    if (number === state.position && existingToken) {
      existingToken.classList.toggle("facing-right", state.facing === "right");
    }
  });

  const current = getSpace(state.position);
  currentStop.textContent = current.label;
  currentPosition.textContent = state.position;
  moveCount.textContent = state.moves;
}

function setButtonsDisabled(disabled) {
  spinButton.disabled = disabled;
}

function rollNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

function spinWheel(result) {
  const segment = 360 / 6;
  const desired = (6 - result) * segment + segment / 2;
  const current = spinnerWheel.dataset.rotation
    ? Number(spinnerWheel.dataset.rotation)
    : 0;
  const currentMod = ((current % 360) + 360) % 360;
  const spins = 3;
  const next = current + spins * 360 + (desired - currentMod);
  spinnerWheel.dataset.rotation = String(next);
  spinnerWheel.style.transform = `rotate(${next}deg)`;
}

function animateSpinner(result) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reduceMotion ? 200 : 1800;

  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      spinnerWheel.removeEventListener("transitionend", finish);
      resolve();
    };

    if (!reduceMotion) {
      spinnerWheel.addEventListener("transitionend", finish);
    }

    spinWheel(result);
    setTimeout(finish, duration + 40);
  });
}

function ensureAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioCtx();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {
      // Ignore resume failures caused by browser autoplay restrictions.
    });
  }
  return audioContext;
}

function playEngine(durationMs) {
  if (durationMs <= 0) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = durationMs / 1000;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(220, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.14, now + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const engine = ctx.createOscillator();
  engine.type = "sawtooth";
  engine.frequency.setValueAtTime(70, now);

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(6, now);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(12, now);

  lfo.connect(lfoGain).connect(engine.frequency);
  engine.connect(filter).connect(gain).connect(ctx.destination);

  engine.start(now);
  lfo.start(now);
  engine.stop(now + duration + 0.05);
  lfo.stop(now + duration + 0.05);
}

function playSadEngine(durationMs) {
  if (durationMs <= 0) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = durationMs / 1000;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(180, now);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const engine = ctx.createOscillator();
  engine.type = "triangle";
  engine.frequency.setValueAtTime(120, now);
  engine.frequency.exponentialRampToValueAtTime(70, now + duration);

  engine.connect(filter).connect(gain).connect(ctx.destination);
  engine.start(now);
  engine.stop(now + duration + 0.05);
}

function emitSmoke(tile, facing) {
  if (!tile) return;
  const puff = document.createElement("span");
  puff.className = `smoke ${facing === "right" ? "left" : "right"}`;
  tile.appendChild(puff);
  puff.addEventListener("animationend", () => {
    puff.remove();
  });
  setTimeout(() => {
    puff.remove();
  }, 1800);
}

function resizeConfettiCanvas() {
  if (!confettiCanvas || !confettiCtx) return;
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  confettiCanvas.width = Math.floor(width * dpr);
  confettiCanvas.height = Math.floor(height * dpr);
  confettiCanvas.style.width = `${width}px`;
  confettiCanvas.style.height = `${height}px`;
  confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function stopConfetti() {
  if (!confettiCtx) return;
  if (confettiFrame) {
    cancelAnimationFrame(confettiFrame);
    confettiFrame = null;
  }
  if (confettiTimer) {
    clearTimeout(confettiTimer);
    confettiTimer = null;
  }
  confettiUntil = 0;
  confettiLastEmit = 0;
  confettiParticles = [];
  confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function createConfettiPiece(width, height, initial = false) {
  return {
    x: Math.random() * width,
    y: initial ? -20 - Math.random() * height * 0.7 : -30 - Math.random() * 80,
    w: 5 + Math.random() * 7,
    h: 9 + Math.random() * 12,
    vx: (Math.random() - 0.5) * 2.4,
    vy: 2.2 + Math.random() * 3.4,
    rotation: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.32,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    opacity: 1,
    decay: 0.0012 + Math.random() * 0.002,
  };
}

function addConfettiPieces(count, width, height, initial = false) {
  for (let i = 0; i < count; i += 1) {
    confettiParticles.push(createConfettiPiece(width, height, initial));
  }
}

function animateConfetti() {
  if (!confettiCtx) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const now = performance.now();
  if (now < confettiUntil && now - confettiLastEmit > 80) {
    const burstCount = Math.min(42, Math.max(22, Math.floor(width / 70)));
    addConfettiPieces(burstCount, width, height);
    confettiLastEmit = now;
  }

  confettiCtx.clearRect(0, 0, width, height);
  confettiParticles = confettiParticles.filter((piece) => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.rotation += piece.vr;
    piece.opacity -= piece.decay;
    if (piece.opacity <= 0 || piece.y > height + 40) {
      return false;
    }
    confettiCtx.save();
    confettiCtx.globalAlpha = Math.max(piece.opacity, 0);
    confettiCtx.translate(piece.x, piece.y);
    confettiCtx.rotate(piece.rotation);
    confettiCtx.fillStyle = piece.color;
    confettiCtx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
    confettiCtx.restore();
    return true;
  });

  if (confettiParticles.length || performance.now() < confettiUntil) {
    confettiFrame = requestAnimationFrame(animateConfetti);
  } else {
    stopConfetti();
  }
}

function launchConfetti() {
  if (!confettiCtx) return;
  stopConfetti();
  resizeConfettiCanvas();
  const width = window.innerWidth;
  const height = window.innerHeight;
  const count = Math.min(360, Math.max(180, Math.floor(width / 4.5)));
  confettiUntil = performance.now() + CONFETTI_DURATION;
  confettiLastEmit = performance.now();
  addConfettiPieces(count, width, height, true);
  confettiFrame = requestAnimationFrame(animateConfetti);
  confettiTimer = setTimeout(stopConfetti, CONFETTI_DURATION + 200);
}

function getApplauseBuffer() {
  if (!audioContext) return null;
  if (applauseBuffer && applauseBuffer.sampleRate === audioContext.sampleRate) {
    return applauseBuffer;
  }
  const length = Math.floor(audioContext.sampleRate * 0.4);
  const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    const fade = 1 - i / length;
    data[i] = (Math.random() * 2 - 1) * fade;
  }
  applauseBuffer = buffer;
  return buffer;
}

function playCelebration() {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const start = ctx.currentTime + 0.05;
  const melody = [523.25, 659.25, 783.99, 1046.5];
  melody.forEach((frequency, index) => {
    const noteStart = start + index * 0.12;
    const noteEnd = noteStart + 0.28;
    const oscillator = ctx.createOscillator();
    oscillator.type = index < 2 ? "triangle" : "square";
    oscillator.frequency.setValueAtTime(frequency, noteStart);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2400, noteStart);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.16, noteStart + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

    oscillator.connect(filter).connect(gain).connect(ctx.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteEnd + 0.03);
  });

  [261.63, 329.63, 392].forEach((frequency) => {
    const noteStart = start + 0.45;
    const oscillator = ctx.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, noteStart);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.1, noteStart + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.5);

    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + 0.55);
  });
}

function playApplause() {
  const ctx = ensureAudioContext();
  if (!ctx) return;
  const buffer = getApplauseBuffer();
  if (!buffer) return;

  const now = ctx.currentTime + 0.04;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.16, now + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);
  master.connect(ctx.destination);

  const bursts = 7;
  for (let i = 0; i < bursts; i += 1) {
    const start = now + i * 0.18 + Math.random() * 0.06;
    const duration = 0.12 + Math.random() * 0.08;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(800 + Math.random() * 500, start);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.34, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(filter).connect(gain).connect(master);
    source.start(start);
    source.stop(start + duration);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSpinSequence(result) {
  spinResult.textContent = "-";
  openModal(spinModal);
  await wait(50);
  await animateSpinner(result);
  spinResult.textContent = result;
  await wait(900);
  closeModal(spinModal);
}

async function moveTruckAnimated(steps, options = {}) {
  const { triggerLanding = true } = options;
  const target = Math.min(25, Math.max(1, state.position + steps));
  const totalSteps = Math.abs(target - state.position);
  if (totalSteps === 0) {
    if (triggerLanding) handleLanding();
    return;
  }

  const direction = target > state.position ? 1 : -1;
  if (direction < 0) {
    playSadEngine(2200);
  }
  for (let i = 0; i < totalSteps; i += 1) {
    if (direction > 0) {
      playEngine(STEP_DURATION * 0.9);
    }
    const previousPosition = state.position;
    state.position = Math.min(25, Math.max(1, state.position + direction));
    const previousCoords = positionMap.get(previousPosition);
    const nextCoords = positionMap.get(state.position);
    if (previousCoords && nextCoords) {
      if (nextCoords.row !== previousCoords.row) {
        state.facing = state.facing === "left" ? "right" : "left";
      } else if (nextCoords.col > previousCoords.col) {
        state.facing = "right";
      } else if (nextCoords.col < previousCoords.col) {
        state.facing = "left";
      }
    }
    updateBoard();
    const activeTile = boardElement.querySelector(
      `.tile[data-number="${state.position}"]`
    );
    emitSmoke(activeTile, state.facing);
    await wait(STEP_DURATION);
  }

  if (triggerLanding) handleLanding();
}

function handleLanding() {
  const space = getSpace(state.position);

  if (space.type === "hazard") {
    openHazardModal();
    return;
  }

  if (space.type === "finish") {
    openFinishModal();
    return;
  }

  openQuestionModal(space);
}

function renderHazardModal() {
  questionStop.textContent = t("flatTire");
  questionTitle.textContent = t("truckIssue");
  questionBadge.textContent = t("badgeHazard");
  questionText.textContent = t("hazardText");
  questionOptions.innerHTML = "";
  questionFeedback.textContent = "";
  continueButton.disabled = false;
}

function openHazardModal() {
  setButtonsDisabled(true);
  state.activeModal = "hazard";
  state.activeSpaceNumber = state.position;
  state.activeQuestionIndex = null;
  state.selectedOptionIndex = null;
  state.answerLocked = false;
  pendingOutcome = { type: "hazard", correct: false, spaceNumber: state.position };
  renderHazardModal();
  openModal(questionModal);
}

function renderQuestionModal() {
  const space = getSpace(state.activeSpaceNumber);
  const question = questions[state.activeQuestionIndex];

  questionStop.textContent = `${t("stopLabel")} ${space.number}`;
  questionTitle.textContent = question.topic?.[currentLang] || space.label;
  questionBadge.textContent = t("badgeQuestion");
  questionText.textContent = question.prompt[currentLang];
  questionOptions.innerHTML = "";
  questionFeedback.textContent = "";
  continueButton.disabled = !state.answerLocked;

  question.options[currentLang].forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.textContent = option;

    if (state.answerLocked) {
      button.disabled = true;
      if (index === question.answer) {
        button.classList.add("correct");
      }
      if (index === state.selectedOptionIndex && index !== question.answer) {
        button.classList.add("wrong");
      }
    }

    button.addEventListener("click", () => {
      if (state.answerLocked || pendingOutcome) return;
      state.selectedOptionIndex = index;
      state.answerLocked = true;

      const correct = index === question.answer;
      pendingOutcome = {
        type: "question",
        correct,
        spaceNumber: space.number,
      };

      renderQuestionModal();
    });

    questionOptions.appendChild(button);
  });

  if (state.answerLocked) {
    const correct = state.selectedOptionIndex === question.answer;
    questionFeedback.textContent = correct ? t("feedbackCorrect") : t("feedbackWrong");
  }
}

function openQuestionModal(space) {
  const questionIndex = getQuestionIndexForSpace(space.number);
  if (questionIndex === null) {
    setButtonsDisabled(false);
    return;
  }

  setButtonsDisabled(true);
  state.activeModal = "question";
  state.activeSpaceNumber = space.number;
  state.activeQuestionIndex = questionIndex;
  state.selectedOptionIndex = null;
  state.answerLocked = false;
  pendingOutcome = null;
  renderQuestionModal();
  openModal(questionModal);
}

function openModal(modal) {
  backdrop.classList.remove("hidden");
  modal.classList.remove("hidden");
}

function closeModal(modal) {
  modal.classList.add("hidden");
  backdrop.classList.add("hidden");
}

function clearActiveModal() {
  state.activeModal = null;
  state.activeSpaceNumber = null;
  state.activeQuestionIndex = null;
  state.selectedOptionIndex = null;
  state.answerLocked = false;
}

async function applyOutcome() {
  if (!pendingOutcome) return;

  const { type, correct, spaceNumber } = pendingOutcome;
  pendingOutcome = null;
  closeModal(questionModal);
  clearActiveModal();
  continueButton.disabled = true;
  setButtonsDisabled(true);

  if (type === "hazard") {
    state.completed.add(spaceNumber);
    await moveTruckAnimated(-3, { triggerLanding: false });
    setButtonsDisabled(false);
    return;
  }

  if (!correct) {
    state.completed.add(spaceNumber);
    await moveTruckAnimated(-3, { triggerLanding: false });
    setButtonsDisabled(false);
    return;
  }

  state.completed.add(spaceNumber);
  updateBoard();
  setButtonsDisabled(false);
  if (state.position === 25) {
    openFinishModal();
  }
}

function openFinishModal() {
  setButtonsDisabled(true);
  openModal(finishModal);
  launchConfetti();
  playCelebration();
  playApplause();
}

function resetGame() {
  state.position = 1;
  state.moves = 0;
  state.completed.clear();
  pendingOutcome = null;
  clearActiveModal();
  rollResult.textContent = "-";
  currentMode = "waiting";
  rollMode.textContent = getModeLabel(currentMode);
  spinResult.textContent = "-";
  spinnerWheel.style.transform = "rotate(0deg)";
  spinnerWheel.dataset.rotation = "0";
  setButtonsDisabled(false);
  closeModal(questionModal);
  closeModal(finishModal);
  closeModal(spinModal);
  stopConfetti();
  updateBoard();
}

async function performMove() {
  if (state.isBusy) return;
  state.isBusy = true;
  setButtonsDisabled(true);
  const result = rollNumber();
  rollResult.textContent = "-";
  currentMode = "spin";
  rollMode.textContent = getModeLabel(currentMode);
  await runSpinSequence(result);
  rollResult.textContent = result;
  state.moves += 1;
  state.completed.add(state.position);
  updateBoard();
  await wait(800);
  await moveTruckAnimated(result);
  state.isBusy = false;
}

function setLanguage(lang) {
  const normalized = lang === "es" ? "es" : "en";
  currentLang = normalized;
  langSwitch.checked = normalized === "es";
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("lang", normalized);
  window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
  try {
    localStorage.setItem("farm-game-lang", normalized);
  } catch (error) {
    // Ignore storage failures.
  }
  applyTranslations();
}

function getInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = (params.get("lang") || "").toLowerCase();
  if (fromQuery === "en" || fromQuery === "es") {
    return fromQuery;
  }
  try {
    const stored = localStorage.getItem("farm-game-lang");
    if (stored === "en" || stored === "es") {
      return stored;
    }
  } catch (error) {
    // Ignore storage failures.
  }
  return "en";
}

spinButton.addEventListener("click", () => performMove());
resetButton.addEventListener("click", resetGame);
finishResetButton.addEventListener("click", resetGame);
continueButton.addEventListener("click", applyOutcome);
langSwitch.addEventListener("change", () => {
  setLanguage(langSwitch.checked ? "es" : "en");
});

backdrop.addEventListener("click", () => {
  if (!questionModal.classList.contains("hidden")) return;
  closeModal(finishModal);
  stopConfetti();
});

setLanguage(getInitialLanguage());
resizeConfettiCanvas();
window.addEventListener("resize", resizeConfettiCanvas);
