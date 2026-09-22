document.body.insertAdjacentHTML('afterbegin',`<div class="launch-screen" id="launch-screen"><div class="launch-card"><p class="kicker">DOLLY'S DAILY CARE</p><h1>A day with Dolly</h1><p>Care for Dolly from sunrise to golden hour.</p><button id="open-story" class="action" type="button">Start <span>→</span></button></div></div><div class="story-modal dismissed" id="story-modal" role="dialog" aria-modal="true" aria-labelledby="story-title"><div class="story-panel"><p class="kicker">DOLLY'S DAILY CARE</p><h1 id="story-title">Meet Dolly</h1><div class="official-copy"><p><strong>Intro: Dolly is a beautiful Jersey cow who carries the A2/A2 gene and produces rich, A2/A2 milk.</strong></p><p><strong>Help us take care of Dolly so she can stay healthy, happy, and produce nutritious raw milk.</strong></p><p><strong>Dolly needs nutritious food, water, companionship, health care, and shelter. And of course, don’t forget to milk her!&nbsp;</strong></p><p><strong>Let’s get started.&nbsp;</strong></p></div><button id="start-day" class="action" type="button">Start Dolly's day <span>→</span></button></div></div><div class="finish-celebration dismissed" id="finish-celebration" role="dialog" aria-modal="true" aria-labelledby="finish-title"><div class="confetti" aria-hidden="true">${Array.from({length:36},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><div class="finish-panel"><span class="finish-medal">★</span><p class="kicker">DOLLY'S DAY IS COMPLETE</p><h2 id="finish-title">Great work, farmer!</h2><p>Dolly is healthy, happy, and ready to enjoy the golden hour.</p><div class="finish-milk">🥛 <strong>Fresh A2/A2 milk</strong></div><button id="play-again" class="action" type="button">Play again <span>↻</span></button></div></div>`);

// One day with Dolly, in the order of the original copy. `kind` picks the interaction:
// rub (drag a cloth on the udder) · milk (pull the udder) · food (pick the ration)
// · water (hose the trough) · friends (call a friend) · shelter (tap the barn).
const steps=[
 {id:'clean',short:'Clean',kind:'rub',time:'4:30 AM',scene:'EARLY MORNING',alarm:true,title:'Clean her teats',copy:"It’s 4:30 am. Time to milk Dolly! Don’t forget to clean her teats with iodine.",tip:'First cleaning',tool:'cloth',label:'Clean cloth',art:'assets/tools/clean-cloth.png',speech:'Mooooorning!'},
 {id:'iodine',short:'Iodine',kind:'rub',time:'4:30 AM',scene:'EARLY MORNING',title:'Clean with iodine',copy:"Now the iodine cloth. Clean teats help protect Dolly and keep the milk clean.",tip:'Iodine cleaning',tool:'cloth iodine-cloth',label:'Iodine cloth',art:'assets/tools/iodine-cloth.png',speech:'Moo… that tickles!'},
 {id:'milk',short:'Milk',kind:'milk',time:'4:45 AM',scene:'EARLY MORNING',title:'Milk Dolly',copy:'Milk Dolly by hand. Slide down repeatedly, just like hand milking.',tip:'Slide down repeatedly, just like hand milking.',speech:'Moooo!'},
 {id:'food',short:'Breakfast',kind:'food',time:'10:00 AM',scene:'BREAKFAST TIME',title:'Breakfast: what should she eat?',copy:'It’s 10am! Time for Dolly’s breakfast! What should she eat?',tip:'(Stomach rumbles)',speech:'Mmmmooo!'},
 {id:'water',short:'Water',kind:'water',time:'11:30 AM',scene:'LATE MORNING',title:'Dolly needs water',copy:'What does Dolly need? Her trough is empty and she is panting. Dolly needs water!',tip:'A cow drinks 30–50 gallons of water a day.',label:'Water hose',art:'assets/tools/water-hose.png',speech:'Pant… pant… 💧'},
 {id:'friends',short:'Friends',kind:'friends',time:'12:30 PM',scene:'MIDDAY',title:'Dolly needs friends',copy:'What does Dolly need? She looks sad and lonely. Cows are herd animals — Dolly needs friends!',tip:'Cows form close friendships and get stressed when alone.',speech:'…'},
 {id:'shelter',short:'Shelter',kind:'shelter',time:'2:00 PM',scene:'AFTERNOON STORM',title:'Dolly needs shelter',copy:'What does Dolly need? It’s raining hard! Tap the barn so Dolly can take shelter.',tip:'Shade in the heat and a dry barn in the rain keep Dolly comfortable.',speech:'Brrr… it’s raining!'},
 {id:'milk-pm',short:'PM milking',kind:'milk',time:'4:30 PM',scene:'LATE AFTERNOON',alarm:true,title:'Second milking',copy:'4:30 pm. It’s time for the second milking of the day! Dolly’s udder is full — she looks a little desperate.',tip:'Cows are milked twice a day: 4:30 am and 4:30 pm.',speech:'Moooo! Hurry, please!'}
];
const goodFoods=['Pasture','Fodder','Organic alfalfa hay','Redmond conditioner','Sprouted barley (for treats!)','Redmond Real Salt','Molasses'];
const badFoods=['Corn','Soybeans','Spent grain from liquor and ethanol production','Candy bars','Potatoes','Bakery remnants'];
const allFoods=[...goodFoods,...badFoods];
let current=0,progress=0,dragging=false,dragOffset={x:0,y:0},audioContext,lastPoint=null,milkPulls=0,foodSelected=new Set(),wrongFood=null,stepDone=false;
const $=id=>document.getElementById(id);
$('pasture').append($('launch-screen'));
const act=detail=>window.dispatchEvent(new CustomEvent('dolly3d-action',{detail}));
const SCENE_CLASSES=['feeding','watering','direct-milking','raining','sheltering','friends'];

