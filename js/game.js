var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-div');
game.global={};
var fonts={
	lootFont:{ font: "10px Arial", fill: "#fff", align: "center" },
	hudFont:{ font: "14px Arial", fill: "#fff", align: "center" },
	consoleFont:{font:'16px Consolas',fill:'#00ff00', align: "center"},
}
var cnslText=[];

game.state.add('boot',bootState);
game.state.add('load',loadState);
game.state.add('play',playState);
game.state.add('testing',testingState);
game.state.add('menu',menuState);

game.state.start('boot');