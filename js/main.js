(() => {
  const mobileMQ = window.matchMedia('(max-width: 750px)');
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = () => mobileMQ.matches;

  /* ---------- Background videos ----------
     Wix shows the space video only on desktop; mobile gets the still frame. */
  document.querySelectorAll('.features video').forEach((v) => {
    if (isMobile()) {
      v.removeAttribute('autoplay');
      v.preload = 'none';
      v.pause();
    }
  });

  /* ---------- Background parallax (media moves at 20% of scroll) ---------- */
  const parallax = [...document.querySelectorAll('[data-parallax]')].map((sec) => ({
    sec,
    media: sec.querySelector('.bg-media'),
  }));

  /* ---------- Header: hide after scrolling down, restore at the top ---------- */
  const hdr = document.getElementById('hdr');
  const HIDE_AFTER = 360;

  /* ---------- Back-to-top (mobile) ---------- */
  const toTop = document.querySelector('.totop');

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = window.scrollY;

      if (!isMobile()) {
        if (y > HIDE_AFTER) hdr.classList.add('is-hidden');
        else if (y < 1) hdr.classList.remove('is-hidden');
      }

      if (!reduceMQ.matches && !isMobile()) {
        const vh = window.innerHeight;
        for (const { sec, media } of parallax) {
          const r = sec.getBoundingClientRect();
          if (r.bottom < -vh || r.top > vh * 2) continue;
          media.style.transform = `translate3d(0, ${(-0.8 * r.top).toFixed(2)}px, 0)`;
        }
      }

      if (toTop) toTop.classList.toggle('is-on', y > window.innerHeight * 0.5);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    if (isMobile()) parallax.forEach(({ media }) => (media.style.transform = ''));
    onScroll();
  });
  onScroll();

  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Entrance animations ---------- */
  const animated = document.querySelectorAll('.a-float, .a-fade, .a-glide, .m-float, .m-fade');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0 }
    );
    animated.forEach((el) => io.observe(el));
  } else {
    animated.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- "More" dropdown (keyboard + touch) ---------- */
  const more = document.querySelector('.more');
  const moreBtn = more?.querySelector('button');
  moreBtn?.addEventListener('click', () => {
    const open = more.classList.toggle('is-open');
    moreBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (more && !more.contains(e.target)) {
      more.classList.remove('is-open');
      moreBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('mmenu');
  const closeBtn = menu?.querySelector('.mmenu-close');
  function setMenu(open) {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    (open ? closeBtn : burger).focus();
  }
  burger?.addEventListener('click', () => setMenu(true));
  closeBtn?.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false);
  });

  /* ---------- Newsletter form ----------
     Set the form's action to your form endpoint (Formspree, Netlify Forms, etc.). */
  const form = document.getElementById('subscribe');
  const status = form?.querySelector('.t-thanks');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.elements.email;
    if (!email.checkValidity()) {
      email.focus();
      status.textContent = 'Enter a valid email address.';
      return;
    }
    if (!form.action || form.getAttribute('action') === '') {
      status.textContent = 'Subscriptions are not connected yet. Email info@quadronstudios.com to join.';
      return;
    }
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(res.statusText);
      form.reset();
      status.textContent = 'Thanks for submitting!';
    } catch {
      status.textContent = 'That didn’t go through. Try again, or email info@quadronstudios.com.';
    }
  });
})();

/* =========================================================
   Generated pages: parallax, entrance motion, video players,
   Projects channel + lightbox, forms
   ========================================================= */
