import bcrypt from 'bcryptjs';
import { db } from './database.js';

export async function seedDatabase() {
    await db.init();

    const existingUsers = await db.query('SELECT COUNT(*) as count FROM identity_users');
    if (existingUsers[0].count > 0) {
        console.log('Database already contains data, skipping re-seed.');
        return;
    }

    console.log('Seeding fresh database with RV College of Engineering dataset...');

    const studentPasswordHash = await bcrypt.hash('Student@123', 10);
    const tpPasswordHash = await bcrypt.hash('TPCell@123', 10);
    const hodPasswordHash = await bcrypt.hash('HOD@123', 10);
    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    // 1. Roles
    await db.run(`INSERT INTO identity_roles (id, name, description) VALUES 
        ('role_student', 'STUDENT', 'Student seeking career opportunities and preparation'),
        ('role_tp', 'T_AND_P', 'Training and Placement Cell officer with full administrative rights'),
        ('role_hod', 'HOD', 'Head of Department with read-only placement and department intelligence')
    `);

    // 2. Users (Strict Predefined Dataset)
    // - 6 Students (USN: 1RV...)
    // - 3 T&P Officers (Emp ID: TP-...)
    // - 1 HOD (Faculty ID: HOD-...)
    await db.run(`INSERT INTO identity_users (id, identifier_code, email, password_hash, full_name, role_id, avatar_url) VALUES
        ('usr_subbu', '1RV23CS184', 'subbu@rvce.edu.in', '${studentPasswordHash}', 'Subbu K', 'role_student', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'),
        ('usr_siri', '1RV22IS015', 'siri.c@rvce.edu.in', '${studentPasswordHash}', 'Siri Chennupati', 'role_student', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'),
        ('usr_rahul', '1RV22EC032', 'rahul.v@rvce.edu.in', '${studentPasswordHash}', 'Rahul Verma', 'role_student', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'),
        ('usr_keerthi', '1RV23CS046', 'keerthi.n@rvce.edu.in', '${studentPasswordHash}', 'Keerthi Nair', 'role_student', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'),
        ('usr_vishnu', '1RV21ME078', 'vishnu.p@rvce.edu.in', '${studentPasswordHash}', 'Vishnu Prasad', 'role_student', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'),
        ('usr_pooja', '1RV21BT110', 'pooja.k@rvce.edu.in', '${studentPasswordHash}', 'Pooja Kulkarni', 'role_student', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250'),
        ('usr_tp_aarav', 'TP-OFFICER-01', 'aarav.sharma@rvce.edu.in', '${tpPasswordHash}', 'Aarav Sharma', 'role_tp', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'),
        ('usr_tp_priya', 'TP-COORD-02', 'priya.menon@rvce.edu.in', '${tpPasswordHash}', 'Priya Menon', 'role_tp', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'),
        ('usr_tp_suresh', 'TP-CRO-03', 'suresh.rao@rvce.edu.in', '${tpPasswordHash}', 'Suresh Rao', 'role_tp', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250'),
        ('usr_hod_cse', 'HOD-CSE-01', 'hod.cse@rvce.edu.in', '${hodPasswordHash}', 'Dr. Rajesh Kumar (HOD CSE)', 'role_hod', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250')
    `);

    // 3. Students Table
    await db.run(`INSERT INTO people_students (id, user_id, usn, full_name, email, phone, branch, department, admission_year, graduation_year, semester, cgpa, active_backlogs, bio, linkedin_url, github_url, avatar_url) VALUES
        ('std_subbu', 'usr_subbu', '1RV23CS184', 'Subbu K', 'subbu@rvce.edu.in', '+91 98765 43210', 'CSE', 'Computer Science and Engineering', 2023, 2027, 6, 8.64, 0, 'I am a Computer Science undergraduate passionate about building scalable backend systems, distributed architectures, and AI-enabled platforms.', 'https://linkedin.com/in/subbu-k', 'https://github.com/subbu-k', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'),
        ('std_siri', 'usr_siri', '1RV22IS015', 'Siri Chennupati', 'siri.c@rvce.edu.in', '+91 98451 12345', 'ISE', 'Information Science and Engineering', 2022, 2026, 7, 8.72, 0, 'Full stack web developer and cloud computing enthusiast.', 'https://linkedin.com/in/siri-chennupati', 'https://github.com/siric', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250'),
        ('std_rahul', 'usr_rahul', '1RV22EC032', 'Rahul Verma', 'rahul.v@rvce.edu.in', '+91 97312 34567', 'ECE', 'Electronics & Communication', 2022, 2026, 7, 8.90, 0, 'Embedded systems, VLSI, and C++ systems programmer.', 'https://linkedin.com/in/rahul-verma', 'https://github.com/rahulv', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250'),
        ('std_keerthi', 'usr_keerthi', '1RV23CS046', 'Keerthi Nair', 'keerthi.n@rvce.edu.in', '+91 96111 22334', 'CSE', 'Computer Science and Engineering', 2023, 2027, 5, 8.35, 0, 'Backend engineer, Java and SQL database optimization.', 'https://linkedin.com/in/keerthi-nair', 'https://github.com/keerthin', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'),
        ('std_vishnu', 'usr_vishnu', '1RV21ME078', 'Vishnu Prasad', 'vishnu.p@rvce.edu.in', '+91 94480 99887', 'ME', 'Mechanical Engineering', 2021, 2025, 8, 8.10, 0, 'Robotics simulation and CAD modeling.', 'https://linkedin.com/in/vishnu-prasad', 'https://github.com/vishnup', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250'),
        ('std_ananya', 'usr_ananya', '1RV22EE101', 'Ananya Iyer', 'ananya.i@rvce.edu.in', '+91 98860 44556', 'EEE', 'Electrical and Electronics', 2022, 2026, 7, 8.80, 0, 'Power systems, MATLAB, and control algorithms.', 'https://linkedin.com/in/ananya-iyer', 'https://github.com/ananyai', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'),
        ('std_rehan', 'usr_rehan', '1RV23CS089', 'Mohammed Rehan', 'rehan.m@rvce.edu.in', '+91 97400 11223', 'CSE', 'Computer Science and Engineering', 2023, 2027, 5, 8.52, 0, 'Frontend, React, and Machine Learning applications.', 'https://linkedin.com/in/rehan-m', 'https://github.com/rehanm', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250'),
        ('std_pooja', 'usr_pooja', '1RV21BT110', 'Pooja Kulkarni', 'pooja.k@rvce.edu.in', '+91 99000 88776', 'BT', 'Biotechnology', 2021, 2025, 8, 9.20, 0, 'Bioinformatics, Python data science and biostatistics.', 'https://linkedin.com/in/pooja-k', 'https://github.com/poojak', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250')
    `);

    // 4. Skills for Subbu (Our main student demo persona)
    const subbuSkills = [
        ['std_subbu', 'Python', 'Programming', 'Expert', 0.95],
        ['std_subbu', 'Data Structures', 'Programming', 'Advanced', 0.90],
        ['std_subbu', 'Algorithms', 'Programming', 'Advanced', 0.88],
        ['std_subbu', 'SQL', 'Database', 'Advanced', 0.90],
        ['std_subbu', 'C++', 'Programming', 'Intermediate', 0.80],
        ['std_subbu', 'System Design', 'Architecture', 'Intermediate', 0.70],
        ['std_subbu', 'PostgreSQL', 'Database', 'Advanced', 0.88],
        ['std_subbu', 'Flask', 'Web Development', 'Advanced', 0.85],
        ['std_subbu', 'Node.js', 'Web Development', 'Intermediate', 0.75],
        ['std_subbu', 'Distributed Systems', 'Architecture', 'Intermediate', 0.65],
        ['std_subbu', 'Machine Learning', 'AI/ML', 'Intermediate', 0.72],
        ['std_subbu', 'AWS', 'Cloud', 'Intermediate', 0.60],
        ['std_subbu', 'Problem Solving', 'General', 'Advanced', 0.92]
    ];
    for (const [sId, name, cat, level, score] of subbuSkills) {
        await db.run('INSERT INTO student_skills (id, student_id, skill_name, category, proficiency_level, score) VALUES (?, ?, ?, ?, ?, ?)',
            [`sk_${sId}_${name.replace(/\s+/g, '')}`, sId, name, cat, level, score]);
    }

    // Skills for other students
    const otherSkills = [
        ['std_siri', 'Web Development', 'Web Development', 'Expert', 0.95],
        ['std_siri', 'DSA', 'Programming', 'Advanced', 0.85],
        ['std_siri', 'Cloud', 'Cloud', 'Advanced', 0.80],
        ['std_rahul', 'VLSI', 'Electronics', 'Expert', 0.90],
        ['std_rahul', 'Embedded C', 'Programming', 'Expert', 0.92],
        ['std_rahul', 'C++', 'Programming', 'Advanced', 0.85],
        ['std_keerthi', 'Python', 'Programming', 'Advanced', 0.85],
        ['std_keerthi', 'Java', 'Programming', 'Advanced', 0.88],
        ['std_keerthi', 'SQL', 'Database', 'Advanced', 0.82]
    ];
    for (const [sId, name, cat, level, score] of otherSkills) {
        await db.run('INSERT INTO student_skills (id, student_id, skill_name, category, proficiency_level, score) VALUES (?, ?, ?, ?, ?, ?)',
            [`sk_${sId}_${name.replace(/\s+/g, '')}`, sId, name, cat, level, score]);
    }

    // 5. Student Projects for Subbu
    await db.run(`INSERT INTO student_projects (id, student_id, title, description, tech_stack, role, github_link, featured) VALUES
        ('proj_subbu_1', 'std_subbu', 'E-Commerce Backend System', 'Built a scalable backend with Flask, PostgreSQL and Docker handling 10,000+ RPS with ACID transactions.', '["Python", "Flask", "PostgreSQL", "Docker", "Redis"]', 'Lead Backend Architect', 'https://github.com/subbu-k/ecommerce-backend', 1),
        ('proj_subbu_2', 'std_subbu', 'Real-time Chat Application', 'Developed a real-time chat app using WebSockets, Redis pub/sub and deployed on AWS EC2.', '["Node.js", "WebSockets", "AWS", "Redis", "React"]', 'Full Stack Developer', 'https://github.com/subbu-k/realtime-chat', 1),
        ('proj_subbu_3', 'std_subbu', 'Distributed Task Queue Engine', 'Lightweight async job scheduling engine in Python with persistent message broker and worker heartbeats.', '["Python", "AsyncIO", "SQLite", "System Design"]', 'Creator', 'https://github.com/subbu-k/task-queue', 1)
    `);

    // 6. Student Certifications for Subbu
    await db.run(`INSERT INTO student_certifications (id, student_id, title, issuing_organization, issue_date, credential_id) VALUES
        ('cert_subbu_1', 'std_subbu', 'Google Cloud Skill Badge', 'Google Cloud', 'May 2025', 'GCP-DIG-9821'),
        ('cert_subbu_2', 'std_subbu', 'Certified in Data Structures & Algorithms', 'Coursera / Stanford', 'Oct 2024', 'COUR-DSA-5541'),
        ('cert_subbu_3', 'std_subbu', 'AWS Certified Cloud Practitioner', 'Amazon Web Services', 'Jan 2025', 'AWS-CCP-7712')
    `);

    // 7. Student Preferences for Subbu
    await db.run(`INSERT INTO student_preferences (student_id, preferred_roles, preferred_locations, min_expected_ctc, willing_to_relocate, preferred_job_types) VALUES
        ('std_subbu', '["Software Engineer", "Backend Developer", "SDE Intern", "Distributed Systems Engineer", "Data Analyst"]', '["Bengaluru", "Hyderabad", "Pune", "Remote"]', 12.0, 1, '["Full-time", "Internship"]')
    `);

    // 8. Readiness Summary for Students
    await db.run(`INSERT INTO placement_readiness_summary (student_id, overall_readiness_score, technical_score, aptitude_score, communication_score, interview_readiness_score, status) VALUES
        ('std_subbu', 82.0, 88.0, 85.0, 78.0, 76.0, 'Placement Ready'),
        ('std_siri', 75.0, 78.0, 72.0, 80.0, 70.0, 'In Preparation'),
        ('std_rahul', 80.0, 85.0, 82.0, 72.0, 80.0, 'Placement Ready'),
        ('std_keerthi', 60.0, 68.0, 62.0, 55.0, 55.0, 'In Preparation'),
        ('std_vishnu', 50.0, 55.0, 50.0, 48.0, 47.0, 'Needs Attention'),
        ('std_ananya', 70.0, 75.0, 72.0, 68.0, 65.0, 'In Preparation'),
        ('std_rehan', 65.0, 70.0, 60.0, 68.0, 62.0, 'In Preparation'),
        ('std_pooja', 85.0, 88.0, 86.0, 82.0, 84.0, 'Placement Ready')
    `);

    // 9. Companies
    const companies = [
        ['comp_google', 'Google', 'Tier 1', 'Technology', 'https://careers.google.com', 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', 'Bengaluru, India', 'Google LLC is an American multinational corporation and technology company focusing on search, cloud computing, software, and AI.'],
        ['comp_microsoft', 'Microsoft', 'Tier 1', 'Technology', 'https://careers.microsoft.com', 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', 'Hyderabad, India', 'Microsoft Corporation is an American multinational corporation and technology company.'],
        ['comp_amazon', 'Amazon', 'Tier 1', 'E-Commerce / Cloud', 'https://amazon.jobs', 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', 'Bengaluru, India', 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, and AI.'],
        ['comp_deloitte', 'Deloitte', 'Tier 1', 'Consulting & Tech', 'https://deloitte.com/careers', 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg', 'Hyderabad, India', 'Deloitte provides audit, consulting, tax, and advisory services to many of the world\'s most admired brands.'],
        ['comp_infosys', 'Infosys', 'Tier 2', 'IT Services', 'https://infosys.com/careers', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 'Bengaluru, India', 'Infosys is a global leader in next-generation digital services and consulting.'],
        ['comp_tcs', 'TCS', 'Tier 2', 'IT Services', 'https://tcs.com/careers', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', 'Chennai, India', 'Tata Consultancy Services is an Indian multinational information technology services and consulting company.'],
        ['comp_adobe', 'Adobe', 'Tier 1', 'Technology', 'https://adobe.com/careers', 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png', 'Bengaluru, India', 'Adobe is the global leader in digital media and digital marketing solutions.'],
        ['comp_accenture', 'Accenture', 'Tier 2', 'Consulting / Tech', 'https://accenture.com/careers', 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg', 'Bengaluru, India', 'Accenture is a global professional services company with leading capabilities in digital, cloud and security.'],
        ['comp_nvidia', 'NVIDIA', 'Tier 1', 'Hardware & AI', 'https://nvidia.com/careers', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', 'Bengaluru, India', 'NVIDIA is the pioneer of GPU-accelerated computing and the leader in AI infrastructure.'],
        ['comp_uber', 'Uber', 'Tier 1', 'Mobility & Tech', 'https://uber.com/careers', 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png', 'Hyderabad, India', 'Uber develops, markets, and operates a mobility as a service platform.'],
        ['comp_zoho', 'Zoho', 'Tier 1', 'SaaS', 'https://zoho.com/careers', 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Zoho_Corporation_logo.png', 'Chennai, India', 'Zoho Corporation is an Indian multinational technology company that makes computer software and web-based business tools.']
    ];

    for (const [id, name, tier, ind, web, logo, hq, desc] of companies) {
        await db.run('INSERT INTO placement_companies (id, name, tier, industry, website, logo_url, headquarters, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, tier, ind, web, logo, hq, desc]);
    }

    // 10. Job Openings
    const openings = [
        {
            id: 'job_google_swe',
            company_id: 'comp_google',
            title: 'Software Engineer',
            role_type: 'Full-time',
            work_mode: 'Hybrid',
            location: 'Bengaluru, India',
            ctc_min: 30.0,
            ctc_max: 45.0,
            ctc_display: '₹ 30 - 45 LPA',
            min_cgpa: 8.0,
            max_backlogs: 0,
            eligible_branches: JSON.stringify(['CSE', 'ISE', 'ECE']),
            eligible_grad_years: JSON.stringify([2026, 2027]),
            description: 'As a Software Engineer at Google, you will work on building scalable systems that impact billions of users worldwide. You will collaborate with cross-functional teams to design, develop, and deploy innovative solutions.',
            responsibilities: JSON.stringify([
                'Design and develop scalable backend systems',
                'Work with distributed systems and cloud technologies',
                'Collaborate with product and design teams',
                'Solve complex algorithmic problems at scale',
                'Ensure high performance, availability and security'
            ]),
            required_skills: JSON.stringify(['Python', 'Data Structures', 'Algorithms', 'System Design', 'Distributed Systems', 'SQL', 'Cloud (GCP)', 'CI/CD']),
            preferred_skills: JSON.stringify(['Machine Learning', 'Kubernetes', 'Go', 'Large Scale Systems', 'Open Source Contribution']),
            experience_level: '0 - 2 years (Fresher)',
            deadline_date: '2026-09-25'
        },
        {
            id: 'job_microsoft_sde',
            company_id: 'comp_microsoft',
            title: 'SDE Intern',
            role_type: 'Internship',
            work_mode: 'Hybrid',
            location: 'Hyderabad, India',
            ctc_min: 15.0,
            ctc_max: 25.0,
            ctc_display: '₹ 15 - 25 LPA',
            min_cgpa: 7.5,
            max_backlogs: 0,
            eligible_branches: JSON.stringify(['CSE', 'ISE', 'ECE', 'EEE']),
            eligible_grad_years: JSON.stringify([2026, 2027]),
            description: 'Microsoft SDE Interns build the next generation of cloud tools, Windows ecosystem, and developer platforms using C++, Python and modern web frameworks.',
            responsibilities: JSON.stringify([
                'Design and implement key features for Azure & M365 services',
                'Participate in code reviews and architectural discussions',
                'Write modular, well-tested code in C++ or Python'
            ]),
            required_skills: JSON.stringify(['C++', 'Data Structures', 'Web Development', 'Algorithms', 'Python', 'AWS']),
            preferred_skills: JSON.stringify(['Azure', 'TypeScript', 'Docker']),
            experience_level: 'Fresher / Pre-final Year',
            deadline_date: '2026-09-18'
        },
        {
            id: 'job_amazon_da',
            company_id: 'comp_amazon',
            title: 'Data Analyst',
            role_type: 'Full-time',
            work_mode: 'Onsite',
            location: 'Bengaluru, India',
            ctc_min: 18.0,
            ctc_max: 28.0,
            ctc_display: '₹ 18 - 28 LPA',
            min_cgpa: 7.5,
            max_backlogs: 0,
            eligible_branches: JSON.stringify(['CSE', 'ISE', 'ECE', 'ME', 'BT']),
            eligible_grad_years: JSON.stringify([2026, 2027]),
            description: 'Join Amazon\'s analytics team to unlock actionable business insights across millions of customer orders, delivery logistics, and marketplace transactions.',
            responsibilities: JSON.stringify([
                'Construct complex SQL queries and ETL data pipelines',
                'Build interactive executive dashboards in QuickSight/Tableau',
                'Perform statistical analysis and predictive modeling'
            ]),
            required_skills: JSON.stringify(['SQL', 'Python', 'Data Visualization', 'Data Structures', 'Problem Solving']),
            preferred_skills: JSON.stringify(['Pandas', 'Tableau', 'AWS Redshift', 'BigQuery']),
            experience_level: '0 - 2 years (Fresher)',
            deadline_date: '2026-09-20'
        },
        {
            id: 'job_deloitte_ca',
            company_id: 'comp_deloitte',
            title: 'Consulting Analyst',
            role_type: 'Full-time',
            work_mode: 'Hybrid',
            location: 'Hyderabad, India',
            ctc_min: 12.0,
            ctc_max: 20.0,
            ctc_display: '₹ 12 - 20 LPA',
            min_cgpa: 7.0,
            max_backlogs: 0,
            eligible_branches: JSON.stringify(['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'BT']),
            eligible_grad_years: JSON.stringify([2026, 2027]),
            description: 'Work with Fortune 500 clients to architect technology transformations, streamline business processes, and implement enterprise solutions.',
            responsibilities: JSON.stringify([
                'Analyze client technology infrastructure and business workflows',
                'Facilitate workshops and present strategic recommendations'
            ]),
            required_skills: JSON.stringify(['Problem Solving', 'Analytics', 'Communication', 'SQL', 'Project Management']),
            preferred_skills: JSON.stringify(['PowerBI', 'Cloud Architecture', 'Agile']),
            experience_level: '0 - 2 years',
            deadline_date: '2026-09-22'
        },
        {
            id: 'job_infosys_se',
            company_id: 'comp_infosys',
            title: 'Systems Engineer',
            role_type: 'Full-time',
            work_mode: 'Onsite',
            location: 'Pune, India',
            ctc_min: 9.0,
            ctc_max: 14.0,
            ctc_display: '₹ 9 - 14 LPA',
            min_cgpa: 6.5,
            max_backlogs: 1,
            eligible_branches: JSON.stringify(['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE', 'BT']),
            eligible_grad_years: JSON.stringify([2025, 2026, 2027]),
            description: 'Develop, maintain and support critical enterprise digital systems for global banking and automotive clients.',
            responsibilities: JSON.stringify([
                'Software development in Java, SQL and modern web tech',
                'Participate in automated unit and regression testing'
            ]),
            required_skills: JSON.stringify(['Java', 'SQL', 'Operating Systems', 'DBMS', 'Web Development']),
            preferred_skills: JSON.stringify(['Spring Boot', 'Linux', 'Git']),
            experience_level: 'Fresher',
            deadline_date: '2026-09-25'
        },
        {
            id: 'job_tcs_da',
            company_id: 'comp_tcs',
            title: 'Digital Associate',
            role_type: 'Full-time',
            work_mode: 'Onsite',
            location: 'Chennai, India',
            ctc_min: 7.0,
            ctc_max: 12.0,
            ctc_display: '₹ 7 - 12 LPA',
            min_cgpa: 6.5,
            max_backlogs: 0,
            eligible_branches: JSON.stringify(['CSE', 'ISE', 'ECE', 'EEE', 'ME', 'CE']),
            eligible_grad_years: JSON.stringify([2025, 2026, 2027]),
            description: 'TCS Digital hiring stream focusing on agile product engineering, cloud services, and full-stack development.',
            responsibilities: JSON.stringify([
                'Full-stack development and automated test development',
                'Deliver modules within 2-week agile sprints'
            ]),
            required_skills: JSON.stringify(['Python', 'Web Development', 'DBMS', 'Data Structures']),
            preferred_skills: JSON.stringify(['React', 'Node.js', 'SQL']),
            experience_level: 'Fresher',
            deadline_date: '2026-09-18'
        },
        {
            id: 'job_adobe_sde',
            company_id: 'comp_adobe',
            title: 'Software Engineer - Creative Cloud',
            role_type: 'Full-time',
            work_mode: 'Hybrid',
            location: 'Bengaluru, India',
            ctc_min: 28.0,
            ctc_max: 42.0,
            ctc_display: '₹ 28 - 42 LPA',
            min_cgpa: 8.0,
            max_backlogs: 0,
            eligible_branches: JSON.stringify(['CSE', 'ISE']),
            eligible_grad_years: JSON.stringify([2026, 2027]),
            description: 'Build high-performance graphics engines and web-first collaborative creative experiences for Photoshop, Premiere, and Illustrator on web.',
            responsibilities: JSON.stringify([
                'Architect high performance rendering pipelines in C++ and WebAssembly',
                'Integrate Firefly generative AI directly into creative canvas'
            ]),
            required_skills: JSON.stringify(['C++', 'Data Structures', 'System Design', 'Algorithms', 'Web Development']),
            preferred_skills: JSON.stringify(['WebAssembly', 'Computer Graphics', 'GPU/WebGL']),
            experience_level: '0 - 2 years',
            deadline_date: '2026-09-30'
        },
        {
            id: 'job_uber_sys',
            company_id: 'comp_uber',
            title: 'Systems & Infrastructure Engineer',
            role_type: 'Full-time',
            work_mode: 'Hybrid',
            location: 'Hyderabad, India',
            ctc_min: 32.0,
            ctc_max: 48.0,
            ctc_display: '₹ 32 - 48 LPA',
            min_cgpa: 8.2,
            max_backlogs: 0,
            eligible_branches: JSON.stringify(['CSE', 'ISE', 'ECE']),
            eligible_grad_years: JSON.stringify([2026, 2027]),
            description: 'Design and scale real-time matching and dispatch microservices powering millions of concurrent trips worldwide.',
            responsibilities: JSON.stringify([
                'Build low-latency geospatial indexing services in Go/Java',
                'Ensure zero downtime through multi-region active-active clusters'
            ]),
            required_skills: JSON.stringify(['Distributed Systems', 'System Design', 'Go', 'Data Structures', 'Docker', 'DevOps']),
            preferred_skills: JSON.stringify(['Kafka', 'Redis', 'Kubernetes']),
            experience_level: '0 - 2 years',
            deadline_date: '2026-10-05'
        }
    ];

    for (const op of openings) {
        await db.run(`INSERT INTO placement_job_openings 
            (id, company_id, title, role_type, work_mode, location, ctc_min, ctc_max, ctc_display, min_cgpa, max_backlogs, eligible_branches, eligible_grad_years, description, responsibilities, required_skills, preferred_skills, experience_level, deadline_date, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
            [op.id, op.company_id, op.title, op.role_type, op.work_mode, op.location, op.ctc_min, op.ctc_max, op.ctc_display, op.min_cgpa, op.max_backlogs, op.eligible_branches, op.eligible_grad_years, op.description, op.responsibilities, op.required_skills, op.preferred_skills, op.experience_level, op.deadline_date]
        );
    }

    // 11. Applications for Subbu
    await db.run(`INSERT INTO placement_drive_applications (id, student_id, job_opening_id, status, stage_progress, applied_at) VALUES
        ('app_subbu_google', 'std_subbu', 'job_google_swe', 'INTERVIEW_SCHEDULED', 3, '2026-08-12 10:30:00'),
        ('app_subbu_msft', 'std_subbu', 'job_microsoft_sde', 'UNDER_REVIEW', 2, '2026-09-05 14:15:00'),
        ('app_subbu_amzn', 'std_subbu', 'job_amazon_da', 'OFFER_RECEIVED', 4, '2026-07-28 09:00:00'),
        ('app_subbu_deloitte', 'std_subbu', 'job_deloitte_ca', 'UNDER_REVIEW', 1, '2026-09-01 11:20:00'),
        ('app_subbu_infosys', 'std_subbu', 'job_infosys_se', 'NOT_SELECTED', 1, '2026-08-20 16:45:00'),
        ('app_subbu_tcs', 'std_subbu', 'job_tcs_da', 'INTERVIEW_SCHEDULED', 3, '2026-09-10 17:00:00')
    `);

    // 12. Placement Interview for Subbu (Google)
    await db.run(`INSERT INTO placement_interviews (id, application_id, round_name, scheduled_time, mode, meeting_link, interviewer_name, status, feedback) VALUES
        ('int_google_1', 'app_subbu_google', 'Technical Round 1 (Data Structures & Systems)', '15 Sep 2026, 10:00 AM IST', 'Google Meet (Virtual)', 'https://meet.google.com/rvc-job-match', 'Staff SWE - Google Bengaluru', 'SCHEDULED', 'Strong problem solving and distributed systems foundations required.')
    `);

    // 13. Placement Offer for Subbu (Amazon)
    await db.run(`INSERT INTO placement_offers (id, application_id, offered_ctc, role_title, joining_date, student_decision) VALUES
        ('off_amzn_1', 'app_subbu_amzn', 24.5, 'Data Analyst I', '2027-07-01', 'ACCEPTED')
    `);

    // 14. Historical Placement Signals for learning
    await db.run(`INSERT INTO placement_historical_signals (id, company_name, role_category, successful_skill_weights, average_hired_cgpa, top_contributing_branch, interview_conversion_rate, sample_size) VALUES
        ('sig_google', 'Google', 'Software Engineering', '{"Python": 0.95, "Data Structures": 0.95, "Algorithms": 0.90, "System Design": 0.85, "PostgreSQL": 0.80}', 8.8, 'CSE', 0.78, 62),
        ('sig_msft', 'Microsoft', 'Software Engineering', '{"C++": 0.90, "Data Structures": 0.90, "Web Development": 0.85, "Algorithms": 0.85}', 8.4, 'CSE', 0.72, 75),
        ('sig_amzn', 'Amazon', 'Analytics & SDE', '{"SQL": 0.92, "Python": 0.88, "Data Visualization": 0.82, "Problem Solving": 0.90}', 8.1, 'ISE', 0.69, 88),
        ('sig_deloitte', 'Deloitte', 'Consulting & Tech', '{"Problem Solving": 0.90, "Analytics": 0.85, "Communication": 0.92, "SQL": 0.75}', 7.8, 'ECE', 0.81, 110)
    `);

    // 15. AgentOps Configuration & Agent 50 Registration
    await db.run(`INSERT INTO agentops_agents (id, agent_code, name, domain, version, description, status) VALUES
        ('agent_50', 'AGENT_50', 'Job Matching & Placement Intelligence Agent', 'Placement Intelligence', '2.4.0', 'Deterministic & Semantically-Calibrated Multi-Factor Matching Engine', 'ACTIVE')
    `);

    await db.run(`INSERT INTO agentops_model_versions (id, agent_id, version_tag, model_type, weights_config, active) VALUES
        ('mv_240', 'agent_50', 'v2.4.0-hybrid', 'Multi-Factor Scorer with Historical Calibrations', '{"skill_weight": 0.40, "project_weight": 0.25, "role_interest_weight": 0.15, "location_weight": 0.10, "readiness_weight": 0.10}', 1)
    `);

    // 16. Institution Events
    await db.run(`INSERT INTO institution_events (id, title, category, event_date, event_time, location, organizer, registered_count, mode) VALUES
        ('ev_1', 'Tech Career Guidance Session', 'Industry Talk', '15 Sep 2026', '10:00 AM - 11:30 AM', 'Auditorium', 'With Alumni', 120, 'Offline'),
        ('ev_2', 'Placement Preparation Workshop', 'Workshop', '20 Sep 2026', '2:00 PM - 5:00 PM', 'Seminar Hall', 'By T&P Cell', 85, 'Offline'),
        ('ev_3', 'Industry Interaction: Microsoft', 'Industry Talk', '28 Sep 2026', '11:00 AM - 1:00 PM', 'Main Block', 'Insights & Opportunities', 200, 'Offline'),
        ('ev_4', 'National Level Hackathon 2025', 'Hackathon', '05 Oct 2025', 'All Day', 'RVCE Campus', 'RVCE Coding Club', 320, 'Offline'),
        ('ev_5', 'Industry Networking Meet', 'Industry Talk', '12 Oct 2026', '10:00 AM - 12:00 PM', 'Convention Center', 'By Alumni Association', 150, 'Offline')
    `);

    // 17. Institution Communications
    await db.run(`INSERT INTO institution_communications (id, sender_id, sender_name, recipient_type, recipient_id, subject, message) VALUES
        ('msg_1', 'comp_google', 'Google Campus Team', 'COMPANY', 'usr_tp_aarav', 'Placement Drive Coordination', 'Thank you for coordinating the campus drive. We were impressed with the student participation and overall organization.'),
        ('msg_2', 'usr_tp_aarav', 'Aarav Sharma (T&P)', 'COMPANY', 'comp_google', 'Re: Placement Drive Coordination', 'Thank you! We are glad to hear that. Looking forward to more collaborations in the future.'),
        ('msg_3', 'usr_tp_aarav', 'T&P Office', 'BROADCAST', NULL, 'Microsoft Placement Drive Registrations Open', 'Registrations for Microsoft SDE Intern and Full Time are open until 18 Sep 2026. Eligible students please apply via JobMatch AI portal.')
    `);

    console.log('RV College of Engineering database seeded successfully!');
}
