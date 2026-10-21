// Iconos SVG de línea (estilo Lucide), stroke = currentColor
window.ICON = (function(){
const w=(p,s)=>`<svg class="ic" width="${s||22}" height="${s||22}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const P={
cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.6l2.2 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21.5 7H6"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
pin:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
phone:'<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L14 12l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
truck:'<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
knife:'<path d="M3 21 14.5 9.5M14.5 9.5l5-5.5a1.5 1.5 0 0 1 2 2.1L16 12z"/><path d="m10 14 2 2"/>',
flame:'<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-1.5 2-2 3.5-2 5-1.5-1-2.5-3-2.5-5C7 8 5 11 5 15a7 7 0 0 0 7 7z"/>',
cow:'<path d="M5 6c-1.5 0-3 1-3 2.5S3.5 10 5 10M19 6c1.5 0 3 1 3 2.5S20.5 10 19 10"/><path d="M6 5c1.5-1.2 3.6-2 6-2s4.5.8 6 2v7a6 6 0 0 1-12 0z"/><ellipse cx="12" cy="16" rx="3.5" ry="2.5"/><path d="M10.6 16h.01M13.4 16h.01"/>',
pig:'<path d="M19 11c1-1 2-1 2-1v4h-1.5a7 7 0 0 1-2.5 3V20h-3v-2h-4v2H7v-3a6 6 0 0 1-3-5 6.5 6.5 0 0 1 6.5-6.5H14A6 6 0 0 1 19 11z"/><path d="M15.5 10h.01"/>',
bird:'<path d="M16 7h.01M3.5 18H11a8 8 0 0 0 8-8V7a4 4 0 0 0-7.3-2.2L2 18.5"/><path d="m20 7 2 .5-2 .5M10 18v3M14 17.7V21"/>',
box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>',
menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 9"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
grid:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
chev:'<path d="m9 6 6 6-6 6"/>', back:'<path d="m15 6-6 6 6 6"/>',
check:'<path d="m5 12 5 5 9-10"/>', help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>'
};
const WA='<svg class="ic" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7A11.8 11.8 0 0 0 24 12c0-3.2-1.2-6.1-3.6-8.4z"/></svg>';
const f=(n,s)=>n==='wa'?WA:w(P[n]||'',s); return f;})();
