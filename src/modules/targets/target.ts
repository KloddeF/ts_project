document.querySelector('button').onclick = shotClick;

function shotClick(){
    console.log('work');
    let x = document.querySelector('.x').value;
    let y = document.querySelector('.y').value;
    var n = 0;
    
    
    if ((x>=-1)&&(x<=1)) {
        if ((y>=-1)&&(y<=1)) n=1;
    }
    if ((x*x+y*y)<=1) n=2;
    if ((Math.abs(x)+Math.abs(y))<=1) n=3;
    if (((Math.sqrt(1-(Math.sqrt(1-(Math.abs(x)))**4)))+Math.abs(y)<1)&&(x!=0 && y!=0)) n=4;
    if ((x==0)&&(y==0)) n=10;


    document.querySelector('.result').innerHTML = n;
}