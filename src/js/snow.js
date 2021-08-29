// 移动端默认关闭
window.kr?.notMobile && (()=>{
    let snowConf = {};
    //-------------------参数设置区 开始-------------------
        snowConf.flakeCount = 100;
        snowConf.minDist = 150;
        snowConf.color = "255, 255, 255";
        snowConf.size = 2;
        snowConf.speed = 0.5;
        snowConf.opacity = 0.2;
        snowConf.stepsize = .5;
    //-------------------参数设置区 结束-------------------
    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){window.setTimeout(callback, 1000/60);};
    window.requestAnimationFrame = requestAnimationFrame;
    const canvas = document.getElementById("snow");
    const ctx = canvas.getContext("2d");
    const flakeCount = snowConf.flakeCount;
    let mX = -100, mY = -100;
    let flakes = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const snow = ()=>{
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const minDist = snowConf.minDist;
        for (let i = 0; i < flakeCount; i++){
            let flake = flakes[i];
            const x = mX, y = mY;
            const x2 = flake.x, y2 = flake.y;
            const dist = Math.sqrt((x - x2)*(x - x2) + (y - y2)*(y - y2));
            if (dist < minDist) {
                const force  = minDist / (dist*dist);
                const xcomp  = (x - x2) / dist;
                const ycomp  = (y - y2) / dist;
                const deltaV = force / 2;
                flake.velX -= deltaV * xcomp;
                flake.velY -= deltaV * ycomp;
             } else {
                flake.velX *= 0.98;
                if (flake.velY < flake.speed && (flake.speed - flake.velY > .01)) {
                    flake.velY += (flake.speed - flake.velY) * .01;
                }
                flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
            }
            ctx.fillStyle = "rgba(" + snowConf.color + ", " + flake.opacity + ")";
            flake.y += flake.velY;
            flake.x += flake.velX;
            if(flake.y >= canvas.height || flake.y <= 0){
                reset(flake);
            }
            if(flake.x >= canvas.width || flake.x <= 0){
                reset(flake);
            }
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI*2);
            ctx.fill();
        }
        requestAnimationFrame(snow);
    };
    const reset = (flake)=>{
        flake.x       = Math.floor(Math.random()*canvas.width);
        flake.y       = 0;
        flake.size    = (Math.random()*3)+2;
        flake.speed   = (Math.random()*1)+0.5;
        flake.velY    = flake.speed;
        flake.velX    = 0;
        flake.opacity = (Math.random()*0.5)+0.3;
    };
    const init = ()=>{
        for(let i = 0; i < flakeCount; i++){
            const x       = Math.floor(Math.random()*canvas.width);
            const y       = Math.floor(Math.random()*canvas.height);
            const size    = (Math.random()*3) + snowConf.size;
            const speed   = (Math.random()*1) + snowConf.speed;
            const opacity = (Math.random()*0.5) + snowConf.opacity;
            flakes.push({
                speed: speed,
                velX: 0, velY: speed,
                x: x, y: y,
                size: size,
                stepSize: (Math.random()) / 30 * snowConf.stepsize,
                step: 0,
                angle: 180,
                opacity: opacity
            });
        }
        snow();
    };
    document.addEventListener("mousemove", (e)=>{mX = e.clientX, mY = e.clientY});
    window.addEventListener("resize",()=>{canvas.width = window.innerWidth; canvas.height = window.innerHeight;});
    init();
})();