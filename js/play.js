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
		bullets.setAll('width',bullet.width*0.25);
		bullets.setAll('height',bullet.height*0.25);
		bullet = bullets.getFirstExists(false);
		bullets.setAll('body.width',bullet.width);
		bullets.setAll('body.height',bullet.height);
		asteroids = game.add.group();
		/*
		enemy=game.add.sprite(game.world.centerX,game.world.centerY,'enemy1');
		enemy.angle=180
		
		
		asteroid=game.add.sprite(game.world.randomX,game.world.randomY,'asteroid');
		asteroid.scale.setTo(0.5,0.5);
		asteroid.animations.add('fly');
		asteroid.animations.play('fly', 25, true);
		game.physics.enable(asteroid, Phaser.Physics.ARCADE);
		game.physics.arcade.moveToXY(asteroid,game.world.randomX,game.world.randomY,game.rnd.integerInRange(50, 400));
		asteroid.outOfBoundsKill=true;
		asteroid.checkWorldBounds=true;
		*/
		gameinfo={
			stage:1,

		}

		player=game.add.sprite(game.world.centerX,game.world.height+100,'player');
		
		player.anchor.x=0.5;
		player.anchor.y=0.5;
		player.angle=-90;
		player.height*=0.05;
		player.width*=0.05;
		game.physics.enable(player, Phaser.Physics.ARCADE);
		//player.scale.setTo(0.05,0.05);
		player.body.width=player.height;
		player.body.height=player.width;
		
		
		//player.body.updateBounds(player.scale.x, player.scale.y);
		player.stats={
			speed:200,
			bulletTime:0,
			bulletSpeed:400,
			fireRate:400,
			guns:1,
			damage:1
		}
		game.add.tween(player).to({x:game.world.centerX,y:game.world.centerY}, 1000).start();

		timer = game.time.create(false);
		timer.add(10000,function(){
			spawn_asteroids();
		},this);
		timer.start();
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
		game.physics.arcade.overlap(asteroids, bullets,asteroidsDestroy);
		game.physics.arcade.overlap(asteroids, player,playerDestroy);
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

function spawn_asteroids(){

	num=game.rnd.integerInRange(0+gameinfo.stage, 5+gameinfo.stage);
	if(num!=0){
		console.log(num);
		asteroids.enableBody = true;
		asteroids.physicsBodyType = Phaser.Physics.ARCADE;
		asteroids.createMultiple(num, 'asteroid');
		asteroids.setAll('anchor.x', 0.5);
		asteroids.setAll('anchor.y', 0.5);
		asteroids.setAll('checkWorldBounds', false);
		asteroids.setAll('outOfBoundsKill', false);
		//asteroids.setAll('scale.x',0.25);
		//asteroids.setAll('scale.y',0.25);
		asteroids.forEachDead(asteroid_init,this,false)
	}
	timer = game.time.create(false);
	timer.add(10000,function(){
		asteroids.forEach(outOfBoundsDestroy,this,false)
		spawn_asteroids();
	},this);
	timer.start();
}

function outOfBoundsDestroy(child){
	if(child.x<0||child.x>game.world.width||child.y<0||child.y>game.world.height){
		child.destroy();
	}
}

function asteroid_init(child){
	side=game.rnd.integerInRange(0, 3)
	if(side==0){
		x=-10*game.rnd.integerInRange(1,10);
		y=game.world.randomY;
	}
	if(side==1){
		x=game.world.width+10*game.rnd.integerInRange(1,10);
		y=game.world.randomY;
	}
	if(side==2){
		y=-10*game.rnd.integerInRange(1,10);
		x=game.world.randomY;
	}
	if(side==3){
		y=game.world.height+10*game.rnd.integerInRange(1,10);
		x=game.world.randomY;
	}
	scale=game.rnd.integerInRange(20, 50)
	//child.scale.setTo(scale/100,scale/100);
	child.width*=scale/100;
	child.height*=scale/100;
	child.body.width=child.width;
	child.body.height=child.height;
	child.reset(x,y);
	child.animations.add('fly');
	child.animations.play('fly', 25, true);

	game.physics.arcade.moveToXY(child,game.world.randomX,game.world.randomY,game.rnd.integerInRange(50, 400));
}

function asteroidsDestroy(asteroid,bullet){
	
	if(asteroid.width>30){
		ast=game.add.sprite(asteroid.x+game.rnd.integerInRange(-5, 5),asteroid.y+game.rnd.integerInRange(-5, 5),'asteroid');
		game.physics.enable(ast, Phaser.Physics.ARCADE);
		ast.width=asteroid.width/2;
		ast.height=asteroid.height/2;
		ast.body.width=asteroid.width/2;
		ast.body.height=asteroid.height/2;
		ast.animations.add('fly');
		ast.animations.play('fly', 25, true);
		game.physics.arcade.moveToXY(ast,game.world.randomX,game.world.randomY,game.rnd.integerInRange(50, 400));
		asteroids.add(ast);

		ast=game.add.sprite(asteroid.x+game.rnd.integerInRange(-5, 5),asteroid.y+game.rnd.integerInRange(-5, 5),'asteroid');
		game.physics.enable(ast, Phaser.Physics.ARCADE);
		ast.width=asteroid.width/2;
		ast.height=asteroid.height/2;
		ast.body.width=asteroid.width/2;
		ast.body.height=asteroid.height/2;
		ast.animations.add('fly');
		ast.animations.play('fly', 25, true);
		game.physics.arcade.moveToXY(ast,game.world.randomX,game.world.randomY,game.rnd.integerInRange(50, 400));
		asteroids.add(ast);

	}
	asteroid.kill();
	bullet.kill();
}

function playerDestroy(asteroid,player){
	asteroid.kill();
	player.kill();
}