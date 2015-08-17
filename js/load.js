var loadState={
	preload:function(){
		var loadingLable=game.add.text(game.world.centerX,game.world.centerY,'loading...',{font:'30px Courier',fill:'#009900'});
		loadingLable.anchor.x=0.5;
		loadingLable.anchor.y=0.5;
		game.load.image('starfield', 'assets/starfield.jpg');
		game.load.image('player', 'assets/player.png');
		game.load.image('bullet', 'assets/bullet.png');
		game.load.audio('explosion1', 'assets/explosion1.wav');
		game.load.audio('explosion2', 'assets/explosion2.wav');
		game.load.audio('explosion3', 'assets/explosion3.wav');
		game.load.audio('explosion4', 'assets/explosion4.wav');
		game.load.image('flash', 'assets/flash.png');
		game.load.image('enemy1', 'assets/enemy1.png');
		game.load.image('particles', 'assets/particles.png');
		game.load.audio('shot', 'assets/shot2.wav');
		game.load.audio('menuMusic', 'assets/menu.mp3');
		game.load.audio('sound1', 'assets/sound1.mp3');
		game.load.spritesheet('explosion', 'assets/explosion.png', 100, 100, 64);
		//game.load.spritesheet('fire', 'assets/fire.png', 128, 128, 8);
		game.load.spritesheet('asteroid', 'assets/asteroid.png', 128, 128, 30);
	},
	create:function(){

		shot=game.add.audio('shot');
		shot.volume=0.3;
		menuMusic=game.add.audio('menuMusic');
		//menuMusic.loop=1;
		explosions=[];
		explosion=game.add.audio('explosion1');
		explosion.volume=0.5;
		explosions.push(explosion);

		explosion=game.add.audio('explosion2');
		explosion.volume=0.5;
		explosions.push(explosion);

		explosion=game.add.audio('explosion3');
		explosion.volume=0.5;
		explosions.push(explosion);

		explosion=game.add.audio('explosion4');
		explosion.volume=0.5;
		explosions.push(explosion);

		sounds=[];
		sound=game.add.audio('sound1');
		sounds.push(sound);

		enemyList=[];
		enemyList.push('enemy1');

		enemyTactics=[];
		enemyTactics.push('sync');
		enemyTactics.push('flood');
	},
	update:function(){
		if(shot.isDecoded&&menuMusic.isDecoded&&soundReady(sounds)&&soundReady(explosions)){

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

