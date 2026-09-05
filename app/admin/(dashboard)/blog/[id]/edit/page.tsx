import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { getPostById } from "@/lib/posts";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  if (!post) notFound();

  return <PostEditor post={post} />;
}
