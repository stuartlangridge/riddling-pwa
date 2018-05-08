Riddling
========

Riddling: A puzzle game involving intelligence, psychology, lateral thinking, research, and guesswork. For Google fiends, librarians, mathematicians, linguists, and pub quiz winners.

The PWA version.

Create new icons with the make_icons.py script, which requires imagemagick to be around.

This requires `resources/riddles-unhashed.js`, which is the actual list of answers and looks like:

    exports.riddles = [
        {},
        { clue: "", answer: "1" },
        { clue: "one", answer: "two",
            explanation: "Numbers, in words." },
        { clue: "b", answer: "c",
            explanation: "Letters of the alphabet." },
        ...
    ];
    exports.universal = "text which acts as a cheat's correct answer";
