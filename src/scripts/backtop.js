document.addEventListener('astro:page-load', () => {// 获取 ID 为 'back-to-top' 的元素，这是你的返回顶部按钮
    const backToTopButton = document.getElementById("back-to-top");

    // 监听 window 对象的 'scroll' 事件，当用户滚动页面时会触发这个事件
    window.addEventListener("scroll", () => {
        // window.pageYOffset 是页面垂直方向已滚动的像素数
        // 如果这个值大于 100，说明用户已经向下滚动了一段距离
        if (window.pageYOffset > 100) {
            // 显示返回顶部按钮
            backToTopButton.style.display = "block";
        } else {
            // 否则，隐藏返回顶部按钮
            backToTopButton.style.display = "none";
        }
    });

    // 监听返回顶部按钮的 'click' 事件，当用户点击按钮时会触发这个事件
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});