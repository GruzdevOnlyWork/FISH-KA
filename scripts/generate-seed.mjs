import XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Read Excel file
const wb = XLSX.readFile(join(ROOT, 'Прайс-лист от 04.03.2026 (1).xlsx'));
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

// Skip header row
const header = rows[0];
console.log('Header:', header);
console.log('Total rows:', rows.length - 1);

// ===================== CATEGORIES =====================
const categories = [
  { slug: 'lures-spinners', name: 'Блёсны', icon: '🎣', description: 'Вращающиеся, колеблющиеся блёсны и незацепляйки' },
  { slug: 'lures-wobblers', name: 'Воблеры', icon: '🐟', description: 'Воблеры различных типов и заглублений' },
  { slug: 'lures-soft', name: 'Мягкие приманки', icon: '🪱', description: 'Силиконовые приманки, мандулы, поролонки' },
  { slug: 'topwater', name: 'Поверхностные', icon: '🌊', description: 'Попперы, хорватские яйца, лягушки-незацепляйки' },
  { slug: 'rods', name: 'Удилища', icon: '🎋', description: 'Фидерные, спиннинговые удилища и комплектующие' },
  { slug: 'reels', name: 'Катушки', icon: '🔄', description: 'Безынерционные, мультипликаторные, проводочные катушки' },
  { slug: 'lines', name: 'Лески и шнуры', icon: '🧵', description: 'Монофильные лески, плетёные шнуры, флюорокарбон' },
  { slug: 'hooks', name: 'Крючки', icon: '🪝', description: 'Крючки, тройники, двойники, офсетные крючки' },
  { slug: 'tackle', name: 'Оснастка', icon: '🎯', description: 'Поплавки, грузила, вертлюги, застёжки, кормушки' },
  { slug: 'bait', name: 'Прикормка', icon: '🥫', description: 'Прикормки, ароматизаторы, насадки, наживки' },
  { slug: 'clothing', name: 'Одежда', icon: '🧥', description: 'Костюмы, шапки, перчатки, термобельё' },
  { slug: 'bags', name: 'Сумки и чехлы', icon: '🎒', description: 'Чехлы для удилищ, сумки, рюкзаки, тубусы' },
  { slug: 'accessories', name: 'Аксессуары', icon: '🔧', description: 'Сигнализаторы, стойки, инструменты, мелочи' },
];

// ===================== CATEGORY MATCHING =====================
const categoryRules = [
  { slug: 'lures-wobblers', keywords: ['ВОБЛЕР', 'МИНИВОБЛЕР', 'МИНИ-ВОБЛЕР'] },
  { slug: 'lures-spinners', keywords: ['БЛЕСНА'] },
  { slug: 'topwater', keywords: ['ПОППЕР', 'ПОПЛОПОППЕР', 'ХОРВАТСКОЕ ЯЙЦО', 'ЛЯГУШКА'] },
  { slug: 'lures-soft', keywords: ['СИЛИКОН', 'МАНДУЛА', 'ПОРОЛОНКА', 'ПРИМАНКА ПОРОЛОНОВАЯ', 'СВИМБЕЙТ', 'ТЕЙЛ-СПИННЕР', 'ПРИМАНКА'] },
  { slug: 'rods', keywords: ['УДИЛИЩЕ', 'ФИДЕРНОЕ УДИЛИЩЕ', 'КВИВЕРТИП', 'НАБОР КВИВЕРТИПОВ', 'НАБОР ФИДЕРНЫХ ХЛЫСТОВ', 'КОЛЬЦО ПРОПУСКНОЕ'] },
  { slug: 'reels', keywords: ['КАТУШКА'] },
  { slug: 'lines', keywords: ['ЛЕСКА', 'ШНУР', 'ФИДЕРГАМ'] },
  { slug: 'hooks', keywords: ['КРЮЧОК', 'КРЮЧКИ', 'ТРОЙНИК', 'ДВОЙНИК', 'АССИСТ', 'ДЖИГ-СПИРАЛЬ'] },
  { slug: 'tackle', keywords: [
    'ПОПЛАВОК', 'ПОПЛАВОЧНАЯ ОСНАСТКА', 'ГРУЗ', 'ВЕРТЛЮГ', 'ЗАСТЕЖКА', 'КОРМУШКА',
    'МОНТАЖ', 'ОСНАСТКА', 'СТОПОР', 'БОМБАРДА', 'АНТИЗАКРУЧИВАТЕЛЬ', 'БОКОВОЙ ОТВОД',
    'КОННЕКТОР', 'СТРИНГЕР', 'БУБЕНЧИК', 'СИГНАЛИЗАТОР', 'КОЛЬЦО ЗАВОДНОЕ',
    'КОЛЬЦО разгрузочное', 'МАКУШАТНИК', 'ПОВОДКИ', 'КАРАБИН', 'СПИРАЛЬ',
    'ПРУЖИНКА', 'НАПАЛЬЧНИК', 'КРЕПЛЕНИЕ ПОПЛАВКА', 'СТОПОР-КРЕПЛЕНИЕ',
    'НАСАДКА для стойки', 'НАСАДКА фидерная', 'НАСАДКА карповая', 'НАСАДКА НА СТОЙКУ',
    'НАСАДКА-ГРЕБЕНКА', 'НАСАДКА-СИГНАЛИЗАТОР', 'НАСАДКА светонакопительная',
    'НАСАДКА ДЛЯ ФИДЕРА', 'КОМПЛЕКТ ЗАКОРМ',
  ]},
  { slug: 'bait', keywords: [
    'ПРИКОРМКА', 'АРОМА', 'БОЙЛЫ', 'ТЕСТО', 'ДИП', 'ДОБАВКА', 'МЕЛАССА',
    'ПШЕНО', 'ХАЛВА', 'КУКУРУЗА', 'ОПАРЫШ', 'МОТЫЛЬ', 'ПЕНОПЛАСТ', 'КОНЦЕНТРАТ',
    'ДРОПМИКС', 'МАКУХА', 'ЖМЫХ', 'ЗЕРНО', 'КОНОПЛЯ', 'ПЛАСТИЛИН', 'ФЛУОРО ДИП',
    'ДУНАЕВ КОМПОНЕНТ', 'ЗЕРНОВОЙ МИКС', 'МИНИ-БОЙЛЫ', 'КАПЛИ ароматические',
    'КРАСИТЕЛЬ ДЛЯ ПРИКОРМКИ', 'МАСЛО АРОМАТИЧЕСКОЕ', 'ШАР ПРИКОРМОЧНЫЙ',
    'НАСАДКА', // catch generic "НАСАДКА" (bait meaning)
  ]},
  { slug: 'clothing', keywords: [
    'КОСТЮМ', 'ШАПКА', 'ПЕРЧАТКИ', 'ВАРЕЖКИ', 'КЕПКА', 'ТЕРМОБЕЛЬЕ', 'ФУТБОЛКА',
    'ПЛАЩ', 'БАЛАКЛАВА', 'БАНДАНА', 'ДЖЕРСИ', 'ПАНАМА', 'ШЛЯПА', 'ШАРФ', 'ШЛЕМ',
    'НОСКИ', 'КУРТКА', 'РУКАВИЦЫ', 'ЖИЛЕТ СПАСАТЕЛЬНЫЙ', 'НАКОЛЕННИКИ', 'НАКОМАРНИК',
    'РЕМЕНЬ', 'МУФТА', 'ТЕРМОНОСКИ',
  ]},
  { slug: 'bags', keywords: [
    'ЧЕХОЛ', 'СУМКА', 'РЮКЗАК', 'ТУБУС', 'ФУТЛЯР', 'ПОВОДОЧНИЦА', 'КАН',
    'МОТОВИЛО', 'ТЕРМОСУМКА',
  ]},
  { slug: 'accessories', keywords: [
    'СТОЙКА', 'СМАЗКА', 'СВЕТЛЯЧОК', 'СВЕТЛЯЧКИ', 'РОГАТКА', 'КРУЖОК', 'КВОКЕР',
    'ИЗМЕЛЬЧИТЕЛЬ', 'ФОРМА-', 'ПРЕСС', 'СУШИЛКА', 'ФИКСАТОР', 'АНТЕННА',
    'КЕМБРИК', 'БУСИН', 'БИСЕР', 'ВАБИК', 'МУШКА', 'СТРИМЕР', 'ВИНТ',
    'РУЧКА ДЛЯ КАТУШКИ', 'ШУМОВАЯ', 'ТРУБКА', 'РЕЗИНКА', 'СТОРОЖОК', 'КИВОК',
    'НАБОР КЕМБРИКОВ', 'НАБОР СТОПОРОВ', 'НАБОР КРЮЧКОВ', 'НАБОР',
    'ТЮЛЬПАН', 'ЯКОРЬ', 'КОЛОКОЛЬЧИК', 'ЕМКОСТЬ',
  ]},
];

