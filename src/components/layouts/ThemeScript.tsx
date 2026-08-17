/**
 * Applies the stored theme before the first paint.
 *
 * Without this the document paints with the default (light) palette and only
 * flips once React has hydrated — a visible flash on every full page load,
 * including every language switch. The logic mirrors `HeaderActions`; keep the
 * two in step.
 */
const script = `(function(){try{
var d=document.documentElement,s=localStorage;
var m=s.getItem('mode');
if(m!=='dark'&&m!=='light'){m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
d.classList.toggle('dark',m==='dark');
var c=s.getItem('color-theme')||'black-white';
d.setAttribute('data-theme',c);
if(c==='custom'){
var hex=s.getItem('custom-primary')||'#000000';
var f=m==='dark'?1.3:1;
var adj=function(h,k){var p=function(i){return parseInt(h.slice(i,i+2),16)/255;};
var v=[p(1),p(3),p(5)].map(function(x){return Math.round(Math.min(1,Math.max(0,x*k))*255);});
return '#'+v.map(function(x){return x.toString(16).padStart(2,'0');}).join('');};
var rgb=function(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)].join(',');};
var pr=adj(hex,f);
d.style.setProperty('--primary',pr);
d.style.setProperty('--primary-rgb',rgb(pr));
d.style.setProperty('--blob1',pr);
d.style.setProperty('--blob2',adj(hex,0.7*f));
d.style.setProperty('--blob3',adj(hex,1.2*f));
}
}catch(e){}})();`;

export default function ThemeScript() {
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
