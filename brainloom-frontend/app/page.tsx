export default function HomePage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
        BrainLoom
      </h1>

      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        A modern platform to learn development, cyber security, and system design — structured like a knowledge graph.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <a
          href="/tutorials"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Explore Tutorials
        </a>

        <a
          href="/auth/login"
          className="px-6 py-3 border rounded-lg hover:bg-gray-100"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}