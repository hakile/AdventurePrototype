/* Flags:
0: Terminal Access
1: Key Status
2: Gate Status
3: Hatch Status
*/

class Forest extends AdventureScene {
    constructor() {
        super("forest", "The Forest", "#1B2618");
    }

    onEnter() {

        let path = this.add.text(this.w * 0.375, this.h * 0.1, "Dirt Path")
            .setStyle({font: `${this.s*2.5}px Trebuchet MS`, color: `#7F5F3F`})
            .setInteractive()
            .setOrigin(0.5, 0)
            .on('pointerover', () => this.showMessage("A path breaking up the monotony of the forest. See where it goes?"))
            .on('pointerdown', () => {
                path.disableInteractive();
                deep.disableInteractive();
                c_terminal.disableInteractive();
                this.showMessage("You head down the path...");
                this.gotoScene('gate', 700);
            });

        let deep = this.add.text(this.w * 0.375, this.h * 0.9, "Tall Grass")
            .setStyle({font: `${this.s*2.5}px Trebuchet MS`, color: `#2C5937`})
            .setInteractive()
            .setOrigin(0.5, 1)
            .on('pointerover', () => this.showMessage("Part of your view is being obscured. Go deeper into the forest?"))
            .on('pointerdown', () => {
                path.disableInteractive();
                deep.disableInteractive();
                c_terminal.disableInteractive();
                this.showMessage("You disappear into the grass…");
                this.gotoScene('deepforest', 700);
            });

        let c_terminal = this.add.text(this.h * 0.1, this.h * 0.6, "Computer Terminal")
            .setStyle({font: `${this.s*2}px Trebuchet MS`, color: `#804040`})
            .setInteractive()
            .setOrigin(0, 0.5)
            .on('pointerover', () => {
                if (this.flags[0] >= 1) {this.showMessage("The screen is flickering.")}
                else {this.showMessage("The screen is black.")};
            })
            .on('pointerdown', () => {
                if (this.flags[0] >= 1) {
                    path.disableInteractive();
                    deep.disableInteractive();
                    c_terminal.disableInteractive();
                    this.gotoScene('terminal', 2500);
                }
                else {
                    this.showMessage("It seems to be off.");
                    this.shakeObject(c_terminal);
                };
            });
    }
}

class Gate extends AdventureScene {
    constructor() {
        super("gate", "The Gate", "#222");
    }
    onEnter() {
        let gb = this.add.text(this.w * 0.375, this.h * 0.9, "Go Back")
            .setStyle({font: `${this.s*2.5}px Trebuchet MS`, color: `#496644`})
            .setInteractive()
            .setOrigin(0.5, 1)
            .on('pointerover', () => {
                this.showMessage("Go back?");
            })
            .on('pointerdown', () => {
                gb.disableInteractive();
                if (this.flags[1] == 0) {hatch_key.disableInteractive()};
                steel_gate.disableInteractive();
                this.showMessage("You head back...");
                this.gotoScene('forest', 700);
            });

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
        if (this.flags[1] > 0) {hatch_key.y = -this.h};

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
                if (this.flags[2] == 1) {
                    gb.disableInteractive();
                    if (this.flags[1] == 0) {hatch_key.disableInteractive()};
                    steel_gate.disableInteractive();
                    this.gotoScene('keypad', 2400);
                }
                else if (this.flags[2] == 2) {
                    gb.disableInteractive();
                    if (this.flags[1] == 0) {hatch_key.disableInteractive()};
                    steel_gate.disableInteractive();
                    this.showMessage("You leave the forest...");
                    this.cameras.main.fade(3750, 0,0,0, true);
                    this.time.delayedCall(3750, () => this.scene.start('outro'));
                } else {
                    this.showMessage("Find a way to turn the power back on.");
                    this.shakeObject(steel_gate);
                };
            });
    }
}

