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
		bullets.setAll('width',bullet.width*0.8);
		bullets.setAll('height',bullet.height*0.6);
		bullet = bullets.getFirstExists(false);
		bullets.setAll('body.width',bullet.width/2);
		bullets.setAll('body.height',bullet.height);

		asteroids = game.add.group();
		enemies=game.add.group();

		target=game.rnd.integerInRange(0, 1);
		soundIndex=game.rnd.integerInRange(0, sounds.length-1);
		sounds[soundIndex].play();
		targetText=game.add.text(game.world.centerX,game.world.centerY,' ',{font:'50px Courier bold',fill:'#ffffff'});
		game.add.tween(targetText).to({x:game.world.width/2,y:0,fontSize:30}, 2000).start();
		if(target==0){
			targetText.text='Survive for ';
			targetText.anchor.setTo(0.5,0);
			timeToSurvive=Math.floor(sounds[soundIndex].duration);
			targetText.text+=timeToSurvive;
			timeInterval=setInterval(function(){
				if(timeToSurvive<=0){
					clearInterval(timeInterval);
					if(player.alive)
						win();
				}
				timeToSurvive--;
			},1000);
		}
		if(target==1){
			targetText.text='Remaining kills ';
			targetText.anchor.setTo(0.5,0);
			neededKills=50;
		}
		gameinfo={
			stage:1,
			scrollSpd:4,
			status:'inProgress'
		}
		shakeWorld = 0;
		shakeWorldMax = 20;
		shakeWorldTime = 0;
		shakeWorldTimeMax = 40;

	    


		player=game.add.sprite(game.world.centerX,game.world.height+100,'player');

		//player.tint=0x8cb1ff;
		player.anchor.x=0.5;
		player.anchor.y=0.5;
		player.angle=-90;
		player.height*=0.05;
		player.width*=0.05;
		game.physics.enable(player, Phaser.Physics.ARCADE);

		player.body.width=player.height;
		player.body.height=player.width;
				
		playerFlash=game.add.sprite(0,0,'flash');
		playerFlash.anchor.x=0.5;
		playerFlash.anchor.y=0.5;
		playerFlash.kill();
		player.stats={
			speed:300,
			bulletTime:0,
			bulletSpeed:1000,
			fireRate:100,
			guns:1,
			damage:1,
			spread:40
		}
		game.add.tween(player).to({x:game.world.centerX,y:game.world.centerY}, 1000).start();

		emitter = game.add.emitter(0, 0, 100);
	    emitter.makeParticles('particles');

		spawn_enemy(5000);
		timer = game.time.create(false);
		timer.add(10000,function(){
			spawn_asteroids();
		},this);
		timer.start();
	},
	update:function(){
		screenShake();
		starfield.tilePosition.y += gameinfo.scrollSpd;
		fire();
		if(target==0&&timeToSurvive>=0)
			targetText.text='Survive for '+timeToSurvive;
		if(target==1&&neededKills>=0)
			targetText.text='Remaining kills '+neededKills;
		if(game.input.activePointer.isDown){
			game.physics.arcade.moveToPointer(player, player.stats.speed);
			if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)){
	            player.body.velocity.setTo(0, 0);
	        }
		}else{
			player.body.velocity.setTo(0, 0);
		}
		game.physics.arcade.overlap(asteroids, bullets,asteroidsDestroy);
		//game.physics.arcade.collide(asteroids, asteroids);
		game.physics.arcade.overlap(player, asteroids,destroy);
		game.physics.arcade.overlap(player, enemies,destroy);
		game.physics.arcade.overlap(enemies, bullets,dmg);
	},
	render:function(){
		game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		//game.debug.body(player);
		//enemies.forEach(debugOn,this,false);
		//asteroids.forEach(debugOn,this,false);
		//bullets.forEach(debugOn,this,false);

	}

		
}

