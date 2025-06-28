const NAMES = [
    'lucus',
    'dragon',
    'spears',
    'jad',
    'boss',
    'neo',
    'frustrated',
    'excited',
    'killer',
    'guchie',
    'gangster',
    'maximillian ',
    'pink',
    'apple',
    'blue',
    'boat',
    'potato',
    'sexy',
    'jimmy',
    'lex',
    'jubb',
    'star',
    'hustler',
    'daisie',
    'dog',
    'idiot',
    'fast',
    'lieutenant',
    'special',
    'agent',
    'chief',
    'beauty',
    'princess',
];

export const createRandomUsername = (nameLength = 2, maxDigit = 99) => {
    const names: string[] = [];

    for (let i = 0; i < nameLength; i += 1) {
        names.push(NAMES[Math.floor(Math.random() * NAMES.length)]);
    }

    const digits = Math.floor(Math.random() * maxDigit).toString();
    names.push(digits);
    return names.join('');
};