function detectCategory(name) {
  const upper = name.toUpperCase();

  // First pass - try to match longer/more specific keywords first
  for (const rule of categoryRules) {
    // Sort keywords by length descending for most specific match
    const sortedKeywords = [...rule.keywords].sort((a, b) => b.length - a.length);
    for (const kw of sortedKeywords) {
      if (upper.startsWith(kw.toUpperCase()) || upper.startsWith('"' + kw.toUpperCase())) {
        return rule.slug;
      }
    }
  }

  // Second pass - check if keyword appears anywhere
  for (const rule of categoryRules) {
    for (const kw of rule.keywords) {
      if (upper.includes(kw.toUpperCase())) {
        return rule.slug;
      }
    }
  }

  return 'accessories'; // default
}

// ===================== BRAND EXTRACTION =====================
const knownBrands = [
  'Shimano', 'Daiwa', 'Rapala', 'Mepps', 'Abu Garcia', 'AbuGarcia', 'Abu Garsia',
  'AKARA', 'AKKOI', 'BAT', 'Bomber', 'Blue Fox', 'Kuusamo', 'Lucky John',
  'Kosadaka', 'TsuYoki', 'Grows Culture', 'Grows', 'GERMAN', 'MASTER',
  'Strike Pro', 'Pantoon21', 'RENEGADE', 'ITUMO', 'FishyCat', 'Tsuribito',
  'CHIMERA', 'LureMax', 'DUO', 'DUEL', 'Jackall', 'Columbia',
  'KAIDA', 'Kaide', 'MiFine', 'Mifine', 'Norfin', 'EXTREAL', 'Extreal',
  'HITFISH', 'HitFish', 'Aquatic', 'DUNАEV', 'ДУНАЕВ', 'Дунаев',
  'FishSeason', 'Fish Season', 'FishBait', 'КЛЕВО', 'СЕРЕДА', 'ДЕЛФИ',
  'Power Pro', 'Sunline', 'Gamakatsu', 'Owner', 'VMC', 'Cannelle',
  'Kumyang', 'BIGCAT', 'SPIKE', 'Namazu', 'Condor', 'Stinger',
  'YGK', 'INTECH', 'Pandora', 'Spider', 'LURKER',
  'VIDO', 'Plano', 'ALASKAN', 'Alaskan', 'JAXON', 'Simms',
  'Okuma', 'Penn', 'Ryobi', 'FLAGMAN', 'Флагман',
  'ХСН', 'PRIDE', 'Forest River',
  'OSPREY', 'Osprey', 'Colmic', 'Cralusso',
  'ТАЮР', 'PROVOKATOR', 'RosyDown',
  'I-am', 'ONE Force', 'TRU', 'Shiisaido', 'A-one',
  'BANDIT', 'HALCO', 'HORNET', 'MISTRALL',
  'Champion', 'Cobius', 'ZUB', 'PIONEER',
  'Deeper', 'NoName',
];

