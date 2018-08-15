"use strict";function factorialBlockMaker(a){var o=1<arguments.length&&void 0!==arguments[1]&&arguments[1],t=document.createElement("dl");return t.classList.add("factorial-block--new"),o?(t.classList.add("factorial-block__initial-call"),t.innerHTML='<dt class="factorial-block__call-type factorial-block__top-row">Initial Call</dt>\n                                    <dd class="factorial-block__function-name factorial-block__bottom-row">factorial('+a+')</dd>\n                                    <dt class="factorial-block__equivalent factorial-block__top-row">equivalent to</dt>\n                                    <dd class="factorial-block__equivalent-value factorial-block__bottom-row">'+a+" * factorial("+(a-1)+')</dd>\n                                    <dt class="factorial-block__return-header factorial-block__top-row">return value</dt>\n                                    <dd class="factorial-block__return-value factorial-block__bottom-row">waiting</dd>'):t.innerHTML=1==a?'<dt class="factorial-block__call-type factorial-block__top-row">Base Case</dt>\n                                    <dd class="factorial-block__function-name factorial-block__bottom-row">factorial(1)</dd>\n                                    <dt class="factorial-block__equivalent factorial-block__top-row">equivalent to</dt>\n                                    <dd class="factorial-block__equivalent-value factorial-block__bottom-row">1</dd>\n                                    <dt class="factorial-block__return-header factorial-block__top-row">return value</dt>\n                                    <dd class="factorial-block__return-value factorial-block__return-value--returned factorial-block__bottom-row">1</dd>':'<dt class="factorial-block__call-type factorial-block__top-row">Recursive Call</dt>\n                                    <dd class="factorial-block__function-name factorial-block__bottom-row">factorial('+a+')</dd>\n                                    <dt class="factorial-block__equivalent factorial-block__top-row">equivalent to</dt>\n                                    <dd class="factorial-block__equivalent-value factorial-block__bottom-row">'+a+" * factorial("+(a-1)+')</dd>\n                                    <dt class="factorial-block__return-header factorial-block__top-row">return value</dt>\n                                    <dd class="factorial-block__return-value factorial-block__bottom-row">waiting</dd>',t}var factorialDemoContainer=document.querySelector(".factorial-demo");function factorial(l){return new Promise(function(t){setTimeout(function(){var a=void 0;a=factorialDemoContainer.hasChildNodes()?factorialBlockMaker(l,!1):factorialBlockMaker(l,!0),factorialDemoContainer.appendChild(a);var o=a.querySelector(".factorial-block__return-value");t(o)},500)}).then(function(t){return l<=1?Promise.resolve(1):new Promise(function(a){a(factorial(l-1).then(function(a){return a*l}))}).then(function(o){return new Promise(function(a){setTimeout(function(){t.innerHTML=o.toString(),t.classList.add("factorial-block__return-value--returned"),a(o)},500)})})})}factorial(5);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhY3RvcmlhbC5qcyJdLCJuYW1lcyI6WyJmYWN0b3JpYWxCbG9ja01ha2VyIiwibiIsImlzRmlyc3RDYWxsIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiZmFjdG9yaWFsQmxvY2siLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJpbm5lckhUTUwiLCJmYWN0b3JpYWxEZW1vQ29udGFpbmVyIiwiZnVuY3Rpb25WYWx1ZVRleHQiLCJxdWVyeVNlbGVjdG9yIiwiZmFjdG9yaWFsIiwiUHJvbWlzZSIsInJlc29sdmUiLCJzZXRUaW1lb3V0IiwiaGFzQ2hpbGROb2RlcyIsImFwcGVuZENoaWxkIiwidGhlbiIsInZhbHVlIiwidmFsIiwidG9TdHJpbmciLCJhZGQiXSwibWFwcGluZ3MiOiJhQUFBLFNBQVNBLG9CQUFvQkMsR0FBd0IsSUFBckJDLEVBQXFCLEVBQUFDLFVBQUFDLGFBQUFDLElBQUFGLFVBQUEsSUFBQUEsVUFBQSxHQUM3Q0csRUFBaUJDLFNBQVNDLGNBQWMsTUF1Q3BDLE9BeENaRixFQUFTTixVQUFvQkMsSUFBd0Isd0JBSTdDQyxHQUhBSSxFQUFBQSxVQUFpQkMsSUFBU0MsaUNBQzlCRixFQUFlRyxVQUFmSCwyTUFLbUhMLEVBTG5ISyxrUEFHSUwsRUFISkssaUJBR0lMLEVBQUEsR0FISkssNlBBVU9BLEVBT0FJLFVBTkhKLEdBQUFBLEVBREcsbXRCQW1CTEssNk1BVmlIVixFQVVqSFUsa1BBRzhCVixFQUg5QlUsaUJBRzhCVixFQUFBLEdBSDlCVSw0UEFTTUwsRUFHUCxJQVRNSyx1QkFTRUMsU0FBREMsY0FBdUIsbUJBRXZCLFNBQUFDLFVBQU9DLEdBQ1YsT0FGRCxJQUVPQSxRQUFBLFNBQUFDLEdBQ0hDLFdBQU8sV0FDSCxJQUFBWCxPQUFBQSxFQUFZQSxFQUFzQkssdUJBQUFPLGdCQUFsQ2xCLG9CQUFBQyxHQUFBLEdBQWtDRCxvQkFBQUMsR0FBQSxHQUNsQ2UsdUJBQUFHLFlBQUFiLEdBQ0gsSUFBRWMsRUFBS2QsRUFBV08sY0FBQSxrQ0FDZkcsRUFBQUosSUFDSUssT0FDSUwsS0FBQUEsU0FBQUEsR0FDQUEsT0FBQUEsR0FBQUEsRUFDQUksUUFBQUEsUUFBUUssR0FKaEIsSUFBQU4sUUFBQSxTQUFBQyxHQVFQQSxFQVpHRixVQUFBYixFQUFBLEdBQUFtQixLQUFBLFNBQUFFLEdBQUEsT0FBQUEsRUFBQXJCLE9BYlJtQixLQUFBLFNBQUFDLEdBMkJILE9BQUEsSUFBQU4sUUFBQSxTQUFBQyxHQVRtQkMsV0FBVyxXQVcvQkwsRUFBQUYsVUFBQVcsRUFBQUUsV0FUd0JYLEVBQWtCSCxVQUFVZSxJQUFJLDJDQUNoQ1IsRUFBUUssSUFDVCxXQU92QlAsVUFBVSIsImZpbGUiOiJmYWN0b3JpYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBmYWN0b3JpYWxCbG9ja01ha2VyKG4sIGlzRmlyc3RDYWxsID0gZmFsc2UpIHtcclxuICAgIGxldCBmYWN0b3JpYWxCbG9jayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RsJyk7XHJcbiAgICBmYWN0b3JpYWxCbG9jay5jbGFzc0xpc3QuYWRkKCdmYWN0b3JpYWwtYmxvY2stLW5ldycpO1xyXG5cclxuICAgIGlmIChpc0ZpcnN0Q2FsbCkge1xyXG4gICAgICAgIGZhY3RvcmlhbEJsb2NrLmNsYXNzTGlzdC5hZGQoJ2ZhY3RvcmlhbC1ibG9ja19faW5pdGlhbC1jYWxsJyk7XHJcbiAgICAgICAgZmFjdG9yaWFsQmxvY2suaW5uZXJIVE1MID0gYDxkdCBjbGFzcz1cImZhY3RvcmlhbC1ibG9ja19fY2FsbC10eXBlIGZhY3RvcmlhbC1ibG9ja19fdG9wLXJvd1wiPkluaXRpYWwgQ2FsbDwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImZhY3RvcmlhbC1ibG9ja19fZnVuY3Rpb24tbmFtZSBmYWN0b3JpYWwtYmxvY2tfX2JvdHRvbS1yb3dcIj5mYWN0b3JpYWwoJHtufSk8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQgY2xhc3M9XCJmYWN0b3JpYWwtYmxvY2tfX2VxdWl2YWxlbnQgZmFjdG9yaWFsLWJsb2NrX190b3Atcm93XCI+ZXF1aXZhbGVudCB0bzwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImZhY3RvcmlhbC1ibG9ja19fZXF1aXZhbGVudC12YWx1ZSBmYWN0b3JpYWwtYmxvY2tfX2JvdHRvbS1yb3dcIj4ke259ICogZmFjdG9yaWFsKCR7biAtIDF9KTwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdCBjbGFzcz1cImZhY3RvcmlhbC1ibG9ja19fcmV0dXJuLWhlYWRlciBmYWN0b3JpYWwtYmxvY2tfX3RvcC1yb3dcIj5yZXR1cm4gdmFsdWU8L2R0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQgY2xhc3M9XCJmYWN0b3JpYWwtYmxvY2tfX3JldHVybi12YWx1ZSBmYWN0b3JpYWwtYmxvY2tfX2JvdHRvbS1yb3dcIj53YWl0aW5nPC9kZD5gO1xyXG4gICAgfSBlbHNlIGlmIChuID09IDEpIHtcclxuICAgICAgICBmYWN0b3JpYWxCbG9jay5pbm5lckhUTUwgPSBgPGR0IGNsYXNzPVwiZmFjdG9yaWFsLWJsb2NrX19jYWxsLXR5cGUgZmFjdG9yaWFsLWJsb2NrX190b3Atcm93XCI+QmFzZSBDYXNlPC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkIGNsYXNzPVwiZmFjdG9yaWFsLWJsb2NrX19mdW5jdGlvbi1uYW1lIGZhY3RvcmlhbC1ibG9ja19fYm90dG9tLXJvd1wiPmZhY3RvcmlhbCgxKTwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdCBjbGFzcz1cImZhY3RvcmlhbC1ibG9ja19fZXF1aXZhbGVudCBmYWN0b3JpYWwtYmxvY2tfX3RvcC1yb3dcIj5lcXVpdmFsZW50IHRvPC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkIGNsYXNzPVwiZmFjdG9yaWFsLWJsb2NrX19lcXVpdmFsZW50LXZhbHVlIGZhY3RvcmlhbC1ibG9ja19fYm90dG9tLXJvd1wiPjE8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQgY2xhc3M9XCJmYWN0b3JpYWwtYmxvY2tfX3JldHVybi1oZWFkZXIgZmFjdG9yaWFsLWJsb2NrX190b3Atcm93XCI+cmV0dXJuIHZhbHVlPC9kdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRkIGNsYXNzPVwiZmFjdG9yaWFsLWJsb2NrX19yZXR1cm4tdmFsdWUgZmFjdG9yaWFsLWJsb2NrX19yZXR1cm4tdmFsdWUtLXJldHVybmVkIGZhY3RvcmlhbC1ibG9ja19fYm90dG9tLXJvd1wiPjE8L2RkPmA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZhY3RvcmlhbEJsb2NrLmlubmVySFRNTCA9IGA8ZHQgY2xhc3M9XCJmYWN0b3JpYWwtYmxvY2tfX2NhbGwtdHlwZSBmYWN0b3JpYWwtYmxvY2tfX3RvcC1yb3dcIj5SZWN1cnNpdmUgQ2FsbDwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImZhY3RvcmlhbC1ibG9ja19fZnVuY3Rpb24tbmFtZSBmYWN0b3JpYWwtYmxvY2tfX2JvdHRvbS1yb3dcIj5mYWN0b3JpYWwoJHtufSk8L2RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZHQgY2xhc3M9XCJmYWN0b3JpYWwtYmxvY2tfX2VxdWl2YWxlbnQgZmFjdG9yaWFsLWJsb2NrX190b3Atcm93XCI+ZXF1aXZhbGVudCB0bzwvZHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkZCBjbGFzcz1cImZhY3RvcmlhbC1ibG9ja19fZXF1aXZhbGVudC12YWx1ZSBmYWN0b3JpYWwtYmxvY2tfX2JvdHRvbS1yb3dcIj4ke259ICogZmFjdG9yaWFsKCR7biAtIDF9KTwvZGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkdCBjbGFzcz1cImZhY3RvcmlhbC1ibG9ja19fcmV0dXJuLWhlYWRlciBmYWN0b3JpYWwtYmxvY2tfX3RvcC1yb3dcIj5yZXR1cm4gdmFsdWU8L2R0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGQgY2xhc3M9XCJmYWN0b3JpYWwtYmxvY2tfX3JldHVybi12YWx1ZSBmYWN0b3JpYWwtYmxvY2tfX2JvdHRvbS1yb3dcIj53YWl0aW5nPC9kZD5gO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWN0b3JpYWxCbG9jaztcclxufVxyXG5cclxuY29uc3QgZmFjdG9yaWFsRGVtb0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mYWN0b3JpYWwtZGVtbycpO1xyXG5cclxuZnVuY3Rpb24gZmFjdG9yaWFsKG4pIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZmFjdG9yaWFsQmxvY2s7XHJcbiAgICAgICAgICAgIGlmICghZmFjdG9yaWFsRGVtb0NvbnRhaW5lci5oYXNDaGlsZE5vZGVzKCkpIGZhY3RvcmlhbEJsb2NrID0gZmFjdG9yaWFsQmxvY2tNYWtlcihuLCB0cnVlKTsgXHJcbiAgICAgICAgICAgIGVsc2UgZmFjdG9yaWFsQmxvY2sgPSBmYWN0b3JpYWxCbG9ja01ha2VyKG4sIGZhbHNlKTtcclxuICAgICAgICAgICAgZmFjdG9yaWFsRGVtb0NvbnRhaW5lci5hcHBlbmRDaGlsZChmYWN0b3JpYWxCbG9jayk7XHJcbiAgICAgICAgICAgIGxldCBmdW5jdGlvblZhbHVlVGV4dCA9IGZhY3RvcmlhbEJsb2NrLnF1ZXJ5U2VsZWN0b3IoJy5mYWN0b3JpYWwtYmxvY2tfX3JldHVybi12YWx1ZScpO1xyXG4gICAgICAgICAgICByZXNvbHZlKGZ1bmN0aW9uVmFsdWVUZXh0KTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfSkudGhlbigoZnVuY3Rpb25WYWx1ZVRleHQpID0+IHtcclxuICAgICAgICBpZiAobiA8PSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoMSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBmYWN0b3JpYWwobiAtIDEpLnRoZW4oKHZhbCkgPT4gdmFsICogbik7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHZhbHVlKTtcclxuICAgICAgICAgICAgfSkudGhlbigodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvblZhbHVlVGV4dC5pbm5lckhUTUwgPSB2YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvblZhbHVlVGV4dC5jbGFzc0xpc3QuYWRkKCdmYWN0b3JpYWwtYmxvY2tfX3JldHVybi12YWx1ZS0tcmV0dXJuZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgNTAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5mYWN0b3JpYWwoNSk7XHJcblxyXG4iXX0=