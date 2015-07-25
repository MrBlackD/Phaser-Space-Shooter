var playState={
	create:function(){
		game.time.advancedTiming=true;
		starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
		starfield.tilePosition.y=game.global.tilePositionY;
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(100, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 0.5);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
		bullet = bullets.getFirstExists(false);
		bullets.setAll('scale.x',0.25);
		bullets.setAll('scale.y',0.25);
		
		
		player=game.add.sprite(game.world.centerX,game.world.height+100,'player');
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.anchor.x=0.5;
		player.anchor.y=0.5;
		player.angle=-90;
		player.scale.setTo(0.05,0.05);
		player.stats={
			speed:200,
			bulletTime:0,
			bulletSpeed:400,
			fireRate:400
		}
		game.add.tween(player).to({x:game.world.centerX,y:game.world.centerY}, 1000).start();

	},
	update:function(){
		starfield.tilePosition.y += 4;
		fire();
		if(game.input.activePointer.isDown){
			game.physics.arcade.moveToPointer(player, player.stats.speed);
			if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)){
	            player.body.velocity.setTo(0, 0);
	        }
		}else{
			player.body.velocity.setTo(0, 0);
		}
	},
	render:function(){
		game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");  
		
	}

		
}

function fire() {
	if(!player.alive)
		return;
	//  To avoid them being allowed to fire too fast we set a time limit
	if (game.time.now > player.stats.bulletTime)
	{

		//  Grab the first bullet we can from the pool

		bullet = bullets.getFirstExists(false);

		if (bullet)
		{
			//  And fire it
			bullet.reset(player.x, player.y-10);
			//bullet.rotation=game.physics.arcade.angleToPointer(player)+90*Math.PI/180;

			bullet.body.velocity.y = -player.stats.bulletSpeed;
            player.stats.bulletTime = game.time.now + player.stats.fireRate;
            shot.play();
		}
	}
}