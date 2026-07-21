import { useState, useEffect, useRef } from "react";
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
const HONORING_EXAMPLES_RU = { Freedom:["Сказать «нет» тому, что тебя не питает","Самому выстроить свой день","Уйти из ситуации, которая ощущается как клетка","Выбрать свой путь, даже если он нестандартный"],Honesty:["Сказать трудную правду с заботой","Признать, что был(а) неправ(а)","Быть прозрачным, когда проще не быть","Высказать то, что реально думаешь"],Growth:["Сделать то, что немного пугает","Попросить обратную связь и услышать","Остаться с дискомфортом, не убегая","Учиться чему-то новому просто так"],Connection:["Быть полностью присутствующим в разговоре","Написать тому, кому давно собирался","Поделиться чем-то настоящим","Впустить кого-то, когда хочется закрыться"],Courage:["Высказаться, когда молчать было бы проще","Принять решение несмотря на неопределённость","Проявить уязвимость с тем, кому доверяешь","Сделать то, что откладывал"],Peace:["Не вступить в бессмысленный спор","Создать тишину в своём дне","Отпустить то, что не в твоей власти","Лечь спать без неразрешённых обид"],Purpose:["Работать над чем-то значимым","Говорить «да» тому, что совпадает","Видеть связь между действиями и смыслом","Спрашивать себя: «Это ли моё?»"],Creativity:["Создавать что-то без оценки качества","Решать задачу неожиданным способом","Следовать за идеей просто чтобы посмотреть","Дать себе неструктурированное время"],Family:["Быть за столом без телефона","Приехать, когда это неудобно","Поговорить по-настоящему","Поставить семью выше рабочей задачи"],Adventure:["Сказать «да» чему-то незнакомому","Выбрать другой маршрут","Наконец забронировать ту поездку","Попробовать что-то впервые"],Integrity:["Сделать то, что обещал","Принять решение, которым гордишься","Исправить ошибку, даже если можно было скрыть","Совместить слова с действиями"],Joy:["Сделать что-то исключительно ради удовольствия","Смеяться не сдерживаясь","Заметить момент красоты и остановиться","Выбрать радость вместо продуктивности"],Wisdom:["Сделать паузу перед реакцией","Учиться на ошибке без самобичевания","Спросить вместо того чтобы предполагать","Делиться мудростью только когда поможет"],Service:["Помочь, не ожидая ничего взамен","Поддержать кого-то в трудный момент","Вложить свои навыки во что-то большее","Спросить «что тебе нужно?»"],Abundance:["Давать щедро, не считая","Верить, что всего достаточно","Искренне радоваться успеху другого","Принять комплимент с достоинством"],Authenticity:["Сказать то, что реально думаешь","Оставаться собой там, где могут осудить","Снять маску с тем, кому доверяешь","Сделать выбор, который твой"],Health:["Выбрать сон вместо ещё одной серии","Двигаться потому что это приятно","Есть так, чтобы уважать свою энергию","Ограничить то, что тебя истощает"],Love:["Выразить благодарность без повода","Слушать чтобы понять, а не ответить","Простить кого-то — включая себя","Проявить тепло, когда это трудно"],Solitude:["Побыть одному без чувства вины","Посидеть в тишине со своими мыслями","Прогуляться без подкаста","Защитить своё пространство как священное"],Contribution:["Предложить свои навыки там, где нужны","Сделать что-то лучше для других","Стабильно участвовать в чём-то важном","Спросить «чем я могу помочь?»"] };
const HONORING_EXAMPLES_ES = { Freedom:["Decir que no a algo que no te nutre","Diseñar tu propio horario","Salir de una situación que se siente como una jaula","Elegir tu camino aunque sea poco convencional"],Honesty:["Decir una verdad difícil con cuidado","Admitir que estabas equivocado(a)","Ser transparente cuando sería más fácil no serlo","Decir lo que realmente piensas"],Growth:["Hacer algo que te asusta un poco","Pedir retroalimentación y escucharla de verdad","Quedarte con la incomodidad en vez de evitarla","Aprender algo nuevo solo porque sí"],Connection:["Estar completamente presente en una conversación","Escribirle a alguien a quien llevas tiempo sin contactar","Compartir algo real en vez de superficial","Dejar entrar a alguien cuando prefieres cerrarte"],Courage:["Hablar cuando guardar silencio sería más fácil","Tomar una decisión a pesar de la incertidumbre","Mostrar vulnerabilidad con alguien de confianza","Hacer lo que has estado postergando"],Peace:["Elegir no entrar en una discusión sin sentido","Crear espacio de quietud en tu día","Soltar algo que no puedes controlar","Irte a dormir sin resentimientos pendientes"],Purpose:["Trabajar en algo que se siente significativo","Decir sí a lo que se alinea y no a lo que no","Conectar tus acciones diarias con un propósito mayor","Preguntarte si esto es para lo que estás aquí"],Creativity:["Crear algo sin preocuparte por si es bueno","Resolver un problema de forma inesperada","Seguir una idea solo para ver adónde lleva","Darte tiempo libre sin estructura"],Family:["Estar en la mesa sin el teléfono","Aparecer para alguien cuando es inconveniente","Tener una conversación real en vez de un check-in","Priorizar un momento familiar sobre una tarea laboral"],Adventure:["Decir sí a algo desconocido","Tomar un camino diferente","Por fin reservar ese viaje del que hablas","Probar algo por primera vez"],Integrity:["Hacer lo que dijiste que harías","Tomar una decisión de la que estés orgulloso cuando nadie mira","Corregir un error aunque pudieras ocultarlo","Alinear tus acciones con tus palabras"],Joy:["Hacer algo puramente por placer","Reírte sin contención","Notar un momento de belleza y pausar en él","Elegir la diversión sobre la productividad, aunque sea una vez"],Wisdom:["Hacer una pausa antes de reaccionar","Aprender de un error sin castigarte","Hacer una pregunta en vez de asumir","Compartir sabiduría solo cuando ayudará"],Service:["Ayudar sin esperar nada a cambio","Aparecer para alguien en un momento difícil","Contribuir tus habilidades a algo más grande","Preguntar '¿qué necesitas?' y de verdad querer saberlo"],Abundance:["Dar generosamente sin contar","Confiar en que hay suficiente","Celebrar genuinamente el éxito de otro","Recibir un cumplido con gracia"],Authenticity:["Decir lo que realmente piensas","Mostrarte como eres donde podrían juzgarte","Quitarte la máscara con alguien de confianza","Tomar una decisión que sea tuya, no de la multitud"],Health:["Elegir dormir en vez de un capítulo más","Mover tu cuerpo porque se siente bien","Comer de una manera que respete tu energía","Poner un límite a algo que te agota"],Love:["Expresar gratitud sin razón aparente","Escuchar para entender, no para responder","Perdonar a alguien — incluyéndote a ti","Aparecer con calidez cuando es difícil"],Solitude:["Tomarte tiempo a solas sin culpa","Sentarte en silencio con tus propios pensamientos","Dar un paseo solo sin podcast","Proteger tu espacio como sagrado"],Contribution:["Ofrecer tus habilidades donde se necesitan","Hacer algo mejor para los demás","Aparecer de forma constante por una causa","Preguntar '¿cómo puedo ayudar?' y seguirlo"] };

const CHALLENGES = [
  { id:"lost",          emoji:"🌅", labelEN:"I Feel Lost",           labelRU:"Я потерялся(ась)",        labelES:"Me Siento Perdido(a)",       descEN:"No direction, can't find the path",        descRU:"Нет направления, не могу найти путь",   descES:"Sin dirección, no encuentro el camino",  suggest:"lost" },
  { id:"confidence",    emoji:"⚡", labelEN:"Confidence Crisis",      labelRU:"Кризис уверенности", labelES:"Crisis de Confianza",      descEN:"Self-doubt, imposter syndrome",            descRU:"Сомнения, синдром самозванца",          descES:"Dudas, síndrome del impostor",           suggest:"confidence" },
  { id:"burnout",       emoji:"🔥", labelEN:"Burnout & Depletion",    labelRU:"Выгорание",          labelES:"Agotamiento",              descEN:"Running on empty, lost purpose",           descRU:"На пределе, потерял смысл",             descES:"Sin energía, perdido el propósito",      suggest:"burnout" },
  { id:"transition",    emoji:"🚀", labelEN:"Big Life Change",        labelRU:"Большие перемены",   labelES:"Gran Cambio de Vida",      descEN:"Pivot, reinvention, new chapter",          descRU:"Поворот, новая глава жизни",            descES:"Pivote, reinvención, nuevo capítulo",    suggest:"transition" },
  { id:"relationships", emoji:"🤝", labelEN:"People & Communication", labelRU:"Люди и общение",     labelES:"Personas y Comunicación",  descEN:"Friction, disconnection, unsaid things",   descRU:"Трения, разрыв, невысказанное",         descES:"Fricción, desconexión, cosas no dichas", suggest:"relationships" },
  { id:"leadership",    emoji:"👑", labelEN:"Leading & Influence",    labelRU:"Лидерство",          labelES:"Liderazgo e Influencia",   descEN:"Stepping up, showing up differently",      descRU:"Выйти на новый уровень",                descES:"Dar un paso adelante, mostrarte diferente", suggest:"leadership" },
  { id:"good",          emoji:"🌤️", labelEN:"I'm Good — Guide Me",   labelRU:"Всё хорошо",         labelES:"Estoy Bien — Guíame",      descEN:"Daily reflection and fresh perspective",   descRU:"Ежедневная рефлексия и свежий взгляд",  descES:"Reflexión diaria y perspectiva fresca",  suggest:"good" },
  { id:"challenge",     emoji:"💡", labelEN:"Challenge Me",           labelRU:"Брось мне вызов",    labelES:"Desafíame",                descEN:"Stress-test a belief, idea, or assumption",descRU:"Проверь идею или убеждение на прочность",descES:"Pon a prueba una creencia o idea",        suggest:"challenge" },
];

const CHECKIN_OPTS_EN = ["Excited, building momentum","Full of energy and ready to use it","Aligned and wondering what's next","Feeling good, but want to dig deeper","Something's weighing on me","I feel stuck and can't move forward","Feeling scattered, no clear direction","At a turning point, need clarity"];
const CHECKIN_OPTS_RU = ["Воодушевлён, набираю обороты","Полон энергии и готов её использовать","Всё на своём месте, что дальше?","Чувствую себя хорошо, но хочу копнуть глубже","Что-то давит на меня","Чувствую себя застрявшим, не могу двигаться","Рассеянность, нет ясного направления","На развилке, нужна ясность"];
const CHECKIN_OPTS_ES = ["Emocionado, construyendo impulso","Lleno de energía y listo para usarla","Todo alineado, ¿qué sigue?","Me siento bien, pero quiero profundizar","Algo me está pesando","Me siento atascado y no puedo avanzar","Me siento disperso, sin dirección clara","En un punto de inflexión, necesito claridad"];
const CHECKIN_SUGGEST = ["good","challenge","leadership","good","burnout","confidence","burnout","transition"];

