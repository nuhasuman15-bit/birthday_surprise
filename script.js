// Beginner-friendly JS: change names, dates, or messages in index.html

document.addEventListener('DOMContentLoaded', ()=>{
  // Sections in order
  const sections = ['welcome','reveal','story','memories','love','distance','letter','gift','final'];

  const openBtn = document.getElementById('openBtn');
  const playMusicBtn = document.getElementById('playMusic');
  const bgMusic = document.getElementById('bgMusic');
  const openGift = document.getElementById('openGift');
  const giftBox = document.getElementById('giftBox');
  const replay = document.getElementById('replay');

  // Safe guards
  function goTo(id){
    const el = document.getElementById(id);
    if(!el) return;
    document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
    el.classList.add('active');
    el.scrollIntoView({behavior:'smooth'});
  }

  // Open initial reveal
  if(openBtn){
    openBtn.addEventListener('click', ()=>{
      goTo('reveal');
      spawnConfetti('confetti', 50);
    });
  }

  // data-scroll-to buttons (Next / Continue)
  document.querySelectorAll('[data-scroll-to]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.dataset.scrollTo;
      goTo(id);
    });
  });

  // Timeline add
  const addEvent = document.getElementById('addEvent');
  const newEvent = document.getElementById('newEvent');
  const timeline = document.getElementById('timeline');
  if(addEvent){
    addEvent.addEventListener('click', ()=>{
      if(!newEvent.value.trim()) return;
      const div = document.createElement('div');
      div.className='timeline-item';
      div.contentEditable = 'true';
      div.textContent = newEvent.value;
      timeline.appendChild(div);
      newEvent.value = '';
    });
  }

  // Gift open -> animate + reveal final message
  if(openGift && giftBox){
    openGift.addEventListener('click', ()=>{
      // toggle open visual
      const opening = !giftBox.classList.contains('open');
      if(opening){
        giftBox.classList.add('open');
        // little delay then celebrate and show final
        spawnConfetti('finalConfetti', 80);
        setTimeout(()=>{
          goTo('final');
        },900);
      } else {
        // close
        giftBox.classList.remove('open');
        const fc = document.getElementById('finalConfetti'); if(fc) fc.innerHTML='';
      }
    });
  }

  // Music control
  if(playMusicBtn && bgMusic){
    playMusicBtn.addEventListener('click', ()=>{
      if(bgMusic.paused){
        bgMusic.play();
        playMusicBtn.textContent='Pause Music ⏸';
      } else {
        bgMusic.pause();
        playMusicBtn.textContent='Play Music ▶';
      }
    });
  }

  // Replay: reset to welcome and clear effects
  if(replay){
    replay.addEventListener('click', ()=>{
      // reset gift and confetti
      if(giftBox) giftBox.classList.remove('open');
      const nodes = document.querySelectorAll('.confetti-piece');
      nodes.forEach(n=>n.remove());
      const fc = document.getElementById('finalConfetti'); if(fc) fc.innerHTML='';
      goTo('welcome');
      if(playMusicBtn && bgMusic){ bgMusic.pause(); playMusicBtn.textContent='Play Music ▶'; bgMusic.currentTime=0 }
    });
  }

  // spawn ambient hearts and sparkles
  spawnHearts(16);
  spawnSparkles(26);

  // Balloon Surprise: reveal each GIF in order.
  const balloonStops = Array.from(document.querySelectorAll('#balloonRow .balloon-stop'));
  const balloonFinal = document.getElementById('balloonFinal');
  if(balloonStops.length){
    let currentBalloon = 0;
    let pendingPop;

    balloonStops.forEach((stop, index)=>{
      const balloon = stop.querySelector('.balloon');
      const result = stop.querySelector('.balloon-result');
      const image = result.querySelector('img');
      const showMissingImage = ()=>result.classList.add('gif-missing');
      const showLoadedImage = ()=>result.classList.remove('gif-missing');

      image.addEventListener('load', showLoadedImage);
      image.addEventListener('error', showMissingImage, {once:true});
      if(image.complete){
        if(image.naturalWidth === 0) showMissingImage();
        else showLoadedImage();
      }

      balloon.addEventListener('click', ()=>{
        if(index !== currentBalloon || balloon.disabled) return;
        balloon.disabled = true;
        balloon.classList.add('is-popping');

        pendingPop = window.setTimeout(()=>{
          pendingPop = undefined;
          stop.classList.add('is-revealed');
          result.setAttribute('aria-hidden','false');
          currentBalloon++;

          if(currentBalloon < balloonStops.length){
            balloonStops[currentBalloon].querySelector('.balloon').disabled = false;
          } else if(balloonFinal){
            balloonFinal.classList.add('is-visible');
            balloonFinal.setAttribute('aria-hidden','false');
            spawnConfetti('balloonConfetti', 100);
            const hearts = document.getElementById('balloonHearts');
            if(hearts){
              for(let heartIndex=0;heartIndex<18;heartIndex++){
                const heart = document.createElement('span');
                heart.className = 'balloon-heart';
                heart.textContent = '♥';
                heart.style.left = Math.random()*100+'%';
                heart.style.animationDelay = Math.random()*3+'s';
                heart.style.animationDuration = 3.5+Math.random()*2+'s';
                hearts.appendChild(heart);
              }
            }
          }
        },420);
      });
    });

    if(replay){
      replay.addEventListener('click', ()=>{
        window.clearTimeout(pendingPop);
        pendingPop = undefined;
        currentBalloon = 0;
        balloonStops.forEach((stop, index)=>{
          stop.classList.remove('is-revealed');
          stop.querySelector('.balloon').classList.remove('is-popping');
          stop.querySelector('.balloon').disabled = index !== 0;
          stop.querySelector('.balloon-result').setAttribute('aria-hidden','true');
        });
        if(balloonFinal){
          balloonFinal.classList.remove('is-visible');
          balloonFinal.setAttribute('aria-hidden','true');
          document.getElementById('balloonConfetti').innerHTML = '';
          document.getElementById('balloonHearts').innerHTML = '';
        }
      });
    }
  }

  // make sure welcome is active initially
  goTo('welcome');
});

