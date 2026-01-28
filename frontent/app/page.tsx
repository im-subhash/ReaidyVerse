import Feed from "@/components/Feed";
import PostDetailModal from "@/components/PostDetailModal";
import Suggestions from "@/components/Suggestions";

export default function Home() {
  return (
    <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '630px', width: '100%' }}>
        <Feed />
      </div>
      <Suggestions />
      <PostDetailModal />
    </div>
  );
}
