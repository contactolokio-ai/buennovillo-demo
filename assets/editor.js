/* Editor de contenido /#editor (port vanilla, demo estática: publica en localStorage; en producción conectar a backend/Functions) */
(function(){
const KEY='bn_content',DRAFT='bn_content_draft';
const page=location.pathname;
function apply(map){if(!map)return;const m=map[page]||{};Object.entries(m).forEach(([k,v])=>{const t=document.querySelector(`[data-edit-text="${k}"]`);if(t&&v.t!=null)t.innerHTML=v.t;const i=document.querySelector(`[data-edit-img="${k}"]`);if(i&&v.i)i.src=v.i;const b=document.querySelector(`[data-edit-bg="${k}"]`);if(b&&v.b)b.style.backgroundImage=`url(${v.b})`})}
function get(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return{}}}
apply(get(KEY));
if(location.hash!=='#editor')return;
const css=`.edbar{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:100;background:#141414;color:#fff;border-radius:999px;padding:8px;display:flex;gap:6px;box-shadow:0 10px 30px rgba(0,0,0,.3);flex-wrap:wrap;justify-content:center;max-width:calc(100% - 20px)}
.edbar button{background:#2a2a2a;color:#fff;border-radius:999px;padding:10px 14px;font-weight:600;font-size:14px}.edbar .pub{background:#DE2329}
body.ed [data-edit-text]{outline:2px dashed rgba(222,35,41,.6);outline-offset:3px;border-radius:6px}body.ed [data-edit-img],body.ed [data-edit-bg]{outline:3px dashed #DE2329;cursor:pointer}
body.ed.pv [data-edit-text],body.ed.pv [data-edit-img]{outline:0}
.edm{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:110;display:grid;place-items:center}.edm>div{background:#fff;color:#141414;border-radius:24px;padding:26px;max-width:380px;margin:16px;display:flex;flex-direction:column;gap:12px}
.edm input{border:1px solid #ddd;border-radius:14px;padding:12px;font:inherit}.edm button{background:#DE2329;color:#fff;border-radius:999px;padding:12px;font-weight:700}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
function modal(html){const m=document.createElement('div');m.className='edm';m.innerHTML='<div>'+html+'</div>';document.body.appendChild(m);return m}
function login(){if(BNAuth.ok())return start();const m=modal('<h2>Editar web</h2><p>Ingresa la contraseña (la misma del panel admin).</p><input type="password" id="edpw" placeholder="Contraseña"><button id="edgo">Entrar</button><p id="ederr" style="color:#DE2329;margin:0"></p>');
 const go=async()=>{if(await BNAuth.check(m.querySelector('#edpw').value)){BNAuth.login();m.remove();start()}else m.querySelector('#ederr').textContent='Contraseña incorrecta'};m.querySelector('#edgo').onclick=go;m.querySelector('#edpw').onkeydown=e=>{if(e.key==='Enter')go()}}
let hist=[],fut=[];
function snap(){const o={};document.querySelectorAll('[data-edit-text]').forEach(e=>o[e.dataset.editText]={t:e.innerHTML});document.querySelectorAll('[data-edit-img]').forEach(e=>{o[e.dataset.editImg]=Object.assign(o[e.dataset.editImg]||{},{i:e.src})});return o}
function restore(o){Object.entries(o).forEach(([k,v])=>{const t=document.querySelector(`[data-edit-text="${k}"]`);if(t&&v.t!=null)t.innerHTML=v.t;const i=document.querySelector(`[data-edit-img="${k}"]`);if(i&&v.i)i.src=v.i})}
function saveDraft(){const d=get(DRAFT);d[page]=snap();localStorage.setItem(DRAFT,JSON.stringify(d))}
function push(){hist.push(snap());if(hist.length>60)hist.shift();fut=[]}
function toWebp(file,cb){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,1600/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/webp',.82))};im.src=r.result};r.readAsDataURL(file)}
function start(){
 document.body.classList.add('ed');apply(get(DRAFT));push();
 document.querySelectorAll('[data-edit-text]').forEach(e=>{e.contentEditable='true';e.addEventListener('focus',push);e.addEventListener('input',saveDraft);e.addEventListener('click',ev=>{if(e.closest('a'))ev.preventDefault()})});
 document.querySelectorAll('[data-edit-img]').forEach(e=>e.addEventListener('click',ev=>{ev.preventDefault();const f=document.createElement('input');f.type='file';f.accept='image/*';f.onchange=()=>toWebp(f.files[0],u=>{push();e.src=u;saveDraft()});f.click()}));
 const bar=document.createElement('div');bar.className='edbar';bar.innerHTML='<button data-a="undo">Deshacer</button><button data-a="redo">Rehacer</button><button data-a="pv">Vista previa</button><button data-a="pub" class="pub">Publicar</button><button data-a="tour">Ayuda</button><button data-a="exit">Salir</button>';document.body.appendChild(bar);
 bar.onclick=e=>{const a=e.target.dataset.a;if(!a)return;
  if(a==='undo'&&hist.length){fut.push(snap());restore(hist.pop());saveDraft()}
  if(a==='redo'&&fut.length){hist.push(snap());restore(fut.pop());saveDraft()}
  if(a==='pv'){document.body.classList.toggle('pv');e.target.textContent=document.body.classList.contains('pv')?'Seguir editando':'Vista previa'}
  if(a==='pub'){const p=get(KEY);p[page]=snap();localStorage.setItem(KEY,JSON.stringify(p));const m=modal('<h2>¡Publicado!</h2><p>Tus cambios quedaron guardados.</p><button>Listo</button>');m.querySelector('button').onclick=()=>m.remove()}
  if(a==='tour')tour(0);
  if(a==='exit'){location.hash='';location.reload()}};
 if(!localStorage.getItem('bn_tour'))tour(0);
}
const STEPS=['Bienvenido al editor. Los textos con borde punteado se pueden cambiar: tócalos y escribe.','Las fotos con borde rojo se cambian tocándolas y eligiendo una imagen de tu celular.','Usa Deshacer y Rehacer si te equivocas. Tus cambios se guardan como borrador solos.','Cuando esté listo, toca Publicar. Salir te devuelve a la web normal.'];
function tour(i){const m=modal(`<b style="color:#DE2329">Paso ${i+1} de ${STEPS.length}</b><p>${STEPS[i]}</p><button>${i<STEPS.length-1?'Siguiente':'Empezar'}</button>`);m.querySelector('button').onclick=()=>{m.remove();if(i<STEPS.length-1)tour(i+1);else localStorage.setItem('bn_tour','1')}}
const s=document.createElement('script');s.src=(document.body.dataset.root||'/')+'assets/auth.js?v=2';s.onload=()=>login();document.head.appendChild(s);
})();
