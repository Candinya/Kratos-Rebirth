// 移动端默认关闭
if (notMobile) {
(function(){var requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){window.setTimeout(callback,1000/60);};window.requestAnimationFrame=requestAnimationFrame;})();
(function(){
    var snow_conf = new Object();
    //-------------------参数设置区 开始-------------------
        snow_conf.flakeCount = 150;
        snow_conf.minDist = 100;
        snow_conf.color = "255, 255, 255";
        snow_conf.size = 2;
        snow_conf.speed = 0.5;
        snow_conf.opacity = 0.2;
        snow_conf.stepsize = 1;
    //-------------------参数设置区 结束-------------------
var flakes=[],canvas=document.getElementById("Snow"),ctx=canvas.getContext("2d"),flakeCount=snow_conf.flakeCount,mX=-100,mY=-100;
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
function snow(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=0;i<flakeCount;i++){
        var flake=flakes[i],x=mX,y=mY,minDist=snow_conf.minDist,x2=flake.x,y2=flake.y;
        var dist=Math.sqrt((x2-x)*(x2-x)+(y2-y)*(y2-y)),dx=x2-x,dy=y2-y;
        if(dist<minDist){
            var force=minDist/(dist*dist),xcomp=(x-x2)/dist,ycomp=(y-y2)/dist,deltaV=force/2;
            flake.velX-=deltaV*xcomp;
            flake.velY-=deltaV*ycomp;
        }else{
            flake.velX*=0.98;
            if(flake.velY<=flake.speed){flake.velY = flake.speed;}
            flake.velX+=Math.cos(flake.step+=.05)*flake.stepSize;
        }
        ctx.fillStyle="rgba("+snow_conf.color+","+flake.opacity+")";
        flake.y+=flake.velY;
        flake.x+=flake.velX;
        if(flake.y>=canvas.height||flake.y<=0){reset(flake);}
        if(flake.x>=canvas.width||flake.x<=0){reset(flake);}
        ctx.beginPath();
        ctx.arc(flake.x,flake.y,flake.size,0,Math.PI*2);
        ctx.fill();
    }
    requestAnimationFrame(snow);
};
function reset(flake){
    flake.x=Math.floor(Math.random()*canvas.width);
    flake.y=0;
    flake.size=(Math.random()*3)+2;
    flake.speed=(Math.random()*1)+0.5;
    flake.velY=flake.speed;
    flake.velX=0;
    flake.opacity=(Math.random()*0.5)+0.3;
}
function init(){
    for(var i=0;i<flakeCount;i++){
        var x=Math.floor(Math.random()*canvas.width),y=Math.floor(Math.random()*canvas.height),size=(Math.random()*3)+snow_conf.size,speed=(Math.random()*1)+snow_conf.speed,opacity=(Math.random()*0.5)+snow_conf.opacity;
        flakes.push({speed:speed,velY:speed,velX:0,x:x,y:y,size:size,stepSize:(Math.random())/30*snow_conf.stepsize,step:0,angle:180,opacity:opacity});
    }
    snow();
};
document.addEventListener("mousemove",function(e){mX=e.clientX,mY=e.clientY});
window.addEventListener("resize",function(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
init();
})();

}