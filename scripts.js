(function(){
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  if(toggle){
    toggle.addEventListener('click', ()=>{
      const shown = nav.style.display === 'flex';
      nav.style.display = shown ? 'none' : 'flex';
      toggle.setAttribute('aria-expanded', String(!shown));
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length>1 && document.querySelector(href)){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
        // if mobile, hide nav after click
        if(window.innerWidth<=900 && nav){nav.style.display='none'}
      }
    })
  })
  
    // Header scrolled state and back-to-top button
    const header = document.getElementById('site-header');
    const backToTop = document.getElementById('back-to-top');

    function onScroll(){
      const y = window.scrollY || window.pageYOffset;
      if(header){
        if(y > 30) header.classList.add('scrolled'); else header.classList.remove('scrolled');
      }
      if(backToTop){
        // show earlier so users spot it quickly on longer pages
        if(y > 20) backToTop.classList.add('show'); else backToTop.classList.remove('show');
      }
    }

    window.addEventListener('scroll', onScroll, {passive:true});
    // init state
    onScroll();

    // Ensure nav state on resize: let layout CSS control desktop view
    window.addEventListener('resize', ()=>{
      if(!nav || !toggle) return;
      if(window.innerWidth>900){
        // clear inline display so CSS takes over
        nav.style.display = 'flex';
        toggle.setAttribute('aria-expanded','false');
      } else {
        // hide nav by default on small screens
        nav.style.display = 'none';
        toggle.setAttribute('aria-expanded','false');
      }
    });

    if(backToTop){
      const progressEl = document.getElementById('scroll-progress');
      // Smooth scroll helper (requestAnimationFrame) for consistent animation
      function smoothScrollTo(targetY, duration){
        const startY = window.scrollY || window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();
        if(progressEl){ progressEl.style.width = '0%'; progressEl.classList.add('show'); }
        function easeInOutQuad(t){ return t<0.5 ? 2*t*t : -1 + (4-2*t)*t }
        function frame(now){
          const time = Math.min(1, (now - startTime) / duration);
          const eased = easeInOutQuad(time);
          const current = Math.round(startY + (distance * eased));
          window.scrollTo(0, current);
          if(progressEl){
            const prog = startY === 0 ? 1 : Math.min(1, (startY - (window.scrollY || window.pageYOffset)) / startY);
            progressEl.style.width = Math.round(prog * 100) + '%';
          }
          if(time < 1) requestAnimationFrame(frame);
          else {
            if(progressEl){ progressEl.style.width = '100%'; setTimeout(()=>{ progressEl.classList.remove('show'); progressEl.style.width='0%'; }, 260); }
          }
        }
        requestAnimationFrame(frame);
      }

      backToTop.addEventListener('click', (e)=>{
        e.preventDefault();
        // small click animation for feedback
        backToTop.classList.add('clicked');
        setTimeout(()=>{ backToTop.classList.remove('clicked'); }, 420);
        // use JS animation for reliable smoothness (longer duration for gentler motion)
        smoothScrollTo(0, 1000);
        // Fallback: after the animation, if still not at top, use native smooth scroll
        setTimeout(()=>{
          if((window.scrollY || window.pageYOffset) > 10){
            window.scrollTo({top:0,behavior:'smooth'});
          }
        }, 1100);
      });
    }

  })();
