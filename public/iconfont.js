/* eslint-disable */
(function () {
  var f = {
    icons: {},
    loaded: !1,
    loading: !1,
    load: function (arr) {
      var self = this;
      arr.forEach(function (item) {
        var data = item.data;
        if (data) {
          var container = document.createElement('div');
          container.innerHTML = data;
          var svg = container.querySelector('svg');
          if (svg) {
            svg.style.display = 'none';
            document.body.appendChild(svg);
          }
        }
      });
      self.loaded = !0;
    },
  };

  f.load([
    {
      data: '<svg xmlns="http://www.w3.org/2000/svg" style="display:none"><defs><symbol id="icon-cn" viewBox="0 0 64 48"><rect width="64" height="48" fill="#de2910"/><path fill="#ffde00" d="M22 18h-6v-2l-2 2 2 2v2h-8v4h8v4h-8v-2l-2 2 2 2v2h8v-4h-8v-4h8v-4h-8v-2l-2 2 2 2v2h8v-4h-4v-2h-4zM28 14l2-2-2-2h-4v4h4v-2zM32 14v-4h-4v4h4zM28 18v4h4v-4h-4zM24 22l2 2-2 2v-4h4v-2h-4zM36 18v4h4v-4h-4zM32 22h4v-2h-4v-2h4v4h-4zM24 14v-2l-4 2v4l4-2v-2h4zM40 14h4v4h-4v-4zM20 22H16v4h4v-4zM44 22h4v4h-4v-4zM16 26h4v4h-4v-4zM44 26h4v4h-4v-4zM12 18h4v4h-4v-4zM48 18h4v4h-4v-4z"/><path fill="#fff" d="M4 18h8v6H4v-6zM4 26h8v6H4v-6zM12 18h6v14h-6V18zM18 18h6v14h-6V18z"/></symbol><symbol id="icon-us" viewBox="0 0 64 48"><rect width="64" height="48" fill="#3c3b3e"/><rect width="64" height="24" fill="#bf0a30"/><path fill="#fff" d="M0 0v4h64V0H0zm0 8v4h64V8H0zm0 16v4h64v-4H0zm0 24v4h64v-4H0z"/><path fill="#002868" d="M0 4v16h24V4H0zm24 0v16h8V4h-8zm-8 16v16h8V20h-8zm8 0v16h32V20H24z"/><path fill="#fff" d="M28 21v2l1 1 1-1v-2l-1-1-1 1zm2 2l1 1 1-1-1-1-1 1zm2-2l1-1-1-1-1 1 1 1zm-2-2l-1-1-1 1 1 1 1-1zM30 23l-1 1 1 1 1-1-1-1z"/></symbol></defs></svg>',
    },
  ]);
  window.Iconfont = f;
})();