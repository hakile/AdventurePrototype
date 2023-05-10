class AdventureScene extends Phaser.Scene {

    init(data) {
        this.inventory = data.inventory || [];
        this.flags = data.flags || [0,0,0,0];
        this.fade_time = data.fadeTime || 3750;
        // this.fade_time = 0;
    }

    constructor(key, name = "", bgcol = "#000", hud_enabled = true) {
        super(key);
        this.name = name;
        this.bgcol = bgcol;
        this.hud_enabled = hud_enabled;
        this.last_msg = [];
    }

    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.s = this.game.config.width * 0.01;

        this.cameras.main.setBackgroundColor(this.bgcol);
        this.cameras.main.fadeIn(this.fade_time, 0, 0, 0);
        // console.log(this.flags);

        if (this.hud_enabled) {
            this.add.rectangle(this.w * 0.75, 0, this.w * 0.25, this.h).setOrigin(0, 0).setFillStyle(0);
            this.add.text(this.w * 0.875, this.s)
                .setText(this.name)
                .setOrigin(0.5, 0)
                .setStyle({ font: `${4 * this.s}px Times New Roman` })
                .setWordWrapWidth(this.w * 0.25 - 2 * this.s);
        }        
        
        this.messageBox = this.add.text(this.w * 0.75 + this.s, this.h * 0.33)
            .setStyle({ font: `${2 * this.s}px Verdana` })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);

        this.inventoryBanner = this.add.text(this.w * 0.75 + this.s, this.h * 0.66)
            .setStyle({ font: `${2 * this.s}px Verdana` })
            .setText("Inventory")
            .setAlpha(0);
        
        if (!this.hud_enabled) {
            this.messageBox.x = this.w * 2;
            this.inventoryBanner.x = this.w * 2;
        }

        this.inventoryTexts = [];
        this.updateInventory();

        this.add.text(this.w-3*this.s, this.h-3*this.s, "📺")
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.showMessage('Fullscreen?'))
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            });

        this.onEnter();

    }

    showMessage(message) {
        if (this.last_msg.length > 0) {this.last_msg[0].destroy()};
        this.messageBox.setText(message);
        this.tweens.add({targets: this.messageBox, alpha: 2, duration: 500, ease: "Elastic.out"});
        let fade_event = this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: this.messageBox,
                alpha: { from: 1, to: 0 },
                easing: 'Linear',
                duration: 500
            });
        });
        this.last_msg[0] = fade_event;
    }

    updateInventory() {
        if (this.inventory.length > 0) {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 1,
                duration: 750
            });
        } else {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 0,
                duration: 750
            });
        }
        if (this.inventoryTexts) {
            this.inventoryTexts.forEach((t) => t.destroy());
        }
        this.inventoryTexts = [];
        let h = this.h * 0.66 + 3 * this.s;
        this.inventory.forEach((e, i) => {
            let text = this.add.text(this.w * 0.75 + 2 * this.s, h, e)
                .setStyle({ font: `${1.5 * this.s}px Trebuchet MS`, color: `#808080` })
                .setWordWrapWidth(this.w * 0.75 + 4 * this.s);
            h += text.height + this.s;
            this.inventoryTexts.push(text);
        });
    }

    hasItem(item) {
        return this.inventory.includes(item);
    }

    gainItem(item) {
        if (this.inventory.includes(item)) {
            console.warn('gaining item already held:', item);
            return;
        }
        this.inventory.push(item);
        this.updateInventory();
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    y: { from: text.y + 120, to: text.y },
                    alpha: { from: 0, to: 1 },
                    ease: 'Quart.out',
                    duration: 1000
                });
            }
        }
    }

    loseItem(item) {
        if (!this.inventory.includes(item)) {
            console.warn('losing item not held:', item);
            return;
        }
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    x: { from: text.x, to: text.x + 50 },
                    alpha: { from: 1, to: 0 },
                    ease: 'Quartic.in',
                    duration: 500
                });
            }
        }
        this.time.delayedCall(500, () => {
            this.inventory = this.inventory.filter((e) => e != item);
            this.updateInventory();
        });
    }

    gotoScene(key, fade) {
        // fade = 0;
        this.cameras.main.fade(fade, 0,0,0, true);
        this.time.delayedCall(fade, () => {
            this.scene.start(key, { inventory: this.inventory, flags: this.flags, fadeTime: fade });
        });
    }

    shakeObject(target_obj, repeat_amount = 5) {
        this.tweens.add({
            targets: target_obj,
            x: '+=' + this.s * 0.3,
            duration: 20,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: repeat_amount
        });
        this.time.delayedCall(30, () => this.tweens.add({
            targets: target_obj,
            y: '+=' + this.s * 0.3,
            duration: 20,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: repeat_amount
        }));
    }

    destroyObject(target_obj) {
        this.shakeObject(target_obj, 1);
        target_obj.disableInteractive();
        this.time.delayedCall(300, () => this.tweens.add({
            targets: target_obj,
            alpha: { from: 1, to: 0},
            duration: 200,
            onComplete: () => target_obj.destroy()
        }));
    }

    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }
}