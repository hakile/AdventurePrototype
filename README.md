A simple adventure game by Harrison Le based on a simple adventure game engine by [Adam Smith](https://github.com/rndmcnlly).

Code requirements:
- **4+ scenes based on `AdventureScene`**: Satisfied (Forest, Gate, DeepForest, Bunker, Keypad, Terminal, Terminal2).
- **2+ scenes *not* based on `AdventureScene`**: Satisfied (Intro, Wake, Outro, Outro2, Intro2).
- **2+ methods or other enhancement added to the adventure game engine to simplify my scenes**:
    - Enhancement 1: Satisfied (shakeObject(target_obj, repeat_amount = 5) which plays a shaking animation a Game Object, repeating it a set number of times).
    - Enhancement 2: Satisfied (destroyObject(target_obj) which plays a shake animation and fades out a Game Object before destroying it).

Experience requirements:
- **4+ locations in the game world**: Satisfied (Forest, Gate, DeepForest, Bunker).
- **2+ interactive objects in most scenes**: Satisfied (Steel Gate and Key in Gate, Lever and Stack Of Papers in Bunker)
- **Many objects have `pointerover` messages**: Satisfied (Every object has a pointover message)
- **Many objects have `pointerdown` effects**: Satisfied (Every object has a pointerdown effect)
- **Some objects are themselves animated**: Satisfied (texts in Intro, text in Wake, every shake animation in the AdventureScenes)

Asset sources:
- (For each image/audio/video asset used, describe how it was created. What tool did you use to create it? Was it based on another work? If so, how did you change it, and where can we learn more about the original work for comparison? Use [Markdown link syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#links).)

Code sources:
- `adventure.js` and `index.html` were created for this project [Adam Smith](https://github.com/rndmcnlly) and edited by me.
- `game.js` was sketched by [Adam Smith](https://github.com/rndmcnlly) and rewritten by me.