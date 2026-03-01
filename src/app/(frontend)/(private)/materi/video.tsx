/* ================= TYPES ================= */
type Video = {
  id: number;
  title: string;
  video_url: string;
  usia: number;
};

/* ================= SERVER FETCH ================= */
async function getVideos(): Promise<Video[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dummy`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data video");
  }

  const json = await res.json();
  return json.data;
}

/* ================= COMPONENT ================= */
export default async function VideoSection() {
  const videos = await getVideos();

  return (
    <section className="w-full h-full bg-gradient-to-b from-pink-50 via-white to-pink-100 py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-pink-600">
            Video Edukasi
          </h2>
          <p className="mt-3 text-sm text-pink-400">
            Menuju Indonesia Sehat 🌸
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.id}
              className="
                group rounded-3xl border border-pink-100 
                bg-white/80 backdrop-blur 
                p-4 shadow-sm transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-200/50
              "
            >
              {/* Video */}
              <div className="aspect-video overflow-hidden rounded-2xl ring-1 ring-pink-100">
                <iframe
                  src={video.video_url.replace("watch?v=", "embed/")}
                  title={video.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Info */}
              <div className="mt-4 space-y-2">
                <h3 className="line-clamp-2 text-base font-semibold text-gray-800 group-hover:text-pink-600 transition">
                  {video.title}
                </h3>

                <span className="inline-flex items-center rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-600">
                  Usia {video.usia} tahun
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}