function dmg(damageTaker,damageDealer){
	//explode(damageDealer.x,damageDealer.y,'small');
	particlesEmitter(damageDealer);
	damageTaker.tint=0x0751ee;
	timer = game.time.create(false);
	timer.add(100,function(){
		damageTaker.tint=0xFFFFFF;
	},this);
	timer.start();
	if(damageTaker.health==1){
		explode(game.rnd.integerInRange(damageTaker.x-damageTaker.width/2, damageTaker.x+damageTaker.width/2),game.rnd.integerInRange(damageTaker.y-damageTaker.height/2, damageTaker.y+damageTaker.height/2),'big');
		
		if(target==1){
			neededKills--;
			if(neededKills==0){
				win();
			}
		}
	}

	damageTaker.damage(1);
	damageDealer.kill();
}

function fire() {
	if(!player.alive||gameinfo.status=='end')
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
			playerFlash.reset(player.x, player.y-15);
			//bullet.rotation=game.physics.arcade.angleToPointer(player)+90*Math.PI/180;
			game.physics.arcade.moveToXY(bullet,bullet.x+game.rnd.integerInRange(-player.stats.spread, player.stats.spread),bullet.y-game.world.height/2,player.stats.bulletSpeed);
            player.stats.bulletTime = game.time.now + player.stats.fireRate;
            shot.play();
            timer = game.time.create(false);
			timer.add(15,function(){
				playerFlash.kill();
			},this);
			timer.start();
            
		}
	}
}

