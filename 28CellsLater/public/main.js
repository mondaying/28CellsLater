//Selection des composants
var mainDiv = document.getElementById('gameScreen');
var cvObs = document.getElementById('obstacles');
var cvLiens = document.getElementById('liens');
var cvCells = document.getElementById('cells');
var cvDessin = document.getElementById('dessin');
var cvAnims = document.getElementById('anims');

//Lancement du jeu
var main = new UiMain({
    gameScreen: mainDiv,
    cvObs: cvObs,
    cvLiens: cvLiens,
    cvCells: cvCells,
    cvDraw: cvDessin,
    cvAnims:cvAnims
});