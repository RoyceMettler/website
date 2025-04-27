// components/ExperienceSection.jsx

const experiences = [
    {
      title: "AI Engineering Intern",
      company: "Vitu",
      time: "June 2023 - August 2023",
      description: "Built GPT-4 powered chatbot for vehicle registration support."
    },
    {
      title: "Junior AI Engineer",
      company: "Vitu",
      time: "Sept 2023 - Aug 2024",
      description: "Developed churn prediction neural network with 92% accuracy."
    },
    {
      title: "AI Researcher",
      company: "Cognition, Creativity, and Communication Lab",
      time: "Sept 2023 - June 2024",
      description: "Created 'Satyrn', a model for verifiable AI outputs."
    }
  ];
  
  export default function ExperienceSection() {
    return (
      <section className="bg-white py-12" id="experience">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Experience</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {experiences.map((exp, index) => (
              <div key={index} className="border p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-2xl font-semibold mb-2">{exp.title}</h3>
                <p className="text-gray-500 mb-1">{exp.company}</p>
                <p className="text-gray-400 text-sm mb-4">{exp.time}</p>
                <p className="text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  