class DeepForest extends AdventureScene {
    constructor() {
        super("deepforest", "Deep Forest", "#060D03");
    }
    onEnter() {
        let gb = this.add.text(this.w * 0.375, this.h * 0.1, "Go Back", {
            font: `${this.s*2.5}px Trebuchet MS`, color: `#496644`})
            .setInteractive()
            .setOrigin(0.5, 0)
            .on('pointerover', () => {
                if (this.flags[3] != 1) {this.showMessage("Go back?")};
            })
            .on('pointerdown', () => {
                gb.disableInteractive();
                hatch.disableInteractive();
                this.showMessage("You head back...");
                this.gotoScene('forest', 700);
            });
        
        let hatch = this.add.text(this.w*.75-this.h*.1, this.h*.67, "Locked Hatch", {
            font: `${this.s*2.5}px Trebuchet MS`, color: `#333`})
            .setInteractive()
            .setOrigin(1, 0.67)
            .on('pointerover', () => {
                if (this.flags[3] == 2) {this.showMessage("It’s unlocked. Go inside?")}
                else if (this.flags[3] == 0) {this.showMessage("It’s locked, with a keyhole to the side.")}
            })
            .on('pointerdown', () => {
                if (this.flags[3] == 2) {
                    gb.disableInteractive();
                    hatch.disableInteractive();
                    this.showMessage("Down the hatch...");
                    this.gotoScene('bunker', 1000);
                } else if (this.hasItem('Key') && this.flags[1] == 1) {
                    gb.disableInteractive();
                    hatch.disableInteractive();
                    this.loseItem('Key');
                    let unlock_tries = Phaser.Math.Between(50, 100);
                    this.shakeObject(hatch, unlock_tries);
                    this.showMessage("Hold on...");
                    this.flags[3] = 1;
                    this.time.delayedCall(unlock_tries*40+500, () => {
                        hatch.setText("Unlocked Hatch");
                        hatch.setStyle({color: `#FFF`});
                        this.flags[3] = 2;
                        this.showMessage("The hatch is now unlocked.");
                        gb.setInteractive();
                        hatch.setInteractive();
                    });
                } else if (this.flags[1] == 0) {
                    this.showMessage("Find something to unlock this.");
                    this.shakeObject(hatch);
                }
            });

        if (this.flags[3] == 2) {
            hatch.setText("Unlocked Hatch");
            hatch.setStyle({color: `#FFF`});
        }
    }
}

class Bunker extends AdventureScene {
    constructor() {
        super("bunker", "The Bunker", "#050404");
    }
    onEnter() {
        let gb = this.add.text(this.h * 0.1, this.h * 0.33, "Go Back", {
            font: `${this.s*2.5}px Trebuchet MS`, color: `#666`})
            .setInteractive()
            .setOrigin(0, 0.33)
            .on('pointerover', () => {
                this.showMessage("Go back up?");
            })
            .on('pointerdown', () => {
                gb.disableInteractive();
                paper_stack.disableInteractive();
                lever.disableInteractive();
                this.showMessage("You head back outside...");
                this.gotoScene('deepforest', 700);
            });
        
        let paper_texts = [
            "Terminal code: 4003",
            "Research notes: We examine the momentum dependence of...",
            "(Blank)",
            "(Blank)",
            "Gate code: 1831",
            "(Blank)",
            "You reached the end of the stack."
        ];

        let current_paper = 0;

        let paper_stack = this.add.text(this.w*.75-this.h*.1, this.h*.1, "Stack Of\nPapers", {
            font: `${this.s*2}px Trebuchet MS`,
            color: `#666`,
            align: "center"})
            .setInteractive()
            .setOrigin(1, 0)
            .on('pointerover', () => this.showMessage("A stack of unorganized papers. Read through them?"))
            .on('pointerdown', () => {
                this.shakeObject(paper_stack, 2);
                this.showMessage(paper_texts[current_paper]);
                current_paper = (current_paper + 1) % 7;
            });

        let lever = this.add.text(this.w*.375,this.h*.9, "Lever (Off)", {
            font: `${this.s*2.5}px Trebuchet MS`, color: `#DBB`})
            .setInteractive()
            .setOrigin(0.5, 1)
            .on('pointerover', () => {
                if (this.flags[2] == 0) {
                    this.showMessage("It's labeled \"GATE POWER\". The lever is off. Switch it on?")}
                else {this.showMessage("It's labeled \"GATE POWER\". The lever is on. Switch it off?")};
            })
            .on('pointerdown', () => {
                this.shakeObject(lever, 1);
                if (this.flags[2] == 0) {
                    this.showMessage("Lever switched on.");
                    this.flags[2] = 1;
                    lever.setText("Lever (On)")
                        .setStyle({color: `#BDB`});
                } else {
                    this.showMessage("Lever switched off.");
                    this.flags[2] = 0;
                    lever.setText("Lever (Off)")
                        .setStyle({color: `#DBB`});
                }
            });

        if (this.flags[2] != 0) {
            lever.setText("Lever (On)")
                .setStyle({color: `#BDB`});
        };
    }
}

