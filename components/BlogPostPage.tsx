import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, AlertTriangle } from 'lucide-react';
import type { Post } from './BlogPage'; // Re-use the interface

const SkeletonLoader = () => (
    <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-full mb-8"></div>
        <div className="h-6 w-32 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-12 w-full bg-gray-200 rounded-lg mb-2"></div>
        <div className="h-12 w-3/4 bg-gray-200 rounded-lg mb-6"></div>
        <div className="flex items-center gap-6 mb-8">
            <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-8 w-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="h-80 w-full bg-gray-200 rounded-3xl mb-8"></div>
        <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-10 w-1/2 bg-gray-200 rounded-lg mt-6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
    </div>
);

const BlogPostPage = ({ slug }: { slug: string }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
        if (!slug) return;
        try {
            const response = await fetch(`/api/wp/v2/posts?slug=${slug}&_embed`);
            if (!response.ok) throw new Error('Post not found');
            const data = await response.json();
            if (data.length === 0) throw new Error('پست مورد نظر یافت نشد.');
            setPost(data[0]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    const title = post.title.rendered;
    const metaDescription = post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 160);

    document.title = `${title} | وبلاگ پنبه VPN`;
    let metaDescEl = document.querySelector('meta[name="description"]');
    if (metaDescEl) metaDescEl.setAttribute('content', metaDescription);

    const schema = {
      "@context": "https://schema.org", "@type": "Article",
      "headline": title,
      "image": post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      "author": { "@type": "Person", "name": post._embedded?.author[0]?.name || 'تیم پنبه' },
      "publisher": { "@type": "Organization", "name": "Panbeh VPN", "logo": { "@type": "ImageObject", "url": "https://www.panbeh.vpn/favicon.svg" } },
      "datePublished": post.date,
      "description": metaDescription
    };
    
    const scriptId = 'blog-post-schema';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify(schema);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, [post]);

  if (loading) {
    return <div className="bg-white pt-24 sm:pt-32 pb-16"><div className="container mx-auto px-4 max-w-4xl"><SkeletonLoader /></div></div>;
  }

  if (error || !post) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center bg-white p-4">
        <div>
           <AlertTriangle className="mx-auto text-red-500" size={48} />
          <h1 className="text-4xl font-bold mt-4">۴۰۴ - یافت نشد</h1>
          <p className="mt-4 text-red-700">{error || 'متاسفانه مقاله‌ای که به دنبال آن بودید، پیدا نشد.'}</p>
          <a href="/blog" className="mt-6 inline-block bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">
            بازگشت به دانشنامه
          </a>
        </div>
      </div>
    );
  }

  const title = post.title.rendered;
  const author = post._embedded?.author[0]?.name || 'تیم پنبه';
  const authorAvatar = '📝';
  const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'عمومی';
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const postDate = new Date(post.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white pt-24 sm:pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <a href="/blog" className="text-orange-600 font-bold flex items-center gap-2 group w-fit">
              <ArrowLeft size={18} className="transition-transform group-hover:translate-x-[-4px]" />
              <span>بازگشت به همه مقالات</span>
            </a>
          </div>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 font-bold rounded-full text-sm">{category}</span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 my-4 leading-tight" dangerouslySetInnerHTML={{ __html: title }} />
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{authorAvatar}</span>
              <span className="font-semibold">{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{postDate}</span>
            </div>
          </div>
        </motion.div>

        {featuredImage && (
            <motion.div 
                className="my-8 rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            >
              <picture>
                <source type="image/webp" srcSet={featuredImage.replace(/\.(jpg|jpeg|png)$/, '.webp')} />
                <img src={featuredImage} alt={`تصویر اصلی مقاله: ${title}`} className="w-full h-auto object-cover" loading="lazy" decoding="async" />
              </picture>
            </motion.div>
        )}

        <motion.div 
            className="prose prose-lg max-w-none text-right text-gray-700"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        >
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;