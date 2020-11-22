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
];

CARDS.map((el) => {
  const card = el;
  card.sound = `../assets/audio/${card.category}_${card.word}.mp3`;
  return card;
});

export default CARDS;
