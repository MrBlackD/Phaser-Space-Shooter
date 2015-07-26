var loadState={
	preload:function(){
		var loadingLable=game.add.text(game.world.centerX,game.world.centerY,'loading...',{font:'30px Courier',fill:'#009900'});
		loadingLable.anchor.x=0.5;
		loadingLable.anchor.y=0.5;
		game.load.image('starfield', 'assets/starfield.jpg');
		game.load.image('player', 'assets/player.png');
		game.load.image('bullet', 'assets/bullet.png');
		game.load.image('enemy1', 'assets/enemy1.png');
		game.load.audio('shot', 'assets/shot2.wav');
		game.load.audio('menuMusic', 'assets/menu.mp3');
		game.load.audio('sound1', 'assets/sound1.mp3');
		game.load.spritesheet('asteroid', 'assets/asteroid.png', 128, 128, 64);
	},
	create:function(){
		shot=game.add.audio('shot');
		shot.volume=0.5;
		menuMusic=game.add.audio('menuMusic');
		//menuMusic.loop=1;
		sounds=[];
		sound=game.add.audio('sound1');
		sounds.push(sound);
	},
	update:function(){
		if(shot.isDecoded&&menuMusic.isDecoded&&soundReady(sounds)){

			game.state.start('menu');
		}
	}
}

function soundReady(sounds){
	for(var i=0;i<sounds.length;i++){
		if(!sounds[i].isDecoded)
			return false;
	}
	return true;
}