class Keypad extends AdventureScene {
    constructor() {
        super("keypad","","#000",false);
    }
    onEnter() {
        let gb_text = this.add.text(this.w * 0.5, this.h * 0.95, "Go Back", {
            font: `${this.s*2}px Trebuchet MS`, color: `#666`})
            .setInteractive()
            .setOrigin(0.5, 1)
            .on('pointerdown', () => {
                gb_text.disableInteractive();
                this.gotoScene('gate', 1000);
            });
        
        let title_text = this.add.text(this.w*.5,this.h*0.05,"Enter the code.",{
            font:`${this.s*2}px Times New Roman`,
            color:`#FFF`
        }).setOrigin(0.5,0);

        let title_text_2 = this.add.text(this.w*.5,-this.h,"Enter the code.",{
            font:`${this.s*2}px Times New Roman`,
            color:`#AAA`
        }).setOrigin(0.5,0);

        let sub_text = this.add.text(this.w*.5,this.h*0.1,"Or find another one...",{
            font:`${this.s*1.4}px Times New Roman`,
            color:`#804040`
        }).setOrigin(0.5,0);
        sub_text.alpha = 0;

        this.tweens.add({
            targets: sub_text,
            alpha: {from:0,to:1},
            duration: 20000,
            ease: 'Expo.In'
        });

        let typed_yet = 0;

        if (this.flags[0] < 2) {
            this.time.addEvent({
                delay: 3000,
                repeat: 3,
                callback: () => title_text.text += '.'
            });
            this.time.delayedCall(15000, () => {
                if (typed_yet == 0) {
                    this.flags[0] = 1;
                    typed_yet = 2;
                    this.tweens.add({
                        targets: title_text,
                        alpha: 0.1,
                        duration: 5000,
                        ease: 'Sine.Out'
                    });
                };
            });
        };
        
        let display_text = this.add.text(this.w*.5,this.h*.5, "", {
            font: `${this.s*6.5}px Courier New`, color: `#FFF`}).setOrigin(0.5, 0.5);
        let tut_text = this.add.text(this.w*.5,this.h*.5, "(Use your keyboard)", {
            font: `${this.s*2}px Verdana`}).setOrigin(0.5, 0.5);
        this.time.delayedCall(3000, () => {if (tut_text.alpha == 1) {
            this.tweens.add({
                targets: tut_text,
                alpha: 0,
                duration: 500
            });
        }});

        if (this.flags[0] == 2) {
            tut_text.y = -this.h;
            sub_text.y = -this.h;
            title_text.setStyle({font:`bold ${this.s*2.1}px Times New Roman`})
            title_text.setColor("#500");
        };

        this.input.keyboard.on('keydown', function(key) {
            tut_text.alpha = 0;
            if (typed_yet == 0 && this.flags[0] < 2) {
                typed_yet = 1;
                sub_text.y = -this.h;
                title_text_2.y = title_text.y;
                title_text.y = -this.h;
            };
            if (key.keyCode > 47 && key.keyCode < 58 && display_text.text.length < 4) {display_text.text += key.key};
            if (display_text.text.length >= 4 && display_text.style.color == `#FFF`) {
                if (display_text.text == "9417" && this.flags[0] >= 2) {
                    gb_text.y = -this.h;
                    title_text.y = -this.h;
                    display_text.setColor(`#08F`);
                    this.shakeObject(display_text,6);
                    this.time.delayedCall(1250, () => {
                        display_text.setText("THANK YOU");
                    });
                    this.time.delayedCall(3750, () => {
                        this.cameras.main.fade(2500, 255,255,255);
                        this.time.delayedCall(2600, () => this.scene.start('outro2'));
                    });
                } else if (display_text.text == "1831") {
                    if (this.flags[0] >= 2) {
                        this.time.delayedCall(50, () => {
                            display_text.setColor(`#F00`);
                            display_text.setText("");
                        });
                        this.time.delayedCall(100, () => display_text.setText("THAT"));
                        this.time.delayedCall(150, () => display_text.setText("WON'T"));
                        this.time.delayedCall(200, () => display_text.setText("WORK"));
                        this.time.delayedCall(250, () => display_text.setText("RIGHT"));
                        this.time.delayedCall(300, () => display_text.setText("NOW"));
                        this.time.delayedCall(350, () => {
                            display_text.setColor(`#FFF`);
                            display_text.setText("");
                        });
                    } else {
                        title_text.y = -this.h;
                        title_text_2.y = -this.h;
                        this.time.delayedCall(250, () => {
                            this.flags[2] = 2;
                            display_text.setColor(`#0F0`);
                            display_text.setText("OPEN");
                        });
                    };
                } else {
                    this.time.delayedCall(250, () => display_text.setStyle({color:`#F00`}));
                    this.time.delayedCall(1250, () => {
                        display_text.setColor(`#FFF`);
                        display_text.setText("");
                    });
                };
            };
        }, this);
    }
}

