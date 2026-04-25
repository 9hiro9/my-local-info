const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 경로를 __dirname 기준으로 계산하여 실행 환경에 영향을 받지 않도록 합니다.
const rootDir = path.resolve(__dirname, '..');
const localInfoPath = path.join(rootDir, 'public/data/local-info.json');
const postsDirPath = path.join(rootDir, 'src/content/posts');
const outputPath = path.join(rootDir, 'public/data/search-index.json');

function stripMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^#+\s+/gm, '') 
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/^- /gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/---/g, '')
    .replace(/`{1,3}.*?`{1,3}/gs, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildIndex() {
  const index = [];

  // 1. Process local-info.json
  if (fs.existsSync(localInfoPath)) {
    try {
      const content = fs.readFileSync(localInfoPath, 'utf-8');
      const localInfo = JSON.parse(content);
      
      const items = [
        ...(localInfo.festivals || []),
        ...(localInfo.benefits || [])
      ];

      items.forEach(item => {
        if (item.title) {
          index.push({
            id: (item.id || Math.random()).toString(),
            type: item.category === '행사' ? 'festival' : 'benefit',
            title: item.title,
            summary: item.summary || '',
            content: stripMarkdown(item.description || '').substring(0, 500),
            url: item.category === '행사' ? `/festivals/${item.id}` : `/benefits/${item.id}`
          });
        }
      });
    } catch (e) {
      console.error('Error parsing local-info.json:', e);
    }
  } else {
    console.warn('local-info.json not found at:', localInfoPath);
  }

  // 2. Process markdown posts
  if (fs.existsSync(postsDirPath)) {
    try {
      const files = fs.readdirSync(postsDirPath).filter(f => f.endsWith('.md'));
      files.forEach(file => {
        try {
          const fullPath = path.join(postsDirPath, file);
          const fileContents = fs.readFileSync(fullPath, 'utf-8');
          const { data, content } = matter(fileContents);
          
          const plainText = stripMarkdown(content).substring(0, 500);
          const slug = file.replace('.md', '');

          index.push({
            id: slug,
            type: 'post',
            title: data.title || slug,
            summary: data.summary || '',
            content: plainText,
            url: `/blog/${slug}`
          });
        } catch (e) {
          console.error(`Error processing ${file}:`, e);
        }
      });
    } catch (e) {
      console.error('Error reading posts directory:', e);
    }
  }

  // Save index
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2));
  console.log(`Search index built: ${index.length} entries`);
}

buildIndex();
