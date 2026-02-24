(function(){
  'use strict';
  // cursor
  const dot=document.querySelector('.cursor');
  if(dot){
    window.addEventListener('mousemove',e=>{dot.style.left=e.clientX+'px';dot.style.top=e.clientY+'px'});
    document.querySelectorAll('a,button').forEach(el=>{
      el.addEventListener('mouseenter',()=>document.body.classList.add('hov'));
      el.addEventListener('mouseleave',()=>document.body.classList.remove('hov'));
    });
  }
  // progress
  const bar=document.querySelector('.progress');
  window.addEventListener('scroll',()=>{if(bar)bar.style.width=(window.scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+'%'},{passive:true});
  // nav
  const nav=document.querySelector('.nav');
  const syncNav=()=>nav?.classList.toggle('up',window.scrollY>50);
  window.addEventListener('scroll',syncNav,{passive:true});syncNav();
  // back-top
  const btt=document.querySelector('.btt');
  if(btt){window.addEventListener('scroll',()=>btt.classList.toggle('on',window.scrollY>500),{passive:true});btt.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));}
  // hamburger
  const hbg=document.getElementById('hbg'),drw=document.getElementById('drw');
  if(hbg&&drw){
    hbg.addEventListener('click',()=>{const o=hbg.classList.toggle('open');drw.classList.toggle('open',o);document.body.style.overflow=o?'hidden':'';});
    drw.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{hbg.classList.remove('open');drw.classList.remove('open');document.body.style.overflow='';}));
  }
  // active link
  const pg=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-a').forEach(a=>{if(a.getAttribute('href')===pg)a.classList.add('on');});
  // reveal
  const ro=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target);}}),{threshold:.07,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv,.rl').forEach(el=>ro.observe(el));
  // skill bars
  const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll('.skill-f').forEach(b=>b.style.width=b.dataset.w+'%');so.unobserve(e.target);}}),{threshold:.3});
  document.querySelectorAll('.skills-wrap').forEach(el=>so.observe(el));
  // magnetic buttons
  document.querySelectorAll('.btn').forEach(b=>{
    b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.11}px,${(e.clientY-r.top-r.height/2)*.11}px)`;});
    b.addEventListener('mouseleave',()=>b.style.transform='');
  });
  // contact form
  const form=document.getElementById('cf');
  if(form){
    const sub=document.getElementById('csub');
    const ve=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const se=(id,eid,v)=>{document.getElementById(id)?.classList.toggle('err',v);const e=document.getElementById(eid);if(e)e.classList.toggle('on',v);};
    document.getElementById('cn')?.addEventListener('blur',function(){se('cn','cne',this.value.trim().length<2);});
    document.getElementById('ce')?.addEventListener('blur',function(){se('ce','cee',!ve(this.value.trim()));});
    document.getElementById('cm')?.addEventListener('blur',function(){se('cm','cme',this.value.trim().length<10);});
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const n=document.getElementById('cn').value.trim(),em=document.getElementById('ce').value.trim(),m=document.getElementById('cm').value.trim();
      let ok=true;
      if(n.length<2){se('cn','cne',true);ok=false;}else se('cn','cne',false);
      if(!ve(em)){se('ce','cee',true);ok=false;}else se('ce','cee',false);
      if(m.length<10){se('cm','cme',true);ok=false;}else se('cm','cme',false);
      if(!ok)return;
      if(sub){sub.querySelector('span').textContent='Sending…';sub.disabled=true;}
      emailjs.send('service_m15nugn','template_srz6x8p',{
        from_name:  n,
        from_email: em,
        subject:    document.getElementById('cs')?.value.trim()||'(No subject)',
        message:    m,
      }).then(()=>{
        document.getElementById('cok')?.classList.add('on');
        if(sub){sub.querySelector('span').textContent='Send Message';sub.disabled=false;}
        form.reset();
        setTimeout(()=>document.getElementById('cok')?.classList.remove('on'),5000);
      }).catch(err=>{
        console.error('EmailJS error:',err);
        if(sub){sub.querySelector('span').textContent='Failed — try again';sub.disabled=false;}
      });
    });
  }
})();