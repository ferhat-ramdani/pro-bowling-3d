// Global game variables
let fst_eq = 0;
let n_lancers_g = 0;
let n_lancers_d = 0;
let score_1 = 0;
let score_2 = 0;

function win(eq, c) {
    alert("Team " + eq + " (" + c + ") has won the game!");
}

function updateScoreboard() {
    document.getElementById("verte_score").innerHTML = score_1;
    document.getElementById("orange_score").innerHTML = score_2;
}

function gerer_bts() {
    // Manage which team is allowed to throw next
    if (fst_eq == 1) {
        if ((n_lancers_g == 1) || (n_lancers_g == 2 && n_lancers_d == 2) || (n_lancers_g == 3 && n_lancers_d == 2)) {
            document.getElementById("gauche").disabled = false;
            document.getElementById("droite").disabled = true;
        } else if ((n_lancers_g == 2 && n_lancers_d == 0) || (n_lancers_g == 2 && n_lancers_d == 1) || (n_lancers_g == 4 && n_lancers_d == 2) || (n_lancers_g == 4 && n_lancers_d == 3)) {
            document.getElementById("gauche").disabled = true;
            document.getElementById("droite").disabled = false;
        } else if (n_lancers_g == 4 && n_lancers_d == 4) {
            document.getElementById("gauche").disabled = true;
            document.getElementById("droite").disabled = true;
        }
    } else if (fst_eq == 2) {
        if ((n_lancers_d == 1) || (n_lancers_d == 2 && n_lancers_g == 2) || (n_lancers_d == 3 && n_lancers_g == 2)) {
            document.getElementById("droite").disabled = false;
            document.getElementById("gauche").disabled = true;
        } else if ((n_lancers_d == 2 && n_lancers_g == 0) || (n_lancers_d == 2 && n_lancers_g == 1) || (n_lancers_d == 4 && n_lancers_g == 2) || (n_lancers_d == 4 && n_lancers_g == 3)) {
            document.getElementById("droite").disabled = true;
            document.getElementById("gauche").disabled = false;
        } else if (n_lancers_d == 4 && n_lancers_g == 4) {
            document.getElementById("droite").disabled = true;
            document.getElementById("gauche").disabled = true;
        }
    }
}