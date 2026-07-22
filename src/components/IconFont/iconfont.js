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
    {
      data: '<svg xmlns="http://www.w3.org/2000/svg" style="display:none"><defs><symbol id="icon-change" viewBox="0 0 1024 1024"><path d="M950.4 361.6l-288-288c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l233.6 233.6L96 352c-19.2 0-32 12.8-32 32s12.8 32 32 32l832 0c12.8 0 25.6-6.4 28.8-19.2C963.2 384 960 371.2 950.4 361.6z"></path><path d="M928 608 96 608c-12.8 0-25.6 6.4-28.8 19.2C60.8 640 64 652.8 73.6 662.4l288 288c6.4 6.4 16 9.6 22.4 9.6s16-3.2 22.4-9.6c12.8-12.8 12.8-32 0-44.8L172.8 672 928 672c19.2 0 32-12.8 32-32S947.2 608 928 608z"></path></symbol><symbol id="icon-robot" viewBox="0 0 1024 1024"><path d="M717.12 274H762c82.842 0 150 67.158 150 150v200c0 82.842-67.158 150-150 150H262c-82.842 0-150-67.158-150-150V424c0-82.842 67.158-150 150-150h44.88l-18.268-109.602c-4.086-24.514 12.476-47.7 36.99-51.786 24.514-4.086 47.7 12.476 51.786 36.99l20 120c0.246 1.472 0.416 2.94 0.516 4.398h228.192c0.1-1.46 0.27-2.926 0.516-4.398l20-120c4.086-24.514 27.272-41.076 51.786-36.99 24.514 4.086 41.076 27.272 36.99 51.786L717.12 274zM262 364c-33.138 0-60 26.862-60 60v200c0 33.138 26.862 60 60 60h500c33.138 0 60-26.862 60-60V424c0-33.138-26.862-60-60-60H262z m50 548c-24.852 0-45-20.148-45-45S287.148 822 312 822h400c24.852 0 45 20.148 45 45S736.852 912 712 912H312z m-4-428c0-24.852 20.148-45 45-45S398 459.148 398 484v40c0 24.852-20.148 45-45 45S308 548.852 308 524v-40z m318 0c0-24.852 20.148-45 45-45S716 459.148 716 484v40c0 24.852-20.148 45-45 45S626 548.852 626 524v-40z" fill="#444444"></path></symbol></defs></svg>',
    },
  ]);
  window.Iconfont = f;
})();
