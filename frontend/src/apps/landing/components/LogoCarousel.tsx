import React from "react";

const companyLogos = [
	{
		name: "Google",
		src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
	},
	{
		name: "Microsoft",
		src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
	},
	{
		name: "Amazon",
		src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
	},
	{
		name: "Tesla",
		src: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
	},
	{
		name: "Apple",
		src: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
	},
	{
		name: "Netflix",
		src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
	},
	{
		name: "IBM",
		src: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
	},
	{
		name: "Oracle",
		src: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
	},
	{
		name: "Spotify",
		src: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
	},
	{
		name: "Twitter",
		src: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg",
	},
	{
		name: "PayPal",
		src: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg",
	},
	{
		name: "LinkedIn",
		src: "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png",
	},
	{
		name: "Samsung",
		src: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
	},
];

export const LogoCarousel: React.FC = () => {
	// Duplicate the logos for seamless looping
	const logos = [...companyLogos, ...companyLogos];
	return (
		<div className="w-full py-8 flex flex-col items-center relative">
			<h2 className="text-xl font-semibold mb-4 text-[#F8FAFC] drop-shadow-sm">
				Trusted by Top Companies
			</h2>
			<div className="w-full overflow-x-hidden relative hide-scrollbar">
				<div
					className="flex gap-8 items-center animate-scroll-x relative"
					style={{ minWidth: "max-content" }}
				>
					{logos.map((logo, idx) => (
						<img
							key={logo.name + idx}
							src={logo.src}
							alt={logo.name}
							className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition duration-300 drop-shadow-md bg-white/80 rounded-lg p-2"
							title={logo.name}
							style={{ filter: "none" }}
						/>
					))}
				</div>
			</div>
			<style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-x {
          animation: scroll-x 30s linear infinite;
        }
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
		</div>
	);
};



