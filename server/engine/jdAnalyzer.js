/**
 * Intelligent Job Description Structuring Engine
 * Parses raw text JDs into structured placement schemas
 */

export class JDAnalyzer {
    static analyzeJobDescription(rawText, defaultCompany = '') {
        const text = rawText || '';
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

        // 1. Title Extraction
        let title = 'Software Development Engineer';
        if (text.match(/backend/i)) title = 'Backend Software Engineer';
        else if (text.match(/data\s+analyst/i)) title = 'Data Analyst';
        else if (text.match(/frontend/i)) title = 'Frontend Developer';
        else if (text.match(/intern/i)) title = 'Software Engineering Intern';
        else if (text.match(/consult/i)) title = 'Technology Consultant';
        else if (text.match(/full\s*stack/i)) title = 'Full Stack Developer';
        else if (lines.length > 0 && lines[0].length < 60) title = lines[0];

        // 2. Role Type & Work Mode
        const isIntern = /intern(ship)?/i.test(text);
        const roleType = isIntern ? 'Internship' : 'Full-time';
        
        let workMode = 'Hybrid';
        if (/remote|work from home/i.test(text)) workMode = 'Remote';
        else if (/onsite|in-office|office based/i.test(text)) workMode = 'Onsite';

        // 3. Location
        let location = 'Bengaluru, India';
        if (/hyderabad/i.test(text)) location = 'Hyderabad, India';
        else if (/pune/i.test(text)) location = 'Pune, India';
        else if (/chennai/i.test(text)) location = 'Chennai, India';
        else if (/delhi|noida|gurugram/i.test(text)) location = 'Gurugram, India';
        else if (/mumbai/i.test(text)) location = 'Mumbai, India';

        // 4. CTC Extraction
        let ctcMin = isIntern ? 12.0 : 18.0;
        let ctcMax = isIntern ? 22.0 : 32.0;
        const ctcMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*lpa/i) || text.match(/₹?\s*(\d+)\s*(?:-|to)\s*(\d+)\s*lpa/i);
        if (ctcMatch) {
            ctcMin = parseFloat(ctcMatch[1]);
            ctcMax = parseFloat(ctcMatch[2]);
        }
        const ctcDisplay = isIntern ? `₹ ${ctcMin} - ${ctcMax} LPA (Stipend/PPO)` : `₹ ${ctcMin} - ${ctcMax} LPA`;

        // 5. Min CGPA & Backlogs
        let minCgpa = 7.0;
        const cgpaMatch = text.match(/cgpa\s*(?:>=|:|of|above)?\s*(\d+(?:\.\d+)?)/i);
        if (cgpaMatch) {
            minCgpa = parseFloat(cgpaMatch[1]);
        }

        // 6. Eligible Branches
        const eligibleBranches = [];
        if (/cse|computer\s+science/i.test(text)) eligibleBranches.push('CSE');
        if (/ise|information\s+science/i.test(text)) eligibleBranches.push('ISE');
        if (/ece|electronics/i.test(text)) eligibleBranches.push('ECE');
        if (/eee|electrical/i.test(text)) eligibleBranches.push('EEE');
        if (/mechanical|me/i.test(text)) eligibleBranches.push('ME');
        if (/biotech|bt/i.test(text)) eligibleBranches.push('BT');
        if (eligibleBranches.length === 0) eligibleBranches.push('CSE', 'ISE', 'ECE');

        // 7. Skills Identification Catalog
        const skillCatalog = [
            'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Data Structures', 'Algorithms',
            'System Design', 'SQL', 'PostgreSQL', 'MongoDB', 'React', 'Node.js', 'Flask',
            'Django', 'AWS', 'Cloud (GCP)', 'Azure', 'Docker', 'Kubernetes', 'CI/CD',
            'Distributed Systems', 'Machine Learning', 'Data Visualization', 'Problem Solving',
            'DevOps', 'Kafka', 'Redis', 'Web Development', 'Git', 'Linux', 'Microservices'
        ];

        const requiredSkills = [];
        const preferredSkills = [];

        for (const skill of skillCatalog) {
            const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (regex.test(text)) {
                if (requiredSkills.length < 6) {
                    requiredSkills.push(skill);
                } else if (preferredSkills.length < 4) {
                    preferredSkills.push(skill);
                }
            }
        }

        // Defaults if none matched
        if (requiredSkills.length === 0) {
            requiredSkills.push('Python', 'Data Structures', 'SQL', 'Algorithms');
            preferredSkills.push('Docker', 'Cloud (GCP)');
        }

        // 8. Responsibilities
        const responsibilities = [
            'Design, develop, test, deploy, maintain and improve software services',
            'Manage individual project priorities, deadlines, and deliverables',
            'Participate in architectural reviews and optimize performance bottlenecks'
        ];

        return {
            title,
            role_type: roleType,
            work_mode: workMode,
            location,
            ctc_min: ctcMin,
            ctc_max: ctcMax,
            ctc_display: ctcDisplay,
            min_cgpa: minCgpa,
            max_backlogs: 0,
            eligible_branches: eligibleBranches,
            eligible_grad_years: [2026, 2027],
            required_skills: requiredSkills,
            preferred_skills: preferredSkills,
            responsibilities,
            experience_level: isIntern ? 'Fresher / Pre-final Year' : '0 - 2 years (Fresher)',
            deadline_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
    }
}