function render(){
 const step=steps[current];progress=0;stepDone=false;dragging=false;
 if(step.kind==='milk')milkPulls=0;
 $('task-title').textContent=step.title;$('task-copy').textContent=step.copy;$('tip').textContent=step.tip;$('step-count').textContent=`${current+1} / ${steps.length}`;
 $('continue-btn').hidden=true;$('instruction').hidden=false;
 $('speech').textContent=step.speech;
 setClock(step);
 const pasture=$('pasture');SCENE_CLASSES.forEach(c=>pasture.classList.remove(c));
 $('udder-target').classList.remove('hidden');$('udder-target').style.setProperty('--care-progress','0deg');
 $('progress-steps').innerHTML=steps.map((item,i)=>`<div class="progress-step ${i<current?'done':''} ${i===current?'active':''}"><i>${i<current?'✓':i+1}</i><span>${item.short||item.title}</span></div>`).join('');
 $('status').textContent=`${step.title}: waiting for you.`;
 if(step.alarm&&$('story-modal').classList.contains('dismissed'))alarm();
 ({rub:renderRub,milk:renderMilk,food:()=>renderFood(),water:renderWater,friends:renderFriends,shelter:renderShelter})[step.kind]();
}
function setClock(step){$('clock-time').textContent=step.time;$('scene-label').textContent=step.scene}

// ---- rub (clean cloth / iodine cloth) -------------------------------------------------
function renderRub(){
 const step=steps[current];act('idle');
 $('instruction').innerHTML=`<span>↗</span> Move the ${step.label.toLowerCase()} back and forth over Dolly’s udder for about 5 seconds.`;
 $('udder-target').className=`udder-target target-${step.id}`;$('udder-target').innerHTML=`<span>${step.title}</span>`;
 $('tool-bay').innerHTML=`<button class="care-tool tool-image tool-${step.tool}" id="care-tool" type="button" aria-label="Drag ${step.label}"><img src="${step.art}" alt="" draggable="false"></button><small class="tool-hint">${step.label} · drag me</small><div class="cleaning-progress"><i id="cleaning-fill"></i></div>`;
 setDolly('idle');bindGesture($('udder-target'),()=>completeStep());
}

