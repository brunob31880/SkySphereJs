(this.webpackJsonpskyspherejs=this.webpackJsonpskyspherejs||[]).push([[0],{50:function(e,t,n){},51:function(e,t,n){},58:function(e,t,n){},59:function(e,t,n){},60:function(e,t,n){"use strict";n.r(t);var o=n(2),r=n.n(o),a=n(37),i=n.n(a),c=(n(50),n(10)),s=(n(51),n(22)),l=n(5),u=n(12),d=n(8);var f=function(){var e=Object(o.useRef)(),t=Object(u.k)(),n=t.camera,r=(t.gl,t.size,Object(o.useState)(null)),a=Object(c.a)(r,2),i=a[0],s=a[1];return Object(o.useEffect)((function(){(new l.FontLoader).load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",(function(e){console.log("Police charg\xe9e"),s(e)}))}),[]),Object(o.useEffect)((function(){if(i){!function(){for(var t=e.current.children.length-1;t>=0;t--){var n=e.current.children[t];e.current.remove(n),n.geometry&&n.geometry.dispose(),n.material&&n.material.dispose()}}();for(var t=new l.LineDashedMaterial({color:6836047,dashSize:10,gapSize:5}),o=new l.LineDashedMaterial({color:6836047,dashSize:10,gapSize:5}),r=function(e){for(var t=new l.BufferGeometry,n=new Float32Array(195),o=0;o<=64;o++){var r=o/64*Math.PI*2;n[3*o]=e*Math.cos(r),n[3*o+1]=0,n[3*o+2]=e*Math.sin(r)}return t.setAttribute("position",new l.BufferAttribute(n,3)),t},a=0;a<360;a+=10){var c=r(1e3);c.rotateZ(l.MathUtils.degToRad(90)),c.rotateY(l.MathUtils.degToRad(a));var s=new l.Line(c,t);s.computeLineDistances(),s.layers.set(1),e.current.add(s);var u=30/n.zoom,d=new l.TextGeometry(String(a),{font:i,size:u,height:5,curveSegments:12,bevelEnabled:!1}),f=new l.MeshBasicMaterial({color:6836047}),h=new l.Mesh(d,f);h.position.x=1e3*Math.cos(l.MathUtils.degToRad(a)),h.position.z=1e3*Math.sin(l.MathUtils.degToRad(a)),h.position.y=0,h.lookAt(0,0,0),e.current.add(h)}for(var m=-90;m<90;m+=10){var b=r(1e3*Math.cos(l.MathUtils.degToRad(m))),v=new l.Line(b,o);v.translateY(1e3*Math.sin(l.MathUtils.degToRad(m))),v.computeLineDistances(),v.layers.set(1),e.current.add(v);var g=30/n.zoom,p=new l.TextGeometry(String(m),{font:i,size:g,height:5,curveSegments:12,bevelEnabled:!1}),j=new l.MeshBasicMaterial({color:6836047}),O=new l.Mesh(p,j);O.position.x=1e3*Math.cos(l.MathUtils.degToRad(m)),O.position.y=1e3*Math.sin(l.MathUtils.degToRad(m)),O.position.z=0,O.lookAt(0,0,0),e.current.add(O)}}}),[n.zoom,i]),Object(d.jsx)("group",{ref:e})};var h=function(){var e=Object(o.useRef)();return Object(o.useEffect)((function(){e.current&&(e.current.renderOrder=1)}),[]),Object(d.jsxs)("mesh",{ref:e,rotation:[-Math.PI/2,0,0],children:[Object(d.jsx)("ringBufferGeometry",{attach:"geometry",args:[0,1e3,64]}),Object(d.jsx)("meshBasicMaterial",{attach:"material",color:16777215,side:l.DoubleSide,transparent:!0,opacity:.1,depthWrite:!1})]})},m=n(62),b=n(11),v=n(13),g=n(9),p=n(15),j=n(21),O=function(e){return e*(Math.PI/180)},x=function(e,t,n){return O(function(e,t,n){return 15*(e+t/60+n/3600)}(e,t,n))},w=function(e,t,n){return O(function(e,t,n){return e+t/60+n/3600}(e,t,n))};function y(e){return e*(180/Math.PI)}var M=n(24);var E=function(e,t,n){var o=Object(M.a)(e),r=Object(M.a)(t),a=Object(M.a)(n),i=Math.asin(Math.sin(a)*Math.sin(o)+Math.cos(a)*Math.cos(o)*Math.cos(r));return{azimuth:Math.atan2(-Math.cos(o)*Math.cos(a)*Math.sin(r),Math.sin(o)-Math.sin(a)*Math.sin(i)),altitude:i}};function S(e,t,n,o){var r=(new l.Vector3).subVectors(e,n),a=t.dot(t),i=2*r.dot(t),c=i*i-4*a*(r.dot(r)-o*o);if(c<0)return null;var s=(-i-Math.sqrt(c))/(2*a),u=(-i+Math.sqrt(c))/(2*a),d=s>0?s:u;return new l.Vector3(e.x+d*t.x,e.y+d*t.y,e.z+d*t.z)}var z=r.a.createContext();function A(e){var t,n=e.children,r=Object(o.useState)(!1),a=Object(c.a)(r,2),i=a[0],s=a[1],l=Object(o.useState)({alpha:0,beta:0,gamma:0}),u=Object(c.a)(l,2),f=u[0],h=u[1],m=Object(o.useState)("Equatorial"),O=Object(c.a)(m,2),M=O[0],S=O[1],A=Object(o.useState)("Oui"),C=Object(c.a)(A,2),L=C[0],k=C[1],D=Object(o.useState)(new Date),R=Object(c.a)(D,2),N=R[0],F=R[1],I=Object(o.useState)({latitude:null,longitude:null}),T=Object(c.a)(I,2),V=T[0],P=T[1],B=Object(o.useState)(null),G=Object(c.a)(B,2),H=G[0],U=G[1],W=Object(o.useState)(null),Y=Object(c.a)(W,2),_=Y[0],q=Y[1],X=Object(o.useState)({}),J=Object(c.a)(X,2),Q=J[0],Z=(J[1],Object(o.useState)(6)),K=Object(c.a)(Z,2),$=K[0],ee=K[1],te=Object(o.useState)([]),ne=Object(c.a)(te,2),oe=ne[0],re=ne[1],ae=Object(o.useState)(!1),ie=Object(c.a)(ae,2),ce=ie[0],se=ie[1],le=1e3;Object(o.useEffect)((function(){navigator.geolocation?navigator.geolocation.getCurrentPosition((function(e){var t=e.coords.latitude,n=e.coords.longitude;fetch("https://nominatim.openstreetmap.org/reverse?format=json&lat=".concat(t,"&lon=").concat(n,"&zoom=10")).then((function(e){return e.json()})).then((function(e){var o=e.address.city||e.address.town||e.address.village;P({latitude:t,longitude:n,cityName:o})})).catch((function(e){console.error("Erreur lors de la r\xe9cup\xe9ration du nom de la ville:",e)}))}),(function(e){console.error("Erreur de g\xe9olocalisation:",e)})):console.error("G\xe9olocalisation non support\xe9e par ce navigateur.")}),[]),Object(o.useEffect)((function(){var e=document.createElement("button");function t(e){var t=e.alpha,n=e.beta,o=e.gamma;h({alpha:t,beta:n,gamma:o})}return e.style.display="none",document.body.appendChild(e),e.addEventListener("click",Object(j.a)(Object(p.a)().mark((function e(){return Object(p.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!DeviceOrientationEvent.requestPermission){e.next=7;break}return e.next=3,DeviceOrientationEvent.requestPermission();case 3:"granted"===e.sent&&window.addEventListener("deviceorientation",t),e.next=8;break;case 7:window.addEventListener("deviceorientation",t);case 8:case"end":return e.stop()}}),e)})))),e.click(),function(){window.removeEventListener("deviceorientation",t),document.body.removeChild(e)}}),[]),Object(o.useEffect)((function(){var e=setInterval((function(){F(new Date)}),1e3);return function(){return clearInterval(e)}}),[]);return Object(o.useEffect)((function(){if(H&&V.latitude&&V.longitude){console.log("Calcul des coordonn\xe9es horizontales"),console.time("Calcul des coordonn\xe9es horizontales");var e=1/0,t=-1/0,n=1/0,o=-1/0,r=[],a=[];H.raDec.forEach((function(i){var c=i.ra,s=i.dec,l=function(e){for(var t=280.16+(new Date-new Date(Date.UTC(2e3,0,1,12)))/864e5*360.9856235,n=(t%=360)+e;n<0;)n+=360;for(;n>360;)n-=360;return n}(V.longitude),u=y(c),d=y(s),f=function(e,t){for(var n=e-t;n>=360;)n-=360;for(;n<0;)n+=360;return n}(l,u),h=E(d,f,V.latitude),m=h.azimuth,b=h.altitude;m<e&&(e=m),m>t&&(t=m),b<n&&(n=b),b>o&&(o=b),r.push({azimuth:m,altitude:b});var v=le*Math.cos(b)*Math.cos(m),g=le*Math.cos(b)*Math.sin(m),p=le*Math.sin(b);a.push(v,p,g)})),console.log("Azimuth Range:",e,"-",t),console.log("Altitude Range:",n,"-",o),console.timeEnd("Calcul des coordonn\xe9es horizontales"),q(a),U(Object(g.a)(Object(g.a)({},H),{},{horizontalCoords:a,altAzArray:r}))}}),[ce,V]),Object(o.useEffect)((function(){Promise.all([fetch("".concat("/SkySphereJs","/datas/hip.tsv")).then((function(e){return e.text()})),fetch("".concat("/SkySphereJs","/datas/constellation_line_hip.csv")).then((function(e){return e.text()})),fetch("".concat("/SkySphereJs","/datas/ident4.csv")).then((function(e){return e.text()})),fetch("".concat("/SkySphereJs","/datas/constellation_abbr\xe9viations.csv")).then((function(e){return e.text()}))]).then((function(e){var t=Object(c.a)(e,4),n=t[0],o=t[1],r=t[2],a=t[3],i=1/0,s=-1/0,l=1/0,u=-1/0,d=n.split("\n").filter((function(e){return!e.startsWith("#")&&""!==e.trim()})),f=[],h=[],m=[],g=[],p=d.map((function(e){return parseInt(e.split("|")[0])})).sort((function(e,t){return e-t})),j=Array.from({length:118322},(function(e,t){return t+1})).filter((function(e){return!p.includes(e)}));console.log("Missing HIP numbers:",j),d.forEach((function(e,t){var n=e.split("|"),o=parseInt(n[0],10);Q[o]=t;var r=n[1].split(/\s+/).map((function(e){return parseFloat(e)})),a=n[2].split(/\s+/).map((function(e){return parseFloat(e)})),c=x.apply(void 0,Object(v.a)(r)),d=w.apply(void 0,Object(v.a)(a)),b=parseFloat(n[3]);c<i&&(i=c),c>s&&(s=c),d<l&&(l=d),d>u&&(u=d),isNaN(b)?console.error("Invalid magnitude value:",n[3]):m.push(b);var p=le*Math.cos(d)*Math.cos(c),j=le*Math.cos(d)*Math.sin(c),O=le*Math.sin(d);if(11767===o&&console.log("Etoile polaire: X="+p+" Y="+O+" Z="+j+" "),isNaN(p)||isNaN(O)||isNaN(j)?console.error("Problem with HIP="+n[0]):(f.push(p,O,j),h.push(o),g.push({ra:c,dec:d})),f.length/3!==m.length)throw console.error("Mismatch detected at line index:",t),console.error("Line content:",e),new Error("Mismatch in data arrays")})),console.log("Nb \xe9toiles:"+m.length),console.log("RA Range:",i,"-",s),console.log("DEC Range:",l,"-",u);var O=m.filter((function(e){return!isNaN(e)})).reduce((function(e,t){return{minMagnitude:Math.min(e.minMagnitude,t),maxMagnitude:Math.max(e.maxMagnitude,t)}}),{minMagnitude:1/0,maxMagnitude:-1/0}),y=O.minMagnitude,M=O.maxMagnitude;console.log("Magnitude Range:",y,"-",M);var E={};r.split("\n").filter((function(e){return""!==e.trim()})).forEach((function(e){var t=e.split("|"),n=t[0].trim();n.startsWith('"')&&(n=n.substring(1)),n.endsWith('"')&&(n=n.substring(0,n.length-1));var o=parseInt(t[1].trim(),10);isNaN(o)||(E[o]=n)})),console.log("Premi\xe8res valeurs de raDecArray:",g.slice(0,10));var S=Object(b.a)({vertices:f,magnitudes:m,hipToIndex:Q,hipparcosIds:h,identStars:E,raDec:g},"magnitudes",m);U(S);var z={};a.split("\n").filter((function(e){return""!==e.trim()})).forEach((function(e){var t=e.split(",");z[t[0]]={fullName:t[1],description:t[2]}}));var A=o.split("\n").filter((function(e){return!e.startsWith("#")&&""!==e.trim()})).map((function(e){var t=e.split(",");return{abbreviation:t[0],group:t[1],abbreviationGroup:t[2],startStar:parseInt(t[3]),endStar:parseInt(t[4]),fullName:z[t[0]]?z[t[0]].fullName:"",description:z[t[0]]?z[t[0]].description:""}}));re(A),se(!0)}))}),[]),Object(d.jsx)(z.Provider,{value:(t={orientation:f,isDebugEnabled:i,setIsDebugEnabled:s,isLoaded:ce,shownConstellations:L,toggleShownConstellations:function(){k("Oui"===L?"Non":"Oui")},maxShownMagnitude:$,setMaxShownMagnitude:ee,starsData:H,setStarsData:U,representation:M,setRepresentation:S,currentTime:N,location:V,toggleRepresentation:function(){S("Equatorial"===M?"Horizontal":"Equatorial")},constellationLines:oe},Object(b.a)(t,"isLoaded",ce),Object(b.a)(t,"horizontalCoords",_),Object(b.a)(t,"setHorizontalCoords",q),t),children:n})}var C=n(42),L=n.n(C);var k=function(){var e=Object(o.useState)({x:0,y:0}),t=Object(c.a)(e,2),n=t[0],r=t[1],a=Object(o.useState)(!1),i=Object(c.a)(a,2),s=i[0],f=i[1],h=Object(o.useContext)(z),b=h.isDebugEnabled,v=(h.isLoaded,Object(u.k)()),g=v.camera,p=v.gl;v.size,Object(o.useEffect)((function(){function e(e){if(e.preventDefault(),"touchmove"===e.type||s){var t=e.offsetX,o=e.offsetY,a=e.touches,i=a?a[0].clientX:t,c=a?a[0].clientY:o,u=.005*(i-n.x),d=.005*(c-n.y);if(Math.abs(u)>Math.abs(d)){console.log("Rotation horizontale");var f=(new l.Quaternion).setFromAxisAngle(new l.Vector3(0,1,0),u);g.quaternion.multiply(f)}else{console.log("Rotation verticale");var h=(new l.Quaternion).setFromAxisAngle(new l.Vector3(1,0,0),d);g.quaternion.multiply(h)}r({x:i,y:c})}}var t=p.domElement;return t.addEventListener("mousemove",e),t.addEventListener("touchmove",e),t.addEventListener("mousedown",(function(e){0===e.button&&(f(!0),r({x:e.offsetX,y:e.offsetY}))})),t.addEventListener("touchstart",(function(e){f(!0),r({x:e.touches[0].clientX,y:e.touches[0].clientY})})),t.addEventListener("mouseup",(function(){return f(!1)})),t.addEventListener("touchend",(function(){return f(!1)})),function(){t.removeEventListener("mousemove",e),t.removeEventListener("touchmove",e),t.removeEventListener("mousedown",(function(e){0===e.button&&(f(!0),r({x:e.offsetX,y:e.offsetY}))})),t.removeEventListener("touchstart",(function(e){f(!0),r({x:e.touches[0].clientX,y:e.touches[0].clientY})})),t.removeEventListener("mouseup",(function(){return f(!1)})),t.removeEventListener("touchend",(function(){return f(!1)}))}}),[p.domElement,g,n,s]),Object(o.useEffect)((function(){console.log("Mouse down="+s)}),[s]),Object(o.useEffect)((function(){var e=new L.a(p.domElement);return e.get("pinch").set({enable:!0}),e.on("pinch",(function(e){var t=e.scale-1;g.zoom-=.1*t,g.zoom=l.MathUtils.clamp(g.zoom,1,10),g.updateProjectionMatrix()})),function(){e.off("pinch")}}),[p.domElement,g]),Object(o.useEffect)((function(){function e(e){var t=.25*-Math.sign(e.deltaY),n=new l.Vector2(e.offsetX/p.domElement.clientWidth*2-1,-e.offsetY/p.domElement.clientHeight*2+1),o=new l.Raycaster;o.setFromCamera(n,g);var r=new l.Vector3(0,0,0),a=S(g.position,o.ray.direction.normalize(),r,1e3);a&&g.lookAt(a),g.zoom+=t,g.zoom=l.MathUtils.clamp(g.zoom,1,10),g.updateProjectionMatrix()}var t=p.domElement;return t.addEventListener("wheel",e),function(){t.removeEventListener("wheel",e)}}),[p.domElement,g]),Object(o.useEffect)((function(){function e(e){var t=.05;switch(e.code){case"ArrowUp":g.rotateOnAxis(new l.Vector3(1,0,0),t);break;case"ArrowDown":g.rotateOnAxis(new l.Vector3(1,0,0),-.05);break;case"ArrowLeft":g.rotateOnAxis(new l.Vector3(0,1,0),t);break;case"ArrowRight":g.rotateOnAxis(new l.Vector3(0,1,0),-.05)}}return g.layers.enable(0),g.layers.enable(1),window.addEventListener("keydown",e),function(){window.removeEventListener("keydown",e)}}),[g]),Object(o.useEffect)((function(){g.position.set(0,0,0),g.lookAt(new l.Vector3(1,0,0)),g.updateProjectionMatrix()}),[]);var j=new l.Vector3;g.getWorldDirection(j);var O=j.multiplyScalar(.5),x=(new l.Vector3).addVectors(g.position,O);return Object(d.jsx)(d.Fragment,{children:b&&Object(d.jsx)(m.a,{position:x.toArray(),children:Object(d.jsxs)("div",{style:{position:"absolute",top:-200,left:-200,color:"red",display:"flex",flexDirection:"row",gap:"20px",width:"600px"},children:[Object(d.jsxs)("span",{children:["Zoom: ",g.zoom.toFixed(2)]}),Object(d.jsxs)("span",{children:["Position: ",g.position.x.toFixed(2),", ",g.position.y.toFixed(2),", ",g.position.z.toFixed(2)]}),Object(d.jsxs)("span",{children:["View Direction: ",j.x.toFixed(2),", ",j.y.toFixed(2),", ",j.z.toFixed(2)]})]})})})};var D=function(){var e=Object(u.k)(),t=e.scene,n=e.camera,r=e.gl,a=Object(o.useContext)(z),i=a.isDebugEnabled,s=a.setIsDebugEnabled,d=a.shownConstellations,f=a.representation,h=a.maxShownMagnitude,m=a.starsData,b=Object(o.useRef)(null),v=Object(o.useRef)(new l.Group),g=Object(o.useRef)(null),p=new l.Raycaster;p.layers.set(0),p.linePrecision=100;var j=new l.Vector2,O=Object(o.useRef)(null),x=Object(o.useState)(null),w=Object(c.a)(x,2),y=w[0],E=w[1];function A(){O.current&&(t.remove(O.current),O.current=null)}return Object(o.useEffect)((function(){(new l.FontLoader).load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",(function(e){console.log("Police charg\xe9e"),E(e)}))}),[]),Object(o.useEffect)((function(){console.log("Debug="+i)}),[i]),Object(o.useEffect)((function(){g.current&&(console.log("Removing previously highlighted star."),v.current.remove(g.current)),b.current&&v.current.remove(b.current)}),[d]),Object(o.useEffect)((function(){if(m){for(;v.current.children.length>0;)v.current.remove(v.current.children[0]);g.current&&(v.current.remove(g.current),g.current=null);var e,n=new l.BufferGeometry;e="Horizontal"===f&&m.horizontalCoords?m.horizontalCoords:m.vertices,n.setAttribute("position",new l.Float32BufferAttribute(e,3)),n.setAttribute("magnitude",new l.Float32BufferAttribute(m.magnitudes,1)),n.setAttribute("hipparcosId",new l.Float32BufferAttribute(m.hipparcosIds,1));for(var o=new l.ShaderMaterial({uniforms:{starTexture:{value:function(){var e=document.createElement("canvas");e.width=64,e.height=64;var t=e.getContext("2d"),n=t.createRadialGradient(32,32,8,32,32,32);n.addColorStop(0,"rgba(255, 255, 255, 1)"),n.addColorStop(1,"rgba(255, 255, 255, 0)"),t.fillStyle=n,t.fillRect(0,0,e.width,e.height);var o=new l.Texture(e);return o.needsUpdate=!0,o}()},maxMagnitude:{value:h}},vertexShader:"\n                attribute float magnitude;\n                uniform float maxMagnitude;\n                varying float vMagnitude;\n                void main() {\n                    vMagnitude = magnitude;\n                    gl_PointSize = 1.0 + 19.0 * (1.0 - vMagnitude / maxMagnitude);\n                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n                }\n            ",fragmentShader:"\n                uniform sampler2D starTexture;\n                uniform float maxMagnitude;\n                varying float vMagnitude;\n                void main() {\n                    if (vMagnitude > maxMagnitude) {\n                        discard;\n                    }\n                    gl_FragColor = texture2D(starTexture, gl_PointCoord);\n                }\n            ",transparent:!0,depthTest:!0,depthWrite:!1,blending:l.AdditiveBlending});v.current.children.length>0;)v.current.remove(v.current.children[0]);var r=new l.Points(n,o);return v.current.add(r),t.add(v.current),function(){t.remove(v.current)}}}),[n.zoom,f,m,t,h]),Object(o.useEffect)((function(){function e(e){"d"!==e.key&&"D"!==e.key||s((function(e){return!e}))}return window.addEventListener("keydown",e),function(){window.removeEventListener("keydown",e)}}),[]),Object(o.useEffect)((function(){function e(e){console.log("Clic event ",e),j.x=e.offsetX/r.domElement.clientWidth*2-1,j.y=-e.offsetY/r.domElement.clientHeight*2+1,p.setFromCamera(j,n);var o=null,a=1/0,c=new l.Vector3(0,0,0),s=new l.Vector3(0,0,0),u=S(c,p.ray.direction.normalize(),s,1e3);if(i?O.current?(console.log("Mise \xe0 jour de la direction du RayHelper"),O.current.setDirection(p.ray.direction),O.current.position.copy(p.ray.origin)):(console.log("Recr\xe9ation du rayHelper"),O.current=new l.ArrowHelper(p.ray.direction,p.ray.origin,1050,16711680),t.add(O.current)):A(),u){var d;console.log("Intersection point: ".concat(u.x,", ").concat(u.y,", ").concat(u.z)),d="Horizontal"===f&&m.horizontalCoords?m.horizontalCoords:m.vertices;for(var x=0;x<d.length/3;x++)if(m.magnitudes[x]<=h){var w=new l.Vector3(d[3*x],d[3*x+1],d[3*x+2]).distanceTo(u);w<a&&(a=w,o=x)}if(null!==o){var E=m.hipparcosIds[o];console.log("Etoile la plus proche Hipparcos ID:",E),function(e){if(y)if(e)if(m&&m.altAzArray){console.log("Highlight Star Function Called"),g.current&&(console.log("Removing previously highlighted star."),v.current.remove(g.current));var t=new l.RingGeometry(14,24,32),o=new l.MeshBasicMaterial({color:255,side:l.DoubleSide}),r=new l.Mesh(t,o),a=e.object.geometry.attributes.position,i=new l.Vector3;i.fromBufferAttribute(a,e.index),r.position.copy(i),console.log("Star Position:",i),(new l.Vector3).subVectors(i,n.position).normalize(),r.lookAt(n.position),v.current.add(r),g.current=r;var c=m.hipparcosIds[e.index],s=m.identStars[c],u=m.altAzArray[e.index],d=u.azimuth,f=u.altitude,h=m.raDec[e.index],p=h.ra,j=h.dec;console.log(c+" "+s+" Ra="+Object(M.b)(p)+" Dec="+Object(M.b)(j)),console.log(c+" "+s+" Azimut="+d+" Altitude="+f),console.log("Magnitude="+m.magnitudes[e.index]);var O=40/n.zoom;if(s){var x=new l.TextGeometry(s.replace("_"," "),{font:y,size:O,height:.1,curveSegments:12,bevelEnabled:!1}),w=new l.MeshBasicMaterial({color:255}),E=new l.Mesh(x,w);E.position.copy(i),E.position.x-=70,E.position.y-=70,E.lookAt(n.position),v.current.add(E),b.current&&v.current.remove(b.current),b.current=E}else console.log("Can't find starname of "+c);console.log("Star has been highlighted!")}else console.log("starsData or starsData.altAzArray is undefined");else console.log("Star is undefined")}({object:{geometry:{attributes:{position:new l.BufferAttribute(new Float32Array(d),3),hipparcosId:new l.BufferAttribute(new Float32Array(m.hipparcosIds),1)}}},index:o})}}else console.log("No intersection")}return window.addEventListener("click",e),function(){window.removeEventListener("click",e),A()}}),[f,m,n,r,i]),null};var R=function(){var e=Object(u.k)(),t=e.camera,n=e.scene,r=Object(o.useContext)(z),a=r.representation,i=r.starsData,s=r.constellationLines,d=Object(o.useRef)(new l.Group),f=Object(o.useState)(null),h=Object(c.a)(f,2),m=h[0],b=h[1];return Object(o.useEffect)((function(){(new l.FontLoader).load("https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",(function(e){console.log("Police charg\xe9e"),b(e)}))}),[]),Object(o.useEffect)((function(){if(i&&s&&m){d.current.children.forEach((function(e){console.log("Suppression de ",e),d.current.remove(e)})),n.remove(d.current);var e=new l.LineBasicMaterial({color:16777215}),o="Horizontal"===a&&i.horizontalCoords?i.horizontalCoords:i.vertices,r={};for(var c in s.forEach((function(t){var n=3*i.hipToIndex[t.startStar],a=3*i.hipToIndex[t.endStar],c=new l.Vector3(o[n],o[n+1],o[n+2]),s=new l.Vector3(o[a],o[a+1],o[a+2]),u=(new l.BufferGeometry).setFromPoints([c,s]),f=new l.Line(u,e);d.current.add(f),r[t.fullName]||(r[t.fullName]={sum:new l.Vector3(0,0,0),count:0});var h=r[t.fullName];h.sum.add(c),h.sum.add(s),h.count+=2})),r){var u=r[c],f=u.sum.divideScalar(u.count),h=40/t.zoom,b=new l.TextGeometry(c,{font:m,size:h,height:.1,curveSegments:12,bevelEnabled:!1}),v=new l.MeshBasicMaterial({color:16777215}),g=new l.Mesh(b,v);g.position.copy(f),g.lookAt(new l.Vector3(0,0,0)),d.current.add(g)}return n.add(d.current),function(){for(;d.current.children.length>0;)d.current.remove(d.current.children[0]);n.remove(d.current)}}}),[t.zoom,i,n,s,a,m]),null};var N=function(){var e=Object(o.useContext)(z),t=e.shownConstellations,n=e.representation,r=e.location;return Object(o.useEffect)((function(){console.log("Changement de Representation")}),[n,r]),Object(o.useEffect)((function(){console.log("Changement de Location")}),[r]),Object(d.jsxs)(d.Fragment,{children:["Oui"===t&&Object(d.jsx)(R,{}),Object(d.jsx)(D,{})]})};var F=function(){var e=function(){return Object(d.jsxs)("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",width:"100vw"},children:[Object(d.jsx)("style",{children:"\n                    @keyframes spin {\n                        0% { transform: rotate(0deg); }\n                        100% { transform: rotate(360deg); }\n                    }\n                "}),Object(d.jsx)("div",{style:{border:"16px solid #f3f3f3",borderRadius:"50%",borderTop:"16px solid #3498db",width:"120px",height:"120px",animation:"spin 2s linear infinite"}})]})};return Object(o.useContext)(z).isLoaded?Object(d.jsxs)(s.a,{style:{background:"#001122"},children:[Object(d.jsx)("orthographicCamera",{position:[0,0,0],left:-1500,right:1500,top:1500,bottom:-1500,near:.1,far:1500}),Object(d.jsx)(N,{}),Object(d.jsx)(h,{}),Object(d.jsx)(f,{}),Object(d.jsx)("axesHelper",{args:[1e3]}),Object(d.jsx)("ambientLight",{intensity:.5}),Object(d.jsx)("directionalLight",{position:[0,0,5],intensity:1}),Object(d.jsx)(k,{})]}):Object(d.jsx)(e,{})},I=n(0),T=n(1),V=n(3),P=n(4),B=function(e){Object(V.a)(n,e);var t=Object(P.a)(n);function n(e){var o;return Object(I.a)(this,n),(o=t.call(this,e)).state={hasError:!1,error:null,errorInfo:null},o}return Object(T.a)(n,[{key:"componentDidCatch",value:function(e,t){console.error("Uncaught error:",e,t),this.setState({error:e,errorInfo:t})}},{key:"render",value:function(){return this.state.hasError?Object(d.jsxs)("div",{children:[Object(d.jsx)("h1",{children:"Quelque chose s'est mal pass\xe9."}),Object(d.jsxs)("details",{style:{whiteSpace:"pre-wrap"},children:[this.state.error&&this.state.error.toString(),Object(d.jsx)("br",{}),this.state.errorInfo.componentStack]})]}):this.props.children}}],[{key:"getDerivedStateFromError",value:function(e){return{hasError:!0}}}]),n}(o.Component);n(58);var G=function(){var e=Object(o.useContext)(z),t=e.orientation,n=e.maxShownMagnitude,r=e.setMaxShownMagnitude,a=e.representation,i=e.toggleRepresentation,s=e.shownConstellations,l=e.toggleShownConstellations,u=Object(o.useState)(n),f=Object(c.a)(u,2),h=f[0],m=f[1],b=t.alpha,v=t.beta,g=t.gamma;return Object(d.jsxs)("div",{className:"sidebar",children:[Object(d.jsx)("h2",{className:"representation-title",children:a}),Object(d.jsx)("button",{onClick:i,children:"Basculer la repr\xe9sentation"}),Object(d.jsxs)("h2",{className:"constellations-title",children:["Constellations: ",s]}),Object(d.jsx)("div",{className:"toggle-btn ".concat("Oui"===s?"on":"off"),onClick:l,children:Object(d.jsx)("div",{className:"toggle-indicator"})}),Object(d.jsxs)("div",{className:"magnitude-slider",children:[Object(d.jsxs)("label",{children:["Magnitude maximale affich\xe9e: ",h]}),Object(d.jsx)("input",{type:"range",min:"0",max:"10",step:"0.1",value:h,onChange:function(e){var t=parseFloat(e.target.value);m(t),r(t)}})]}),void 0!==b&&void 0!==v&&void 0!==g&&Object(d.jsxs)("span",{className:"orientation",children:["Alpha: ",b.toFixed(2),", Beta: ",v.toFixed(2),", Gamma: ",g.toFixed(2)]}),Object(d.jsxs)("p",{className:"debug-info",children:["Appuyez sur ",Object(d.jsx)("strong",{children:"d"})," pour passer en mode debug."]})]})};n(59);var H=function(e){var t=e.deviceType,n=Object(o.useContext)(z),r=n.currentTime,a=n.location,i=r.getTimezoneOffset()/60;return Object(d.jsxs)("div",{className:"header",children:["mobile"!==t&&Object(d.jsx)("h1",{className:"header-title",children:"SkySphereJS"}),Object(d.jsxs)("div",{className:"right-section",children:[Object(d.jsx)("span",{className:"location",children:a.latitude&&a.longitude&&a.cityName?"Lat: ".concat(a.latitude.toFixed(2),", Long: ").concat(a.longitude.toFixed(2),", ").concat(a.cityName):"Localisation non disponible"}),Object(d.jsxs)("span",{className:"time",children:[" ",r.toLocaleTimeString()," UTC ",i>=0?"+":"",i]})]})]})};var U=function(){var e=Object(o.useState)(a(window.innerWidth)),t=Object(c.a)(e,2),n=t[0],r=t[1];function a(e){return console.log("Width="+e),e<768?"mobile":e<=1180?"tablette":"ordinateur"}return Object(o.useEffect)((function(){var e=function(){r(a(window.innerWidth))};return window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)}}),[]),Object(d.jsx)("div",{className:"App ".concat("mobile"===n?"mobile":""),children:Object(d.jsx)(A,{children:Object(d.jsxs)(B,{children:[Object(d.jsx)(H,{deviceType:n}),Object(d.jsx)("div",{className:"content",children:Object(d.jsx)(F,{})}),"mobile"!==n&&Object(d.jsx)(G,{})]})})})};i.a.createRoot(document.getElementById("root")).render(Object(d.jsx)(r.a.StrictMode,{children:Object(d.jsx)(U,{})}))}},[[60,1,2]]]);
//# sourceMappingURL=main.6bac6c13.chunk.js.map