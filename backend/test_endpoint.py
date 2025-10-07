import requests
import json

# Test data matching the frontend structure
test_data = {
    "personalInfo": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "githubLink": "https://github.com/johndoe",
        "linkedinProfile": "https://linkedin.com/in/johndoe"
    },
    "objective": "Seeking an internship position to apply my skills in software development and contribute to innovative projects.",
    "education": [
        {
            "degree": "Bachelor of Technology in Computer Science",
            "college": "ABC University",
            "cgpa": "8.5",
            "startDate": "2020-08",
            "endDate": "2024-06"
        }
    ],
    "projects": [
        {
            "id": "1",
            "title": "E-commerce Platform",
            "description": "Built a full-stack e-commerce platform with React and Node.js",
            "techStack": ["React", "Node.js", "MongoDB"],
            "githubLink": "https://github.com/johndoe/ecommerce"
        }
    ],
    "experience": [
        {
            "id": "1",
            "role": "Software Developer Intern",
            "company": "XYZ Corp",
            "startDate": "2023-06",
            "endDate": "2023-08",
            "responsibilities": [
                "Developed REST APIs using FastAPI",
                "Implemented authentication system",
                "Wrote unit tests"
            ]
        }
    ],
    "skills": ["Python", "JavaScript", "React", "FastAPI", "MongoDB"],
    "certifications": [
        {
            "id": "1",
            "name": "AWS Certified Developer",
            "institution": "Amazon Web Services",
            "year": "2023"
        }
    ]
}

print("Sending POST request to http://localhost:8000/api/v1/resume/generate")
print(f"Data: {json.dumps(test_data, indent=2)}")

try:
    response = requests.post(
        "http://localhost:8000/api/v1/resume/generate",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\nResponse status code: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Success! PDF generated")
        print(f"Content-Type: {response.headers.get('content-type')}")
        print(f"Content-Length: {len(response.content)} bytes")
        
        # Save the PDF
        with open("test_resume.pdf", "wb") as f:
            f.write(response.content)
        print("PDF saved as test_resume.pdf")
    else:
        print(f"❌ Error: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ Exception occurred: {str(e)}")
    import traceback
    traceback.print_exc()
