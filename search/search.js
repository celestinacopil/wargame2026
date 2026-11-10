'use strict';
(() => {
  const form = document.querySelector('#search-form');
  const input = document.querySelector('#query');
  const results = document.querySelector('#results');
  const welcome = document.querySelector('#welcome');
  const count = document.querySelector('#count');
  const list = document.querySelector('#list');
  const filters = [...document.querySelectorAll('#filters button')];
  const pages = window.SEEKR_INDEX || [];
  let filter = 'all';
  const norm = x => String(x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  function parse(q) {
    const sites = [], phrases = [];
    const remaining = q.replace(/site:([^\s"]+)/gi, (_, site) => { sites.push(norm(site).replace(/^https?:\/\//, '').replace(/^www\./, '')); return ' '; })
      .replace(/"([^"]+)"/g, (_, phrase) => { phrases.push(norm(phrase)); return ' '; });
    return {sites, phrases, words: norm(remaining).split(/\s+/).filter(Boolean)};
  }
  function score(page, query) {
    const title = norm(page.title), desc = norm(page.description), keys = norm(page.keywords), domain = norm(page.domain);
    const all = [title, desc, keys, domain].join(' ');
    if (query.sites.some(s => !domain.replace(/^www\./, '').includes(s))) return -1;
    if (query.phrases.some(p => !all.includes(p))) return -1;
    if (query.words.some(w => !all.includes(w))) return -1;
    if (!(query.words.length || query.phrases.length || query.sites.length)) return -1;
    let n = 1;
    for (const w of query.words) n += (title.includes(w) ? 8 : 0) + (keys.includes(w) ? 4 : 0) + (desc.includes(w) ? 2 : 0);
    for (const p of query.phrases) n += title.includes(p) ? 12 : 5;
    return n;
  }
  function render() {
    const raw = input.value.trim();
    welcome.hidden = !!raw;
    results.hidden = !raw;
    document.title = raw ? `${raw} - Seekr Search` : 'Seekr | Search the web';
    if (!raw) return;
    const q = parse(raw);
    const matches = pages.map((page,i) => ({page,i,rank:score(page,q)}))
      .filter(x => x.rank >= 0 && (filter === 'all' || x.page.type === filter))
      .sort((a,b) => b.rank-a.rank || a.i-b.i);
    count.textContent = `${matches.length} result${matches.length===1?'':'s'} for “${raw}”`;
    list.replaceChildren();
    if (!matches.length) {
      const p = document.createElement('p'); p.className='empty';
      p.textContent = 'No matching results. Try a broader query or a different spelling.';
      list.append(p); return;
    }
    for (const {page} of matches) {
      const article = document.createElement('article'); article.className='hit';
      const source = document.createElement('div'); source.className='source'; source.textContent=page.domain;
      const link = document.createElement('a'); link.href=page.url; link.textContent=page.title;
      const desc = document.createElement('p');
      if (page.date) { const date=document.createElement('span'); date.className='date'; date.textContent=page.date+' — '; desc.append(date); }
      desc.append(document.createTextNode(page.description));
      article.append(source,link,desc); list.append(article);
    }
  }
  function updateFilter(next) {
    filter = next;
    filters.forEach(b=>b.classList.toggle('active', b.dataset.filter===filter));
    render();
  }
  form.addEventListener('submit', e=>{
    e.preventDefault(); filter='all';
    filters.forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
    const query = input.value.trim();
    history.pushState(null,'',location.pathname + (query ? '?q='+encodeURIComponent(query) : ''));
    render();
  });
  filters.forEach(b=>b.addEventListener('click',()=>updateFilter(b.dataset.filter)));
  function restore() { input.value = new URLSearchParams(location.search).get('q') || ''; updateFilter('all'); }
  window.addEventListener('popstate',restore);
  restore();
})();