const ARCANA_MEANINGS = {
  1: {
    name: { en: "The Magician", ru: "Маг", es: "El Mago" },
    plus: { en: "You came here to lead. There's a fire in you that doesn't wait for permission — you see what needs to be built and you build it. You adapt where others freeze, you generate ideas where others go blank, and when you step into a room with intention, people feel it. You were made for the front.", ru: "Ты рождён вести за собой. В тебе есть огонь, который не ждёт разрешения — ты видишь, что нужно создать, и создаёшь это. Ты адаптируешься там, где другие теряются, генерируешь идеи там, где другие молчат. Когда ты входишь в комнату с намерением — люди это чувствуют.", es: "Viniste aquí para liderar. Hay un fuego en ti que no espera permiso — ves lo que hay que construir y lo construyes. Te adaptas donde otros se paralizan, generas ideas donde otros quedan en blanco. Cuando entras a una habitación con intención, la gente lo siente." },
    minus: { en: "The shadow of the Magician is control. When you stop trusting the world — or the people in it — you start gripping everything so tightly that nothing can breathe, including you. Watch for the moments when 'I just need to handle this myself' becomes a wall between you and everything real. Your power doesn't disappear when you let go. It multiplies.", ru: "Тень Мага — это контроль. Когда ты перестаёшь доверять миру — или людям в нём — ты начинаешь сжимать всё так крепко, что ничто не может дышать, включая тебя. Замечай моменты, когда 'мне просто нужно сделать это самому' становится стеной. Твоя сила не исчезает, когда ты отпускаешь. Она умножается.", es: "La sombra del Mago es el control. Cuando dejas de confiar en el mundo — o en las personas — empiezas a aferrarte a todo tan fuerte que nada puede respirar, incluyéndote a ti. Nota los momentos en que 'simplemente necesito manejarlo yo mismo' se convierte en un muro. Tu poder no desaparece cuando sueltas. Se multiplica." },
  },
  2: {
    name: { en: "The High Priestess", ru: "Верховная жрица", es: "La Suma Sacerdotisa" },
    plus: { en: "You feel before you know. Where others read the words, you read the room — the tone, the pause, the thing beneath the thing. You're a natural bridge between people, a keeper of depth in a world that skims the surface. Your stillness is not emptiness. It's intelligence of a different kind.", ru: "Ты чувствуешь раньше, чем понимаешь. Там, где другие читают слова, ты читаешь пространство — тон, паузу, то, что под поверхностью. Ты — естественный мост между людьми, хранитель глубины в мире, который скользит по верхам. Твоя тишина — не пустота. Это интеллект иного рода.", es: "Sientes antes de saber. Donde otros leen las palabras, tú lees el ambiente — el tono, la pausa, lo que está debajo de lo que se dice. Eres un puente natural entre personas, guardiana de la profundidad en un mundo que roza la superficie. Tu quietud no es vacío. Es inteligencia de otro tipo." },
    minus: { en: "The shadow of the High Priestess is disappearance. You can dissolve so fully into others — their needs, their energy, their approval — that you lose the thread back to yourself. And when you feel unseen, the bitterness can curdle into something you barely recognize. The world needs your wisdom. But only you can protect the source of it.", ru: "Тень Верховной жрицы — исчезновение. Ты можешь так полностью раствориться в других — их потребностях, их энергии, их одобрении — что теряешь нить обратно к себе. А когда чувствуешь себя невидимой, горечь может превратиться во что-то, что ты едва узнаёшь. Мир нуждается в твоей мудрости. Но только ты можешь защитить её источник.", es: "La sombra de la Suma Sacerdotisa es la desaparición. Puedes disolverse tan completamente en los demás — sus necesidades, su energía, su aprobación — que pierdes el hilo de regreso a ti misma. Y cuando te sientes invisible, la amargura puede agriarse en algo que apenas reconoces. El mundo necesita tu sabiduría. Pero solo tú puedes proteger su fuente." },
  },
  3: {
    name: { en: "The Empress", ru: "Императрица", es: "La Emperatriz" },
    plus: { en: "You are warmth made visible. Rooms come alive when you enter them, people feel held in your presence, and beauty seems to follow you — because you create it, consciously or not. You have a gift for leading and a gift for loving, and at your best, they are the same thing.", ru: "Ты — тепло, ставшее видимым. Комнаты оживают, когда ты входишь, люди чувствуют себя в безопасности рядом с тобой, и красота, кажется, следует за тобой — потому что ты её создаёшь, осознанно или нет. У тебя есть дар вести и дар любить, и в лучшие моменты это одно и то же.", es: "Eres calidez hecha visible. Las habitaciones cobran vida cuando entras, las personas se sienten sostenidas en tu presencia, y la belleza parece seguirte — porque la creas, consciente o inconscientemente. Tienes un don para liderar y un don para amar, y en tu mejor versión, son lo mismo." },
    minus: { en: "The shadow of the Empress is the hunger to be seen as enough. Beneath the warmth and the capability, there can be a quiet terror of falling short — of not being powerful enough, lovable enough, good enough. That fear can flip into control, performance, and a subtle dominance that pushes away the very people you most want to reach. You don't have to earn your crown. You were born wearing it.", ru: "Тень Императрицы — это жажда быть признанной достаточной. За теплом и способностями может скрываться тихий страх не дотянуть — быть недостаточно сильной, недостаточно любимой, недостаточно хорошей. Этот страх может обернуться контролем, перформансом и тонким доминированием. Тебе не нужно зарабатывать свою корону. Ты родилась в ней.", es: "La sombra de la Emperatriz es el hambre de ser vista como suficiente. Bajo la calidez y la capacidad, puede haber un terror silencioso a quedarse corta. Ese miedo puede convertirse en control, actuación y una dominancia sutil que aleja a las personas que más quieres alcanzar. No tienes que ganarte tu corona. Naciste usándola." },
  },
  4: {
    name: { en: "The Emperor", ru: "Император", es: "El Emperador" },
    plus: { en: "You are the one people lean on when everything is falling apart — and you don't flinch. There's an inner structure to you that others can feel: steady, reliable, built for the long game. You make decisions when everyone else is still debating. You show up. That's rarer than it sounds.", ru: "Ты тот, на кого люди опираются, когда всё рушится — и ты не дрогнешь. В тебе есть внутренняя структура, которую другие чувствуют: стабильная, надёжная, созданная для долгой игры. Ты принимаешь решения, когда все остальные ещё спорят. Ты приходишь. Это редкость.", es: "Eres en quien la gente se apoya cuando todo se derrumba — y no pestañeas. Hay una estructura interior en ti que otros pueden sentir: estable, confiable, construida para el largo plazo. Tomas decisiones cuando todos los demás aún debaten. Apareces. Eso es más raro de lo que suena." },
    minus: { en: "The shadow of the Emperor is the fortress. You've built so much security through strength and self-reliance that softness can feel like a threat. The need for control can crowd out intimacy, and the drive to provide can become a way of keeping people at a manageable distance. Real power includes the power to be known. Let someone in.", ru: "Тень Императора — это крепость. Ты построил так много безопасности через силу и самодостаточность, что мягкость может казаться угрозой. Потребность в контроле может вытеснить близость, а стремление обеспечивать — стать способом держать людей на удобном расстоянии. Настоящая сила включает способность быть познанным. Впусти кого-нибудь.", es: "La sombra del Emperador es la fortaleza. Has construido tanta seguridad a través de la fuerza y la autosuficiencia que la suavidad puede sentirse como una amenaza. La necesidad de control puede desplazar la intimidad, y el impulso de proveer puede convertirse en una forma de mantener a las personas a una distancia manejable. El poder real incluye el poder de ser conocido. Deja entrar a alguien." },
  },
  5: {
    name: { en: "The Hierophant", ru: "Иерофант", es: "El Hierofante" },
    plus: { en: "You are a bridge between the old and the new — someone who can honor what came before while making it alive again for the present. Your mind is quick, your curiosity is genuine, and when you teach, something in you comes fully online. You don't just share information. You transmit understanding.", ru: "Ты — мост между старым и новым: тот, кто умеет чтить прошлое и одновременно делать его живым в настоящем. Твой ум быстр, твоё любопытство искренне, и когда ты учишь, в тебе что-то включается по-настоящему. Ты не просто делишься информацией. Ты передаёшь понимание.", es: "Eres un puente entre lo antiguo y lo nuevo — alguien que puede honrar lo que vino antes mientras lo hace vivo de nuevo para el presente. Tu mente es rápida, tu curiosidad es genuina, y cuando enseñas, algo en ti se activa completamente. No solo compartes información. Transmites comprensión." },
    minus: { en: "The shadow of the Hierophant is the mind that never rests. So many interests, so many half-finished things, so many opinions held at full volume. The anxiety underneath all that movement is real — and worth meeting directly rather than outrunning. You know a lot. The hardest lesson is learning what you still don't know.", ru: "Тень Иерофанта — ум, который никогда не отдыхает. Так много интересов, так много незавершённых дел, так много мнений, высказанных во весь голос. Тревога под всем этим движением реальна — и её стоит встретить напрямую, а не убегать от неё. Ты много знаешь. Самый трудный урок — научиться тому, чего ты ещё не знаешь.", es: "La sombra del Hierofante es la mente que nunca descansa. Tantos intereses, tantas cosas a medias, tantas opiniones a todo volumen. La ansiedad debajo de todo ese movimiento es real — y vale la pena encontrarla directamente en lugar de huir de ella. Sabes mucho. La lección más difícil es aprender lo que aún no sabes." },
  },
  6: {
    name: { en: "The Lovers", ru: "Влюбленные", es: "Los Amantes" },
    plus: { en: "You were made to love — and to show others what love of life actually looks like. Beauty isn't decoration for you; it's a way of paying attention. You have an instinct for harmony, a gift for making spaces feel like home, and a rare ability to make people feel truly seen. When you are doing what you love, you are magnetic.", ru: "Ты создан для любви — и для того, чтобы показывать другим, как выглядит любовь к жизни. Для тебя красота — не украшение; это способ уделять внимание. У тебя есть инстинкт гармонии, дар делать пространства домашними и редкая способность дарить людям ощущение, что их видят по-настоящему. Когда ты делаешь то, что любишь, ты притягателен.", es: "Fuiste hecho para amar — y para mostrarle a otros cómo se ve el amor por la vida. La belleza no es decoración para ti; es una forma de prestar atención. Tienes un instinto para la armonía, un don para hacer que los espacios se sientan como hogar, y una rara habilidad para hacer que las personas se sientan verdaderamente vistas. Cuando haces lo que amas, eres magnético." },
    minus: { en: "The shadow of the Lovers is the mirror. When your sense of worth gets tangled up in how you look, who loves you, or whether you compare favorably to others, the joy drains fast. You can spend so much time scrutinizing yourself that you miss the life happening around you. You are allowed to be beautiful without being perfect. You always were.", ru: "Тень Влюблённых — это зеркало. Когда твоё ощущение ценности запутывается в том, как ты выглядишь, кто тебя любит или насколько ты выгодно смотришься на чужом фоне, радость быстро уходит. Ты можешь провести так много времени, разглядывая себя, что пропустишь жизнь, происходящую вокруг. Ты можешь быть красивым без совершенства. Ты всегда им был.", es: "La sombra de los Amantes es el espejo. Cuando tu sentido de valía se enreda en cómo te ves, quién te ama, o si te comparas favorablemente con otros, la alegría se drena rápido. Puedes pasar tanto tiempo escrutándote que te pierdes la vida que ocurre a tu alrededor. Se te permite ser hermoso sin ser perfecto. Siempre lo fuiste." },
  },
  7: {
    name: { en: "The Chariot", ru: "Колесница", es: "El Carro" },
    plus: { en: "You are built for breakthrough. Where others see obstacles, you see a route through — and then you take it. Your intelligence is fast, your instincts are sharp, and you have an almost preternatural ability to sense when something isn't true. You don't just move through life. You cut through it.", ru: "Ты создан для прорыва. Там, где другие видят препятствия, ты видишь путь — и проходишь его. Твой интеллект быстр, твои инстинкты остры, и у тебя есть почти сверхъестественная способность чувствовать, когда что-то неправда. Ты не просто движешься по жизни. Ты прорезаешь её.", es: "Estás hecho para el avance. Donde otros ven obstáculos, tú ves una ruta — y la tomas. Tu inteligencia es rápida, tus instintos son agudos, y tienes una capacidad casi sobrenatural para sentir cuando algo no es verdad. No solo te mueves por la vida. La atraviesas." },
    minus: { en: "The shadow of the Chariot is the race that never ends. When winning becomes the only proof of worth, stillness feels like failure. The body gets ignored, the emotions go underground, and the relentless forward motion starts to hollow things out. You're allowed to arrive somewhere and stay for a while. The victory you're chasing might already be here.", ru: "Тень Колесницы — это гонка, которая никогда не заканчивается. Когда победа становится единственным доказательством ценности, неподвижность ощущается как провал. Тело игнорируется, эмоции уходят вглубь, а неустанное движение вперёд начинает опустошать. Тебе позволено куда-то прибыть и остаться ненадолго. Победа, которую ты преследуешь, может уже быть здесь.", es: "La sombra del Carro es la carrera que nunca termina. Cuando ganar se convierte en la única prueba de valía, la quietud se siente como fracaso. El cuerpo es ignorado, las emociones van bajo tierra, y el movimiento implacable hacia adelante comienza a vaciar las cosas. Se te permite llegar a algún lugar y quedarte un rato. La victoria que persigues puede ya estar aquí." },
  },
  8: {
    name: { en: "Strength", ru: "Справедливость", es: "La Justicia" },
    plus: { en: "You understand how things work — cause, consequence, the invisible thread between action and outcome. That clarity is rare and powerful. You are honest in a world that trades in half-truths, and you carry a deep sense of what's right that doesn't bend with the wind. Integrity is your actual currency.", ru: "Ты понимаешь, как устроены вещи — причина, следствие, невидимая нить между действием и результатом. Эта ясность редка и мощна. Ты честен в мире, который торгует полуправдой, и несёшь в себе глубокое чувство справедливости, которое не гнётся на ветру. Целостность — твоя настоящая валюта.", es: "Entiendes cómo funcionan las cosas — causa, consecuencia, el hilo invisible entre acción y resultado. Esa claridad es rara y poderosa. Eres honesto en un mundo que comercia con medias verdades, y llevas un profundo sentido de lo correcto que no se dobla con el viento. La integridad es tu verdadera moneda." },
    minus: { en: "The shadow of Strength is the ledger. When everything becomes a transaction — what's owed, what was taken, what should be returned — the heart closes. The obsession with fairness can become a way of never being fully present with anyone, because you're always running the numbers. Some things can't be balanced. They can only be released.", ru: "Тень Справедливости — это гроссбух. Когда всё становится транзакцией — что причитается, что было взято, что должно быть возвращено — сердце закрывается. Одержимость справедливостью может стать способом никогда не присутствовать полностью ни с кем, потому что ты всегда считаешь. Некоторые вещи нельзя сбалансировать. Их можно только отпустить.", es: "La sombra de la Justicia es el libro mayor. Cuando todo se convierte en transacción — lo que se debe, lo que fue tomado, lo que debería devolverse — el corazón se cierra. La obsesión con la justicia puede convertirse en una forma de nunca estar completamente presente con nadie, porque siempre estás haciendo cuentas. Algunas cosas no se pueden equilibrar. Solo se pueden soltar." },
  },
  9: {
    name: { en: "The Hermit", ru: "Отшельник", es: "El Ermitaño" },
    plus: { en: "You carry a quiet knowing that others sense but can't always name. Your wisdom doesn't come from books — it comes from going deep, paying attention, and being willing to sit with what's uncomfortable until it reveals itself. In solitude, you recharge. In depth, you come alive. The world needs people who will go all the way in.", ru: "Ты несёшь тихое знание, которое другие чувствуют, но не всегда могут назвать. Твоя мудрость приходит не из книг — она приходит от глубины, внимательности и готовности сидеть с тем, что неудобно, пока оно не раскроется. В одиночестве ты восстанавливаешь силы. В глубине ты оживаешь.", es: "Llevas un saber silencioso que otros sienten pero no siempre pueden nombrar. Tu sabiduría no viene de los libros — viene de ir profundo, prestar atención, y estar dispuesto a sentarse con lo incómodo hasta que se revela. En soledad, te recargas. En profundidad, cobras vida." },
    minus: { en: "The shadow of the Hermit is withdrawal as a way of life. There's a difference between solitude that restores and solitude that hides — and it's easy for one to become the other. The savior in you can also be a way of staying busy without being seen. Your depth is a gift only when you let it reach someone.", ru: "Тень Отшельника — это уход как образ жизни. Есть разница между одиночеством, которое восстанавливает, и одиночеством, которое прячет — и легко, когда одно становится другим. Спасатель в тебе тоже может быть способом оставаться занятым, не будучи увиденным. Твоя глубина — дар только тогда, когда ты позволяешь ей до кого-то дотянуться.", es: "La sombra del Ermitaño es el retiro como forma de vida. Hay una diferencia entre la soledad que restaura y la soledad que se esconde — y es fácil que una se convierta en la otra. El salvador en ti también puede ser una forma de mantenerse ocupado sin ser visto. Tu profundidad es un regalo solo cuando dejas que alcance a alguien." },
  },
  10: {
    name: { en: "Wheel of Fortune", ru: "Колесо фортуны", es: "La Rueda de la Fortuna" },
    plus: { en: "Life moves for you when you move with it. You carry the energy of the Magician — the initiative, the spark, the confidence to begin — and Fortune adds something extra: the sense that doors open when you approach them. You are luckier than you know. But your luck is not separate from your motion.", ru: "Жизнь движется для тебя, когда ты движешься с ней. Ты несёшь энергию Мага — инициативу, искру, уверенность начинать — а Фортуна добавляет кое-что ещё: ощущение, что двери открываются, когда ты к ним подходишь. Ты удачливее, чем думаешь. Но твоя удача неотделима от твоего движения.", es: "La vida se mueve para ti cuando te mueves con ella. Llevas la energía del Mago — la iniciativa, la chispa, la confianza para comenzar — y la Fortuna añade algo extra: la sensación de que las puertas se abren cuando te acercas. Eres más afortunado de lo que sabes. Pero tu suerte no está separada de tu movimiento." },
    minus: { en: "The shadow of the Wheel is the wait. When the trust breaks down — in yourself, in life, in other people — the wheel stops. Apathy masquerades as patience. Inaction looks like strategy. And the fortune that was available to you quietly moves on. You cannot control the wheel. But you can choose to be in motion.", ru: "Тень Колеса — это ожидание. Когда доверие рушится — к себе, к жизни, к другим людям — колесо останавливается. Апатия маскируется под терпение. Бездействие выглядит как стратегия. И удача, которая была доступна тебе, тихо уходит. Ты не можешь контролировать колесо. Но ты можешь выбрать движение.", es: "La sombra de la Rueda es la espera. Cuando la confianza se rompe — en ti mismo, en la vida, en otras personas — la rueda se detiene. La apatía se disfraza de paciencia. La inacción parece estrategia. Y la fortuna que estaba disponible para ti se va silenciosamente. No puedes controlar la rueda. Pero puedes elegir estar en movimiento." },
  },
  11: {
    name: { en: "Strength / Justice", ru: "Сила", es: "La Fuerza" },
    plus: { en: "There is something unshakeable in you — a physical and inner resilience that others can lean on when the ground moves. You don't perform strength; you embody it. You show up when it's hard, you organize when it's chaotic, and you give without needing to make it a story. That quiet power changes things.", ru: "В тебе есть что-то непоколебимое — физическая и внутренняя стойкость, на которую другие могут опираться, когда земля уходит из-под ног. Ты не изображаешь силу — ты её воплощаешь. Ты приходишь, когда трудно, организуешь, когда хаос, и даёшь, не превращая это в историю. Эта тихая сила меняет всё.", es: "Hay algo inquebrantable en ti — una resiliencia física e interior en la que otros pueden apoyarse cuando el suelo se mueve. No actúas la fuerza; la encarnas. Apareces cuando es difícil, organizas cuando hay caos, y das sin necesitar convertirlo en una historia. Ese poder silencioso cambia las cosas." },
    minus: { en: "The shadow of Strength is the war inside. There is an aggression in you that doesn't always have a clean outlet — and when it turns inward, the body pays for it. The drive to push harder, endure more, and never soften can become a form of self-erasure. You are not here to outlast yourself. Rest is not retreat.", ru: "Тень Силы — это война внутри. В тебе есть агрессия, у которой не всегда есть чистый выход — и когда она обращается внутрь, тело платит за это. Стремление давить сильнее, терпеть больше и никогда не смягчаться может стать формой самоуничтожения. Ты здесь не для того, чтобы пережить себя. Отдых — не отступление.", es: "La sombra de la Fuerza es la guerra interior. Hay una agresión en ti que no siempre tiene una salida limpia — y cuando se vuelve hacia adentro, el cuerpo paga por ello. El impulso de empujar más, aguantar más y nunca suavizarse puede convertirse en una forma de auto-borrado. No estás aquí para sobrevivirte a ti mismo. El descanso no es retirada." },
  },
  12: {
    name: { en: "The Hanged Man", ru: "Повешенный", es: "El Colgado" },
    plus: { en: "You see what others miss because you've learned to look from a different angle. There's a creativity in you that comes from genuine depth — not performance, not trend-chasing, but a real encounter with the strange and the beautiful. You are wise in ways that surprise even you. And your compassion is not a technique. It's just who you are.", ru: "Ты видишь то, что другие упускают, потому что научился смотреть с другого угла. В тебе есть творчество, которое приходит из настоящей глубины — не из перформанса, не из погони за трендами, а из настоящей встречи со странным и прекрасным. Ты мудр способами, которые удивляют даже тебя. И твоё сострадание — не техника. Это просто ты.", es: "Ves lo que otros se pierden porque has aprendido a mirar desde un ángulo diferente. Hay una creatividad en ti que viene de una profundidad genuina — no de actuación, no de seguir tendencias, sino de un encuentro real con lo extraño y lo hermoso. Eres sabio de maneras que te sorprenden incluso a ti. Y tu compasión no es una técnica. Es simplemente quien eres." },
    minus: { en: "The shadow of the Hanged Man is the suspension that becomes permanent. What begins as reflection can slide into apathy; what begins as giving can slide into self-erasure. You can pour yourself into others until there's nothing left to pour — and call it love. It isn't. Love that depletes you is not love. It's the old wound wearing love's clothes.", ru: "Тень Повешенного — это подвешенность, которая становится постоянной. То, что начинается как размышление, может превратиться в апатию; то, что начинается как отдача, может превратиться в самоуничтожение. Ты можешь вливать себя в других, пока не останется ничего — и называть это любовью. Это не так. Любовь, которая истощает тебя, — не любовь. Это старая рана в одеждах любви.", es: "La sombra del Colgado es la suspensión que se vuelve permanente. Lo que comienza como reflexión puede deslizarse hacia la apatía; lo que comienza como dar puede deslizarse hacia el auto-borrado. Puedes verterte en otros hasta que no quede nada que verter — y llamarlo amor. No lo es. El amor que te agota no es amor. Es la vieja herida vistiendo la ropa del amor." },
  },
  13: {
    name: { en: "Death", ru: "Смерть", es: "La Muerte" },
    plus: { en: "You are the Arcana of transformation — and that is not a small thing. You have a gift for walking through endings without flinching and emerging as something new. You don't just survive change; you catalyze it in everyone around you. You make the stuck things move. That is a rare and necessary power.", ru: "Ты — Аркан трансформации, и это немало. У тебя есть дар проходить через окончания без колебаний и выходить из них чем-то новым. Ты не просто переживаешь перемены — ты катализируешь их у всех вокруг. Ты заставляешь застывшее двигаться. Это редкая и необходимая сила.", es: "Eres el Arcano de la transformación — y eso no es poca cosa. Tienes un don para caminar a través de los finales sin pestañear y emerger como algo nuevo. No solo sobrevives el cambio; lo catalizas en todos a tu alrededor. Haces que las cosas estancadas se muevan. Ese es un poder raro y necesario." },
    minus: { en: "The shadow of Death is destruction without direction. The same energy that makes you a transformer can make you a disruptor — scattering things before they've had a chance to root, burning bridges out of restlessness rather than need. Watch where you are fleeing from stillness. The old life you keep trying to escape sometimes just needs to be lived differently, not abandoned.", ru: "Тень Смерти — это разрушение без направления. Та же энергия, которая делает тебя трансформером, может сделать тебя разрушителем — разбрасывающим вещи прежде, чем они укоренились, сжигающим мосты из беспокойства, а не из необходимости. Замечай, куда ты убегаешь от неподвижности. Старая жизнь, от которой ты постоянно пытаешься уйти, иногда просто нуждается в том, чтобы её прожили по-другому, а не бросили.", es: "La sombra de la Muerte es la destrucción sin dirección. La misma energía que te hace transformador puede hacerte disruptivo — dispersando cosas antes de que hayan tenido la oportunidad de echar raíces, quemando puentes por inquietud en lugar de necesidad. Observa dónde estás huyendo de la quietud. La vieja vida de la que sigues intentando escapar a veces solo necesita vivirse de manera diferente, no abandonarse." },
  },
  14: {
    name: { en: "Temperance", ru: "Умеренность", es: "La Templanza" },
    plus: { en: "You live in a frequency that most people only visit. Your sensitivity is not a weakness — it's a tuning fork. You feel the world's beauty acutely, you carry genuine spiritual insight, and when you are in your element — creating, teaching, healing — there is a grace to you that is unmistakable.", ru: "Ты живёшь в частоте, которую большинство людей только посещает. Твоя чувствительность — не слабость, это камертон. Ты остро чувствуешь красоту мира, несёшь настоящее духовное понимание, и когда ты в своей стихии — творишь, учишь, исцеляешь — в тебе есть изящество, которое невозможно спутать ни с чем.", es: "Vives en una frecuencia que la mayoría de las personas solo visita. Tu sensibilidad no es una debilidad — es un diapasón. Sientes la belleza del mundo agudamente, llevas una genuina perspicacia espiritual, y cuando estás en tu elemento — creando, enseñando, sanando — hay una gracia en ti que es inconfundible." },
    minus: { en: "The shadow of Temperance is the imbalance it tries so hard to transcend. The longing for harmony can tip into a subtle greed — for more experience, more beauty, more meaning — that leaves you perpetually unsatisfied. Or it tips the other way: apathy, withdrawal, the slow dimming of the very light you're here to carry. You don't have to be perfect to be a source of beauty. You just have to be present.", ru: "Тень Умеренности — это дисбаланс, который она так старательно пытается преодолеть. Жажда гармонии может перевернуться в тонкую жадность — больше опыта, больше красоты, больше смысла — которая оставляет тебя в вечной неудовлетворённости. Или она перевернётся в другую сторону: апатия, уход, медленное угасание того самого света, который ты здесь несёшь. Тебе не нужно быть совершенным, чтобы быть источником красоты. Просто нужно присутствовать.", es: "La sombra de la Templanza es el desequilibrio que tanto intenta trascender. El anhelo de armonía puede inclinarse hacia una codicia sutil — más experiencia, más belleza, más significado — que te deja perpetuamente insatisfecho. O se inclina al otro lado: apatía, retraimiento, el lento oscurecimiento de la misma luz que estás aquí para llevar. No tienes que ser perfecto para ser una fuente de belleza. Solo tienes que estar presente." },
  },
  15: {
    name: { en: "The Devil", ru: "Дьявол", es: "El Diablo" },
    plus: { en: "There is a magnetism to you that isn't learned — it's elemental. People are drawn to your presence before they understand why. You see through surfaces, you read people with precision, and you know how to move in a room. Your power is real. The question has never been whether you have it. The question is what you'll do with it.", ru: "В тебе есть магнетизм, который не заучен — он элементален. Люди притягиваются к твоему присутствию ещё до того, как понимают почему. Ты видишь сквозь поверхности, читаешь людей с точностью и знаешь, как двигаться в комнате. Твоя сила реальна. Вопрос никогда не был в том, есть ли она у тебя. Вопрос в том, что ты с ней сделаешь.", es: "Hay un magnetismo en ti que no se aprende — es elemental. Las personas se sienten atraídas por tu presencia antes de entender por qué. Ves a través de las superficies, lees a las personas con precisión, y sabes cómo moverte en una habitación. Tu poder es real. La pregunta nunca fue si lo tienes. La pregunta es qué harás con él." },
    minus: { en: "The shadow of the Devil is power turned inward as shame, or outward as dominance. Many with this arcana begin life with their magnetism suppressed — dimmed by early experiences that taught them that being too much was dangerous. When that energy finally surfaces, it can come out sideways: control, manipulation, appetite without limit. The work is not to tame your power. It's to aim it.", ru: "Тень Дьявола — это сила, обращённая внутрь как стыд или наружу как доминирование. Многие с этим арканом начинают жизнь с подавленным магнетизмом — приглушённым ранним опытом, который научил их, что быть слишком много — опасно. Когда эта энергия наконец выходит на поверхность, она может вырваться боком: контроль, манипуляция, аппетит без предела. Работа не в том, чтобы укротить свою силу. Она в том, чтобы направить её.", es: "La sombra del Diablo es el poder vuelto hacia adentro como vergüenza, o hacia afuera como dominancia. Muchos con este arcano comienzan la vida con su magnetismo suprimido — apagado por experiencias tempranas que les enseñaron que ser demasiado era peligroso. Cuando esa energía finalmente emerge, puede salir de lado: control, manipulación, apetito sin límite. El trabajo no es domar tu poder. Es apuntarlo." },
  },
  16: {
    name: { en: "The Tower", ru: "Башня", es: "La Torre" },
    plus: { en: "You are at your best in the fire. Crisis doesn't unravel you — it clarifies you. You have an extraordinary capacity to build from rubble, to see the structure beneath the chaos, and to move with decisive speed when everyone else is still processing the shock. You don't need ideal conditions. You need a real problem.", ru: "Ты в лучшей форме в огне. Кризис не разрушает тебя — он проясняет. У тебя есть экстраординарная способность строить из обломков, видеть структуру под хаосом и двигаться с решительной скоростью, когда все остальные ещё осмысливают шок. Тебе не нужны идеальные условия. Тебе нужна настоящая проблема.", es: "Estás en tu mejor momento en el fuego. La crisis no te deshace — te aclara. Tienes una capacidad extraordinaria para construir desde los escombros, ver la estructura bajo el caos, y moverte con velocidad decisiva cuando todos los demás aún están procesando el shock. No necesitas condiciones ideales. Necesitas un problema real." },
    minus: { en: "The shadow of the Tower is the destruction that outlasts its purpose. You are capable of extraordinary construction — but the same force that builds can tear down without realizing it. There is a restlessness in you that struggles with the long, slow work of maintenance, relationship, and depth. Not every wall that stands is a wall that needs to fall. Some things are worth building past the crisis.", ru: "Тень Башни — это разрушение, которое переживает свою цель. Ты способен на экстраординарное строительство — но та же сила, которая строит, может разрушать, не осознавая этого. В тебе есть беспокойность, которой трудно даётся долгая, медленная работа поддержания, отношений и глубины. Не каждая стоящая стена — стена, которую нужно разрушить. Некоторые вещи стоит строить дальше кризиса.", es: "La sombra de la Torre es la destrucción que sobrevive a su propósito. Eres capaz de una construcción extraordinaria — pero la misma fuerza que construye puede derribar sin darse cuenta. Hay una inquietud en ti que lucha con el trabajo largo y lento del mantenimiento, la relación y la profundidad. No toda pared que se mantiene es una pared que necesita caer. Algunas cosas vale la pena construirlas más allá de la crisis." },
  },
  17: {
    name: { en: "The Star", ru: "Звезда", es: "La Estrella" },
    plus: { en: "You carry light — not as metaphor, but as something people actually experience in your presence. You are here to be seen, to create, and to remind others that extraordinary things are possible. Your gifts are real, your imagination is rare, and when you allow yourself to shine without apology, something opens up in the people around you.", ru: "Ты несёшь свет — не как метафору, а как нечто, что люди действительно ощущают в твоём присутствии. Ты здесь, чтобы быть увиденным, творить и напоминать другим, что невероятные вещи возможны. Твои дары реальны, твоё воображение редко, и когда ты позволяешь себе сиять без извинений, в людях вокруг тебя что-то открывается.", es: "Llevas luz — no como metáfora, sino como algo que las personas realmente experimentan en tu presencia. Estás aquí para ser visto, crear, y recordarle a otros que las cosas extraordinarias son posibles. Tus dones son reales, tu imaginación es rara, y cuando te permites brillar sin disculpas, algo se abre en las personas a tu alrededor." },
    minus: { en: "The shadow of the Star is the disbelief in its own light. You can spend a lifetime being told you're special while quietly being convinced you're not. That gap between the gift and the belief in the gift is where the drift happens — into apathy, into borrowing credibility from others, into waiting for someone else to confirm what you already are. The star doesn't ask permission to shine.", ru: "Тень Звезды — это неверие в собственный свет. Можно провести жизнь, слыша, что ты особенный, и при этом втайне быть убеждённым, что это не так. Этот разрыв между даром и верой в дар — место, где происходит дрейф: в апатию, в заимствование чужого авторитета, в ожидание, пока кто-то другой подтвердит то, чем ты уже являешься. Звезда не спрашивает разрешения светить.", es: "La sombra de la Estrella es la incredulidad en su propia luz. Puedes pasar una vida escuchando que eres especial mientras secretamente te convences de que no lo eres. Esa brecha entre el don y la creencia en el don es donde ocurre la deriva — hacia la apatía, hacia tomar prestada la credibilidad de otros, hacia esperar que alguien más confirme lo que ya eres. La estrella no pide permiso para brillar." },
  },
  18: {
    name: { en: "The Moon", ru: "Луна", es: "La Luna" },
    plus: { en: "You live in a world of invisible currents that most people don't even know exist — and you navigate them with an instinct that borders on the supernatural. Your depth is real, your sensitivity is a gift, and your capacity to feel what others can't name makes you a rare kind of guide for the people in your life.", ru: "Ты живёшь в мире невидимых течений, о существовании которых большинство людей даже не подозревает — и ты ориентируешься в них с инстинктом, граничащим со сверхъестественным. Твоя глубина реальна, твоя чувствительность — дар, и твоя способность чувствовать то, что другие не могут назвать, делает тебя редким проводником для людей в твоей жизни.", es: "Vives en un mundo de corrientes invisibles que la mayoría de las personas ni siquiera sabe que existen — y las navegas con un instinto que bordea lo sobrenatural. Tu profundidad es real, tu sensibilidad es un don, y tu capacidad para sentir lo que otros no pueden nombrar te convierte en un guía raro para las personas en tu vida." },
    minus: { en: "The shadow of the Moon is the spiral inward. Your sensitivity, which is your greatest gift, becomes your greatest liability when you can't find the shore. The fears multiply, the inner world becomes more real than the outer one, and the illusions you've built — about others, about yourself — start to calcify. The Moon reminds you: feelings are real, but they are not always facts.", ru: "Тень Луны — это спираль внутрь. Твоя чувствительность, которая является твоим величайшим даром, становится твоей величайшей уязвимостью, когда ты не можешь найти берег. Страхи множатся, внутренний мир становится реальнее внешнего, а иллюзии, которые ты построил — о других, о себе — начинают окаменевать. Луна напоминает: чувства реальны, но они не всегда факты.", es: "La sombra de la Luna es la espiral hacia adentro. Tu sensibilidad, que es tu mayor don, se convierte en tu mayor responsabilidad cuando no puedes encontrar la orilla. Los miedos se multiplican, el mundo interior se vuelve más real que el exterior, y las ilusiones que has construido — sobre otros, sobre ti mismo — comienzan a calcificarse. La Luna te recuerda: los sentimientos son reales, pero no siempre son hechos." },
  },
  19: {
    name: { en: "The Sun", ru: "Солнце", es: "El Sol" },
    plus: { en: "You are a source. Not someone who reflects light — someone who generates it. People come alive around you, goals become real when you commit to them, and at your best, you carry an energy that feels like permission for everyone around you to be more fully themselves. This is not a small thing. This is your purpose.", ru: "Ты — источник. Не тот, кто отражает свет — тот, кто его генерирует. Люди оживают рядом с тобой, цели становятся реальными, когда ты им привержен, и в лучшие моменты ты несёшь энергию, которая ощущается как разрешение для всех вокруг быть более полно собой. Это не мелочь. Это твоё предназначение.", es: "Eres una fuente. No alguien que refleja luz — alguien que la genera. Las personas cobran vida a tu alrededor, los objetivos se vuelven reales cuando te comprometes con ellos, y en tu mejor versión, llevas una energía que se siente como permiso para que todos a tu alrededor sean más plenamente ellos mismos. Esto no es poca cosa. Este es tu propósito." },
    minus: { en: "The shadow of the Sun is the fear of its own darkness. The self-criticism can be merciless — a burning from the inside that shows up in the body, in restlessness, in the inability to rest in someone else's light for a while. The terror of being ordinary, being in the background, being outshone — these can drive you to perform in ways that exhaust you. You are allowed to be warm without being blinding. The Sun doesn't have to be at full noon to matter.", ru: "Тень Солнца — это страх собственной темноты. Самокритика может быть беспощадной — горение изнутри, которое проявляется в теле, в беспокойности, в неспособности ненадолго отдохнуть в чужом свете. Ужас быть обычным, быть на заднем плане, быть в тени — всё это может заставлять тебя перформить так, что истощает. Тебе позволено быть тёплым, не ослепляя. Солнцу не нужно быть в полдень, чтобы иметь значение.", es: "La sombra del Sol es el miedo a su propia oscuridad. La autocrítica puede ser implacable — una quema desde adentro que aparece en el cuerpo, en la inquietud, en la incapacidad de descansar en la luz de otro por un tiempo. El terror a ser ordinario, a estar en segundo plano, a ser eclipsado — estos pueden llevarte a actuar de maneras que te agotan. Se te permite ser cálido sin ser cegador. El Sol no tiene que estar en pleno mediodía para importar." },
  },
  20: {
    name: { en: "Judgement", ru: "Суд", es: "El Juicio" },
    plus: { en: "You are connected to something most people cannot access — the deep current of lineage, the living presence of what came before you. Your intuition doesn't just read the present; it reads across time. There is a healing in you that is not only yours, and a voice that carries more weight than you know.", ru: "Ты связан с тем, к чему большинство людей не имеет доступа — глубоким течением рода, живым присутствием того, что было до тебя. Твоя интуиция не просто читает настоящее; она читает сквозь время. В тебе есть исцеление, которое не только твоё, и голос, который несёт больше веса, чем ты знаешь.", es: "Estás conectado a algo a lo que la mayoría de las personas no puede acceder — la corriente profunda del linaje, la presencia viva de lo que vino antes de ti. Tu intuición no solo lee el presente; lee a través del tiempo. Hay una sanación en ti que no es solo tuya, y una voz que lleva más peso del que sabes." },
    minus: { en: "The shadow of Judgement is the wound of the lineage carried forward. The patterns of your ancestors — their unexpressed grief, their unresolved conflicts, their unspoken resentments — can flow through you if you don't look at them directly. The people you judge most harshly are often the ones most like you. And the forgiveness that feels most impossible is often the one that will free you the most.", ru: "Тень Суда — это рана рода, переданная вперёд. Паттерны твоих предков — их невыраженное горе, их неразрешённые конфликты, их невысказанные обиды — могут течь сквозь тебя, если ты не посмотришь на них прямо. Люди, которых ты осуждаешь наиболее жёстко, часто больше всего похожи на тебя. А прощение, которое кажется наиболее невозможным, часто освободит тебя больше всего.", es: "La sombra del Juicio es la herida del linaje llevada hacia adelante. Los patrones de tus ancestros — su dolor no expresado, sus conflictos no resueltos, sus resentimientos no dichos — pueden fluir a través de ti si no los miras directamente. Las personas que juzgas más duramente son a menudo las más parecidas a ti. Y el perdón que se siente más imposible es a menudo el que más te liberará." },
  },
  21: {
    name: { en: "The World", ru: "Мир", es: "El Mundo" },
    plus: { en: "You belong to no single place — and so you belong everywhere. The world is genuinely your home, other cultures genuinely interest you, and you carry a rare capacity to find common ground where others see only difference. You are a unifier. That's not a role you perform. It's what you do when you're most yourself.", ru: "Ты не принадлежишь ни одному месту — и поэтому принадлежишь везде. Мир по-настоящему твой дом, другие культуры по-настоящему тебя интересуют, и в тебе есть редкая способность находить общее там, где другие видят только различия. Ты объединяешь. Это не роль, которую ты исполняешь. Это то, что ты делаешь, когда наиболее полно являешься собой.", es: "No perteneces a un solo lugar — y por eso perteneces en todas partes. El mundo es genuinamente tu hogar, otras culturas genuinamente te interesan, y llevas una rara capacidad para encontrar terreno común donde otros solo ven diferencia. Eres un unificador. Ese no es un papel que desempeñas. Es lo que haces cuando eres más tú mismo." },
    minus: { en: "The shadow of the World is the war with it. The same person who can embrace all of humanity can turn — when something feels unjust — into someone who battles everything and everyone. The tolerance becomes intolerance, the unity becomes tribalism, the freedom-seeker becomes the one imposing limits. The world you carry so beautifully inside you is only accessible when you stop fighting the version outside.", ru: "Тень Мира — это война с ним. Тот же человек, который может обнять всё человечество, может обернуться — когда что-то кажется несправедливым — тем, кто воюет со всем и всеми. Терпимость становится нетерпимостью, единство — трибализмом, искатель свободы — тем, кто навязывает ограничения. Мир, который ты так прекрасно несёшь внутри, доступен только тогда, когда ты перестаёшь сражаться с его версией снаружи.", es: "La sombra del Mundo es la guerra con él. La misma persona que puede abrazar a toda la humanidad puede convertirse — cuando algo parece injusto — en alguien que lucha contra todo y todos. La tolerancia se vuelve intolerancia, la unidad se vuelve tribalismo, el buscador de libertad se convierte en quien impone límites. El mundo que llevas tan hermosamente dentro de ti solo es accesible cuando dejas de luchar contra la versión de afuera." },
  },
  22: {
    name: { en: "The Fool", ru: "Шут", es: "El Loco" },
    plus: { en: "You carry the wisdom of the beginner — and that is the rarest kind. You haven't forgotten how to be astonished. You approach life as an adventure rather than a problem to be solved, and there is a freedom in you that quietly gives others permission to be less serious too. Your lightness is not naivety. It's a choice — and a profound one.", ru: "Ты несёшь мудрость начинающего — а это самый редкий вид. Ты не забыл, как изумляться. Ты подходишь к жизни как к приключению, а не проблеме для решения, и в тебе есть свобода, которая тихо даёт другим разрешение быть менее серьёзными тоже. Твоя лёгкость — не наивность. Это выбор — и глубокий.", es: "Llevas la sabiduría del principiante — y ese es el tipo más raro. No has olvidado cómo maravillarse. Te acercas a la vida como una aventura en lugar de un problema a resolver, y hay una libertad en ti que silenciosamente da permiso a otros para ser menos serios también. Tu ligereza no es ingenuidad. Es una elección — y una profunda." },
    minus: { en: "The shadow of the Fool is the refusal to land. The perpetual lightness that is your gift can become a flight from responsibility, from depth, from the things that require staying. There is a difference between freedom and avoidance — and the Fool, at its shadow, doesn't always know which one it's choosing. Some adventures require you to unpack. Some people deserve the version of you that commits.", ru: "Тень Шута — это отказ приземлиться. Вечная лёгкость, которая является твоим даром, может стать бегством от ответственности, от глубины, от вещей, которые требуют остаться. Есть разница между свободой и избеганием — и Шут в своей тени не всегда знает, что выбирает. Некоторые приключения требуют, чтобы ты распаковался. Некоторые люди заслуживают версию тебя, которая обязуется.", es: "La sombra del Loco es la negativa a aterrizar. La ligereza perpetua que es tu don puede convertirse en una huida de la responsabilidad, de la profundidad, de las cosas que requieren quedarse. Hay una diferencia entre libertad y evitación — y el Loco, en su sombra, no siempre sabe cuál está eligiendo. Algunas aventuras requieren que te instales. Algunas personas merecen la versión de ti que se compromete." },
  },
};

