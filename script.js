
const progressBar = document.getElementById('progressBar');
const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const openSidebar = document.getElementById('openSidebar');
const closeSidebar = document.getElementById('closeSidebar');
const particles = document.getElementById('particles');
const lineActive = document.getElementById('lineActive');

function updateProgress(){
  const doc = document.documentElement;
  const total = doc.scrollHeight - doc.clientHeight;
  const progress = total > 0 ? (doc.scrollTop / total) * 100 : 0;
  if(progressBar) progressBar.style.width = progress + '%';
  if(lineActive){
    const len = lineActive.getTotalLength();
    lineActive.style.strokeDasharray = len;
    lineActive.style.strokeDashoffset = len - (len * progress / 100);
  }
}
window.addEventListener('scroll', updateProgress, {passive:true});
window.addEventListener('resize', updateProgress);
updateProgress();

function setSidebar(open){
  if(!sidebar || !sidebarBackdrop) return;
  sidebar.classList.toggle('open', open);
  sidebarBackdrop.classList.toggle('open', open);
}
openSidebar?.addEventListener('click', () => setSidebar(true));
closeSidebar?.addEventListener('click', () => setSidebar(false));
sidebarBackdrop?.addEventListener('click', () => setSidebar(false));
document.querySelectorAll('.sidebar a').forEach(a => a.addEventListener('click', () => setSidebar(false)));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
}, {threshold:.12});
document.querySelectorAll('.reveal, section, .hero').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

const sections = [...document.querySelectorAll('main section[id], main[id]')];
const navLinks = [...document.querySelectorAll('.sidebar a[data-section]')];
const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = entry.target.id || 'top';
      navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === id));
    }
  });
}, {rootMargin:'-30% 0px -60% 0px', threshold:0.01});
sections.forEach(s => activeObserver.observe(s));

if(particles){
  for(let i=0;i<22;i++){
    const p=document.createElement('span');
    p.className='particle';
    p.style.left=(Math.random()*100)+'%';
    p.style.animationDelay=(-Math.random()*14)+'s';
    p.style.animationDuration=(10+Math.random()*12)+'s';
    particles.appendChild(p);
  }
}

const box=document.getElementById('lightbox');
const img=document.getElementById('lightboxImg');
document.querySelectorAll('.thumb').forEach(b=>b.addEventListener('click',()=>{
  img.src=b.dataset.full;
  box.classList.add('open');
  box.setAttribute('aria-hidden','false');
}));
document.getElementById('close')?.addEventListener('click',()=>{
  box.classList.remove('open');
  box.setAttribute('aria-hidden','true');
});
box?.addEventListener('click',e=>{
  if(e.target===box){
    box.classList.remove('open');
    box.setAttribute('aria-hidden','true');
  }
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    box?.classList.remove('open');
    setSidebar(false);
  }
});