// ---- milking --------------------------------------------------------------------------
function renderMilk(){
 act('idle');act('udder-empty');$('pasture').classList.add('direct-milking');
 $('instruction').innerHTML='<span>↓</span> Pull downward and release 10 times.';
 $('udder-target').className='udder-target target-milk';
 $('udder-target').innerHTML='<button class="udder-hotspot" aria-label="Milk Dolly by pulling downward on her udder"></button><div class="milk-stream" aria-hidden="true"></div><div class="bucket" aria-hidden="true"><div class="milk-level"></div><b></b></div>';
 $('tool-bay').innerHTML='<div class="gesture-demo"><i>☝</i><div><b>Milk Dolly directly</b><small>Press her udder and pull downward 10 times.</small></div></div>';
 setDolly('tail');bindMilking();
}
function bindMilking(){const hotspot=document.querySelector('.udder-hotspot'),stream=document.querySelector('.milk-stream');let startY=0,lastY=0,validPull=false;let stopStream;$('udder-target').style.setProperty('--milk-level','0%');hotspot.addEventListener('pointerdown',e=>{e.preventDefault();dragging=true;validPull=false;startY=lastY=e.clientY;hotspot.setPointerCapture(e.pointerId);hotspot.classList.add('pulling');const box=$('udder-target').getBoundingClientRect(),cowScale=parseFloat(getComputedStyle($('pasture')).getPropertyValue('--cow-scale'))||1;$('udder-target').style.setProperty('--stream-x',`${Math.max(-5,Math.min(105,(e.clientX-box.left)/cowScale))}px`);$('status').textContent=`Pull downward · ${milkPulls} of 10 pulls`});hotspot.addEventListener('pointermove',e=>{if(!dragging)return;e.preventDefault();const delta=e.clientY-lastY,total=e.clientY-startY;if(delta>0&&total>12){validPull=true;hotspot.style.transform=`translateY(${Math.min(total,18)}px)`;stream.classList.add('flowing');clearTimeout(stopStream);stopStream=setTimeout(()=>stream.classList.remove('flowing'),100)}lastY=e.clientY});const release=()=>{if(!dragging)return;dragging=false;hotspot.classList.remove('pulling');hotspot.removeAttribute('style');stream.classList.remove('flowing');if(validPull){milkPulls=Math.min(10,milkPulls+1);progress=milkPulls*10;$('udder-target').style.setProperty('--milk-level',`${progress}%`);$('status').textContent=milkPulls<10?`${milkPulls} of 10 pulls · keep milking Dolly.`:'10 of 10 pulls · the bucket is full!';tone(430+milkPulls*8,.025,.07);if(milkPulls===10)completeMilking()}else $('status').textContent='Pull farther downward to count this stroke.'};hotspot.addEventListener('pointerup',release);hotspot.addEventListener('pointercancel',release)}
function completeMilking(){if(stepDone)return;dragging=false;$('udder-target').classList.add('complete');document.querySelector('.udder-hotspot').disabled=true;document.querySelector('.milk-stream').classList.remove('flowing');act('udder-empty');completeStep('Moooo! What a relief!')}

// ---- food -----------------------------------------------------------------------------
function foodArt(food){const index=allFoods.indexOf(food);return `<i class="food-art" style="--c:${index%4};--r:${Math.floor(index/4)}"></i>`}
function renderFood(message='Choose foods and place them in Dolly’s feeder.'){
 const firstLoad=!$('pasture').classList.contains('feeding');
 $('pasture').classList.add('feeding');$('udder-target').className='udder-target food-trough';
 if(firstLoad){foodSelected.clear();wrongFood=null;act('front');rumble()}
 setDolly(wrongFood?'bad':'lowered');
 $('udder-target').innerHTML=`<div class="trough-food">${[...foodSelected].map(food=>`<span title="${food}">${foodArt(food)}</span>`).join('')}${wrongFood?`<button class="trough-wrong" id="remove-wrong" type="button" aria-label="Remove ${wrongFood}">${foodArt(wrongFood)}<b>×</b></button>`:''}</div>`;
 // Note: no `disabled` here — iOS swallows touches on disabled buttons, which would stop the
 // sideways scroll whenever a finger lands on an already-chosen food. We gate clicks in JS instead.
 $('tool-bay').innerHTML=`<div class="food-grid">${allFoods.map(food=>`<button class="food-choice ${foodSelected.has(food)?'selected':''} ${wrongFood===food?'wrong':''}" data-food="${food}" type="button" aria-disabled="${wrongFood||foodSelected.has(food)?'true':'false'}">${foodArt(food)}<span>${food}</span></button>`).join('')}</div>`;
 $('instruction').innerHTML=`<span>${wrongFood?'!':'♪'}</span> ${message}`;
 $('status').textContent=wrongFood?'Remove the wrong food from Dolly’s feeder.':'Dolly’s stomach is rumbling.';
 if(wrongFood){$('speech').textContent='Moo… no thanks!';act('bad');$('remove-wrong').addEventListener('click',()=>{wrongFood=null;$('speech').textContent='Moooo!';renderFood('Good catch. Keep building Dolly’s ration.')});return}
 dragScroll(document.querySelector('.food-grid'));
 document.querySelectorAll('.food-choice').forEach(button=>button.addEventListener('click',()=>{if(button.getAttribute('aria-disabled')==='true'||button.dataset.dragged)return;const food=button.dataset.food;if(badFoods.includes(food)){wrongFood=food;tone(180,.045,.2);renderFood('That food does not belong. Tap it in the feeder to remove it.');return}foodSelected.add(food);tone(520,.025,.08);renderFood(`${foodSelected.size} of ${goodFoods.length} correct foods are in the feeder.`);act('eat');if(foodSelected.size===goodFoods.length)completeStep('Mmmm… delicious!','Feed Dolly')}));
}

