//ⒹⒾⓃⓄ ⒹⒺⓈⒺⓇⓉ 
//By Travis Lee

/* TO DO
	fix fast game on >60hz displays
*/

var gameover = false;
var speedUpTimer = false;
var intro = true;


//WORLD VARIABLES
const ground = 850;
let gravity = -5

//MISC STATS
var framecount = 0;
var kills = 0;
var damageTaken = 0
var score = 0;

//LOAD IMAGES
var images = [];
function preload() {
    for (let i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}
preload(
	"assets/images/dinoWalkCycle1.png",					//0 player walk 1
	"assets/images/dinoWalkCycle2.png",					//1 player walk 2
	"assets/images/dinoChargeCycle1.png",				//2 player charge 1
	"assets/images/dinoChargeCycle2.png",				//3 player charge 2
	"assets/images/smallDinoWalkCycle1.png",			//4 smallDino walk 1
	"assets/images/smallDinoWalkCycle2.png",			//5 smallDino walk 2
	"assets/images/pterodactylFly1.png",				//6 pterodactyl fly 1
	"assets/images/pterodactylFly2.png",				//7 pterodactyl fly 2
	"assets/images/cactus.png",							//8 cactus 1
	"assets/images/tRexWalkCycle1.png",					//9 trex walk 1
	"assets/images/tRexWalkCycle2.png",					//10 trex walk 2
	"assets/images/health.png",							//11 health
	"assets/images/dinoDead.png",						//12 rip :(
	"assets/images/bump.png",							//13 smooth bump
	"assets/images/bump2.png",							//14 wonky bump
	"assets/images/deadTree.png",						//15 dead tree
	"assets/images/pyramid.png",						//16 pyramid
)
document.body.appendChild(images[0])

//CANVAS SETUP
var start;
const c = document.getElementById("gameArea");
const ctx = c.getContext("2d");

const b = document.getElementById("backGround")
const bg = b.getContext("2d")

const h = document.getElementById("hud")
const hud = h.getContext("2d")

const p = document.getElementById("parallaxBackground")
const pbg = p.getContext("2d")

const f = document.getElementById("foreground")
const fg = f.getContext("2d")

//START GAME
$('.starter').click(function(){
	intro = false;
	if(gameover){
		gameover = false;
		parBacGen()
		parBacMove()
		cloudGen()
		cloudsMove()
		terrainGen()
		terrainMove()
	}
	sqr.health = 400;
	sqr.left = 100;
	sqr.right = 228;
	sqr.attack = false;
	sqr.special = 400;
	sqr.cooldown = 0;
	sqr.velocity = 0;
	kills = 0;
	framecount = 0;
	damageTaken = 0;
	score = 0;
	document.getElementById("hide").style.opacity = "100%";
	document.getElementById("hide").style.width = "0px";
	document.getElementById("hide").style.height = "0px";
	document.getElementById("hide").style.zIndex = "0";
	document.getElementById('instructions').style.visibility = "hidden";
	document.getElementById("hide").style.visibility = "hidden";
	//document.documentElement.requestFullscreen() //Fullscreen not supported on many browsers
	drawHUD()
	cooldownTimer()
	special()
	walk()
	jump()
	render()
	enemyMove()
	enemySpawn()
})


//BACKGROUND
function drawBackground(){
	bg.strokeStyle = "orange"; 
	bg.lineWidth = 60
	bg.beginPath();
	bg.arc(70, 70, 30, 0, 2 * Math.PI);
	bg.fillStyle = "#33ccff"
	bg.fillRect(0,0,1920,850)
	bg.stroke()
	bg.fillStyle = "#ffe699"
	bg.fillRect(0,850,1920,230)
	bg.strokeStyle = "black"
}
drawBackground()


//PARALLAX BACKGROUND
pbg.fillStyle="#fff";

	//GROUND PROPS
function ParBac(image, position, velocity){
	this.image = image;
	this.pos = position;
	this.vel = velocity;
}

	//GENERATE GROUND PROPS BASED ON PROBABILITY
var parBac = [];
function parBacGen(){
	if(~~(Math.random()*501)<1){
		parBac[parBac.length] = new ParBac(images[13], 1920, -3) //smooth bump
	}else if(~~(Math.random()*501)<1){
		parBac[parBac.length] = new ParBac(images[14], 1920, -3) //wavy bump
	}else if(~~(Math.random()*501)<1){
		parBac[parBac.length] = new ParBac(images[15], 1920, -3) //dead tree
	}else if(~~(Math.random()*10001)<1){
		parBac[parBac.length] = new ParBac(images[16], 1920, -3) //pyramid RARE
	}
	if(!gameover){
		window.requestAnimationFrame(parBacGen)
	}
}
parBacGen()

	//MOVE PROPS
function parBacMove(){
	pbg.clearRect(0,751,1920,100)
	for(let i=0;i<parBac.length;i++){
		parBac[i].pos += parBac[i].vel
		pbg.drawImage(parBac[i].image, parBac[i].pos, 751, 100, 100)
		if(parBac[i].pos < -100){
			//DESPAWN WHEN OFFSCREEN
			parBac.splice(i,1)
		}
	}
	if(!gameover){
		window.requestAnimationFrame(parBacMove)
	}
}
parBacMove()

	//CLOUDS
function CloudConstructor(currentx, width, velocity, posY){
	this.x = currentx;
	this.width = width;
	this.vel = velocity;
	this.posy = posY;
}

var clouds = [];
	//GENERATE CLOUDS BASED ON PROBABILITY
function cloudGen(){
	if(~~(Math.random()*100)<1){
		clouds[clouds.length] = new CloudConstructor(1920, ~~(Math.random()*300)+100, -3, ~~(Math.random()*100)+60)
	}
	if(!gameover){
		window.requestAnimationFrame(cloudGen)
	}
}
cloudGen()

	//MOVE CLOUDS
function cloudsMove(){
	pbg.clearRect(0,60,1920,140)
	for(let i = 0;i<clouds.length;i++){
		pbg.fillRect(clouds[i].x, clouds[i].posy, clouds[i].width, 40)
		clouds[i].x += clouds[i].vel
		if(clouds[i].x < -400){
			//DESPAWN WHEN OFFSCREEN
			clouds.splice(i,1)
		}
	}
	if(!gameover){
		window.requestAnimationFrame(cloudsMove)
	}
}
cloudsMove()


	//TERRAIN
fg.fillStyle = "#ffe699"
function Terrain(currentx, width, velocity){
	this.x = currentx;
	this.width = width;
	this.vel = velocity;
}

var terrain = [];
	//GENERATE BUMPS ON THE GROUND BASED ON PROBABILITY
function terrainGen(){
	if(~~(Math.random()*50)<1){
		terrain[terrain.length] = new Terrain(1920, ~~(Math.random()*20)+5, -10, 845)
	}
	if(!gameover){
		window.requestAnimationFrame(terrainGen)
	}
}
terrainGen()

	//MOVE CLOUDS
function terrainMove(){
	fg.clearRect(0,845,1920,5)
	for(let i = 0;i<terrain.length;i++){
		fg.fillRect(terrain[i].x, 845, terrain[i].width, 6)
		terrain[i].x += terrain[i].vel
		if(terrain[i].x < -20){
			//DESPAWN WHEN OFFSCREEN
			terrain.splice(i,1)
		}
	}
	if(!gameover){
		window.requestAnimationFrame(terrainMove)
	}
}
terrainMove()

//HUD
function drawHUD(){
	hud.strokeStyle = "black"
	hud.fillStyle = "white"
	hud.font = "30px Arial"
	hud.lineWidth = 6
	hud.fillRect(50,955,560,100)
	hud.strokeRect(50,955,560,100)
	hud.fillRect(1570,955,300,100)
	hud.strokeRect(1570,955,300,100)
	hud.fillStyle = "black"
	hud.fillText("HP",145,990)
	hud.fillText("ATTACK", 70, 1040)
	hud.fillText("SCORE", 1660, 990)
	hud.fillRect(197,962,406,36)
	hud.fillRect(197,1012,406,36)
	hud.fillStyle = "green"
	hud.fillRect(200,965,400,30)
	hud.fillStyle = "blue"
	hud.fillRect(200,1015,400,30)
	hud.lineWidth = "2"
}

//PLAYER VALUES
let sqr = {
	//COLLISION BOX
	left:100,
	right:228,
	top:ground-64,
	bottom: ground,
	//MOVEMENT STATES
	fall:false,
	jumping: true,
	//ATTACK
	attack: false,
	health: 400,
	special: 400,
	cooldown: 0,
	damageBoost: false,
	//INITIAL VELOCITY FROM JUMP
	velocity: 70,
	initialV: 70,
}

//PLAYER HITBOX
let sqrHitbox = {
	left: sqr.right - 60,
	right: sqr.right + 30,
	top: sqr.top - 30,
	bottom: sqr.bottom + 10,
}

//ENEMY CONSTRUCTOR
function Enemy(startx, starty, velocityx, velocityy, width, height, image1, image2, damage, vulnerability, name, accelX, bonusPoints){
	this.x = startx;
	this.y = starty;
	this.velx = velocityx;
	this.vely = velocityy;
	this.width = width;
	this.height = height;
	this.image1 = image1;
	this.image2 = image2;
	this.damage =  damage;
	this.vuln = vulnerability;
	this.name = name;
	this.aX = accelX;
	this.bp = bonusPoints;
}
var enemies = [];

//ENEMY SPAWNRATE HANDLING
function enemySpawn(){
	//SPAWN ENEMY BASED ON PROBABILITY
	if(~~(Math.random()*100001) <= 30){
		enemies[enemies.length] = new Enemy(1920, ground, -10, 0, 50, 40, images[11], images[11], -200, true, 'health', 0, 100)
	} else if(~~(Math.random()*100001) < 50){ 
		enemies[enemies.length] = new Enemy(1920, ground, -13, 0, 100, 200, images[9], images[10], 100, false, 'bigDino', 0, 1000)
	}else if(~~(Math.random()*100001) < 200){
		enemies[enemies.length] = new Enemy(1920, ground-~~(Math.random()*360), -20, 0, 90, 30, images[6], images[7], 50, true, 'pterodactyl', 0, 500)
	} else if(~~(Math.random()*100001) < 300){
		enemies[enemies.length] = new Enemy(1920, ground, -15, 0, 80, 80, images[4], images[5], 50, true, 'smallDino', 0, 250)
	} else if (~~(Math.random()*100001) < 500){
		enemies[enemies.length] = new Enemy(1920, ground, -10, 0, 35, 70, images[8], images[8], 50, false, 'cactus', 0)
	}
	//CALLBACK
	if(!gameover){
		window.requestAnimationFrame(enemySpawn)
	}
}

//ENEMY MOVEMENT HANDLING
function enemyMove(){
	score++
	for(i=0;i<enemies.length;i++){
		if(!gameover){
			//UPDATE ENEMY POSITIONS
			enemies[i].x += enemies[i].velx - enemies[i].aX
			enemies[i].y += enemies[i].vely 
			if(enemies[i].aX < -1){
				//ACCELERATE BIG DINO BACKWARDS AND GIVE HIM JERK SO HIS ACCELX GOES BACK DOWN TO 0 AFTER BEING HIT
				enemies[i].aX += 5
			} else {
				enemies[i].aX = 0
			}
			//CHECK FOR HIT
			if(enemies[i].vuln || enemies[i].name == "bigDino"){
				if(sqr.attack){
					if(enemies[i].x >= sqr.left && enemies[i].x + enemies[i].width <= sqrHitbox.right){
						if (enemies[i].y <= sqr.bottom && enemies[i].y >= sqrHitbox.top){
							if(enemies[i].vuln){
								score += enemies[i].bp
								enemies.splice(i,1)
								kills++
							} else {
								enemies[i].x += 70
								enemies[i].aX += -70
								enemies[i].vuln = true
							}
						} else if (enemies[i].y - enemies[i].height <= sqrHitbox.bottom && enemies[i].y - enemies[i].height >= sqrHitbox.top){
							if(enemies[i].vuln){
								score += enemies[i].bp
								enemies.splice(i,1)
								kills++
							} else {
								enemies[i].x += 70
								enemies[i].aX += -70
								enemies[i].vuln = true
							}
						} else if (enemies[i].y >= sqrHitbox.bottom && enemies[i].y - enemies[i].height <= sqrHitbox.top){
							if(enemies[i].vuln){
								score += enemies[i].bp
								enemies.splice(i,1)
								kills++
							} else {
								enemies[i].x += 70
								enemies[i].aX += -70
								enemies[i].vuln = true
							}
						}
					} else if (enemies[i].x >= sqrHitbox.left && enemies[i].x <= sqrHitbox.right){
						if (enemies[i].y <= sqrHitbox.bottom && enemies[i].y >= sqrHitbox.top){
							if(enemies[i].vuln){
								score += enemies[i].bp
								enemies.splice(i,1)
								kills++
							} else {
								enemies[i].x += 70
								enemies[i].aX += -70
								enemies[i].vuln = true
							}
						} else if (enemies[i].y - enemies[i].height <= sqrHitbox.bottom && enemies[i].y - enemies[i].height >= sqrHitbox.top){
							if(enemies[i].vuln){
								score += enemies[i].bp
								enemies.splice(i,1)
								kills++
							} else {
								enemies[i].x += 70
								enemies[i].aX += -70
								enemies[i].vuln = true
							}
						} else if (enemies[i].y >= sqrHitbox.bottom && enemies[i].y - enemies[i].height <= sqrHitbox.top){
							if(enemies[i].vuln){
								score += enemies[i].bp
								enemies.splice(i,1)
								kills++
							} else {
								enemies[i].x += 70
								enemies[i].aX += -70
								enemies[i].vuln = true
							}
						}
					} else if (enemies[i].x + enemies[i].width >= sqrHitbox.left && enemies[i].x + enemies[i].width <= sqrHitbox.right){
						if (enemies[i].y <= sqrHitbox.bottom && enemies[i].y >= sqrHitbox.top){
							if(enemies[i].vuln){
								score += enemies[i].bp
								enemies.splice(i,1)
								kills++
							} else {
								enemies[i].x += 70
								enemies[i].aX += -70
								enemies[i].vuln = true
							}
						} else if (enemies[i].y - enemies[i].height <= sqrHitbox.bottom && enemies[i].y - enemies[i].height >= sqrHitbox.top){
							if(enemies[i].vuln){
								score += enemies[i].bp
								enemies.splice(i,1)
								kills++
							} else {
								enemies[i].x += 70
								enemies[i].aX += -70
								enemies[i].vuln = true
							}
						} else if (enemies[i].y >= sqrHitbox.bottom && enemies[i].y - enemies[i].height <= sqrHitbox.top){
							if(enemies[i].vuln){
								score += enemies[i].bp
								enemies.splice(i,1)
								kills++
							} else {
								enemies[i].x += 70
								enemies[i].aX += -70
								enemies[i].vuln = true
							}
						}
					}
				}
			}
			//CHECK FOR COLLISION IF NO KILL
			if(enemies[i] !== undefined){
				if(enemies[i].x >= sqr.left && enemies[i].x + enemies[i].width <= sqr.right){
					if (enemies[i].y <= sqr.bottom && enemies[i].y >= sqr.top){
						hurt(enemies[i].damage)
						enemies[i].damage = 0;
						if(enemies[i].vuln){
							enemies.splice(i,1)
						}
					} else if (enemies[i].y - enemies[i].height <= sqr.bottom && enemies[i].y - enemies[i].height >= sqr.top){
						hurt(enemies[i].damage)
						enemies[i].damage = 0;
						if(enemies[i].vuln){
							enemies.splice(i,1)
						}
					} else if (enemies[i].y >= sqr.bottom && enemies[i].y - enemies[i].height <= sqr.top){
						hurt(enemies[i].damage)
						enemies[i].damage = 0;
						if(enemies[i].vuln){
							enemies.splice(i,1)
						}
					}
				} else if (enemies[i].x >= sqr.left && enemies[i].x <= sqr.right){
					if (enemies[i].y <= sqr.bottom && enemies[i].y >= sqr.top){
						hurt(enemies[i].damage)
						enemies[i].damage = 0;
						if(enemies[i].vuln){
							enemies.splice(i,1)
						}
					} else if (enemies[i].y - enemies[i].height <= sqr.bottom && enemies[i].y - enemies[i].height >= sqr.top){
						hurt(enemies[i].damage)
						enemies[i].damage = 0;
						if(enemies[i].vuln){
							enemies.splice(i,1)
						}
					} else if (enemies[i].y >= sqr.bottom && enemies[i].y - enemies[i].height <= sqr.top){
						hurt(enemies[i].damage)
						enemies[i].damage = 0;
						if(enemies[i].vuln){
							enemies.splice(i,1)
						}
					}
				} else if (enemies[i].x + enemies[i].width >= sqr.left && enemies[i].x + enemies[i].width <= sqr.right){
					if (enemies[i].y <= sqr.bottom && enemies[i].y >= sqr.top){
						hurt(enemies[i].damage)
						enemies[i].damage = 0;
						if(enemies[i].vuln){
							enemies.splice(i,1)
						}
					} else if (enemies[i].y - enemies[i].height <= sqr.bottom && enemies[i].y - enemies[i].height >= sqr.top){
						hurt(enemies[i].damage)
						enemies[i].damage = 0;
						if(enemies[i].vuln){
							enemies.splice(i,1)
						}
					} else if (enemies[i].y >= sqr.bottom && enemies[i].y - enemies[i].height <= sqr.top){
						hurt(enemies[i].damage)
						enemies[i].damage = 0;
						if(enemies[i].vuln){
							enemies.splice(i,1)
						}
					}
				}
			}
			//DESPAWN WHEN OFFSCREEN
			if(enemies[i] !== undefined){
				if (enemies[i].x + enemies[i].width < 0){
					enemies.splice(i,1)
				}
			}
		}
	}
	//CALLBACK
	if(!gameover){
		window.requestAnimationFrame(enemyMove)
	}
}

//DRAW FRAME
function render(){
	framecount++
	//CLEAR FRAME
	ctx.clearRect(0,0,1920,1080)
	//UPDATE HITBOX (hitbox is updated here because if it is in a different function is lags behind the player position by ~1-2 frames)
	sqrHitbox.left = sqr.right - 60;
	sqrHitbox.right = sqr.right + 10;
	sqrHitbox.top = sqr.top -20;
	sqrHitbox.bottom = sqr.bottom + 20;
	//UPDATE FRAME
	//DRAW HITBOXES (debugging)
		/*ctx.fillStyle = "orange";
		ctx.fillRect(sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
		if (sqr.attack){
			ctx.fillStyle = "red"
		} else {
			ctx. fillStyle = "transparent"
		}
		ctx.fillRect(sqrHitbox.left, sqrHitbox.top, sqrHitbox.right - sqrHitbox.left, sqrHitbox.bottom - sqrHitbox.top)
			ctx.fillStyle = "#ff66ff";*/
	//DRAW PLAYER
	//IF DAMAGE BOOSTING, OMIT DRAWING THE CHARACTER EVERY 4th FRAME
	if(sqr.damageBoost && framecount%4 == 0){
		ctx.clearRect(sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
	} else if(!sqr.attack){
		//DRAW WALKING SPRITES
		if(framecount%16<8){
			ctx.drawImage(images[0],sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
		} else if(framecount%16>=8) {
			ctx.drawImage(images[1],sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
		}
	} else {
		//DRAW CHARGING SPRTIES
		if(framecount%16<8){
			ctx.drawImage(images[2],sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
		} else if(framecount%16>=8){
			ctx.drawImage(images[3],sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
		}
	}
	//DRAW ENEMIES
	ctx.fillStyle = "#0b6113";
	for (let i=0;i<enemies.length;i++){
		if(enemies[i].image1 != 0 && enemies[i].image2 != 0){
			(framecount%16<8) ? ctx.drawImage(enemies[i].image1,enemies[i].x,enemies[i].y-enemies[i].height,enemies[i].width,enemies[i].height)
				:ctx.drawImage(enemies[i].image2,enemies[i].x,enemies[i].y-enemies[i].height,enemies[i].width,enemies[i].height)
		} else{
			ctx.fillRect(enemies[i].x,enemies[i].y-enemies[i].height,enemies[i].width,enemies[i].height)
		}
	}
	//UPDATE SCORE
	if (!gameover){
		if(score%7==0){ //rewrite the score less often than every frame for performance gains
			if(hud.font !="30px Arial"){
				hud.font = "30px Arial"
			}
			hud.fillStyle = "white"
			hud.fillRect(1590,1000,277,30)
			hud.fillStyle = "black"
			hud.fillText(score.toString(), 1710-score.toString().length*10, 1030)
		}
	}
	//DAY NIGHT CYCLE
	if(framecount%2000 == 0 && framecount%4000==0){
		//DAY
		bg.strokeStyle = "orange"; 
		bg.lineWidth = 60
		bg.beginPath();
		bg.arc(70, 70, 30, 0, 2 * Math.PI);
		bg.fillStyle = "#33ccff"
		bg.fillRect(0,0,1920,850)
		bg.stroke()
		bg.fillStyle = "#ffe699"
		bg.fillRect(0,850,1920,230)
	} else if (framecount%2000 == 0){
		//NIGHT
		bg.strokeStyle = "#f5f3ce"; 
		bg.lineWidth = 60
		bg.beginPath();
		bg.arc(70, 70, 30, 0, 2 * Math.PI);
		bg.fillStyle = "#191970"
		bg.fillRect(0,0,1920,850)
		bg.stroke()
		bg.fillStyle = "#ffe699"
		bg.fillRect(0,850,1920,230)
	}
	//SPEED UP
	if(framecount%4800 == 0 && framecount != 0){
		//SPEED UP WARNING
		hud.font = "70px arial"
		hud.fillText("SPEED UP!", 750,500)
		speedUpTimer = true;
	}
	if(speedUpTimer && framecount%199 == 0){
		//SPEED UP BY +1X TO ENEMY MOVEMENT SPEED AND SPAWNRATE
		speedUpTimer = false;
		enemyMove()
		enemySpawn()
		parBacGen()
		parBacMove()
		cloudsMove()
		cloudGen()
		terrainGen()
		terrainMove()
		hud.clearRect(0,0,1900,700)
	} 
	if(gameover){
		//CLEAR GAME AREA AND DRAW DEAD DINO
		ctx.clearRect(0,0,1920,1080)
		ctx.drawImage(images[12], sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
	}
	//CALLBACK
	if(!gameover){
		window.requestAnimationFrame(render)
	}
}

//JUMP
function jump(){
	if(!gameover){
		//PARABOLIC JUMPING MOVEMENT
		sqr.velocity = sqr.velocity + gravity;
		sqr.bottom = sqr.bottom - sqr.velocity;
		sqr.top = sqr.top - sqr.velocity; 
		if (sqr.velocity <= 0){
			sqr.fall = true;
		}
		if (sqr.bottom > ground){
			sqr.bottom = ground;
			sqr.top = sqr.bottom - 64;
			sqr.jumping = false;
		}
		if (sqr.fall && sqr.bottom == ground){
			sqr.fall = false;
			sqr.jumping = false;
		}
		window.requestAnimationFrame(jump)
	}
}

function walk(){
	if(!gameover){
		//UPDATE POSITION DEPENDANT ON IF USER IS INPUTTING <- or ->
		if (sqr.mvleft){
			if(sqr.left > 0){
				sqr.left = sqr.left - 10;
				sqr.right = sqr.right - 10;
			}
		}
		if (sqr.mvright){
			if(sqr.right < 1920){
				sqr.left = sqr.left + 10;
				sqr.right = sqr.right + 10;
			}
		}
		//CALLBACK
		window.requestAnimationFrame(walk)
	}
}


//DAMAGE HANDLING
function hurt(x){
	if(x>0){
		if(!sqr.damageBoost){
			//UPDATE HUD
			if(x<sqr.health){
				hud.clearRect(200,965,400,30)
				hud.fillStyle = "black"
				hud.fillRect(197,962,406,36)
				hud.fillStyle = "green"
				hud.fillRect(200,965, sqr.health-x,30)
				damageTaken += x;
				//ENABLE DAMAGE BOOSTING
				sqr.damageBoost = true;
				//CALCULATE HEALTH
				sqr.health -= x
			} else if(x>=sqr.health){
				//END GAME IF DAMAGE EXCEDES PLAYER HEALTH
				sqr.health = 0
				hud.fillStyle = "black"
				hud.fillRect(197,962,406,36)
				damageTaken += x;
				endGame()
			}
		}
	} else {
		if(sqr.health-x < 400){
			hud.clearRect(200,965,400,30)
			hud.fillStyle = "black"
			hud.fillRect(197,962,406,36)
			hud.fillStyle = "green"
			hud.fillRect(200,965, sqr.health-x,30)
			sqr.health -= x
		} else {
			//HEAL ONLY TO FULL
			sqr.health = 400;
			hud.fillStyle = "green"
			hud.fillRect(200,965, 400,30)
		}
	}
}

//HANDLES HOW LONG A PLAYER IS IMMUNE FROM DAMAGE
let damageBoostTimer = 0;
function damageBoostTimerClock(){
	if(sqr.damageBoost){
		damageBoostTimer++
		if(damageBoostTimer>40){ // 0.66 sec @60fps
			//END DAMAGE BOOST AFTER ALOTTED FRAMES
			sqr.damageBoost = false;
			damageBoostTimer = 0;
		}
	}
	window.requestAnimationFrame(damageBoostTimerClock)
}
damageBoostTimerClock()

//SPECIAL METER HANDLING
let cooldown = false;
function special(){
	if (sqr.attack){
		if(sqr.special > 7){
		//DECREASE SPECIAL METER WHILE ATTACKING
			hud.fillStyle = "black"
			hud.fillRect(197,1012,406,36)
			hud.fillStyle = "blue"
			sqr.special -= 7;
			hud.fillRect(200,1015,sqr.special,30)
		} else {
		//PREVENT SPAM AT EDGE OF METER BY INTIATING COOLDOWN
			sqr.attack = false;
			sqr.cooldown = 0;
			cooldown = true;
		}
	} else {
	//RECHARGE METER
		if (sqr.special + 2 <= 400){
			hud.fillStyle = "blue"
			sqr.special += 2;
			hud.fillRect(200,1015,sqr.special,30)
		}
	}
	(!gameover) ? window.requestAnimationFrame(special) : hud.clearRect(0,0,1920,1080)
}

//SPECIAL METER EDGE SPAM PREVENTION COOLDOWN TIMER
function cooldownTimer(){
	if(cooldown){
		sqr.cooldown++
	}
	if (sqr.cooldown > 15){//.25 seconds @60fps
		cooldown = false;
	}
	window.requestAnimationFrame(cooldownTimer)
}

//GAME ENDING
function endGame(){
	//RESET EVERYTHING AND DRAW PLAYER DEAD ON GROUND
	gameover = true;
	sqr.top = ground-64;
	sqr.bottom = ground;
	sqr.fall = false;
	sqr.jumping = true;
	sqr.shooting = false;
	hud.clearRect(0,0,1920,1080)
	document.getElementById('image').innerHTML = ""
	document.getElementById('title').innerHTML = "You Died"
	document.getElementById('clickToBegin').innerHTML = 
		"Enemies Killed: " + kills +"<br />" + 
		"Time Survived: " + Math.floor(framecount/60) + "s <br />"  +
		"Score: " + (score-(score%7)) + "<br />" +
		"<span id = 'smalltext'>(Click To Revive)</span>"
	document.getElementById('hide').style.visibility = "visible";
	enemies = [];
	ctx.clearRect(0,0,1920,1080)
	ctx.drawImage(images[12], sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
}

//INPUT 
$('body').keydown(function(){
	//SPACEBAR & UP ARROW
	if(event.which == 32 || event.which == 38){
		if (!sqr.jumping){
			sqr.jumping = true;
			sqr.velocity = sqr.initialV;
		}
	}
	//LEFT ARROW
	if(event.which == 37){
		sqr.mvleft = true;
	}
	//RIGHT ARROW
	if(event.which == 39){
		sqr.mvright = true;
	}
	//F
	if(event.which == 70){
		if (!cooldown){
			sqr.attack = true;
		}
	}
	//DOWN ARROW
	if(event.which == 40){
		if(sqr.jumping){
			//HARD DROP
			gravity -= 15
		}
	}
})

$('body').keyup(function(){
	//LEFT ARROW
	if(event.which === 37){
		sqr.mvleft = false;
	}
	//RIGHT ARROW
	if(event.which === 39){
		sqr.mvright = false;
	}
	//F
	if(event.which === 70){
		sqr.attack = false;
	}
	//DOWN ARROW
	if(event.which === 40){
		gravity = -5
	}
})

//LET DINO WALK WHILE WAITING FOR USER TO START GAME
function introAnimation(){
	framecount++
	ctx.clearRect(0,0,1920,1080)
	if(framecount%16<8){
		ctx.drawImage(images[0],sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
	} else if(framecount%16>=8) {
		ctx.drawImage(images[1],sqr.left,sqr.top,sqr.right-sqr.left,sqr.bottom-sqr.top)
	}
	if(intro){
		window.requestAnimationFrame(introAnimation)
	}
}
introAnimation()