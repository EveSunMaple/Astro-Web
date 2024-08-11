// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

// Site title and description
export const SITE_TAB = "SaroProck";
export const SITE_TITLE = "SaroProck ⚡";
export const SITE_DESCRIPTION = "一本本子";
export const DATE_FORMAT = "ddd MMM DD YYYY";

// User profile information
export const USER_NAME = "EveSunMaple";
export const USER_AVATAR = "/profile.webp";

// Server and transition settings
export const SERVER_URL = "https://waline.saroprock.com";
export const TRANSITION_API = true;

// Site theme
export const siteTheme = {
  light: "winter",
  dark: "dracula",
};

// Some informative text on the site
export const infoTest = {
  tag: "标签：",
  noTag: "未分类", //untagged
  tagCard: "标签",
  tagPage: "Tag - ",
  noCategory: "未分类", //uncategorized
  categoryCard: "分类",
  categoryPage: "Category - ",
  link: "链接：",
  prevPage: "上一页",
  nextPage: "下一页",
};

// Menu items for navigation
export const menuItems = [
  { id: "home", text: "首页", href: "/", svg: "home", target: "_self" }, // Home page
  { id: "about", text: "关于", href: "/about", svg: "about", target: "_self" }, // About page
  {
    id: "blog",
    text: "博客",
    href: "/blog",
    svg: "blog",
    target: "_self",
    subItems: [
      {
        id: "all",
        text: "所有博客",
        href: "/blog",
        svg: "post",
        target: "_self",
      }, // All blog
      {
        id: "tech",
        text: "技术博客",
        href: "/blog/categories/技术",
        svg: "cube",
        target: "_self",
      }, // Technology category
      {
        id: "life",
        text: "生活博客",
        href: "/blog/categories/生活",
        svg: "heart",
        target: "_self",
      }, // Life category
      {
        id: "categories",
        text: "所有分类",
        href: "/blog/categories",
        svg: "categories",
        target: "_self",
      }, // All categories
    ],
  }, // Blog page with sub-items
  {
    id: "project",
    text: "项目",
    href: "/project",
    svg: "project",
    target: "_self",
  }, // Projects page
  {
    id: "friend",
    text: "朋友",
    href: "/friend",
    svg: "friend",
    target: "_self",
  }, // Friends page
  {
    id: "contact",
    text: "联系",
    href: "mailto:contact.evesunmaple@outlook.com", // Contact email
    target: "_blank", // Open in a new tab
    svg: "contact",
  },
];

// Social media and contact icons
export const socialIcons = [
  {
    href: "https://afdian.net/a/saroprock",
    ariaLabel: "Support my work",
    title: "Support my work",
    svg: "support",
  },
  {
    href: "https://github.com/EveSunMaple",
    ariaLabel: "Github",
    title: "Github",
    svg: "github",
  },
  {
    href: "https://space.bilibili.com/438392347",
    ariaLabel: "BiliBili",
    title: "BiliBili",
    svg: "bilibili",
  },
  {
    href: "/rss.xml",
    ariaLabel: "RSS Feed",
    title: "RSS Feed",
    svg: "rss",
  },
];
// Category Information
export const categoriesInfo = [
  { title: "技术", desc: "有关技术的一些文章", target: "_self" },
  { title: "生活", desc: "生活中的所见所思所想", target: "_self" },
  { title: "OI学习笔记", desc: "OIer 的“圣遗物”", target: "_self" },
  { title: "作文", desc: "和随笔有些不同", target: "_self" },
];
