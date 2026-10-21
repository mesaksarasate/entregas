// Persuadir Entregas (versão antiga, encerrada): apaga a cópia guardada e se desliga.
self.addEventListener("install",e=>{ self.skipWaiting(); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>!k.startsWith("pe-app")).map(k=>caches.delete(k))))
  .then(()=>self.registration.unregister()).then(()=>self.clients.matchAll({type:"window"})).then(cs=>cs.forEach(c=>{ try{ c.navigate(c.url); }catch(e){} }))); });
