(function(){
const S=window.SITE, I=window.ICON, $=(q,c)=>(c||document).querySelector(q), $$=(q,c)=>[...(c||document).querySelectorAll(q)];
const fmt=n=>'$'+Math.round(n).toLocaleString('es-CL');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const CATICON={vacuno:'cow',cerdo:'pig',pollo:'bird',asado:'flame',packs:'box'};
let DATA=null, cart=JSON.parse(localStorage.getItem('bn_cart')||'[]');
const ROOT=document.body.dataset.root||'/';

async function load(){
  const local=localStorage.getItem('bn_data');
  if(local){try{return JSON.parse(local)}catch(e){}}
  const r=await fetch(ROOT+'data/products.json?v='+S.version); return r.json();
}
function waLink(text){const base=S.whatsapp?'https://wa.me/'+S.whatsapp:'https://wa.me/';return base+'?text='+encodeURIComponent(text)}

function header(){
  const cats=DATA.categorias;
  $('#site-top').innerHTML=`
  <div class="topbar"><div class="wrap"><span>${I('truck',16)} Pide por WhatsApp y retira en el local</span><span class="hide-m">${I('pin',16)} Av. Bernardo O'Higgins 382, Quilicura</span></div></div>
  <header class="hdr"><div class="wrap">
    <button class="burger" id="burger" aria-label="Abrir menú">${I('menu')}</button>
    <a class="brand" href="${ROOT}"><img src="${ROOT}assets/logo.webp" alt="Logo Carnicería Buen Novillo" width="62" height="62"><span><small>Carnicería</small><b>Buen Novillo</b></span></a>
    <form class="search" id="search" role="search" action="${ROOT}catalogo/"><input name="q" placeholder="Busca un corte: lomo vetado, entraña..." aria-label="Buscar productos"><button aria-label="Buscar">${I('search',18)}</button></form>
    <div class="hact"><a class="btn btn-wa" href="${waLink('Hola Buen Novillo, quiero hacer una consulta')}" target="_blank" rel="noopener">${I('wa')} WhatsApp</a>
    <button class="cartbtn" id="cartbtn" aria-label="Ver pedido">${I('cart')} <span class="lbl">Mi pedido</span> <span class="n" id="cartn">0</span></button></div>
  </div></header>
  <nav class="nav" aria-label="Categorías"><div class="wrap"><a href="${ROOT}">Inicio</a><a href="${ROOT}catalogo/">Todo el catálogo</a>${cats.map(c=>`<a href="${ROOT}catalogo/?cat=${c.id}">${esc(c.nombre)}</a>`).join('')}<a href="${ROOT}#ubicacion">Cómo llegar</a></div></nav>
  <div class="mnav" id="mnav"><button class="xbtn" id="mclose" aria-label="Cerrar menú">${I('x')}</button><br>
    <a href="${ROOT}">Inicio ${I('chev',18)}</a><a href="${ROOT}catalogo/">Todo el catálogo ${I('chev',18)}</a>${cats.map(c=>`<a href="${ROOT}catalogo/?cat=${c.id}">${esc(c.nombre)} ${I('chev',18)}</a>`).join('')}<a href="${ROOT}#ubicacion">Cómo llegar ${I('chev',18)}</a><a href="${ROOT}enlaces/">Enlaces ${I('chev',18)}</a></div>
  <div class="ov" id="ov"></div>
  <aside class="drawer" id="drawer" aria-label="Resumen del pedido"><div class="dh"><h2>Resumen del pedido</h2><button class="xbtn" id="dclose" aria-label="Cerrar">${I('x')}</button></div>
    <div class="dl" id="dl"></div>
    <div class="df"><div class="row"><span>Productos</span><b id="dcount">0</b></div>
    <p class="note">Los precios se confirman por WhatsApp al preparar tu pedido.</p>
    <input id="dname" placeholder="Tu nombre" aria-label="Tu nombre"><textarea id="dnote" rows="2" placeholder="Comentario: tipo de corte, grosor, hora de retiro..." aria-label="Comentario"></textarea>
    <button class="btn btn-wa" id="send">${I('wa')} Enviar pedido por WhatsApp</button></div></aside>
  <div class="toast" id="toast"></div>`;
  const open=()=>{$('#drawer').classList.add('on');$('#ov').classList.add('on');renderCart()};
  const close=()=>{$$('.drawer,.ov,.mnav').forEach(e=>e.classList.remove('on'))};
  $('#cartbtn').onclick=open;$('#dclose').onclick=close;$('#ov').onclick=close;$('#mclose').onclick=close;
  $('#burger').onclick=()=>{$('#mnav').classList.add('on');$('#ov').classList.add('on')};
  $('#send').onclick=sendOrder; window.openCart=open;
  const q=new URLSearchParams(location.search).get('q'); if(q) $('#search input').value=q;
}
function footer(){
  const cats=DATA.categorias;
  $('#site-foot').innerHTML=`<footer><div class="wrap"><div class="fcols">
   <div class="fbrand"><img src="${ROOT}assets/logo.webp" alt="Carnicería Buen Novillo" width="84" height="84"><p>Carnicería de barrio en Quilicura. Cortes de vacuno, cerdo y pollo.</p></div>
   <div><h3>Categorías</h3><ul>${cats.map(c=>`<li><a href="${ROOT}catalogo/?cat=${c.id}">${esc(c.nombre)}</a></li>`).join('')}</ul></div>
   <div><h3>Visítanos</h3><ul><li>Av. Bernardo O'Higgins 382, Quilicura</li><li>Horario: ${S.horario?esc(S.horario):'<em class="tbd">Por confirmar</em>'}</li><li><a href="${S.mapsUrl}" target="_blank" rel="noopener">Ver en Google Maps</a></li></ul></div>
   <div><h3>Contacto</h3><ul><li>WhatsApp: ${S.whatsapp?esc(S.whatsapp):'<em class="tbd">Por confirmar</em>'}</li><li>Teléfono: ${S.telefono?esc(S.telefono):'<em class="tbd">Por confirmar</em>'}</li><li><a href="${ROOT}enlaces/">Todos nuestros enlaces</a></li></ul></div>
  </div><div class="lokio"><span>© ${new Date().getFullYear()} Carnicería Buen Novillo</span><span>Sitio web creado por <a href="https://lokio.cl" target="_blank" rel="noopener">LOKIO</a></span></div></div></footer>`;
}
function card(p){
  const out=p.stock===false;
  const price=p.precio?`<div class="price">${fmt(p.precio)} <small>/ ${p.unidad}</small>${p.precioAntes?`<s>${fmt(p.precioAntes)}</s>`:''}</div>`:`<div class="price tbd">Precio por confirmar</div>`;
  return `<article class="card"><div class="ph">${p.imagen?`<img src="${esc(p.imagen)}" alt="${esc(p.nombre)}" loading="lazy">`:`<div class="pend">${I('image',30)}Foto pendiente</div>`}${out?'<span class="badge out">Sin stock</span>':(p.precioAntes&&p.precio?`<span class="badge">-${Math.round(100-100*p.precio/p.precioAntes)}%</span>`:'')}</div>
  <div class="cbody"><span class="sub">${esc(p.subcategoria)}</span><h3>${esc(p.nombre)}</h3>${price}
  <div class="buy"><div class="qty" data-id="${p.id}"><button data-d="-1" aria-label="Menos">${I('minus',16)}</button><span data-q>${p.unidad==='kg'?'1 kg':'1 un.'}</span><button data-d="1" aria-label="Más">${I('plus',16)}</button></div>
  <button class="btn btn-red" data-add="${p.id}" ${out?'disabled style="opacity:.5"':''}>${I('cart',18)} Agregar</button></div></div></article>`;
}
const STEP=u=>u==='kg'?0.5:1;
function bindCards(root){
  $$('.qty',root).forEach(q=>{const p=DATA.productos.find(x=>x.id===q.dataset.id);q.dataset.v=1;
    q.onclick=e=>{const b=e.target.closest('button');if(!b)return;let v=+q.dataset.v+STEP(p.unidad)*b.dataset.d;v=Math.max(STEP(p.unidad),v);q.dataset.v=v;$('[data-q]',q).textContent=p.unidad==='kg'?String(v).replace('.',',')+' kg':v+' un.'}});
  $$('[data-add]',root).forEach(b=>b.onclick=()=>{const id=b.dataset.add,q=$(`.qty[data-id="${id}"]`,b.closest('.card'));add(id,+q.dataset.v)});
}
function add(id,qty){const it=cart.find(x=>x.id===id);if(it)it.qty+=qty;else cart.push({id,qty});save();const p=DATA.productos.find(x=>x.id===id);toast(p.nombre+' agregado al pedido')}
function save(){localStorage.setItem('bn_cart',JSON.stringify(cart));$('#cartn').textContent=cart.length;if($('#drawer').classList.contains('on'))renderCart()}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),1800)}
function qtxt(p,q){return p.unidad==='kg'?String(q).replace('.',',')+' kg':q+(q>1?' unidades':' unidad')}
function renderCart(){
  const dl=$('#dl');$('#dcount').textContent=cart.length;
  if(!cart.length){dl.innerHTML=`<div class="empty">${I('cart',34)}<p>Tu pedido está vacío.<br>Agrega cortes desde el catálogo.</p><a class="btn btn-red" href="${ROOT}catalogo/">Ver catálogo</a></div>`;return}
  dl.innerHTML=cart.map((it,i)=>{const p=DATA.productos.find(x=>x.id===it.id);if(!p)return'';return `<div class="li"><div><b>${esc(p.nombre)}</b><br><small>${qtxt(p,it.qty)} · ${p.precio?fmt(p.precio*it.qty):'precio por confirmar'}</small></div><button class="xbtn" data-rm="${i}" aria-label="Quitar ${esc(p.nombre)}">${I('trash',18)}</button></div>`}).join('');
  $$('[data-rm]',dl).forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.rm,1);save()});
}
function sendOrder(){
  if(!cart.length){toast('Agrega al menos un producto');return}
  const lines=cart.map(it=>{const p=DATA.productos.find(x=>x.id===it.id);return p?`• ${p.nombre}: ${qtxt(p,it.qty)}`:''}).filter(Boolean);
  const n=$('#dname').value.trim(),c=$('#dnote').value.trim();
  const txt=`Hola Buen Novillo, quiero hacer este pedido:\n${lines.join('\n')}${c?'\n\nComentario: '+c:''}${n?'\n\nNombre: '+n:''}\n\n¿Me confirman precio total y hora de retiro?`;
  window.open(waLink(txt),'_blank','noopener');
}
function home(){
  const g=$('#cats'); if(g) g.innerHTML=DATA.categorias.map(c=>`<a class="cat" href="${ROOT}catalogo/?cat=${c.id}"><span class="ico">${I(CATICON[c.id]||'knife',34)}</span><b>${esc(c.nombre)}</b><small>${c.subcategorias.slice(0,3).join(' · ')}</small></a>`).join('');
  const d=$('#dest'); if(d){d.innerHTML=DATA.productos.filter(p=>p.destacado).map(card).join('');bindCards(d)}
  const a=$('#asado'); if(a){a.innerHTML=DATA.productos.filter(p=>p.subcategoria==='Cortes de asado').map(card).join('');bindCards(a)}
  const t=$('#horario'); if(t&&S.horario)t.textContent=S.horario;
}
function catalog(){
  const box=$('#catalog'); if(!box)return;
  const sp=new URLSearchParams(location.search),cat=sp.get('cat'),sub=sp.get('sub'),q=(sp.get('q')||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const C=DATA.categorias.find(c=>c.id===cat);
  const link=(c,s)=>`${ROOT}catalogo/?cat=${c}${s?'&sub='+encodeURIComponent(s):''}`;
  $('#side').innerHTML=`<h3>Categorías</h3><a href="${ROOT}catalogo/" class="${!cat?'on':''}">Todo</a>`+DATA.categorias.map(c=>`<a href="${link(c.id)}" class="${cat===c.id&&!sub?'on':''}">${esc(c.nombre)}</a>${cat===c.id?`<div class="subs">${c.subcategorias.map(s=>`<a href="${link(c.id,s)}" class="${sub===s?'on':''}">${esc(s)}</a>`).join('')}</div>`:''}`).join('');
  $('#chips').innerHTML=`<a class="chip ${!cat?'on':''}" href="${ROOT}catalogo/">Todo</a>`+DATA.categorias.map(c=>`<a class="chip ${cat===c.id?'on':''}" href="${link(c.id)}">${esc(c.nombre)}</a>`).join('')+(C?C.subcategorias.map(s=>`<a class="chip ${sub===s?'on':''}" href="${link(C.id,s)}">${esc(s)}</a>`).join(''):'');
  $('#ctitle').textContent=q?`Resultados para “${sp.get('q')}”`:(sub||(C?C.nombre:'Todo el catálogo'));
  if(C) document.title=(sub||C.nombre)+' · Carnicería Buen Novillo';
  let L=DATA.productos.filter(p=>(!cat||p.categoria===cat)&&(!sub||p.subcategoria===sub)&&(!q||(p.nombre+' '+p.subcategoria).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q)));
  box.innerHTML=L.length?L.map(card).join(''):`<div class="empty" style="grid-column:1/-1">No encontramos ese corte. Escríbenos por WhatsApp y te lo buscamos.</div>`;
  $('#ccount').textContent=L.length+' productos'; bindCards(box);
}
function popup(){const p=DATA.popup;if(!p||!p.activo||sessionStorage.getItem('bn_pop'))return;sessionStorage.setItem('bn_pop',1);
  const d=document.createElement('div');d.className='ov on';d.style.display='grid';d.style.placeItems='center';d.innerHTML=`<div style="background:#fff;border-radius:24px;padding:26px;max-width:360px;margin:20px;text-align:center"><h2>${esc(p.titulo)}</h2><p>${esc(p.texto)}</p><button class="btn btn-red">Entendido</button></div>`;d.onclick=e=>{if(e.target===d||e.target.tagName==='BUTTON')d.remove()};document.body.appendChild(d)}
load().then(d=>{DATA=d;header();footer();home();catalog();$('#cartn').textContent=cart.length;popup();document.dispatchEvent(new Event('bn:ready'))});
})();
