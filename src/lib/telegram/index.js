import * as cheerio from "cheerio";
import { LRUCache } from "lru-cache";
import { $fetch } from "ofetch";
import { getEnv } from "../env";

const cache = new LRUCache({
  ttl: 1000 * 60 * 5, // 5 minutes
  maxSize: 50 * 1024 * 1024, // 50MB
  sizeCalculation: (item) => {
    return JSON.stringify(item).length;
  },
});

function getVideoStickers($, item, { staticProxy, index }) {
  return $(item).find(".js-videosticker_video")?.map((_index, video) => {
    const url = $(video)?.attr("src");
    const imgurl = $(video).find("img")?.attr("src");
    return `
    <div style="background-image: none; width: 256px;">
      <video src="${staticProxy + url}" width="100%" height="100%" alt="Video Sticker" preload muted autoplay loop playsinline disablepictureinpicture >
        <img class="sticker" src="${staticProxy + imgurl}" alt="Video Sticker" loading="${index > 15 ? "eager" : "lazy"}" />
      </video>
    </div>
    `;
  })?.get()?.join("");
}

function getImageStickers($, item, { staticProxy, index }) {
  return $(item).find(".tgme_widget_message_sticker")?.map((_index, image) => {
    const url = $(image)?.attr("data-webp");
    return `<img class="sticker" src="${staticProxy + url}" style="width: 256px;" alt="Sticker" loading="${index > 15 ? "eager" : "lazy"}" />`;
  })?.get()?.join("");
}

