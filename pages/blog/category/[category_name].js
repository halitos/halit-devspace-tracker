import fs from "fs";
import matter from "gray-matter";
import path from "path";
import Layout from "../../../components/Layout";
import Post from "../../../components/Post";
import CategoryList from "../../../components/CategoryList";
import { getPosts } from "../../../lib/posts";

export default function CategoryPage({ posts, categoryName, categories }) {
  return (
    <Layout>
      <div className="flex justify-between">
        <div className="w-full lg:w-3/4 lg:mr-10">
          <h1 className="text-3xl text-center md:text-5xl md:text-left border-b-4 p-5 font-bold">
            Posts in {categoryName}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, index) => (
              <Post key={index} post={post} />
            ))}
          </div>
        </div>
        <div className="hidden lg:inline w-1/4">
          <CategoryList categories={categories} />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join("posts"));

  const categories = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join("posts", filename),
      "utf-8"
    );

    const { data: frontmatter } = matter(markdownWithMeta);

    return frontmatter.category.toLowerCase();
  });

  const paths = categories.map((category) => ({
    params: { category_name: category },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { category_name } }) {
  const posts = getPosts();

  // Get Categoried for Sidebar
  const categories = [
    ...new Set(posts.map((post) => post.frontmatter.category)),
  ];

  // Filter posts by category
  const categoryPosts = posts.filter(
    (post) => post?.frontmatter?.category.toLowerCase() === category_name
  );

  return {
    props: {
      posts: categoryPosts,
      categoryName: category_name,
      categories,
    },
  };
}
