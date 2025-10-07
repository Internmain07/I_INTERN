import sys
import traceback
from app.api.v1.endpoints.resume import ResumeData, PersonalInfo, Education

# Test data
test_data = {
    "personalInfo": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "githubLink": "",
        "linkedinProfile": ""
    },
    "objective": "Test objective",
    "education": [{
        "degree": "BSc Computer Science",
        "college": "Test University",
        "cgpa": "8.5",
        "startDate": "2020",
        "endDate": "2024"
    }],
    "projects": [],
    "experience": [],
    "skills": ["Python", "FastAPI"],
    "certifications": []
}

try:
    print("Creating ResumeData object...")
    resume_data = ResumeData(**test_data)
    print("✓ ResumeData created successfully")
    
    print("\nTesting PDF generation...")
    from app.api.v1.endpoints.resume import generate_resume
    import asyncio
    
    result = asyncio.run(generate_resume(resume_data))
    print("✓ PDF generated successfully")
    print(f"Response type: {type(result)}")
    
except Exception as e:
    print(f"\n❌ Error occurred:")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {str(e)}")
    print("\nFull traceback:")
    traceback.print_exc()