function spawnConfetti(containerId, amount){
  const confetti = document.getElementById(containerId);
  if(!confetti) return;
  confetti.innerHTML = '';
  for(let i=0;i<amount;i++){
    const el = document.createElement('div');
    el.className='confetti-piece';
    const size = Math.random()*10 + 6;
    el.style.width = size+'px';
    el.style.height = (size*0.6)+'px';
    const hue = 330 + Math.random()*40;
    el.style.background = `hsl(${hue} 80% 70% / 1)`;
    el.style.position='absolute';
    el.style.left = Math.random()*100+'%';
    el.style.top = '-10%';
    el.style.transform = `rotate(${Math.random()*360}deg)`;
    el.style.opacity = 0.95;
    el.style.animation = `drop ${3+Math.random()*3}s linear forwards`;
    confetti.appendChild(el);
  }
}

function spawnHearts(n){
  const container = document.getElementById('hearts');
  if(!container) return;
  for(let i=0;i<n;i++){
    const h = document.createElement('div');h.className='heart';
    h.style.left = Math.random()*100+'%';
    h.style.top = Math.random()*100+'%';
    const s = 6+Math.random()*18;h.style.width=s+'px';h.style.height=s+'px';
    h.style.opacity = Math.random()*0.8+0.2;
    h.style.transform = `rotate(-45deg) scale(${1+Math.random()*0.8})`;
    h.style.transition = `transform ${4+Math.random()*6}s linear, top ${4+Math.random()*6}s linear`;
    container.appendChild(h);
    (function(el){
      setInterval(()=>{
        el.style.top = (parseFloat(el.style.top) - (6+Math.random()*24)) + '%';
        el.style.transform = `rotate(-45deg) translateY(-10px) scale(${1+Math.random()*0.7})`;
        setTimeout(()=>{el.style.top = Math.random()*100+'%';},3000+Math.random()*2000);
      },3000+Math.random()*2000);
    })(h);
  }
}

function spawnSparkles(n){
  const container = document.getElementById('sparkles');
  if(!container) return;
  for(let i=0;i<n;i++){
    const s = document.createElement('div');s.className='spark';
    s.style.left = Math.random()*100+'%';s.style.top = Math.random()*100+'%';
    s.style.opacity = Math.random();s.style.transform = `scale(${Math.random()*1.6})`;
    container.appendChild(s);
    (function(el){
      setInterval(()=>{
        el.style.opacity = Math.random();
        el.style.transform = `scale(${0.6+Math.random()*1.8})`;
      },1200+Math.random()*1800);
    })(s);
  }
}

/* CSS animations inserted dynamically for confetti */
(function(){
  const s = document.createElement('style');s.textContent = `@keyframes drop{to{transform:translateY(120vh) rotate(720deg);opacity:0}}`;
  document.head.appendChild(s);
})();
