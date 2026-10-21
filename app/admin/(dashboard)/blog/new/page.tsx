import PostEditor from "@/components/admin/PostEditor";
import { getKnownTags } from "@/lib/posts";

export default async function NewPostPage() {
  return <PostEditor knownTags={await getKnownTags()} />;
}
