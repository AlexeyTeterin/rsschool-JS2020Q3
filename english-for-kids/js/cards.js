const CARDS = [

  // animals
  {
    category: 'animals',
    word: 'chicken',
    translation: 'цыпленок',
  },
  {
    category: 'animals',
    word: 'dog',
    translation: 'собака',
  },
  {
    category: 'animals',
    word: 'pig',
    translation: 'свинья',
  },
  {
    category: 'animals',
    word: 'horse',
    translation: 'лошадь',
  },
  {
    category: 'animals',
    word: 'frog',
    translation: 'лягушка',
  },
  {
    category: 'animals',
    word: 'tiger',
    translation: 'тигр',
  },
  {
    category: 'animals',
    word: 'fish',
    translation: 'рыба',
  },
  {
    category: 'animals',
    word: 'duck',
    translation: 'утка',
  },

  // insects
  {
    category: 'insects',
    word: 'butterfly',
    translation: 'бабочка',
  }, {
    category: 'insects',
    word: 'bee',
    translation: 'пчела',
  }, {
    category: 'insects',
    word: 'snail',
    translation: 'улитка',
  }, {
    category: 'insects',
    word: 'fly',
    translation: 'муха',
  }, {
    category: 'insects',
    word: 'dragonfly',
    translation: 'стрекоза',
  }, {
    category: 'insects',
    word: 'bug',
    translation: 'жук',
  }, {
    category: 'insects',
    word: 'ladybug',
    translation: 'божья коровка',
  }, {
    category: 'insects',
    word: 'spider',
    translation: 'паук',
  }, {
    category: 'insects',
    word: 'worm',
    translation: 'червяк',
  },

  // food
  {
    category: 'food',
    word: 'pizza',
    translation: 'пицца',
  },
  {
    category: 'food',
    word: 'banana',
    translation: 'банан',
  },
  {
    category: 'food',
    word: 'apple',
    translation: 'яблоко',
  },
  {
    category: 'food',
    word: 'carrot',
    translation: 'морковь',
  },
  {
    category: 'food',
    word: 'cheese',
    translation: 'сыр',
  },
  {
    category: 'food',
    word: 'icecream',
    translation: 'мороженое',
  }, {
    category: 'food',
    word: 'mushroom',
    translation: 'гриб',
  }, {
    category: 'food',
    word: 'tomato',
    translation: 'помидор',
  },

  // nature
  {
    category: 'nature',
    word: 'cloud',
    translation: 'облако',
  }, {
    category: 'nature',
    word: 'flower',
    translation: 'цветок',
  }, {
    category: 'nature',
    word: 'grass',
    translation: 'трава',
  }, {
    category: 'nature',
    word: 'mountain',
    translation: 'гора',
  }, {
    category: 'nature',
    word: 'rain',
    translation: 'дождь',
  }, {
    category: 'nature',
    word: 'rainbow',
    translation: 'радуга',
  }, {
    category: 'nature',
    word: 'sun',
    translation: 'солнце',
  }, {
    category: 'nature',
    word: 'tree',
    translation: 'дерево',
  }, {
    category: 'nature',
    word: 'fire',
    translation: 'огонь',
  },

  // human
  {
    category: 'human',
    word: 'ear',
    translation: 'ухо',
  }, {
    category: 'human',
    word: 'eye',
    translation: 'глаз',
  }, {
    category: 'human',
    word: 'face',
    translation: 'лицо',
  }, {
    category: 'human',
    word: 'finger',
    translation: 'палец',
  }, {
    category: 'human',
    word: 'foot',
    translation: 'стопа',
  }, {
    category: 'human',
    word: 'hand',
    translation: 'рука',
  }, {
    category: 'human',
    word: 'head',
    translation: 'голова',
  }, {
    category: 'human',
    word: 'leg',
    translation: 'нога',
  }, {
    category: 'human',
    word: 'nose',
    translation: 'нос',
  },

  // numbers
  {
    category: 'numbers',
    word: 'one',
    translation: 'один',
  }, {
    category: 'numbers',
    word: 'two',
    translation: 'два',
  }, {
    category: 'numbers',
    word: 'three',
    translation: 'три',
  }, {
    category: 'numbers',
    word: 'four',
    translation: 'четыре',
  }, {
    category: 'numbers',
    word: 'five',
    translation: 'пять',
  }, {
    category: 'numbers',
    word: 'six',
    translation: 'шесть',
  }, {
    category: 'numbers',
    word: 'seven',
    translation: 'семь',
  }, {
    category: 'numbers',
    word: 'eight',
    translation: 'восемь',
  }, {
    category: 'numbers',
    word: 'nine',
    translation: 'девять',
  }, {
    category: 'numbers',
    word: 'ten',
    translation: 'десять',
  }, {
    category: 'numbers',
    word: 'zero',
    translation: 'ноль',
  },

  // transport
  {
    category: 'transport',
    word: 'plane',
    translation: 'самолёт',
  }, {
    category: 'transport',
    word: 'bus',
    translation: 'автобус',
  }, {
    category: 'transport',
    word: 'train',
    translation: 'поезд',
  }, {
    category: 'transport',
    word: 'car',
    translation: 'автомобиль',
  }, {
    category: 'transport',
    word: 'ship',
    translation: 'корабль',
  }, {
    category: 'transport',
    word: 'bicycle',
    translation: 'велосипед',
  }, {
    category: 'transport',
    word: 'submarine',
    translation: 'подлодка',
  }, {
    category: 'transport',
    word: 'truck',
    translation: 'грузовик',
  }, {
    category: 'transport',
    word: 'tram',
    translation: 'трамвай',
  },

  // clothhes
  {
    category: 'clothes',
    word: 'boots',
    translation: 'ботинки',
  }, {
    category: 'clothes',
    word: 'hat',
    translation: 'шапка',
  }, {
    category: 'clothes',
    word: 'dress',
    translation: 'платье',
  }, {
    category: 'clothes',
    word: 'mittens',
    translation: 'варежки',
  }, {
    category: 'clothes',
    word: 'pants',
    translation: 'штаны',
  }, {
    category: 'clothes',
    word: 'shorts',
    translation: 'шорты',
  }, {
    category: 'clothes',
    word: 'socks',
    translation: 'носки',
  }, {
    category: 'clothes',
    word: 't-shirt',
    translation: 'футболка',
  },
];

CARDS.map((el) => {
  const card = el;
  card.sound = `./assets/audio/${card.category}_${card.word}.mp3`;
  return card;
});

export default CARDS;