function extractBrand(name) {
  // Try known brands first
  const upper = name.toUpperCase();
  for (const brand of knownBrands) {
    if (upper.includes(brand.toUpperCase())) {
      // Return proper casing
      return brand;
    }
  }

  // Try to extract brand from quotes: "BRAND" pattern
  const quoteMatch = name.match(/"([^"]+)"/);
  if (quoteMatch) {
    const candidate = quoteMatch[1].trim();
    if (candidate.length >= 2 && candidate.length <= 30 && !candidate.includes(',')) {
      return candidate;
    }
  }

  return null;
}

// ===================== DESCRIPTION GENERATION =====================
function generateDescription(name, price, category) {
  const cleanName = name.replace(/"/g, '').trim();

  const descriptionMap = {
    'lures-spinners': () => {
      const type = cleanName.toLowerCase().includes('вращ') ? 'вращающаяся' :
                   cleanName.toLowerCase().includes('колеб') ? 'колеблющаяся' :
                   cleanName.toLowerCase().includes('незацеп') ? 'незацепляйка' : '';
      const sizeMatch = cleanName.match(/(\d+)\s*(мм|гр|г)/i);
      const size = sizeMatch ? ` ${sizeMatch[1]}${sizeMatch[2]}` : '';
      const numberMatch = cleanName.match(/#(\d+[.;,]?\d*)/);
      const number = numberMatch ? `, размер #${numberMatch[1]}` : '';
      return `Блесна ${type}${size}${number}. Качественное покрытие, стабильная игра на различных скоростях проводки. Подходит для ловли хищной рыбы.`;
    },
    'lures-wobblers': () => {
      const sizeMatch = cleanName.match(/(\d+)\s*(мм|мм\/|SP|F|S|DR|SR|SSR|MDR)/i);
      const typeMatch = cleanName.match(/(SP|F|S|DR|SR|SSR|MDR)/i);
      const size = sizeMatch ? ` ${sizeMatch[1]}мм` : '';
      const type = typeMatch ? `, тип: ${typeMatch[1].toUpperCase()}` : '';
      const depthMatch = cleanName.match(/(\d+[.,]?\d*)\s*м/);
      const depth = depthMatch ? `, заглубление до ${depthMatch[1]}м` : '';
      return `Воблер${size}${type}${depth}. Реалистичная игра, качественные тройники. Эффективен при ловле щуки, окуня, судака.`;
    },
    'lures-soft': () => {
      const sizeMatch = cleanName.match(/(\d+)\s*(мм|см|")/i);
      const size = sizeMatch ? ` ${sizeMatch[1]}${sizeMatch[2]}` : '';
      if (cleanName.toUpperCase().includes('МАНДУЛА'))
        return `Мандула${size}. Яркая составная приманка для джиговой ловли. Отличная уловистость по судаку и окуню.`;
      if (cleanName.toUpperCase().includes('ПОРОЛОН'))
        return `Поролоновая рыбка${size}. Классическая джиговая приманка. Хорошо работает по судаку на глубоких бровках.`;
      return `Мягкая приманка${size}. Реалистичная текстура и подвижность. Подходит для различных видов джиговой ловли.`;
    },
    'topwater': () => {
      if (cleanName.toUpperCase().includes('ПОППЕР') || cleanName.toUpperCase().includes('ПОПЛОПОППЕР'))
        return 'Поверхностная приманка поппер. Создает характерные хлопки и брызги при рывковой проводке. Эффективна по активному хищнику.';
      if (cleanName.toUpperCase().includes('ХОРВАТСКОЕ'))
        return 'Хорватское яйцо — поверхностная приманка-незацепляйка. Идеальна для ловли в зарослях и на мелководье.';
      return 'Поверхностная приманка-незацепляйка. Позволяет облавливать заросшие участки водоёма без зацепов.';
    },
    'rods': () => {
      const lengthMatch = cleanName.match(/(\d+[.,]?\d*)\s*м/i);
      const testMatch = cleanName.match(/(\d+[-\/]\d+)\s*гр/i);
      const length = lengthMatch ? ` Длина: ${lengthMatch[1]}м.` : '';
      const test = testMatch ? ` Тест: ${testMatch[1]}г.` : '';
      if (cleanName.toUpperCase().includes('ФИДЕР'))
        return `Фидерное удилище.${length}${test} Надёжная конструкция для донной ловли. Чувствительная вершинка для контроля поклёвки.`;
      if (cleanName.toUpperCase().includes('КВИВЕРТИП'))
        return `Сменная вершинка (квивертип) для фидерного удилища. Позволяет настроить чувствительность под условия ловли.`;
      return `Удилище.${length}${test} Качественные материалы, надёжная фурнитура.`;
    },
    'reels': () => {
      if (cleanName.toUpperCase().includes('МУЛЬТ'))
        return 'Мультипликаторная катушка. Высокая мощность и контроль при вываживании крупной рыбы. Надёжный механизм.';
      if (cleanName.toUpperCase().includes('ПРОВОД'))
        return 'Проводочная катушка. Простая и надёжная конструкция для поплавочной ловли. Лёгкий ход, точная подмотка.';
      if (cleanName.toUpperCase().includes('ЗИМН'))
        return 'Зимняя катушка. Компактная конструкция для подлёдной ловли. Работает при низких температурах.';
      if (cleanName.toUpperCase().includes('ФИД'))
        return 'Фидерная катушка. Усиленная конструкция для дальнего заброса тяжёлых кормушек. Плавный фрикцион.';
      return 'Безынерционная катушка. Плавный ход, надёжный фрикционный тормоз. Подходит для различных видов ловли.';
    },
    'lines': () => {
      const diameterMatch = cleanName.match(/(\d+[.,]\d+)\s*мм/i);
      const lengthMatch = cleanName.match(/(\d+)\s*м/i);
      const diameter = diameterMatch ? ` Диаметр: ${diameterMatch[1]}мм.` : '';
      const length = lengthMatch ? ` Длина: ${lengthMatch[1]}м.` : '';
      if (cleanName.toUpperCase().includes('ШНУР') || cleanName.toUpperCase().includes('ПЛЕТЕН'))
        return `Плетёный шнур.${diameter}${length} Высокая разрывная нагрузка, минимальная растяжимость. Чувствительность и контроль приманки.`;
      if (cleanName.toUpperCase().includes('Ф/КАРБОН') || cleanName.toUpperCase().includes('ФЛЮОР'))
        return `Флюорокарбоновая леска.${diameter}${length} Невидима в воде, устойчива к истиранию. Отлично подходит для поводков.`;
      return `Монофильная леска.${diameter}${length} Хорошая растяжимость, устойчивость к ультрафиолету. Универсальное применение.`;
    },
    'hooks': () => {
      const sizeMatch = cleanName.match(/#?(\d+[/]?\d*)/);
      if (cleanName.toUpperCase().includes('ТРОЙНИК'))
        return 'Тройной крючок из высокоуглеродистой стали. Острая заточка, надёжное покрытие. Для оснащения воблеров и блёсен.';
      if (cleanName.toUpperCase().includes('ДВОЙНИК'))
        return 'Двойной крючок. Прочная конструкция, химическая заточка жала. Для джиговых монтажей и оснащения приманок.';
      if (cleanName.toUpperCase().includes('ОФСЕТ'))
        return 'Офсетный крючок для монтажа мягких приманок. Обеспечивает незацепляемость и надёжную подсечку.';
      if (cleanName.toUpperCase().includes('АССИСТ'))
        return 'Ассист-крючок с титановым поводком. Для оснащения пилькеров и металлических приманок при морской ловле.';
      return 'Рыболовный крючок из высококачественной стали. Химическая заточка, антикоррозийное покрытие.';
    },
    'tackle': () => {
      if (cleanName.toUpperCase().includes('ПОПЛАВОК'))
        return 'Рыболовный поплавок. Чувствительная конструкция, яркая антенна для хорошей видимости. Точная огрузка.';
      if (cleanName.toUpperCase().includes('КОРМУШКА'))
        return 'Фидерная кормушка. Равномерное вымывание прикормки, аэродинамичная форма для дальнего заброса.';
      if (cleanName.toUpperCase().includes('ВЕРТЛЮГ'))
        return 'Вертлюг из нержавеющей стали. Предотвращает перекручивание лески. Высокая разрывная нагрузка.';
      if (cleanName.toUpperCase().includes('ЗАСТЕЖКА'))
        return 'Рыболовная застёжка. Быстрая смена приманки без перевязывания. Надёжная фиксация.';
      if (cleanName.toUpperCase().includes('СИГНАЛИЗАТОР'))
        return 'Сигнализатор поклёвки. Своевременное оповещение о поклёвке. Надёжная конструкция.';
      if (cleanName.toUpperCase().includes('МОНТАЖ'))
        return 'Готовый фидерный монтаж. Правильная оснастка для эффективной донной ловли. Экономия времени на водоёме.';
      return 'Рыболовная оснастка. Качественные материалы, надёжная конструкция для различных способов ловли.';
    },
    'bait': () => {
      if (cleanName.toUpperCase().includes('ПРИКОРМКА'))
        return 'Рыболовная прикормка. Сбалансированный состав для привлечения рыбы. Оптимальная фракция и ароматика.';
      if (cleanName.toUpperCase().includes('АРОМА') || cleanName.toUpperCase().includes('ДИП'))
        return 'Ароматическая добавка для прикормки и насадки. Усиливает привлекающий эффект, повышает количество поклёвок.';
      if (cleanName.toUpperCase().includes('БОЙЛЫ'))
        return 'Бойлы для карповой ловли. Привлекательный аромат, плотная структура для дальнего заброса.';
      if (cleanName.toUpperCase().includes('ТЕСТО'))
        return 'Рыболовное тесто — готовая насадка. Удобно использовать, хорошо держится на крючке.';
      return 'Насадка/добавка для рыбалки. Эффективно привлекает рыбу, улучшает результат ловли.';
    },
    'clothing': () => {
      if (cleanName.toUpperCase().includes('КОСТЮМ'))
        return 'Рыболовный костюм. Защита от ветра и влаги, дышащие материалы. Удобный крой для активного отдыха.';
      if (cleanName.toUpperCase().includes('ШАПКА') || cleanName.toUpperCase().includes('УШАНКА'))
        return 'Тёплая шапка для рыбалки. Сохраняет тепло в холодную погоду, удобная посадка.';
      if (cleanName.toUpperCase().includes('ПЕРЧАТКИ') || cleanName.toUpperCase().includes('ВАРЕЖКИ'))
        return 'Рыболовные перчатки/варежки. Сохраняют тепло рук, позволяют работать со снастями.';
      if (cleanName.toUpperCase().includes('ТЕРМОБЕЛЬЕ') || cleanName.toUpperCase().includes('ТЕРМОНОСКИ'))
        return 'Термобельё для рыбалки. Отводит влагу, сохраняет тепло тела при низких температурах.';
      return 'Одежда для рыбалки. Функциональные материалы, продуманный крой для комфорта на водоёме.';
    },
    'bags': () => {
      if (cleanName.toUpperCase().includes('ЧЕХОЛ ДЛЯ УДИЛИЩ'))
        return 'Чехол для удилищ. Защита при транспортировке, удобные ручки и ремень. Прочный материал.';
      if (cleanName.toUpperCase().includes('ЧЕХОЛ ДЛЯ КАТУШ') || cleanName.toUpperCase().includes('ЧЕХОЛ ДЯ КАТУШ'))
        return 'Чехол для катушек. Защита от ударов и царапин при хранении и транспортировке.';
      if (cleanName.toUpperCase().includes('СУМКА'))
        return 'Рыболовная сумка. Вместительные отделения для снастей, прочный водостойкий материал.';
      if (cleanName.toUpperCase().includes('РЮКЗАК'))
        return 'Рыболовный рюкзак. Эргономичная конструкция, множество карманов для снастей и личных вещей.';
      if (cleanName.toUpperCase().includes('МОТОВИЛО'))
        return 'Мотовило для хранения оснасток. Удобная намотка, компактное хранение готовых монтажей.';
      if (cleanName.toUpperCase().includes('ПОВОДОЧНИЦА'))
        return 'Поводочница для хранения готовых поводков. Защищает крючки, сохраняет порядок.';
      return 'Аксессуар для хранения и транспортировки рыболовного снаряжения.';
    },
    'accessories': () => {
      if (cleanName.toUpperCase().includes('СТОЙКА'))
        return 'Стойка для удилищ. Устойчивая конструкция, регулируемая высота. Надёжная фиксация удилища.';
      if (cleanName.toUpperCase().includes('СМАЗКА'))
        return 'Смазка для обслуживания катушек. Обеспечивает плавный ход механизма, продлевает срок службы.';
      if (cleanName.toUpperCase().includes('КИВОК') || cleanName.toUpperCase().includes('СТОРОЖОК'))
        return 'Кивок/сторожок для зимней и летней ловли. Чувствительная регистрация поклёвки.';
      if (cleanName.toUpperCase().includes('МУШКА'))
        return 'Искусственная мушка для нахлыстовой и спиннинговой ловли. Реалистичная имитация насекомого.';
      return 'Рыболовный аксессуар. Полезная мелочь для удобства на рыбалке.';
    },
  };

  const generator = descriptionMap[category];
  return generator ? generator() : 'Рыболовный товар. Качественные материалы, надёжная конструкция.';
}

// ===================== ATTRIBUTE EXTRACTION =====================
function extractAttributes(name, price, category) {
  const attrs = [];
  const upper = name.toUpperCase();

  // Weight extraction (e.g., "15гр", "2.5 г", "0,8г")
  const weightMatch = name.match(/(\d+[.,]?\d*)\s*(гр|г)\b/i);
  // Length extraction (e.g., "75мм", "2.1м", "150 см")
  const lengthMm = name.match(/(\d+[.,]?\d*)\s*мм/i);
  const lengthCm = name.match(/(\d+[.,]?\d*)\s*см/i);
  const lengthM = name.match(/(\d+[.,]?\d*)\s*м\b/i);
  // Size/number (e.g., "#3", "№2", "размер 4")
  const sizeMatch = name.match(/#(\d+[/.]?\d*)/);
  const numMatch = name.match(/№\s*(\d+[/.]?\d*)/);
  // Color extraction
  const colorPatterns = [
    'черный', 'чёрный', 'белый', 'красный', 'синий', 'зеленый', 'зелёный',
    'желтый', 'жёлтый', 'оранжевый', 'серый', 'серебр', 'золот', 'розовый',
    'коричневый', 'фиолетовый', 'хаки', 'камуфляж', 'цвет'
  ];

  switch (category) {
    case 'lures-spinners': {
      if (weightMatch) attrs.push({ name: 'Вес', value: weightMatch[1].replace(',', '.'), data_type: 'number', unit: 'г' });
      if (lengthMm) attrs.push({ name: 'Длина', value: lengthMm[1].replace(',', '.'), data_type: 'number', unit: 'мм' });
      if (sizeMatch) attrs.push({ name: 'Размер', value: `#${sizeMatch[1]}`, data_type: 'text', unit: null });
      const spinType = upper.includes('ВРАЩ') ? 'Вращающаяся' : upper.includes('КОЛЕБ') ? 'Колеблющаяся' : upper.includes('НЕЗАЦЕП') ? 'Незацепляйка' : null;
      if (spinType) attrs.push({ name: 'Тип', value: spinType, data_type: 'text', unit: null });
      attrs.push({ name: 'Назначение', value: 'Хищная рыба', data_type: 'text', unit: null });
      break;
    }
    case 'lures-wobblers': {
      if (lengthMm) attrs.push({ name: 'Длина', value: lengthMm[1].replace(',', '.'), data_type: 'number', unit: 'мм' });
      if (weightMatch) attrs.push({ name: 'Вес', value: weightMatch[1].replace(',', '.'), data_type: 'number', unit: 'г' });
      const wobType = name.match(/\b(SP|F|S)\b/);
      if (wobType) {
        const typeMap = { 'SP': 'Суспендер', 'F': 'Плавающий', 'S': 'Тонущий' };
        attrs.push({ name: 'Плавучесть', value: typeMap[wobType[1]] || wobType[1], data_type: 'text', unit: null });
      }
      const depthMatch = name.match(/(\d+[.,]?\d*)\s*м\b/i);
      if (depthMatch && parseFloat(depthMatch[1].replace(',', '.')) <= 10) {
        attrs.push({ name: 'Заглубление', value: depthMatch[1].replace(',', '.'), data_type: 'number', unit: 'м' });
      }
      const drMatch = name.match(/\b(DR|SR|SSR|MDR|DD)\b/i);
      if (drMatch) attrs.push({ name: 'Глубина погружения', value: drMatch[1].toUpperCase(), data_type: 'text', unit: null });
      break;
    }
    case 'lures-soft': {
      if (lengthMm) attrs.push({ name: 'Длина', value: lengthMm[1].replace(',', '.'), data_type: 'number', unit: 'мм' });
      else if (lengthCm) attrs.push({ name: 'Длина', value: lengthCm[1].replace(',', '.'), data_type: 'number', unit: 'см' });
      const inchMatch = name.match(/(\d+[.,]?\d*)\s*"/);
      if (inchMatch) attrs.push({ name: 'Длина', value: inchMatch[1].replace(',', '.'), data_type: 'number', unit: 'дюйм' });
      const qtyMatch = name.match(/(\d+)\s*шт/i);
      if (qtyMatch) attrs.push({ name: 'Количество в упаковке', value: qtyMatch[1], data_type: 'number', unit: 'шт' });
      const softType = upper.includes('МАНДУЛА') ? 'Мандула' : upper.includes('ПОРОЛОН') ? 'Поролонка' : upper.includes('СВИМБЕЙТ') ? 'Свимбейт' : upper.includes('ТЕЙЛ') ? 'Тейл-спиннер' : 'Силиконовая приманка';
      attrs.push({ name: 'Тип', value: softType, data_type: 'text', unit: null });
      break;
    }
    case 'topwater': {
      if (lengthMm) attrs.push({ name: 'Длина', value: lengthMm[1].replace(',', '.'), data_type: 'number', unit: 'мм' });
      if (weightMatch) attrs.push({ name: 'Вес', value: weightMatch[1].replace(',', '.'), data_type: 'number', unit: 'г' });
      const twType = upper.includes('ПОППЕР') ? 'Поппер' : upper.includes('ХОРВАТСКОЕ') ? 'Хорватское яйцо' : upper.includes('ЛЯГУШКА') ? 'Лягушка' : 'Поверхностная приманка';
      attrs.push({ name: 'Тип', value: twType, data_type: 'text', unit: null });
      break;
    }
    case 'rods': {
      if (lengthM) attrs.push({ name: 'Длина', value: lengthM[1].replace(',', '.'), data_type: 'number', unit: 'м' });
      const testMatch = name.match(/(\d+[-/]\d+)\s*г/i);
      if (testMatch) attrs.push({ name: 'Тест', value: testMatch[1], data_type: 'text', unit: 'г' });
      const secMatch = name.match(/(\d+)\s*секц/i);
      if (secMatch) attrs.push({ name: 'Количество секций', value: secMatch[1], data_type: 'number', unit: null });
      const rodType = upper.includes('ФИДЕР') ? 'Фидерное' : upper.includes('СПИННИНГ') ? 'Спиннинговое' : upper.includes('КВИВЕРТИП') ? 'Квивертип' : 'Удилище';
      attrs.push({ name: 'Тип', value: rodType, data_type: 'text', unit: null });
      break;
    }
    case 'reels': {
      const sizeReelMatch = name.match(/(\d{4,5})/);
      if (sizeReelMatch) attrs.push({ name: 'Размер', value: sizeReelMatch[1], data_type: 'text', unit: null });
      const bbMatch = name.match(/(\d+)\s*[+]\s*\d+\s*bb/i) || name.match(/(\d+)\s*bb/i) || name.match(/(\d+)\s*подш/i);
      if (bbMatch) attrs.push({ name: 'Подшипники', value: bbMatch[1], data_type: 'number', unit: 'шт' });
      const ratioMatch = name.match(/(\d+[.,]\d+:\d+)/);
      if (ratioMatch) attrs.push({ name: 'Передаточное число', value: ratioMatch[1], data_type: 'text', unit: null });
      const reelType = upper.includes('МУЛЬТ') ? 'Мультипликаторная' : upper.includes('ПРОВОД') ? 'Проводочная' : upper.includes('ЗИМН') ? 'Зимняя' : 'Безынерционная';
      attrs.push({ name: 'Тип', value: reelType, data_type: 'text', unit: null });
      break;
    }
    case 'lines': {
      const diaMatch = name.match(/(\d+[.,]\d+)\s*мм/i);
      if (diaMatch) attrs.push({ name: 'Диаметр', value: diaMatch[1].replace(',', '.'), data_type: 'number', unit: 'мм' });
      const lineLenMatch = name.match(/(\d+)\s*м\b/i);
      if (lineLenMatch) attrs.push({ name: 'Длина', value: lineLenMatch[1], data_type: 'number', unit: 'м' });
      const lbMatch = name.match(/(\d+[.,]?\d*)\s*(кг|lb)/i);
      if (lbMatch) attrs.push({ name: 'Разрывная нагрузка', value: lbMatch[1].replace(',', '.'), data_type: 'number', unit: lbMatch[2] });
      const lineType = upper.includes('ШНУР') || upper.includes('ПЛЕТЕН') ? 'Плетёный шнур' : upper.includes('ФЛЮОР') || upper.includes('Ф/КАРБОН') ? 'Флюорокарбон' : 'Монофильная леска';
      attrs.push({ name: 'Тип', value: lineType, data_type: 'text', unit: null });
      break;
    }
    case 'hooks': {
      if (sizeMatch) attrs.push({ name: 'Размер', value: `#${sizeMatch[1]}`, data_type: 'text', unit: null });
      else if (numMatch) attrs.push({ name: 'Размер', value: `№${numMatch[1]}`, data_type: 'text', unit: null });
      const qtyHMatch = name.match(/(\d+)\s*шт/i);
      if (qtyHMatch) attrs.push({ name: 'Количество в упаковке', value: qtyHMatch[1], data_type: 'number', unit: 'шт' });
      const hookType = upper.includes('ТРОЙНИК') ? 'Тройник' : upper.includes('ДВОЙНИК') ? 'Двойник' : upper.includes('ОФСЕТ') ? 'Офсетный' : upper.includes('АССИСТ') ? 'Ассист-крючок' : 'Крючок';
      attrs.push({ name: 'Тип', value: hookType, data_type: 'text', unit: null });
      break;
    }
    case 'tackle': {
      if (weightMatch) attrs.push({ name: 'Вес', value: weightMatch[1].replace(',', '.'), data_type: 'number', unit: 'г' });
      if (lengthMm) attrs.push({ name: 'Длина', value: lengthMm[1].replace(',', '.'), data_type: 'number', unit: 'мм' });
      const qtyTMatch = name.match(/(\d+)\s*шт/i);
      if (qtyTMatch) attrs.push({ name: 'Количество в упаковке', value: qtyTMatch[1], data_type: 'number', unit: 'шт' });
      break;
    }
    case 'bait': {
      const weightBMatch = name.match(/(\d+[.,]?\d*)\s*(кг|г)\b/i);
      if (weightBMatch) attrs.push({ name: 'Вес', value: weightBMatch[1].replace(',', '.'), data_type: 'number', unit: weightBMatch[2] });
      const volMatch = name.match(/(\d+)\s*мл/i);
      if (volMatch) attrs.push({ name: 'Объём', value: volMatch[1], data_type: 'number', unit: 'мл' });
      const baitType = upper.includes('ПРИКОРМКА') ? 'Прикормка' : upper.includes('АРОМА') || upper.includes('ДИП') ? 'Ароматизатор' : upper.includes('БОЙЛЫ') ? 'Бойлы' : upper.includes('ТЕСТО') ? 'Тесто' : 'Насадка';
      attrs.push({ name: 'Тип', value: baitType, data_type: 'text', unit: null });
      break;
    }
    case 'clothing': {
      const sizeClMatch = name.match(/\b(XS|S|M|L|XL|XXL|XXXL|\d{2}-\d{2})\b/i);
      if (sizeClMatch) attrs.push({ name: 'Размер', value: sizeClMatch[1].toUpperCase(), data_type: 'text', unit: null });
      const clothType = upper.includes('КОСТЮМ') ? 'Костюм' : upper.includes('ШАПКА') || upper.includes('УШАНКА') ? 'Головной убор' : upper.includes('ПЕРЧАТКИ') || upper.includes('ВАРЕЖКИ') ? 'Перчатки' : upper.includes('ТЕРМОБЕЛ') ? 'Термобельё' : upper.includes('КУРТКА') ? 'Куртка' : upper.includes('ЖИЛЕТ') ? 'Жилет' : 'Одежда';
      attrs.push({ name: 'Тип', value: clothType, data_type: 'text', unit: null });
      const tempMatch = name.match(/-(\d+)/);
      if (tempMatch && parseInt(tempMatch[1]) >= 10) attrs.push({ name: 'Температура комфорта', value: `-${tempMatch[1]}`, data_type: 'number', unit: '°C' });
      break;
    }
    case 'bags': {
      if (lengthCm) attrs.push({ name: 'Длина', value: lengthCm[1].replace(',', '.'), data_type: 'number', unit: 'см' });
      const bagType = upper.includes('ЧЕХОЛ') ? 'Чехол' : upper.includes('СУМКА') ? 'Сумка' : upper.includes('РЮКЗАК') ? 'Рюкзак' : upper.includes('ТУБУС') ? 'Тубус' : upper.includes('МОТОВИЛО') ? 'Мотовило' : upper.includes('ПОВОДОЧНИЦА') ? 'Поводочница' : 'Сумка';
      attrs.push({ name: 'Тип', value: bagType, data_type: 'text', unit: null });
      break;
    }
    case 'accessories': {
      if (weightMatch) attrs.push({ name: 'Вес', value: weightMatch[1].replace(',', '.'), data_type: 'number', unit: 'г' });
      if (lengthMm) attrs.push({ name: 'Длина', value: lengthMm[1].replace(',', '.'), data_type: 'number', unit: 'мм' });
      break;
    }
  }

  // Always add price category
  if (price < 500) attrs.push({ name: 'Ценовая категория', value: 'Бюджет', data_type: 'text', unit: null });
  else if (price < 2000) attrs.push({ name: 'Ценовая категория', value: 'Средняя', data_type: 'text', unit: null });
  else if (price < 10000) attrs.push({ name: 'Ценовая категория', value: 'Выше среднего', data_type: 'text', unit: null });
  else attrs.push({ name: 'Ценовая категория', value: 'Премиум', data_type: 'text', unit: null });

  return attrs;
}

// ===================== PARSE PRICE =====================
function parsePrice(priceStr) {
  if (typeof priceStr === 'number') return priceStr;
  const cleaned = String(priceStr).replace(/\s/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// ===================== ESCAPE SQL =====================
function escapeSql(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "''");
}

// ===================== MAIN =====================
const products = [];
const categoryStats = {};

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (!row[0]) continue; // skip empty rows

  let name = String(row[0]).trim();
  if (!name) continue;

  // Remove BOM
  name = name.replace(/^\uFEFF/, '');

  const productCode = String(row[1] || '').trim();
  const article = String(row[2] || '').trim();
  const unit = String(row[3] || '').trim();
  const price = parsePrice(row[4]);
  const barcode = String(row[5] || '').trim();

  if (price <= 0) continue;

  // Clean name - remove surrounding quotes, normalize internal quotes, remove newlines
  let cleanName = name
    .replace(/[\r\n]+/g, ' ')  // remove newlines
    .replace(/\\/g, '/')       // backslashes to forward slashes
    .replace(/^"+|"+$/g, '')   // remove leading/trailing quotes
    .replace(/""+/g, '"')      // collapse multiple quotes
    .replace(/^"/, '')         // remove leading quote if still there
    .replace(/"$/, '')         // remove trailing quote if still there
    .replace(/'/g, '')         // remove apostrophes (problematic for SQL)
    .trim();

  // Replace internal quotes with spaces
  cleanName = cleanName.replace(/"\s*"/g, ' ').replace(/"/g, ' ').replace(/\s{2,}/g, ' ').trim();

  const category = detectCategory(cleanName);
  const brand = extractBrand(cleanName);
  const description = generateDescription(cleanName, price, category);
  const attributes = extractAttributes(cleanName, price, category);

  // Random stock
  const stockQty = Math.floor(Math.random() * 46) + 5; // 5-50

  products.push({
    name: cleanName,
    description,
    price,
    category,
    brand,
    stockQty,
    barcode,
    productCode,
    attributes,
  });

  categoryStats[category] = (categoryStats[category] || 0) + 1;
}

console.log('\nCategory distribution:');
for (const [cat, count] of Object.entries(categoryStats).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count}`);
}
console.log(`\nTotal products: ${products.length}`);

// ===================== GENERATE SQL =====================
let sql = `-- ============================================
-- FISH-KA: Seed data from price list (04.03.2026)
-- Generated automatically from Excel price list
-- Total products: ${products.length}
-- ============================================

-- Clean existing data
DELETE FROM order_items;
DELETE FROM orders;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_attributes') THEN
    DELETE FROM product_attributes;
  END IF;
END $$;
DELETE FROM product_categories;
DELETE FROM products;
DELETE FROM categories;

-- Add description column if missing
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, icon, description) VALUES
${categories.map((c, i) => `  ('${escapeSql(c.name)}', '${c.slug}', '${c.icon}', '${escapeSql(c.description)}')${i < categories.length - 1 ? ',' : ';'}`).join('\n')}

-- ============================================
-- PRODUCTS
-- ============================================
`;

// Insert products in batches of 50 for readability
const BATCH_SIZE = 50;
for (let batch = 0; batch < Math.ceil(products.length / BATCH_SIZE); batch++) {
  const start = batch * BATCH_SIZE;
  const end = Math.min(start + BATCH_SIZE, products.length);
  const batchProducts = products.slice(start, end);

  const catSlug = batchProducts[0].category;
  sql += `\n-- Batch ${batch + 1} (${start + 1}-${end})\n`;
  sql += `INSERT INTO products (name, description, price, image_url, in_stock, stock_quantity, brand) VALUES\n`;

  batchProducts.forEach((p, i) => {
    const isLast = i === batchProducts.length - 1;
    sql += `  ('${escapeSql(p.name)}', '${escapeSql(p.description)}', ${p.price.toFixed(2)}, '/placeholder.svg?height=300&width=300', true, ${p.stockQty}, ${p.brand ? `'${escapeSql(p.brand)}'` : 'NULL'})${isLast ? ';' : ','}\n`;
  });
}

// ============================================
// PRODUCT_CATEGORIES junction table
// ============================================
sql += `
-- ============================================
-- PRODUCT_CATEGORIES (junction table)
-- ============================================
-- Create table if not exists
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(product_id, category_id)
);

-- Enable RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies (idempotent with IF NOT EXISTS workaround)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_categories' AND policyname = 'Allow public read product_categories') THEN
    CREATE POLICY "Allow public read product_categories" ON product_categories FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_categories' AND policyname = 'Allow public insert product_categories') THEN
    CREATE POLICY "Allow public insert product_categories" ON product_categories FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_categories' AND policyname = 'Allow authenticated delete product_categories') THEN
    CREATE POLICY "Allow authenticated delete product_categories" ON product_categories FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Link each product to its category
`;

// Generate individual INSERT statements for product_categories by matching product name
// We group products by category for efficiency
const productsByCategory = {};
for (const p of products) {
  if (!productsByCategory[p.category]) productsByCategory[p.category] = [];
  productsByCategory[p.category].push(p);
}

for (const [catSlug, catProducts] of Object.entries(productsByCategory)) {
  sql += `\n-- Category: ${catSlug} (${catProducts.length} products)\n`;
  sql += `INSERT INTO product_categories (product_id, category_id)\nSELECT p.id, c.id\nFROM products p, categories c\nWHERE c.slug = '${catSlug}'\n  AND p.name IN (\n`;
  catProducts.forEach((p, i) => {
    const isLast = i === catProducts.length - 1;
    sql += `    '${escapeSql(p.name)}'${isLast ? '' : ','}\n`;
  });
  sql += `  );\n`;
}

// ============================================
// PRODUCT_ATTRIBUTES table
// ============================================
sql += `
-- ============================================
-- PRODUCT_ATTRIBUTES
-- ============================================
CREATE TABLE IF NOT EXISTS product_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  data_type TEXT NOT NULL DEFAULT 'text' CHECK (data_type IN ('text', 'number', 'boolean')),
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON product_attributes(product_id);

ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_attributes' AND policyname = 'Allow public read product_attributes') THEN
    CREATE POLICY "Allow public read product_attributes" ON product_attributes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_attributes' AND policyname = 'Allow public insert product_attributes') THEN
    CREATE POLICY "Allow public insert product_attributes" ON product_attributes FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_attributes' AND policyname = 'Allow authenticated update product_attributes') THEN
    CREATE POLICY "Allow authenticated update product_attributes" ON product_attributes FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_attributes' AND policyname = 'Allow authenticated delete product_attributes') THEN
    CREATE POLICY "Allow authenticated delete product_attributes" ON product_attributes FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;

-- Insert attributes for products
`;

// Generate attribute inserts in batches by matching product name
const ATTR_BATCH = 50;
const productsWithAttrs = products.filter(p => p.attributes.length > 0);
for (let i = 0; i < productsWithAttrs.length; i += ATTR_BATCH) {
  const batch = productsWithAttrs.slice(i, i + ATTR_BATCH);
  sql += `\n-- Attributes batch ${Math.floor(i / ATTR_BATCH) + 1}\n`;

  for (const p of batch) {
    for (const attr of p.attributes) {
      sql += `INSERT INTO product_attributes (product_id, name, value, data_type, unit)\n`;
      sql += `  SELECT id, '${escapeSql(attr.name)}', '${escapeSql(attr.value)}', '${attr.data_type}', ${attr.unit ? `'${escapeSql(attr.unit)}'` : 'NULL'}\n`;
      sql += `  FROM products WHERE name = '${escapeSql(p.name)}';\n`;
    }
  }
}

// Write SQL file
const outPath = join(__dirname, '005-seed-real-data.sql');
writeFileSync(outPath, sql, 'utf-8');
console.log(`\nSQL written to: ${outPath}`);
console.log(`File size: ${(Buffer.byteLength(sql, 'utf-8') / 1024).toFixed(1)} KB`);
