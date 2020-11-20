export const CARDS = [{
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
  {
    category: 'insects',
    word: 'butterfly',
    translation: 'бабочка',
  },
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
];

CARDS.forEach((card) => {
  card.sound = `../assets/audio/${card.category}_${card.word}.mp3`;
})
