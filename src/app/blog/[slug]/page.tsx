import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-12 font-sans text-gray-800">
      {/* 상단 헤더 */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/blog" className="text-sm font-bold text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors">
            <span>←</span> 블로그 목록
          </Link>
          <Link href="/" className="text-lg font-bold text-orange-600 tracking-tight">
            성남시 생활 정보
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-12 sm:mt-16">
        <article>
          {/* 헤더 섹션 */}
          <header className="mb-12 text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
              <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">{post.category}</span>
              <time className="text-sm text-gray-400 font-medium">{post.date}</time>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed italic">
              "{post.summary}"
            </p>
          </header>

          {/* 본문 섹션 */}
          <div className="prose prose-orange prose-lg max-w-none break-words
            prose-headings:font-bold prose-headings:text-gray-900
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900
            prose-img:rounded-3xl prose-img:shadow-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 하단 태그 및 돌아가기 */}
          <footer className="mt-20 pt-10 border-t border-gray-100">
            <div className="flex flex-wrap gap-2 mb-10">
              {post.tags.map(tag => (
                <span key={tag} className="bg-gray-50 text-gray-400 text-xs font-semibold px-3 py-1.5 rounded-lg">#{tag}</span>
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95"
              >
                블로그 목록으로 돌아가기
              </Link>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}
