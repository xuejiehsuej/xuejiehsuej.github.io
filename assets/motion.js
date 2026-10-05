export class SceneController {
  constructor(count, transition) { this.count=count; this.transition=transition; this.index=0; this.busy=false; this.pending=null; }
  async go(next) {
    if(!Number.isInteger(next)||next<0||next>=this.count)return;
    if(this.busy){this.pending=next;return;}
    if(next===this.index)return;
    this.busy=true;
    try {
      let target=next;
      while(target!==null&&target!==this.index){
        this.pending=null;
        await this.transition(this.index,target);
        this.index=target;target=this.pending;
      }
    } finally {this.busy=false;this.pending=null;}
  }
}
export const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
export const animate=(element,frames,options={})=>{
  if(!element)return Promise.resolve();
  const animation=element.animate(frames,{duration:reduced()?1:700,easing:'cubic-bezier(.22,1,.36,1)',...options,...(reduced()?{duration:1,delay:0}:{})});
  return animation.finished.catch(()=>{});
};
