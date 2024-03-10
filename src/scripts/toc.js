document.addEventListener('astro:page-load', () => {
  // 获取页面中的标题元素
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  // 生成目录框内容
  const generateTocContent = () => {
    let tocContent = '<ul>';
    let levelCounters = [0, 0, 0, 0, 0, 0]; // 最多支持六级标题
    headings.forEach((heading) => {
      const headingId = heading.id;
      const headingText = heading.textContent;
      const headingLevel = parseInt(heading.tagName.charAt(1));
      if (headingId && headingText && headingLevel) {
        const level = parseInt(heading.tagName.charAt(1), 10) - 1;
        levelCounters[level]++;
        levelCounters.fill(0, level + 1);
        const numbering = levelCounters.slice(1, level + 1).join('.');
        tocContent += `<li><a class="level-${headingLevel}" href="#${headingId}"><span class="toc-number">${numbering}</span>${headingText}</a></li>`;
      }
    });
    tocContent += '</ul>';
    return tocContent;
  };

  // 隐藏目录框
  const hideTocBox = () => {
    const tocBox = document.getElementById('toc-box');
    tocBox.classList.remove('show');
    tocBox.classList.add('hide');
  };

  // 切换目录框的显示和隐藏
  const toggleTocBox = () => {
    const tocBox = document.getElementById('toc-box');
    if (tocBox.classList.contains('show')) {
      hideTocBox(); // 隐藏目录框
    } else {
      tocBox.innerHTML = generateTocContent();
      tocBox.style.display = 'block';
      tocBox.classList.remove('hide');
      tocBox.classList.add('show');
    }
  };

  // 目录按钮点击事件
  const tocButton = document.getElementById('toc-button');
  tocButton.addEventListener('click', toggleTocBox);

  // 页面滚动事件，显示或隐藏目录按钮
  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY || window.pageYOffset;
    const tocButton = document.getElementById('toc-button');
    if (scrollPosition > 200) {
      tocButton.classList.remove('hide');
      tocButton.classList.add('show');
    } else {
      tocButton.classList.remove('show');
      tocButton.classList.add('hide');
      hideTocBox(); // 隐藏目录框
    }
  });
});