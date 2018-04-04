

document.getElementById('jinianguan').addEventListener('tap', function() {
  //打开纪念馆页面
  mui.openWindow({
    url: 'jinianguan.html', 
    id:'jinianguan'
  });
});


document.getElementById('jiapu').addEventListener('tap', function() {
  //打开家谱页面
  mui.openWindow({
    url: 'jiapu.html', 
    id:'jiapu'
  });
});

document.getElementById('xingshi').addEventListener('tap', function() {
  //打开姓氏起源页面
  mui.openWindow({
    url: 'xingshi.html', 
    id:'xingshi'
  });
});

document.getElementById('personal').addEventListener('tap', function() {
  //打开个人中心页面
  mui.openWindow({
    url: 'personal.html', 
    id:'personal'
  });
});


