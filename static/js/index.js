(function () {
  function setHeight() {
    var height = parseInt(document.body.scrollHeight);
    var viewport = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    if (height < viewport) {
      document.body.style.height = '100vh';
    } else {
      document.body.style.height = '100%';
    }
  }
  window.onload = setHeight;
  window.onresize = setHeight;
}());
