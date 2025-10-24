import { MacBookScene } from "@/components/3d/MacBookScene";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with 3D MacBook */}
      <section className="relative h-screen">
        <MacBookScene />
      </section>
    </div>
  );
}