class Terminal extends AdventureScene {
    constructor() {
        super("terminal","","#000",false);
    }
    onEnter() {
        let gb_text = this.add.text(this.w * 0.5, this.h * 0.95, "Go Back", {
            font: `${this.s*2}px Trebuchet MS`, color: '#404040'})
            .setInteractive()
            .setOrigin(0.5, 1)
            .on('pointerdown', () => {
                this.gotoScene('forest', 1000);
                gb_text.disableInteractive();
            });
        
        let display_text = this.add.text(this.w*.5,this.h*.5, "", {
            font: `${this.s*6.5}px Courier New`, color: `#FFF`}).setOrigin(0.5, 0.5);

        this.input.keyboard.on('keydown', function(key) {
            if (key.keyCode>47 && key.keyCode<58 && display_text.text.length<4) {display_text.text += key.key};
            if (display_text.text.length >= 4 && display_text.style.color == `#FFF`) {
                if (display_text.text == "4003") {
                    this.time.delayedCall(250, () => {
                        display_text.setColor(`#000`);
                        this.cameras.main.setBackgroundColor("#F00");
                        gb_text.y = -this.h;
                    });
                    this.time.delayedCall(1250, () => {
                        this.tweens.add({
                            targets: display_text,
                            alpha: 0,
                            duration: 1000
                        });
                    });
                    this.time.delayedCall(2750, () => this.gotoScene('terminal2',1));
                } else {
                    this.time.delayedCall(250, () => display_text.setText(""));
                };
            };
        }, this);
    }
}