function calcArcana(dob) {
  if (!dob) return null;
  const day = parseInt(dob.split('-')[2], 10);
  if (!day) return null;
  if (day <= 22) return day;
  const sum = String(day).split('').reduce((a, d) => a + parseInt(d), 0);
  return sum <= 22 ? sum : null;
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

QUESTION BANK (rotate freely — never repeat the same question in the same session or use the same opening two sessions in a row):
OPENING: "What's really at stake for you right now?" / "What would it feel like to have this handled?" / "Where are you on clarity — 1 to 10?" / "What's keeping you up about this?" / "What are you avoiding looking at?" / "If this stays unresolved, what's the cost?" / "What does your body say about this?" / "What's the feeling underneath the feeling?"
DEEPENING: "What part of you needs attention right now?" / "Where else does this show up?" / "What need isn't being met?" / "Whose truth is that, really?" / "What are you tolerating?" / "What truth are you pretending isn't there?" / "What would you do if no one was watching?" / "What's the story you keep telling yourself about this?" / "When did this pattern start?" / "What are you protecting yourself from?"
EDGE: "What's hard to admit?" / "Who are you being when you do that?" / "What would freedom say?" / "What does your future self already know?" / "What part of you enjoys staying stuck?" / "What would you do if you trusted yourself?" / "What would you have to give up to change this?" / "What are you most afraid others would see?" / "What would you do if you knew you were enough?" / "What's the version of you that already solved this doing differently?"
GOOD/GUIDE: "What's working that you want to deepen?" / "What quiet thing deserves your attention today?" / "What would make today feel complete?" / "What does your best self want to focus on?" / "What are you not giving enough credit to?" / "What would you do today if you were fully yourself?" / "What's one thing you could stop doing that would free up energy?"
CHALLENGE: "What belief are you most attached to right now?" / "Where are you playing it safe when you shouldn't be?" / "What assumption are you making that might be wrong?" / "What would you do if you knew you couldn't fail?" / "What would change if you stopped needing to be right about this?" / "What are you defending that no longer serves you?" / "What would a braver version of you do?"
PRACTICES (vary these — never give the same practice twice for the same challenge):
Morning anchor: journaling, intention-setting, body scan, gratitude, silence
Pattern interrupt: do the opposite, say it out loud, move your body, change your environment
Relationship: one honest conversation, ask for what you need, express appreciation
Identity: act as if, write your own eulogy, define who you're becoming
Reflection: evening review, weekly letter to yourself, track one thing for 7 days

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
  const [yesterdayFollowUp, setYesterdayFollowUp] = useState(null);
  const [yesterdayFollowUpText, setYesterdayFollowUpText] = useState("");
  const yesterdayFollowUpRef = useRef(null);
  const [showYesterday, setShowYesterday] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [animKey, setAnimKey]   = useState(0);
  const [editingReflection, setEditingReflection] = useState(null);
  const [editReflectionText, setEditReflectionText] = useState("");

  // onboarding
  const [onbStep, setOnbStep]   = useState(0);
  const [nameInput, setNameInput] = useState("");
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
  const [questionHistory, setQuestionHistory] = useState([]);
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
  const [practicesTab, setPracticesTab] = useState('calendar'); // 'calendar' | 'recap'
const [recapData, setRecapData] = useState(null);
const [recapCache, setRecapCache] = useState({});
const [recapLoading, setRecapLoading] = useState(false);

  // xp
  const [xp, setXp]                 = useState(0);
  const [xpMilestone, setXpMilestone] = useState(null);
  const [langOpen, setLangOpen] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const [screen2, setScreen2] = useState(null); // 'paths' | 'deepdive' | 'library'
  const [energyEntries, setEnergyEntries] = useState([]); // {id, text, type:'weekday'|'weekend', rating:'gain'|'drain'|'same'|null, week:string}
const [energySection, setEnergySection] = useState('weekday');
const [energyInput, setEnergyInput] = useState('');
const [energyWeekOffset, setEnergyWeekOffset] = useState(0);
  const [ikigai, setIkigai] = useState({love:'', good:'', need:'', paid:''});
const [ikigaiEditing, setIkigaiEditing] = useState({love:false, good:false, need:false, paid:false});
const [ikigaiSynthesis, setIkigaiSynthesis] = useState('');
const [ikigaiLoading, setIkigaiLoading] = useState(false);
const [ikigaiTip, setIkigaiTip] = useState(null);
  const [ikigaiDraft, setIkigaiDraft] = useState({love:'', good:'', need:'', paid:''});
  const [showFeedback, setShowFeedback] = useState(false);
const [feedbackAnswers, setFeedbackAnswers] = useState({q1:'',q2:'',q3:'',q4:'',q5:'',q6:'',q7:''});
const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
const [feedbackLoading, setFeedbackLoading] = useState(false);
const [adminFeedback, setAdminFeedback] = useState([]);
const [adminLoading, setAdminLoading] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState(null);

  // who am i
  const [editingValues, setEditingValues] = useState(false);
  const [editVals, setEditVals] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
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
  const getBgTheme = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return {
    img: '/bg-morning.JPEG',
    overlay: 'rgba(12,5,6,.88)',
    accent: '#c4786e',
    accentMuted: 'rgba(196,120,110,.8)',
    accentBorder: 'rgba(196,120,110,.25)',
    accentBg: 'rgba(196,120,110,.1)',
  };
  if (h >= 11 && h < 17) return {
    img: '/bg-midday.jpg',
    overlay: 'rgba(4,12,10,.9)',
    accent: '#7aaf96',
    accentMuted: 'rgba(120,170,145,.8)',
    accentBorder: 'rgba(120,170,145,.25)',
    accentBg: 'rgba(100,160,130,.1)',
  };
  return {
    img: '/bg-evening.JPEG',
    overlay: 'rgba(6,3,1,.9)',
    accent: '#c8845a',
    accentMuted: 'rgba(200,132,90,.8)',
    accentBorder: 'rgba(200,132,90,.25)',
    accentBg: 'rgba(200,132,90,.1)',
  };
};
const theme = getBgTheme();
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
      localStorage.setItem('sq_user_email', user.email);
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
  options: { redirectTo: window.location.origin, queryParams: { prompt: 'select_account' } }
});
  };