// ---- water ----------------------------------------------------------------------------
function renderWater(){
 const step=steps[current];act('idle');act('thirsty');$('pasture').classList.add('watering');
 $('instruction').innerHTML='<span>💧</span> Drag the hose to the trough and hold it there until it fills up.';
 $('udder-target').className='udder-target water-trough';$('udder-target').style.setProperty('--water-level','0%');
 $('udder-target').innerHTML='<div class="water" aria-hidden="true"></div>';
 $('tool-bay').innerHTML=`<button class="care-tool tool-image tool-hose" id="care-tool" type="button" aria-label="Drag the water hose"><img src="${step.art}" alt="" draggable="false"></button><small class="tool-hint">${step.label} · drag me</small><div class="cleaning-progress water-progress"><i id="cleaning-fill"></i></div>`;
 setDolly('lowered');
 bindGesture($('udder-target'),()=>{act('eat');$('speech').textContent='Slurp… ahhh!';completeStep('Slurp… ahhh! Thank you!')},{hold:true,onProgress:p=>{$('udder-target').style.setProperty('--water-level',`${p}%`);$('status').textContent=`Filling the trough · ${Math.round(p)}%`},statusHint:'Hold the hose over the trough.'});
}

// ---- friends --------------------------------------------------------------------------
function renderFriends(){
 act('idle');act('sad');$('pasture').classList.add('friends');
 $('instruction').innerHTML='<span>🐄</span> Dolly is lonely. Call a friend over from the barn.';
 $('udder-target').className='udder-target hidden';$('udder-target').innerHTML='';
 $('tool-bay').innerHTML='<button class="action call-friend" id="call-friend" type="button">🔔 Call a friend <span>→</span></button>';
 setDolly('idle');
 $('call-friend').addEventListener('click',()=>{$('call-friend').disabled=true;$('call-friend').innerHTML='🔔 Here she comes…';tone(880,.04,.25);setTimeout(()=>tone(660,.04,.3),160);act('friend');$('status').textContent='A friend is on her way from the barn.'},{once:true});
 window.addEventListener('dolly3d-event',function onFriend(e){if(e.detail!=='friend-arrived')return;window.removeEventListener('dolly3d-event',onFriend);moo();completeStep('Moo! A friend!')});
}

// ---- shelter --------------------------------------------------------------------------
function renderShelter(){
 act('idle');$('pasture').classList.add('raining');
 $('instruction').innerHTML='<span>🌧️</span> It’s pouring! Tap the barn to bring Dolly inside.';
 $('udder-target').className='udder-target hidden';$('udder-target').innerHTML='';
 $('tool-bay').innerHTML='<div class="gesture-demo"><i>☔</i><div><b>Tap the barn</b><small>Dolly needs a dry place until the storm passes.</small></div></div>';
 setDolly('idle');
 const barn=$('barn');barn.classList.add('barn-hint');
 barn.addEventListener('click',()=>{barn.classList.remove('barn-hint');barn.disabled=true;act('friend-leave');act('shelter');$('pasture').classList.add('sheltering');$('speech').textContent='Moo! Inside, quick!';$('status').textContent='Dolly is heading into the barn.';
  setTimeout(()=>{$('pasture').classList.remove('raining');$('speech').textContent='The storm passed!';$('scene-label').textContent='AFTERNOON · CLEAR';act('return');setTimeout(()=>completeStep('Moo! Dry and cozy!'),3600)},4200)},{once:true});
}

