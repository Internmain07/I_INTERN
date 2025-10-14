# Test the Resume Builder API

import requests
import json

# Backend URL
API_URL = "http://localhost:8002/api/v1/resume/generate"

# Sample resume data
sample_data = {
    "personalInfo": {
        "fullName": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1 (555) 123-4567",
        "githubLink": "https://github.com/johndoe",
        "linkedinProfile": "https://linkedin.com/in/johndoe"
    },
    "objective": "Passionate and dedicated Computer Science student seeking a challenging software engineering internship position to apply my technical skills in real-world projects. Eager to contribute to innovative solutions while continuing to learn and grow in a professional environment.",
    "education": [
        {
            "degree": "Bachelor of Technology in Computer Science",
            "college": "Massachusetts Institute of Technology",
            "cgpa": "9.2",
            "startDate": "2021",
            "endDate": "2025"
        }
    ],
    "projects": [
        {
            "id": "1",
            "title": "E-Commerce Platform",
            "description": "Developed a full-stack e-commerce application using React, Node.js, and MongoDB. Implemented user authentication, product catalog, shopping cart, and payment integration. Deployed on AWS with CI/CD pipeline.",
            "techStack": ["React", "Node.js", "Express", "MongoDB", "AWS", "Docker"],
            "githubLink": "https://github.com/johndoe/ecommerce-platform"
        },
        {
            "id": "2",
            "title": "AI Chatbot for Customer Service",
            "description": "Built an intelligent chatbot using Python and TensorFlow to handle customer inquiries. Integrated with company website and achieved 85% accuracy in intent recognition. Reduced customer service workload by 40%.",
            "techStack": ["Python", "TensorFlow", "Flask", "Natural Language Processing"],
            "githubLink": "https://github.com/johndoe/ai-chatbot"
        }
    ],
    "experience": [
        {
            "id": "1",
            "role": "Software Engineering Intern",
            "company": "Tech Innovations Inc.",
            "startDate": "Jun 2023",
            "endDate": "Aug 2023",
            "responsibilities": [
                "Developed RESTful APIs using Node.js and Express for microservices architecture",
                "Optimized database queries resulting in 40% performance improvement",
                "Collaborated with cross-functional teams using Agile methodologies",
                "Wrote comprehensive unit tests achieving 90% code coverage"
            ]
        }
    ],
    "skills": [
        "JavaScript",
        "Python",
        "Java",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "PostgreSQL",
        "Docker",
        "AWS",
        "Git",
        "Agile/Scrum"
    ],
    "certifications": [
        {
            "id": "1",
            "name": "AWS Certified Developer - Associate",
            "institution": "Amazon Web Services",
            "year": "2023"
        },
        {
            "id": "2",
            "name": "Professional Scrum Master I",
            "institution": "Scrum.org",
            "year": "2023"
        }
    ]
}

def test_resume_generation():
    """Test the resume generation endpoint."""
    
    print("🚀 Testing Resume Builder API")
    print(f"📡 Endpoint: {API_URL}")
    print("=" * 60)
    
    try:
        # Send POST request
        print("\n📤 Sending resume data...")
        response = requests.post(
            API_URL,
            json=sample_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"✅ Response Status: {response.status_code}")
        print(f"📋 Content-Type: {response.headers.get('Content-Type')}")
        
        if response.status_code == 200:
            # Save PDF to file
            filename = "test_resume.pdf"
            with open(filename, 'wb') as f:
                f.write(response.content)
            
            print(f"\n✅ SUCCESS! PDF generated successfully!")
            print(f"💾 Saved as: {filename}")
            print(f"📊 PDF Size: {len(response.content)} bytes ({len(response.content) / 1024:.2f} KB)")
            print("\n🎉 You can now open the PDF file to view your resume!")
            
        else:
            print(f"\n❌ ERROR: Request failed")
            print(f"📄 Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to backend")
        print("💡 Make sure the backend is running on http://localhost:8002")
        print("   Run: cd backend && uvicorn app.main:app --reload --port 8002")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        print(traceback.format_exc())

if __name__ == "__main__":
    test_resume_generation()
