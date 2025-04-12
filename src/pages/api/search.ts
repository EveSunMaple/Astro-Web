import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { remark } from "remark";
import strip from "strip-markdown";

interface SearchQuery {
  query: string;
  tags?: string[];
  categories?: string[];
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as SearchQuery;
    const { query, tags, categories } = body;

    if (!query || typeof query !== "string" || query.length < 2) {
      return new Response(
        JSON.stringify({
          error: "Invalid search query. Query must be at least 2 characters long.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // 获取所有非草稿文章
    const blogEntries = await getCollection("blog", ({ data }) => {
      return !data.draft;
    });

    // 处理 markdown 内容并提取纯文本
    const processor = remark().use(strip);
    
    // 过滤和处理文章
    const searchResults = await Promise.all(
      blogEntries
        // 先根据标签和分类过滤
        .filter((entry) => {
          // 如果没有指定标签或分类，则不过滤
          if (!tags?.length && !categories?.length) return true;
          
          // 检查标签匹配
          if (tags?.length && !tags.some(tag => entry.data.tags.includes(tag))) {
            return false;
          }
          
          // 检查分类匹配
          if (categories?.length && !categories.some(category => entry.data.categories.includes(category))) {
            return false;
          }
          
          return true;
        })
        // 然后处理每篇文章以提取内容并执行搜索
        .map(async (entry) => {
          const { title, description, tags = [], categories = [] } = entry.data;
          
          // 将 Markdown 转换为纯文本
          const { value: content } = await processor.process(entry.body);
          const contentText = String(content);
          
          // 转换为小写以进行不区分大小写的匹配
          const lowerCaseQuery = query.toLowerCase();
          const lowerCaseTitle = title.toLowerCase();
          const lowerCaseDescription = description ? description.toLowerCase() : "";
          const lowerCaseContent = contentText.toLowerCase();
          
          // 检查是否匹配
          const titleMatch = lowerCaseTitle.includes(lowerCaseQuery);
          const descriptionMatch = lowerCaseDescription.includes(lowerCaseQuery);
          const contentMatch = lowerCaseContent.includes(lowerCaseQuery);
          
          // 如果没有匹配，返回 null
          if (!titleMatch && !descriptionMatch && !contentMatch) {
            return null;
          }
          
          // 为匹配的内容创建摘要片段
          let snippet = "";
          
          if (contentMatch) {
            // 查找匹配位置的上下文
            const matchIndex = lowerCaseContent.indexOf(lowerCaseQuery);
            const startIndex = Math.max(0, matchIndex - 50);
            const endIndex = Math.min(contentText.length, matchIndex + query.length + 50);
            
            snippet = contentText.substring(startIndex, endIndex);
            
            // 如果摘要不是从内容开头开始，添加省略号
            if (startIndex > 0) {
              snippet = "..." + snippet;
            }
            
            // 如果摘要不是在内容末尾结束，添加省略号
            if (endIndex < contentText.length) {
              snippet = snippet + "...";
            }
          } else if (descriptionMatch) {
            snippet = description;
          }
          
          // 构建文章的 URL
          const url = `/blog/${entry.slug}`;
          
          return {
            title,
            url,
            snippet,
            tags,
            categories,
          };
        })
    );
    
    // 过滤掉 null 结果并进行排序
    const filteredResults = searchResults
      .filter(Boolean)
      .sort((a, b) => a.title.localeCompare(b.title));
    
    return new Response(JSON.stringify(filteredResults), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error performing search:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to perform search",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}; 