// Mouse/trackpad drag-to-scroll for the food strip. Touch is left to the browser's native
// panning (touch-action: pan-x), so this only handles mouse pointers.
function dragScroll(el){if(!el)return;let startX=0,startLeft=0,moved=false,active=false;el.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;active=true;moved=false;startX=e.clientX;startLeft=el.scrollLeft});el.addEventListener('pointermove',e=>{if(!active)return;const dx=e.clientX-startX;if(Math.abs(dx)>4)moved=true;if(moved){el.scrollLeft=startLeft-dx;e.preventDefault()}});const stop=e=>{if(!active)return;active=false;if(moved){const b=e.target.closest?.('.food-choice');if(b){b.dataset.dragged='1';setTimeout(()=>delete b.dataset.dragged,0)}}};el.addEventListener('pointerup',stop);el.addEventListener('pointerleave',stop);el.addEventListener('pointercancel',stop)}
// ---- shared gesture: drag a tool over a target ----------------------------------------
function bindGesture(target,onDone,opts={}){
 const tool=$('care-tool');
 const move=e=>{if(!dragging)return;tool.style.position='fixed';tool.style.zIndex='20';tool.style.left=`${e.clientX-dragOffset.x}px`;tool.style.top=`${e.clientY-dragOffset.y}px`;const hit=overlaps(tool,target),now=performance.now();target.classList.toggle('engaged',hit);if(hit&&lastPoint){const distance=Math.hypot(e.clientX-lastPoint.x,e.clientY-lastPoint.y),elapsed=Math.min(80,now-lastPoint.time);if(opts.hold||distance>1.5)progress=Math.min(100,progress+elapsed/50);target.style.setProperty('--care-progress',`${progress*3.6}deg`);const fill=$('cleaning-fill');if(fill)fill.style.width=`${progress}%`;if(opts.onProgress)opts.onProgress(progress);else $('status').textContent=`${steps[current].title} · ${Math.round(progress)}%`;if(progress>=100&&!stepDone){tool.classList.add('complete');target.classList.add('complete');dragging=false;onDone()}}lastPoint={x:e.clientX,y:e.clientY,time:now}};
 // Holding still must keep filling, so tick while the pointer is down.
 let ticker;
 tool.addEventListener('pointerdown',e=>{dragging=true;tool.setPointerCapture(e.pointerId);const r=tool.getBoundingClientRect();dragOffset={x:e.clientX-r.left,y:e.clientY-r.top};lastPoint={x:e.clientX,y:e.clientY,time:performance.now()};tool.classList.add('dragging');move(e);tone(340,.05);if(opts.hold){clearInterval(ticker);ticker=setInterval(()=>{if(dragging&&lastPoint)move({clientX:lastPoint.x,clientY:lastPoint.y})},60)}});
 tool.addEventListener('pointermove',move);
 const end=()=>{clearInterval(ticker);dragging=false;if(progress>=100)return;tool.classList.remove('dragging');tool.removeAttribute('style');target.classList.remove('engaged');$('status').textContent=progress?(opts.statusHint||'Good start — keep the tool on the target.'):'Try placing the tool on the glowing ring.'};
 tool.addEventListener('pointerup',end);tool.addEventListener('pointercancel',end);
}