function getImages($, item, { staticProxy, id, index, title }) {
  const images = $(item).find(".tgme_widget_message_photo_wrap")?.map((_index, photo) => {
    const url = $(photo).attr("style").match(/url\(["'](.*?)["']/)?.[1];
    return `
      <img src="${staticProxy + url}" alt="${title}" class="w-full max-w-sm rounded-lg shadow-md" loading="${index > 15 ? "eager" : "lazy"}" />
    `;
  })?.get();
  return images.length ? `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">${images?.join("")}</div>` : "";
}

function getVideo($, item, { staticProxy, index }) {
  const video = $(item).find(".tgme_widget_message_video_wrap video");
  video?.attr("src", staticProxy + video?.attr("src"))
    ?.attr("controls", true)
    ?.attr("preload", index > 15 ? "auto" : "metadata")
    ?.attr("playsinline", true)
    .attr("webkit-playsinline", true)
    .attr("class", "w-full max-w-lg rounded-lg shadow-md");

  const roundVideo = $(item).find(".tgme_widget_message_roundvideo_wrap video");
  roundVideo?.attr("src", staticProxy + roundVideo?.attr("src"))
    ?.attr("controls", true)
    ?.attr("preload", index > 15 ? "auto" : "metadata")
    ?.attr("playsinline", true)
    .attr("webkit-playsinline", true)
    .attr("class", "w-64 h-64 rounded-full shadow-md object-cover");

  return $.html(video) + $.html(roundVideo);
}

function getAudio($, item, { staticProxy }) {
  const audio = $(item).find(".tgme_widget_message_voice");
  audio?.attr("src", staticProxy + audio?.attr("src"))
    ?.attr("controls", true);
  return $.html(audio);
}

function getLinkPreview($, item, { staticProxy, index }) {
  const link = $(item).find(".tgme_widget_message_link_preview");
  const title = $(item).find(".link_preview_title")?.text() || $(item).find(".link_preview_site_name")?.text();
  const description = $(item).find(".link_preview_description")?.text();
  const url = link?.attr("href");

  const image = $(item).find(".link_preview_image");
  const src = image?.attr("style")?.match(/url\(["'](.*?)["']/i)?.[1];
  const imageSrc = src ? staticProxy + src : "";

  return `
    <a href="${url}" target="_blank" rel="noopener" title="${description || title}" class="card w-full max-w-md bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
      ${imageSrc
        ? `
        <figure>
          <img src="${imageSrc}" alt="${title}" class="w-full h-48 object-cover rounded-t-lg" loading="${index > 15 ? "eager" : "lazy"}" />
        </figure>
      `
        : ""}
      <div class="card-body">
        <h2 class="card-title text-lg font-semibold text-primary truncate">${title}</h2>
        ${description ? `<p class="text-sm text-gray-600 line-clamp-2">${description}</p>` : ""}
      </div>
    </a>
  `;
}

function getReply($, item, { channel }) {
  const reply = $(item).find(".tgme_widget_message_reply");
  reply?.wrapInner("<small></small>")?.wrapInner("<blockquote></blockquote>");

  const href = reply?.attr("href");
  if (href) {
    const url = new URL(href);
    reply?.attr("href", `${url.pathname}`.replace(new RegExp(`/${channel}/`, "i"), "/posts/"));
  }

  return $.html(reply);
}

function modifyHTMLContent($, content, { index } = {}) {
  $(content).find(".emoji")?.removeAttr("style");
  $(content).find("a")?.each((_index, a) => {
    $(a)?.attr("title", $(a)?.text())?.removeAttr("onclick").attr("class", "link link-primary");
  });
  $(content).find("tg-spoiler")?.each((_index, spoiler) => {
    const id = `spoiler-${index}-${_index}`;
    $(spoiler)?.attr("id", id)?.wrap("<label class=\"btn btn-ghost spoiler-button\"></label>").before(`<input type="checkbox" class="hidden" />`);
  });
  $(content).find("pre")?.attr("class", "mockup-code p-4 bg-base-200");
  return content;
}

function getPost($, item, { channel, staticProxy, index = 0 }) {
  item = item ? $(item).find(".tgme_widget_message") : $(".tgme_widget_message");
  const content = $(item).find(".js-message_reply_text")?.length > 0
    ? modifyHTMLContent($, $(item).find(".tgme_widget_message_text.js-message_text"), { index })
    : modifyHTMLContent($, $(item).find(".tgme_widget_message_text"), { index });
  const title = content?.text()?.match(/^.*?(?=[。\n]|http\S)/g)?.[0] ?? content?.text() ?? "";
  const id = $(item).attr("data-post")?.replace(new RegExp(`${channel}/`, "i"), "");

  const tags = $(content).find("a[href^=\"?q=\"]")?.each((_index, a) => {
    $(a)?.attr("href", `/search/${encodeURIComponent($(a)?.text())}`);
  })?.map((_index, a) => $(a)?.text()?.replace("#", ""))?.get();

  return {
    id,
    title,
    type: $(item).attr("class")?.includes("service_message") ? "service" : "text",
    datetime: $(item).find(".tgme_widget_message_date time")?.attr("datetime"),
    tags,
    text: content?.text(),
    content: [
      getReply($, item, { channel }),
      getImages($, item, { staticProxy, id, index, title }),
      getVideo($, item, { staticProxy, id, index, title }),
      getAudio($, item, { staticProxy, id, index, title }),
      content?.html(),
      getImageStickers($, item, { staticProxy, index }),
      getVideoStickers($, item, { staticProxy, index }),
      $(item).find(".tgme_widget_message_poll")?.html(),
      $.html($(item).find(".tgme_widget_message_document_wrap")),
      $.html($(item).find(".tgme_widget_message_video_player.not_supported")),
      $.html($(item).find(".tgme_widget_message_location_wrap")),
      getLinkPreview($, item, { staticProxy, index }),
    ].filter(Boolean).join("").replace(/(url\(["'])((https?:)?\/\/)/g, (match, p1, p2, _p3) => {
      if (p2 === "//") {
        p2 = "https://";
      }
      if (p2?.startsWith("t.me")) {
        return false;
      }
      return `${p1}${staticProxy}${p2}`;
    }),
  };
}

const unnessaryHeaders = ["host", "cookie", "origin", "referer"];

export async function getChannelInfo(Astro, { before = "", after = "", q = "", type = "list", id = "" } = {}) {
  const cacheKey = JSON.stringify({ before, after, q, type, id });
  const cachedResult = cache.get(cacheKey);

  if (cachedResult) {
    console.info("Match Cache", { before, after, q, type, id });
    return JSON.parse(JSON.stringify(cachedResult));
  }

  const host = getEnv(import.meta.env, Astro, "TELEGRAM_HOST") ?? "t.me";
  const channel = getEnv(import.meta.env, Astro, "CHANNEL");
  const staticProxy = "";

  const url = id ? `https://${host}/${channel}/${id}?embed=1&mode=tme` : `https://${host}/s/${channel}`;
  const headers = Object.fromEntries(Astro.request.headers);

  Object.keys(headers).forEach((key) => {
    if (unnessaryHeaders.includes(key)) {
      delete headers[key];
    }
  });

  console.info("Fetching", url, { before, after, q, type, id });
  const html = await $fetch(url, {
    headers,
    query: {
      before: before || undefined,
      after: after || undefined,
      q: q || undefined,
    },
    retry: 3,
    retryDelay: 100,
  });

  const $ = cheerio.load(html, {}, false);
  if (id) {
    const post = getPost($, null, { channel, staticProxy });
    cache.set(cacheKey, post);
    return post;
  }
  const posts = $(".tgme_channel_history  .tgme_widget_message_wrap")?.map((index, item) => {
    return getPost($, item, { channel, staticProxy, index });
  })?.get()?.reverse().filter(post => ["text"].includes(post.type) && post.id && post.content);

  const channelInfo = {
    posts,
    title: $(".tgme_channel_info_header_title")?.text(),
    description: $(".tgme_channel_info_description")?.text(),
    descriptionHTML: modifyHTMLContent($, $(".tgme_channel_info_description"))?.html(),
    avatar: $(".tgme_page_photo_image img")?.attr("src"),
  };

  cache.set(cacheKey, channelInfo);
  return channelInfo;
}
