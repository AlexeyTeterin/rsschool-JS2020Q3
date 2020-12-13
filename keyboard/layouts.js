const layouts = {
  ru: [
    'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
    'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\',
    'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter',
    'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'uarr',
    'sound', 'mic', 'lctrl', 'lalt', ' ', 'alt', 'lang', 'ctrl', 'larr', 'darr', 'rarr', 'on/off',
  ],
  en: [
    '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
    'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\',
    'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter',
    'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'uarr',
    'sound', 'mic', 'lctrl', 'lalt', ' ', 'alt', 'lang', 'ctrl', 'larr', 'darr', 'rarr', 'on/off',
  ],
  ruShifted: [
    'Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'backspace',
    'tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', '/',
    'caps', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', 'enter',
    'shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', 'uarr',
    'sound', 'mic', 'lctrl', 'lalt', ' ', 'alt', 'lang', 'ctrl', 'larr', 'darr', 'rarr', 'on/off',
  ],
  enShifted: [
    '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace',
    'tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', '|',
    'caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'enter',
    'shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'uarr',
    'sound', 'mic', 'lctrl', 'lalt', ' ', 'alt', 'lang', 'ctrl', 'larr', 'darr', 'rarr', 'on/off',
  ],
  whichCodes: [
    192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 189, 187, 8,
    9, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221, 220,
    20, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 222, 13,
    999, 90, 88, 67, 86, 66, 78, 77, 188, 190, 191,
  ],
  infoEn: 'Use <strong>&nbspShift + Ctrl </strong>&nbspor <strong>&nbspShift + Alt </strong>&nbspto change layout',
  infoRu: 'Для смены раскладки используйте <strong>&nbspShift + Ctrl </strong>&nbspили <strong>&nbspShift + Alt </strong>&nbsp',
};

export { layouts };
