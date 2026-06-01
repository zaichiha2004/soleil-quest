import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = (supabaseUrl.startsWith("https://") && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const WHEEL_CATEGORIES = {
  EN: ["Health & Body","Career & Work","Finances","Love & Romance","Personal Growth","Friends & Family","Joy & Play","Community & Belonging","Purpose & Meaning"],
  RU: ["Здоровье и тело","Карьера и работа","Финансы","Любовь и романтика","Личный рост","Друзья и семья","Радость и игра","Сообщество и принадлежность","Смысл и предназначение"],
  ES: ["Salud y cuerpo","Carrera y trabajo","Finanzas","Amor y romance","Crecimiento personal","Amigos y familia","Alegría y juego","Comunidad y pertenencia","Propósito y significado"],
};

const WHEEL_DESCRIPTIONS = {
  EN: [
    "How is your physical energy, sleep, movement, and relationship with your body? Are you caring for it as a foundation?",
    "How fulfilled and engaged do you feel in your work? Does it use your strengths and challenge you in a good way?",
    "How secure and abundant do you feel financially? Does money feel like a source of stress or freedom?",
    "How alive, seen, and nourished do you feel in your romantic relationship — or in your relationship with love itself?",
    "Are you actively learning, evolving, and becoming more of who you want to be?",
    "How deep, honest, and supportive are your friendships and family bonds?",
    "How much genuine fun, laughter, creativity, and play do you have in your life?",
    "Do you feel like you belong somewhere beyond your immediate circle? Are you contributing to something larger?",
    "How much do you feel your life is guided by a deeper why — something that makes it meaningful beyond day-to-day?",
  ],
  RU: [
    "Как твоя физическая энергия, сон, движение и отношение к телу? Заботишься ли ты о нём как об основе?",
    "Насколько ты удовлетворён и вовлечён в работу? Использует ли она твои сильные стороны?",
    "Насколько ты чувствуешь финансовую защищённость? Деньги — источник стресса или свободы?",
    "Насколько живым, замеченным и питаемым ты чувствуешь себя в романтических отношениях?",
    "Ты активно учишься и становишься тем, кем хочешь быть?",
    "Насколько глубоки, честны и поддерживающи твои дружбы и семейные связи?",
    "Сколько настоящего веселья, смеха, творчества и игры в твоей жизни?",
    "Чувствуешь ли ты себя частью чего-то большего, чем твой ближний круг?",
    "Насколько твоя жизнь направляется глубоким «зачем» — чем-то, что делает её значимой?",
  ],
  ES: [
    "¿Cómo está tu energía física, sueño, movimiento y relación con tu cuerpo?",
    "¿Qué tan satisfecho y comprometido te sientes en tu trabajo? ¿Usa tus fortalezas?",
    "¿Qué tan seguro y abundante te sientes financieramente? ¿El dinero es estrés o libertad?",
    "¿Qué tan vivo, visto y nutrido te sientes en tu relación romántica — o con el amor en sí?",
    "¿Estás aprendiendo activamente y convirtiéndote en quien quieres ser?",
    "¿Qué tan profundas, honestas y de apoyo son tus amistades y lazos familiares?",
    "¿Cuánta diversión genuina, risa, creatividad y juego hay en tu vida?",
    "¿Sientes que perteneces a algo más allá de tu círculo inmediato?",
    "¿En qué medida sientes que tu vida está guiada por un para qué más profundo?",
  ],
};

const AFFIRMATIONS = {
  EN: [
    "Your inner spark is always there — sometimes it just needs a moment of stillness to shine.",
    "Every honest answer you give yourself is an act of courage.",
    "You don't have to have it figured out. You just have to begin.",
    "The version of you that you're becoming is worth the discomfort of growth.",
    "Your values are your compass. Trust them.",
    "Today is enough. You are enough.",
    "The light you're looking for has been inside you all along.",
    "Small steps taken consistently change everything.",
    "You are allowed to want what you want.",
    "Your story isn't over. It's just getting interesting.",
  ],
  RU: [
    "Твоя искра всегда здесь — иногда ей нужен лишь момент тишины, чтобы засиять.",
    "Каждый честный ответ себе — это акт смелости.",
    "Не нужно всё понимать. Нужно просто начать.",
    "Версия тебя, которой ты становишься, стоит дискомфорта роста.",
    "Твои ценности — твой компас. Доверяй им.",
    "Сегодняшнего дня достаточно. Тебя достаточно.",
    "Свет, который ты ищешь, был внутри тебя всё это время.",
    "Маленькие шаги, сделанные постоянно, меняют всё.",
    "Тебе разрешено хотеть того, чего ты хочешь.",
    "Твоя история не закончена. Она только становится интересной.",
  ],
  ES: [
    "Tu chispa interior siempre está ahí — a veces solo necesita un momento de quietud para brillar.",
    "Cada respuesta honesta que te das es un acto de valentía.",
    "No tienes que tenerlo todo resuelto. Solo tienes que empezar.",
    "La versión de ti que estás llegando a ser vale la incomodidad del crecimiento.",
    "Tus valores son tu brújula. Confía en ellos.",
    "Hoy es suficiente. Tú eres suficiente.",
    "La luz que buscas ha estado dentro de ti todo el tiempo.",
    "Los pequeños pasos dados consistentemente cambian todo.",
    "Tienes permiso de querer lo que quieres.",
    "Tu historia no ha terminado. Se está poniendo interesante.",
  ],
};

const VALUES_LIST = ["Freedom","Honesty","Growth","Connection","Courage","Peace","Purpose","Creativity","Family","Adventure","Integrity","Joy","Wisdom","Service","Abundance","Authenticity","Health","Love","Solitude","Contribution"];
const VALUES_RU = { Freedom:"Свобода",Honesty:"Честность",Growth:"Рост",Connection:"Связь",Courage:"Смелость",Peace:"Покой",Purpose:"Призвание",Creativity:"Творчество",Family:"Семья",Adventure:"Приключение",Integrity:"Цельность",Joy:"Радость",Wisdom:"Мудрость",Service:"Служение",Abundance:"Изобилие",Authenticity:"Подлинность",Health:"Здоровье",Love:"Любовь",Solitude:"Уединение",Contribution:"Вклад" };
const VALUES_ES = { Freedom:"Libertad",Honesty:"Honestidad",Growth:"Crecimiento",Connection:"Conexión",Courage:"Valentía",Peace:"Paz",Purpose:"Propósito",Creativity:"Creatividad",Family:"Familia",Adventure:"Aventura",Integrity:"Integridad",Joy:"Alegría",Wisdom:"Sabiduría",Service:"Servicio",Abundance:"Abundancia",Authenticity:"Autenticidad",Health:"Salud",Love:"Amor",Solitude:"Soledad",Contribution:"Contribución" };
const VALUES_DESC = { Freedom:"Living on your own terms",Honesty:"Saying what's true, even when it's hard",Growth:"Becoming more than you were yesterday",Connection:"Belonging and being truly seen",Courage:"Acting despite fear",Peace:"Inner stillness and freedom from conflict",Purpose:"Living for something that matters",Creativity:"Expressing what only you can",Family:"Deep roots and unconditional bonds",Adventure:"Embracing the unknown",Integrity:"Being the same person in every room",Joy:"Choosing aliveness over obligation",Wisdom:"Knowing when to act and when to wait",Service:"Giving your gifts to something larger",Abundance:"Trusting there is enough",Authenticity:"Showing up as you actually are",Health:"Honoring your body as your foundation",Love:"Giving and receiving fully",Solitude:"Knowing yourself in the quiet",Contribution:"Leaving things better than you found them" };
const VALUES_DESC_RU = { Freedom:"Жить по своим правилам",Honesty:"Говорить правду, даже когда трудно",Growth:"Становиться больше, чем вчера",Connection:"Быть по-настоящему увиденным",Courage:"Действовать вопреки страху",Peace:"Внутренняя тишина и покой",Purpose:"Жить ради чего-то важного",Creativity:"Выражать то, что можешь только ты",Family:"Глубокие корни и безусловные связи",Adventure:"Принимать неизвестное",Integrity:"Быть одним и тем же в любой комнате",Joy:"Выбирать живость вместо обязанности",Wisdom:"Знать когда действовать, когда ждать",Service:"Отдавать свои дары чему-то большему",Abundance:"Верить, что всего достаточно",Authenticity:"Появляться таким, какой ты есть",Health:"Чтить своё тело как основу",Love:"Давать и получать полностью",Solitude:"Познавать себя в тишине",Contribution:"Оставлять мир лучше, чем нашёл" };
const VALUES_DESC_ES = { Freedom:"Vivir según tus propias reglas",Honesty:"Decir la verdad aunque cueste",Growth:"Ser más que ayer",Connection:"Pertenecer y ser verdaderamente visto",Courage:"Actuar a pesar del miedo",Peace:"Quietud interior y libertad del conflicto",Purpose:"Vivir por algo que importa",Creativity:"Expresar lo que solo tú puedes",Family:"Raíces profundas y lazos incondicionales",Adventure:"Abrazar lo desconocido",Integrity:"Ser la misma persona en todos lados",Joy:"Elegir la vitalidad sobre la obligación",Wisdom:"Saber cuándo actuar y cuándo esperar",Service:"Dar tus dones a algo más grande",Abundance:"Confiar en que hay suficiente",Authenticity:"Mostrarte como realmente eres",Health:"Honrar tu cuerpo como tu base",Love:"Dar y recibir plenamente",Solitude:"Conocerte en el silencio",Contribution:"Dejar las cosas mejor de como las encontraste" };
const HONORING_EXAMPLES = { Freedom:["Saying no to something that doesn't serve you","Designing your own schedule","Leaving a situation that feels like a cage","Choosing your path even when it's unconventional"],Honesty:["Telling someone a hard truth with care","Admitting you were wrong","Being transparent when it would be easier not to","Saying what you actually think"],Growth:["Doing something that scares you a little","Asking for feedback and really hearing it","Sitting with discomfort instead of avoiding it","Learning something new just because"],Connection:["Being fully present in a conversation","Reaching out to someone you've been meaning to call","Sharing something real instead of surface-level","Letting someone in when you'd rather pull away"],Courage:["Speaking up when staying silent would be easier","Making a decision despite uncertainty","Showing vulnerability with someone you trust","Doing the thing you've been putting off"],Peace:["Choosing not to engage in a pointless argument","Creating space in your day for stillness","Letting go of something you can't control","Going to bed without unresolved resentment"],Purpose:["Working on something that feels meaningful","Saying yes to what aligns and no to what doesn't","Connecting your daily actions to a bigger why","Asking yourself if this is what you're here for"],Creativity:["Making something without worrying if it's good","Solving a problem in an unexpected way","Following an idea just to see where it goes","Giving yourself unstructured time to play"],Family:["Being present at the table, phone away","Showing up for someone when it's inconvenient","Having a real conversation instead of a check-in","Prioritizing a family moment over a work task"],Adventure:["Saying yes to something unfamiliar","Taking a different route","Booking the trip you've been talking about","Trying something for the first time"],Integrity:["Doing what you said you'd do","Making a decision you're proud of when no one's watching","Correcting a mistake even when you could hide it","Aligning your actions with your words"],Joy:["Doing something purely for pleasure","Laughing without holding back","Noticing a moment of beauty and pausing for it","Choosing fun over productivity, just once"],Wisdom:["Pausing before reacting","Learning from a mistake without self-punishment","Asking a question instead of assuming","Sharing insight only when it will help"],Service:["Helping without expecting anything back","Showing up for someone in a difficult moment","Contributing your skills to something bigger","Asking 'what do you need?' and meaning it"],Abundance:["Giving generously without counting","Trusting that there is enough","Celebrating someone else's success genuinely","Receiving a compliment gracefully"],Authenticity:["Saying what you really think","Showing up as yourself where you might be judged","Dropping the mask with someone safe","Making a choice that's yours, not the crowd's"],Health:["Choosing sleep over one more episode","Moving your body because it feels good","Eating in a way that respects your energy","Setting a limit on something that depletes you"],Love:["Expressing appreciation unprompted","Listening to understand, not respond","Forgiving someone — including yourself","Showing up with warmth when it's hard"],Solitude:["Taking time alone without guilt","Sitting quietly with your own thoughts","Going on a solo walk without a podcast","Protecting your space as sacred"],Contribution:["Offering your skills where they're needed","Making something better for others","Showing up consistently for a cause","Asking 'how can I help?' and following through"] };
const HONORING_EXAMPLES_RU = { Freedom:["Сказать «нет» тому, что тебя не питает","Самому выстроить свой день","Уйти из ситуации, которая ощущается как клетка","Выбрать свой путь, даже если он нестандартный"],Honesty:["Сказать трудную правду с заботой","Признать, что был неправ","Быть прозрачным, когда проще не быть","Высказать то, что реально думаешь"],Growth:["Сделать то, что немного пугает","Попросить обратную связь и услышать","Остаться с дискомфортом, не убегая","Учиться чему-то новому просто так"],Connection:["Быть полностью присутствующим в разговоре","Написать тому, кому давно собирался","Поделиться чем-то настоящим","Впустить кого-то, когда хочется закрыться"],Courage:["Высказаться, когда молчать было бы проще","Принять решение несмотря на неопределённость","Проявить уязвимость с тем, кому доверяешь","Сделать то, что откладывал"],Peace:["Не вступить в бессмысленный спор","Создать тишину в своём дне","Отпустить то, что не в твоей власти","Лечь спать без неразрешённых обид"],Purpose:["Работать над чем-то значимым","Говорить «да» тому, что совпадает","Видеть связь между действиями и смыслом","Спрашивать себя: «Это ли моё?»"],Creativity:["Создавать что-то без оценки качества","Решать задачу неожиданным способом","Следовать за идеей просто чтобы посмотреть","Дать себе неструктурированное время"],Family:["Быть за столом без телефона","Приехать, когда это неудобно","Поговорить по-настоящему","Поставить семью выше рабочей задачи"],Adventure:["Сказать «да» чему-то незнакомому","Выбрать другой маршрут","Наконец забронировать ту поездку","Попробовать что-то впервые"],Integrity:["Сделать то, что обещал","Принять решение, которым гордишься","Исправить ошибку, даже если можно было скрыть","Совместить слова с действиями"],Joy:["Сделать что-то исключительно ради удовольствия","Смеяться не сдерживаясь","Заметить момент красоты и остановиться","Выбрать радость вместо продуктивности"],Wisdom:["Сделать паузу перед реакцией","Учиться на ошибке без самобичевания","Спросить вместо того чтобы предполагать","Делиться мудростью только когда поможет"],Service:["Помочь, не ожидая ничего взамен","Поддержать кого-то в трудный момент","Вложить свои навыки во что-то большее","Спросить «что тебе нужно?»"],Abundance:["Давать щедро, не считая","Верить, что всего достаточно","Искренне радоваться успеху другого","Принять комплимент с достоинством"],Authenticity:["Сказать то, что реально думаешь","Оставаться собой там, где могут осудить","Снять маску с тем, кому доверяешь","Сделать выбор, который твой"],Health:["Выбрать сон вместо ещё одной серии","Двигаться потому что это приятно","Есть так, чтобы уважать свою энергию","Ограничить то, что тебя истощает"],Love:["Выразить благодарность без повода","Слушать чтобы понять, а не ответить","Простить кого-то — включая себя","Проявить тепло, когда это трудно"],Solitude:["Побыть одному без чувства вины","Посидеть в тишине со своими мыслями","Прогуляться без подкаста","Защитить своё пространство как священное"],Contribution:["Предложить свои навыки там, где нужны","Сделать что-то лучше для других","Стабильно участвовать в чём-то важном","Спросить «чем я могу помочь?»"] };
const HONORING_EXAMPLES_ES = { Freedom:["Decir que no a algo que no te nutre","Diseñar tu propio horario","Salir de una situación que se siente como una jaula","Elegir tu camino aunque sea poco convencional"],Honesty:["Decir una verdad difícil con cuidado","Admitir que estabas equivocado","Ser transparente cuando sería más fácil no serlo","Decir lo que realmente piensas"],Growth:["Hacer algo que te asusta un poco","Pedir retroalimentación y escucharla de verdad","Quedarte con la incomodidad en vez de evitarla","Aprender algo nuevo solo porque sí"],Connection:["Estar completamente presente en una conversación","Escribirle a alguien a quien llevas tiempo sin contactar","Compartir algo real en vez de superficial","Dejar entrar a alguien cuando prefieres cerrarte"],Courage:["Hablar cuando guardar silencio sería más fácil","Tomar una decisión a pesar de la incertidumbre","Mostrar vulnerabilidad con alguien de confianza","Hacer lo que has estado postergando"],Peace:["Elegir no entrar en una discusión sin sentido","Crear espacio de quietud en tu día","Soltar algo que no puedes controlar","Irte a dormir sin resentimientos pendientes"],Purpose:["Trabajar en algo que se siente significativo","Decir sí a lo que se alinea y no a lo que no","Conectar tus acciones diarias con un propósito mayor","Preguntarte si esto es para lo que estás aquí"],Creativity:["Crear algo sin preocuparte por si es bueno","Resolver un problema de forma inesperada","Seguir una idea solo para ver adónde lleva","Darte tiempo libre sin estructura"],Family:["Estar en la mesa sin el teléfono","Aparecer para alguien cuando es inconveniente","Tener una conversación real en vez de un check-in","Priorizar un momento familiar sobre una tarea laboral"],Adventure:["Decir sí a algo desconocido","Tomar un camino diferente","Por fin reservar ese viaje del que hablas","Probar algo por primera vez"],Integrity:["Hacer lo que dijiste que harías","Tomar una decisión de la que estés orgulloso cuando nadie mira","Corregir un error aunque pudieras ocultarlo","Alinear tus acciones con tus palabras"],Joy:["Hacer algo puramente por placer","Reírte sin contención","Notar un momento de belleza y pausar en él","Elegir la diversión sobre la productividad, aunque sea una vez"],Wisdom:["Hacer una pausa antes de reaccionar","Aprender de un error sin castigarte","Hacer una pregunta en vez de asumir","Compartir sabiduría solo cuando ayudará"],Service:["Ayudar sin esperar nada a cambio","Aparecer para alguien en un momento difícil","Contribuir tus habilidades a algo más grande","Preguntar '¿qué necesitas?' y de verdad querer saberlo"],Abundance:["Dar generosamente sin contar","Confiar en que hay suficiente","Celebrar genuinamente el éxito de otro","Recibir un cumplido con gracia"],Authenticity:["Decir lo que realmente piensas","Mostrarte como eres donde podrían juzgarte","Quitarte la máscara con alguien de confianza","Tomar una decisión que sea tuya, no de la multitud"],Health:["Elegir dormir en vez de un capítulo más","Mover tu cuerpo porque se siente bien","Comer de una manera que respete tu energía","Poner un límite a algo que te agota"],Love:["Expresar gratitud sin razón aparente","Escuchar para entender, no para responder","Perdonar a alguien — incluyéndote a ti","Aparecer con calidez cuando es difícil"],Solitude:["Tomarte tiempo a solas sin culpa","Sentarte en silencio con tus propios pensamientos","Dar un paseo solo sin podcast","Proteger tu espacio como sagrado"],Contribution:["Ofrecer tus habilidades donde se necesitan","Hacer algo mejor para los demás","Aparecer de forma constante por una causa","Preguntar '¿cómo puedo ayudar?' y seguirlo"] };

const CHALLENGES = [
  { id:"lost",          emoji:"🌅", labelEN:"I Feel Lost",           labelRU:"Я потерялся",        labelES:"Me Siento Perdido",       descEN:"No direction, can't find the path",        descRU:"Нет направления, не могу найти путь",   descES:"Sin dirección, no encuentro el camino",  suggest:"lost" },
  { id:"confidence",    emoji:"⚡", labelEN:"Confidence Crisis",      labelRU:"Кризис уверенности", labelES:"Crisis de Confianza",      descEN:"Self-doubt, imposter syndrome",            descRU:"Сомнения, синдром самозванца",          descES:"Dudas, síndrome del impostor",           suggest:"confidence" },
  { id:"burnout",       emoji:"🔥", labelEN:"Burnout & Depletion",    labelRU:"Выгорание",          labelES:"Agotamiento",              descEN:"Running on empty, lost purpose",           descRU:"На пределе, потерял смысл",             descES:"Sin energía, perdido el propósito",      suggest:"burnout" },
  { id:"transition",    emoji:"🚀", labelEN:"Big Life Change",        labelRU:"Большие перемены",   labelES:"Gran Cambio de Vida",      descEN:"Pivot, reinvention, new chapter",          descRU:"Поворот, новая глава жизни",            descES:"Pivote, reinvención, nuevo capítulo",    suggest:"transition" },
  { id:"relationships", emoji:"🤝", labelEN:"People & Communication", labelRU:"Люди и общение",     labelES:"Personas y Comunicación",  descEN:"Friction, disconnection, unsaid things",   descRU:"Трения, разрыв, невысказанное",         descES:"Fricción, desconexión, cosas no dichas", suggest:"relationships" },
  { id:"leadership",    emoji:"👑", labelEN:"Leading & Influence",    labelRU:"Лидерство",          labelES:"Liderazgo e Influencia",   descEN:"Stepping up, showing up differently",      descRU:"Выйти на новый уровень",                descES:"Dar un paso adelante, mostrarte diferente", suggest:"leadership" },
  { id:"good",          emoji:"🌤️", labelEN:"I'm Good — Guide Me",   labelRU:"Всё хорошо",         labelES:"Estoy Bien — Guíame",      descEN:"Daily reflection and fresh perspective",   descRU:"Ежедневная рефлексия и свежий взгляд",  descES:"Reflexión diaria y perspectiva fresca",  suggest:"good" },
  { id:"challenge",     emoji:"💡", labelEN:"Challenge Me",           labelRU:"Брось мне вызов",    labelES:"Desafíame",                descEN:"Stress-test a belief, idea, or assumption",descRU:"Проверь идею или убеждение на прочность",descES:"Pon a prueba una creencia o idea",        suggest:"challenge" },
];

const CHECKIN_OPTS_EN = ["Something is weighing on me and I can't shake it","I feel scattered — no clear direction today","I'm going through the motions but something feels off","I feel okay but want to go deeper into something","I'm at a turning point and need clarity"];
const CHECKIN_OPTS_RU = ["Что-то давит, и я не могу от этого отделаться","Чувствую рассеянность — нет ясного направления","Иду по инерции, но что-то не так","В целом нормально, но хочу копнуть глубже","Я на развилке и ищу ясности"];
const CHECKIN_OPTS_ES = ["Algo me pesa y no me lo puedo quitar de encima","Me siento disperso — sin dirección clara hoy","Estoy en piloto automático pero algo no está bien","Estoy bien pero quiero profundizar en algo","Estoy en un punto de inflexión y necesito claridad"];
const CHECKIN_SUGGEST = ["burnout","lost","burnout","good","transition"];

const LIFE_PATH_MEANINGS = {
  1:{en:{title:"The Leader",desc:"Independent, pioneering, built to forge new paths. Your spark: original thinking and the courage to begin."},ru:{title:"Лидер",desc:"Независимый, первопроходец. Твоя искра: оригинальное мышление и смелость начинать."},es:{title:"El Líder",desc:"Independiente, pionero, hecho para abrir nuevos caminos. Tu chispa: el pensamiento original y el valor para empezar."}},
  2:{en:{title:"The Mediator",desc:"Empathetic, intuitive, a natural bridge between people. Your spark: deep listening and the gift of harmony."},ru:{title:"Миротворец",desc:"Эмпатичный, интуитивный. Твоя искра: умение слышать и создавать гармонию."},es:{title:"El Mediador",desc:"Empático, intuitivo, un puente natural entre personas. Tu chispa: la escucha profunda y el don de la armonía."}},
  3:{en:{title:"The Creator",desc:"Expressive, joyful, here to inspire through creativity. Your spark: the ability to make people feel seen."},ru:{title:"Творец",desc:"Выразительный, радостный. Твоя искра: способность вдохновлять и замечать людей."},es:{title:"El Creador",desc:"Expresivo, alegre, aquí para inspirar a través de la creatividad. Tu chispa: hacer que las personas se sientan vistas."}},
  4:{en:{title:"The Builder",desc:"Grounded, disciplined, you turn vision into reality. Your spark: creating systems that actually last."},ru:{title:"Строитель",desc:"Земной, дисциплинированный. Твоя искра: превращать видение в реальность."},es:{title:"El Constructor",desc:"Sólido, disciplinado, conviertes la visión en realidad. Tu chispa: crear sistemas que realmente duran."}},
  5:{en:{title:"The Adventurer",desc:"Curious, free-spirited, here to experience everything. Your spark: adaptability and fearless exploration."},ru:{title:"Искатель",desc:"Любопытный, свободолюбивый. Твоя искра: адаптивность и бесстрашное исследование."},es:{title:"El Aventurero",desc:"Curioso, espíritu libre, aquí para experimentarlo todo. Tu chispa: adaptabilidad y exploración sin miedo."}},
  6:{en:{title:"The Nurturer",desc:"Caring, responsible, devoted to those you love. Your spark: creating safety and beauty for others."},ru:{title:"Опора",desc:"Заботливый, ответственный. Твоя искра: создавать безопасность и красоту для других."},es:{title:"El Cuidador",desc:"Atento, responsable, dedicado a quienes amas. Tu chispa: crear seguridad y belleza para los demás."}},
  7:{en:{title:"The Seeker",desc:"Introspective, analytical, here to find the deeper truth. Your spark: wisdom that comes from within."},ru:{title:"Мыслитель",desc:"Интроспективный, аналитический. Твоя искра: мудрость, идущая изнутри."},es:{title:"El Buscador",desc:"Introspectivo, analítico, aquí para encontrar la verdad más profunda. Tu chispa: la sabiduría que viene de adentro."}},
  8:{en:{title:"The Achiever",desc:"Ambitious, powerful, built for impact and abundance. Your spark: turning purpose into tangible results."},ru:{title:"Достигатель",desc:"Амбициозный, мощный. Твоя искра: превращать цель в ощутимые результаты."},es:{title:"El Realizador",desc:"Ambicioso, poderoso, hecho para el impacto y la abundancia. Tu chispa: convertir el propósito en resultados tangibles."}},
  9:{en:{title:"The Humanitarian",desc:"Compassionate, wise, here to serve something bigger. Your spark: transforming pain into meaning."},ru:{title:"Гуманист",desc:"Сострадательный, мудрый. Твоя искра: превращать боль в смысл."},es:{title:"El Humanitario",desc:"Compasivo, sabio, aquí para servir a algo más grande. Tu chispa: transformar el dolor en significado."}},
  11:{en:{title:"The Visionary",desc:"Intuitive, idealistic, a master of inspiration. Your spark: seeing what others can't yet imagine."},ru:{title:"Провидец",desc:"Интуитивный, идеалистичный. Твоя искра: видеть то, что другие ещё не могут представить."},es:{title:"El Visionario",desc:"Intuitivo, idealista, maestro de la inspiración. Tu chispa: ver lo que otros aún no pueden imaginar."}},
  22:{en:{title:"The Master Builder",desc:"Visionary and practical, here to build things that last generations. Your spark: making the impossible real."},ru:{title:"Мастер-строитель",desc:"Провидец и практик. Твоя искра: делать невозможное возможным."},es:{title:"El Gran Constructor",desc:"Visionario y práctico, aquí para construir cosas que duran generaciones. Tu chispa: hacer lo imposible real."}},
  33:{en:{title:"The Master Teacher",desc:"Pure compassion and creative potential. Your spark: uplifting humanity through unconditional love."},ru:{title:"Учитель-мастер",desc:"Чистое сострадание. Твоя искра: поднимать человечество через безусловную любовь."},es:{title:"El Maestro Supremo",desc:"Compasión pura y potencial creativo. Tu chispa: elevar a la humanidad a través del amor incondicional."}}
};

function calcLifePath(dob) {
  if (!dob) return null;
  const digits = dob.replace(/\D/g,"");
  let sum = digits.split("").reduce((a,d)=>a+parseInt(d),0);
  while (sum>9&&sum!==11&&sum!==22&&sum!==33) sum=String(sum).split("").reduce((a,d)=>a+parseInt(d),0);
  return sum;
}

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_RU = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
async function load(key){try{const r=await window.storage.get(key);return r?JSON.parse(r.value):null;}catch{return null;}}
async function save(key,val){try{await window.storage.set(key,JSON.stringify(val));}catch{}}

// ── SUPABASE DB HELPERS ──
async function dbGetProfile(userId) {
  if (!supabase) return null;
  const {data} = await supabase.from('profiles').select('*').eq('user_id',userId).single();
  return data;
}
async function dbSaveProfile(userId, profile) {
  if (!supabase) return null;
  const {data} = await supabase.from('profiles').upsert({user_id:userId,...profile,updated_at:new Date().toISOString()},{onConflict:'user_id'}).select().single();
  return data;
}
async function dbGetSessions(userId) {
  if (!supabase) return {};
  const {data} = await supabase.from('sessions').select('*').eq('user_id',userId);
  if (!data) return {};
  return data.reduce((acc,s)=>({...acc,[s.date]:s}),{});
}
async function dbSaveSession(userId, session) {
  if (!supabase) return;
  await supabase.from('sessions').upsert({user_id:userId,...session},{onConflict:'user_id,date'});
}
async function dbGetXp(userId) {
  if (!supabase) return 0;
  const {data} = await supabase.from('xp').select('total').eq('user_id',userId).single();
  return data?.total || 0;
}
async function dbSaveXp(userId, total) {
  if (!supabase) return;
  await supabase.from('xp').upsert({user_id:userId,total,updated_at:new Date().toISOString()},{onConflict:'user_id'});
}
async function dbUpsertUser(googleUser) {
  if (!supabase) return null;
  const {data} = await supabase.from('users').upsert({
    google_id: googleUser.sub,
    email: googleUser.email,
    name: googleUser.name,
    avatar_url: googleUser.picture,
  },{onConflict:'google_id'}).select().single();
  return data;
}


const SYSTEM = (lang) => `You are Alex Soleil — a warm, direct, deeply perceptive life coach. Mission: help people find their inner spark. Awaken awareness, not give advice. Three layers: surface → pattern → identity. Respond ENTIRELY in ${lang==="RU"?"Russian — warm, colloquial, like a trusted friend":lang==="ES"?"Spanish (Latin American) — warm, direct, conversational, like a trusted friend":"English"}. 

QUESTION RULES: max 15 words, one idea, plain language, lands on first read.
MULTI-SELECT: two answers complement → weave both. Contradict → name the tension.

ARCHETYPE RULE: Always describe archetypes using fire and light imagery with evocative adjectives. Always follow this pattern: "[adjective] [fire/light object] — [one evocative sentence describing this person's essence]". Examples: "The Persistent Ember — a quiet force that refuses to go out, even when the wind blows hardest.", "The Storming Wildfire — energy that transforms everything it touches, including itself.", "The Quiet Lighthouse — a steady presence that guides others without needing to move." Always include the dash and description — in every language.

QUESTION BANK:
OPENING: "What's really at stake for you right now?" / "What would it feel like to have this handled?" / "Where are you on clarity — 1 to 10?" / "What's keeping you up about this?"
DEEPENING: "What part of you needs attention right now?" / "Where else does this show up?" / "What need isn't being met?" / "Whose truth is that, really?" / "What are you tolerating?" / "What truth are you pretending isn't there?"
EDGE: "What's hard to admit?" / "Who are you being when you do that?" / "What would freedom say?" / "What does your future self already know?" / "What part of you enjoys staying stuck?" / "What would you do if you trusted yourself?"
GOOD/GUIDE: "What's working that you want to deepen?" / "What quiet thing deserves your attention today?" / "What would make today feel complete?" / "What does your best self want to focus on?"
CHALLENGE: "What belief are you most attached to right now?" / "Where are you playing it safe when you shouldn't be?" / "What assumption are you making that might be wrong?" / "What would you do if you knew you couldn't fail?"
BestBehavior: "Who would you become by changing this?" / "How does this look in 3 years?"
HowCanI: "How can you empower yourself about this right now?"
Success: "Why is now the right time?" / "What is this teaching you?"

OUTPUT — strict JSON only, no markdown:
Questions: {"type":"question","question":"text","options":["a","b","c","d"],"depth_label":"label","phase":"opening|deepening|edge"}
Plan: {"type":"plan","title":"2-3 words","insight":"one sentence pattern","practices":[{"name":"name","what":"what to do","why":"why for them","first_step":"smallest beginning"},{"name":"name","what":"what","why":"why","first_step":"begin"},{"name":"name","what":"what","why":"why","first_step":"begin"}],"challenge":"short reframe question","archetype":"[adjective] [fire/light object] — [one evocative sentence about their essence]","celebration":"one warm genuine sentence"}`;

const VALUES_CHALLENGE_SYSTEM = (lang, values) => `You are Alex Soleil. Generate a values challenge for someone whose selected values are: ${values.join(", ")}. Create 5 scenario-based questions that test which values are truly core under pressure. Each scenario should create a genuine tension between two or more of their values. Respond in ${lang==="RU"?"Russian":lang==="ES"?"Latin American Spanish":"English"}. Output strict JSON only: {"scenarios":[{"situation":"brief scenario (1-2 sentences)","options":[{"text":"choice text","reveals":["Value1"]},{"text":"choice text","reveals":["Value2"]},{"text":"choice text","reveals":["Value1","Value2"]}]}]}. Make scenarios feel real and specific to these exact values.`;

const VALUES_RESULT_SYSTEM = (lang) => `You are Alex Soleil. A user completed a values challenge. Analyze their answers and produce a reflection. Respond ENTIRELY in ${lang==="RU"?"warm colloquial Russian":lang==="ES"?"warm colloquial Latin American Spanish":"English"}. Output strict JSON only: {"revealed":["top 2-3 values that showed up most strongly in their choices"],"reflection":"2-3 sentences: what their choices reveal about their true values under pressure vs on paper. Warm, direct, not clinical.","alignment":"one sentence on whether their chosen values and revealed values align or diverge — and what that means"}`;

function WheelChart({ ratings, lang, size=220 }) {
  const cats = WHEEL_CATEGORIES[lang] || WHEEL_CATEGORIES.EN;
  const n = cats.length;
  const cx = 165, cy = 150, r = 82;
  const points = (scale) => cats.map((_,i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + scale * r * Math.cos(angle), cy + scale * r * Math.sin(angle)];
  });
  const grid = [0.2,0.4,0.6,0.8,1.0];
  const toPath = (pts) => pts.map((p,i)=>`${i===0?"M":"L"}${p[0]},${p[1]}`).join(" ")+"Z";
  const dataPoints = cats.map((_,i)=>{
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const scale = (ratings[i]||0) / 10;
    return [cx + scale * r * Math.cos(angle), cy + scale * r * Math.sin(angle)];
  });
  const labelPoints = points(1.28);
  return (
    <svg viewBox="-20 0 340 300" style={{width:"100%",maxWidth:size==="full"?"100%":size,display:"block",margin:"0 auto"}}>
      {grid.map((s,gi) => (
        <polygon key={gi} points={points(s).map(p=>p.join(",")).join(" ")}
          fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={gi===4?1:0.5}/>
      ))}
      {cats.map((_,i) => {
        const [x,y] = points(1)[i];
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,.08)" strokeWidth={0.5}/>;
      })}
      <path d={toPath(dataPoints)} fill="rgba(212,163,89,.2)" stroke="#d4a359" strokeWidth={1.5}/>
      {dataPoints.map((p,i) => ratings[i]>0 && (
        <circle key={i} cx={p[0]} cy={p[1]} r={3} fill="#d4a359"/>
      ))}
      {cats.map((cat,i) => {
        const [x,y] = labelPoints[i];
        const anchor = x < cx-5 ? "end" : x > cx+5 ? "start" : "middle";
        const words = cat.split(" ");
        const line1 = words.slice(0, Math.ceil(words.length/2)).join(" ");
        const line2 = words.length > 1 ? words.slice(Math.ceil(words.length/2)).join(" ") : null;
        return (
          <text key={i} x={x} y={y} textAnchor={anchor} style={{fontSize:"7.5px",fill:"rgba(240,236,228,.55)",fontFamily:"DM Sans,sans-serif"}}>
            <tspan x={x} dy={line2?"-0.5em":"0"}>{line1}</tspan>
            {line2 && <tspan x={x} dy="1.1em">{line2}</tspan>}
          </text>
        );
      })}
    </svg>
  );
}