const handleSignOut = async () => {
  if (supabase) await supabase.auth.signOut();
  localStorage.clear();
  localStorage.removeItem('sq_guest');
  try { await window.storage.delete('profile'); await window.storage.delete('sessions'); await window.storage.delete('xp'); } catch{}
  setUserAvatar('');
  setUserId(null);
  setAuthUser(null);
  setProfile(null);
  setSessions({});
  setXp(0);
  setWheelRatings({});
  setYesterdaySession(null);
  setYesterdayAnswer(null);
  goTo("login");
};
  const submitFeedback = async () => {
  setFeedbackLoading(true);
  try {
    await supabase.from('feedback').insert([feedbackAnswers]);
    setFeedbackSubmitted(true);
  } catch(e) {}
  setFeedbackLoading(false);
};

const loadAdminFeedback = async () => {
  setAdminLoading(true);
  const {data} = await supabase.from('feedback').select('*').order('submitted_at',{ascending:false});
  setAdminFeedback(data||[]);
  setAdminLoading(false);
};
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
if (supabase) {
  const {data: energyData} = await supabase.from('energy_entries').select('*').eq('user_id', uid);
  setEnergyEntries(energyData || []);
}
    const savedRecapCache = dbProfile?.recap_cache || JSON.parse(localStorage.getItem('sq_recap_cache') || '{}');
setRecapCache(savedRecapCache);
    if (dbProfile?.ikigai) {
  setIkigai(dbProfile.ikigai.answers || {love:'',good:'',need:'',paid:''});
  setIkigaiSynthesis(dbProfile.ikigai.synthesis || '');
}
    // Check yesterday's session
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yDate = yesterday.toLocaleDateString('en-CA');
    if (dbSess && dbSess[yDate]) setYesterdaySession(dbSess[yDate]);
    // Pick daily affirmation
    const dayIdx = new Date().getDate() % 10;
    setAffirmation(AFFIRMATIONS[lang]?.[dayIdx] || AFFIRMATIONS.EN[0]);
    if (dbProfile) {
      const p = { name: googleName||dbProfile.name||'Friend', dob: dbProfile.dob, arcana: dbProfile.arcana, values: dbProfile.values||[], valueDepth: dbProfile.value_depth||{} };
      setProfile(p);
      setLang(dbProfile.lang||'EN');
      setWheelRatings(dbProfile.wheel_of_life||{});
      if (dbProfile.values?.length) {
        // Has session today and profile — show yesterday check first
        const alreadyAnsweredToday = dbProfile?.yesterday_answered === new Date().toLocaleDateString("en-CA");
      if (dbSess[new Date(Date.now()-86400000).toLocaleDateString('en-CA')] && !alreadyAnsweredToday) {
        setShowYesterday(true);
      }
      }
      goTo("paths");
    } else {
      // New user — set name from Google
      setProfile({ name: googleName||'Friend', values: [], valueDepth: {} });
      goTo("onboarding");
    }
  };

  const bootFromStorage = async () => {
    setWheelRatings({});
    const isGuest = localStorage.getItem('sq_guest');
    if (isGuest) {
      try { await window.storage.delete('profile'); } catch{}
      try { await window.storage.delete('sessions'); } catch{}
      try { await window.storage.delete('xp'); } catch{}
    }
    const p=await load("profile"), s=await load("sessions")||{};
    const savedXp=await load("xp")||0;
    setSessions(s); setXp(savedXp);
if (supabase) {
  const {data: energyData} = await supabase.from('energy_entries').select('*').eq('user_id', uid);
  setEnergyEntries(energyData || []);
}
    const dayIdx = new Date().getDate() % 10;
    setAffirmation(AFFIRMATIONS[lang]?.[dayIdx] || AFFIRMATIONS.EN[0]);
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    const yDate = yesterday.toLocaleDateString('en-CA');
    if (s && s[yDate]) setYesterdaySession(s[yDate]);
    if(p){setProfile(p);setLang(p.lang||"EN");goTo("paths");}
    else if(supabase && !localStorage.getItem('sq_guest')) goTo("login");
    else goTo("onboarding");
    const savedRecapCache = JSON.parse(localStorage.getItem('sq_recap_cache') || '{}');
    setRecapCache(savedRecapCache);
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
        body:JSON.stringify({model:"claude-sonnet-4-6",temperature:1,max_tokens:1200,system:VALUES_CHALLENGE_SYSTEM(lang,vals.length?vals:VALUES_LIST.slice(0,10)),messages:[{role:"user",content:"Generate the values challenge now."}]})});
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
        body:JSON.stringify({model:"claude-sonnet-4-6",temperature:1,max_tokens:600,system:VALUES_RESULT_SYSTEM(lang),
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

  const getWeekKey = (offset=0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset*7);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day===0?6:day-1));
  return monday.toLocaleDateString('en-CA');
};

const loadEnergyEntries = async () => {
  if (userId && supabase) {
    const {data} = await supabase.from('energy_entries').select('*').eq('user_id', userId);
    setEnergyEntries(data || []);
  }
};
  const loadIkigai = async () => {
  if (userId && supabase) {
    const {data} = await supabase.from('profiles').select('ikigai').eq('user_id', userId).single();
    if (data?.ikigai) {
      setIkigai(data.ikigai.answers || {love:'',good:'',need:'',paid:''});
      setIkigaiSynthesis(data.ikigai.synthesis || '');
    }
  }
};

const saveIkigai = async (answers, synthesis) => {
  if (userId && supabase) {
    await supabase.from('profiles').update({ikigai: {answers, synthesis}}).eq('user_id', userId);
  }
};

const generateIkigaiSynthesis = async (answers) => {
  setIkigaiLoading(true);
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        temperature: 1,
        system: `You are Alex Soleil, a warm and perceptive life coach. A user has completed their Ikigai exploration. Generate a synthesis in ${lang==='RU'?'Russian':lang==='ES'?'Latin American Spanish':'English'}. Output strict JSON only:
{"ikigai":"2-3 sentence synthesis of their reason for being based on all 4 answers. Warm, specific, not generic. Alex Soleil voice.","meaning":"1 paragraph connecting their answers to the 4 intersection zones (Passion, Mission, Profession, Vocation) — which are already active, which need development.","question":"One provocative question based on what's most alive or missing in their Ikigai."}`,
        messages: [{
          role: 'user',
          content: `What I love: ${answers.love}\nWhat I'm good at: ${answers.good}\nWhat the world needs: ${answers.need}\nWhat I can be paid for: ${answers.paid}\n\nGenerate my Ikigai synthesis.`
        }]
      })
    });
    const data = await res.json();
    const clean = (data.content?.[0]?.text || '').replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(clean);
    const synthesis = JSON.stringify(parsed);
    setIkigaiSynthesis(synthesis);
    await saveIkigai(answers, synthesis);
  } catch(e) {}
  setIkigaiLoading(false);
};
const generateRecap = async () => {
  setRecapLoading(true);
  const yr = calMonth.getFullYear();
  const mo = calMonth.getMonth();
  const cacheKey = `${yr}-${mo}`;
  const isCurrentMonth = yr === new Date().getFullYear() && mo === new Date().getMonth();
  if (!isCurrentMonth && recapCache[cacheKey]) {
    setRecapData(recapCache[cacheKey]);
    setRecapLoading(false);
    return;
  }
  const monthSessions = Object.entries(sessions).filter(([d]) => {
    const dt = new Date(d + 'T12:00');
    return dt.getFullYear() === yr && dt.getMonth() === mo;
  }).map(([d, s]) => s);

  if (monthSessions.length === 0) {
    setRecapData({ empty: true });
    setRecapLoading(false);
    return;
  }

  const challengeCounts = {};
  monthSessions.forEach(s => {
    const c = s.challenge || 'Other';
    challengeCounts[c] = (challengeCounts[c] || 0) + 1;
  });
  const topChallenges = Object.entries(challengeCounts).sort((a,b)=>b[1]-a[1]);
  const total = monthSessions.length;

  const sessionSummary = monthSessions.map(s =>
    `Challenge: ${s.challenge}. Insight: "${s.plan?.insight}". First step: "${s.first_step}".`
  ).join('\n');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1200,
        temperature: 1,
        system: `You are Alex Soleil, a warm and perceptive life coach. Analyze this user's monthly coaching sessions and generate a recap. Respond in ${lang==='RU'?'Russian':lang==='ES'?'Latin American Spanish':'English'}. Output strict JSON only, no markdown:
{"narrative":"2-3 sentence warm insightful read on the month — what pattern or theme stands out, what it reveals about this person. First person voice from Alex Soleil. Italic-worthy prose.","top2":[{"challenge":"challenge name","emoji":"emoji","questions":["question 1","question 2","question 3"],"practices":["practice suggestion 1","practice suggestion 2"]}]}
Make the questions specific to what came up in their sessions. Make practices concrete and actionable — journaling prompts, physical practices, daily habits. Not generic advice.`,
        messages: [{
          role: 'user',
          content: `Month: ${calMonth.toLocaleDateString('en-US', {month:'long', year:'numeric'})}. Total sessions: ${total}.\n\nSessions:\n${sessionSummary}\n\nTop challenges: ${topChallenges.slice(0,2).map(([c,n])=>`${c} (${n}x)`).join(', ')}.\n\nGenerate the monthly recap.`
        }]
      })
    });
    const data = await res.json();
    const clean = (data.content?.[0]?.text || '').replace(/```json|```/g,'').trim();
    const parsed = JSON.parse(clean);
    const result = { ...parsed, topChallenges, total, challengeCounts };
setRecapData(result);
if (!isCurrentMonth) setRecapCache(prev => {   const updated = {...prev, [cacheKey]: result};   localStorage.setItem('sq_recap_cache', JSON.stringify(updated));   if (userId && supabase) dbSaveProfile(userId, {recap_cache: updated});   return updated; });
  } catch(e) {
    const result = { error: true, topChallenges, total, challengeCounts };
setRecapData(result);
  }
  setRecapLoading(false);
};
  
  const addEnergyEntry = async () => {
  if (!energyInput.trim()) return;
  const entry = { id: Date.now().toString(), text: energyInput.trim(), type: energySection, rating: null, week: getWeekKey(energyWeekOffset) };
  const updated = [...energyEntries, entry];
  setEnergyEntries(updated);
  setEnergyInput('');
  if (userId && supabase) {
    await supabase.from('energy_entries').insert([{...entry, user_id: userId}]);
  }
};

const rateEnergyEntry = async (id, rating) => {
  const newRating = energyEntries.find(e=>e.id===id)?.rating === rating ? null : rating;
  const updated = energyEntries.map(e => e.id===id ? {...e, rating: newRating} : e);
  setEnergyEntries(updated);
  if (userId && supabase) {
    await supabase.from('energy_entries').update({rating: newRating}).eq('id', id).eq('user_id', userId);
  }
};

