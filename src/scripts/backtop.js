document.addEventListener('astro:page-load', () => {// 获取 ID 为 'back-to-top' 的元素，这是你的返回顶部按钮
    const backToTopButton = document.getElementById("back-to-top");

    window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY || window.pageYOffset;
        if (scrollPosition > 200) {
            backToTopButton.classList.remove('hide');
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
            backToTopButton.classList.add('hide');
        }
    });

    // 监听返回顶部按钮的 'click' 事件，当用户点击按钮时会触发这个事件
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});