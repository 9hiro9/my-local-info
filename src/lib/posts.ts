import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  tags: string[];
  content: string;
}

export function getSortedPostsData(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // 날짜 처리 (Date 객체인 경우 YYYY-MM-DD 문자열로 변환)
      let date = data.date;
      if (date instanceof Date) {
        date = date.toISOString().split('T')[0];
      } else if (typeof date !== 'string') {
        date = '';
      }

      return {
        slug,
        title: data.title || '',
        date,
        summary: data.summary || '',
        category: data.category || '',
        tags: data.tags || [],
        content,
      } as PostData;
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug: string): PostData | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  let date = data.date;
  if (date instanceof Date) {
    date = date.toISOString().split('T')[0];
  } else if (typeof date !== 'string') {
    date = '';
  }

  return {
    slug,
    title: data.title || '',
    date,
    summary: data.summary || '',
    category: data.category || '',
    tags: data.tags || [],
    content,
  };
}
