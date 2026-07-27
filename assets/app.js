
const root=document.documentElement;
const saved=localStorage.getItem("reader-font-size");
if(saved)root.style.setProperty("--font-size",saved+"px");
document.querySelectorAll("[data-font]").forEach(btn=>btn.addEventListener("click",()=>{
  const current=parseInt(getComputedStyle(root).getPropertyValue("--font-size"))||19;
  const next=Math.max(16,Math.min(28,current+Number(btn.dataset.font)));
  root.style.setProperty("--font-size",next+"px");localStorage.setItem("reader-font-size",next);
}));
const daily=document.querySelector("#daily-feature");
const articleData=document.querySelector("#article-data");
if(daily&&articleData){
  try{
    const items=JSON.parse(articleData.textContent);
    const now=new Date();
    const dateKey=now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate();
    let hash=2166136261;
    for(const char of dateKey){hash^=char.charCodeAt(0);hash=Math.imul(hash,16777619);}
    const chosen=items[(hash>>>0)%items.length];
    daily.href="articles/"+chosen.slug+".html";
    daily.querySelector(".daily-title").textContent=chosen.id+" "+chosen.title;
    daily.querySelector(".daily-meta").textContent="主題 "+chosen.chapter+"・"+chosen.category;
    daily.hidden=false;
  }catch{}
}
const search=document.querySelector("#search");
if(search)search.addEventListener("input",()=>{
  const q=search.value.trim().toLowerCase();let shown=0;
  const results=document.querySelector(".search-results");
  document.querySelectorAll(".search-results .article-link").forEach(link=>{const ok=!!q&&link.dataset.search.includes(q);link.hidden=!ok;if(ok)shown++;});
  if(results)results.classList.toggle("active",!!q);
  const empty=document.querySelector(".empty");if(empty)empty.style.display=q&&!shown?"block":"none";
});
if("serviceWorker" in navigator)window.addEventListener("load",()=>{const nested=location.pathname.includes("/articles/")||location.pathname.includes("/categories/");navigator.serviceWorker.register(nested?"../sw.js":"./sw.js").catch(()=>{});});