function spawn_asteroids(){
	if(gameinfo.status=='end')
		return;
	num=game.rnd.integerInRange(0+gameinfo.stage, 5+gameinfo.stage);
	if(num!=0){
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
	scale=game.rnd.integerInRange(30, 50)
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
	
	if(asteroid.width>100){
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
	particlesEmitter(bullet);
	explode(asteroid.x,asteroid.y);
	asteroid.kill();
	bullet.kill();
}

function destroy(object,destroyer){
	explode(object.x,object.y);
	if(destroyer)
		destroyer.kill();
	if(object==player)
		lose();
	object.kill();
}

function spawn_enemy(delay){
	if(gameinfo.status=='end')
		return;
	timer = game.time.create(false);
	count=10;
	timer.add(delay,function(){
		enemyNum=game.rnd.integerInRange(0, enemyList.length-1);
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;
		enemies.createMultiple(count, enemyList[enemyNum]);
		enemies.setAll('anchor.x', 0.5);
		enemies.setAll('anchor.y', 0.5);
		enemies.setAll('checkWorldBounds', false);
		enemies.setAll('outOfBoundsKill', false);
		enemies.setAll('scale.x',0.3);
		enemies.setAll('scale.y',0.3);
		enemies.setAll('angle',180);
		enemies.setAll('health',3);//+enemyNum
		enemy = enemies.getFirstExists(false);
		enemies.setAll('body.width',enemy.width*0.8);
		enemies.setAll('body.height',enemy.height*0.8);
		tactic=enemyTactics[game.rnd.integerInRange(0, enemyTactics.length-1)];

		if(tactic=='sync'){
			console.log('sync');
			attackTime=game.time.create(false);

			for(var i=0;i<count;i++){
				en=enemies.getFirstDead(false);
				en.reset((i+0.5)*game.world.width/count,-100,en.health);

				game.add.tween(en).to({y:100}, 2000).start();
			}
			attackTime.add(3000,function(){
				enemies.forEach(sync_move,this,false);
			},this);
			attackTime.add(7000,function(){
				spawn_enemy(0);
				enemies.removeAll(true);
			},this);

			attackTime.start();
		}
		if(tactic=='flood'){
			console.log('flood');
			attackTime=game.time.create(false);
			for(var i=0;i<count;i++){
				en=enemies.getFirstDead(false);
				en.reset(game.world.randomX,-(i+game.rnd.integerInRange(1,3))*300,en.health);
					
			}
			attackTime.add(1000,function(){
				enemies.forEach(sync_move,this,false);
			},this);
			attackTime.add(10000,function(){
				spawn_enemy(0);
				enemies.removeAll(true);
			},this);
			attackTime.start();
		}
	},this);
	timer.start();


}

function sync_move(en){
	game.physics.arcade.moveToXY(en,en.x,game.world.height+100,500);
}

function win(){
	gameinfo.status='end';
	enemies.forEach(destroy,this,false);
	asteroids.forEach(destroy,this,false);
	game.add.tween(gameinfo).to({scrollSpd:20}, 1000).start();
	timer = game.time.create(false);
	timer.add(0,function(){
		game.add.tween(targetText).to({y:-100}, 2000).start();
	},this);
	timer.add(1000,function(){
		game.add.tween(player).to({x:player.x,y:-100}, 1000).start();
	},this);
	timer.add(2000,function(){
		winText=game.add.text(game.world.centerX,game.world.centerY,'DONE!',{font:'70px Courier bold',fill:'#ffffff'});
		winText.anchor.x=0.5;
		winText.anchor.y=0.5;
		winText.alpha=0;
		game.add.tween(winText).to({alpha:1,fontSize:40}, 2000).start();
	},this);

	timer.add(5000,function(){
		sounds[soundIndex].stop();
		gameinfo.scrollSpd=4;
		game.state.start('end');
	},this);
	timer.start();
}

function lose(){
	gameinfo.status='end';
	timer = game.time.create(false);
	timer.add(0,function(){
		game.add.tween(targetText).to({y:-100}, 2000).start();
	},this);
	timer.add(1000,function(){
		loseText=game.add.text(game.world.centerX,game.world.centerY,'You are LOST!',{font:'40px Courier bold',fill:'#ffffff'});
		loseText.anchor.x=0.5;
		loseText.anchor.y=0.5;
		loseText.alpha=0;
		game.add.tween(loseText).to({alpha:1,fontSize:40}, 2000).start();
		
	},this);
	timer.add(5000,function(){
		sounds[soundIndex].stop();
		game.state.start('end');
	},this);
	timer.start();
}

function explode(x,y,size){
	explosions[game.rnd.integerInRange(0,explosions.length-1)].play();
	shakeWorldTime = shakeWorldTimeMax;
	frameRate=30;
	explosion=game.add.sprite(x,y,'explosion');
	explosion.anchor.x=0.5;
	explosion.anchor.y=0.5;
	if(size=='small'){
		explosion.scale.x=0.5;
		explosion.scale.y=0.5;
		frameRate=30;
	}
	if(size=='big'){
		explosion.scale.x=2;
		explosion.scale.y=2;
		frameRate=20;
	}
	explosion.animations.add('explode');
	explosion.animations.play('explode', frameRate, false);
}

function debugOn(child){
	game.debug.body(child);
}

function particlesEmitter(place,min,max,gravity){
	if(!min)
		min=5;
	if(!max)
		max=10;
	if(!gravity)
		gravity=1000;
	emitter.gravity = gravity;
	emitter.minParticleSpeed.setTo(-300, 30);
    emitter.maxParticleSpeed.setTo(300, 100);
    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.5;
	emitter.x=place.x;
	emitter.y=place.y;
	emitter.start(true, 400, null, game.rnd.integerInRange(min,max));
}

function screenShake(){
	if (shakeWorldTime > 0) {
	   var magnitude = ( shakeWorldTime / shakeWorldTimeMax ) * shakeWorldMax;
	   var rand1 = game.rnd.integerInRange(-magnitude,magnitude);
	   var rand2 = game.rnd.integerInRange(-magnitude,magnitude);
	    game.world.setBounds(rand1, rand2, game.width + rand1, game.height + rand2);
	    shakeWorldTime--;
	    if (shakeWorldTime == 0) {
	        game.world.setBounds(0, 0, game.width,game.height); // normalize after shake?
	    }
	}
}