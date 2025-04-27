// components/HeroSection.jsx

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-transparent relative z-10">
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">
        Royce Mettler
      </h1>
      <p className="text-xl md:text-2xl text-gray-300 mb-6">
        Cool Thing 1 | Cool Thing 2 | Cool Thing 3
      </p>
      <a
        href="mailto:roycemettler@gmail.com"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700 transition"
      >
        Contact Me
      </a>
    </section>
  );
}