class Terminal2 extends AdventureScene {
    constructor() {
        super("terminal2","","#000",false);
    }
    onEnter() {
        let text_list = [
            "9DGB","9OPZ","9BGR","9TIG",
            "O4JG","S4QK","T4RU","Y4RE",
            "ZS1H","YG1P","VK1Z","QZ1R",
            "SOR7","QYU7","PAC7","VRI7"
        ];
        let iterator = 0;
        this.flags[0] = 2;

        let passes = this.add.text(this.w * 0.5, this.h * 0.5, "9DGB", {
            font: `${this.s*6.5}px Courier New`, color: `#000`})
            .setOrigin(0.5, 0.5)
        
        let gb_text = this.add.text(this.w * 0.5, this.h * 0.95, "Go Back", {
            font: `${this.s*2}px Trebuchet MS`, color: '#F00'})
            .setInteractive()
            .setOrigin(0.5, 1)
            .on('pointerdown', () => {
                this.gotoScene('forest', 1000);
                gb_text.disableInteractive();
            });
        gb_text.alpha = 0.01;

        this.time.delayedCall(500, () => {
            this.cameras.main.setBackgroundColor("#F00");
            passes.setText(text_list[iterator]);
            iterator = (iterator + 1) % 16;
            this.time.addEvent({
                delay: 125,
                repeat: 2,
                callback: () => {
                    passes.setText(text_list[iterator]);
                    iterator = (iterator + 1) % 16;
                }
            });
        });

        this.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                gb_text.setColor(`#F00`);
                this.cameras.main.setBackgroundColor("#000");
                this.time.delayedCall(500, () => {
                    gb_text.setColor(`#000`);
                    this.cameras.main.setBackgroundColor("#F00");
                    passes.setText(text_list[iterator]);
                    iterator = (iterator + 1) % 16;
                    this.time.addEvent({
                        delay: 125,
                        repeat: 2,
                        callback: () => {
                            passes.setText(text_list[iterator]);
                            iterator = (iterator + 1) % 16;
                        }
                    });
                });
            }
        });

        this.time.delayedCall(4000, () => gb_text.alpha = 1);
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        let fs = this.add.text(this.w-this.h*.05, this.h*.95, "📺")
            .setStyle({ fontSize: `${.03 * this.w}px` })
            .setOrigin(1,1)
            .setInteractive({useHandCursor: true})
            .setAlpha(0)
            .on('pointerover', () => subText.setText("Fullscreen?"))
            .on('pointerout', () => subText.setText("Click to begin"))
            .on('pointerdown', () => {
                fs.disableInteractive();
                subText.setText("Click to begin");
                this.time.delayedCall(100, () => fs.setInteractive({useHandcursor: true}));
                if (this.scale.isFullscreen) {this.scale.stopFullscreen()}
                else {this.scale.startFullscreen()};
            });

        this.time.delayedCall(1500, () => this.tweens.add({targets: fs, alpha: 1, duration: 500}));

        let creditText = this.add.text(this.h*.025,this.h*.975,"Created by Harrison Le", {
            font: `${.015*this.w}px Times New Roman`}).setAlpha(0).setOrigin(0,1);
        
        this.tweens.add({targets: creditText, alpha: 0.25, duration: 1000});
        
        let titleText = this.add.text(this.w*0.5, this.h*0.5 - 100, "Adventure Game", {
            font: `${0.05 * this.w}px Trebuchet MS`, color: '#233B2F'})
            .setOrigin(0.5, 0.5);
        titleText.alpha = 0;

        this.time.delayedCall(500, () => this.tweens.add({
            targets: titleText, alpha: '1', duration: 4000, ease: 'Quart.out'}));
        this.time.delayedCall(500, () => this.tweens.add({
            targets: titleText, y: titleText.y + 100, duration: 4000, ease: 'Quart.out'}));

        let subText = this.add.text(this.w*0.5, this.h * 0.675, "Click to begin", {
            font: `${0.02 * this.w}px Verdana`, color: "#404040", align: 'center'})
            .setOrigin(0.5, 0)
            .setLineSpacing(5);
        subText.alpha = 0;

        this.time.delayedCall(1500, () => this.tweens.add({
            targets: subText, alpha: '1', duration: 1500, ease: 'Cubic.out'}));
        this.time.delayedCall(1500, () => this.tweens.add({
            targets: subText, y: '-=' + 0.1*this.h, duration: 1500, ease: 'Cubic.out'}));

        this.time.delayedCall(2000, () => this.input.on('pointerdown', () => {
            this.cameras.main.fade(800, 0,0,0);
            this.time.delayedCall(800, () => this.scene.start('wake'));
        }));
    }
}

