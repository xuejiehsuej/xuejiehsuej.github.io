// Animate the existing artwork in texture space so the composition stays fixed.
export function startHeroFlow(){
 const background=document.querySelector('.universe-image');
 document.addEventListener('visibilitychange',()=>{background.style.animationPlayState=document.hidden?'paused':'running';});
 if(document.body.dataset.page!=='index')return;
 const host=document.querySelector('.universe-image'),canvas=document.createElement('canvas');
 canvas.className='hero-flow';canvas.setAttribute('aria-hidden','true');
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
 if(!gl)return;
 const vertex='attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
 const fragment=`precision mediump float;
 varying vec2 uv;uniform sampler2D art;uniform vec2 viewport;uniform vec2 imageSize;uniform float time;
 void main(){
  float ia=imageSize.x/imageSize.y;float va=viewport.x/viewport.y;
  vec2 crop=vec2(min(1.,va/ia),min(1.,ia/va));
  float anchor=viewport.x<760.? .62:.5;
  vec2 q=(vec2(uv.x,1.-uv.y)-.5)*crop+vec2(anchor+( .5-anchor)*crop.x,.5);
  vec2 d=(q-vec2(.85,.46))*vec2(ia,1.);float r=length(d);
  float ring=smoothstep(.215,.28,r)*(1.-smoothstep(.42,.63,r));
  float band=(1.-smoothstep(.035,.15,abs(q.y-(1.01-.60*q.x))))*smoothstep(.25,.62,q.x);
  vec2 tangent=vec2(-d.y,d.x)/max(r,.01)/vec2(ia,1.);
  vec2 flow=mix(tangent*.035,vec2(-.042,.025),band);
  float mask=max(ring,band)*smoothstep(.30,.55,q.x);
  float phase=fract(time/14.);float second=fract(phase+.5);
  vec3 a=texture2D(art,clamp(q-flow*phase*mask,0.,1.)).rgb;
  vec3 b=texture2D(art,clamp(q-flow*second*mask,0.,1.)).rgb;
  float blend=abs(phase*2.-1.);
  vec3 flowing=mix(a,b,blend);vec3 base=texture2D(art,q).rgb;
  float gleam=sin(atan(d.y,d.x)*5.-time*.45+r*19.)*.065*ring;
  gl_FragColor=vec4(mix(base,flowing,mask)*(1.+gleam),1.);
 }`;
 const program=gl.createProgram();
 for(const [type,source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]){
  const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
  if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))return;
  gl.attachShader(program,shader);
 }
 gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const attr=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 const clock=gl.getUniformLocation(program,'time'),size=gl.getUniformLocation(program,'viewport');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let ready=false,visible=true,raf=0,last=0,elapsed=0;
 function resize(){const scale=Math.min(1,1440/innerWidth);canvas.width=Math.round(innerWidth*scale);canvas.height=Math.round(innerHeight*scale);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(size,innerWidth,innerHeight);}
 function frame(now){raf=0;if(!ready||document.hidden||!visible||reduced.matches)return;
  if(now-last>=1000/30){elapsed+=Math.min((now-last)/1000,.1);last=now;gl.uniform1f(clock,elapsed);gl.drawArrays(gl.TRIANGLES,0,6);canvas.dataset.frame=String(Math.round(elapsed*30));}
  raf=requestAnimationFrame(frame);
 }
 function sync(){canvas.hidden=reduced.matches;host.classList.toggle('flow-ready',ready&&!reduced.matches);cancelAnimationFrame(raf);raf=0;last=performance.now();if(ready&&!document.hidden&&visible&&!reduced.matches)raf=requestAnimationFrame(frame);}
 const img=new Image();img.onload=()=>{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);gl.uniform2f(gl.getUniformLocation(program,'imageSize'),img.width,img.height);resize();host.append(canvas);ready=true;sync();};img.src=new URL('./blackhole.png',import.meta.url).href;
 window.addEventListener('resize',resize);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 new IntersectionObserver(entries=>{visible=entries[0].intersectionRatio>.3;sync();},{threshold:[0,.3]}).observe(document.querySelector('.home-hero'));
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;canvas.hidden=true;host.classList.remove('flow-ready');cancelAnimationFrame(raf);});
}
