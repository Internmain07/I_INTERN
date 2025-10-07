"""
Matching algorithm for calculating compatibility between interns and internships.
This module provides functions to calculate match percentages based on skills and requirements.
"""

def calculate_skills_match(user_skills: str, required_skills: str) -> float:
    """
    Calculate the match percentage between user skills and required skills.
    
    Args:
        user_skills: Comma-separated string of user's skills
        required_skills: Comma-separated string of required skills for the internship
    
    Returns:
        Float representing match percentage (0-100)
    """
    if not user_skills or not required_skills:
        return 0.0

    # Parse and normalize skills (lowercase, strip whitespace)
    user_skills_set = set(skill.strip().lower() for skill in user_skills.split(',') if skill.strip())
    required_skills_set = set(skill.strip().lower() for skill in required_skills.split(',') if skill.strip())

    if not required_skills_set:
        return 0.0

    # Calculate exact matches
    matching_skills = user_skills_set.intersection(required_skills_set)
    exact_match_percentage = (len(matching_skills) / len(required_skills_set)) * 100

    return round(exact_match_percentage, 2)


def calculate_detailed_match(
    user_skills: str,
    required_skills: str,
    user_level: str = None,
    internship_level: str = None
) -> dict:
    """
    Calculate detailed match information including skills breakdown and level compatibility.
    
    Args:
        user_skills: Comma-separated string of user's skills
        required_skills: Comma-separated string of required skills
        user_level: User's experience level (optional)
        internship_level: Required experience level for internship (optional)
    
    Returns:
        Dictionary containing match percentage, matched skills, missing skills, and level match
    """
    # Parse skills
    user_skills_set = set(skill.strip().lower() for skill in (user_skills or "").split(',') if skill.strip())
    required_skills_set = set(skill.strip().lower() for skill in (required_skills or "").split(',') if skill.strip())
    
    # Calculate skill match
    matching_skills = user_skills_set.intersection(required_skills_set)
    missing_skills = required_skills_set - user_skills_set
    extra_skills = user_skills_set - required_skills_set
    
    # Calculate base match percentage
    if required_skills_set:
        skill_match = (len(matching_skills) / len(required_skills_set)) * 100
    else:
        skill_match = 0.0
    
    # Calculate level match bonus (if applicable)
    level_match = 100.0
    level_compatible = True
    
    if user_level and internship_level:
        level_hierarchy = {'beginner': 1, 'intermediate': 2, 'advanced': 3}
        user_lvl = level_hierarchy.get(user_level.lower(), 1)
        required_lvl = level_hierarchy.get(internship_level.lower(), 1)
        
        # User should meet or exceed required level
        if user_lvl >= required_lvl:
            level_match = 100.0
        else:
            level_match = (user_lvl / required_lvl) * 100
            level_compatible = False
    
    # Calculate overall match (70% skills, 30% level)
    overall_match = (skill_match * 0.7) + (level_match * 0.3)
    
    return {
        'match_percentage': round(overall_match, 2),
        'skill_match_percentage': round(skill_match, 2),
        'level_match_percentage': round(level_match, 2),
        'matching_skills': list(matching_skills),
        'missing_skills': list(missing_skills),
        'extra_skills': list(extra_skills),
        'level_compatible': level_compatible,
        'total_required_skills': len(required_skills_set),
        'total_matched_skills': len(matching_skills)
    }
