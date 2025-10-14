from sqlalchemy import create_engine, text

DATABASE_URL = 'postgresql://neondb_owner:npg_pjSFt3Hqki1W@ep-dawn-pine-a1pod47e-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    # Check status values
    result = conn.execute(text('SELECT DISTINCT status FROM internships'))
    statuses = [row[0] for row in result]
    print('Status values:', statuses)
    
    # Check all internships
    result = conn.execute(text('SELECT id, title, status FROM internships'))
    print('\nAll internships:')
    for row in result:
        print(f"  ID: {row[0]}, Title: {row[1]}, Status: {row[2]}")
