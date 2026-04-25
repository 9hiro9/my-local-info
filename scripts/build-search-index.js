const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
const postsDirPath = path.join(process.cwd(), 'src/content/posts');
const outputPath = path.join(process.cwd(), 'public/data/search-index.json');

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
      const localInfo = JSON.parse(fs.readFileSync(localInfoPath, 'utf-8'));
      
      const items = [
        ...(localInfo.festivals || []),
        ...(localInfo.benefits || [])
      ];

      items.forEach(item => {
        index.push({
          id: item.id.toString(),
          type: item.category === '행사' ? 'festival' : 'benefit',
          title: item.title,
          summary: item.summary,
          content: stripMarkdown(item.description).substring(0, 500),
          url: item.category === '행사' ? `/festivals/${item.id}` : `/benefits/${item.id}`
        });
      });
    } catch (e) {
      console.error('Error parsing local-info.json:', e);
    }
  }

  // 2. Process markdown posts
  if (fs.existsSync(postsDirPath)) {
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
