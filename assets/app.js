
const root=document.documentElement;
const saved=localStorage.getItem("reader-font-size");
if(saved)root.style.setProperty("--font-size",saved+"px");
document.querySelectorAll("[data-font]").forEach(btn=>btn.addEventListener("click",()=>{
  const current=parseInt(getComputedStyle(root).getPropertyValue("--font-size"))||19;
  const next=Math.max(16,Math.min(28,current+Number(btn.dataset.font)));
  root.style.setProperty("--font-size",next+"px");localStorage.setItem("reader-font-size",next);
}));
const search=document.querySelector("#search");
if(search)search.addEventListener("input",()=>{
  const q=search.value.trim().toLowerCase();let shown=0;
  const results=document.querySelector(".search-results");
  document.querySelectorAll(".search-results .article-link").forEach(link=>{const ok=!!q&&link.dataset.search.includes(q);link.hidden=!ok;if(ok)shown++;});
  if(results)results.classList.toggle("active",!!q);
  const empty=document.querySelector(".empty");if(empty)empty.style.display=q&&!shown?"block":"none";
});
if("serviceWorker" in navigator)window.addEventListener("load",()=>{const nested=location.pathname.includes("/articles/")||location.pathname.includes("/categories/");navigator.serviceWorker.register(nested?"../sw.js":"./sw.js").catch(()=>{});});
