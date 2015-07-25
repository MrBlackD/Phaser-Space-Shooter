var menuState={
	preload:function(){


	},
	create:function(){
		starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
		menuMusic.loopFull();
		btnPlay=game.add.text(game.camera.x+game.camera.width/2,game.camera.y+game.camera.height/2-80,'Play',{font:'30px Courier bold',fill:'#ffffff'});
		btnPlay.anchor.x=0.5;
		btnPlay.anchor.y=0.5;
		btnPlay.inputEnabled=true;
		btnPlay.events.onInputDown.add(onPlay, this);
		game.starfield=starfield;
	},
	update:function(){
		starfield.tilePosition.y += 1;

	}
}

function onPlay(){
	menuMusic.stop();
	game.global={
		tilePositionY:game.starfield.tilePosition.y,
	}
	game.state.start('play');
}

function inventoryMenu(){

}

function skillsMenu(){

}