window.BNAuth={async check(pw){const b=new TextEncoder().encode(pw);const h=await crypto.subtle.digest('SHA-256',b);return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('')===(localStorage.getItem('bn_pass_hash')||SITE.adminHash)},
async set(pw){const h=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(pw));localStorage.setItem('bn_pass_hash',[...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join(''))},
ok(){return sessionStorage.getItem('bn_auth')==='1'},login(){sessionStorage.setItem('bn_auth','1')}};
