class Forest extends AdventureScene {
    constructor() {
        super("forest", "The Forest", "#041900");
    }

    onEnter() {

        this.add.text(this.w * 0.375, this.h * 0.1, "Dirt Path")
            .setStyle({font: `${this.s*2.5}px Trebuchet MS`, color: `#7F5F3F`})
            .setInteractive()
            .setOrigin(0.5, 0)
            .on('pointerover', () => this.showMessage("A path breaking up the monotony of the forest. See where it goes?"))
            .on('pointerdown', () => {
                this.showMessage("You head down the path...");
                this.gotoScene('gate', 800);
            });

        this.add.text(this.w * 0.375, this.h * 0.9, "Tall Grass")
            .setStyle({font: `${this.s*2.5}px Trebuchet MS`, color: `#4C995F`})
            .setInteractive()
            .setOrigin(0.5, 1)
            .on('pointerover', () => this.showMessage("Part of your view is being obscured. Go deeper into the forest?"))
            .on('pointerdown', () => {
                this.showMessage("You disappear into the grass…");
                this.gotoScene('deepforest', 800);
            });

        let c_terminal = this.add.text(this.h * 0.1, this.h * 0.6, "Computer Terminal")
            .setStyle({font: `${this.s*2}px Trebuchet MS`, color: `#592C2C`})
            .setInteractive()
            .setOrigin(0, 0.5)
            .on('pointerover', () => {
                if (this.flags[0] == 1) {this.showMessage("The screen is flickering.")}
                else {this.showMessage("The screen is black.")};
            })
            .on('pointerdown', () => {
                if (this.flags[0] == 1) {this.gotoScene('terminal', 2500)}
                else {
                    this.showMessage("It seems to be broken.");
                    this.shakeObject(c_terminal);
                };
            });
    }
}

class Gate extends AdventureScene {
    constructor() {
        super("gate", "The Gate", "#333");
    }
    onEnter() {
        this.add.text(this.w * 0.375, this.h * 0.9, "Go Back")
            .setStyle({font: `${this.s*2.5}px Trebuchet MS`, color: `#496644`})
            .setInteractive()
            .setOrigin(0.5, 1)
            .on('pointerover', () => {
                this.showMessage("Go Back?");
            })
            .on('pointerdown', () => {
                this.showMessage("You head back...");
                this.gotoScene('forest', 800);
            });

        if (this.flags[1] == 0) {
            let hatch_key = this.add.text(this.w*0.75 - (this.h*0.1), this.h * 0.4, "Key")
                .setStyle({font: `${this.s*2}px Trebuchet MS`, color: `#FFD800`})
                .setInteractive()
                .setOrigin(1, 0.5)
                .on('pointerover', () => {
                    this.showMessage("A key. Pick it up?");
                })
                .on('pointerdown', () => {
                    this.showMessage("You picked up the key.");
                    this.gainItem('Key');
                    this.destroyObject(hatch_key);
                    this.flags[1] = 1;
                });
        }

        let steel_gate = this.add.text(this.w * 0.375, this.h * 0.1, "Steel Gate")
            .setStyle({font: `${this.s*3.25}px Trebuchet MS`})
            .setInteractive()
            .setOrigin(0.5, 0)
            .on('pointerover', () => {
                if (this.flags[2] == 1) {this.showMessage("Locked. There is a keypad off to the side. Enter a code?")}
                else if (this.flags[2] == 2) {this.showMessage("See what lies beyond the forest?")}
                else {this.showMessage("Locked. There is a keypad off to the side, but it seems to be powered off.")};
            })
            .on('pointerdown', () => {
                if (this.flags[2] == 1) {this.gotoScene('keypad', 1500)}
                else if (this.flags[2] == 2) {
                    this.showMessage("You leave the forest...");
                    this.gotoScene('outro');
                } else {
                    this.showMessage("Find a way to turn the power back on.");
                    this.shakeObject(steel_gate);
                };
            });
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    create() {
        this.add.text(10, 10, "TESTMODE", {fontSize: 50});

        this.w = this.game.config.width;
        this.h = this.game.config.height;

        let titleText = this.add.text(this.w*0.5, this.h*0.5 - 100, "Adventure Game", {font: `${0.05 * this.w}px Trebuchet MS`, color: '#233B2F'})
            .setOrigin(0.5, 0.5);
        titleText.alpha = 0;

        this.time.delayedCall(500, () => this.tweens.add({targets: titleText, alpha: '1', duration: 4000, ease: 'Quart.out'}));
        this.time.delayedCall(500, () => this.tweens.add({targets: titleText, y: titleText.y + 100, duration: 4000, ease: 'Quart.out'}));

        let subText = this.add.text(this.w*0.5, this.h * 0.7, "Click to begin", {font: `${0.02 * this.w}px Verdana`, color: "#404040"})
            .setOrigin(0.5, 0.5);
        subText.alpha = 0;

        this.time.delayedCall(1500, () => this.tweens.add({targets: subText, alpha: '1', duration: 1500, ease: 'Cubic.out'}));
        this.time.delayedCall(1500, () => this.tweens.add({targets: subText, y: '-=' + 0.1*this.h, duration: 1500, ease: 'Cubic.out'}));

        this.time.delayedCall(2, () => this.input.on('pointerdown', () => {
            this.cameras.main.fade(800, 0,0,0);
            this.time.delayedCall(800, () => this.scene.start('wake'));
        }));
    }
}

class Wake extends Phaser.Scene {
    constructor() {
        super('wake');
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        let wakeText = this.add.text(this.w*0.5, this.h*0.5, "Where am I?", {font: `${0.03 * this.w}px Times New Roman`, color: "#665947"})
            .setOrigin(0.5,0.5);
        wakeText.alpha = 0;
        this.time.delayedCall(2000, () => this.tweens.add({targets: wakeText, alpha: 1, duration: 300}));
        this.time.delayedCall(3000, () => this.tweens.add({targets: wakeText, alpha: 0, duration: 3000, ease: "Quart.In"}));
        this.time.delayedCall(4000, () => this.tweens.add({targets: wakeText, y: this.h, duration: 2000, ease: "Quint.In"}));
        this.time.delayedCall(6000, () => this.scene.start('forest'));
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Intro, Wake, Forest, Gate, Outro],
    title: "Adventure Game",
});

