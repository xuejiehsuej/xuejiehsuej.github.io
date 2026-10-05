export class ScrubMotion {
 constructor(count,position=0){this.max=count-1;this.position=position;this.target=position;}
 get index(){return Math.round(this.position)}
 get busy(){return false}
 go(value){if(Number.isFinite(value))this.target=Math.max(0,Math.min(this.max,value));}
 push(delta){if(Number.isFinite(delta))this.go(this.target+delta*.0017);}
 step(seconds){this.position+=(this.target-this.position)*(1-Math.exp(-Math.min(seconds,.05)*13));if(Math.abs(this.position-this.target)<.001)this.position=this.target;return this.position;}
}