const deleteEnergyEntry = async (id) => {
  const updated = energyEntries.filter(e => e.id !== id);
  setEnergyEntries(updated);
  if (userId && supabase) {
    await supabase.from('energy_entries').delete().eq('id', id).eq('user_id', userId);
  }
};
  
  const saveProfile = async () => {
    const dob = buildDob(dobYear, dobMonth, dobDay);
    const lp=dob?calcArcana(dob):null;
    const p={name:nameInput.trim()||"Friend",dob:dob||null,arcana:lp,values:selValues,lang,createdAt:new Date().toISOString()};
    setProfile(p);
    if (userId) {
      await dbSaveProfile(userId, { dob:dob||null, arcana:lp, values:selValues, value_depth:{}, lang });
    } else {
      await save("profile",p);
    }
    setShowValChallenge(false); goTo("checkin");
  };

  // ── CHECKIN ──
  const toggleCheckin=(i)=>setCheckinSel(prev=>prev.includes(i)?[]:[i]);

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
    const currentEntry=conv[conv.length-1];
    setConv(prevConv);
    setQCount(q=>q-1);
    setSel(currentEntry?.selIdx||[]);
    setFreeText(currentEntry?.freeText||"");
    setCurrentQ(questionHistory[prevConv.length]||currentQ);
    setQuestionHistory(h=>h.slice(0,-1));
  }
};
  const startGame=async(c)=>{
    setChallenge(c);setConv([]);setQCount(0);setPlan(null);setQuestionHistory([]);
    setSel([]);setCurrentQ(null);setReadiness(null);
    setFirstStep(null);setStepOpts([]);setReflection("");setReflSaved(false);
    goTo("playing");setLoading(true);
    const ctx=checkinSel.map(i=>checkinOpts[i]).join("; ");
    const vals=profile?.values?.length?`Core values: ${profile.values.join(", ")}.`:"";
    const sameChallenge = yesterdaySession?.challenge === (lang==="RU"?c.labelRU:lang==="ES"?c.labelES:c.labelEN);
    const followUpCtx = (yesterdayFollowUpRef.current && yesterdayFollowUpRef.current!=="skipped" && sameChallenge) ? `Yesterday's follow-up on "${yesterdaySession?.challenge}": ${yesterdayFollowUpRef.current}.` : "";
    const prompt=`User: ${profile?.name}. Check-in: "${ctx}". ${vals} ${followUpCtx} Challenge: "${c.labelEN}" — ${c.descEN}. Ask Q1. Max 15 words. Warm and direct. ${c.id==="good"?"Focus on what's working and what to deepen.":c.id==="challenge"?"Challenge a belief or assumption. Be provocative.":""}`;
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
    const newConv=[...conv,{q:currentQ.question,a:aText,phase:currentQ.phase,multi:isMulti,options:currentQ.options,selIdx:sel,freeText:freeText.trim()}];
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
        body:JSON.stringify({model:"claude-sonnet-4-6",temperature:1,max_tokens:1400,system:SYSTEM(lang),messages})});
      const data=await res.json();
      const clean=(data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
      const parsed=JSON.parse(clean);
      if(parsed.type==="plan"){setPlan(parsed);goTo("readiness");}
      else{setCurrentQ(parsed);setQuestionHistory(h=>[...h,parsed]);setQCount(depth+1);}
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
        body:JSON.stringify({model:"claude-sonnet-4-6",temperature:1,max_tokens:500,system:SYSTEM(lang),
          messages:[{role:"user",content:`Readiness: ${r}/10 (${tone}). Insight: "${plan?.insight}". Generate 4 first step options calibrated to readiness. JSON only: {"options":["a","b","c","d"]}`}]})});
      const data=await res.json();
      const clean=(data.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
      setStepOpts(JSON.parse(clean).options||fbSteps(r));
    }catch{setStepOpts(fbSteps(r));}
    setLoading(false);
  };

  const doSave=async()=>{
    if(!userId){
  setShowSignInPrompt(true);
  return;
}
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
    const lp=dob?calcArcana(dob):profile.arcana;
    const u={...profile,name:editName||profile.name,dob,arcana:lp};
    setProfile(u);
    if (userId) await dbSaveProfile(userId, { dob, arcana:lp, name:editName||profile.name });
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
    .ntab{padding:6px 12px;border-radius:7px;font-size:14px;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;transition:all .15s;white-space:nowrap;font-weight:400;}
    .ntab.on{background:rgba(212,163,89,.12);color:#d4a359;font-weight:400;}.ntab.off{background:transparent;color:rgba(212,163,89,.45);font-weight:400;}.ntab.off:hover{color:rgba(212,163,89,.8);}
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
    .desktop-nav{display:flex;gap:1px;}
.mobile-nav{display:none;}
.mobile-bottom-nav{display:none;}
@media(max-width:600px){
  .desktop-nav{display:none;}
  .mobile-nav{display:flex;}
  .mobile-bottom-nav{position:fixed;bottom:0;left:0;right:0;display:flex;background:rgba(12,12,16,.97);border-top:0.5px solid rgba(255,255,255,.08);padding:8px 0 18px;z-index:50;}
  .desktop-only{display:none!important;}
}
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
      {showFeedback && (
  <div className="modal-bg" onClick={()=>setShowFeedback(false)}>
    <div className="modal" style={{maxWidth:feedbackSubmitted?260:500,maxHeight:"85vh",overflowY:"auto",background:feedbackSubmitted?"#16161e":undefined,border:feedbackSubmitted?"0.5px solid rgba(255,255,255,.1)":undefined,padding:feedbackSubmitted?"8px 22px":undefined}} onClick={e=>e.stopPropagation()}>
      {feedbackSubmitted ? (
  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"8px 4px"}}>
    <p style={{fontFamily:"Fraunces,serif",fontSize:15,fontWeight:600}}>Thank you!</p>
    <button className="gbtn" style={{fontSize:12,padding:"5px 14px"}} onClick={()=>setShowFeedback(false)}>Close</button>
  </div>
      ) : userId==='7bf3f94a-22f3-4304-9530-0ddeaec6d09e' && authUser ? (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <p style={{fontFamily:"Fraunces,serif",fontSize:17,fontWeight:600}}>Feedback</p>
              <p style={{fontSize:11,color:"rgba(240,236,228,.35)",marginTop:3}}>Admin view · newest first</p>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{background:"rgba(212,163,89,.12)",border:"0.5px solid rgba(212,163,89,.25)",color:"#d4a359",borderRadius:20,padding:"2px 10px",fontSize:11}}>{adminFeedback.length} responses</span>
              <button className="tbtn" onClick={()=>setShowFeedback(false)}>✕</button>
            </div>
          </div>
          {adminLoading ? (
            <p style={{fontSize:13,color:"rgba(240,236,228,.3)",textAlign:"center",padding:"20px 0"}}>Loading<span className="dot">.</span><span className="dot dot2">.</span><span className="dot dot3">.</span></p>
          ) : adminFeedback.length===0 ? (
            <p style={{fontSize:13,color:"rgba(240,236,228,.3)",textAlign:"center",padding:"20px 0"}}>No responses yet.</p>
          ) : adminFeedback.map((f,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.04)",border:`0.5px solid ${expandedFeedback===i?"rgba(212,163,89,.25)":"rgba(255,255,255,.08)"}`,borderRadius:12,padding:"12px 16px",marginBottom:8,cursor:"pointer"}} onClick={()=>setExpandedFeedback(expandedFeedback===i?null:i)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <p style={{fontSize:13,color:"rgba(240,236,228,.65)"}}>{new Date(f.submitted_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
                <span style={{fontSize:12,color:"rgba(240,236,228,.28)",transition:"transform .2s",display:"inline-block",transform:expandedFeedback===i?"rotate(90deg)":"none"}}>›</span>
              </div>
              {expandedFeedback===i&&(
                <div style={{marginTop:12,borderTop:"0.5px solid rgba(255,255,255,.07)",paddingTop:12,display:"flex",flexDirection:"column",gap:10}}>
                  {[['What hit you',f.q1],['Where you got stuck',f.q2],['Come back tomorrow?',f.q3],['What was missing',f.q4],['One word',f.q5],['When you thought about using it and not',f.q6],['Anything else',f.q7]].filter(([,v])=>v).map(([label,val],j)=>(
                    <div key={j}>
                      <p style={{fontSize:10,color:"rgba(240,236,228,.3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>{label}</p>
                      {label==='One word' ? <span style={{background:"rgba(212,163,89,.1)",border:"0.5px solid rgba(212,163,89,.2)",borderRadius:20,padding:"3px 10px",fontSize:13,color:"#d4a359"}}>{val}</span> : <p style={{fontSize:13,color:"rgba(240,236,228,.78)",lineHeight:1.55}}>{val}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".08em"}}>Beta Feedback</p>
            <button className="tbtn" onClick={()=>setShowFeedback(false)}>✕</button>
          </div>
          <p style={{fontFamily:"Fraunces,serif",fontSize:18,fontWeight:600,marginBottom:6}}>A few things I'm curious about</p>
          <p style={{fontSize:13,color:"rgba(240,236,228,.42)",lineHeight:1.6,marginBottom:22}}>No wrong answers — brutal honesty is more useful than being nice 🙏<br/><span style={{fontSize:11,color:"rgba(240,236,228,.25)"}}>Anonymous</span></p>
          {[
            {key:'q1',num:'01',q:L("Did anything hit you or feel real?","Что-то зацепило или показалось настоящим?","¿Algo te llegó o se sintió real?"),ph:L("What landed...","Что зацепило...","Lo que llegó..."),type:'textarea'},
            {key:'q2',num:'02',q:L("Where did you get stuck or lose interest?","Где застрял/а или потерял/а интерес?","¿Dónde te atascaste o perdiste interés?"),ph:L("Where things fell flat...","Где потерялся интерес...","Dónde las cosas se apagaron..."),type:'textarea'},
            {key:'q3',num:'03',q:L("Would you come back tomorrow?","Вернулся/лась бы завтра?","¿Volverías mañana?"),type:'select',opts:[L("Yes, for sure","Да, точно","Sí, seguro"),L("Maybe","Возможно","Quizás"),L("Probably not","Скорее нет","Probablemente no")]},
            {key:'q4',num:'04',q:L("What was missing?","Чего не хватало?","¿Qué faltaba?"),ph:L("What you wished was there...","Чего не хватало...","Lo que hubiera querido ver..."),type:'textarea'},
            {key:'q5',num:'05',q:L("One word for how it felt overall?","Одно слово — как это ощущалось?","¿Una palabra para describir cómo se sintió?"),ph:L("e.g. real, heavy, interesting...","например: настоящее, тяжело, интересно...","ej: real, pesado, interesante..."),type:'input'},
            {key:'q6',num:'06',q:L("When did you think about using it and not?","Когда думал/а воспользоваться, но не стал/а?","¿Cuándo pensaste usarlo y no lo hiciste?"),ph:L("What got in the way...","Что помешало...","Qué se interpuso..."),type:'textarea'},
            {key:'q7',num:'07',q:L("Anything else you'd like to share?","Есть что-то ещё?","¿Algo más que quieras compartir?"),ph:L("Open floor...","Всё остальное...","Lo que quieras..."),type:'textarea'},
          ].map(({key,num,q,ph,type,opts})=>(
            <div key={key} style={{marginBottom:18}}>
              <p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}}>{num}</p>
              <p style={{fontSize:14,color:"rgba(240,236,228,.85)",marginBottom:9,lineHeight:1.5}}>{q}</p>
              {type==='textarea' && <textarea rows={2} placeholder={ph} value={feedbackAnswers[key]} onChange={e=>setFeedbackAnswers(p=>({...p,[key]:e.target.value}))}/>}
              {type==='input' && <input type="text" placeholder={ph} value={feedbackAnswers[key]} onChange={e=>setFeedbackAnswers(p=>({...p,[key]:e.target.value}))}/>}
              {type==='select' && (
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {opts.map((o,i)=>(
                    <button key={i} className={`obtn ${feedbackAnswers[key]===o?"sel":""}`} onClick={()=>setFeedbackAnswers(p=>({...p,[key]:o}))}>
                      <span style={{color:feedbackAnswers[key]===o?"#d4a359":"rgba(240,236,228,.2)",marginRight:8,fontSize:12}}>{feedbackAnswers[key]===o?"✓":"○"}</span>{o}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button className="pbtn" onClick={submitFeedback} disabled={feedbackLoading}>
            {feedbackLoading ? L("Sending...","Отправляю...","Enviando...") : L("Submit feedback →","Отправить →","Enviar →")}
          </button>
        </div>
      )}
    </div>
  </div>
)}
      {showSignInPrompt && (
  <div className="modal-bg">
    <div className="modal">
      <p style={{fontFamily:"Fraunces,serif",fontSize:17,fontWeight:600,marginBottom:10,lineHeight:1.3}}>{L("Sign in to save your practice","Войди чтобы сохранить практику","Inicia sesión para guardar tu práctica")}</p>
      <p style={{fontSize:14,color:"rgba(240,236,228,.55)",lineHeight:1.6,marginBottom:20}}>{L("It takes 5 seconds — and your progress will be saved.","Это займёт 5 секунд — и твой прогресс будет сохранён.","Toma 5 segundos — y tu progreso quedará guardado.")}</p>
      <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
        <button className="pbtn" style={{fontSize:13,padding:"9px 18px"}} onClick={()=>{setShowSignInPrompt(false);signInWithGoogle();}}>{L("Sign in with Google","Войти через Google","Iniciar sesión con Google")}</button>
        <button className="gbtn" style={{fontSize:13}} onClick={()=>setShowSignInPrompt(false)}>{L("Not now","Не сейчас","Ahora no")}</button>
      </div>
    </div>
  </div>
)}
      <TooltipModal/>

      {xpMilestone && (
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#1a1410",border:"0.5px solid rgba(212,163,89,.4)",borderRadius:12,padding:"12px 20px",zIndex:300,textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
          <p style={{fontSize:14,color:"#d4a359",fontWeight:500}}>{xpMilestone}</p>
        </div>
      )}

      {/* NAV */}
      {screen!=="onboarding"&&screen!=="boot"&&screen!=="login"&&(
  <>
    {/* TOP NAV */}
    <div style={{position:"sticky",top:0,zIndex:50,padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(12,12,16,.92)",backdropFilter:"blur(16px)",borderBottom:"0.5px solid rgba(255,255,255,.06)",gap:8}}>
      <span style={{fontFamily:"Fraunces,serif",fontSize:18,color:"#d4a359",fontWeight:600,flexShrink:0,letterSpacing:"-.3px",cursor:"pointer"}} onClick={()=>goTo("paths")}>Alex Soleil</span>
      <div style={{display:"flex",gap:1,flexShrink:0}}>
        {/* Desktop: show all tabs */}
        <div className="desktop-nav">
          {[["howto",L("How It Works","Как работает","Cómo funciona")],["home","✦ Soleil Quest ✦"],["practices",L("Practices","Практики","Prácticas")],["whoami",L("My Vault","Мой Архив","Mi Bóveda")],["talk","Talk to Alex"]].map(([k,label])=>(
            <button key={k} className={`ntab ${tab===k?"on":"off"}`} style={k==="home"?{color:tab==="home"?"rgba(160,140,220,.9)":"rgba(160,140,220,.5)",fontWeight:700,fontSize:12,letterSpacing:"0.05em"}:{}} onClick={()=>{setTab(k);goTo(k==="home"?"checkin":k==="talk"?"talk":k);}}>{label}</button>
          ))}
        </div>
        {/* Mobile: show only Soleil Quest */}
        <div className="mobile-nav">
          <button className={`ntab ${tab==="home"?"on":"off"}`} style={{color:tab==="home"?"rgba(160,140,220,.9)":"rgba(160,140,220,.5)",fontWeight:700,fontSize:12,letterSpacing:"0.05em"}} onClick={()=>{setTab("home");goTo("checkin");}}>✦ Soleil Quest ✦</button>
        </div>
      </div>
      <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
        <button onClick={()=>{setShowFeedback(true);setFeedbackSubmitted(false);setFeedbackAnswers({q1:'',q2:'',q3:'',q4:'',q5:'',q6:'',q7:''}); if(userId==='7bf3f94a-22f3-4304-9530-0ddeaec6d09e') loadAdminFeedback();}} style={{background:"rgba(255,255,255,.05)",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:7,padding:"4px 8px",color:"#f0ece4",fontFamily:"'DM Sans',sans-serif",fontSize:14,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:4,lineHeight:1}} className="desktop-only">💬 <span>Feedback</span></button>        {xp>0&&<span style={{background:"rgba(212,163,89,.1)",border:"0.5px solid rgba(212,163,89,.22)",borderRadius:7,padding:"4px 8px",fontSize:14,color:"#d4a359",display:"inline-flex",alignItems:"center",lineHeight:1}}>⚡{xp.toLocaleString()}</span>}
        <div style={{position:"relative"}}>
          <button onClick={()=>setLangOpen(o=>!o)} style={{background:"rgba(255,255,255,.05)",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:7,padding:"4px 8px",color:"#f0ece4",fontFamily:"'DM Sans',sans-serif",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:4,lineHeight:1}}>
  {lang} <span style={{fontSize:11,opacity:.5,lineHeight:1}}>▾</span>
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
        {userAvatar && (
  <div style={{position:"relative",display:"inline-block"}}>
    <img 
      src={userAvatar} 
      alt="" 
      style={{width:26,height:26,borderRadius:"50%",border:"1.5px solid rgba(212,163,89,.3)",cursor:"pointer",display:"block"}} 
      onError={e=>e.target.style.display='none'}
      onClick={()=>setShowSignOut(prev=>!prev)}
    />
    {showSignOut && (
      <>
        <div onClick={()=>setShowSignOut(false)} style={{position:"absolute",top:"-100vh",left:"-100vw",width:"200vw",height:"200vh",zIndex:998}}/>
        <div style={{position:"absolute",right:0,top:34,zIndex:999,background:"#22203a",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,overflow:"hidden",boxShadow:"0 8px 28px rgba(0,0,0,0.5)",minWidth:196}}>
          <div style={{padding:"13px 15px 11px",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
            <div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.85)",marginBottom:3,fontFamily:"'DM Sans',sans-serif"}}>{localStorage.getItem('sq_user_name')||'Friend'}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif"}}>{localStorage.getItem('sq_user_email')||''}</div>
          </div>
          <div 
            onClick={handleSignOut}
            style={{display:"flex",alignItems:"center",gap:9,padding:"11px 15px",fontSize:13,color:"rgba(255,255,255,0.6)",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
          >
            ↪ Sign out
          </div>
        </div>
      </>
        )}
      </div>
    )}
  </div>
</div>  
{/* MOBILE BOTTOM NAV */}
    <div className="mobile-bottom-nav">
      {[
  ["howto","○",L("How It Works","Как работает","Cómo funciona")],
  ["practices","◎",L("Practices","Практики","Prácticas")],
  ["whoami","◈",L("My Vault","Мой Архив","Mi Bóveda")],
  ["talk","✉","Talk to Alex"],
  ["feedback","💬","Feedback"],
].map(([k,icon,label])=>(
  <button key={k} onClick={()=>{
    if(k==="feedback"){setShowFeedback(true);setFeedbackSubmitted(false);setFeedbackAnswers({q1:'',q2:'',q3:'',q4:'',q5:'',q6:'',q7:''});if(userId==='7bf3f94a-22f3-4304-9530-0ddeaec6d09e')loadAdminFeedback();return;}
    setTab(k);goTo(k==="talk"?"talk":k);}}
    style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"transparent",border:"none",cursor:"pointer",padding:"4px 2px"}}>
    <span style={{fontSize:16,color:tab===k?"#d4a359":"rgba(212,163,89,.35)"}}>{icon}</span>
    <span style={{fontSize:9,color:tab===k?"#d4a359":"rgba(212,163,89,.35)",fontFamily:"'DM Sans',sans-serif",letterSpacing:".02em",fontWeight:tab===k?500:400}}>{label}</span>
    {tab===k&&<span style={{width:3,height:3,borderRadius:"50%",background:"#d4a359",display:"block"}}/>}
  </button>
))}
    </div>
  </>
)}
      <div style={{maxWidth:600,margin:"0 auto",padding:"0 18px 80px",position:"relative",zIndex:1}}>
        {/* BOOT */}
        {screen==="boot"&&<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><p style={{color:"rgba(240,236,228,.3)",fontSize:14}}>{L("Loading","Загрузка","Cargando")}<span className="dot">.</span><span className="dot dot2">.</span><span className="dot dot3">.</span></p></div>}

        {/* LOGIN */}
        {screen==="login"&&(
  <div key={animKey} style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"40px 20px"}}>
    <div style={{position:"absolute",inset:0,backgroundImage:`url('${theme.img}')`,backgroundSize:"cover",backgroundPosition:"center center",zIndex:0}}/>
    <div style={{position:"absolute",inset:0,background:`linear-gradient(to top, ${theme.overlay} 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,.15) 100%)`,zIndex:1}}/>
    <div style={{position:"relative",zIndex:2,width:"100%",maxWidth:400}}>
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
            <p className="up d1" style={{fontFamily:"Fraunces,serif",fontSize:28,fontWeight:600,color:"#d4a359",marginBottom:12,letterSpacing:"-.5px",position:"relative",zIndex:2}}>Alex Soleil</p>
            <h1 className="up d2" style={{fontFamily:"Fraunces,serif",fontSize:38,fontWeight:600,lineHeight:1.1,marginBottom:16,letterSpacing:"-1px"}}>
              {L("Find your ","Найди свою ","Encuentra tu ")}<em style={{color:"#d4a359"}}>{L("inner spark.","искру.","chispa interior.")}</em>
            </h1>
            <p className="up d3" style={{fontSize:15,lineHeight:1.75,color:"rgba(240,236,228,.52)",marginBottom:44,maxWidth:360}}>{L("A daily coaching practice that starts from the inside out.","Ежедневная коучинговая практика, которая начинается изнутри.","Una práctica de coaching diaria que empieza desde adentro.")}</p>
            <div className="up d4" style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
              <button onClick={signInWithGoogle} style={{background:"white",color:"#333",border:"none",borderRadius:8,padding:"12px 24px",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:10,width:280,justifyContent:"center"}}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
                Continue with Google
              </button>
              <button className="tbtn" onClick={()=>{localStorage.setItem('sq_guest','1');bootFromStorage();}}>
                {L("Continue without signing in →","Продолжить без входа →","Continuar sin iniciar sesión →")}
              </button>
            </div>
          </div>
        </div>
        )}

{/* PATHS */}
{screen==="paths"&&(
  <div key={animKey} style={{position:"fixed",inset:0,zIndex:10}}>
    <div style={{position:"absolute",inset:0,backgroundImage:`url('${theme.img}')`,backgroundSize:"cover",backgroundPosition:theme.position||"center center"}}/>
    <div style={{position:"absolute",inset:0,background:`linear-gradient(to top, ${theme.overlay} 0%, rgba(0,0,0,.5) 45%, rgba(0,0,0,.1) 100%)`}}/>
    <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 24px"}}>
      <h2 style={{fontFamily:"Cormorant Garamond,Georgia,serif",fontSize:28,fontWeight:300,lineHeight:1.2,color:"#f5ede0",marginBottom:32,textAlign:"center"}}>{L("What feels right at the moment?","Что кажется правильным прямо сейчас?","¿Qué se siente bien en este momento?")}</h2>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:400}}>
        {[
          {icon:"✦",title:L("Soleil Quest","Soleil Quest","Soleil Quest"),desc:L("Your daily check-in — choose your focus, go deeper.","Твой ежедневный чек-ин — выбери фокус, иди глубже.","Tu check-in diario — elige tu enfoque, ve más profundo."),action:()=>goTo("checkin")},
          {icon:"◎",title:L("Deep Dive a Challenge","Погрузись в вызов","Sumérgete en un Desafío"),desc:L("Get to the bottom of something specific.","Доберись до сути чего-то конкретного.","Llega al fondo de algo específico."),action:()=>goTo("deepdive")},
          {icon:"◈",title:L("Practice Library","Библиотека практик","Biblioteca de Prácticas"),desc:L("Explore practices at your own pace.","Исследуй практики в своём темпе.","Explora prácticas a tu propio ritmo."),action:()=>goTo("library")},
        ].map((r,i)=>(
          <div key={i} onClick={r.action} style={{background:theme.accentBg,border:`0.5px solid ${theme.accentBorder}`,borderRadius:14,padding:"18px 20px",cursor:"pointer",transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.background=`rgba(255,255,255,.08)`}
            onMouseLeave={e=>e.currentTarget.style.background=theme.accentBg}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:5}}>
              <span style={{fontSize:18,color:theme.accent}}>{r.icon}</span>
              <span style={{fontFamily:"Cormorant Garamond,Georgia,serif",fontSize:18,fontWeight:600,color:"#f5ede0"}}>{r.title}</span>
            </div>
            <p style={{fontSize:12,color:"rgba(255,255,255,.62)",lineHeight:1.4,paddingLeft:30,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

{/* DEEP DIVE PLACEHOLDER */}
{screen==="deepdive"&&(
  <div key={animKey} style={{paddingTop:40}}>
    <button className="tbtn" style={{marginBottom:16}} onClick={()=>goTo("paths")}>← {L("Back","Назад","Volver")}</button>
    <p style={{fontSize:12,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>Deep Dive</p>
    <h2 style={{fontFamily:"Fraunces,serif",fontSize:24,fontWeight:600,marginBottom:12}}>Coming soon</h2>
    <p style={{fontSize:14,color:"rgba(240,236,228,.45)",lineHeight:1.65}}>This is where you'll get to the bottom of a specific challenge.</p>
  </div>
)}

{/* LIBRARY */}
{screen==="library"&&(
  <div key={animKey} style={{paddingTop:40}}>
    <button className="tbtn" style={{marginBottom:16}} onClick={()=>goTo("paths")}>← {L("Back","Назад","Volver")}</button>
    <p style={{fontSize:12,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>{L("Practice Library","Библиотека практик","Biblioteca de Prácticas")}</p>
    <h2 style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600,marginBottom:10}}>{L("Explore at your own pace","Исследуй в своём темпе","Explora a tu propio ritmo")}</h2>
    <p style={{fontSize:13,color:"rgba(240,236,228,.48)",lineHeight:1.65,marginBottom:26}}>{L("A collection of practices to deepen your self-knowledge, beyond the daily quest.","Коллекция практик для углубления самопознания.","Una colección de prácticas para profundizar tu autoconocimiento.")}</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      <div onClick={()=>{loadEnergyEntries();goTo("energyaudit");}} style={{background:"rgba(122,175,150,.08)",border:"0.5px solid rgba(122,175,150,.22)",borderRadius:13,padding:13,cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:17}}>⚡</span>
          <span style={{fontFamily:"Fraunces,serif",fontSize:13,fontWeight:600,color:"#7aaf96"}}>{L("Energy Audit","Аудит энергии","Auditoría de Energía")}</span>
        </div>
        <p style={{fontSize:10.5,color:"rgba(122,175,150,.65)",lineHeight:1.4,marginTop:5}}>{L("Track what fills you up and what drains you.","Отслеживай, что наполняет, а что истощает.","Rastrea lo que te llena y lo que te agota.")}</p>
      </div>
      <div onClick={()=>{loadIkigai();goTo("ikigai");}} style={{background:"rgba(122,175,150,.08)",border:"0.5px solid rgba(122,175,150,.22)",borderRadius:13,padding:13,position:"relative",cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:17}}>🌅</span>
          <span style={{fontFamily:"Fraunces,serif",fontSize:13,fontWeight:600,color:"#7aaf96"}}>Ikigai</span>
        </div>
        <p style={{fontSize:10.5,color:"rgba(122,175,150,.65)",lineHeight:1.4,marginTop:5}}>{L("Find your overlap of love, skill, purpose.","Найди пересечение любви, навыка, цели.","Encuentra tu superposición de amor, habilidad, propósito.")}</p>
      </div>
    </div>
  </div>
)}

{/* ENERGY AUDIT */}
{screen==="energyaudit"&&(
  <div key={animKey} style={{paddingTop:40}}>
    <button className="tbtn" style={{marginBottom:16}} onClick={()=>goTo("library")}>← {L("Back","Назад","Volver")}</button>
    <p style={{fontSize:12,color:"#7aaf96",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>{L("Practice Library","Библиотека практик","Biblioteca de Prácticas")}</p>
    <h2 style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600,marginBottom:10}}>{L("Energy Audit","Аудит энергии","Auditoría de Energía")}</h2>
    <p style={{fontSize:13,color:"rgba(240,236,228,.48)",lineHeight:1.65,marginBottom:20}}>{L("Log your activities and notice which ones fill you up and which ones drain you.","Записывай свои действия и замечай, что наполняет, а что истощает.","Registra tus actividades y nota cuáles te llenan y cuáles te agotan.")}</p>

    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,background:"rgba(255,255,255,.03)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:10,padding:"8px 12px"}}>
      <button onClick={()=>setEnergyWeekOffset(o=>o-1)} style={{background:"transparent",border:"none",color:"rgba(240,236,228,.4)",fontSize:16,cursor:"pointer",padding:"2px 6px"}}>‹</button>
      <span style={{fontSize:12,color:energyWeekOffset===0?"#7aaf96":"rgba(240,236,228,.6)"}}>{energyWeekOffset===0?L("This week","Эта неделя","Esta semana"):energyWeekOffset<0?L(`${Math.abs(energyWeekOffset)} week(s) ago`,`${Math.abs(energyWeekOffset)} нед. назад`,`hace ${Math.abs(energyWeekOffset)} semana(s)`):L(`In ${energyWeekOffset} week(s)`,`через ${energyWeekOffset} нед.`,`en ${energyWeekOffset} semana(s)`)}</span>
      <button onClick={()=>setEnergyWeekOffset(o=>o+1)} style={{background:"transparent",border:"none",color:"rgba(240,236,228,.4)",fontSize:16,cursor:"pointer",padding:"2px 6px"}}>›</button>
    </div>

    <div style={{display:"flex",gap:6,marginBottom:18}}>
      {['weekday','weekend'].map(s=>(
        <button key={s} onClick={()=>setEnergySection(s)} style={{flex:1,textAlign:"center",padding:9,borderRadius:9,fontSize:13,cursor:"pointer",border:`0.5px solid ${energySection===s?"#7aaf96":"rgba(255,255,255,.08)"}`,background:energySection===s?"rgba(122,175,150,.13)":"rgba(255,255,255,.04)",color:energySection===s?"#7aaf96":"rgba(240,236,228,.5)",fontWeight:energySection===s?500:400}}>
          {s==='weekday'?L("Weekday","Будни","Día laboral"):L("Weekend","Выходные","Fin de semana")}
        </button>
      ))}
    </div>

    <div style={{display:"flex",gap:8,marginBottom:20}}>
      <input type="text" value={energyInput} onChange={e=>setEnergyInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addEnergyEntry()} placeholder={L("What did you do...","Что ты делал(а)...","¿Qué hiciste...")} style={{flex:1}}/>
      <button className="pbtn" style={{padding:"0 16px"}} onClick={addEnergyEntry}>{L("Add","Добавить","Añadir")}</button>
    </div>

    {energyEntries.filter(e=>e.type===energySection && e.week===getWeekKey(energyWeekOffset)).length===0 ? (
      <p style={{fontSize:13,color:"rgba(240,236,228,.25)",textAlign:"center",padding:"20px 0"}}>{L("No entries yet for this section.","Пока нет записей.","Aún no hay entradas.")}</p>
    ) : energyEntries.filter(e=>e.type===energySection && e.week===getWeekKey(energyWeekOffset)).map(entry=>(
      <div key={entry.id} style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:12,padding:"13px 15px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
        <span style={{fontSize:13,color:"rgba(240,236,228,.85)",flex:1}}>{entry.text}</span>
        <div style={{display:"flex",gap:5,flexShrink:0}}>
          {entry.rating ? (
            <span onClick={()=>rateEnergyEntry(entry.id,entry.rating)} style={{padding:"5px 10px",borderRadius:20,fontSize:11,cursor:"pointer",border:"0.5px solid",whiteSpace:"nowrap",
              ...(entry.rating==='gain'?{background:"rgba(122,175,150,.12)",borderColor:"rgba(122,175,150,.3)",color:"#7aaf96"}:
                 entry.rating==='drain'?{background:"rgba(196,120,110,.12)",borderColor:"rgba(196,120,110,.3)",color:"#c4786e"}:
                 {background:"rgba(255,255,255,.05)",borderColor:"rgba(255,255,255,.15)",color:"rgba(240,236,228,.4)"})}}>
              {entry.rating==='gain'?`⚡ ${L("Gain","Прирост","Gana")}`:entry.rating==='drain'?`🔋 ${L("Drain","Потеря","Drena")}`:`— ${L("Same","Так же","Igual")}`}
            </span>
          ) : (
            <>
              <span onClick={()=>rateEnergyEntry(entry.id,'gain')} style={{padding:"5px 8px",borderRadius:20,fontSize:10,cursor:"pointer",border:"0.5px solid rgba(255,255,255,.1)",color:"rgba(240,236,228,.3)"}}>{L("Gain","Прирост","Gana")}</span>
              <span onClick={()=>rateEnergyEntry(entry.id,'drain')} style={{padding:"5px 8px",borderRadius:20,fontSize:10,cursor:"pointer",border:"0.5px solid rgba(255,255,255,.1)",color:"rgba(240,236,228,.3)"}}>{L("Drain","Потеря","Drena")}</span>
              <span onClick={()=>rateEnergyEntry(entry.id,'same')} style={{padding:"5px 8px",borderRadius:20,fontSize:10,cursor:"pointer",border:"0.5px solid rgba(255,255,255,.1)",color:"rgba(240,236,228,.3)"}}>{L("Same","Так же","Igual")}</span>
            </>
          )}
          <span onClick={()=>deleteEnergyEntry(entry.id)} style={{color:"rgba(240,236,228,.2)",fontSize:14,cursor:"pointer",padding:"0 2px"}}>✕</span>
        </div>
      </div>
    ))}

    {(() => {
      const weekEntries = energyEntries.filter(e=>e.week===getWeekKey(energyWeekOffset));
      const gain = weekEntries.filter(e=>e.rating==='gain').length;
      const drain = weekEntries.filter(e=>e.rating==='drain').length;
      const same = weekEntries.filter(e=>e.rating==='same').length;
      return weekEntries.length>0 ? (
        <div style={{marginTop:24,paddingTop:18,borderTop:"0.5px solid rgba(255,255,255,.08)"}}>
          <p style={{fontSize:11,color:"rgba(240,236,228,.3)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>{L("This week so far","Эта неделя","Esta semana")}</p>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"rgba(240,236,228,.6)",padding:"5px 0"}}><span>⚡ {L("Energy-giving","Дающие энергию","Que dan energía")}</span><span style={{color:"#7aaf96",fontWeight:500}}>{gain}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"rgba(240,236,228,.6)",padding:"5px 0"}}><span>🔋 {L("Energy-draining","Истощающие","Que agotan")}</span><span style={{color:"#c4786e",fontWeight:500}}>{drain}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"rgba(240,236,228,.6)",padding:"5px 0"}}><span>— {L("Neutral","Нейтральные","Neutral")}</span><span style={{color:"rgba(240,236,228,.5)",fontWeight:500}}>{same}</span></div>
        </div>
      ) : null;
    })()}
  </div>
)}  
        
{/* IKIGAI */}
{screen==="ikigai"&&(
  <div key={animKey} style={{paddingTop:40}}>
    <button className="tbtn" style={{marginBottom:16}} onClick={()=>goTo("library")}>← {L("Back","Назад","Volver")}</button>
    <p style={{fontSize:12,color:"#7aaf96",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>{L("Practice Library","Библиотека практик","Biblioteca de Prácticas")}</p>
    <h2 style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600,marginBottom:6}}>{L("Ikigai Exploration","Исследование Икигай","Exploración del Ikigai")}</h2>
    <p style={{fontSize:13,color:"rgba(240,236,228,.48)",lineHeight:1.65,marginBottom:24}}>{L("Your reason for being — where love, skill, purpose and livelihood meet.","Твоя причина существовать — там, где любовь, навык, цель и средства к жизни встречаются.","Tu razón de ser — donde el amor, la habilidad, el propósito y el sustento se encuentran.")}</p>

    {/* DIAGRAM */}
    {(()=>{
      const tipData = {
        passion: {title:L("Passion","Страсть","Pasión"), desc:L("Love + Good At. Energizing and natural — but without connection to what the world needs, it can feel self-indulgent.","Любовь + Умение. Заряжает и приходит естественно — но без связи с тем, что нужно миру, может ощущаться как самоудовлетворение.","Amor + Bueno en ello. Energizante y natural — pero sin conexión con lo que el mundo necesita, puede sentirse autoindulgente."), gap:L("Without 'What the world needs' → Satisfaction, but feeling of uselessness","Без 'Что нужно миру' → Удовлетворение, но ощущение бесполезности","Sin 'Lo que el mundo necesita' → Satisfacción, pero sensación de inutilidad")},
        mission: {title:L("Mission","Миссия","Misión"), desc:L("Love + World Needs. You care deeply and it matters — but without livelihood, passion alone can exhaust you.","Любовь + Потребности мира. Ты искренне заботишься — но без дохода страсть может истощить.","Amor + Lo que el mundo necesita. Te importa profundamente — pero sin sustento, la pasión sola puede agotarte."), gap:L("Without 'What you can be paid for' → Delight and fullness, but no wealth","Без 'За что могут платить' → Радость и полнота, но без богатства","Sin 'Por lo que puedes ser pagado' → Deleite y plenitud, pero sin riqueza")},
        profession: {title:L("Profession","Профессия","Profesión"), desc:L("Good At + Paid For. Skilled and compensated — but without love or meaning, it can feel hollow.","Умение + Оплата. Мастерство и вознаграждение — но без любви или смысла может ощущаться пустым.","Bueno en ello + Pagado. Hábil y compensado — pero sin amor o significado, puede sentirse vacío."), gap:L("Without 'What you love' → Comfortable, but feeling of emptiness","Без 'Что ты любишь' → Комфорт, но ощущение пустоты","Sin 'Lo que amas' → Cómodo, pero sensación de vacío")},
        vocation: {title:L("Vocation","Призвание","Vocación"), desc:L("World Needs + Paid For. Useful and earning — but without love or natural skill, it can feel draining.","Потребности мира + Оплата. Полезно и оплачивается — но без любви или природного таланта может истощать.","Lo que el mundo necesita + Pagado. Útil y remunerado — pero sin amor o habilidad natural, puede sentirse agotador."), gap:L("Without 'What you're good at' → Excitement and complacency, but sense of uncertainty","Без 'В чём ты хорош' → Воодушевление и самодовольство, но ощущение неопределённости","Sin 'En lo que eres bueno' → Emoción y complacencia, pero sensación de incertidumbre")},
      };
      const allFilled = ikigai.love && ikigai.good && ikigai.need && ikigai.paid;
      const filled = {love:!!ikigai.love, good:!!ikigai.good, need:!!ikigai.need, paid:!!ikigai.paid};
      return (
        <div>
          <div style={{position:"relative",width:280,height:280,margin:"0 auto 12px"}}>
            {[
              {key:'love', color:'#c4786e', style:{top:0,left:'50%',transform:'translateX(-50%)'}},
              {key:'good', color:'#d4a359', style:{top:'50%',left:0,transform:'translateY(-50%)'}},
              {key:'need', color:'#7aaf96', style:{top:'50%',right:0,transform:'translateY(-50%)'}},
              {key:'paid', color:'rgba(130,110,180,1)', style:{bottom:0,left:'50%',transform:'translateX(-50%)'}},
            ].map(c=>(
              <div key={c.key} style={{position:"absolute",width:168,height:168,borderRadius:"50%",background:c.color,opacity:filled[c.key]?0.5:0.15,transition:"opacity .4s",border:"1.5px solid rgba(255,255,255,1)",...c.style}}/>
            ))}
            {[
              {key:'passion', label:L("Passion","Страсть","Pasión"), style:{top:'32%',left:'22%'}},
              {key:'mission', label:L("Mission","Миссия","Misión"), style:{top:'32%',right:'22%'}},
              {key:'profession', label:L("Profession","Профессия","Profesión"), style:{bottom:'32%',left:'18%'}},
              {key:'vocation', label:L("Vocation","Призвание","Vocación"), style:{bottom:'32%',right:'18%'}},
            ].map(z=>(
              <div key={z.key} onClick={()=>setIkigaiTip(ikigaiTip===z.key?null:z.key)} style={{position:"absolute",fontSize:8,fontWeight:400,color:"rgba(240,236,228,.8)",textTransform:"uppercase",letterSpacing:".05em",cursor:"pointer",background:"rgba(0,0,0,.3)",borderRadius:6,padding:"3px 5px",textShadow:"0 1px 2px rgba(0,0,0,.6)",zIndex:5,...z.style}}>{z.label}</div>
            ))}
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:60,height:60,borderRadius:"50%",background:"rgba(20,18,28,.9)",border:"2px solid rgba(255,255,255,1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"#f0ece4",textAlign:"center",zIndex:10}}>IKIGAI</div>
            {[
              {label:L("What you\nLOVE","Что ты\nЛЮБИШЬ","Lo que\nAMAS"), style:{top:6,left:'50%',transform:'translateX(-50%)',textAlign:'center'}},
              {label:L("What you're\nGOOD AT","В чём ты\nХОРОШ","En lo que\nERES BUENO"), style:{top:'50%',left:4,transform:'translateY(-50%)',textAlign:'left'}},
              {label:L("What the\nworld NEEDS","Что нужно\nМИРУ","Lo que el\nmundo NECESITA"), style:{top:'50%',right:4,transform:'translateY(-50%)',textAlign:'right'}},
              {label:L("What you can\nbe PAID FOR","За что тебе\nМОГУТ ПЛАТИТЬ","Por lo que\npuedes SER PAGADO"), style:{bottom:6,left:'50%',transform:'translateX(-50%)',textAlign:'center'}},
            ].map((l,i)=>(
              <div key={i} style={{position:"absolute",fontSize:8,color:"rgba(240,236,228,.7)",fontWeight:400,lineHeight:1.3,pointerEvents:"none",whiteSpace:"pre-line",...l.style}}>{l.label}</div>
            ))}
          </div>

          {ikigaiTip && tipData[ikigaiTip] && (
            <div style={{background:"rgba(26,26,46,.9)",border:"0.5px solid rgba(255,255,255,.12)",borderRadius:12,padding:"12px 14px",marginBottom:16}}>
              <p style={{fontSize:13,fontWeight:500,color:"#f0ece4",marginBottom:5}}>{tipData[ikigaiTip].title}</p>
              <p style={{fontSize:12,color:"rgba(240,236,228,.65)",lineHeight:1.6,marginBottom:6}}>{tipData[ikigaiTip].desc}</p>
              <p style={{fontSize:11,color:"rgba(240,236,228,.35)",fontStyle:"italic"}}>{tipData[ikigaiTip].gap}</p>
            </div>
          )}

          <p style={{fontSize:11,color:"rgba(240,236,228,.25)",textAlign:"center",marginBottom:24}}>{L("Tap any intersection to learn more","Нажми на любое пересечение","Toca cualquier intersección")}</p>

          {/* 4 SECTIONS */}
          {[
            {key:'love', color:'#c4786e', label:L("What you love","Что ты любишь","Lo que amas"), prompt:L("What activities make you lose track of time? What would you do even if you weren't paid?","Какие занятия заставляют тебя терять счёт времени? Что бы ты делал(а), даже если бы не платили?","¿Qué actividades te hacen perder la noción del tiempo? ¿Qué harías aunque no te pagaran?")},
            {key:'good', color:'#d4a359', label:L("What you're good at","В чём ты хорош","En lo que eres bueno"), prompt:L("What comes naturally to you that others find difficult? What do people consistently ask for your help with?","Что даётся тебе легко, но другим сложно? За помощью в чём к тебе обращаются?","¿Qué te sale naturalmente que a otros les resulta difícil? ¿Con qué te piden ayuda constantemente?")},
            {key:'need', color:'#7aaf96', label:L("What the world needs","Что нужно миру","Lo que el mundo necesita"), prompt:L("What problems do you see around you that feel personal? What change do you most want to see?","Какие проблемы вокруг тебя ощущаются как личные? Какие перемены ты больше всего хочешь видеть?","¿Qué problemas ves a tu alrededor que se sienten personales? ¿Qué cambio quieres ver más?")},
            {key:'paid', color:'rgba(130,110,180,1)', label:L("What you can be paid for","За что тебе могут платить","Por lo que puedes ser pagado"), prompt:L("What skills or services do people already pay you for — or would pay for? What value do you create?","За какие навыки или услуги тебе уже платят — или заплатили бы? Какую ценность ты создаёшь?","¿Por qué habilidades o servicios te pagan ya — o pagarían? ¿Qué valor creas?")},
          ].map(({key, color, label, prompt})=>(
            <div key={key} style={{background:"rgba(255,255,255,.04)",border:`0.5px solid rgba(255,255,255,.08)`,borderRadius:14,padding:16,marginBottom:10,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:"1.5px",background:`linear-gradient(90deg,${color},transparent)`}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <p style={{fontSize:11,fontWeight:500,color,textTransform:"uppercase",letterSpacing:".07em"}}>{label}</p>
                {ikigai[key] && !ikigaiEditing[key] && <button className="tbtn" style={{fontSize:11}} onClick={()=>{setIkigaiDraft(p=>({...p,[key]:ikigai[key]}));setIkigaiEditing(p=>({...p,[key]:true}));}}>{L("Edit","Изменить","Editar")}</button>}
              </div>
              {ikigai[key] && !ikigaiEditing[key] ? (
                <p style={{fontSize:13,color:"rgba(240,236,228,.82)",lineHeight:1.65}}>{ikigai[key]}</p>
              ) : (
                <div>
                  <p style={{fontSize:13,color:"rgba(240,236,228,.45)",lineHeight:1.55,marginBottom:10,fontStyle:"italic"}}>{prompt}</p>
                  <textarea rows={3} value={ikigaiDraft[key]} onChange={e=>setIkigaiDraft(p=>({...p,[key]:e.target.value}))} placeholder={L("Your thoughts...","Твои мысли...","Tus pensamientos...")}/>
                  {ikigaiDraft[key] && <button className="pbtn" style={{fontSize:13,padding:"8px 16px",marginTop:8}} onClick={()=>{setIkigai(p=>({...p,[key]:ikigaiDraft[key]}));setIkigaiEditing(p=>({...p,[key]:false}));saveIkigai({...ikigai,[key]:ikigaiDraft[key]},ikigaiSynthesis);}}>{L("Save","Сохранить","Guardar")}</button>}
                </div>
              )}
            </div>
          ))}

          {/* GENERATE BUTTON */}
          {allFilled && !ikigaiSynthesis && (
            <button className="pbtn" style={{width:"100%",marginTop:8}} onClick={()=>generateIkigaiSynthesis(ikigai)}>
              {ikigaiLoading ? <span>{L("Generating","Генерирую","Generando")}<span className="dot">.</span><span className="dot dot2">.</span><span className="dot dot3">.</span></span> : L("Generate my Ikigai →","Сгенерировать мой Икигай →","Generar mi Ikigai →")}
            </button>
          )}

          {/* SYNTHESIS */}
          {ikigaiSynthesis && (()=>{
            let parsed;
            try { parsed = JSON.parse(ikigaiSynthesis); } catch { return null; }
            return (
              <div style={{marginTop:20}}>
                <div style={{background:"rgba(122,175,150,.07)",border:"0.5px solid rgba(122,175,150,.2)",borderRadius:14,padding:18,position:"relative",overflow:"hidden",marginBottom:10}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:"1.5px",background:"linear-gradient(90deg,#7aaf96,transparent)"}}/>
                  <p style={{fontSize:11,color:"rgba(122,175,150,.7)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>{L("Your Ikigai","Твой Икигай","Tu Ikigai")}</p>
                  <p style={{fontSize:14,color:"rgba(240,236,228,.85)",lineHeight:1.75,fontStyle:"italic",marginBottom:0}}>"{parsed.ikigai}"</p>
                </div>
                {parsed.meaning && (
                  <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:14,padding:18,marginBottom:10}}>
                    <p style={{fontSize:11,color:"rgba(240,236,228,.3)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>{L("What this means for you","Что это значит для тебя","Lo que esto significa para ti")}</p>
                    <p style={{fontSize:13,color:"rgba(240,236,228,.72)",lineHeight:1.7}}>{parsed.meaning}</p>
                  </div>
                )}
                {parsed.question && (
                  <div style={{background:"rgba(100,80,200,.07)",border:"0.5px solid rgba(100,80,200,.15)",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
                    <p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".08em",color:"rgba(160,140,220,.5)",marginBottom:7}}>{L("A question to sit with","Вопрос для размышления","Una pregunta para reflexionar")}</p>
                    <p style={{fontSize:14,lineHeight:1.65,fontStyle:"italic",color:"rgba(240,236,228,.76)"}}>{`"${parsed.question}"`}</p>
                  </div>
                )}
                <button className="gbtn" style={{fontSize:12,marginTop:4}} onClick={()=>{setIkigaiSynthesis('');}}>{L("Regenerate","Пересоздать","Regenerar")}</button>
              </div>
            );
          })()}
        </div>
      );
    })()}
  </div>
)}
        
        {/* ONBOARDING */}
        {screen==="onboarding"&&(
  <div key={animKey} style={{paddingTop:48,position:"relative",minHeight:"100vh"}}>
    <div style={{position:"fixed",inset:0,backgroundImage:`url('${theme.img}')`,backgroundSize:"cover",backgroundPosition:theme.position||"center center",zIndex:-2}}/>
    <div style={{position:"fixed",inset:0,background:`linear-gradient(180deg, ${theme.overlay} 0%, rgba(0,0,0,.7) 50%, ${theme.overlay} 100%)`,zIndex:-1}}/>
    <div style={{position:"fixed",top:0,left:0,right:0,zIndex:50,padding:"10px 18px",background:"rgba(12,12,16,.92)",backdropFilter:"blur(16px)",borderBottom:"0.5px solid rgba(255,255,255,.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
  <span style={{fontFamily:"Fraunces,serif",fontSize:18,color:"#d4a359",fontWeight:600,cursor:"pointer",letterSpacing:"-.3px"}} onClick={()=>goTo("login")}>Alex Soleil</span>
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
                    <button key={i} className="obtn" onClick={()=>{setYesterdayAnswer(i);setShowYesterday(false);const uid=userId||localStorage.getItem('sq_user_id');if(uid)dbSaveProfile(uid,{yesterday_answered:today});else localStorage.setItem('sq_yesterday_answered',today);}} style={{fontSize:13}}>
                      <span style={{color:"rgba(240,236,228,.25)",marginRight:8,fontSize:12}}>○</span>{opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {yesterdayAnswer !== null && yesterdaySession && (
  <div className="up" style={{marginBottom:20}}>
    <div style={{background:"rgba(212,163,89,.06)",border:"0.5px solid rgba(212,163,89,.15)",borderRadius:12,padding:"12px 16px",marginBottom:yesterdayAnswer===1||yesterdayAnswer===2||yesterdayAnswer===3?10:0}}>
      <p style={{fontSize:13,color:"rgba(240,236,228,.65)",fontStyle:"italic"}}>
        {yesterdayAnswer===0 && L("That's the spark at work. 🔥","Это и есть искра в действии. 🔥","Eso es la chispa en acción. 🔥")}
        {yesterdayAnswer===1 && L("Trying is the practice. That counts. ✨","Попытка — это и есть практика. Это считается. ✨","Intentar es la práctica. Eso cuenta. ✨")}
        {yesterdayAnswer===2 && L("Today is a new beginning. 🌅","Сегодня — новое начало. 🌅","Hoy es un nuevo comienzo. 🌅")}
        {yesterdayAnswer===3 && L("The unexpected path is still a path. 💡","Неожиданный путь — всё равно путь. 💡","El camino inesperado sigue siendo un camino. 💡")}
      </p>
    </div>
    {(yesterdayAnswer===1||yesterdayAnswer===2)&&yesterdayFollowUp===null&&(
      <div style={{background:"rgba(100,200,150,.05)",borderRadius:12,padding:"14px 16px"}}>
        <p style={{fontSize:11,color:"rgba(100,200,150,.6)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>{yesterdaySession.challenge}</p>
        {yesterdaySession.first_step&&<p style={{fontSize:12,color:"rgba(240,236,228,.45)",marginBottom:12,lineHeight:1.55,fontStyle:"italic"}}>"{yesterdaySession.first_step}"</p>}
        <p style={{fontSize:14,fontWeight:500,color:"#f0ece4",marginBottom:12,lineHeight:1.4,fontFamily:"Fraunces,serif"}}>{L("What got in the way?","Что помешало?","¿Qué se interpuso?")}</p>
        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:10}}>
          {[
            L("I forgot about it during the day","Забыл(а) об этом в течение дня","Lo olvidé durante el día"),
            L("I noticed the moment but didn't follow through","Заметил(а) момент, но не довёл(а) до конца","Noté el momento pero no lo seguí"),
            L("It felt harder than expected","Оказалось сложнее, чем ожидал(а)","Fue más difícil de lo esperado"),
            L("Something else came up","Возникло что-то другое","Surgió otra cosa"),
          ].map((opt,i)=>(
            <button key={i} className="obtn" style={{fontSize:13}} onClick={()=>{setYesterdayFollowUp(opt);yesterdayFollowUpRef.current=opt;}}>
              <span style={{color:"rgba(240,236,228,.25)",marginRight:8,fontSize:12}}>○</span>{opt}
            </button>
          ))}
        </div>
        <input type="text" value={yesterdayFollowUpText} onChange={e=>setYesterdayFollowUpText(e.target.value)}
          placeholder={L("Add your own...","Своё...","Lo tuyo...")}
          style={{marginBottom:8}}/>
        <div style={{display:"flex",gap:8}}>
          {yesterdayFollowUpText.trim()&&<button className="pbtn" style={{fontSize:13,padding:"8px 16px"}} onClick={()=>{setYesterdayFollowUp(yesterdayFollowUpText.trim());yesterdayFollowUpRef.current=yesterdayFollowUpText.trim();}}>{L("Done","Готово","Listo")}</button>}
          <button className="tbtn" onClick={()=>setYesterdayFollowUp("skipped")}>{L("Skip →","Пропустить →","Omitir →")}</button>
        </div>
      </div>
    )}
    {yesterdayAnswer===3&&yesterdayFollowUp===null&&(
      <div style={{background:"rgba(100,200,150,.05)",borderRadius:12,padding:"14px 16px"}}>
        <p style={{fontSize:11,color:"rgba(100,200,150,.6)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>{yesterdaySession.challenge}</p>
        <p style={{fontSize:14,fontWeight:500,color:"#f0ece4",marginBottom:12,lineHeight:1.4,fontFamily:"Fraunces,serif"}}>{L("Feel free to share, if you'd like.","Поделись, если хочешь.","Comparte, si quieres.")}</p>
        <input type="text" value={yesterdayFollowUpText} onChange={e=>setYesterdayFollowUpText(e.target.value)}
          placeholder={L("What happened...","Что произошло...","Lo que pasó...")}
          style={{marginBottom:8}}/>
        <div style={{display:"flex",gap:8}}>
          {yesterdayFollowUpText.trim()&&<button className="pbtn" style={{fontSize:13,padding:"8px 16px"}} onClick={()=>setYesterdayFollowUp(yesterdayFollowUpText.trim())}>{L("Done","Готово","Listo")}</button>}
          <button className="tbtn" onClick={()=>{setYesterdayFollowUp("skipped");yesterdayFollowUpRef.current="skipped";}}>{L("Skip →","Пропустить →","Omitir →")}</button>
        </div>
      </div>
    )}
  </div>
)}

            <p className="up d1" style={{fontSize:13,color:"#d4a359",marginBottom:8}}>{L(`Good ${timeOfDay()}, ${firstName}.`,`Добр${timeOfDay()==="утро"?"ое":timeOfDay()==="день"?"ый":"ый"} ${timeOfDay()}, ${firstName}.`,`Buenas ${timeOfDay()}, ${firstName}.`)}</p>
            <h2 className="up d2" style={{fontFamily:"Fraunces,serif",fontSize:26,fontWeight:600,lineHeight:1.2,marginBottom:12}}>{L("How are you feeling right now?","Как ты себя чувствуешь прямо сейчас?","¿Cómo te sientes ahora mismo?")}</h2>
            <p className="up d3" style={{fontSize:14,color:"rgba(240,236,228,.42)",lineHeight:1.65,marginBottom:22}}>{L("Take a breath. Notice what's on your mind and in your heart. Is anything bothering you, sitting heavy, or asking for attention? That feeling is your guide.","Сделай вдох. Замечай, что у тебя на уме и в сердце. Есть что-то, что давит или просит внимания? Это чувство — твой компас.","Respira. Nota lo que tienes en la mente y en el corazón. ¿Hay algo que te pese o pida atención? Ese sentimiento es tu guía.")}</p>
            <div className="up d4" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:22}}>
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {checkinOpts.slice(0,4).map((opt,i)=>(
      <button key={i} className={`obtn ${checkinSel.includes(i)?"sel":""}`} onClick={()=>toggleCheckin(i)}>
        <span style={{color:checkinSel.includes(i)?"#d4a359":"rgba(240,236,228,.2)",marginRight:8,fontSize:12}}>{checkinSel.includes(i)?"✓":"○"}</span>{opt}
      </button>
    ))}
  </div>
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {checkinOpts.slice(4).map((opt,i)=>(
      <button key={i+4} className={`obtn ${checkinSel.includes(i+4)?"sel":""}`} onClick={()=>toggleCheckin(i+4)}>
        <span style={{color:checkinSel.includes(i+4)?"#d4a359":"rgba(240,236,228,.2)",marginRight:8,fontSize:12}}>{checkinSel.includes(i+4)?"✓":"○"}</span>{opt}
      </button>
    ))}
  </div>
</div>
{checkinSel.length>0&&(
  <div className="up" style={{display:"flex",alignItems:"center",gap:12}}>
    <button className="pbtn" onClick={proceedCheckin}>{L("Choose my focus →","Выбрать фокус →","Elegir mi enfoque →")}</button>
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
                <div style={{position:"relative",marginBottom:20}}>   {freeText.trim()&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#d4a359",fontSize:12,pointerEvents:"none"}}>✓</span>}
                  <input
                    type="text"
                    value={freeText}
                    onChange={e=>setFreeText(e.target.value)}
                    placeholder={L("Something else on your mind...","Что-то ещё на уме...","¿Algo más en tu mente?")}
                    style={{background:freeText.trim()?"rgba(212,163,89,.13)":"rgba(255,255,255,.04)",border:freeText.trim()?"0.5px solid #d4a359":"0.5px solid rgba(255,255,255,.08)",borderRadius:11,padding:freeText.trim()?"12px 14px 12px 32px":"12px 14px",color:"#f0ece4",fontFamily:"'DM Sans',sans-serif",fontSize:13,outline:"none",width:"100%",transition:"all .18s"}}
                    onFocus={e=>e.target.style.borderColor="rgba(212,163,89,.5)"}
                    onBlur={e=>{e.target.style.borderColor=freeText.trim()?"#d4a359":"rgba(255,255,255,.08)";}}
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
                <h2 style={{fontFamily:"Fraunces,serif",fontSize:20,fontWeight:600,marginBottom:8}}>{L("What's the first step you're willing to take?","Какой первый шаг ты готов(а) сделать?","¿Cuál es el primer paso que estás dispuesto(a) a dar?")}</h2>
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
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <h2 style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600}}>{L("My Practices","Мои практики","Mis Prácticas")}</h2>
      <div style={{display:"flex",gap:5,alignItems:"center"}}>
        <button className="gbtn" style={{padding:"5px 10px"}} onClick={()=>{const nm=new Date(calMonth.getFullYear(),calMonth.getMonth()-1);setCalMonth(nm);const k=`${nm.getFullYear()}-${nm.getMonth()}`;setRecapData(recapCache[k]||null);}}>‹</button>
        <span style={{fontSize:12,color:"rgba(240,236,228,.48)",minWidth:88,textAlign:"center"}}>{calMonth.toLocaleDateString(lang==="RU"?"ru-RU":"en-US",{month:"long",year:"numeric"})}</span>
        <button className="gbtn" style={{padding:"5px 10px"}} onClick={()=>{const nm=new Date(calMonth.getFullYear(),calMonth.getMonth()+1);setCalMonth(nm);const k=`${nm.getFullYear()}-${nm.getMonth()}`;setRecapData(recapCache[k]||null);}}>›</button>
      </div>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:20}}>
      <button onClick={()=>setPracticesTab('calendar')} style={{flex:1,textAlign:"center",padding:9,borderRadius:9,fontSize:13,cursor:"pointer",border:`0.5px solid ${practicesTab==='calendar'?"#d4a359":"rgba(255,255,255,.08)"}`,background:practicesTab==='calendar'?"rgba(212,163,89,.13)":"rgba(255,255,255,.04)",color:practicesTab==='calendar'?"#d4a359":"rgba(240,236,228,.5)",fontWeight:practicesTab==='calendar'?500:400}}>📅 {L("Calendar","Календарь","Calendario")}</button>
      <button onClick={()=>{setPracticesTab('recap');const k=`${calMonth.getFullYear()}-${calMonth.getMonth()}`;if(recapCache[k])setRecapData(recapCache[k]);}} style={{flex:1,textAlign:"center",padding:9,borderRadius:9,fontSize:13,cursor:"pointer",border:`0.5px solid ${practicesTab==='recap'?"#d4a359":"rgba(255,255,255,.08)"}`,background:practicesTab==='recap'?"rgba(212,163,89,.13)":"rgba(255,255,255,.04)",color:practicesTab==='recap'?"#d4a359":"rgba(240,236,228,.5)",fontWeight:practicesTab==='recap'?500:400}}>📊 {L("Monthly Recap","Итоги месяца","Resumen Mensual")}</button>
    </div>
            {practicesTab==='recap' ? (
  <div>
    {recapLoading ? (
      <div style={{textAlign:"center",padding:"40px 0"}}>
        <p style={{color:"rgba(240,236,228,.35)",fontSize:14}}>{L("Analyzing your month","Анализирую твой месяц","Analizando tu mes")}<span className="dot">.</span><span className="dot dot2">.</span><span className="dot dot3">.</span></p>
      </div>
    ) : recapData?.empty ? (
      <p style={{fontSize:13,color:"rgba(240,236,228,.28)",textAlign:"center",padding:"30px 0"}}>{L("No sessions this month yet.","В этом месяце пока нет практик.","Aún no hay sesiones este mes.")}</p>
    ) : recapData?.error ? (
      <div style={{textAlign:"center",padding:"30px 0"}}>
        <p style={{fontSize:13,color:"rgba(240,236,228,.28)",marginBottom:12}}>{L("Couldn't generate recap. Try again.","Не удалось создать итоги. Попробуй снова.","No se pudo generar el resumen.")}</p>
        <button className="gbtn" onClick={generateRecap}>{L("Retry","Повторить","Reintentar")}</button>
      </div>
    ) : recapData ? (
      <div>
        {(()=>{
          const entries = Object.entries(recapData.challengeCounts||{}).sort((a,b)=>b[1]-a[1]);
          const total = recapData.total || 1;
          const colors = ['#c4786e','#d4a359','#7aaf96','rgba(160,140,220,1)','#6ab0c8','#c8a55a','#a07aaf','rgba(255,255,255,1)'];
const opacities = [1, 1, 1, 1, 1, 1, 1, 0.3];
          let angle = 0;
          const slices = entries.map((e,i) => {
            const deg = (e[1]/total)*360;
            const startA = angle; angle += deg;
            return {name:e[0], count:e[1], deg, startA, endA:angle, color:colors[i%colors.length], opacity:opacities[i%opacities.length]};
          });
          const toArc = (cx,cy,r,s,e) => {
            const sr = (s-90)*Math.PI/180, er = (e-90)*Math.PI/180;
            const x1=cx+r*Math.cos(sr),y1=cy+r*Math.sin(sr),x2=cx+r*Math.cos(er),y2=cy+r*Math.sin(er);
            return `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${e-s>180?1:0},1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
          };
          return (
            <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:24}}>
              <svg width="130" height="130" viewBox="0 0 130 130" style={{flexShrink:0}}>
                {slices.map((s,i)=><path key={i} d={toArc(65,65,58,s.startA,s.endA)} fill={s.color} opacity={s.opacity}/>)}
                <circle cx="65" cy="65" r="30" fill="#0c0c10"/>
                <text x="65" y="61" textAnchor="middle" fill="#d4a359" fontSize="16" fontFamily="Fraunces,serif" fontWeight="600">{total}</text>
                <text x="65" y="74" textAnchor="middle" fill="rgba(240,236,228,.35)" fontSize="8" fontFamily="DM Sans,sans-serif">{L("sessions","сессий","sesiones")}</text>
              </svg>
              <div style={{display:"flex",flexDirection:"column",gap:8,flex:1}}>
                {slices.map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontSize:12}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:s.color,opacity:s.opacity,flexShrink:0}}/>
                    <span style={{color:"rgba(240,236,228,.75)",flex:1,fontSize:11}}>{s.name}</span>
                    <span style={{color:"rgba(240,236,228,.35)",fontSize:11,whiteSpace:"nowrap"}}>{s.count} · {Math.round(s.count/total*100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        {recapData.narrative && (
          <div style={{background:"rgba(212,163,89,.06)",border:"0.5px solid rgba(212,163,89,.15)",borderRadius:14,padding:18,position:"relative",overflow:"hidden",marginBottom:20}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"1.5px",background:"linear-gradient(90deg,#d4a359,transparent)"}}/>
            <p style={{fontSize:11,color:"rgba(212,163,89,.6)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:10}}>{L("Alex Soleil's read on your month","Читает Алекс Солей","La lectura de Alex Soleil")}</p>
            <p style={{fontSize:14,color:"rgba(240,236,228,.82)",lineHeight:1.75,fontStyle:"italic"}}>"{recapData.narrative}"</p>
          </div>
        )}
        {recapData.top2?.length > 0 && (
          <div>
            <p style={{fontSize:11,color:"rgba(240,236,228,.3)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>{L("Going deeper on what came up","Углубляемся в то, что возникло","Profundizando en lo que surgió")}</p>
            {recapData.top2.map((item,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:14,padding:16,marginBottom:10,position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:"1.5px",background:`linear-gradient(90deg,${i===0?"#c4786e":"#d4a359"},transparent)`}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",marginBottom:expanded===`recap-${i}`?12:0}} onClick={()=>setExpanded(expanded===`recap-${i}`?null:`recap-${i}`)}>
                  <p style={{fontFamily:"Fraunces,serif",fontSize:15,fontWeight:600,color:i===0?"#c4786e":"#d4a359"}}>{item.emoji} {item.challenge}</p>
                  <span style={{fontSize:12,color:"rgba(240,236,228,.28)",transition:"transform .2s",display:"inline-block",transform:expanded===`recap-${i}`?"rotate(90deg)":"none"}}>›</span>
                </div>
                {expanded===`recap-${i}`&&<div>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
                  {item.questions?.map((q,j)=>(
                    <div key={j} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                      <span style={{color:"rgba(240,236,228,.25)",fontSize:11,marginTop:2,flexShrink:0}}>→</span>
                      <span style={{fontSize:13,color:"rgba(240,236,228,.72)",lineHeight:1.55}}>{q}</span>
                    </div>
                  ))}
                </div>
              <div style={{borderTop:"0.5px solid rgba(255,255,255,.07)",paddingTop:12}}>
                  <p style={{fontSize:10,color:"rgba(240,236,228,.28)",textTransform:"uppercase",letterSpacing:".07em",marginBottom:8}}>{L("Practices to try","Практики для работы","Prácticas para probar")}</p>
                  {item.practices?.map((p,j)=>(
                    <div key={j} style={{display:"flex",gap:9,alignItems:"flex-start",marginBottom:6}}>
                      <span style={{color:"rgba(240,236,228,.2)",fontSize:11,marginTop:2,flexShrink:0}}>·</span>
                      <span style={{fontSize:12,color:"rgba(240,236,228,.58)",lineHeight:1.55}}>{p}</span>
                    </div>
                  ))}
                </div>
                </div>}
              </div>
            ))}
          </div>
        )}
        <button className="gbtn" style={{fontSize:12,marginTop:8}} onClick={()=>{setRecapData(null);generateRecap();}}>{L("Regenerate","Пересоздать","Regenerar")}</button>
      </div>
    ) : (
      <div style={{textAlign:"center",padding:"40px 0"}}>
        <p style={{fontSize:14,color:"rgba(240,236,228,.45)",lineHeight:1.65,marginBottom:20}}>{L("Ready to see your month in review?","Готов увидеть итоги месяца?","¿Listo para ver tu resumen mensual?")}</p>
        <button className="pbtn" onClick={generateRecap}>{L("Summarize my month →","Подвести итоги →","Resumir mi mes →")}</button>
      </div>
    )}
  </div>
) : (()=>{
              const yr=calMonth.getFullYear(),mo=calMonth.getMonth();
              const firstDay=new Date(yr,mo,1).getDay(),dim=new Date(yr,mo+1,0).getDate();
              const days=[]; const mondayFirst=(firstDay===0?6:firstDay-1); for(let i=0;i<mondayFirst;i++) days.push(null); for(let d=1;d<=dim;d++) days.push(d);
              const dayLabels=lang==="RU"?["Пн","Вт","Ср","Чт","Пт","Сб","Вс"]:lang==="ES"?["Lu","Ma","Mi","Ju","Vi","Sa","Do"]:["Mo","Tu","We","Th","Fr","Sa","Su"];
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
            {practicesTab==='calendar' && (()=>{
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
                      {s.first_step&&<div style={{background:"rgba(212,163,89,.07)",borderRadius:8,padding:"9px 12px",marginBottom:14}}><p style={{fontSize:11,color:"#d4a359",textTransform:"uppercase",letterSpacing:".05em",marginBottom:4}}>{L("First step committed","Первый шаг","Primer paso")}</p><p style={{fontSize:13,color:"rgba(240,236,228,.82)",lineHeight:1.5}}>{s.first_step}</p></div>}
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
                      {<div style={{marginBottom:4}}>   <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>     <p style={{fontSize:11,color:"rgba(240,236,228,.24)",textTransform:"uppercase",letterSpacing:".06em"}}>{L("Reflection","Рефлексия","Reflexión")}</p>     <button className="tbtn" style={{fontSize:11}} onClick={e=>{e.stopPropagation();setEditingReflection(editingReflection===d?null:d);setEditReflectionText(s.reflection||"");}}>{editingReflection===d?L("Cancel","Отмена","Cancelar"):L("Edit","Изменить","Editar")}</button>   </div>   {editingReflection===d?(     <div>       <textarea rows={4} value={editReflectionText} onChange={e=>setEditReflectionText(e.target.value)} onClick={e=>e.stopPropagation()} placeholder={L("Write your reflection...","Запиши мысли...","Escribe tu reflexión...")}/>       <button className="pbtn" style={{fontSize:13,padding:"8px 16px",marginTop:8}} onClick={async(e)=>{e.stopPropagation();const updated={...sessions,[d]:{...s,reflection:editReflectionText}};setSessions(updated);if(userId)await dbSaveSession(userId,{...s,reflection:editReflectionText});setEditingReflection(null);}}>         {L("Save reflection ✓","Сохранить ✓","Guardar ✓")}       </button>     </div>   ):(     <p style={{fontSize:13,color:"rgba(240,236,228,.65)",lineHeight:1.65}}>{s.reflection||<span style={{color:"rgba(240,236,228,.25)",fontStyle:"italic"}}>{L("No reflection yet — tap Edit to add one.","Нет рефлексии — нажми Изменить.","Sin reflexión — toca Editar.")}</span>}</p>   )} </div>}
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
    <p style={{fontSize:12,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{L("My Vault","Мой Архив","Mi Bóveda")}</p>
    <h2 style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600,marginBottom:6}}>{L("Your self-knowledge space","Твоё пространство самопознания","Tu espacio de autoconocimiento")}</h2>
    <p style={{fontSize:13,color:"rgba(240,236,228,.4)",lineHeight:1.6,marginBottom:20}}>{L("The more you add here, the deeper your practice can go.","Чем больше ты здесь добавляешь, тем глубже твоя практика.","Cuanto más añades aquí, más profunda se vuelve tu práctica.")}</p>

    {/* Profile */}
    <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:13,padding:"14px 16px",marginBottom:8}}>
      {!editingProfile?(
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><p style={{fontSize:15,fontWeight:500,marginBottom:3}}>{profile?.name}</p>{profile?.dob&&<p style={{fontSize:12,color:"rgba(240,236,228,.38)"}}>{profile.dob}</p>}</div>
          <button className="tbtn" onClick={()=>{setEditName(profile?.name||"");const parts=profile?.dob?profile.dob.split("-"):["","",""];setEditDobYear(parts[0]||"");setEditDobMonth(parts[1]?String(parseInt(parts[1])):"");setEditDobDay(parts[2]?String(parseInt(parts[2])):"");setEditingProfile(true);}}>{L("Edit","Изменить","Editar")}</button>
        </div>
      ):(
        <div>
          <input type="text" value={editName} onChange={e=>setEditName(e.target.value)} style={{marginBottom:9}} placeholder={L("Your name","Твоё имя","Tu nombre")}/>
          <div style={{marginBottom:13}}><DobDropdown lang={lang} day={editDobDay} month={editDobMonth} year={editDobYear} onDay={setEditDobDay} onMonth={setEditDobMonth} onYear={setEditDobYear} onClear={()=>{setEditDobDay("");setEditDobMonth("");setEditDobYear("");}}/></div>
          <div style={{display:"flex",gap:7}}><button className="pbtn" style={{fontSize:13,padding:"8px 16px"}} onClick={saveEditedProfile}>{L("Save","Сохранить","Guardar")}</button><button className="gbtn" style={{fontSize:13}} onClick={()=>setEditingProfile(false)}>{L("Cancel","Отмена","Cancelar")}</button></div>
        </div>
      )}
    </div>

    {/* Numerology tile */}
    {profile?.arcana&&ARCANA_MEANINGS[profile.arcana]&&(
      <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:13,padding:15,marginBottom:8,cursor:"pointer",transition:"all .2s"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(100,200,150,.3)"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}
        onClick={()=>goTo("vault-numerology")}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{fontFamily:"Fraunces,serif",fontSize:28,fontWeight:600,color:"rgba(160,140,220,.7)",minWidth:36}}>{profile.arcana}</div>
          <div style={{flex:1}}>
            <p style={{fontFamily:"Fraunces,serif",fontSize:16,fontWeight:600,color:"rgba(100,200,150,.8)",marginBottom:5}}>{L("Numerology","Нумерология","Numerología")}</p>
            <p style={{fontFamily:"Fraunces,serif",fontSize:14,fontWeight:600,color:"#d4a359",marginBottom:4}}>{ARCANA_MEANINGS[profile.arcana].name[lang==="RU"?"ru":lang==="ES"?"es":"en"]}</p>
            <p style={{fontSize:12,color:"rgba(240,236,228,.36)",lineHeight:1.45}}>{ARCANA_MEANINGS[profile.arcana].plus[lang==="RU"?"ru":lang==="ES"?"es":"en"].split('.')[0]}.</p>
          </div>
          <span style={{fontSize:11,color:"rgba(240,236,228,.55)",alignSelf:"flex-end",paddingBottom:2}}>Explore →</span>
        </div>
      </div>
    )}

    {/* Values + Wheel grid */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>

      {/* Values tile */}
      <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:13,padding:15,cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column",minHeight:150}}
        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(100,200,150,.3)"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}
        onClick={()=>goTo("vault-values")}>
        <div style={{flex:1}}>
          <p style={{fontFamily:"Fraunces,serif",fontSize:16,fontWeight:600,color:"rgba(100,200,150,.8)",marginBottom:5}}>{L("Values","Ценности","Valores")}</p>
          <p style={{fontSize:12,color:"rgba(240,236,228,.36)",lineHeight:1.45,marginBottom:10}}>{L("What guides you when everything else falls away.","Что ведёт тебя, когда всё остальное исчезает.","Lo que te guía cuando todo lo demás desaparece.")}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {profile?.values?.slice(0,2).map(v=><span key={v} style={{background:"rgba(212,163,89,.1)",border:"0.5px solid rgba(212,163,89,.2)",borderRadius:20,padding:"3px 8px",fontSize:11,color:"#d4a359"}}>{valLabel(v)}</span>)}
            {(profile?.values?.length||0)>2&&<span style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.07)",borderRadius:20,padding:"3px 8px",fontSize:11,color:"rgba(240,236,228,.3)"}}>+{(profile?.values?.length||0)-2}</span>}
          </div>
        </div>
        <p style={{fontSize:11,color:"rgba(240,236,228,.55)",marginTop:10}}>Explore →</p>
      </div>

      {/* Wheel tile */}
      <div style={{background:"rgba(255,255,255,.04)",border:"0.5px solid rgba(255,255,255,.08)",borderRadius:13,padding:15,cursor:"pointer",transition:"all .2s",display:"flex",flexDirection:"column",minHeight:150}}
        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(100,200,150,.3)"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(255,255,255,.08)"}
        onClick={()=>goTo("vault-wheel")}>
        <div style={{flex:1}}>
          <p style={{fontFamily:"Fraunces,serif",fontSize:16,fontWeight:600,color:"rgba(100,200,150,.8)",marginBottom:5}}>{L("Wheel of Life","Колесо жизни","Rueda de la Vida")}</p>
          <p style={{fontSize:12,color:"rgba(240,236,228,.36)",lineHeight:1.45,marginBottom:10}}>{L("Where you are — and where you want to go.","Где ты сейчас — и куда хочешь прийти.","Dónde estás — y hacia dónde quieres ir.")}</p>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            {WHEEL_CATEGORIES[lang].slice(0,4).map((cat,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:10,color:"rgba(240,236,228,.35)",width:68,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cat.split(" & ")[0]}</span>
                <div style={{flex:1,height:3,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",background:"#d4a359",borderRadius:2,width:`${((wheelRatings[i]||0)/10)*100}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p style={{fontSize:11,color:"rgba(240,236,228,.55)",marginTop:10}}>Explore →</p>
      </div>
    </div>
  </div>
)}

            {/* VAULT NUMEROLOGY */}
{screen==="vault-numerology"&&profile?.arcana&&ARCANA_MEANINGS[profile.arcana]&&(
  <div key={animKey} style={{paddingTop:40}}>
    <button className="tbtn" style={{marginBottom:16}} onClick={()=>goTo("whoami")}>← {L("My Vault","Мой Архив","Mi Bóveda")}</button>
    <p style={{fontSize:11,color:"rgba(160,140,220,.5)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{L("Numerology","Нумерология","Numerología")} · {L(`Arcana ${profile.arcana}`,`Аркан ${profile.arcana}`,`Arcano ${profile.arcana}`)}</p>
    <h2 style={{fontFamily:"Fraunces,serif",fontSize:24,fontWeight:600,color:"#d4a359",marginBottom:20}}>{ARCANA_MEANINGS[profile.arcana].name[lang==="RU"?"ru":lang==="ES"?"es":"en"]}</h2>
    <div style={{background:"rgba(100,80,200,.07)",border:"0.5px solid rgba(100,80,200,.2)",borderRadius:12,padding:"16px 18px",marginBottom:10}}>
      <p style={{fontSize:11,fontWeight:600,letterSpacing:".07em",textTransform:"uppercase",color:"rgba(100,200,150,.65)",marginBottom:7,display:"flex",alignItems:"center",gap:7}}><span style={{width:5,height:5,borderRadius:"50%",background:"rgba(100,200,150,.6)",display:"inline-block",flexShrink:0}}/>Your light</p>
      <p style={{fontSize:14,color:"rgba(240,236,228,.75)",lineHeight:1.7,fontStyle:"italic",paddingLeft:12,borderLeft:"1.5px solid rgba(100,200,150,.2)"}}>{ARCANA_MEANINGS[profile.arcana].plus[lang==="RU"?"ru":lang==="ES"?"es":"en"]}</p>
    </div>
    <div style={{background:"rgba(100,80,200,.07)",border:"0.5px solid rgba(100,80,200,.2)",borderRadius:12,padding:"16px 18px",marginBottom:10}}>
      <p style={{fontSize:11,fontWeight:600,letterSpacing:".07em",textTransform:"uppercase",color:"rgba(220,110,100,.6)",marginBottom:7,display:"flex",alignItems:"center",gap:7}}><span style={{width:5,height:5,borderRadius:"50%",background:"rgba(220,110,100,.5)",display:"inline-block",flexShrink:0}}/>Your shadow</p>
      <p style={{fontSize:14,color:"rgba(240,236,228,.75)",lineHeight:1.7,fontStyle:"italic",paddingLeft:12,borderLeft:"1.5px solid rgba(220,110,100,.15)"}}>{ARCANA_MEANINGS[profile.arcana].minus[lang==="RU"?"ru":lang==="ES"?"es":"en"]}</p>
    </div>
    <div style={{background:"rgba(212,163,89,.06)",border:"0.5px solid rgba(212,163,89,.15)",borderRadius:10,padding:"10px 14px",fontSize:12,color:"rgba(240,236,228,.42)",lineHeight:1.6}}>
      <span style={{color:"#d4a359",fontWeight:500}}>{L("How it's calculated: ","Как рассчитывается: ","Cómo se calcula: ")}</span>{L("Your arcana is your day of birth. Born on the 15th → Arcana 15. Born on the 25th → 2+5 = 7 → Arcana 7.","Ваш аркан — это день рождения. Рождён 15-го → Аркан 15. Рождён 25-го → 2+5 = 7 → Аркан 7.","Tu arcano es tu día de nacimiento. Nacido el 15 → Arcano 15. Nacido el 25 → 2+5 = 7 → Arcano 7.")}
    </div>
  </div>
)}

{/* VAULT VALUES */}
{screen==="vault-values"&&(
  <div key={animKey} style={{paddingTop:40}}>
    <button className="tbtn" style={{marginBottom:16}} onClick={()=>goTo("whoami")}>← {L("My Vault","Мой Архив","Mi Bóveda")}</button>
    <p style={{fontSize:12,color:"rgba(100,200,150,.7)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>{L("Values","Ценности","Valores")}</p>
    <h2 style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600,marginBottom:20}}>{L("What guides you when everything else falls away.","Что ведёт тебя, когда всё остальное исчезает.","Lo que te guía cuando todo lo demás desaparece.")}</h2>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <p style={{fontSize:13,color:"rgba(240,236,228,.45)"}}>{profile?.values?.length||0} {L("values selected","ценностей выбрано","valores seleccionados")}</p>
      <div style={{display:"flex",gap:7}}>
        <button className="gbtn" style={{fontSize:12}} onClick={()=>startValChallenge(profile?.values||[],"whoami")}>{L("Test my values","Проверить","Probar")}</button>
        {!editingValues?<button className="tbtn" onClick={()=>{setEditVals([...(profile?.values||[])]);setEditingValues(true);}}>{L("Edit","Изменить","Editar")}</button>:<button className="tbtn" onClick={saveEditedValues}>{L("Save","Сохранить","Guardar")}</button>}
      </div>
    </div>
    {!editingValues?(
      <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:20}}>
        {profile?.values?.map(v=>(
          <button key={v} onClick={()=>setTooltipVal(tooltipVal===v?null:v)} style={{background:"rgba(212,163,89,.1)",border:"0.5px solid rgba(212,163,89,.25)",borderRadius:20,padding:"5px 12px",fontSize:13,color:"#d4a359",cursor:"pointer",transition:"all .15s",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5}}>
            {valLabel(v)}<span style={{fontSize:11,opacity:.55}}>ⓘ</span>
          </button>
        ))}
      </div>
    ):(
      <div style={{marginBottom:20}}>
        <p style={{fontSize:12,color:"rgba(240,236,228,.32)",marginBottom:10}}>{editVals.length} / 5</p>
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
)}

{/* VAULT WHEEL */}
{screen==="vault-wheel"&&(
  <div key={animKey} style={{paddingTop:40}}>
    <button className="tbtn" style={{marginBottom:16}} onClick={()=>goTo("whoami")}>← {L("My Vault","Мой Архив","Mi Bóveda")}</button>
    <p style={{fontSize:12,color:"rgba(100,200,150,.7)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:8}}>{L("Wheel of Life","Колесо жизни","Rueda de la Vida")}</p>
    <h2 style={{fontFamily:"Fraunces,serif",fontSize:22,fontWeight:600,marginBottom:6}}>{L("Where you are — and where you want to go.","Где ты сейчас — и куда хочешь прийти.","Dónde estás — y hacia dónde quieres ir.")}</h2>
    <p style={{fontSize:13,color:"rgba(240,236,228,.4)",lineHeight:1.6,marginBottom:20}}>{L("Rate each area 1–10. Your coaching practice reads this to go deeper.","Оцени каждую сферу от 1 до 10. Практика читает это, чтобы идти глубже.","Evalúa cada área del 1 al 10. Tu práctica lee esto para ir más profundo.")}</p>
    <WheelChart ratings={wheelRatings} lang={lang} size="full"/>
    <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:10}}>
      {WHEEL_CATEGORIES[lang]?.map((cat,i)=>(
        <div key={i}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
            <p style={{fontSize:13,color:"rgba(240,236,228,.8)"}}>{cat}</p>
            <button onClick={()=>setWheelTooltip(wheelTooltip===i?null:i)} style={{background:"none",border:"none",color:"rgba(212,163,89,.55)",fontSize:11,cursor:"pointer",padding:0,flexShrink:0}}>ⓘ</button>
            <span style={{fontSize:13,color:"#d4a359",marginLeft:"auto",fontWeight:500}}>{wheelRatings[i]||"—"}</span>
          </div>
          {wheelTooltip===i&&<p style={{fontSize:12,color:"rgba(240,236,228,.5)",lineHeight:1.55,marginBottom:6,paddingLeft:2}}>{WHEEL_DESCRIPTIONS[lang]?.[i]}</p>}
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
)}

        {/* TALK TO ALEX */}
        {screen==="talk"&&(
        <div key={animKey} style={{paddingTop:40}}>
          <p style={{fontSize:12,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>{L("Work with Alex","Работать с Алекс","Trabaja con Alex")}</p>
          <h2 style={{fontFamily:"Fraunces,serif",fontSize:24,fontWeight:600,lineHeight:1.2,marginBottom:14}}>{L("Ready to go deeper?","Готов идти глубже?","¿Listo para ir más profundo?")}</h2>
          <p style={{color:"rgba(240,236,228,.48)",fontSize:14,marginBottom:24,lineHeight:1.7}}>{L("If something in your practice is calling for more than a daily quest — a real conversation, a thinking partner, someone in your corner — I'd love to connect.","Если что-то в твоей практике требует большего — настоящего разговора, партнёра по мышлению — я рада пообщаться.","Si algo en tu práctica pide más que un quest diario — una conversación real, un compañero de pensamiento — me encantaría conectar.")}</p>
          <a href="https://cal.com/alexandera-zaharris-soleil/30min" target="_blank" rel="noopener noreferrer" style={{display:"block",background:"rgba(212,163,89,.1)",border:"0.5px solid rgba(212,163,89,.3)",borderRadius:12,padding:"16px 20px",fontSize:14,color:"#d4a359",textDecoration:"none",textAlign:"center",marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>✨ {L("Book a free 30-min discovery call","Записаться на бесплатную сессию","Reservar sesión de descubrimiento gratuita")}</a>
          </div>
        )}
        
        {/* HOW IT WORKS */}
        {screen==="howto"&&(
          <div key={animKey} style={{paddingTop:40}}>
            <p style={{fontSize:12,color:"#d4a359",letterSpacing:".1em",textTransform:"uppercase",marginBottom:12}}>{L("About Soleil Quest","О Soleil Quest","Sobre Soleil Quest")}</p>
            <h2 style={{fontFamily:"Fraunces,serif",fontSize:24,fontWeight:600,lineHeight:1.2,marginBottom:14}}>{L("A daily practice for your inner world","Ежедневная практика для внутреннего мира","Una práctica diaria para tu mundo interior")}</h2>
            <p style={{color:"rgba(240,236,228,.48)",fontSize:14,marginBottom:12,lineHeight:1.7}}>{L("Most people start their day reacting — to notifications, to other people's needs, to whatever's loudest. Soleil Quest invites you to start from the inside out.","Большинство людей начинают день реагируя — на уведомления, на чужие потребности. Soleil Quest приглашает начать изнутри.","La mayoría empieza el día reaccionando — a notificaciones, a las necesidades de otros. Soleil Quest te invita a empezar desde adentro.")}</p>

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
