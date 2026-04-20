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

    const fallback = document.getElementById('back-to-top-fallback');
    function onScroll(){
      const y = window.scrollY || window.pageYOffset;
      if(header){
        if(y > 30) header.classList.add('scrolled'); else header.classList.remove('scrolled');
      }
      if(backToTop){
        // show earlier so users spot it quickly on longer pages
        if(y > 20) backToTop.classList.add('show'); else backToTop.classList.remove('show');
      }
      if(fallback){
        if(y > 20) fallback.classList.add('show'); else fallback.classList.remove('show');
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
      if(fallback){
        // Make fallback use the same smooth scroll instead of default jump
        fallback.addEventListener('click', function(e){
          e.preventDefault();
          smoothScrollTo(0, 1000);
        });
      }
    }

    // Scroll Reveal functionality (Intersection Observer)
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Apply titles reveal
    document.querySelectorAll('main section h2, .pole h3').forEach((el) => {
      el.classList.add('reveal-title');
      revealObserver.observe(el);
    });

    // Apply cards reveal with stagger
    document.querySelectorAll('.project-card, .project-tile, .skill-card, .contact-block').forEach((el, index) => {
      el.classList.add('reveal-card');
      el.style.transitionDelay = `${(index % 4) * 100}ms`;
      revealObserver.observe(el);
    });

    // Magnetic Button Effect
    const magneticBtns = document.querySelectorAll('.btn-inversion, .btn-black');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', function(e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', function() {
        btn.style.transform = `translate(0px, 0px)`;
      });
    });

    // Ripple Effect on Click
    document.querySelectorAll('.btn-inversion, .btn-black').forEach(el => {
      el.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        // Handle offset if position relative
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
    
    // Intelligent Navbar (Active State)
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href').substring(1) === entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -60% 0px' });
    
    sections.forEach(sec => navObserver.observe(sec));

    // Cursor glow effect
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let currentX = mouseX;
      let currentY = mouseY;
      
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      function animateGlow() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        cursorGlow.style.transform = `translate3d(calc(${currentX}px - 50%), calc(${currentY}px - 50%), 0)`;
        requestAnimationFrame(animateGlow);
      }
      animateGlow();
    }

  })();
