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
        if(y > 320) backToTop.classList.add('show'); else backToTop.classList.remove('show');
      }
    }

    window.addEventListener('scroll', onScroll, {passive:true});
    // init state
    onScroll();

    if(backToTop){
      backToTop.addEventListener('click', ()=>{
        window.scrollTo({top:0,behavior:'smooth'});
      });
    }

  })();
})();