function DobDropdown({ lang, day, month, year, onDay, onMonth, onYear, onClear }) {
  const months = lang==="RU" ? MONTHS_RU : lang==="ES" ? MONTHS_ES : MONTHS_EN;
  const dayLabel = lang==="RU"?"День":lang==="ES"?"Día":"Day";
  const monthLabel = lang==="RU"?"Месяц":lang==="ES"?"Mes":"Month";
  const yearLabel = lang==="RU"?"Год":lang==="ES"?"Año":"Year";
  const currentYear = new Date().getFullYear();
  const years = Array.from({length:100},(_,i)=>currentYear-i);
  const days = Array.from({length:31},(_,i)=>i+1);
  const sel = {background:"#1a1a24",border:"0.5px solid rgba(255,255,255,.1)",borderRadius:9,padding:"10px 8px",color:"#f0ece4",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none",cursor:"pointer",flex:1};
  const hasAll = day&&month&&year;
  return (
    <div style={{width:"100%"}}>
      <div style={{display:"flex",gap:7}}>
        <select value={day} onChange={e=>onDay(e.target.value)} style={sel}>
          <option value="">{dayLabel}</option>
          {days.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
        <select value={month} onChange={e=>onMonth(e.target.value)} style={{...sel,flex:2}}>
          <option value="">{monthLabel}</option>
          {months.map((m,i)=><option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <select value={year} onChange={e=>onYear(e.target.value)} style={sel}>
          <option value="">{yearLabel}</option>
          {years.map(y=><option key={y} value={y}>{y}</option>)}
        </select>
        {hasAll&&<button style={{background:"none",border:"none",color:"rgba(240,236,228,.35)",fontSize:13,cursor:"pointer",padding:"0 4px",fontFamily:"'DM Sans',sans-serif"}} onClick={onClear}>✕</button>}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang]         = useState("EN");
  const [screen, setScreen]     = useState("boot");
  const [profile, setProfile]   = useState(null);
  const [tab, setTab]           = useState("home");
  const [authUser, setAuthUser] = useState(null);
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('sq_user_avatar')||'');
  const [userId, setUserId]     = useState(null); // Supabase user ID
  const [wheelRatings, setWheelRatings] = useState({});
  const [wheelTooltip, setWheelTooltip] = useState(null); // Wheel of Life
  const [affirmation, setAffirmation] = useState(""); // Daily affirmation
  const [yesterdaySession, setYesterdaySession] = useState(null); // Yesterday's session
  const [yesterdayAnswer, setYesterdayAnswer] = useState(null); // How yesterday went
  const [showYesterday, setShowYesterday] = useState(false);
  const [animKey, setAnimKey]   = useState(0);
  const [editingReflection, setEditingReflection] = useState(null);
  const [editReflectionText, setEditReflectionText] = useState("");

  // onboarding
  const [onbStep, setOnbStep]   = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [dobInput, setDobInput] = useState("");
  const [dobDay, setDobDay]     = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear]   = useState("");
  const [selValues, setSelValues] = useState([]);
  const [tooltipVal, setTooltipVal] = useState(null);
  const [showValChallenge, setShowValChallenge] = useState(false);

  // checkin
  const [checkinSel, setCheckinSel] = useState([]);
  const [suggested, setSuggested] = useState(null);
  const [showOverwrite, setShowOverwrite] = useState(false);
  const [pendingNavigate, setPendingNavigate] = useState(false);

  // quest
  const [challenge, setChallenge] = useState(null);
  const [conv, setConv]         = useState([]);
  const [currentQ, setCurrentQ] = useState(null);
  const [qCount, setQCount]     = useState(0);
  const [sel, setSel]           = useState([]);
  const [plan, setPlan]         = useState(null);
  const [loading, setLoading]   = useState(false);

  // readiness
  const [readiness, setReadiness] = useState(null);
  const [stepOpts, setStepOpts] = useState([]);
  const [firstStep, setFirstStep] = useState(null);

  // reflection
  const [reflection, setReflection] = useState("");
  const [reflSaved, setReflSaved] = useState(false);
  const [freeText, setFreeText] = useState("");

  // sessions
  const [sessions, setSessions] = useState({});
  const [calMonth, setCalMonth] = useState(new Date());
  const [expanded, setExpanded] = useState(null);

  // xp
  const [xp, setXp]                 = useState(0);
  const [xpMilestone, setXpMilestone] = useState(null);
  const [langOpen, setLangOpen] = useState(false);

  // who am i
  const [editingValues, setEditingValues] = useState(false);
  const [editVals, setEditVals] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDob, setEditDob]   = useState("");
  const [editDobDay, setEditDobDay]     = useState("");
  const [editDobMonth, setEditDobMonth] = useState("");
  const [editDobYear, setEditDobYear]   = useState("");

  // values challenge state
  const [vcScenarios, setVcScenarios] = useState([]);
  const [vcIdx, setVcIdx]       = useState(0);
  const [vcAnswers, setVcAnswers] = useState([]);
  const [vcResult, setVcResult] = useState(null);
  const [vcLoading, setVcLoading] = useState(false);
  const [vcContext, setVcContext] = useState("onboarding"); // "onboarding" | "whoami"

  const goTo = (s) => { setScreen(s); setAnimKey(k=>k+1); };
  const today = new Date().toLocaleDateString("en-CA");

  const checkinOpts = lang==="RU" ? CHECKIN_OPTS_RU : lang==="ES" ? CHECKIN_OPTS_ES : CHECKIN_OPTS_EN;
  const valLabel = (v) => lang==="RU" ? (VALUES_RU[v]||v) : lang==="ES" ? (VALUES_ES[v]||v) : v;
  const valDesc  = (v) => lang==="RU" ? (VALUES_DESC_RU[v]||"") : lang==="ES" ? (VALUES_DESC_ES[v]||"") : (VALUES_DESC[v]||"");
  const honorEx  = (v) => lang==="RU" ? (HONORING_EXAMPLES_RU[v]||[]) : lang==="ES" ? (HONORING_EXAMPLES_ES[v]||[]) : (HONORING_EXAMPLES[v]||[]);
  const firstName = profile?.name?.split(" ")[0]||"";
  const timeOfDay = () => { const h=new Date().getHours(); return lang==="RU"?(h<12?"утро":h<17?"день":"вечер"):lang==="ES"?(h<12?"mañana":h<17?"tarde":"noche"):(h<12?"morning":h<17?"afternoon":"evening"); };

  // ── SUPABASE GOOGLE OAUTH ──
  useEffect(()=>{
    (async()=>{
      if (!supabase) { bootFromStorage(); return; }

      // Check for existing Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await handleSupabaseUser(session.user);
        return;
      }

      // Listen for auth state changes (handles redirect callback)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          await handleSupabaseUser(session.user);
        }
      });

      // Check stored user as fallback
      if (session?.user) return; // already handled above
      const storedUserId = localStorage.getItem('sq_user_id');
      const storedName = localStorage.getItem('sq_user_name');
      const storedAvatar = localStorage.getItem('sq_user_avatar');
      if (storedUserId) {
        setUserId(storedUserId);
        if (storedAvatar) { setUserAvatar(storedAvatar); setAuthUser({ picture: storedAvatar, name: storedName }); }
        console.log("booting from localStorage userId:", storedUserId);
        bootFromSupabase(storedUserId, storedName||'Friend');
      } else {
        goTo("login");
      }

      return () => subscription.unsubscribe();
    })();
  }, []);

  const handleSupabaseUser = async (user) => {
    try {
      const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || '';
      const name = user.user_metadata?.full_name || user.user_metadata?.name || 'Friend';
      // Upsert user in our own users table
      const { data: dbUser } = await supabase.from('users').upsert({
        google_id: user.id,
        email: user.email,
        name,
        avatar_url: avatar,
      }, {onConflict:'google_id'}).select().single();
      const uid = user.id;
      localStorage.setItem('sq_user_id', uid);
      localStorage.setItem('sq_user_name', name);
      localStorage.setItem('sq_user_avatar', avatar);
      setUserAvatar(avatar);
      setAuthUser({ picture: avatar, name });
      setUserId(uid);
      await bootFromSupabase(uid, name);
    } catch(e) {
      bootFromStorage();
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) { bootFromStorage(); return; }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const handleGoogleCallback = null; // not used with Supabase auth

  const bootFromSupabase = async (uid, googleName) => {
    const [dbProfile, dbSess, dbXpVal] = await Promise.all([
      dbGetProfile(uid),
      dbGetSessions(uid),
      dbGetXp(uid),
    ]);

    // One-time migration: push any localStorage sessions to Supabase
    const migrated = localStorage.getItem('sq_migrated');
    if (!migrated) {
      try {
        const localSessions = await load("sessions") || {};
        const localXp = await load("xp") || 0;
        const dbSessionDates = Object.keys(dbSess||{});
        const toMigrate = Object.entries(localSessions).filter(([date]) => !dbSessionDates.includes(date));
        if (toMigrate.length > 0) {
          await Promise.all(toMigrate.map(([,session]) => dbSaveSession(uid, session)));
          // Merge migrated sessions into dbSess
          toMigrate.forEach(([date, session]) => { if(dbSess) dbSess[date] = session; });
        }
        // Migrate XP if higher locally
        if (localXp > (dbXpVal||0)) await dbSaveXp(uid, localXp);
        localStorage.setItem('sq_migrated', '1');
      } catch(e) {
        // Migration failed silently — will retry next boot
      }
    }

    setSessions(dbSess||{});
    setXp(dbXpVal||0);
    // Check yesterday's session
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yDate = yesterday.toLocaleDateString('en-CA');
    if (dbSess && dbSess[yDate]) setYesterdaySession(dbSess[yDate]);
    // Pick daily affirmation
    const dayIdx = new Date().getDate() % 10;
    setAffirmation(AFFIRMATIONS[lang]?.[dayIdx] || AFFIRMATIONS.EN[0]);
    if (dbProfile) {
      const p = { name: googleName||dbProfile.name||'Friend', dob: dbProfile.dob, lifePath: dbProfile.life_path, values: dbProfile.values||[], valueDepth: dbProfile.value_depth||{} };
      setProfile(p);
      setLang(dbProfile.lang||'EN');
      setWheelRatings(dbProfile.wheel_of_life||{});
      if (dbProfile.values?.length) {
        // Has session today and profile — show yesterday check first
        const alreadyAnsweredToday = localStorage.getItem('sq_yesterday_answered') === new Date().toLocaleDateString("en-CA");
      if (dbSess[new Date(Date.now()-86400000).toLocaleDateString('en-CA')] && !alreadyAnsweredToday) {
        setShowYesterday(true);
      }
      }
      goTo("checkin");
    } else {
      // New user — set name from Google
      setProfile({ name: googleName||'Friend', values: [], valueDepth: {} });
      goTo("onboarding");
    }
  };

  const bootFromStorage = async () => {
    const p=await load("profile"), s=await load("sessions")||{};
    const savedXp=await load("xp")||0;
    setSessions(s); setXp(savedXp);
    const dayIdx = new Date().getDate() % 10;
    setAffirmation(AFFIRMATIONS[lang]?.[dayIdx] || AFFIRMATIONS.EN[0]);
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yDate = yesterday.toLocaleDateString('en-CA');
    if (s && s[yDate]) setYesterdaySession(s[yDate]);
    if(p){setProfile(p);setLang(p.lang||"EN");goTo("checkin");}
    else if(supabase) goTo("login");     
    else goTo("onboarding");
  };

  useEffect(()=>{
    const timer = setTimeout(()=>{ if(screen==="boot") goTo("login"); }, 3000);
    return ()=>clearTimeout(timer);
  },[screen]);

  const addXp = async (pts) => {
    setXp(prev => {
      const next = prev + pts;
      if (userId) dbSaveXp(userId, next);
      else save("xp", next);
      const milestones = [1000,2000,5000];
      const crossed = milestones.find(m => prev < m && next >= m);
      if (crossed) {
        const msgs = {
          1000: { en: "🔥 1,000 sparks — your flame is lit.", ru: "🔥 1 000 искр — твоё пламя зажглось.", es: "🔥 1,000 chispas — tu llama está encendida." },
          2000: { en: "✨ 2,000 sparks — you're burning brighter.", ru: "✨ 2 000 искр — ты светишь ярче.", es: "✨ 2,000 chispas — brillas con más fuerza." },
          5000: { en: "🌟 5,000 sparks — you are the light.", ru: "🌟 5 000 искр — ты и есть свет.", es: "🌟 5,000 chispas — tú eres la luz." },
        };
        const key = lang==="RU"?"ru":lang==="ES"?"es":"en";
        setXpMilestone(msgs[crossed][key]);
        setTimeout(()=>setXpMilestone(null), 4000);
      }
      return next;
    });
  };

  // ── VALUES CHALLENGE ──
  const startValChallenge = async (vals, ctx) => {
    setVcContext(ctx); setVcScenarios([]); setVcIdx(0); setVcAnswers([]); setVcResult(null); setVcLoading(true);
    setShowValChallenge(true);
    try {
      const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,system:VALUES_CHALLENGE_SYSTEM(lang,vals.length?vals:VALUES_LIST.slice(0,10)),messages:[{role:"user",content:"Generate the values challenge now."}]})});
      const data=await res.json();
      const clean=(data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      setVcScenarios(parsed.scenarios||[]);
    } catch { setVcScenarios(fbScenarios(vals)); }
    setVcLoading(false);
  };

  const handleVcAnswer = (optionIdx) => {
    const newAnswers=[...vcAnswers,{scenario:vcScenarios[vcIdx]?.situation,reveals:vcScenarios[vcIdx]?.options[optionIdx]?.reveals||[]}];
    setVcAnswers(newAnswers);
    if(vcIdx+1>=vcScenarios.length) generateVcResult(newAnswers);
    else setVcIdx(i=>i+1);
  };

  const generateVcResult = async (answers) => {
    setVcLoading(true);
    const summary=answers.map((a,i)=>`Scenario ${i+1}: "${a.scenario}" → chose option revealing: ${a.reveals.join(", ")}`).join("\n");
    const userVals=(vcContext==="onboarding"?selValues:profile?.values)||[];
    try {
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:VALUES_RESULT_SYSTEM(lang),
          messages:[{role:"user",content:`Selected values: ${userVals.join(", ")||"not yet selected"}\nChallenge answers:\n${summary}\nGenerate the reflection.`}]})});
      const data=await res.json();
      const clean=(data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
      setVcResult(JSON.parse(clean));
    } catch { setVcResult(fbVcResult(answers)); }
    setVcLoading(false);
  };

  const fbScenarios = (vals) => [
    {situation:"You're offered a well-paying role that conflicts with your beliefs. Security vs. alignment.",options:[{text:"Take it — security matters now",reveals:["Abundance"]},{text:"Decline — alignment matters more",reveals:["Integrity","Purpose"]},{text:"Negotiate conditions",reveals:["Courage","Wisdom"]}]},
    {situation:"A close friend needs you urgently, but you have an important personal deadline.",options:[{text:"Drop everything for them",reveals:["Love","Connection"]},{text:"Finish first, then show up",reveals:["Growth","Integrity"]},{text:"Find a middle path",reveals:["Wisdom","Service"]}]},
    {situation:"You discover a colleague took credit for your work.",options:[{text:"Speak up directly",reveals:["Honesty","Courage"]},{text:"Let it go",reveals:["Peace"]},{text:"Address it privately",reveals:["Honesty","Wisdom"]}]},
    {situation:"You're exhausted but your team needs extra help this week.",options:[{text:"Push through — loyalty first",reveals:["Service","Family"]},{text:"Protect your energy",reveals:["Health","Authenticity"]},{text:"Help honestly within limits",reveals:["Service","Honesty"]}]},
    {situation:"You have a chance to take a big risk that could change everything.",options:[{text:"Go for it — life is short",reveals:["Courage","Adventure"]},{text:"Wait until conditions are better",reveals:["Wisdom","Peace"]},{text:"Take a small first step",reveals:["Growth","Integrity"]}]},
  ];

  const fbVcResult = (answers) => {
    const counts={};
    answers.forEach(a=>a.reveals.forEach(r=>counts[r]=(counts[r]||0)+1));
    const top=Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(e=>e[0]);
    return {revealed:top,reflection:"Your choices reveal that under pressure, you consistently prioritize what truly grounds you — even when it's not what you expected. That's worth paying attention to.",alignment:"There may be a gap between the values you aspire to and the ones that actually guide you in the moment. Both are real — and both deserve your attention."};
  };

  // ── ONBOARDING ──
  const buildDob = (y,m,d) => (y&&m&&d) ? `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}` : null;

  const saveProfile = async () => {
    const dob = buildDob(dobYear, dobMonth, dobDay);
    const lp=dob?calcLifePath(dob):null;
    const p={name:nameInput.trim()||"Friend",dob:dob||null,lifePath:lp,values:selValues,lang,createdAt:new Date().toISOString()};
    setProfile(p);
    if (userId) {
      await dbSaveProfile(userId, { dob:dob||null, life_path:lp, values:selValues, value_depth:{}, lang });
    } else {
      await save("profile",p);
    }
    setShowValChallenge(false); goTo("checkin");
  };

  // ── CHECKIN ──
  const toggleCheckin=(i)=>setCheckinSel(prev=>prev.includes(i)?prev.filter(x=>x!==i):prev.length<2?[...prev,i]:prev);

  const proceedCheckin=()=>{
    const ids=checkinSel.map(i=>CHECKIN_SUGGEST[i]);
    const counts={};ids.forEach(id=>counts[id]=(counts[id]||0)+1);
    const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0];
    setSuggested(top?top[0]:null);
    if(sessions[today]){setShowOverwrite(true);setPendingNavigate(true);}
    else goTo("challenges");
  };

  // ── QUEST ──
  const handleBackInQuest = () => {
  if(qCount<=1){ goTo("challenges"); }
  else{
    const prevConv=conv.slice(0,-1);
    setConv(prevConv);
    setQCount(q=>q-1);
    setSel([]);
    setFreeText("");
    setCurrentQ({question:prevConv[prevConv.length-1].q,options:currentQ?.options,phase:prevConv[prevConv.length-1].phase});
  }
};
  const startGame=async(c)=>{
    setChallenge(c);setConv([]);setQCount(0);setPlan(null);
    setSel([]);setCurrentQ(null);setReadiness(null);
    setFirstStep(null);setStepOpts([]);setReflection("");setReflSaved(false);
    goTo("playing");setLoading(true);
    const ctx=checkinSel.map(i=>checkinOpts[i]).join("; ");
    const vals=profile?.values?.length?`Core values: ${profile.values.join(", ")}.`:"";
    const prompt=`User: ${profile?.name}. Check-in: "${ctx}". ${vals} Challenge: "${c.labelEN}" — ${c.descEN}. Ask Q1. Max 15 words. Warm and direct. ${c.id==="good"?"Focus on what's working and what to deepen.":c.id==="challenge"?"Challenge a belief or assumption. Be provocative.":""}`;
    await callAI([{role:"user",content:prompt}],false,0);
  };

  const toggleSel=(i)=>setSel(prev=>prev.includes(i)?prev.filter(x=>x!==i):prev.length<2?[...prev,i]:prev);

  const handleContinue=async()=>{
    if((!sel.length&&!freeText.trim())||loading)return;
    const selectedAnswers=sel.map(i=>currentQ.options[i]);
    const allAnswers=freeText.trim()
      ? [...selectedAnswers, freeText.trim()]
      : selectedAnswers;
    addXp(100 + conv.length * 50);
    const aText=allAnswers.length>=2
      ? allAnswers.join(" AND ALSO: ")
      : allAnswers[0];
    const isMulti=allAnswers.length>=2;
    const newConv=[...conv,{q:currentQ.question,a:aText,phase:currentQ.phase,multi:isMulti}];
    setConv(newConv);setSel([]);setFreeText("");setLoading(true);
    const isLast=newConv.length>=3;
    const history=newConv.map(c=>`[${c.phase}] Q: ${c.q}\nA: ${c.a}${c.multi?" [multiple answers]":""}`).join("\n\n");
    const vals=profile?.values?.length?`Values on file: ${profile.values.join(", ")}. Flag if response compromises a stated value.`:"";
    const multi=isMulti?"Multiple answers — complement or contradict?":"";
    const prompt=isLast
      ?`${vals}\nChallenge: "${challenge.labelEN}"\nConversation:\n${history}\nGenerate Alex Soleil coaching plan. Name the real pattern. Fire/light archetype.`
      :`${vals}\nChallenge: "${challenge.labelEN}"\nConversation:\n${history}\n${multi}\nQ${newConv.length+1} of 3. ${newConv.length===1?"Deepen — reference Q1. Find pattern.":"Identity level — who are they being."} Max 15 words.`;
    await callAI([{role:"user",content:prompt}],isLast,newConv.length);
  };

  const callAI=async(messages,isFinal,depth)=>{
    try{
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1400,system:SYSTEM(lang),messages})});
      const data=await res.json();
      const clean=(data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      if(parsed.type==="plan"){setPlan(parsed);goTo("readiness");}
      else{setCurrentQ(parsed);setQCount(depth+1);}
    }catch{
      if(isFinal){setPlan(fbPlan());goTo("readiness");}
      else{setCurrentQ(fbQ(depth));setQCount(depth+1);}
    }
    setLoading(false);
  };

  const handleReadiness=async(r)=>{
    setReadiness(r);setLoading(true);
    const tone=r>=7?"high commitment — bold concrete":r>=4?"some ambivalence — gentle exploratory":"low — one tiny micro-step";
    try{
      const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:500,system:SYSTEM(lang),
          messages:[{role:"user",content:`Readiness: ${r}/10 (${tone}). Insight: "${plan?.insight}". Generate 4 first step options calibrated to readiness. JSON only: {"options":["a","b","c","d"]}`}]})});
      const data=await res.json();
      const clean=(data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
      setStepOpts(JSON.parse(clean).options||fbSteps(r));
    }catch{setStepOpts(fbSteps(r));}
    setLoading(false);
  };

  const doSave=async()=>{
    const entry={date:today,challenge:lang==="RU"?challenge?.labelRU:lang==="ES"?challenge?.labelES:challenge?.labelEN,challenge_emoji:challenge?.emoji,plan,reflection,readiness,first_step:firstStep!==null?stepOpts[firstStep]:null,saved_at:new Date().toISOString()};
    const updated={...sessions,[today]:entry};
    setSessions(updated);
    if (userId) {
      await dbSaveSession(userId, entry);
    } else {
      await save("sessions",updated);
    }
    addXp(300);
    setReflSaved(true);
  };

  // Who Am I saves
  const saveEditedValues=async()=>{
    const u={...profile,values:editVals};
    setProfile(u);
    if (userId) await dbSaveProfile(userId, { values:editVals });
    else await save("profile",u);
    setEditingValues(false);
  };
  const saveEditedProfile=async()=>{
    const dob = buildDob(editDobYear,editDobMonth,editDobDay) || profile.dob;
    const lp=dob?calcLifePath(dob):profile.lifePath;
    const u={...profile,name:editName||profile.name,dob,lifePath:lp};
    setProfile(u);
    if (userId) await dbSaveProfile(userId, { dob, life_path:lp, name:editName||profile.name });
    else await save("profile",u);
    setEditingProfile(false);
  };

  const saveWheelRatings = async (ratings) => {
    setWheelRatings(ratings);
    if (userId) await dbSaveProfile(userId, { wheel_of_life: ratings });
    else {
      const u={...profile, wheelOfLife:ratings};
      setProfile(u); await save("profile",u);
    }
  };

  const fbQ=(d)=>[
    {question:"What's really at stake for you right now?",options:["My sense of who I'm becoming","I'm tired of the same cycle","Someone I care about is affected","I know I'm capable of more"],depth_label:"What's at stake",phase:"opening"},
    {question:"Where else does this show up in your life?",options:["In how I show up in relationships","In how I make decisions at work","In how I treat myself","In how I handle change"],depth_label:"The pattern",phase:"deepening"},
    {question:"What's hard to admit?",options:["Part of me benefits from staying here","I'm afraid of what success demands","I don't believe I deserve what I want","I've been waiting for permission"],depth_label:"The real thing",phase:"edge"},
  ][Math.min(d,2)];

  const fbPlan=()=>({type:"plan",title:"The Return",insight:"You already know what needs to change — what's missing is permission to trust that knowing.",practices:[{name:"Name the pattern",what:"Each morning write: 'The story I'm telling myself today is...' — just notice",why:"You can't change what you can't see.",first_step:"Write that sentence right now."},{name:"Bet on yourself",what:"Do one thing your stuck self would talk you out of",why:"Evidence is built through action, not thought.",first_step:"Name the one thing. Write it down."},{name:"Close one loop",what:"Pick one thing you've been tolerating and decide",why:"Tolerations drain the energy you need for what matters.",first_step:"Name what you're tolerating right now."}],challenge:"If you stripped away what you were told to want — what would remain?",archetype:"The Persistent Ember",celebration:"Showing up and answering honestly — that's exactly what most people never do."});
  const fbSteps=(r)=>r>=7?["Tell one person what I'm committing to today","Block time this week to start","Write down the one thing I will stop doing","Take the action I've been postponing — today"]:r>=4?["Sit with this for 24 hours","Write one sentence about what I want to feel different","Have one honest conversation I've been avoiding","Identify what would move the needle"]:["Just notice — no action required yet","Write one word for how I want to feel","Do one thing today that's purely for me","Read this plan again tomorrow morning"];

  const phaseLabel={opening:lang==="RU"?"Начало":"Opening",deepening:lang==="RU"?"Глубже":"Going deeper",edge:lang==="RU"?"Настоящее":"The real thing"};
  const progress=Math.round((qCount/3)*100);

  const L=(en,ru,es)=>lang==="RU"?ru:lang==="ES"?(es!==undefined?es:en):en;

  // ── STYLES ──
  const css=`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Fraunces:ital,wght@0,300;0,600;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    .up{animation:up 0.45s cubic-bezier(.16,1,.3,1) both}
    .d1{animation-delay:.04s}.d2{animation-delay:.1s}.d3{animation-delay:.17s}.d4{animation-delay:.24s}.d5{animation-delay:.31s}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
    .dot{display:inline-block;animation:blink 1.4s ease-in-out infinite}.dot2{animation-delay:.2s}.dot3{animation-delay:.4s}
    .pbtn{background:#d4a359;color:#0c0c10;border:none;border-radius:10px;padding:11px 22px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .18s;}
    .pbtn:hover{background:#ddb96a;transform:translateY(-1px)}.pbtn:disabled{opacity:.35;cursor:default;transform:none;}
    .gbtn{background:transparent;color:rgba(240,236,228,.4);border:0.5px solid rgba(255,255,255,.1);border-radius:10px;padding:9px 16px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .18s;}
    .gbtn:hover{color:#f0ece4;border-color:rgba(255,255,255,.22)}
    .tbtn{background:transparent;color:rgba(240,236,228,.32);border:none;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;padding:4px 0;transition:color .15s;}
    .tbtn:hover{color:rgba(240,236,228,.7)}
    .ntab{padding:5px 10px;border-radius:7px;font-size:12px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all .15s;white-space:nowrap;}
    .ntab.on{background:rgba(212,163,89,.12);color:#d4a359;}.ntab.off{background:transparent;color:rgba(212,163,89,.45);}.ntab.off:hover{color:rgba(212,163,89,.8);}
    .ltab{padding:4px 9px;border-radius:6px;font-size:11px;cursor:pointer;border:0.5px solid;font-family:'DM Sans',sans-serif;transition:all .15s;}
    .ltab.on{background:rgba(212,163,89,.15);border-color:#d4a359;color:#d4a359;font-weight:500;}
    .ltab.off{background:transparent;border-color:rgba(255,255,255,.1);color:rgba(240,236,228,.3);}
    .ltab.off:hover{border-color:rgba(255,255,255,.22);color:rgba(240,236,228,.55);}
    .pill{display:inline-flex;align-items:center;background:rgba(255,255,255,.05);border:0.5px solid rgba(255,255,255,.09);border-radius:20px;padding:3px 10px;font-size:12px;color:rgba(240,236,228,.5);}
    .pill.gold{background:rgba(212,163,89,.12);border-color:rgba(212,163,89,.25);color:#d4a359;}
    .obtn{width:100%;background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.08);border-radius:11px;padding:12px 14px;color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;text-align:left;transition:all .18s;line-height:1.5;}
    .obtn:hover{background:rgba(212,163,89,.08);border-color:rgba(212,163,89,.3);}.obtn.sel{background:rgba(212,163,89,.13);border-color:#d4a359;}
    .vcard{background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.08);border-radius:9px;padding:10px 11px;cursor:pointer;transition:all .18s;text-align:left;position:relative;}
    .vcard:hover{border-color:rgba(212,163,89,.3);}.vcard.sel{background:rgba(212,163,89,.1);border-color:rgba(212,163,89,.4);}
    .pcard{background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.08);border-radius:13px;padding:17px;margin-bottom:9px;position:relative;overflow:hidden;}
    .pcard::before{content:'';position:absolute;top:0;left:0;right:0;height:1.5px;background:linear-gradient(90deg,#d4a359,transparent);}
    .ratingbtn{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.1);color:rgba(240,236,228,.5);font-family:'DM Sans',sans-serif;font-size:12px;cursor:pointer;transition:all .18s;display:flex;align-items:center;justify-content:center;}
    .ratingbtn:hover{border-color:rgba(212,163,89,.4);color:#f0ece4;}.ratingbtn.on{background:rgba(212,163,89,.18);border-color:#d4a359;color:#d4a359;font-weight:500;}
    .bar{height:2px;background:rgba(255,255,255,.07);border-radius:2px;overflow:hidden;margin-bottom:30px;}
    .barfill{height:100%;background:#d4a359;border-radius:2px;transition:width .6s cubic-bezier(.16,1,.3,1);}
    .calentry{background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.08);border-radius:12px;padding:13px 15px;margin-bottom:7px;cursor:pointer;transition:all .15s;}
    .calentry:hover{border-color:rgba(212,163,89,.25);}.calentry.open{border-color:rgba(212,163,89,.3);}
    .calday{width:100%;aspect-ratio:1;border-radius:7px;background:transparent;border:0.5px solid transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;font-size:12px;color:rgba(240,236,228,.32);transition:all .15s;position:relative;}
    .calday:hover{background:rgba(255,255,255,.04);color:rgba(240,236,228,.7);}
    .calday.has{color:#f0ece4;border-color:rgba(212,163,89,.2);}.calday.today{color:#d4a359;font-weight:500;}.calday.picked{background:rgba(212,163,89,.15);border-color:#d4a359;color:#d4a359;}
    .dot-ind{width:4px;height:4px;border-radius:50%;background:#d4a359;position:absolute;bottom:3px;}
    .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
    .modal{background:#16161e;border:0.5px solid rgba(255,255,255,.1);border-radius:16px;padding:22px;max-width:400px;width:100%;}
    textarea{background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.1);border-radius:11px;padding:13px;color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.65;resize:none;width:100%;outline:none;transition:border-color .18s;}
    textarea:focus{border-color:rgba(212,163,89,.4);}textarea::placeholder{color:rgba(240,236,228,.2);}
    input[type=text],input[type=date]{background:rgba(255,255,255,.05);border:0.5px solid rgba(255,255,255,.1);border-radius:9px;padding:10px 13px;color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;width:100%;transition:border-color .18s;}
    input:focus{border-color:rgba(212,163,89,.4);}input::placeholder{color:rgba(240,236,228,.2);}
    input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.6);}
    .vsrow{display:grid;grid-template-columns:1fr 1fr;border:0.5px solid rgba(255,255,255,.08);border-radius:11px;overflow:hidden;margin-bottom:9px;}
    .vscol{padding:12px 14px;}.vscol.us{border-left:0.5px solid rgba(255,255,255,.08);background:rgba(212,163,89,.05);}
    .vc-opt{width:100%;background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.08);border-radius:10px;padding:11px 14px;color:#f0ece4;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;text-align:left;transition:all .18s;line-height:1.5;margin-bottom:7px;}
    .vc-opt:hover{background:rgba(212,163,89,.08);border-color:rgba(212,163,89,.3);}
  `;

  // ── VALUES CHALLENGE MODAL ──
  const ValuesChallenge = () => (
    <div className="modal-bg" onClick={()=>setShowValChallenge(false)}>
      <div className="modal" style={{maxWidth:480,maxHeight:"80vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        {vcLoading&&!vcScenarios.length ? (
          <p style={{color:"rgba(240,236,228,.4)",fontSize:14,textAlign:"center",padding:"30px 0"}}>{L("Generating your challenge","Создаю испытание","Generando tu desafío")}<span className="dot">.</span><span className="dot dot2">.</span><span className="dot dot3">.</span></p>
        ) : vcResult ? (
          <div>
            <p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>{L("Your values under pressure","Твои ценности под давлением","Tus valores bajo presión")}</p>
            <div style={{background:"rgba(212,163,89,.07)",border:"0.5px solid rgba(212,163,89,.18)",borderRadius:12,padding:"14px 16px",marginBottom:14}}>
              <p style={{fontSize:12,color:"rgba(240,236,228,.4)",marginBottom:8}}>{L("Values that showed up strongest:","Ценности, которые проявились сильнее всего:","Valores que se mostraron con más fuerza:")}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
                {vcResult.revealed?.map(v=><span key={v} style={{background:"rgba(212,163,89,.15)",border:"0.5px solid #d4a359",borderRadius:20,padding:"4px 12px",fontSize:13,color:"#d4a359"}}>{valLabel(v)}</span>)}
              </div>
              <p style={{fontSize:14,lineHeight:1.65,color:"rgba(240,236,228,.82)",fontStyle:"italic",marginBottom:10}}>"{vcResult.reflection}"</p>
              <p style={{fontSize:13,color:"rgba(240,236,228,.55)",lineHeight:1.6}}>{vcResult.alignment}</p>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {vcContext==="onboarding" && <button className="pbtn" style={{fontSize:13,padding:"9px 18px"}} onClick={()=>{setShowValChallenge(false);}}>{L("Continue with my values →","Продолжить с моими ценностями →","Continuar con mis valores →")}</button>}
              <button className="gbtn" style={{fontSize:13}} onClick={()=>{setVcIdx(0);setVcAnswers([]);setVcResult(null);startValChallenge(vcContext==="onboarding"?selValues:profile?.values||[],vcContext);}}>{L("Retake","Пройти снова","Repetir")}</button>
              <button className="gbtn" style={{fontSize:13}} onClick={()=>setShowValChallenge(false)}>{L("Close","Закрыть","Cerrar")}</button>
            </div>
          </div>
        ) : vcScenarios.length>0 ? (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".08em"}}>{L("Values Challenge","Испытание ценностей","Desafío de Valores")} · {vcIdx+1}/{vcScenarios.length}</p>
              <button className="tbtn" onClick={()=>setShowValChallenge(false)}>✕</button>
            </div>
            <div style={{height:2,background:"rgba(255,255,255,.07)",borderRadius:2,marginBottom:18,overflow:"hidden"}}>
              <div style={{height:"100%",background:"#d4a359",width:`${((vcIdx)/vcScenarios.length)*100}%`,transition:"width .4s ease"}}/>
            </div>
            <p style={{fontSize:15,lineHeight:1.65,color:"rgba(240,236,228,.85)",marginBottom:18}}>{vcScenarios[vcIdx]?.situation}</p>
            {vcScenarios[vcIdx]?.options?.map((opt,i)=>(
              <button key={i} className="vc-opt" onClick={()=>handleVcAnswer(i)}>
                <span style={{color:"rgba(240,236,228,.3)",marginRight:8,fontSize:12}}>{String.fromCharCode(65+i)}.</span>{opt.text}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );

  // ── OVERWRITE MODAL ──
  const OverwriteModal = () => (
    <div className="modal-bg">
      <div className="modal">
        <p style={{fontFamily:"Fraunces,serif",fontSize:17,fontWeight:600,marginBottom:10,lineHeight:1.3}}>{L("You already have a practice saved for today.","У тебя уже есть практика за сегодня.","Ya tienes una práctica guardada para hoy.")}</p>
        <p style={{fontSize:14,color:"rgba(240,236,228,.55)",lineHeight:1.6,marginBottom:20}}>{L("Starting a new quest will replace it. Are you sure?","Новый квест заменит её. Продолжить?","Iniciar un nuevo quest la reemplazará. ¿Continuar?")}</p>
        <div style={{display:"flex",gap:9}}>
          <button className="pbtn" style={{fontSize:13,padding:"9px 18px"}} onClick={()=>{setShowOverwrite(false);setPendingNavigate(false);goTo("challenges");}}>{L("Yes, continue","Да, продолжить","Sí, continuar")}</button>
          <button className="gbtn" style={{fontSize:13}} onClick={()=>{setShowOverwrite(false);setPendingNavigate(false);setTab("practices");goTo("practices");}}>{L("View my practice","Смотреть практику","Ver mi práctica")}</button>
        </div>
      </div>
    </div>
  );

  // ── TOOLTIP MODAL ──
  const TooltipModal = () => tooltipVal ? (
    <div className="modal-bg" onClick={()=>setTooltipVal(null)}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".06em",marginBottom:6}}>{L(`Honoring ${tooltipVal}`,`Как чтить "${valLabel(tooltipVal)}"`)}</p>
        <p style={{fontSize:15,fontWeight:500,color:"#f0ece4",marginBottom:4}}>{valLabel(tooltipVal)}</p>
        <p style={{fontSize:13,color:"rgba(240,236,228,.5)",lineHeight:1.5,marginBottom:14,fontStyle:"italic"}}>{valDesc(tooltipVal)}</p>
        <p style={{fontSize:11,color:"rgba(240,236,228,.28)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>{L("What it looks like","Как это выглядит","Cómo se ve en la vida real")}</p>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
          {honorEx(tooltipVal).map((ex,i)=>(
            <div key={i} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
              <span style={{color:"#d4a359",fontSize:11,marginTop:3,flexShrink:0}}>→</span>
              <p style={{fontSize:14,color:"rgba(240,236,228,.78)",lineHeight:1.55}}>{ex}</p>
            </div>
          ))}
        </div>
        <button className="gbtn" style={{fontSize:13}} onClick={()=>setTooltipVal(null)}>{L("Close","Закрыть","Cerrar")}</button>
      </div>
    </div>
  ) : null;

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",color:"#f0ece4",background:"#0c0c10",minHeight:"100vh"}}>
      <style>{css}</style>
      <div style={{position:"fixed",width:500,height:500,borderRadius:"50%",background:"rgba(212,163,89,.04)",filter:"blur(100px)",top:-150,right:-150,pointerEvents:"none",zIndex:0}}/>

      {showValChallenge && <ValuesChallenge/>}
      {showOverwrite && <OverwriteModal/>}
      <TooltipModal/>

      {xpMilestone && (
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#1a1410",border:"0.5px solid rgba(212,163,89,.4)",borderRadius:12,padding:"12px 20px",zIndex:300,textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
          <p style={{fontSize:14,color:"#d4a359",fontWeight:500}}>{xpMilestone}</p>
        </div>
      )}

      {/* NAV */}
      {screen!=="onboarding"&&screen!=="boot"&&screen!=="login"&&(
        <div style={{position:"sticky",top:0,zIndex:50,padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(12,12,16,.92)",backdropFilter:"blur(16px)",borderBottom:"0.5px solid rgba(255,255,255,.06)",gap:8}}>
          <span style={{fontFamily:"Fraunces,serif",fontSize:18,color:"#d4a359",fontWeight:600,flexShrink:0,letterSpacing:"-.3px"}}>Alex Soleil</span>
          <div style={{display:"flex",gap:1,flexShrink:0}}>
            {[["home","Quest"],["whoami",L("Who Am I","Кто Я","Quién Soy")],["practices",L("Practices","Практики","Prácticas")],["howto",L("How It Works","Как работает","Cómo funciona")]].map(([k,label])=>(
              <button key={k} className={`ntab ${tab===k?"on":"off"}`} onClick={()=>{setTab(k);goTo(k==="home"?"checkin":k);}}>{label}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
            {xp>0&&<span style={{background:"rgba(212,163,89,.1)",border:"0.5px solid rgba(212,163,89,.22)",borderRadius:20,padding:"2px 7px",fontSize:11,color:"#d4a359",whiteSpace:"nowrap"}}>⚡{xp.toLocaleString()}</span>}
            <div style={{position:"relative"}}>
              <button onClick={()=>setLangOpen(o=>!o)} style={{background:"rgba(255,255,255,.05)",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:7,padding:"4px 8px",color:"#f0ece4",fontFamily:"'DM Sans',sans-serif",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                {lang} <span style={{fontSize:8,opacity:.5}}>▾</span>
              </button>
              {langOpen&&(
                <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:"#1a1a24",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:10,overflow:"hidden",zIndex:200,minWidth:60}}>
                  {["EN","ES","RU"].filter(l=>l!==lang).map(l=>(
                    <button key={l} onClick={()=>{setLang(l);setLangOpen(false);}} style={{display:"block",width:"100%",background:"transparent",border:"none",padding:"8px 14px",color:"rgba(240,236,228,.7)",fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:"pointer",textAlign:"left"}}
                      onMouseEnter={e=>e.target.style.background="rgba(255,255,255,.06)"}
                      onMouseLeave={e=>e.target.style.background="transparent"}>
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {userAvatar && <img src={userAvatar} alt="" style={{width:26,height:26,borderRadius:"50%",border:"1.5px solid rgba(212,163,89,.3)"}} onError={e=>e.target.style.display='none'}/>}
          </div>
        </div>
      )}

      <div style={{maxWidth:600,margin:"0 auto",padding:"0 18px 80px",position:"relative",zIndex:1}}>

        {/* BOOT */}
        {screen==="boot"&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><p style={{color:"rgba(240,236,228,.3)",fontSize:14}}>{L("Loading","Загрузка","Cargando")}<span className="dot">.</span><span className="dot dot2">.</span><span className="dot dot3">.</span></p></div>}

        {/* LOGIN */}
        {screen==="login"&&(
          <div key={animKey} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"90vh",textAlign:"center",padding:"40px 0"}}>
            <div style={{display:"flex",justifyContent:"flex-end",width:"100%",marginBottom:40}}>
              <div style={{position:"relative"}}>
                <button onClick={()=>setLangOpen(o=>!o)} style={{background:"rgba(255,255,255,.05)",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:7,padding:"4px 10px",color:"#f0ece4",fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                  {lang} <span style={{fontSize:9,opacity:.5}}>▾</span>
                </button>
                {langOpen&&(
                  <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:"#1a1a24",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:10,overflow:"hidden",zIndex:200,minWidth:60}}>
                    {["EN","ES","RU"].filter(l=>l!==lang).map(l=>(
                      <button key={l} onClick={()=>{setLang(l);setLangOpen(false);}} style={{display:"block",width:"100%",background:"transparent",border:"none",padding:"8px 14px",color:"rgba(240,236,228,.7)",fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:"pointer",textAlign:"left"}}
                        onMouseEnter={e=>e.target.style.background="rgba(255,255,255,.06)"}
                        onMouseLeave={e=>e.target.style.background="transparent"}>
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <p className="up d1" style={{fontFamily:"Fraunces,serif",fontSize:28,fontWeight:600,color:"#d4a359",marginBottom:12,letterSpacing:"-.5px"}}>Alex Soleil</p>
            <h1 className="up d2" style={{fontFamily:"Fraunces,serif",fontSize:38,fontWeight:600,lineHeight:1.1,marginBottom:16,letterSpacing:"-1px"}}>
              {L("Find your ","Найди свою ","Encuentra tu ")}<em style={{color:"#d4a359"}}>{L("inner spark.","искру.","chispa interior.")}</em>
            </h1>
            <p className="up d3" style={{fontSize:15,lineHeight:1.75,color:"rgba(240,236,228,.52)",marginBottom:44,maxWidth:360}}>{L("A daily coaching practice that starts from the inside out.","Ежедневная коучинговая практика, которая начинается изнутри.","Una práctica de coaching diaria que empieza desde adentro.")}</p>
            <div className="up d4" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
              <button onClick={signInWithGoogle} style={{background:"white",color:"#333",border:"none",borderRadius:8,padding:"12px 24px",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:10,width:280,justifyContent:"center"}}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
                Continue with Google
              </button>
              <button className="tbtn" onClick={()=>bootFromStorage()}>
                {L("Continue without signing in →","Продолжить без входа →","Continuar sin iniciar sesión →")}
              </button>
            </div>
          </div>
        )}

        {/* ONBOARDING */}
        {screen==="onboarding"&&(
          <div key={animKey} style={{paddingTop:48}}>
            <div style={{display:"flex",gap:4,justifyContent:"flex-end",marginBottom:18}}>
              <div style={{position:"relative"}}>
                <button onClick={()=>setLangOpen(o=>!o)} style={{background:"rgba(255,255,255,.05)",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:7,padding:"4px 10px",color:"#f0ece4",fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
                  {lang} <span style={{fontSize:9,opacity:.5}}>▾</span>
                </button>
                {langOpen&&(
                  <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:"#1a1a24",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:10,overflow:"hidden",zIndex:200,minWidth:60}}>
                    {["EN","ES","RU"].filter(l=>l!==lang).map(l=>(
                      <button key={l} onClick={()=>{setLang(l);setLangOpen(false);}} style={{display:"block",width:"100%",background:"transparent",border:"none",padding:"8px 14px",color:"rgba(240,236,228,.7)",fontFamily:"'DM Sans',sans-serif",fontSize:12,cursor:"pointer",textAlign:"left"}}
                        onMouseEnter={e=>e.target.style.background="rgba(255,255,255,.06)"}
                        onMouseLeave={e=>e.target.style.background="transparent"}>
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {onbStep===0&&(
              <div>
                <p className="up d1" style={{fontSize:12,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:14}}>{L("Welcome","Добро пожаловать","Bienvenida")}</p>
                <h1 className="up d2" style={{fontFamily:"Fraunces,serif",fontSize:36,fontWeight:600,lineHeight:1.1,marginBottom:14,letterSpacing:"-1px"}}>{L("Find your ","Найди свою ","Encuentra tu ")}<em style={{color:"#d4a359"}}>{L("inner spark.","искру.","chispa interior.")}</em></h1>
                <p className="up d3" style={{fontSize:15,lineHeight:1.75,color:"rgba(240,236,228,.52)",marginBottom:28}}>{L("A daily coaching practice that starts from the inside out. Before we begin, let's get to know each other.","Ежедневная коучинговая практика, которая начинается изнутри. Прежде чем начать, давай познакомимся.","Una práctica de coaching diaria que empieza desde adentro. Antes de comenzar, conozcámonos.")}</p>
                <div className="up d3" style={{marginBottom:14}}>
                  <p style={{fontSize:13,color:"rgba(240,236,228,.42)",marginBottom:7}}>{L("What's your name?","Как тебя зовут?","¿Cómo te llamas?")}</p>
                  <input type="text" placeholder={L("Your name","Твоё имя","Tu nombre")} value={nameInput} onChange={e=>setNameInput(e.target.value)}/>
                </div>
                <div className="up d4" style={{marginBottom:24}}>
                  <p style={{fontSize:13,color:"rgba(240,236,228,.42)",marginBottom:3}}>{L("Date of birth","Дата рождения","Fecha de nacimiento")} <span style={{color:"rgba(240,236,228,.22)"}}>{L("(optional)","(необязательно)","(opcional)")}</span></p>
                  <p style={{fontSize:12,color:"rgba(240,236,228,.28)",marginBottom:7,lineHeight:1.5}}>{L("Share your date of birth to receive your numerology life path.","Укажи дату рождения, чтобы узнать свой нумерологический путь.","Comparte tu fecha de nacimiento para recibir tu camino de vida numerológico.")}</p>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <DobDropdown
                      lang={lang} day={dobDay} month={dobMonth} year={dobYear}
                      onDay={setDobDay} onMonth={setDobMonth} onYear={setDobYear}
                      onClear={()=>{setDobDay("");setDobMonth("");setDobYear("");}}
                    />
                  </div>
                </div>
                <div className="up d5"><button className="pbtn" onClick={()=>setOnbStep(1)} disabled={!nameInput.trim()}>{L("Continue →","Продолжить →","Continuar →")}</button></div>
              </div>
            )}
            {onbStep===1&&(
              <div>
                <button className="tbtn" style={{marginBottom:16}} onClick={()=>setOnbStep(0)}>{L("← Back","← Назад","← Volver")}</button>
                <p className="up d1" style={{fontSize:12,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:10}}>{L("Your values","Твои ценности","Tus valores")}</p>
                <h2 className="up d2" style={{fontFamily:"Fraunces,serif",fontSize:24,fontWeight:600,marginBottom:10}}>{L("What matters most to you?","Что для тебя по-настоящему важно?","¿Qué es lo más importante para ti?")}</h2>
                <p className="up d3" style={{fontSize:14,color:"rgba(240,236,228,.48)",lineHeight:1.65,marginBottom:20}}>{L("Choose up to 5 that feel most true. Tap ↗ on any value to see how it shows up in real life.","Выбери до 5 ценностей, которые ощущаются как твои. Нажми ↗ чтобы увидеть примеры.","Elige hasta 5 que sientas más verdaderas. Toca ↗ en cualquier valor para ver ejemplos.")}</p>
                <div className="up d4" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:14}}>
                  {VALUES_LIST.map(v=>(
                    <div key={v} className={`vcard ${selValues.includes(v)?"sel":""}`} onClick={()=>{if(selValues.includes(v)){setSelValues(p=>p.filter(x=>x!==v));}else if(selValues.length<5){setSelValues(p=>[...p,v]);}}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:13,fontWeight:500,color:selValues.includes(v)?"#d4a359":"#f0ece4"}}>{valLabel(v)}</span>
                        <button style={{background:"none",border:"none",color:"rgba(212,163,89,.55)",fontSize:11,cursor:"pointer",padding:"0 0 0 3px",lineHeight:1,flexShrink:0,fontStyle:"normal"}} onClick={e=>{e.stopPropagation();setTooltipVal(v);}}>ⓘ</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                  <p style={{fontSize:12,color:"rgba(240,236,228,.28)"}}>{selValues.length} / 5 {L("selected","выбрано","seleccionados")}</p>
                  <button className="gbtn" style={{fontSize:12}} onClick={()=>startValChallenge(selValues,"onboarding")}>{L("Not sure? Test your values →","Не уверен? Проверь ценности →","¿No estás seguro? Pon a prueba tus valores →")}</button>
                </div>
                <button className="pbtn" onClick={()=>selValues.length>0&&setOnbStep(2)} disabled={selValues.length===0}>{L("Continue →","Продолжить →","Continuar →")}</button>
              </div>
            )}
            {onbStep===2&&(
              <div>
                <button className="tbtn" style={{marginBottom:16}} onClick={()=>setOnbStep(1)}>{L("← Back","← Назад","← Volver")}</button>
                <p className="up d1" style={{fontSize:12,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:10}}>{L("Wheel of Life","Колесо жизни","Rueda de la Vida")} <span style={{color:"rgba(240,236,228,.3)",fontSize:11,textTransform:"none",letterSpacing:0}}>{L("· optional","· необязательно","· opcional")}</span></p>
                <h2 className="up d2" style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600,marginBottom:10}}>{L("How are you doing in each area of life?","Как дела в каждой сфере жизни?","¿Cómo estás en cada área de vida?")}</h2>
                <p className="up d3" style={{fontSize:14,color:"rgba(240,236,228,.48)",lineHeight:1.65,marginBottom:20}}>{L("Rate each area 1–10. This helps personalize your coaching. You can always update this later in Who Am I.","Оцени каждую сферу от 1 до 10. Это помогает персонализировать коучинг. Можно обновить позже.","Evalúa cada área del 1 al 10. Esto personaliza tu coaching. Puedes actualizarlo después.")}</p>
                <div className="up d4">
                  <WheelChart ratings={wheelRatings} lang={lang} size="full"/>
                  <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:10}}>
                    {WHEEL_CATEGORIES[lang]?.map((cat,i)=>(
                      <div key={i}>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                          <p style={{fontSize:13,color:"rgba(240,236,228,.8)"}}>{cat}</p>
                          <button onClick={()=>setWheelTooltip(wheelTooltip===i?null:i)} style={{background:"none",border:"none",color:"rgba(212,163,89,.55)",fontSize:11,cursor:"pointer",padding:0,fontStyle:"normal",flexShrink:0}}>ⓘ</button>
                          <span style={{fontSize:13,color:"#d4a359",marginLeft:"auto",fontWeight:500}}>{wheelRatings[i]||"—"}</span>
                        </div>
                        {wheelTooltip===i && <p style={{fontSize:12,color:"rgba(240,236,228,.5)",lineHeight:1.55,marginBottom:6,paddingLeft:2}}>{WHEEL_DESCRIPTIONS[lang]?.[i]}</p>}
                        <div style={{display:"flex",gap:4}}>
                          {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                            <button key={n} onClick={()=>{const r={...wheelRatings,[i]:n};setWheelRatings(r);}}
                              style={{flex:1,height:22,borderRadius:4,border:"0.5px solid",cursor:"pointer",fontSize:10,fontFamily:"'DM Sans',sans-serif",
                                background:wheelRatings[i]>=n?"#d4a359":"rgba(255,255,255,.04)",
                                borderColor:wheelRatings[i]>=n?"#d4a359":"rgba(255,255,255,.1)",
                                color:wheelRatings[i]>=n?"#0c0c10":"rgba(240,236,228,.4)"}}>
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{display:"flex",gap:10,marginTop:24}}>
                  <button className="pbtn" onClick={saveProfile}>{L("Begin my practice →","Начать практику →","Comenzar mi práctica →")}</button>
                  <button className="gbtn" onClick={saveProfile}>{L("Skip for now","Пропустить","Omitir por ahora")}</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHECKIN */}
        {screen==="checkin"&&(
          <div key={animKey} style={{paddingTop:44}}>

            {/* Daily affirmation */}
            {affirmation && (
              <div className="up d1" style={{background:"rgba(212,163,89,.06)",border:"0.5px solid rgba(212,163,89,.15)",borderRadius:12,padding:"12px 16px",marginBottom:20}}>
                <p style={{fontSize:12,color:"#d4a359",textTransform:"uppercase",letterSpacing:".06em",marginBottom:5}}>{L("Your spark for today","Твоя искра на сегодня","Tu chispa de hoy")}</p>
                <p style={{fontSize:14,lineHeight:1.65,color:"rgba(240,236,228,.78)",fontStyle:"italic"}}>{affirmation}</p>
              </div>
            )}

            {/* Yesterday follow-up */}
            {showYesterday && yesterdaySession && !yesterdayAnswer && (
              <div className="up d2" style={{background:"rgba(100,80,200,.07)",border:"0.5px solid rgba(100,80,200,.18)",borderRadius:12,padding:"14px 16px",marginBottom:20}}>
                <p style={{fontSize:12,color:"rgba(160,140,220,.7)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>{L("Yesterday you worked on","Вчера ты работал над","Ayer trabajaste en")} {yesterdaySession.challengeEmoji} {yesterdaySession.challenge}</p>
                {yesterdaySession.firstStep && <p style={{fontSize:13,color:"rgba(240,236,228,.65)",marginBottom:12,lineHeight:1.55}}>{L("You committed to:","Ты взял обязательство:","Te comprometiste a:")} <em>"{yesterdaySession.firstStep}"</em></p>}
                <p style={{fontSize:13,fontWeight:500,color:"rgba(240,236,228,.85)",marginBottom:10}}>{L("How did it go?","Как это прошло?","¿Cómo te fue?")}</p>
                <div style={{display:"flex",flexDirection:"column",gap:7}}>
                  {[
                    L("I did it — felt good","Сделал — было здорово","Lo hice — se sintió bien"),
                    L("I tried but struggled","Пробовал, но было трудно","Lo intenté pero fue difícil"),
                    L("I didn't get to it","Не успел","No llegué a hacerlo"),
                    L("It led me somewhere unexpected","Это привело меня куда-то неожиданному","Me llevó a algo inesperado"),
                  ].map((opt,i)=>(
                    <button key={i} className="obtn" onClick={()=>{setYesterdayAnswer(i);localStorage.setItem('sq_yesterday_answered',today);}} style={{fontSize:13}}>
                      <span style={{color:"rgba(240,236,228,.25)",marginRight:8,fontSize:12}}>○</span>{opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {yesterdayAnswer !== null && yesterdaySession && (
              <div className="up" style={{background:"rgba(212,163,89,.06)",border:"0.5px solid rgba(212,163,89,.15)",borderRadius:12,padding:"12px 16px",marginBottom:20}}>
                <p style={{fontSize:13,color:"rgba(240,236,228,.65)",fontStyle:"italic"}}>
                  {yesterdayAnswer===0 && L("That's the spark at work. 🔥","Это и есть искра в действии. 🔥","Eso es la chispa en acción. 🔥")}
                  {yesterdayAnswer===1 && L("Trying is the practice. That counts. ✨","Попытка — это и есть практика. Это считается. ✨","Intentar es la práctica. Eso cuenta. ✨")}
                  {yesterdayAnswer===2 && L("Today is a new beginning. 🌅","Сегодня — новое начало. 🌅","Hoy es un nuevo comienzo. 🌅")}
                  {yesterdayAnswer===3 && L("The unexpected path is still a path. 💡","Неожиданный путь — всё равно путь. 💡","El camino inesperado sigue siendo un camino. 💡")}
                </p>
              </div>
            )}

            <p className="up d1" style={{fontSize:13,color:"#d4a359",marginBottom:8}}>{L(`Good ${timeOfDay()}, ${firstName}.`,`Добр${timeOfDay()==="утро"?"ое":timeOfDay()==="день"?"ый":"ый"} ${timeOfDay()}, ${firstName}.`,`Buenas ${timeOfDay()}, ${firstName}.`)}</p>
            <h2 className="up d2" style={{fontFamily:"Fraunces,serif",fontSize:26,fontWeight:600,lineHeight:1.2,marginBottom:12}}>{L("How are you feeling right now?","Как ты себя чувствуешь прямо сейчас?","¿Cómo te sientes ahora mismo?")}</h2>
            <p className="up d3" style={{fontSize:14,color:"rgba(240,236,228,.42)",lineHeight:1.65,marginBottom:22}}>{L("Take a breath. Notice what's on your mind and in your heart. Is anything bothering you, sitting heavy, or asking for attention? That feeling is your guide.","Сделай вдох. Замечай, что у тебя на уме и в сердце. Есть что-то, что давит или просит внимания? Это чувство — твой компас.","Respira. Nota lo que tienes en la mente y en el corazón. ¿Hay algo que te pese o pida atención? Ese sentimiento es tu guía.")}</p>
            <div className="up d4" style={{display:"flex",flexDirection:"column",gap:7,marginBottom:22}}>
              {checkinOpts.map((opt,i)=>(
                <button key={i} className={`obtn ${checkinSel.includes(i)?"sel":""}`} onClick={()=>toggleCheckin(i)}>
                  <span style={{color:checkinSel.includes(i)?"#d4a359":"rgba(240,236,228,.2)",marginRight:8,fontSize:12}}>{checkinSel.includes(i)?"✓":"○"}</span>{opt}
                </button>
              ))}
            </div>
            {checkinSel.length>0&&(
              <div className="up" style={{display:"flex",alignItems:"center",gap:12}}>
                <button className="pbtn" onClick={proceedCheckin}>{L("Choose my focus →","Выбрать фокус →","Elegir mi enfoque →")}</button>
                {checkinSel.length<2&&<p style={{fontSize:12,color:"rgba(240,236,228,.2)"}}>{L("or pick one more","или выбери ещё один","o elige uno más")}</p>}
              </div>
            )}
          </div>
        )}

        {/* CHALLENGES */}
        {screen==="challenges"&&(
          <div key={animKey} style={{paddingTop:40}}>
            <button className="tbtn up d1" style={{marginBottom:14}} onClick={()=>goTo("checkin")}>{L("← Back","← Назад","← Volver")}</button>
            {suggested&&(
              <div className="up d2" style={{background:"rgba(212,163,89,.07)",border:"0.5px solid rgba(212,163,89,.2)",borderRadius:12,padding:"12px 15px",marginBottom:18,display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{fontSize:15,flexShrink:0}}>✦</span>
                <div>
                  <p style={{fontSize:12,color:"#d4a359",marginBottom:3,fontWeight:500}}>{L("Based on your check-in","На основе твоего состояния","Según tu estado de hoy")}</p>
                  <p style={{fontSize:13,color:"rgba(240,236,228,.65)",lineHeight:1.55}}>
                    {L(`It seems like "${CHALLENGES.find(c=>c.id===suggested)?.labelEN}" might be the most useful place to start — but trust your instinct.`,
                       `Кажется, сегодня стоит обратить внимание на "${CHALLENGES.find(c=>c.id===suggested)?.labelRU}" — но доверяй интуиции.`,
                       `Parece que "${CHALLENGES.find(c=>c.id===suggested)?.labelES}" podría ser el mejor lugar para empezar hoy — pero confía en tu instinto.`)}
                  </p>
                </div>
              </div>
            )}
            <p className="up d3" style={{color:"rgba(240,236,228,.36)",fontSize:13,marginBottom:14}}>{L("What needs your attention today?","Что требует твоего внимания сегодня?","¿Qué necesita tu atención hoy?")}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {CHALLENGES.map((c,i)=>(
                <button key={c.id} className="up" style={{animationDelay:`${.05+i*.06}s`,background:suggested===c.id?"rgba(212,163,89,.08)":"rgba(255,255,255,.04)",border:`0.5px solid ${suggested===c.id?"rgba(212,163,89,.35)":"rgba(255,255,255,.08)"}`,borderRadius:13,padding:15,cursor:"pointer",textAlign:"left",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="none"}
                  onClick={()=>startGame(c)}>
                  <div style={{fontSize:20,marginBottom:7}}>{c.emoji}</div>
                  <div style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600,marginBottom:4,color:"#f0ece4"}}>{lang==="RU"?c.labelRU:lang==="ES"?c.labelES:c.labelEN}</div>
                  <div style={{fontSize:12,color:"rgba(240,236,228,.36)",lineHeight:1.4}}>{lang==="RU"?c.descRU:lang==="ES"?c.descES:c.descEN}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PLAYING */}
        {screen==="playing"&&(
          <div key={animKey} style={{paddingTop:40}}>
            <button className="tbtn up d1" style={{marginBottom:14}} onClick={handleBackInQuest}>{L("← Back","← Назад","← Volver")}</button>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <span style={{fontSize:13,color:"rgba(240,236,228,.34)"}}>{challenge?.emoji} {lang==="RU"?challenge?.labelRU:lang==="ES"?challenge?.labelES:challenge?.labelEN}</span>
              <span style={{fontSize:12,color:"rgba(240,236,228,.34)"}}>{L(`Q${qCount} / 3`,`В${qCount} / 3`)}</span>
            </div>
            <div className="bar"><div className="barfill" style={{width:progress+"%"}}/></div>
            {loading?(
              <div style={{paddingTop:8}}>
                <p style={{color:"rgba(240,236,228,.25)",fontSize:14,marginBottom:22,textAlign:"center"}}>{L("Going deeper","Иду глубже","Yendo más profundo")}<span className="dot">.</span><span className="dot dot2">.</span><span className="dot dot3">.</span></p>
                {[85,70,78,62].map((w,i)=><div key={i} style={{height:46,background:"rgba(255,255,255,.04)",borderRadius:10,marginBottom:7,width:w+"%"}}/>)}
              </div>
            ):currentQ&&(
              <div className="up">
                <span className="pill gold" style={{marginBottom:14,display:"inline-flex"}}>{phaseLabel[currentQ.phase]||currentQ.depth_label}</span>
                <h2 style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:600,lineHeight:1.35,marginBottom:8}}>{currentQ.question}</h2>
                <p style={{fontSize:12,color:"rgba(240,236,228,.25)",marginBottom:16}}>{L("Select up to 2 that resonate","Выбери до 2 вариантов","Selecciona hasta 2 que resuenen")}</p>
                <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>
                  {currentQ.options?.map((opt,i)=>(
                    <button key={i} className={`obtn ${sel.includes(i)?"sel":""}`} onClick={()=>toggleSel(i)} disabled={loading}>
                      <span style={{color:sel.includes(i)?"#d4a359":"rgba(240,236,228,.22)",marginRight:8,fontSize:12}}>{sel.includes(i)?"✓":"○"}</span>{opt}
                    </button>
                  ))}
                </div>
                <div style={{position:"relative",marginBottom:20}}>
                  <input
                    type="text"
                    value={freeText}
                    onChange={e=>setFreeText(e.target.value)}
                    placeholder={L("Something else on your mind...","Что-то ещё на уме...","¿Algo más en tu mente?")}
                    style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:11,padding:"12px 14px",color:"#f0ece4",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none",width:"100%",transition:"border-color .18s"}}
                    onFocus={e=>e.target.style.borderColor="rgba(212,163,89,.35)"}
                    onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.08)"}
                  />
                </div>
                <button className="pbtn" onClick={handleContinue} disabled={(sel.length===0&&!freeText.trim())||loading}>{L("Continue →","Продолжить →","Continuar →")}</button>
              </div>
            )}
          </div>
        )}

        {/* READINESS */}
        {screen==="readiness"&&plan&&(
          <div key={animKey} style={{paddingTop:40}}>
            <div className="up d1" style={{textAlign:"center",marginBottom:22}}>
              <p style={{fontSize:11,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:10}}>{new Date().toLocaleDateString(lang==="RU"?"ru-RU":"en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
  {(() => {
    const parts = plan.archetype?.split(" — ");
    const arcName = parts?.[0] || plan.archetype;
    const arcDesc = parts?.[1] || null;
    return (
      <div>
        <span className="pill" style={{fontSize:12,marginBottom:10,display:"inline-flex"}}>{L("Archetype","Архетип","Arquetipo")}: <strong style={{color:"#f0ece4",fontWeight:500,marginLeft:4}}>{arcName}</strong></span>
        {arcDesc && <p style={{fontSize:14,color:"rgba(240,236,228,.6)",lineHeight:1.6,marginTop:8,fontStyle:"italic",marginBottom:16}}>{arcDesc}</p>}
      </div>
    );
  })()}
  <div style={{background:"rgba(212,163,89,.07)",border:"0.5px solid rgba(212,163,89,.18)",borderRadius:12,padding:"15px 17px"}}>
    <p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".05em",marginBottom:7}}>{L("Your insight","Твоё озарение","Tu revelación")}</p>
    <p style={{fontSize:15,lineHeight:1.7,fontStyle:"italic",color:"rgba(240,236,228,.86)"}}>{`"${plan.insight}"`}</p>
  </div>
            </div>
            {!readiness?(
              <div className="up d2">
                <h2 style={{fontFamily:"Fraunces,serif",fontSize:21,fontWeight:600,marginBottom:8}}>{L("How ready are you to act on this?","Насколько ты готов действовать?","¿Qué tan listo estás para actuar?")}</h2>
                <p style={{fontSize:13,color:"rgba(240,236,228,.38)",marginBottom:20,lineHeight:1.6}}>{L("Be honest — there's no wrong answer.","Отвечай честно — неправильных ответов нет.","Sé honesto — no hay respuestas incorrectas.")}</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n=><button key={n} className="ratingbtn" onClick={()=>handleReadiness(n)}>{n}</button>)}
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:"rgba(240,236,228,.2)"}}>{L("Not ready","Не готов","No listo")}</span>
                  <span style={{fontSize:11,color:"rgba(240,236,228,.2)"}}>{L("Completely ready","Полностью готов","Completamente listo")}</span>
                </div>
              </div>
            ):loading?(
              <p style={{color:"rgba(240,236,228,.28)",fontSize:14}}>{L("Finding your first step","Ищу твой первый шаг","Buscando tu primer paso")}<span className="dot">.</span><span className="dot dot2">.</span><span className="dot dot3">.</span></p>
            ):(
              <div className="up">
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
                  <span className="ratingbtn on" style={{cursor:"default"}}>{readiness}</span>
                  <p style={{fontSize:13,color:"rgba(240,236,228,.45)"}}>{readiness>=7?L("You're ready. Let's make it real.","Ты готов. Давай сделаем это реальным.","Estás listo. Hagámoslo real."):readiness>=4?L("Something in you wants to move.","Что-то внутри хочет двигаться.","Algo en ti quiere moverse."):L("That's honest. One small thing is enough.","Это честно. Одного маленького шага достаточно.","Eso es honesto. Una pequeña cosa es suficiente.")}</p>
                </div>
                <h2 style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:600,marginBottom:8}}>{L("What's the first step you're willing to take?","Какой первый шаг ты готов сделать?","¿Cuál es el primer paso que estás dispuesto a dar?")}</h2>
                <p style={{fontSize:12,color:"rgba(240,236,228,.25)",marginBottom:16}}>{L("Select up to 2","Выбери до 2","Selecciona hasta 2")}</p>
                <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:22}}>
                  {stepOpts.map((opt,i)=>(
                    <button key={i} className={`obtn ${sel.includes(i)?"sel":""}`} onClick={()=>toggleSel(i)}>
                      <span style={{color:sel.includes(i)?"#d4a359":"rgba(240,236,228,.22)",marginRight:8,fontSize:12}}>{sel.includes(i)?"✓":"○"}</span>{opt}
                    </button>
                  ))}
                </div>
                {sel.length>0&&<button className="pbtn up" onClick={()=>{setFirstStep(sel[0]);setSel([]);goTo("plan");}}>{L("See my full practice →","Смотреть мою практику →","Ver mi práctica completa →")}</button>}
              </div>
            )}
          </div>
        )}

        {/* PLAN */}
        {screen==="plan"&&plan&&(
          <div key={animKey} style={{paddingTop:40}}>
            <div className="up d1" style={{textAlign:"center",marginBottom:22}}>
              <p style={{fontSize:11,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:10}}>{new Date().toLocaleDateString(lang==="RU"?"ru-RU":"en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
              <h2 style={{fontFamily:"Fraunces,serif",fontSize:28,fontWeight:600,lineHeight:1.1,marginBottom:14}}>{plan.title}</h2>
              {(() => {
                const parts = plan.archetype?.split(" — ");
                const arcName = parts?.[0] || plan.archetype;
                const arcDesc = parts?.[1] || null;
                return (
                  <div style={{textAlign:"center"}}>
                    <span className="pill" style={{fontSize:12}}>{L("Archetype","Архетип","Arquetipo")}: <strong style={{color:"#f0ece4",fontWeight:500,marginLeft:4}}>{arcName}</strong></span>
                    {arcDesc && <p style={{fontSize:13,color:"rgba(240,236,228,.45)",lineHeight:1.6,marginTop:8,fontStyle:"italic"}}>{arcDesc}</p>}
                  </div>
                );
              })()}
            </div>
            {firstStep!==null&&stepOpts[firstStep]&&(
              <div className="up d2" style={{background:"rgba(212,163,89,.07)",border:"0.5px solid rgba(212,163,89,.2)",borderRadius:12,padding:"12px 16px",marginBottom:16}}>
                <p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".05em",marginBottom:5,fontWeight:500}}>{L("Your committed first step","Твой первый шаг","Tu primer paso comprometido")}</p>
                <p style={{fontSize:14,color:"rgba(240,236,228,.82)",lineHeight:1.55}}>{stepOpts[firstStep]}</p>
              </div>
            )}
            <p className="up d2" style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(240,236,228,.26)",marginBottom:11}}>{L("Your practices","Твои практики","Tus prácticas")}</p>
            {plan.practices?.map((p,i)=>(
              <div key={i} className={`pcard up`} style={{animationDelay:`${.04+i*.09}s`}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <span style={{fontFamily:"Fraunces,serif",fontSize:15,fontWeight:600}}>{p.name}</span>
                  <span style={{color:"rgba(240,236,228,.14)",fontSize:14}}>{["◎","◈","◉"][i]}</span>
                </div>
                <p style={{fontSize:14,lineHeight:1.6,marginBottom:7}}>{p.what}</p>
                <p style={{fontSize:13,color:"rgba(240,236,228,.36)",lineHeight:1.5,marginBottom:11}}>{p.why}</p>
                <div style={{background:"rgba(212,163,89,.07)",borderRadius:8,padding:"9px 12px"}}>
                  <p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,fontWeight:500}}>{L("Begin here","Начни здесь","Empieza aquí")}</p>
                  <p style={{fontSize:13,color:"rgba(240,236,228,.7)",lineHeight:1.5}}>{p.first_step}</p>
                </div>
              </div>
            ))}
            <div className="up d4" style={{background:"rgba(100,80,200,.07)",border:"0.5px solid rgba(100,80,200,.15)",borderRadius:12,padding:"14px 16px",margin:"12px 0 10px"}}>
              <p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(160,140,220,.48)",marginBottom:7}}>{L("A question to sit with","Вопрос для размышления","Una pregunta para reflexionar")}</p>
              <p style={{fontSize:14,lineHeight:1.65,fontStyle:"italic",color:"rgba(240,236,228,.76)"}}>{`"${plan.challenge}"`}</p>
            </div>
            {plan.celebration&&<div style={{padding:"10px 0 4px 12px",borderLeft:"1.5px solid rgba(212,163,89,.18)",margin:"10px 0 20px"}}><p style={{fontSize:13,color:"rgba(240,236,228,.42)",lineHeight:1.65,fontStyle:"italic"}}>{plan.celebration}</p></div>}
            <div className="up d5">
              <p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(240,236,228,.26)",marginBottom:10}}>{L("Reflection","Рефлексия","Reflexión")}</p>
              <p style={{fontSize:13,color:"rgba(240,236,228,.36)",lineHeight:1.6,marginBottom:11}}><em>{L("Prompts if helpful: What landed for you today? What are you carrying forward? What surprised you?","Подсказки: Что тебя затронуло? Что ты уносишь с собой? Что удивило?","Si te ayuda: ¿Qué te llegó hoy? ¿Qué te llevas? ¿Qué te sorprendió?")}</em></p>
              <textarea rows={4} placeholder={L("Write your reflection here...","Запиши свои мысли здесь...","Escribe tu reflexión aquí...")} value={reflection} onChange={e=>setReflection(e.target.value)}/>
              <div style={{display:"flex",gap:9,marginTop:12,flexWrap:"wrap"}}>
                <button className="pbtn" onClick={doSave}>{reflSaved?L("Reflection updated ✓","Рефлексия обновлена ✓","Reflexión actualizada ✓"):L("Save & complete →","Сохранить и завершить →","Guardar y completar →")}</button>
                {reflSaved&&(
  <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:8,width:"100%"}}>
    <p style={{fontSize:13,color:"rgba(240,236,228,.45)",lineHeight:1.6}}>{L("What would you like to do next?","Что дальше?","¿Qué quieres hacer ahora?")}</p>
    <button className="gbtn" onClick={()=>{setTab("practices");goTo("practices");}}>{L("📋 Review my practices","📋 Посмотреть практики","📋 Revisar mis prácticas")}</button>
    <a href="https://cal.com/alexandera-zaharris-soleil/30min" target="_blank" rel="noopener noreferrer" style={{display:"block",background:"rgba(212,163,89,.1)",border:"0.5px solid rgba(212,163,89,.3)",borderRadius:10,padding:"9px 16px",fontSize:13,color:"#d4a359",textDecoration:"none",textAlign:"center"}}>✨ {L("Book a free 30-min discovery session","Записаться на бесплатную сессию","Reservar sesión de descubrimiento gratuita")}</a>
    <p style={{fontSize:14,color:"rgba(240,236,228,.5)",fontStyle:"italic",textAlign:"center",marginTop:4}}>{L("See you tomorrow 🌅","До завтра 🌅","Hasta mañana 🌅")}</p>
  </div>
)}
              </div>
            </div>
          </div>
        )}

        {/* PRACTICES / CALENDAR */}
        {screen==="practices"&&(
          <div key={animKey} style={{paddingTop:40}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600}}>{L("My Practices","Мои практики","Mis Prácticas")}</h2>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <button className="gbtn" style={{padding:"5px 10px"}} onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()-1))}>‹</button>
                <span style={{fontSize:12,color:"rgba(240,236,228,.48)",minWidth:88,textAlign:"center"}}>{calMonth.toLocaleDateString(lang==="RU"?"ru-RU":"en-US",{month:"long",year:"numeric"})}</span>
                <button className="gbtn" style={{padding:"5px 10px"}} onClick={()=>setCalMonth(new Date(calMonth.getFullYear(),calMonth.getMonth()+1))}>›</button>
              </div>
            </div>
            {(()=>{
              const yr=calMonth.getFullYear(),mo=calMonth.getMonth();
              const firstDay=new Date(yr,mo,1).getDay(),dim=new Date(yr,mo+1,0).getDate();
              const days=[]; for(let i=0;i<firstDay;i++) days.push(null); for(let d=1;d<=dim;d++) days.push(d);
              const dayLabels=lang==="RU"?["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]:["Su","Mo","Tu","We","Th","Fr","Sa"];
              return(
                <div style={{marginBottom:22}}>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:3}}>
                    {dayLabels.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:"rgba(240,236,228,.2)",padding:"3px 0"}}>{d}</div>)}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
                    {days.map((d,i)=>{
                      if(!d) return <div key={i}/>;
                      const ds=`${yr}-${String(mo+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
                      const has=!!sessions[ds],isT=ds===today;
                      return <div key={i} className={`calday ${has?"has":""} ${isT?"today":""}`}>{d}{has&&<span className="dot-ind"/>}</div>;
                    })}
                  </div>
                </div>
              );
            })()}
            {(()=>{
              const yr=calMonth.getFullYear(),mo=calMonth.getMonth();
              const list=Object.entries(sessions).filter(([d])=>{const dt=new Date(d+"T12:00");return dt.getFullYear()===yr&&dt.getMonth()===mo;}).sort((a,b)=>b[0].localeCompare(a[0]));
              if(!list.length) return <p style={{fontSize:13,color:"rgba(240,236,228,.28)",textAlign:"center",padding:"20px 0"}}>{L("Complete your first practice to see it here.","Заверши первую практику, чтобы увидеть её здесь.","Completa tu primera práctica para verla aquí.")}</p>;
              return list.map(([d,s])=>(
                <div key={d} className={`calentry ${expanded===d?"open":""}`} onClick={()=>setExpanded(expanded===d?null:d)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{fontSize:18}}>{s.challengeEmoji}</span>
                      <div>
                        <p style={{fontSize:13,fontWeight:500,color:"#f0ece4"}}>{s.challenge}</p>
                        <p style={{fontSize:11,color:"rgba(240,236,228,.28)",marginTop:2}}>{new Date(d+"T12:00").toLocaleDateString(lang==="RU"?"ru-RU":"en-US",{weekday:"short",month:"short",day:"numeric"})}</p>
                      </div>
                    </div>
                    <span style={{fontSize:12,color:"rgba(240,236,228,.28)",transition:"transform .2s",display:"inline-block",transform:expanded===d?"rotate(90deg)":"none"}}>›</span>
                  </div>
                  {expanded===d&&(
                    <div style={{marginTop:13,borderTop:"0.5px solid rgba(255,255,255,.07)",paddingTop:13}}>
                      {s.plan?.archetype&&(() => {
                        const parts = s.plan.archetype.split(" — ");
                        const arcName = parts[0];
                        const arcDesc = parts[1] || null;
                        return <div style={{marginBottom:10}}><p style={{fontSize:12,color:"rgba(240,236,228,.35)"}}>{L("Archetype","Архетип","Arquetipo")}: <span style={{color:"rgba(240,236,228,.65)"}}>{arcName}</span></p>{arcDesc&&<p style={{fontSize:12,color:"rgba(240,236,228,.4)",fontStyle:"italic",marginTop:3,lineHeight:1.5}}>{arcDesc}</p>}</div>;
                      })()}
                      {s.plan?.insight&&<div style={{background:"rgba(212,163,89,.07)",border:"0.5px solid rgba(212,163,89,.15)",borderRadius:10,padding:"12px 14px",marginBottom:14}}><p style={{fontSize:14,lineHeight:1.65,fontStyle:"italic",color:"rgba(240,236,228,.85)"}}>{`"${s.plan.insight}"`}</p></div>}
                      {s.firstStep&&<div style={{background:"rgba(212,163,89,.07)",borderRadius:8,padding:"9px 12px",marginBottom:14}}><p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>{L("First step committed","Первый шаг","Primer paso")}</p><p style={{fontSize:13,color:"rgba(240,236,228,.82)",lineHeight:1.5}}>{s.firstStep}</p></div>}
                      {s.plan?.practices?.length>0&&(
                        <div style={{marginBottom:14}}>
                          <p style={{fontSize:11,color:"rgba(240,236,228,.26)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:10}}>{L("Practices","Практики","Prácticas")}</p>
                          {s.plan.practices.map((p,i)=>(
                            <div key={i} style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:12,padding:"14px 16px",marginBottom:8,position:"relative",overflow:"hidden"}}>
                              <div style={{position:"absolute",top:0,left:0,right:0,height:"1.5px",background:"linear-gradient(90deg,#d4a359,transparent)"}}/>
                              <p style={{fontSize:14,fontWeight:500,marginBottom:6}}>{p.name}</p>
                              <p style={{fontSize:13,color:"rgba(240,236,228,.8)",lineHeight:1.6,marginBottom:6}}>{p.what}</p>
                              <p style={{fontSize:12,color:"rgba(240,236,228,.4)",lineHeight:1.5,marginBottom:10}}>{p.why}</p>
                              <div style={{background:"rgba(212,163,89,.07)",borderRadius:8,padding:"9px 12px"}}>
                                <p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4,fontWeight:500}}>{L("Begin here","Начни здесь","Empieza aquí")}</p>
                                <p style={{fontSize:13,color:"rgba(240,236,228,.75)",lineHeight:1.5}}>{p.first_step}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {s.plan?.challenge&&<div style={{background:"rgba(100,80,200,.07)",border:"0.5px solid rgba(100,80,200,.15)",borderRadius:12,padding:"13px 15px",marginBottom:14}}><p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(160,140,220,.5)",marginBottom:7}}>{L("A question to sit with","Вопрос для размышления","Una pregunta para reflexionar")}</p><p style={{fontSize:14,lineHeight:1.65,fontStyle:"italic",color:"rgba(240,236,228,.76)"}}>{`"${s.plan.challenge}"`}</p></div>}
                      {<div style={{marginBottom:4}}>   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>     <p style={{fontSize:11,color:"rgba(240,236,228,.24)",textTransform:"uppercase",letterSpacing:".06em"}}>{L("Reflection","Рефлексия","Reflexión")}</p>     <button className="tbtn" style={{fontSize:11}} onClick={e=>{e.stopPropagation();setEditingReflection(editingReflection===d?null:d);setEditReflectionText(s.reflection||"");}}>{editingReflection===d?L("Cancel","Отмена","Cancelar"):L("Edit","Изменить","Editar")}</button>   </div>   {editingReflection===d?(     <div>       <textarea rows={4} value={editReflectionText} onChange={e=>setEditReflectionText(e.target.value)} placeholder={L("Write your reflection...","Запиши мысли...","Escribe tu reflexión...")}/>       <button className="pbtn" style={{fontSize:13,padding:"8px 16px",marginTop:8}} onClick={async(e)=>{e.stopPropagation();const updated={...sessions,[d]:{...s,reflection:editReflectionText}};setSessions(updated);if(userId)await dbSaveSession(userId,{...s,reflection:editReflectionText});setEditingReflection(null);}}>         {L("Save reflection ✓","Сохранить ✓","Guardar ✓")}       </button>     </div>   ):(     <p style={{fontSize:13,color:"rgba(240,236,228,.65)",lineHeight:1.65}}>{s.reflection||<span style={{color:"rgba(240,236,228,.25)",fontStyle:"italic"}}>{L("No reflection yet — tap Edit to add one.","Нет рефлексии — нажми Изменить.","Sin reflexión — toca Editar.")}</span>}</p>   )} </div>}
                    </div>
                  )}
                </div>
              ));
            })()}
          </div>
        )}

        {/* WHO AM I */}
        {screen==="whoami"&&(
          <div key={animKey} style={{paddingTop:40}}>
            <h2 style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600,marginBottom:22}}>{L("Who Am I","Кто Я","Quién Soy")}</h2>
            {/* Profile */}
            <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:12,padding:"15px 17px",marginBottom:14}}>
              {!editingProfile?(
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div><p style={{fontSize:15,fontWeight:500,marginBottom:4}}>{profile?.name}</p>{profile?.dob&&<p style={{fontSize:13,color:"rgba(240,236,228,.38)"}}>{profile.dob}</p>}</div>
                  <button className="tbtn" onClick={()=>{
                    setEditName(profile?.name||"");
                    const parts = profile?.dob ? profile.dob.split("-") : ["","",""];
                    setEditDobYear(parts[0]||""); setEditDobMonth(parts[1]?String(parseInt(parts[1])):""); setEditDobDay(parts[2]?String(parseInt(parts[2])):"");
                    setEditingProfile(true);
                  }}>{L("Edit","Изменить","Editar")}</button>
                </div>
              ):(
                <div>
                  <input type="text" value={editName} onChange={e=>setEditName(e.target.value)} style={{marginBottom:9}} placeholder={L("Your name","Твоё имя","Tu nombre")}/>
                  <div style={{marginBottom:13}}>
                    <DobDropdown
                      lang={lang} day={editDobDay} month={editDobMonth} year={editDobYear}
                      onDay={setEditDobDay} onMonth={setEditDobMonth} onYear={setEditDobYear}
                      onClear={()=>{setEditDobDay("");setEditDobMonth("");setEditDobYear("");}}
                    />
                  </div>
                  <div style={{display:"flex",gap:7}}><button className="pbtn" style={{fontSize:13,padding:"8px 16px"}} onClick={saveEditedProfile}>{L("Save","Сохранить","Guardar")}</button><button className="gbtn" style={{fontSize:13}} onClick={()=>setEditingProfile(false)}>{L("Cancel","Отмена","Cancelar")}</button></div>
                </div>
              )}
            </div>
            {/* Values */}
            <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:12,padding:"15px 17px",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <p style={{fontSize:14,fontWeight:500}}>{L("My values","Мои ценности","Mis valores")}</p>
                <div style={{display:"flex",gap:7}}>
                  <button className="gbtn" style={{fontSize:12}} onClick={()=>startValChallenge(profile?.values||[],"whoami")}>{L("Test my values","Проверить ценности","Probar mis valores")}</button>
                  {!editingValues?<button className="tbtn" onClick={()=>{setEditVals([...(profile?.values||[])]);setEditingValues(true);}}>{L("Edit","Изменить","Editar")}</button>:<button className="tbtn" onClick={saveEditedValues}>{L("Save","Сохранить","Guardar")}</button>}
                </div>
              </div>
              {!editingValues?(
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {profile?.values?.map(v=>(
                    <button key={v} onClick={()=>setTooltipVal(tooltipVal===v?null:v)}
                      style={{background:"rgba(212,163,89,.1)",border:"0.5px solid rgba(212,163,89,.25)",borderRadius:20,padding:"5px 12px",fontSize:13,color:"#d4a359",cursor:"pointer",transition:"all .15s",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5}}>
                      {valLabel(v)}<span style={{fontSize:11,opacity:.55}}>ⓘ</span>
                    </button>
                  ))}
                </div>
              ):(
                <div>
                  <p style={{fontSize:12,color:"rgba(240,236,228,.32)",marginBottom:10}}>{selValues.length||editVals.length} / 5</p>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                    {VALUES_LIST.map(v=>(
                      <div key={v} className={`vcard ${editVals.includes(v)?"sel":""}`} onClick={()=>setEditVals(p=>p.includes(v)?p.filter(x=>x!==v):p.length<5?[...p,v]:p)}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <span style={{fontSize:12,fontWeight:500,color:editVals.includes(v)?"#d4a359":"#f0ece4"}}>{valLabel(v)}</span>
                          <button style={{background:"none",border:"none",color:"rgba(212,163,89,.5)",fontSize:11,cursor:"pointer",padding:0,lineHeight:1}} onClick={e=>{e.stopPropagation();setTooltipVal(v);}}>ⓘ</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Wheel of Life */}
            <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:12,padding:"15px 17px",marginBottom:14}}>
              <p style={{fontSize:14,fontWeight:500,marginBottom:4}}>{L("Wheel of Life","Колесо жизни","Rueda de la Vida")}</p>
              <p style={{fontSize:12,color:"rgba(240,236,228,.4)",lineHeight:1.55,marginBottom:16}}>{L("Rate each life area 1–10. This helps guide your coaching focus.","Оцени каждую сферу жизни от 1 до 10. Это помогает направить коучинг.","Evalúa cada área de vida del 1 al 10. Esto guía tu enfoque de coaching.")}</p>
              <WheelChart ratings={wheelRatings} lang={lang} size="full"/>
              <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:10}}>
                {WHEEL_CATEGORIES[lang]?.map((cat,i)=>(
                  <div key={i}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                      <p style={{fontSize:13,color:"rgba(240,236,228,.8)"}}>{cat}</p>
                      <button onClick={()=>setWheelTooltip(wheelTooltip===i?null:i)} style={{background:"none",border:"none",color:"rgba(212,163,89,.55)",fontSize:11,cursor:"pointer",padding:0,flexShrink:0}}>ⓘ</button>
                      <span style={{fontSize:13,color:"#d4a359",marginLeft:"auto",fontWeight:500}}>{wheelRatings[i]||"—"}</span>
                    </div>
                    {wheelTooltip===i && <p style={{fontSize:12,color:"rgba(240,236,228,.5)",lineHeight:1.55,marginBottom:6,paddingLeft:2}}>{WHEEL_DESCRIPTIONS[lang]?.[i]}</p>}
                    <div style={{display:"flex",gap:4}}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n=>(
                        <button key={n} onClick={()=>{const r={...wheelRatings,[i]:n};saveWheelRatings(r);}}
                          style={{flex:1,height:22,borderRadius:4,border:"0.5px solid",cursor:"pointer",fontSize:10,fontFamily:"'DM Sans',sans-serif",
                            background:wheelRatings[i]>=n?"#d4a359":"rgba(255,255,255,.04)",
                            borderColor:wheelRatings[i]>=n?"#d4a359":"rgba(255,255,255,.1)",
                            color:wheelRatings[i]>=n?"#0c0c10":"rgba(240,236,228,.4)"}}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Numerology */}
            {profile?.lifePath&&LIFE_PATH_MEANINGS[profile.lifePath]&&(
              <div style={{background:"rgba(100,80,200,.07)",border:"0.5px solid rgba(100,80,200,.15)",borderRadius:12,padding:"15px 17px",marginBottom:14}}>
                <p style={{fontSize:11,color:"rgba(160,140,220,.5)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:7}}>{L("Numerology","Нумерология","Numerología")} · {L(`Life Path ${profile.lifePath}`,`Жизненный путь ${profile.lifePath}`,`Camino de Vida ${profile.lifePath}`)}</p>
                <p style={{fontFamily:"Fraunces,serif",fontSize:17,fontWeight:600,marginBottom:7}}>{LIFE_PATH_MEANINGS[profile.lifePath][lang==="RU"?"ru":lang==="ES"?"es":"en"].title}</p>
                <p style={{fontSize:14,color:"rgba(240,236,228,.6)",lineHeight:1.65,marginBottom:8}}>{LIFE_PATH_MEANINGS[profile.lifePath][lang==="RU"?"ru":lang==="ES"?"es":"en"].desc}</p>
                <p style={{fontSize:12,color:"rgba(240,236,228,.22)"}}>{L("Full numerology guidance coming soon.","Полное руководство по нумерологии скоро.","Guía completa de numerología próximamente.")}</p>
              </div>
            )}
          </div>
        )}

        {/* HOW IT WORKS */}
        {screen==="howto"&&(
          <div key={animKey} style={{paddingTop:40}}>
            <p style={{fontSize:12,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>{L("About Soleil Quest","О Soleil Quest","Sobre Soleil Quest")}</p>
            <h2 style={{fontFamily:"Fraunces,serif",fontSize:24,fontWeight:600,lineHeight:1.2,marginBottom:14}}>{L("A daily practice for your inner world","Ежедневная практика для внутреннего мира","Una práctica diaria para tu mundo interior")}</h2>
            <p style={{color:"rgba(240,236,228,.48)",fontSize:14,marginBottom:12,lineHeight:1.7}}>{L("Most people start their day reacting — to notifications, to other people's needs, to whatever's loudest. Coaching Quest invites you to start from the inside out.","Большинство людей начинают день реагируя — на уведомления, на чужие потребности. Coaching Quest приглашает начать изнутри.","La mayoría empieza el día reaccionando — a notificaciones, a las necesidades de otros. Soleil Quest te invita a empezar desde adentro.")}</p>

            {/* Step by step */}
            <p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(240,236,228,.26)",marginBottom:14,marginTop:24}}>{L("How it works","Как это работает","Cómo funciona")}</p>
            {[
              [L("Check in","Отметься","Haz tu check-in"),L("Notice how you feel. Is anything weighing on you? That feeling is your guide.","Замечай как ты чувствуешь себя. Что-то давит? Это твой компас.","Nota cómo te sientes. ¿Algo te pesa? Ese sentimiento es tu guía.")],
              [L("Choose your focus","Выбери фокус","Elige tu enfoque"),L("Pick the challenge area that's calling you today — or let the suggestion guide you.","Выбери область, которая откликается сегодня.","Elige el área que te llama hoy — o deja que la sugerencia te guíe.")],
              [L("Go deeper","Иди глубже","Ve más profundo"),L("Answer 3 questions that peel the layers back — opening, deepening, and edge.","Ответь на 3 вопроса, которые снимают слои — открытие, углубление, суть.","Responde 3 preguntas que van quitando capas — apertura, profundización y el fondo.")],
              [L("Receive your practice","Получи практику","Recibe tu práctica"),L("A personalized set of practices built entirely from your answers.","Персональные практики, построенные из твоих ответов.","Un conjunto de prácticas personalizadas construidas desde tus respuestas.")],
              [L("Commit","Возьми обязательство","Comprométete"),L("Rate your readiness. Choose your first step. Make it real.","Оцени готовность. Выбери первый шаг. Сделай это реальным.","Evalúa tu disposición. Elige tu primer paso. Hazlo real.")],
            ].map(([title,desc],i)=>(
              <div key={i} style={{display:"flex",gap:13,alignItems:"flex-start",marginBottom:14}}>
                <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(212,163,89,.12)",border:"0.5px solid rgba(212,163,89,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#d4a359",flexShrink:0,marginTop:1}}>{i+1}</div>
                <div><p style={{fontSize:14,fontWeight:500,marginBottom:3}}>{title}</p><p style={{fontSize:13,color:"rgba(240,236,228,.5)",lineHeight:1.55}}>{desc}</p></div>
              </div>
            ))}

            <p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(240,236,228,.26)",marginBottom:20,marginTop:28}}>{L("Why this beats opening a new 'ChatGPT' chat","Почему это лучше, чем открыть новый чат в 'ChatGPT'","Por qué esto supera abrir un nuevo chat en 'ChatGPT'")}</p>
            {[
              {label:L("The blank box problem","Проблема пустого поля","El problema del campo vacío"),text:L("When you open a new chat, you face a blinking cursor and infinite possibility — which usually means you type something shallow, get a generic answer, and close the tab. Soleil Quest removes that friction entirely. It asks you first.","Когда открываешь новый чат, перед тобой мигающий курсор и бесконечные возможности — что обычно заканчивается поверхностным вопросом, общим ответом и закрытой вкладкой. Soleil Quest убирает это трение. Он спрашивает тебя первым.","Cuando abres un chat nuevo, ves un cursor parpadeante y posibilidades infinitas — lo que normalmente termina en una pregunta superficial, una respuesta genérica y la pestaña cerrada. Soleil Quest elimina esa fricción. Él te pregunta primero.")},
              {label:L("Structure does the work","Структура работает за тебя","La estructura trabaja por ti"),text:L("A blank chat is only as good as your question. Here, three layers are built in — opening, deepening, edge — and each answer shapes the next question. You go somewhere you wouldn't have gone alone.","Обычный чат настолько хорош, насколько хорош твой вопрос. Здесь встроены три слоя — открытие, углубление, суть — и каждый ответ формирует следующий вопрос. Ты попадаешь туда, куда не добрался бы в одиночку.","Un chat vacío es tan bueno como tu pregunta. Aquí hay tres capas integradas — apertura, profundización, el fondo — y cada respuesta da forma a la siguiente pregunta. Llegas a un lugar al que no habrías llegado solo.")},
              {label:L("It knows you","Он знает тебя","Te conoce"),text:L("A blank chat starts cold every time. Soleil Quest remembers your values, notices when something conflicts with them, and builds on your history. Each session is a continuation, not a restart.","Обычный чат каждый раз начинается с нуля. Soleil Quest помнит твои ценности, замечает конфликты с ними и опирается на твою историю. Каждая сессия — это продолжение, а не начало заново.","Un chat vacío empieza de cero cada vez. Soleil Quest recuerda tus valores, nota cuando algo entra en conflicto con ellos, y construye sobre tu historia. Cada sesión es una continuación, no un reinicio.")},
              {label:L("You commit before you leave","Ты берёшь обязательство перед уходом","Te comprometes antes de irte"),text:L("A blank chat gives you output. This gives you a practice, a first step you chose, and a reflection you wrote — saved by date. The difference between reading advice and living it.","Обычный чат даёт тебе результат. Здесь ты получаешь практику, первый шаг, который ты выбрал, и рефлексию, которую написал — сохранённые по дате. Разница между чтением советов и их воплощением.","Un chat vacío te da un resultado. Aquí obtienes una práctica, un primer paso que elegiste y una reflexión que escribiste — guardados por fecha. La diferencia entre leer consejos y vivirlos.")},
            ].map((r,i)=>(
              <div key={i} style={{marginBottom:12}}>
                <p style={{fontSize:13,fontWeight:500,color:"#f0ece4",marginBottom:3}}>{r.label}</p>
                <p style={{fontSize:13,color:"rgba(240,236,228,.48)",lineHeight:1.58}}>{r.text}</p>
              </div>
            ))}
            <div style={{background:"rgba(212,163,89,.05)",border:"0.5px solid rgba(212,163,89,.12)",borderRadius:13,padding:"18px",margin:"20px 0"}}>
              <p style={{fontFamily:"Fraunces,serif",fontSize:17,fontWeight:600,marginBottom:7,lineHeight:1.3}}>{L('"AI is a mirror. A coaching practice is a map."','"ИИ — это зеркало. Коучинговая практика — это карта."','"La IA es un espejo. Una práctica de coaching es un mapa."')}</p>
              <p style={{fontSize:13,color:"rgba(240,236,228,.33)",lineHeight:1.6}}>{L("One shows you what you already see. The other helps you find your inner spark.","Одно показывает то, что ты уже видишь. Другое помогает найти свою искру.","Uno te muestra lo que ya ves. El otro te ayuda a encontrar tu chispa interior.")}</p>
            </div>
            <button className="pbtn" onClick={()=>{setTab("home");setCheckinSel([]);setSuggested(null);goTo("checkin");}}>{L("Begin today's quest →","Начать сегодняшний квест →","Comenzar el quest de hoy →")}</button>
          </div>
        )}

      </div>
    </div>
  );
}
