from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Optional
import weasyprint
from jinja2 import Template
import io

router = APIRouter(
    prefix="/resume",
    tags=["Resume Builder"]
)

# Pydantic models (These will be moved to a central models directory later)
class PersonalInfo(BaseModel):
    fullName: str
    email: str
    phone: str
    githubLink: Optional[str] = ""
    linkedinProfile: Optional[str] = ""

class Education(BaseModel):
    degree: str
    college: str
    cgpa: str
    startDate: str
    endDate: str

class Project(BaseModel):
    id: str
    title: str
    description: str
    techStack: List[str]
    githubLink: Optional[str] = ""

class Experience(BaseModel):
    id: str
    role: str
    company: str
    startDate: str
    endDate: str
    responsibilities: List[str]

class Certification(BaseModel):
    id: str
    name: str
    institution: str
    year: str

class ResumeData(BaseModel):
    personalInfo: PersonalInfo
    objective: str
    education: List[Education]
    projects: List[Project]
    experience: List[Experience]
    skills: List[str]
    certifications: List[Certification]

# HTML template for the resume (This can be moved to a separate template file later)
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ personal_info.fullName }} - Resume</title>
    <style>
        /* A more modern and professional resume template */
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&display=swap');
        body {
            font-family: 'Manrope', 'Segoe UI', Arial, sans-serif;
            background: #f8fafc;
            color: #22223b;
            font-size: 11pt;
            margin: 0;
        }
        .container {
            max-width: 820px;
            margin: 40px auto;
            background: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 32px rgba(30,64,175,0.08), 0 1.5px 6px rgba(0,0,0,0.04);
            padding: 48px 56px;
        }
        .header {
            text-align: left;
            border-bottom: 2.5px solid #2563eb;
            padding-bottom: 18px;
            margin-bottom: 32px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .name {
            font-size: 28pt;
            font-weight: 700;
            color: #2563eb;
            letter-spacing: 1px;
        }
        .contact-info {
            font-size: 10.5pt;
            color: #4b5563;
            display: flex;
            gap: 18px;
            flex-wrap: wrap;
        }
        .contact-info a {
            color: #2563eb;
            text-decoration: underline;
        }
        .section {
            margin-bottom: 32px;
        }
        .section-title {
            font-size: 15pt;
            font-weight: 700;
            color: #22223b;
            margin-bottom: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 1.5px solid #e5e7eb;
            padding-bottom: 6px;
        }
        .objective {
            font-size: 11.5pt;
            line-height: 1.7;
            text-align: justify;
            margin-bottom: 18px;
            color: #3a3a3a;
        }
        .education-item {
            margin-bottom: 12px;
        }
        .degree {
            font-weight: 700;
            font-size: 13pt;
            color: #2563eb;
        }
        .college {
            font-weight: 500;
            color: #374151;
            margin-bottom: 2px;
        }
        .education-details {
            font-size: 10.5pt;
            color: #6b7280;
        }
        .project-item, .experience-item, .certification-item {
            margin-bottom: 18px;
            padding: 16px 0 0 0;
            border-top: 1px solid #e5e7eb;
        }
        .project-title, .role {
            font-weight: 700;
            font-size: 12.5pt;
            color: #2563eb;
        }
        .company, .project-meta {
            font-weight: 500;
            color: #374151;
            font-size: 10.5pt;
            margin-bottom: 4px;
        }
        .tech-stack {
            margin: 8px 0;
        }
        .tech-item {
            display: inline-block;
            background: #e0e7ff;
            color: #2563eb;
            padding: 3px 10px;
            border-radius: 14px;
            font-size: 9.5pt;
            margin-right: 7px;
            margin-bottom: 4px;
        }
        .responsibilities {
            list-style: none;
            padding-left: 0;
            margin-top: 8px;
        }
        .responsibilities li {
            margin-bottom: 6px;
            padding-left: 18px;
            position: relative;
            font-size: 10.5pt;
        }
        .responsibilities li:before {
            content: "•";
            color: #2563eb;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill-item {
            background: #f3f4f6;
            color: #2563eb;
            padding: 5px 14px;
            border-radius: 16px;
            font-size: 10.5pt;
            font-weight: 600;
            box-shadow: 0 1px 4px rgba(37,99,235,0.07);
        }
        .certification-name {
            font-weight: 700;
            color: #2563eb;
            font-size: 11.5pt;
        }
        .certification-details {
            color: #374151;
            font-size: 10.5pt;
        }
        .github-link {
            color: #2563eb;
            font-size: 10pt;
            text-decoration: underline;
        }
        .date-range {
            color: #6b7280;
            font-size: 10.5pt;
            float: right;
        }
        @media print {
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="name">{{ personal_info.fullName }}</span>
            <div class="contact-info">
                <span>{{ personal_info.email }}</span>
                <span>{{ personal_info.phone }}</span>
                {% if personal_info.githubLink %}
                <a href="{{ personal_info.githubLink }}">GitHub</a>
                {% endif %}
                {% if personal_info.linkedinProfile %}
                <a href="{{ personal_info.linkedinProfile }}">LinkedIn</a>
                {% endif %}
            </div>
        </div>

        {% if objective %}
        <div class="section">
            <div class="section-title">Career Objective</div>
            <p class="objective">{{ objective }}</p>
        </div>
        {% endif %}

        <div class="section">
            <div class="section-title">Education</div>
            {% for edu in education %}
            <div class="education-item">
                <div class="degree">{{ edu.degree }}</div>
                <div class="college">{{ edu.college }}</div>
                <div class="education-details">
                    CGPA: {{ edu.cgpa }} | {{ edu.startDate }} - {{ edu.endDate }}
                </div>
            </div>
            {% endfor %}
        </div>

        {% if projects %}
        <div class="section">
            <div class="section-title">Projects</div>
            {% for project in projects %}
            <div class="project-item">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div class="project-title">{{ project.title }}</div>
                    {% if project.githubLink %}
                    <a href="{{ project.githubLink }}" class="github-link">GitHub</a>
                    {% endif %}
                </div>
                <p style="margin: 8px 0; line-height: 1.6;">{{ project.description }}</p>
                {% if project.techStack %}
                <div class="tech-stack">
                    {% for tech in project.techStack %}
                    <span class="tech-item">{{ tech }}</span>
                    {% endfor %}
                </div>
                {% endif %}
            </div>
            {% endfor %}
        </div>
        {% endif %}

        {% if experience %}
        <div class="section">
            <div class="section-title">Experience</div>
            {% for exp in experience %}
            <div class="experience-item">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div>
                        <div class="role">{{ exp.role }}</div>
                        <div class="company">{{ exp.company }}</div>
                    </div>
                    <div class="date-range">{{ exp.startDate }} - {{ exp.endDate }}</div>
                </div>
                {% if exp.responsibilities %}
                <ul class="responsibilities">
                    {% for responsibility in exp.responsibilities %}
                    <li>{{ responsibility }}</li>
                    {% endfor %}
                </ul>
                {% endif %}
            </div>
            {% endfor %}
        </div>
        {% endif %}

        {% if skills %}
        <div class="section">
            <div class="section-title">Technical Skills</div>
            <div class="skills-list">
                {% for skill in skills %}
                <span class="skill-item">{{ skill }}</span>
                {% endfor %}
            </div>
        </div>
        {% endif %}

        {% if certifications %}
        <div class="section">
            <div class="section-title">Certifications</div>
            {% for cert in certifications %}
            <div class="certification-item">
                <div class="certification-name">{{ cert.name }}</div>
                <div class="certification-details">{{ cert.institution }} | {{ cert.year }}</div>
            </div>
            {% endfor %}
        </div>
        {% endif %}
    </div>
</body>
</html>
"""

@router.post("/generate")
async def generate_resume(resume_data: ResumeData):
    """Generates a PDF resume from the provided data."""
    try:
        # Create Jinja2 template
        template = Template(HTML_TEMPLATE)

        # Render HTML with data
        html_content = template.render(
            personal_info=resume_data.personalInfo,
            objective=resume_data.objective,
            education=resume_data.education,
            projects=resume_data.projects,
            experience=resume_data.experience,
            skills=resume_data.skills,
            certifications=resume_data.certifications
        )

        # Generate PDF using WeasyPrint
        pdf_buffer = io.BytesIO()
        weasyprint.HTML(string=html_content).write_pdf(pdf_buffer)
        pdf_buffer.seek(0)

        # Return PDF as response
        return Response(
            content=pdf_buffer.getvalue(),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={resume_data.personalInfo.fullName.replace(' ', '_')}_Resume.pdf"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")