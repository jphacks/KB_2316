(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[409],{9358:function(e,t,c){(window.__NEXT_P=window.__NEXT_P||[]).push(["/dashboard/[uuid]/[year]/[month]/[day]",function(){return c(6167)}])},6167:function(e,t,c){"use strict";c.r(t);var n=c(5893),a=c(7294),s=c(1163),i=c(9008),o=c.n(i),r=c(6822),l=c(1214),h=c(9188),d=c(6242),x=c(2265),g=c(3426),u=c(2087);c(9413);var j=c(8428),m=c(2605),f=c(7182),p=c(8557),Z=c(720),D=c(5705),_=c(944),w=c(3321),v=c(6447),y=c(8445);let A=()=>{let e=(0,s.useRouter)(),{uuid:t,year:c,month:i,day:A}=e.query,[E,k]=(0,a.useState)(new Date);(0,a.useEffect)(()=>{c&&i&&A&&k(new Date(c,i-1,A))},[c,i,A]);let[T,b]=(0,a.useState)([]);(0,a.useEffect)(()=>{t&&c&&i&&A&&fetch("".concat(f.T,"/api/v1/get/").concat(t,"/").concat(c,"/").concat(i,"/").concat(A)).then(e=>e.json()).then(e=>{b(e)})},[t,c,i,A]);let N=E.getFullYear(),C=E.getMonth()+1,S=E.getDate();(0,a.useEffect)(()=>{N=E.getFullYear(),C=E.getMonth()+1,S=E.getDate()},[E]);let F=0;if(T)for(let e=0;e<T.length;e++)F+=T[e];let O=()=>{e.push("/dashboard/".concat(t,"/").concat(N,"/").concat(C,"/").concat(S))};return(0,n.jsx)(n.Fragment,{children:(0,n.jsxs)(x.A,{children:[(0,n.jsx)(o(),{children:(0,n.jsx)("title",{children:"Overview | Devias Kit"})}),(0,n.jsx)(r.Z,{component:"main",sx:{flexGrow:1,py:8},children:(0,n.jsxs)(l.Z,{maxWidth:"xl",children:[(0,n.jsxs)(h.Z,{container:!0,spacing:3,children:[(0,n.jsx)(h.Z,{xs:12,sm:6,lg:3,children:(0,n.jsx)(g.s,{difference:12,positive:!0,sx:{height:"100%"},value:F,dataTime:"".concat(c,"/").concat(i,"/").concat(A)})}),(0,n.jsx)(h.Z,{xs:12,lg:8,children:(0,n.jsx)(j.b,{chartSeries:[{name:"Time line",data:T}],sx:{height:"100%"},dataTime:"".concat(c,"/").concat(i,"/").concat(A)})})]}),(0,n.jsxs)(h.Z,{container:!0,spacing:3,children:[(0,n.jsx)(h.Z,{xs:12,md:12,lg:5,children:(0,n.jsx)(u.Y,{uuid:t,orders:[{time:(0,m.getDateDaysAgo)(1,"".concat(c,"/").concat(i,"/").concat(A))},{time:(0,m.getDateDaysAgo)(2,"".concat(c,"/").concat(i,"/").concat(A))},{time:(0,m.getDateDaysAgo)(3,"".concat(c,"/").concat(i,"/").concat(A))},{time:(0,m.getDateDaysAgo)(4,"".concat(c,"/").concat(i,"/").concat(A))},{time:(0,m.getDateDaysAgo)(5,"".concat(c,"/").concat(i,"/").concat(A))}],sx:{height:"100%"}})}),(0,n.jsx)(h.Z,{xs:12,md:12,lg:5,children:(0,n.jsxs)(d.Z,{sx:{height:"100%"},children:[(0,n.jsx)(y.Z,{title:"記録検索"}),(0,n.jsxs)(r.Z,{mt:4,children:[(0,n.jsx)(Z._,{dateAdapter:D.H,adapterLocale:_.Z,children:(0,n.jsx)(p.w,{Picker:!0,displayStaticWrapperAs:"desktop",value:E,onChange:e=>{k(e)}})}),(0,n.jsx)(r.Z,{xs:1,sx:{alignItems:"center",margin:"auto",width:"200px"},children:(0,n.jsx)(h.Z,{item:!0,children:(0,n.jsx)(v.Z,{spacing:2,children:(0,n.jsx)(w.Z,{variant:"contained",onClick:O,children:"検索"})})})})]})]})})]})]})})]})})};t.default=A}},function(e){e.O(0,[238,447,454,71,164,265,605,774,888,179],function(){return e(e.s=9358)}),_N_E=e.O()}]);