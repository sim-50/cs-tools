(this["webpackJsonpcs-tools"]=this["webpackJsonpcs-tools"]||[]).push([[0],{116:function(e,t,o){},117:function(e,t,o){},120:function(e,t,o){},124:function(e,t,o){},127:function(e,t,o){},132:function(e,t,o){"use strict";o.r(t);var n=o(0),r=o.n(n),a=o(21),s=o.n(a),c=(o(116),o(22)),i=o(23),l=o(25),b=o(24),h=o.p+"static/media/Upitt_logo_400x400.8afe9141.jpg",d=o(143),u=(o(117),o(95),o(4)),j=[{label:"Student",value:"Student"},{label:"Librarian",value:"Librarian"}],O=function(e){Object(l.a)(o,e);var t=Object(b.a)(o);function o(){return Object(c.a)(this,o),t.apply(this,arguments)}return Object(i.a)(o,[{key:"render",value:function(){return Object(u.jsx)(d.a.Group,{options:j,onChange:this.props.onChange,value:this.props.role,optionType:"button",buttonStyle:"solid"})}}]),o}(n.Component),f=function(e){Object(l.a)(o,e);var t=Object(b.a)(o);function o(){return Object(c.a)(this,o),t.apply(this,arguments)}return Object(i.a)(o,[{key:"render",value:function(){return Object(u.jsxs)("header",{className:"App-header",children:[Object(u.jsx)("img",{src:h,alt:"logo",className:"App-logo"}),Object(u.jsx)("p",{className:"title",children:"Memory Paging Practice System"}),Object(u.jsx)("div",{className:"overview-button",children:Object(u.jsx)("a",{style:{color:"white"},onClick:this.props.clickOverview,children:"Overview"})}),Object(u.jsx)("div",{className:"role-button",children:Object(u.jsx)(O,{role:this.props.role,onChange:this.props.onChange})})]})}}]),o}(n.Component),v=(o(120),function(e){Object(l.a)(o,e);var t=Object(b.a)(o);function o(){return Object(c.a)(this,o),t.apply(this,arguments)}return Object(i.a)(o,[{key:"render",value:function(){return Object(u.jsx)("footer",{className:"footer",children:"University of Pittsburgh"})}}]),o}(n.Component)),p=o(39),g=o(31),m=o(109),x=o(141),k="book",y=o(139),S=o(145),w=o(146),C=o.p+"static/media/bookCover.6a39f467.jpg",N=o(140),_=o(106);var B=function(e){var t=y.a.Meta,o=Object(N.a)((function(){return{type:k,item:{code:e.code,name:e.name,author:e.author,level:e.level,position:e.position,created_date:e.created_date,frequency:e.frequency,last_borrowed:e.last_borrowed},collect:function(e){return{isDragging:!!e.isDragging()}}}})),n=Object(g.a)(o,2),r=(n[0].isDragging,n[1]),a=Object(u.jsxs)("div",{children:[Object(u.jsxs)("p",{children:["Created: ",e.created_date]}),Object(u.jsxs)("p",{children:["Frequency: ",e.frequency]}),Object(u.jsxs)("p",{children:["Last borrowed: ",e.last_borrowed]})]});return Object(u.jsx)("div",{ref:r,children:Object(u.jsx)(S.a,{count:e.frequency,children:Object(u.jsx)(w.a,{content:a,title:e.name,mouseEnterDelay:2,children:Object(u.jsx)(y.a,{hoverable:!0,style:{left:14,width:70,height:80},cover:Object(u.jsx)("img",{alt:"bookcover",src:C}),children:Object(u.jsx)(t,{title:e.name,description:e.author,onClick:function(){e.name===e.query&&_.b.success("You have successfully retrieved "+e.name)}})})})})})};var P=function(e){var t="Position "+e.position,o=Object(x.a)({accept:k,drop:function(t,o){return e.dragHandler(t,1,0,e.level,e.position)},collect:function(e){return{isOver:!!e.isOver()}}}),n=Object(g.a)(o,2),r=(n[0].isOver,n[1]),a=e.books;if(0===Object.keys(a).length&&a.constructor===Object)return Object(u.jsx)(m.a,{placement:"bottom",title:t,children:Object(u.jsx)("div",{className:"bookstand"})});var s=a.filter((function(e){return 1===e.location}));return Object(u.jsx)(m.a,{placement:"bottom",title:t,children:Object(u.jsx)("div",{className:"bookstand",ref:r,children:s.map((function(t){if(t.level===e.level&&t.position===e.position)return Object(u.jsx)(B,{code:t.code,name:t.name,author:t.author,location:t.location,level:t.level,position:t.position,created_date:t.created_date,frequency:t.frequency,last_borrowed:t.last_borrowed},t.code)}))})})},L=function(e){Object(l.a)(o,e);var t=Object(b.a)(o);function o(){return Object(c.a)(this,o),t.apply(this,arguments)}return Object(i.a)(o,[{key:"render",value:function(){for(var e=this,t="Level "+this.props.level,o=this.props.numOfBooksPerLevel,n=[],r=0;r<o;r++)n=[].concat(Object(p.a)(n),[{position:r+1,level:this.props.level,books:this.props.books}]);return Object(u.jsx)(m.a,{placement:"leftTop",title:t,children:Object(u.jsx)("div",{className:"bookcase",children:n.map((function(t){return Object(u.jsx)("div",{className:"single",children:Object(u.jsx)(P,{position:t.position,level:t.level,books:t.books,dragHandler:e.props.dragHandler},t.position)})}))})})}}]),o}(n.Component),q=function(e){Object(l.a)(o,e);var t=Object(b.a)(o);function o(){var e;Object(c.a)(this,o);for(var n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];return(e=t.call.apply(t,[this].concat(r))).state={},e}return Object(i.a)(o,[{key:"render",value:function(){for(var e=this,t=this.props.numOfLevels,o=this.props.numOfBooksPerLevel,n=[],r=0;r<t;r++)n=[].concat(Object(p.a)(n),[{level:r+1,numOfBooks:o,books:this.props.books}]);return Object(u.jsxs)("div",{className:"bookshelf",children:[Object(u.jsx)("h5",{class:"text-center",children:Object(u.jsx)("strong",{children:"Bookshelf"})}),n.map((function(t){return Object(u.jsx)(L,{level:t.level,numOfBooksPerLevel:t.numOfBooks,books:t.books,dragHandler:e.props.dragHandler,dbclick:e.props.dbclick},t.level)}))]})}}]),o}(n.Component),I=(o(124),o(103)),D=o(57),E=o(86),K=o(142),R="STORED_BOOK_KEY";function T(){try{var e=localStorage.getItem(R);return e?JSON.parse(e):(localStorage.setItem(R,"[]"),[])}catch(t){return localStorage.setItem(R,"[]"),[]}}function Y(e){var t=r.a.useState(),n=Object(g.a)(t,2),a=n[0],s=n[1],c=r.a.useState(),i=Object(g.a)(c,2),l=i[0],b=i[1],h=r.a.useState(),d=Object(g.a)(h,2),j=d[0],O=d[1],f=r.a.useState(),v=Object(g.a)(f,2),p=v[0],m=v[1];return r.a.useEffect((function(){if(e.show){!function(e,t){console.log("storing book",e);var n,r,a=T();if(a.find((function(t){return t.name===e})))sessionStorage.setItem(R,e);else{var s={code:o(125)(),name:e,location:0,bin:(n=1,r=t,n=Math.ceil(n),r=Math.floor(r),Math.floor(Math.random()*(r-n+1)+n)),level:0,position:0,created_date:0,frequency:0,last_borrowed:0};a.push(s);var c=JSON.stringify(a);localStorage.setItem(R,c)}}(e.query,e.numOfBins);var t=T().find((function(t){return t.name===e.query}));t&&(s(t.location),b(t.level),O(t.position),m(t.bin))}}),[e.show,e.query,e.numOfBins]),Object(u.jsxs)("pre",{children:[Object(u.jsx)("u",{children:"Book Name"}),": ",e.query,"\n",Object(u.jsx)("u",{children:"Location"}),": ",0===a?"storage":1===a?"bookshelf":"","\n",Object(u.jsx)("u",{children:"Storage Bin"}),": ",p," ","\n",Object(u.jsx)("u",{children:"Level"}),": ",l," ","\n",Object(u.jsx)("u",{children:"Position"}),": ",j," ","\n","\n",Object(u.jsx)(K.a,{type:"primary",onClick:function(){0===a?(_.b.info("Please move "+e.query+" from storage bin to bookshelf."),e.handleRoleChange("Librarian")):1===a&&(_.b.info("You can now retrieve the book on level "+l+" and position "+j),_.b.warn("Please double click on the book to retrieve"))},children:"Retrieve this Book"})]})}var H=o(138),M=o(105);var F=function(e){var t=e.binId,o=Object(x.a)({accept:k,drop:function(o,n){return e.dragHandler(o,0,t,0,0)},collect:function(e){return{isOver:!!e.isOver()}}}),n=Object(g.a)(o,2),r=(n[0].isOver,n[1]),a=Object(u.jsx)("div",{className:"book-container"}),s="Bin "+e.binId;if(0===Object.keys(e.books).length&&e.books.constructor===Object);else{var c=e.books.filter((function(e){return 0===e.location}));a=Object(u.jsx)("div",{className:"book-container",children:c.map((function(e){return Object(u.jsx)("div",{className:"book-align-block",children:Object(u.jsx)(B,{code:e.code,name:e.name,author:e.author,location:e.location,level:e.level,position:e.position,created_date:e.created_date,frequency:e.frequency,last_borrowed:e.last_borrowed},e.code)})}))})}return Object(u.jsx)(m.a,{placement:"top",title:s,children:Object(u.jsx)(w.a,{content:a,placement:"top",title:s,trigger:"click",children:Object(u.jsx)("div",{className:"bin",ref:r})})})},A=function(e){Object(l.a)(o,e);var t=Object(b.a)(o);function o(){var e;Object(c.a)(this,o);for(var n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];return(e=t.call.apply(t,[this].concat(r))).state={},e}return Object(i.a)(o,[{key:"render",value:function(){var e=this,t=this.props.numOfBins,o=this.props.books,n=[];if(0===Object.keys(this.props.books).length&&this.props.books.constructor===Object)for(var r=0;r<t;r++)n=[].concat(Object(p.a)(n),[{binId:r+1,books:[]}]);else for(var a=function(e){var t=o.filter((function(t){return t.bin===e+1}));n=[].concat(Object(p.a)(n),[{binId:e+1,books:t}])},s=0;s<t;s++)a(s);return Object(u.jsxs)("div",{className:"storage",children:[Object(u.jsx)("h5",{children:Object(u.jsx)("strong",{children:"Book Storage"})}),n.map((function(t){return Object(u.jsx)(F,{binId:t.binId,books:t.books,dragHandler:e.props.dragHandler},t.binId)}))]})}}]),o}(n.Component);function J(){try{var e=localStorage.getItem("STORED_BOOK_KEY");return e?JSON.parse(e):(localStorage.setItem("STORED_BOOK_KEY","[]"),[])}catch(t){return[]}}function U(){try{var e={};return Object.entries(localStorage).map((function(t){var o=Object(g.a)(t,2),n=(o[0],o[1]),r=JSON.parse(n);e=r})),e}catch(t){return[]}}var V=function(e){Object(l.a)(o,e);var t=Object(b.a)(o);function o(e){var n;return Object(c.a)(this,o),(n=t.call(this,e)).dragHandler=function(e,t,o,r,a){var s=Object(p.a)(n.state.books),c=s.filter((function(t){return t.code===e.code})),i=s.indexOf(c[0]);c[0].location=t,c[0].bin=o,c[0].level=r,c[0].position=a,s[i]=c[0],n.setState({books:s});for(var l=0,b=1,h=J(),d=0;d<h.length;d++)h[d].name!==e.name&&1===t&&h[d].level===r&&h[d].position===a&&(l=1),1===h[d].location&&(b+=1);if(1===t&&b>n.state.numOfShelfLevels*n.state.numOfBooksPerLevel&&(l=2),0===l){for(d=0;d<h.length;d++){if(h[d].code===e.code){if(0===h[d].location&&1===t){var u=new Date;h[d].created_date=u.getFullYear()+"-"+(u.getMonth()+1)+"-"+u.getDate(),sessionStorage.setItem("STORED_BOOK_KEY",e.name)}h[d].name=e.name,h[d].location=t,h[d].bin=o,h[d].level=r,h[d].position=a}var j=JSON.stringify(h);localStorage.setItem("STORED_BOOK_KEY",j)}1===t&&(_.b.success(e.name+" is available on bookshelf now. Please double click to access."),n.props.handleRoleChange("Student"))}else 1===l?(_.b.error("A book already exists on this position. Please choose another position as a librarian again!"),n.setState({error:1})):(_.b.error("The bookshelf is full. Please remove a book from the shelf to storage bin before adding another book to the shelf.",15),_.b.info("You can remove the book with least frequency.",15),n.setState({error:1}))},n.dbclick=function(){document.ondblclick=function(e){if(!0===e.target.draggable){var t=e.target.offsetParent.innerText,o=sessionStorage.getItem("STORED_BOOK_KEY");if(o===t){alert("You have successfully retrieved "+o);for(var n=J(),r=new Date,a=0;a<n.length;a++){n[a].name===o&&(n[a].frequency+=1,n[a].last_borrowed=r.getFullYear()+"-"+(r.getMonth()+1)+"-"+r.getDate()+" "+r.toLocaleTimeString());var s=JSON.stringify(n);localStorage.setItem("STORED_BOOK_KEY",s)}sessionStorage.setItem("STORED_BOOK_KEY",""),window.location.reload()}else _.b.warning("Please choose again")}}},n.catalogClose=function(){return n.setState({catalogShow:!1})},n.state={role:n.props.role,value:"",lib:[],catalogShow:!1,numOfShelfLevels:5,numOfBooksPerLevel:3,numOfBins:4,books:U(),query:"",error:0},n}return Object(i.a)(o,[{key:"componentDidUpdate",value:function(e,t){this.state.error!==t.error&&(this.setState({books:U()}),this.setState({error:0})),this.state.catalogShow!==t.catalogShow&&(this.setState({books:U()}),this.catalogClose())}},{key:"render",value:function(){var e=this,t=this.props.role;this.state.lib;return Object(u.jsx)("div",{className:"main",children:Object(u.jsx)(I.a,{fluid:"lg",children:Object(u.jsxs)(D.a,{children:[Object(u.jsxs)(E.a,{children:[Object(u.jsx)("h5",{className:"computer-title",children:Object(u.jsx)("strong",{children:"Catalog Computer"})}),Object(u.jsx)("div",{className:"Librarian"===t?"wrapper":"",children:Object(u.jsx)("div",{className:"Librarian"===t?"is-disabled":"",children:Object(u.jsx)("div",{className:"search-monitor",children:Object(u.jsxs)("div",{className:"search-container",children:[Object(u.jsx)(D.a,{children:"Press Enter after Search"}),Object(u.jsx)(D.a,{children:Object(u.jsx)("div",{className:"form-inline mt-4 mb-4",children:Object(u.jsx)("input",{className:"form-control-sm",type:"text",placeholder:"Find a Book","aria-label":"Search",value:this.state.query,onClick:function(e){_.b.info("You can enter any book you want")},onChange:function(t){return e.setState({query:t.target.value})},onKeyPress:function(t){"Enter"===t.key&&(e.state.query?e.setState({catalogShow:!0,value:t.target.value}):alert("Please input a name!"))}})})}),Object(u.jsx)(D.a,{children:Object(u.jsx)("strong",{children:"Catalog Card"})}),Object(u.jsx)(D.a,{children:Object(u.jsx)(Y,{query:this.state.value,show:this.state.catalogShow,onHide:this.catalogClose,numOfBins:this.state.numOfBins,role:this.props.role,handleRoleChange:this.props.handleRoleChange})})]})})})})]}),Object(u.jsxs)(H.a,{backend:M.a,children:[Object(u.jsx)(E.a,{className:"bookshelf-view",children:Object(u.jsx)("div",{children:Object(u.jsx)(q,{numOfLevels:this.state.numOfShelfLevels,numOfBooksPerLevel:this.state.numOfBooksPerLevel,books:this.state.books,dragHandler:this.dragHandler.bind(this),dbclick:this.dbclick()})})}),Object(u.jsx)(E.a,{className:"storage-view",children:Object(u.jsx)("div",{className:"Student"===t?"wrapper":"",children:Object(u.jsx)("div",{className:"Student"===t?"is-disabled":"",children:Object(u.jsx)(A,{books:this.state.books,numOfBins:this.state.numOfBins,dragHandler:this.dragHandler.bind(this)})})})})]})]})})})}}]),o}(n.Component),z=o(144),G=(o(127),function(e){Object(l.a)(o,e);var t=Object(b.a)(o);function o(){var e;Object(c.a)(this,o);for(var n=arguments.length,r=new Array(n),a=0;a<n;a++)r[a]=arguments[a];return(e=t.call.apply(t,[this].concat(r))).state={role:"Student",visible:!1},e.handleValueChange=function(t){console.log("role button checked",t.target.value),e.setState({role:t.target.value})},e.clickOverview=function(t){e.showDrawer()},e.showDrawer=function(){e.setState({visible:!0})},e.onClose=function(){e.setState({visible:!1})},e}return Object(i.a)(o,[{key:"handleRoleChange",value:function(e){this.setState({role:e})}},{key:"render",value:function(){return Object(u.jsxs)("div",{className:"App",children:[Object(u.jsx)(f,{role:this.state.role,onChange:this.handleValueChange.bind(this),clickOverview:this.clickOverview.bind(this)}),Object(u.jsxs)(z.a,{title:"Introduction",placement:"right",width:"500px",closable:!1,onClose:this.onClose,visible:this.state.visible,children:[Object(u.jsx)("h5",{children:"Memory Paging vs. Library Analogy"}),Object(u.jsxs)("ul",{children:[Object(u.jsxs)("li",{children:["A ",Object(u.jsx)("strong",{children:"page"})," is a ",Object(u.jsx)("strong",{children:"book"})," on the bookshelf."]}),Object(u.jsxs)("li",{children:[Object(u.jsx)("strong",{children:"Virtual memory"})," is the ",Object(u.jsx)("strong",{children:"catelog computer"})," with list of names of books available."]}),Object(u.jsxs)("li",{children:[Object(u.jsx)("strong",{children:"Physical memory"})," is the ",Object(u.jsx)("strong",{children:"bookshelf"})," with level numbers and position numbers as 'addresses'."]}),Object(u.jsxs)("li",{children:[Object(u.jsx)("strong",{children:"Swap space"})," is the basement ",Object(u.jsx)("strong",{children:"book storage"})," where unpopular books are kept."]}),Object(u.jsxs)("li",{children:[Object(u.jsx)("strong",{children:"Page table"})," is the ",Object(u.jsx)("strong",{children:"catalog card"})," that maps a book name to level number and position number."]}),Object(u.jsxs)("li",{children:[Object(u.jsx)("strong",{children:"Operating system"})," is the ",Object(u.jsx)("strong",{children:"librarian"})," in charge of organizing the books."]})]}),Object(u.jsx)("h5",{children:"Bookshelf Function Instruction"}),Object(u.jsx)("p",{children:"For each book,"}),Object(u.jsxs)("ul",{children:[Object(u.jsx)("li",{children:"Mouse over 2 seconds for the book details."}),Object(u.jsx)("li",{children:"Double click for retriving the book."}),Object(u.jsx)("li",{children:"The red badge at the corner indicates its retrieve frequency."})]})]}),Object(u.jsx)(V,{role:this.state.role,handleRoleChange:this.handleRoleChange.bind(this)}),Object(u.jsx)(v,{})]})}}]),o}(r.a.Component)),Q=function(e){e&&e instanceof Function&&o.e(3).then(o.bind(null,147)).then((function(t){var o=t.getCLS,n=t.getFID,r=t.getFCP,a=t.getLCP,s=t.getTTFB;o(e),n(e),r(e),a(e),s(e)}))};o(128),o(129),o(130),o(131);s.a.render(Object(u.jsx)(r.a.StrictMode,{children:Object(u.jsx)(G,{})}),document.getElementById("root")),Q()}},[[132,1,2]]]);
//# sourceMappingURL=main.808e10d2.chunk.js.map