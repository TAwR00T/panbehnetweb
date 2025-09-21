
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { posts, Post } from '../mock-posts';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const BlogPostPage = ({ slug }: { slug: string }) => {
  const post = posts.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) return;

    // 1. Set Title
    document.title = `${post.title} | وبلاگ پنبه VPN`;

    // 2. Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', post.metaDescription);
    }

    // 3. Set JSON-LD structured data
    const schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "image": post.featuredImage,
      "author": {
        "@type": "Person",
        "name": post.author.name
      },
      "publisher": {
        "@type": "Organization",
        "name": "Panbeh VPN",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.panbeh.vpn/favicon.svg"
        }
      },
      "datePublished": new Date().toISOString().split('T')[0], // Use a dynamic date for simplicity
      "description": post.metaDescription
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

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [post]);

  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen text-center">
        <div>
          <h1 className="text-4xl font-bold">۴۰۴ - صفحه یافت نشد</h1>
          <p className="mt-4">متاسفانه مقاله‌ای که به دنبال آن بودید، پیدا نشد.</p>
          <a href="/blog" className="mt-6 inline-block bg-orange-500 text-white font-bold py-2 px-4 rounded-lg">
            بازگشت به دانشنامه
          </a>
        </div>
      </div>
    );
  }

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
          <span className="px-3 py-1 bg-orange-100 text-orange-700 font-bold rounded-full text-sm">{post.category}</span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-800 my-4 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{post.author.avatar}</span>
              <span className="font-semibold">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
            className="my-8 rounded-3xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img src={post.featuredImage} alt={post.title} className="w-full h-auto object-cover" />
        </motion.div>

        <motion.div 
            className="prose prose-lg max-w-none text-right text-gray-700"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.4 }}
            dangerouslySetInnerHTML={{ __html: post.content }}
        >
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPostPage;
