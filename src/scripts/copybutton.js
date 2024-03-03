document.addEventListener('astro:page-load', () => {
  var codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(function (codeBlock) {
    // 创建顶栏元素
    var titleBar = document.createElement('div');
    titleBar.className = 'title-bar';

    // 创建红灯按钮
    var closeButton = document.createElement('div');
    closeButton.className = 'button close';
    titleBar.appendChild(closeButton);

    // 创建黄灯按钮
    var minimizeButton = document.createElement('div');
    minimizeButton.className = 'button minimize';
    titleBar.appendChild(minimizeButton);

    // 创建绿灯按钮
    var maximizeButton = document.createElement('div');
    maximizeButton.className = 'button maximize';
    titleBar.appendChild(maximizeButton);

    // 创建标题元素
    var titleElement = document.createElement('span');
    titleElement.className = 'codetitle';
    titleElement.textContent = ' ';
    titleBar.appendChild(titleElement);

    // 设置顶栏元素样式，使其定位为相对定位（position: relative）
    titleBar.style.position = 'relative';
    
    // 设置按钮样式
    var buttons = titleBar.querySelectorAll('.button');
    buttons.forEach(function(button) {
      button.style.width = '12px';
      button.style.height = '12px';
      button.style.borderRadius = '50%';
      button.style.marginRight = '8px';
    });

    // 设置标题样式
    titleElement.style.flexGrow = '1';
    titleElement.style.textAlign = 'center';
    
    var copyButton = document.createElement('text');
    copyButton.className = 'copy';
    copyButton.textContent = '复制代码';


    // 创建包裹代码块和按钮的容器元素
    var container = document.createElement('div');
    container.className = 'code-container';

    // 将按钮添加到容器元素内
    container.appendChild(copyButton);
    container.appendChild(titleBar);

    // 将容器元素插入到代码块之前
    codeBlock.parentNode.insertBefore(container, codeBlock);

    // 设置容器元素样式，使其定位为相对定位（position: relative）
    container.style.position = 'relative';

    // 设置复制按钮样式，使其绝对定位于容器元素的右上角
    copyButton.style.position = 'absolute';
    copyButton.style.top = '0';
    copyButton.style.right = '0';
    copyButton.addEventListener('click', function () {
      // 获取代码块的文本内容
      var code = codeBlock.textContent;

      // 创建一个临时的textarea元素，并将代码块的内容设置为其值
      var textarea = document.createElement('textarea');
      textarea.value = code;

      // 将textarea元素追加到body中
      document.body.appendChild(textarea);

      // 选中textarea中的文本
      textarea.select();

      // 执行复制操作
      document.execCommand('copy');

      // 移除临时的textarea元素
      document.body.removeChild(textarea);

      // 修改复制按钮文本为“已复制”
      this.textContent = '复制成功';
      setTimeout(() => {
        this.textContent = '复制代码';
      }, 1500);
    });
  });
});