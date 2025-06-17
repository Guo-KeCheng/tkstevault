CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content jsonb,
  category text,
  tags text[],
  image_url text,
  video_url text,
  media_urls text[],
  author_id uuid REFERENCES auth.users(id),
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.blog_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  media_type text CHECK (media_type IN ('image', 'video')),
  media_url text NOT NULL,
  caption text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

alter publication supabase_realtime add table blog_posts;
alter publication supabase_realtime add table blog_media;