// Persuadir Entregas: guarda o app para abrir mesmo com internet fraca.
const C="pe-v14", ARQS=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-monochrome.png","favicon-32.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(ARQS)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET") return;
  if(u.origin===location.origin){ // app: rede primeiro, cópia guardada se offline
    e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return r; }).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
  } else if(["www.gstatic.com","unpkg.com","fonts.gstatic.com","fonts.googleapis.com"].includes(u.hostname)){ // Firebase, mapa, fontes e ícones
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{ const cp=x.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return x; })));
  }
});

// Toque no aviso abre (ou traz para frente) o app
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>{ const w=l.find(c=>"focus" in c); return w?w.focus():self.clients.openWindow("./"); }));
});
