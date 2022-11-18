//fonction qui prends une liste de points (vecteurs) et 
//bouge un objet (mesh) suivant ces points

function bouger(obj, points){

    j = 0;

    let interval = setInterval(() => {
        if(j < points.length){
            obj.position.x = points[j].x;
            obj.position.y = points[j].y;
            // reAfficher();
            j++;
        } else {
            clearInterval(interval);
        }
    }, 100);

}