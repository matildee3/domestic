
/// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Adjust canvas size to fit the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Update canvas size on window resize
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    reset();
});

// Subject
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/dino.png";

// Flowers
var monsterImages = [];
var monsterImageIndex = 0;

var monsterImagePaths = [];
for (var i = 1; i <= 14; i++) {
    monsterImagePaths.push("images/ff/f" + i + ".png");
}

var imagesToLoad = monsterImagePaths.length;
var imagesLoaded = 0;

monsterImagePaths.forEach(function (path) {
    var img = new Image();
    img.onload = function () {
        imagesLoaded++;
        if (imagesLoaded === imagesToLoad) {
            reset();
            main();
        }
    };
    img.src = path;
    monsterImages.push(img);
});

// Game objects
var hero = {
    speed: 256, // movement in pixels per second
    flipped: false // to keep track if hero is flipped or not
};
var monster = {};
var monstersCaught = 0;

// Messages to display
var messages = [
    "Hola equipooooo",
    "Today is my last day here at domestic :(",
    "I have some things I want to say to all of you that I didn't get to say in the last GLOOOOOOBALLLL because I didn't know yet that today would be my last day.",
    "So I decided to do it through this little letter :)",
    "I really want to say thank you very much to each of you: I am really very happy to have crossed my life with yours, you have been wonderful people to know and to share my days with in recent times.",
    "You have not only been great workmates, you have also been really good friends to me.",
    "I feel that from each of you I have learned thousands of different things, both professionally and humanly, and I am immensely grateful to you for that.",
    "It is only because of you that I leave here as a totally different person than the one who came in, I have discovered creativity and design, I have understood what it means to work in teams, to create community, I have learned to hack el adjuntamento and my hair is longer.",
    "Termino diciendo que vaya donde vaya y esté donde esté en los próximos periodos, si os apetece venir y pasar unas pequeñas vacaciones, seréis mis invitadas y me haréis muy feliz",
    "Merci per tot y un abrazo,",
    "Matilde"
];
var messageToShow = "";
var messageElement = document.getElementById("message");
var finalImageElement = document.getElementById("finalImage");

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a flower
var reset = function () {
    var margin = 30;
    hero.x = Math.max(margin, canvas.width / 2);
    hero.y = Math.max(margin, canvas.height / 2);

    // Throw the flower somewhere on the screen randomly within bounds with a 30px margin
    monster.x = margin + (Math.random() * (canvas.width - margin * 2 - 100));
    monster.y = margin + (Math.random() * (canvas.height - margin * 2 - 100));

    // Select a random flower image
    monsterImageIndex = (monsterImageIndex + Math.floor(1 + Math.random() * (monsterImages.length - 1))) % monsterImages.length;
};

// Update game objects
var update = function (modifier) {
    if (38 in keysDown) { // Player holding up
        hero.y -= hero.speed * modifier;
    }
    if (40 in keysDown) { // Player holding down
        hero.y += hero.speed * modifier;
    }
    if (37 in keysDown) { // Player holding left
        hero.x -= hero.speed * modifier;
        hero.flipped = true; // Flip the hero when moving left
    }
    if (39 in keysDown) { // Player holding right
        hero.x += hero.speed * modifier;
        hero.flipped = false; // Unflip the hero when moving right
    }

    // Ensure hero stays within the canvas boundaries with a 30px margin
    var margin = 30;
    if (hero.x < margin) hero.x = margin;
    if (hero.x > canvas.width - margin - 64) hero.x = canvas.width - margin - 64;
    if (hero.y < margin) hero.y = margin;
    if (hero.y > canvas.height - margin - 64) hero.y = canvas.height - margin - 64;

    // Are they touching?
    if (
        hero.x <= (monster.x + 50) && monster.x <= (hero.x + 50) && hero.y <= (monster.y + 50) && monster.y <= (hero.y + 50)
    ) {
        ++monstersCaught;
        if (monstersCaught <= messages.length) {
            messageToShow += messages[monstersCaught - 1] + "<br>";
            messageElement.innerHTML = messageToShow;
        }
        if (monstersCaught === messages.length) {
            finalImageElement.style.display = "block";
        }
        reset();
    }
};

// Draw everything
var render = function () {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (heroReady) {
        ctx.save();
        if (hero.flipped) {
            // Flip the hero horizontally
            ctx.translate(hero.x + 35, hero.y);
            ctx.scale(-1, 1);
            ctx.drawImage(heroImage, -35, 0, 70, 70);
        } else {
            // Draw normally
            ctx.drawImage(heroImage, hero.x, hero.y, 70, 70);
        }
        ctx.restore();
    }

    if (monsterImages.length > 0) {
        ctx.drawImage(monsterImages[monsterImageIndex], monster.x, monster.y);
    }
};

// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();

