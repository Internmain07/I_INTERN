import React from "react";

// Mock internship data (9 items)
const internships = [
  {
    title: "Frontend Developer Intern",
    company: "Google",
    location: "Bangalore, India",
    duration: "3 Months",
    stipend: "₹20,000/mo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    title: "Data Analyst Intern",
    company: "Microsoft",
    location: "Hyderabad, India",
    duration: "6 Months",
    stipend: "₹25,000/mo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    title: "Backend Developer Intern",
    company: "Amazon",
    location: "Remote",
    duration: "4 Months",
    stipend: "₹22,000/mo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    title: "UI/UX Designer Intern",
    company: "Adobe",
    location: "Noida, India",
    duration: "3 Months",
    stipend: "₹18,000/mo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Adobe_Corporate_Logo.png",
  },
  {
    title: "Machine Learning Intern",
    company: "Meta",
    location: "Remote",
    duration: "6 Months",
    stipend: "₹30,000/mo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Meta_Platforms_Inc._logo.svg",
  },
  {
    title: "Product Manager Intern",
    company: "Apple",
    location: "Mumbai, India",
    duration: "3 Months",
    stipend: "₹28,000/mo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    title: "Cloud Engineer Intern",
    company: "IBM",
    location: "Pune, India",
    duration: "6 Months",
    stipend: "₹26,000/mo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  },
  {
    title: "Cybersecurity Intern",
    company: "Oracle",
    location: "Remote",
    duration: "4 Months",
    stipend: "₹24,000/mo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    title: "Digital Marketing Intern",
    company: "Spotify",
    location: "Delhi, India",
    duration: "3 Months",
    stipend: "₹19,000/mo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  },
];

export const InternshipCarousel: React.FC = () => {
  const [page, setPage] = React.useState(0);
  const internshipsPerPage = 3;
  const totalPages = Math.ceil(internships.length / internshipsPerPage);
  const startIdx = page * internshipsPerPage;
  const currentInternships = internships.slice(startIdx, startIdx + internshipsPerPage);

  return (
  <div className="w-full py-12 px-2 sm:px-8 flex flex-col items-center relative">
      <h1 className="text-2xl font-bold mb-8 text-[#004F4D]">Available Internships</h1>
      <div className="w-full mx-auto overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full">
          {currentInternships.map((internship, idx) => (
            <div
              key={idx}
              className="bg-[#F5F5DC] p-10 sm:p-14 rounded-2xl text-center w-full min-h-[340px] sm:min-h-[400px] flex flex-col items-center transition-transform duration-300 hover:scale-105"
            >
              <img
                src={internship.logo}
                alt={internship.company}
                className="h-12 w-auto mb-4 object-contain"
              />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#004F4D] mb-4 text-center">{internship.title}</h3>
              <p className="text-base sm:text-xl font-semibold text-[#004F4D] mb-2">{internship.company}</p>
              <p className="text-sm sm:text-base text-gray-700 mb-1">{internship.location}</p>
              <p className="text-sm sm:text-base text-gray-700 mb-1">{internship.duration}</p>
              <span className="text-[#004F4D] font-bold mt-2 text-base sm:text-lg">{internship.stipend}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Dots for pagination */}
      <div className="flex justify-center items-center mt-8 gap-3">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`w-4 h-4 rounded-full border-2 border-[#63D7C7] ${page === idx ? 'bg-[#63D7C7]' : 'bg-white'} transition-colors`}
            onClick={() => setPage(idx)}
            aria-label={`Go to page ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}



