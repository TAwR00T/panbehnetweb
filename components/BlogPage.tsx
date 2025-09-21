import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, AlertTriangle } from 'lucide-react';

// --- Data Type based on WordPress REST API ---
// Note: You might need to adjust this based on your exact WordPress setup (e.g., if you use different field names in ACF).
export interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  // FIX: Add content property to the Post interface to be used in BlogPostPage.tsx
  content: { rendered: string };
  date: string;
  _embedded: {
    author: { name: string, avatar_urls: { '96': string } }[];
    'wp:featuredmedia'?: { source_url: string }[];
    'wp:term'?: { name: string }[][];
  };
}

// --- Skeleton Loader Component ---
const SkeletonCard = ({ isFeatured = false }) => {
    if (isFeatured) {
        return (
             <div className="col-span-1 md:col-span-2 bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 animate-pulse">
                    <div className="p-8 flex flex-col justify-between">
                        <div>
                            <div className="h-6 w-24 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-10 w-full bg-gray-200 rounded-lg mb-3"></div>
                            <div className="h-8 w-3/4 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                        </div>
                        <div className="mt-6 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                                <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                            </div>
                             <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                        </div>
                    </div>
                     <div className="h-64 lg:h-auto bg-gray-200"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 overflow-hidden flex flex-col animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="h-5 w-20 bg-gray-200 rounded-full self-start mb-3"></div>
                <div className="h-6 w-full bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-6 w-3/4 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-2 flex-grow"></div>
                <div className="mt-4 pt-4 border-t border-gray-200/80 flex items-center justify-between">
                    <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
};


// --- Main Post Card Component ---
const PostCard = ({ post, isFeatured = false }: { post: Post, isFeatured?: boolean }) => {
    const title = post.title.rendered;
    const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '');
    const author = post._embedded?.author[0]?.name || 'تیم پنبه';
    // Using a placeholder avatar since WordPress API doesn't provide a simple emoji field.
    const authorAvatar = '📝'; 
    const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'عمومی';
    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1555949963-ff98c872d2e3?q=80&w=2070&auto=format&fit=crop';
    const postDate = new Date(post.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });

    if (isFeatured) {
        return (
            <motion.div 
                className="col-span-1 md:col-span-2 bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 flex flex-col justify-between text-right">
                        <div>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 font-bold rounded-full text-sm">{category}</span>
                            <a href={`/blog/${post.slug}`} className="block mt-4">
                                <h2 className="text-3xl font-extrabold text-gray-800 hover:text-orange-600 transition-colors" dangerouslySetInnerHTML={{ __html: title }} />
                            </a>
                            <p className="mt-3 text-gray-600 leading-relaxed">{excerpt}</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between text-gray-500">
                             <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{authorAvatar}</span>
                                    <span className="font-semibold">{author}</span>
                                </div>
                                <div className="flex items-center gap-2"><Calendar size={16} /><span>{postDate}</span></div>
                            </div>
                             <a href={`/blog/${post.slug}`} className="text-orange-600 font-bold flex items-center gap-1 group">
                                <span>ادامه مطلب</span><ArrowLeft size={16} className="transition-transform group-hover:translate-x-[-4px]" />
                            </a>
                        </div>
                    </div>
                     <div className="h-64 lg:h-auto overflow-hidden">
                        <picture>
                            <source type="image/webp" srcSet={featuredImage.replace(/\.(jpg|jpeg|png)$/, '.webp')} />
                            <img src={featuredImage} alt={`تصویر شاخص مقاله: ${title}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        </picture>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5 }}
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}
        >
            <a href={`/blog/${post.slug}`} className="block h-48 overflow-hidden">
                <picture>
                    <source type="image/webp" srcSet={featuredImage.replace(/\.(jpg|jpeg|png)$/, '.webp')} />
                    <img src={featuredImage} alt={`تصویر شاخص مقاله: ${title}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" decoding="async" />
                </picture>
            </a>
            <div className="p-6 flex flex-col flex-grow text-right">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full text-xs self-start">{category}</span>
                <a href={`/blog/${post.slug}`} className="block mt-3">
                    <h3 className="text-xl font-bold text-gray-800 hover:text-purple-600 transition-colors" dangerouslySetInnerHTML={{ __html: title }}/>
                </a>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-grow">{excerpt}</p>
                <div className="mt-4 pt-4 border-t border-gray-200/80 flex items-center justify-between text-xs text-gray-500">
                     <div className="flex items-center gap-2">
                        <span className="text-xl">{authorAvatar}</span>
                        <span className="font-semibold">{author}</span>
                    </div>
                    <div className="flex items-center gap-2"><Calendar size={14} /><span>{postDate}</span></div>
                </div>
            </div>
        </motion.div>
    );
};


const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'دانشنامه پنبه | مقالات و آموزش‌ها';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'جدیدترین مقالات، آموزش‌ها و اخبار مربوط به امنیت، حریم خصوصی و اینترنت آزاد را در دانشنامه پنبه VPN بخوانید.');
    }

    const fetchPosts = async () => {
        try {
            // Use the API proxy. _embed fetches related data like author, image, category in one request.
            const response = await fetch('/api/wp/v2/posts?_embed');
            if (!response.ok) {
                throw new Error('متاسفانه در دریافت مقالات مشکلی پیش آمد.');
            }
            const data = await response.json();
            setPosts(data);
        } catch (err: any) {
            setError(err.message);
            console.error("Failed to fetch posts:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchPosts();

  }, []);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  const renderContent = () => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SkeletonCard isFeatured={true} />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center bg-red-50/70 p-8 rounded-2xl">
                <AlertTriangle className="mx-auto text-red-500" size={48} />
                <h2 className="mt-4 text-xl font-bold text-red-700">خطا در بارگذاری</h2>
                <p className="mt-2 text-red-600">{error}</p>
            </div>
        );
    }
    
    if (posts.length === 0) {
        return <p className="text-center text-gray-500">مقاله‌ای برای نمایش وجود ندارد.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PostCard post={featuredPost} isFeatured={true} />
            {otherPosts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
  };

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
        
        {renderContent()}
      </div>
    </div>
  );
};

export default BlogPage;