class Intro2 extends Phaser.Scene {
    constructor() {
        super('intro2')
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.cameras.main.setBackgroundColor("#FFF");

        let fs = this.add.text(this.w-this.h*.05, this.h*.95, "📺")
            .setStyle({ fontSize: `${.03 * this.w}px` })
            .setOrigin(1,1)
            .setInteractive({useHandCursor: true})
            .setAlpha(0)
            .on('pointerover', () => subText.setText("Fullscreen?"))
            .on('pointerout', () => subText.setText("Click to begin"))
            .on('pointerdown', () => {
                fs.disableInteractive();
                this.time.delayedCall(100, () => fs.setInteractive({useHandcursor: true}));
                if (this.scale.isFullscreen) {this.scale.stopFullscreen()}
                else {this.scale.startFullscreen()};
            });

        this.time.delayedCall(1500, () => this.tweens.add({targets: fs, alpha: 1, duration: 500}));

        let creditText = this.add.text(this.h*.025,this.h*.975,"Created by Harrison Le", {
            font: `${.015*this.w}px Times New Roman`}).setAlpha(0).setOrigin(0,1).setColor("#000");
        
        this.tweens.add({targets: creditText, alpha: 0.625, duration: 1000});
        
        let titleText = this.add.text(this.w*0.5, this.h*0.5 - 100, "Adventure Game", {
            font: `${0.05 * this.w}px Trebuchet MS`, color: '#008040'})
            .setOrigin(0.5, 0.5);
        titleText.alpha = 0;

        this.time.delayedCall(500, () => this.tweens.add({
            targets: titleText, alpha: '1', duration: 4000, ease: 'Quart.out'}));
        this.time.delayedCall(500, () => this.tweens.add({
            targets: titleText, y: titleText.y + 100, duration: 4000, ease: 'Quart.out'}));

        let subText = this.add.text(this.w*0.5, this.h * 0.675, "Click to begin", {
            font: `${0.02 * this.w}px Verdana`, color: "#000", align: 'center'})
            .setOrigin(0.5, 0)
            .setLineSpacing(5);
        subText.alpha = 0;

        this.time.delayedCall(1500, () => this.tweens.add({
            targets: subText, alpha: '1', duration: 1500, ease: 'Cubic.out'}));
        this.time.delayedCall(1500, () => this.tweens.add({
            targets: subText, y: '-=' + 0.1*this.h, duration: 1500, ease: 'Cubic.out'}));

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
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        let wakeText = this.add.text(this.w*0.5, this.h*0.5, "Where am I?", {
            font: `${0.03 * this.w}px Times New Roman`, color: "#665947"})
            .setOrigin(0.5,0.5);
        wakeText.alpha = 0;
        this.time.delayedCall(2000, () => this.tweens.add({targets: wakeText, alpha: 1, duration: 300}));
        this.time.delayedCall(3000, () => this.tweens.add({targets: wakeText, alpha: 0, duration: 3000, ease: "Quart.In"}));
        this.time.delayedCall(4000, () => this.tweens.add({targets: wakeText,
            y: this.h+(0.5*wakeText.height), duration: 2000, ease: "Quint.In"}));
        this.time.delayedCall(6000, () => this.scene.start('forest', {inventory: [], flags: [0,0,0,0], fadeTime: 3750}));
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;

        let text1 = this.add.text(this.w*0.5, this.h*0.5, "I escaped.", {
            font: `${this.w*0.03}px Times New Roman`}).setOrigin(.5,.5);
        text1.alpha = 0;
        let text2 = this.add.text(this.w*0.5, this.h*0.5, "But I'm still lost...", {
            font: `${this.w*0.03}px Times New Roman`, color: `#805050`}).setOrigin(.5,.5);
        text2.alpha = 0;

        this.time.delayedCall(500, () => this.tweens.add({targets: text1, alpha: .5, duration: 500}));
        this.time.delayedCall(3000, () => this.tweens.add({targets: text1, alpha: 0, duration: 500}));
        this.time.delayedCall(4000, () => this.tweens.add({targets: text2, alpha: 1, duration: 1000}));
        this.time.delayedCall(6500, () => {
            this.tweens.add({targets: text2, alpha: 0, duration: 2000, ease: "Quart.In"});
            this.tweens.add({targets: text2, y: this.h+(0.5*text2.height), duration: 2000, ease: "Quint.In"});
            this.time.delayedCall(2000, () => this.scene.start('intro'));
        });
    }
}

class Outro2 extends Phaser.Scene {
    constructor() {
        super('outro2');
    }

    create() {
        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.cameras.main.setBackgroundColor("#FFF");

        let text1 = this.add.text(this.w*0.5, this.h*0.5, "I escaped.", {
            font: `${this.w*0.03}px Trebuchet MS`, color: `#004080`}).setOrigin(.5,.5);
        text1.alpha = 0;
        let text2 = this.add.text(this.w*0.5, this.h*0.5, "I think I see someone.", {
            font: `${this.w*0.03}px Trebuchet MS`,color: `#004080`}).setOrigin(.5,.5);
        text2.alpha = 0;

        this.time.delayedCall(1000, () => this.tweens.add({targets: text1, alpha: 1, duration: 1000}));
        this.time.delayedCall(4000, () => this.tweens.add({targets: text1, alpha: 0, duration: 1000}));
        this.time.delayedCall(5500, () => this.tweens.add({targets: text2, alpha: 1, duration: 1500}));
        this.time.delayedCall(8500, () => {
            this.tweens.add({targets: text2, alpha: 0, duration: 3000, ease: "Quart.In"});
            this.tweens.add({targets: text2, y: -text2.height, duration: 3000, ease: "Quint.In"});
            this.time.delayedCall(3000, () => this.scene.start('intro2'));
        });
    }
}

const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Intro, Wake, Forest, Gate, DeepForest, Bunker, Keypad, Terminal, Terminal2, Outro, Outro2, Intro2],
    title: "Adventure Game",
});

