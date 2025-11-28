
const qInput = document.getElementById('q');
const btn = document.getElementById('btnSearch');
const res = document.getElementById('results');

function normalize(s){ return (s||'').trim().toLowerCase(); }

function findCandidates(query){
  if(!query) return [];
  const nq = normalize(query);
  return DATA.filter(e => {
    if(normalize(e.name) === nq) return true;
    if(e.alt && e.alt.some(a => normalize(a) === nq)) return true;
    if(normalize(e.name).includes(nq)) return true;
    if(e.alt && e.alt.some(a => normalize(a).includes(nq))) return true;
    return false;
  });
}

function renderNoResult(query){
  res.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'nores';
  div.innerHTML = `<strong>Không tìm thấy kết quả cho "${escapeHtml(query)}"</strong><br><small>Hãy thử gõ họ & tên đầy đủ hoặc tên thường dùng.</small>`;
  res.appendChild(div);
}

function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

async function fetchSummaryFromWiki(wikiTitle){
  // Try Vietnamese Wikipedia first, then English
  const enc = encodeURIComponent(wikiTitle);
  const urls = [
    `https://vi.wikipedia.org/api/rest_v1/page/summary/${enc}`,
    `https://en.wikipedia.org/api/rest_v1/page/summary/${enc}`
  ];
  for(const url of urls){
    try {
      const r = await fetch(url);
      if(!r.ok) continue;
      const j = await r.json();
      return j; // contains extract and thumbnail if available
    } catch(e){
      continue;
    }
  }
  return null;
}

async function renderEntry(entry){
  res.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';
  const av = document.createElement('div');
  av.className = 'avatar';
  const img = document.createElement('img');
  img.alt = entry.name;
  img.src = ''; // will set later
  av.appendChild(img);

  const meta = document.createElement('div');
  meta.className = 'meta';
  const h2 = document.createElement('h2');
  h2.textContent = entry.name;
  const p = document.createElement('p');
  p.textContent = 'Đang tải thông tin từ Wikipedia...';

  meta.appendChild(h2);
  meta.appendChild(p);

  card.appendChild(av);
  card.appendChild(meta);
  res.appendChild(card);

  // fetch summary
  const wikiTitle = entry.wiki || entry.name;
  const data = await fetchSummaryFromWiki(wikiTitle);
  if(data){
    p.textContent = data.extract || entry.short || 'Không có mô tả sẵn.';
    if(data.thumbnail && data.thumbnail.source){
      img.src = data.thumbnail.source;
    } else if(data.originalimage && data.originalimage.source){
      img.src = data.originalimage.source;
    } else {
      img.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/NoImageFound.png';
      img.alt = entry.name + ' (ảnh không có)';
    }
  } else {
    p.textContent = entry.short || 'Không có mô tả (Wikipedia không trả về dữ liệu).';
    img.src = 'https://upload.wikimedia.org/wikipedia/commons/8/89/NoImageFound.png';
    img.alt = entry.name + ' (ảnh không có)';
  }
}

function doSearch(){
  const q = qInput.value;
  const cand = findCandidates(q);
  if(!q || cand.length === 0){
    renderNoResult(q);
  } else {
    // if multiple candidates, show first then list others
    renderEntry(cand[0]);
    if(cand.length > 1){
      const list = document.createElement('div');
      list.style.marginTop = '12px';
      list.innerHTML = '<strong>Kết quả khác:</strong>';
      const ul = document.createElement('ul');
      for(let i=0;i<cand.length;i++){
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = cand[i].name;
        a.onclick = (e) => { e.preventDefault(); renderEntry(cand[i]); };
        li.appendChild(a);
        ul.appendChild(li);
      }
      list.appendChild(ul);
      res.appendChild(list);
    }
  }
}

btn.addEventListener('click', doSearch);
qInput.addEventListener('keydown', e => { if(e.key === 'Enter') doSearch(); });

// Optional: show sample suggestions on load
document.addEventListener('DOMContentLoaded', () => {
  const hint = document.createElement('div');
  hint.style.marginTop = '10px';
  hint.style.color = 'var(--muted)';
  hint.innerHTML = 'Ví dụ: <em>Võ Nguyên Giáp</em>, <em>Hồ Chí Minh</em>, <em>Trần Hưng Đạo</em>';
  document.querySelector('.wrap').insertBefore(hint, document.querySelector('.results'));
});
