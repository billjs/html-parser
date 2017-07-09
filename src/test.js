const parser = require('../src/parser')

const html = `
<!DOCTYPE html>
<html lang="zh-cmn-Hans" class="no-js">
  <head>
    <meta charset="utf-8">
    <meta name="author" content="RabbitPre - www.rabbitpre.com">
    <meta name="keywords" content="免费H5模板,免费微场景模板,制作微场景,制作H5页面">
    <meta name="description" content="兔展免费模板中心根据用户的需要，提供了海量的不同行业及不同使用场景的免费微场景模板，助你轻松制作炫酷的H5作品。">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta property="qc:admins" content="35233730414621221402563757">
    <meta property="qc:admins" content="352337336562122140256375">
    <meta property="wb:webmaster" content="4f03275c0fbf2914">
    <meta http-equiv="x-dns-prefetch-control" content="on">
    <link rel="dns-prefetch" href="//oss1.rabbitpre.com ">
    <link rel="dns-prefetch" href="//vcdn1.rabbitpre.com ">
    <link rel="dns-prefetch" href="//vcdn2.rabbitpre.com ">
    <link rel="dns-prefetch" href="//vcdn3.rabbitpre.com ">
    <link rel="dns-prefetch" href="//vcdn4.rabbitpre.com ">
    <link rel="dns-prefetch" href="//ali.rabbitpre.com">
    <link rel="dns-prefetch" href="//ali1.rabbitpre.com">
    <link rel="dns-prefetch" href="//ali2.rabbitpre.com">
    <link rel="dns-prefetch" href="//ali3.rabbitpre.com">
    <link rel="dns-prefetch" href="//file.rabbitpre.com">
    <link rel="dns-prefetch" href="//file1.rabbitpre.com">
    <link rel="dns-prefetch" href="//file2.rabbitpre.com">
    <link rel="dns-prefetch" href="//file3.rabbitpre.com">
    <link rel="dns-prefetch" href="//sso.rabbitpre.com">
    <link rel="dns-prefetch" href="//eps.rabbitpre.com">
    <link rel="dns-prefetch" href="//mic.rabbitpre.com">
    <link rel="dns-prefetch" href="//lxcdn.rabbitpre.com ">
    <link rel="dns-prefetch" href="//wscdn.rabbitpre.com ">
    <link rel="dns-prefetch" href="//cdn1.rabbitpre.com">
    <link rel="dns-prefetch" href="//cdn2.rabbitpre.com">
    <link rel="dns-prefetch" href="//cdn3.rabbitpre.com">
    <link rel="dns-prefetch" href="//cdn4.rabbitpre.com">
    <link rel="dns-prefetch" href="//tenc.rabbitpre.com">
    <link rel="dns-prefetch" href="//tenc1.rabbitpre.com">
    <link rel="dns-prefetch" href="//tenc2.rabbitpre.com">
    <link rel="dns-prefetch" href="//tenc3.rabbitpre.com">
    <link rel="dns-prefetch" href="//static.szzbmy.com">
    <link rel="dns-prefetch" href="//oss-cn-shenzhen.aliyuncs.com">
    <link rel="dns-prefetch" href="//7xiklo.com2.z0.glb.qiniucdn.com">
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <title>兔展一视</title>
    <script type="text/javascript">
      (function() {
        var document = window.document;
        var root = document.documentElement;
        var viewport = document.querySelector('meta[name="viewport"]');
        var dpr = 1;
        var scale = 1;
        var fontBase = 14;

        if (/i?(Phone|Pod|Pad|Mac)/.test(navigator.userAgent)) {
          var ratio = window.devicePixelRatio;
          dpr = ratio >= 3 ? 3 : (ratio >= 2 ? 2 : 1);
        } else {
          dpr = 1;
        }
        scale = 1 / dpr;

        root.setAttribute('data-dpr', dpr);
        viewport.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', user-scalable=no');

        var setBodyFontSize = function() {
          document.removeEventListener('DOMContentLoaded', setBodyFontSize);
          // document.body.style.fontSize = fontBase * dpr + 'px';
          document.body.style.fontSize = fontBase + 'px';
        };

        if (document.readyState === 'complete') {
          setBodyFontSize();
        } else {
          document.addEventListener('DOMContentLoaded', setBodyFontSize, false);
        }

        var orientation = 'landscape';

        var setRootFontSize = function(orientation) {
          var minWidth = 1280;
          var maxWidth = 1920;
          var width = root.getBoundingClientRect().width;
          width = Math.max(Math.min(width, maxWidth), minWidth);
          // 减掉部分宽度，避免面板遮盖舞台
          // 横版减掉300px，竖版和正方形版减掉100px
          width -= (orientation === 'landscape' ? 300 : 100);
          root.style.fontSize = width / 10 + 'px';
        };

        setRootFontSize(orientation);

        var timer = null;
        window.addEventListener('resize', function() {
          timer && clearTimeout(timer);
          timer = setTimeout(function() {
            setRootFontSize(orientation)
          }, 50);
        }, false);

        window.ESEE = {
          setRootFontSize: function(o) {
            orientation = o;
            setRootFontSize(orientation);
          }
        };
      })();
    </script>
  <link href="/rp/esee-editor/assets/styles/index.css" rel="stylesheet"/></head>
  <body class="root"><script id="__bs_script__">//<![CDATA[
    document.write("<script async src='/browser-sync/browser-sync-client.js?v=2.18.11'><\/script>".replace("HOST", location.hostname));
//]]></script>

    <div id="eseeApp" class="g-container">
      <div class="e-app-loading"></div>
    </div>
    <script src="https://kwstatic.rabbitpre.com/sdk/killerwhale.min.js?_=1495593196844"></script>
    <script type="text/javascript">
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?9ad3eedcbfcad678357018dda8c8c602";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?de7d8515aad4ac1c242b76b728589f5d";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
      var _vds = _vds || [];
      window._vds = _vds;
      (function(){
        _vds.push(['setAccountId', '9d3b2a190f2f2118']);
        (function() {
          var vds = document.createElement('script');
          vds.type='text/javascript';
          vds.async = true;
          vds.src = ('https:' == document.location.protocol ? 'https://' : 'https://') + 'dn-growing.qbox.me/vds.js';
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(vds, s);
        })();
      })();
    </script>
  <script type="text/javascript" src="/rp/esee-editor/assets/scripts/vendor.js"></script><script type="text/javascript" src="/rp/esee-editor/assets/scripts/index.js"></script></body>
</html>
`

const tokens = parser.parse(html)
console.log(tokens)