// ---- step completion / scoring --------------------------------------------------------
function completeStep(speech='Mooo, thank you!',nextLabel){
 if(stepDone)return;stepDone=true;dragging=false;
 const step=steps[current];
 $('instruction').hidden=true;$('continue-btn').hidden=false;
 $('continue-btn').innerHTML=`${nextLabel||(current===steps.length-1?'Finish the day':'Next step')} <span>→</span>`;
 $('status').textContent=`${step.title} complete. Dolly is comfortable.`;
 const pct=Math.round((current+1)/steps.length*100);$('score').textContent=`${pct}%`;$('meter-fill').style.width=`${pct}%`;
 setDolly('happy');$('speech').textContent=speech;$('pasture').classList.add('celebrate');successSound();setTimeout(()=>$('pasture').classList.remove('celebrate'),900);
}
function finishDay(){
 $('task-title').textContent='Great work, farmer!';$('task-copy').textContent='Dolly was milked at 4:30 am and 4:30 pm, had breakfast at 10 am, fresh water, a friend and a dry barn. She is healthy and happy.';
 $('tool-bay').innerHTML='<div class="milk-result"><span>🥛</span><div><b>Fresh A2/A2 milk</b><small>Clean · cooled · cared for</small></div></div>';
 $('udder-target').classList.add('hidden');$('instruction').hidden=true;$('continue-btn').hidden=true;
 $('progress-steps').innerHTML=steps.map(item=>`<div class="progress-step done"><i>✓</i><span>${item.short||item.title}</span></div>`).join('');
 $('status').textContent='Dolly’s day is complete!';$('speech').textContent='Moooo! Best day ever!';
 SCENE_CLASSES.forEach(c=>$('pasture').classList.remove(c));$('scene-label').textContent='GOLDEN HOUR';$('clock-time').textContent='6:00 PM';
 setDolly('happy');act('celebrate');setTimeout(moo,600);setTimeout(()=>$('finish-celebration').classList.remove('dismissed'),500);
}
function setDolly(pose){$('dolly').className=`dolly-sprite pose-${pose}`;$('dolly-wrap').className=`dolly-wrap mood-${pose}`;if(pose==='happy')act('happy')}
function overlaps(a,b){const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return x.left<y.right&&x.right>y.left&&x.top<y.bottom&&x.bottom>y.top}

// ---- audio ----------------------------------------------------------------------------
function tone(f,v=.035,d=.08,type='sine'){try{audioContext||=new(window.AudioContext||window.webkitAudioContext)();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type=type;o.frequency.value=f;g.gain.value=v;o.connect(g).connect(audioContext.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+d);o.stop(audioContext.currentTime+d)}catch(_){}}
// Dolly's moo: a real recording (assets/audio/moo.m4a, CC BY-SA — see assets/audio/CREDITS.txt).
const mooClip=new Audio('assets/audio/moo.m4a');mooClip.preload='auto';mooClip.volume=.85;
function moo(){try{mooClip.currentTime=0;mooClip.play().catch(()=>{})}catch(_){}}
function successSound(){[440,554,659].forEach((n,i)=>setTimeout(()=>tone(n,.04,.18),i*100))}
// Old-fashioned alarm clock: two rings of fast beeps, and the clock chip shakes.
function alarm(){const chip=document.querySelector('.day-chip');chip?.classList.add('ringing');setTimeout(()=>chip?.classList.remove('ringing'),1600);[0,1].forEach(ring=>{for(let i=0;i<6;i++)setTimeout(()=>tone(i%2?1760:1480,.03,.07,'square'),ring*800+i*90)})}
// Stomach rumble: a low wobbling sawtooth.
function rumble(){try{audioContext||=new(window.AudioContext||window.webkitAudioContext)();const c=audioContext,t=c.currentTime,o=c.createOscillator(),g=c.createGain(),v=c.createOscillator(),vg=c.createGain();o.type='sawtooth';o.frequency.value=48;v.frequency.value=9;vg.gain.value=14;v.connect(vg).connect(o.frequency);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.05,t+.15);g.gain.exponentialRampToValueAtTime(.0001,t+1.1);o.connect(g).connect(c.destination);o.start(t);v.start(t);o.stop(t+1.1);v.stop(t+1.1)}catch(_){}}

// ---- wiring ---------------------------------------------------------------------------
$('continue-btn').addEventListener('click',()=>{if(current<steps.length-1){current++;render();return}finishDay()});
$('open-story').addEventListener('click',()=>{$('launch-screen').classList.add('dismissed');$('story-modal').classList.remove('dismissed');$('story-modal').querySelector('button').focus()});
$('start-day').addEventListener('click',()=>{$('story-modal').classList.add('dismissed');act('enter');act(steps[current].kind==='food'?'front':'idle');tone(760,.05,.18);setTimeout(()=>tone(540,.04,.28),130);setTimeout(()=>{if(current===0)alarm()},3400)});
$('play-again').addEventListener('click',()=>{current=0;foodSelected.clear();wrongFood=null;$('score').textContent='0%';$('meter-fill').style.width='0';$('finish-celebration').classList.add('dismissed');$('launch-screen').classList.remove('dismissed');render()});
$('restart')?.addEventListener('click',()=>{current=0;foodSelected.clear();wrongFood=null;$('score').textContent='0%';$('meter-fill').style.width='0';render()});
render();
if(new URLSearchParams(location.search).has('preview3d'))$('launch-screen').classList.add('dismissed');
