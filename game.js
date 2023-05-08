class Forest extends AdventureScene {
    constructor() {
        super("forest", "The Forest");
    }

    onEnter() {

        let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Metal, bent."))
            .on('pointerdown', () => {
                this.showMessage("No touching!");
                this.tweens.add({
                    targets: clip,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });

        let key = this.add.text(this.w * 0.5, this.w * 0.1, "🔑 key")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("It's a nice key.")
            })
            .on('pointerdown', () => {
                this.showMessage("You pick up the key.");
                this.gainItem('key');
                this.tweens.add({
                    targets: key,
                    y: `-=${2 * this.s}`,
                    alpha: { from: 1, to: 0 },
                    duration: 500,
                    onComplete: () => key.destroy()
                });
            })

        let door = this.add.text(this.w * 0.1, this.w * 0.15, "🚪 locked door")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem("key")) {
                    this.showMessage("You've got the key for this door.");
                } else {
                    this.showMessage("It's locked. Can you find a key?");
                }
            })
            .on('pointerdown', () => {
                if (this.hasItem("key")) {
                    this.loseItem("key");
                    this.showMessage("*squeak*");
                    door.setText("🚪 unlocked door");
                    this.gotoScene('demo2');
                }
            })

    }
}

class Demo2 extends AdventureScene {
    constructor() {
        super("demo2", "The second room has a long name (it truly does).");
    }
    onEnter() {
        this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('demo1');
            });

        let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('*giggles*');
                this.tweens.add({
                    targets: finish,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });
            })
            .on('pointerdown', () => this.gotoScene('outro'));
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    create() {
        let titleText = this.add.text(0, 0, "Adventure Game", {font: "100px Trebuchet MS", color: '#233B2F'});
        titleText.x = 0.5 * (this.scale.width - titleText.width);
        titleText.y = 0.5 * (this.scale.height - titleText.height) - 100;
        titleText.alpha = 0;

        this.time.delayedCall(500, () => this.tweens.add({targets: titleText, alpha: '1', duration: 4000, ease: 'Quart.out'}));
        this.time.delayedCall(500, () => this.tweens.add({targets: titleText, y: titleText.y + 100, duration: 4000, ease: 'Quart.out'}));

        let subText = this.add.text(0, 0, "Click to begin", {font: "30px Verdana", color: "#404040"});
        subText.x = 0.5 * (this.scale.width - subText.width);
        subText.y = 0.5 * (this.scale.height - subText.height) + 200;
        subText.alpha = 0;

        this.time.delayedCall(1500, () => this.tweens.add({targets: subText, alpha: '1', duration: 1500, ease: 'Cubic.out'}));
        this.time.delayedCall(1500, () => this.tweens.add({targets: subText, y: subText.y - 50, duration: 1500, ease: 'Cubic.out'}));

        this.time.delayedCall(2000, () => this.input.on('pointerdown', () => {
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
        let wakeText = this.add.text(0, 0, "Where am I?", {font: "75px Times New Roman", color: "#665947"});
        wakeText.alpha = 0;
        wakeText.x = 0.5 * (this.scale.width - wakeText.width);
        wakeText.y = 0.5 * (this.scale.height - wakeText.height);
        this.time.delayedCall(2000, () => this.tweens.add({targets: wakeText, alpha: 1, duration: 200}));
        this.time.delayedCall(3200, () => {
            this.cameras.main.fade(100, 0,0,0);
            this.time.delayedCall(100, () => this.scene.start('forest'));
        });
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
    scene: [Intro, Wake, Forest, Demo2, Outro],
    title: "Adventure Game",
});

