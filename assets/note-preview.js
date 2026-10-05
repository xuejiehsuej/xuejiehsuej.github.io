// Hover previews are temporary; clicks explicitly pin or close a note.
export function bindNotePreviews(root){
 const entries=[...root.querySelectorAll('.life-note')].map(note=>({note,summary:note.querySelector('summary'),pinned:false,timer:0}));
 function anchored(entry,change){const y=entry.summary.getBoundingClientRect().top;change();root.scrollTop+=entry.summary.getBoundingClientRect().top-y}
 entries.forEach(entry=>{
  const {note,summary}=entry;
  summary.addEventListener('pointerenter',e=>{
   if(e.pointerType!=='mouse'||!matchMedia('(hover:hover)').matches)return;
   entries.forEach(x=>clearTimeout(x.timer));
   anchored(entry,()=>{note.dataset.preview=String(!entry.pinned);note.open=true;entries.forEach(x=>{if(x!==entry&&!x.pinned){x.note.open=false;x.note.dataset.preview='false'}})});
  });
  note.addEventListener('pointerenter',()=>clearTimeout(entry.timer));
  note.addEventListener('pointerleave',()=>{entry.timer=setTimeout(()=>{if(!entry.pinned)anchored(entry,()=>{note.open=false;note.dataset.preview='false'})},160)});
  summary.addEventListener('click',e=>{e.preventDefault();clearTimeout(entry.timer);anchored(entry,()=>{entry.pinned=!entry.pinned;note.dataset.preview='false';note.open=entry.pinned;note.dataset.pinned=String(entry.pinned)})});
 });
}
