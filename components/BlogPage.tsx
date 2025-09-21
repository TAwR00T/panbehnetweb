import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { posts, Post } from '../mock-posts';
import { Calendar, User, ArrowLeft } from 'lucide-react';

const PostCard = ({ post, isFeatured = false }: { post: Post, isFeatured?: boolean }) => {
    if (isFeatured) {
        return (
            <motion.div 
                className="col-span-1 md:col-span-2 bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 flex flex-col justify-between text-right">
                        <div>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 font-bold rounded-full text-sm">{post.category}</span>
                            <a href={`/blog/${post.slug}`} className="block mt-4">
                                <h2 className="text-3xl font-extrabold text-gray-800 hover:text-orange-600 transition-colors">{post.title}</h2>
                            </a>
                            <p className="mt-3 text-gray-600 leading-relaxed">{post.excerpt}</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-gray-500">
                             <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{post.author.avatar}</span>
                                    <span className="font-semibold">{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{post.date}</span>
                                </div>
                            </div>
                             <a href={`/blog/${post.slug}`} className="text-orange-600 font-bold flex items-center gap-1 group">
                                <span>ادامه مطلب</span>
                                <ArrowLeft size={16} className="transition-transform group-hover:translate-x-[-4px]" />
                            </a>
                        </div>
                    </div>
                     <div className="h-64 lg:h-auto overflow-hidden">
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}
        >
            <a href={`/blog/${post.slug}`} className="block h-48 overflow-hidden">
                <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" decoding="async" />
            </a>
            <div className="p-6 flex flex-col flex-grow text-right">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full text-xs self-start">{post.category}</span>
                <a href={`/blog/${post.slug}`} className="block mt-3">
                    <h3 className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors">{post.title}</h3>
                </a>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-grow">{post.excerpt}</p>
                <div className="mt-4 pt-4 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500">
                     <div className="flex items-center gap-2">
                        <span className="text-xl">{post.author.avatar}</span>
                        <span className="font-semibold">{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{post.date}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


const BlogPage = () => {
  useEffect(() => {
    document.title = 'دانشنامه پنبه | مقالات و آموزش‌ها';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'جدیدترین مقالات، آموزش‌ها و اخبار مربوط به امنیت، حریم خصوصی و اینترنت آزاد را در دانشنامه پنبه VPN بخوانید.');
    }
  }, []);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="bg-gradient-to-b from-orange-50 via-rose-50 to-purple-50 py-24 sm:py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-4xl md:text-5xl font-black text-gray-800">دانشنامه پنبه</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                مرکز دانش شما برای امنیت، سرعت و هر چیزی که به دنیای آزاد اینترنت مربوط می‌شود.
            </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PostCard post={featuredPost} isFeatured={true} />
            {otherPosts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;