(() => {
  const mobile = () => window.matchMedia('(max-width: 750px)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* parallax: media moves at data-pf (desktop) / data-pfm (mobile) of the section speed */
  const px = [...document.querySelectorAll('[data-pf], [data-pfm]')];
  let ticking = false;
  const update = () => {
    ticking = false;
    const m = mobile();
    for (const el of px) {
      const f = parseFloat(m ? el.dataset.pfm : el.dataset.pf);
      const media = el.querySelectorAll('.bgm');
      if (isNaN(f) || reduce.matches) { media.forEach((x) => (x.style.transform = '')); continue; }
      const r = el.getBoundingClientRect();
      if (r.bottom < -innerHeight || r.top > innerHeight * 2) continue;
      media.forEach((x) => (x.style.transform = `translate3d(0, ${((f - 1) * r.top).toFixed(2)}px, 0)`));
    }
  };
  if (px.length) {
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* mobile-only background videos start when shown */
  if (mobile()) document.querySelectorAll('video[data-autoplay-m]').forEach((v) => { v.preload = 'auto'; v.play().catch(() => {}); });

  /* entrance animations copied from the Wix rules (.mo) */
  const mo = document.querySelectorAll('.mo');
  if (mo.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0 });
    mo.forEach((el) => io.observe(el));
  } else mo.forEach((el) => el.classList.add('is-in'));

  /* YouTube players: poster first, embed on click */
  const embed = (host, id) => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    f.title = host.getAttribute('aria-label') || 'Video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    host.replaceChildren(f);
  };
  document.querySelectorAll('.ytv[data-yt]').forEach((el) => {
    const go = () => { if (el.dataset.yt && !el.querySelector('iframe')) { embed(el, el.dataset.yt); el.removeAttribute('role'); el.removeAttribute('tabindex'); } };
    el.addEventListener('click', go);
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });

  /* Projects video channel */
  document.querySelectorAll('.vg').forEach((vg) => {
    const items = JSON.parse(vg.querySelector('.vg-data').textContent);
    const track = vg.querySelector('.vg-track');
    const prev = vg.querySelector('.vg-prev');
    const next = vg.querySelector('.vg-next');
    let page = 0;
    const perPage = 2, step = 702;
    const pages = Math.ceil(items.length / perPage);
    const show = () => {
      track.style.transform = `translateX(${-page * perPage * step}px)`;
      prev.hidden = page === 0;
      next.hidden = page >= pages - 1;
    };
    prev.addEventListener('click', () => { page = Math.max(0, page - 1); show(); });
    next.addEventListener('click', () => { page = Math.min(pages - 1, page + 1); show(); });
    show();

    // mobile dots
    const slides = vg.querySelector('.vg-slides');
    const dots = vg.querySelector('.vg-dots');
    if (slides && dots) {
      const n = slides.children.length;
      dots.innerHTML = '<i></i>'.repeat(Math.min(n, 5));
      const mark = () => {
        const i = Math.round(slides.scrollLeft / slides.clientWidth);
        [...dots.children].forEach((d, k) => d.classList.toggle('is-on', k === Math.min(i, dots.children.length - 1)));
      };
      slides.addEventListener('scroll', mark, { passive: true });
      mark();
    }

    // lightbox
    let lb, cur = 0;
    const X = '<svg viewBox="0 0 20 20" aria-hidden="true"><path stroke="#fff" stroke-width="1.6" d="M1 1l18 18M19 1L1 19"/></svg>';
    const ARR = (d) => `<svg viewBox="0 0 29 48" width="30" height="30" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`;
    const PLAY = '<svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true"><path fill="#fff" d="M20 37.84c9.85 0 17.84-7.99 17.84-17.84S29.85 2.16 20 2.16 2.16 10.15 2.16 20 10.15 37.84 20 37.84zM20 40C8.95 40 0 31.05 0 20S8.95 0 20 0s20 8.95 20 20-8.95 20-20 20z"/><path fill="#fff" d="M16 13v14l11-7z"/></svg>';
    const render = (autoplay) => {
      const it = items[cur];
      const stage = lb.querySelector('.vlb-stage');
      if (autoplay) {
        if (it.yt) {
          stage.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${it.yt}?autoplay=1&rel=0" title="${it.title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
        } else {
          stage.innerHTML = `<video src="${it.file}" poster="${it.poster}" controls autoplay playsinline></video>`;
        }
      } else {
        stage.innerHTML = `<img src="${it.poster}" alt=""><button type="button" class="vlb-cover"><strong></strong><span>${PLAY}Play Video</span></button>`;
        stage.querySelector('strong').textContent = it.title;
        stage.querySelector('.vlb-cover').addEventListener('click', () => render(true));
      }
      lb.querySelector('.vlb-info h2').textContent = it.title;
      lb.querySelector('.vlb-dur').textContent = it.dur;
      lb.querySelector('.vlb-desc').textContent = it.desc || '';
      lb.querySelectorAll('.vlb-strip li').forEach((li, k) => li.classList.toggle('is-current', k === cur));
    };
    const open = (i) => {
      cur = i;
      if (!lb) {
        lb = document.createElement('div');
        lb.className = 'vlb';
        lb.setAttribute('role', 'dialog');
        lb.setAttribute('aria-modal', 'true');
        lb.setAttribute('aria-label', 'Projects videos');
        lb.innerHTML = `<button type="button" class="vlb-close" aria-label="Close">${X}</button><div class="vlb-stage"></div>
          <div class="vlb-info"><h2></h2><p class="vlb-dur"></p><p class="vlb-desc"></p></div>
          <button type="button" class="vlb-prev" aria-label="Previous video">${ARR('M26.4.8 29 3.4 8.6 24 29 44.6l-2.6 2.6L3.4 24z')}</button>
          <button type="button" class="vlb-next" aria-label="Next video">${ARR('M2.6.8 0 3.4 20.4 24 0 44.6l2.6 2.6L25.6 24z')}</button>
          <ul class="vlb-strip">${items.map((it, k) => `<li><button type="button" data-i="${k}"><img src="${it.poster}" alt=""><span>${k === 0 ? it.title : ''}</span></button></li>`).join('')}</ul>`;
        document.body.appendChild(lb);
        lb.querySelector('.vlb-close').addEventListener('click', close);
        lb.querySelector('.vlb-next').addEventListener('click', () => { cur = (cur + 1) % items.length; render(false); });
        lb.querySelector('.vlb-prev').addEventListener('click', () => { cur = (cur - 1 + items.length) % items.length; render(false); });
        lb.querySelectorAll('.vlb-strip button').forEach((b) => b.addEventListener('click', () => { cur = +b.dataset.i; render(false); }));
        document.addEventListener('keydown', (e) => { if (lb && !lb.hidden && e.key === 'Escape') close(); });
      }
      lb.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      render(false);
      lb.querySelector('.vlb-close').focus();
    };
    const close = () => {
      lb.hidden = true;
      lb.querySelector('.vlb-stage').innerHTML = '';
      document.documentElement.style.overflow = '';
    };
    vg.querySelectorAll('.vg-open').forEach((b) => b.addEventListener('click', () => open(+b.dataset.i)));
  });

  /* Wix forms -> configurable endpoint (meta[name=qs-form-endpoint]) */
  const endpoint = (document.querySelector('meta[name="qs-form-endpoint"]') || {}).content || '';
  document.querySelectorAll('form.wform').forEach((form) => {
    const thanks = form.querySelector('.wthanks');
    const say = (msg) => {
      if (!thanks) return;
      const p = thanks.querySelector('p, span') || thanks;
      if (msg) p.textContent = msg;
      thanks.classList.add('is-shown');
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll('.fc').forEach((f) => { const bad = !f.checkValidity(); f.classList.toggle('is-invalid', bad); if (bad && ok) { f.focus(); ok = false; } });
      if (!ok) return;
      if (!endpoint) { say('Forms are not connected yet. Email info@quadronstudios.com and we’ll get back to you.'); return; }
      const data = new FormData(form);
      data.append('form', form.dataset.form || '');
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: data });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        say(null);
      } catch {
        say('That didn’t go through. Try again, or email info@quadronstudios.com.');
      }
    });
  });
})();

/* Opened straight from disk (file://): folder links need an explicit index.html */
if (location.protocol === 'file:') {
  document.querySelectorAll('a[href]').forEach((a) => {
    const h = a.getAttribute('href');
    if (/^(?!(?:[a-z]+:|#|\/\/))[^?#]*\/$/i.test(h)) a.setAttribute('href', h + 'index.html');
  });
}
