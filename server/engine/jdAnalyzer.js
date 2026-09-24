import { santraAiService } from '../services/santraAiService.js';

/**
 * Intelligent Job Description Structuring Engine
 * Parses raw text JDs into structured placement schemas via LLM & NLP
 */
export class JDAnalyzer {
    static async analyzeJobDescription(rawText, defaultCompany = '') {
        const text = (rawText || '').trim();
        if (!text) {
            return this.getFallbackSchema(defaultCompany);
        }

        // Try AI LLM Structuring first if LLM API is available
        try {
            const apiKey = santraAiService.getApiKey();
            if (apiKey && apiKey !== 'PASTE_YOUR_GROQ_API_KEY_HERE') {
                const systemPrompt = `You are an expert HR and Campus Placement AI. Extract structured job details from the provided Job Description text and output STRICTLY a JSON object with NO markdown formatting, no commentary, and following this exact schema:
{
  "company_name": "string (Company Name, e.g. Adobe, Google, Microsoft, TCS, etc.)",
  "title": "string (e.g. Software Development Engineer, Full Stack Developer, Data Analyst)",
  "role_type": "Full-time" or "Internship",
  "work_mode": "Hybrid", "Remote", or "Onsite",
  "location": "string (e.g. Bengaluru, India)",
  "ctc_min": number or null (in LPA if explicitly mentioned in JD text, otherwise strictly null. DO NOT GUESS OR INVENT SALARY NUMBERS),
  "ctc_max": number or null (in LPA if explicitly mentioned in JD text, otherwise strictly null. DO NOT GUESS OR INVENT SALARY NUMBERS),
  "min_cgpa": number (e.g. 7.0),
  "max_backlogs": number (e.g. 0),
  "eligible_branches": ["CSE", "ISE", "ECE", etc.],
  "eligible_grad_years": [2026, 2027],
  "required_skills": ["string", "string"],
  "preferred_skills": ["string", "string"],
  "responsibilities": ["string", "string"],
  "description": "string summary"
}`;

                const response = await fetch(santraAiService.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: santraAiService.primaryModel,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: `Extract structured job data from this JD:\n\n${text}` }
                        ],
                        temperature: 0.1,
                        response_format: { type: "json_object" }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const content = data.choices?.[0]?.message?.content;
                    if (content) {
                        const parsed = JSON.parse(content);
                        if (parsed && (parsed.company_name || parsed.title)) {
                            const hasCtcMin = parsed.ctc_min !== null && parsed.ctc_min !== undefined && parsed.ctc_min !== '' && !isNaN(Number(parsed.ctc_min));
                            const hasCtcMax = parsed.ctc_max !== null && parsed.ctc_max !== undefined && parsed.ctc_max !== '' && !isNaN(Number(parsed.ctc_max));
                            const ctcMinVal = hasCtcMin ? Number(parsed.ctc_min) : null;
                            const ctcMaxVal = hasCtcMax ? Number(parsed.ctc_max) : null;

                            return {
                                company_name: parsed.company_name || this.extractCompany(text, defaultCompany),
                                title: parsed.title || this.extractTitle(text),
                                role_type: parsed.role_type || (text.match(/intern/i) ? 'Internship' : 'Full-time'),
                                work_mode: parsed.work_mode || 'Hybrid',
                                location: parsed.location || this.extractLocation(text),
                                ctc_min: ctcMinVal,
                                ctc_max: ctcMaxVal,
                                ctc_display: (ctcMinVal && ctcMaxVal) ? `₹ ${ctcMinVal} - ${ctcMaxVal} LPA` : (ctcMinVal ? `₹ ${ctcMinVal} LPA` : 'As per Industry Standards'),
                                min_cgpa: Number(parsed.min_cgpa) || 7.0,
                                max_backlogs: Number(parsed.max_backlogs) || 0,
                                eligible_branches: Array.isArray(parsed.eligible_branches) && parsed.eligible_branches.length > 0 ? parsed.eligible_branches : this.extractBranches(text),
                                eligible_grad_years: Array.isArray(parsed.eligible_grad_years) ? parsed.eligible_grad_years : [2026, 2027],
                                required_skills: Array.isArray(parsed.required_skills) && parsed.required_skills.length > 0 ? parsed.required_skills : this.extractSkills(text).required,
                                preferred_skills: Array.isArray(parsed.preferred_skills) ? parsed.preferred_skills : this.extractSkills(text).preferred,
                                responsibilities: Array.isArray(parsed.responsibilities) && parsed.responsibilities.length > 0 ? parsed.responsibilities : [
                                    'Design, develop, and maintain high-scale software modules',
                                    'Collaborate with cross-functional engineering and product teams',
                                    'Participate in code reviews and optimize performance bottlenecks'
                                ],
                                description: parsed.description || text.slice(0, 300),
                                deadline_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                            };
                        }
                    }
                }
            }
        } catch (llmErr) {
            console.warn('LLM parsing failed or unavailable, falling back to NLP rule extraction:', llmErr.message);
        }

        // Fast & Robust NLP Rule-Based Extraction
        return this.parseNLP(text, defaultCompany);
    }

    static parseNLP(text, defaultCompany) {
        const company = this.extractCompany(text, defaultCompany);
        const title = this.extractTitle(text);
        const isIntern = /intern(ship)?/i.test(text);
        const roleType = isIntern ? 'Internship' : 'Full-time';

        let workMode = 'Hybrid';
        if (/remote|work from home|wfh/i.test(text)) workMode = 'Remote';
        else if (/onsite|in-office|office based|on-site/i.test(text)) workMode = 'Onsite';

        const location = this.extractLocation(text);
        const { min: ctcMin, max: ctcMax } = this.extractCTC(text);
        const ctcDisplay = (ctcMin && ctcMax) 
            ? `₹ ${ctcMin} - ${ctcMax} LPA${isIntern ? ' (Stipend/PPO)' : ''}`
            : (ctcMin ? `₹ ${ctcMin} LPA` : 'As per Industry Standards');
        const minCgpa = this.extractCGPA(text);
        const eligibleBranches = this.extractBranches(text);
        const { required: requiredSkills, preferred: preferredSkills } = this.extractSkills(text);

        return {
            company_name: company,
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
            responsibilities: [
                'Design, develop, test, deploy, and maintain software solutions',
                'Collaborate across product, QA, and architecture teams',
                'Ensure high reliability, security, and scalability'
            ],
            description: text.slice(0, 300),
            deadline_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
    }

    static extractCompany(text, defaultCompany) {
        // 1. Direct regex for patterns like "Adobe is seeking", "Google is hiring", "Company: Microsoft"
        const patterns = [
            /(?:company(?:\s+name)?|organization|employer)\s*[:=-]\s*([A-Za-z0-9&.\s]{2,30})/i,
            /^([A-Za-z0-9&.\s]{2,25})\s+is\s+(?:seeking|hiring|looking for|inviting|announcing)/i,
            /(?:welcome to|join the team at|at)\s+([A-Za-z0-9&.\s]{2,25})\b/i,
            /(?:about)\s+([A-Za-z0-9&.\s]{2,25})\s*[:\n]/i
        ];

        for (const pat of patterns) {
            const match = text.match(pat);
            if (match && match[1]) {
                const name = match[1].trim().replace(/[.,;:]$/, '');
                if (name && !/^(the|a|an|we|our|this|job|role|position|urgent|immediate)$/i.test(name)) {
                    return name;
                }
            }
        }

        // 2. Known Top Tech Companies Catalog
        const knownCompanies = [
            'Adobe', 'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Uber',
            'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'Deloitte', 'Goldman Sachs',
            'Cisco', 'Oracle', 'Intel', 'PhonePe', 'Flipkart', 'Swiggy', 'Zomato', 'Razorpay',
            'Paytm', 'Salesforce', 'IBM', 'Atlassian', 'NVIDIA', 'AMD', 'Qualcomm', 'Walmart',
            'Morgan Stanley', 'JPMorgan', 'Siemens', 'Samsung', 'SAP', 'VMware', 'ServiceNow'
        ];

        for (const comp of knownCompanies) {
            const regex = new RegExp(`\\b${comp}\\b`, 'i');
            if (regex.test(text)) {
                return comp;
            }
        }

        return defaultCompany && defaultCompany !== 'Google' ? defaultCompany : 'Adobe';
    }

    static extractTitle(text) {
        // Direct title patterns
        const titleMatch = text.match(/(?:role|position|title|job title)\s*[:=-]\s*([^\n,]+)/i);
        if (titleMatch && titleMatch[1].trim().length < 50) {
            return titleMatch[1].trim();
        }

        if (/software development engineer\s*\([^)]+\)/i.test(text)) {
            const m = text.match(/software development engineer\s*\([A-Za-z0-9\s]+\)/i);
            if (m) return m[0];
        }
        if (/software development engineer/i.test(text) || /\bSDE\b/i.test(text)) return 'Software Development Engineer';
        if (/full\s*stack/i.test(text)) return 'Full Stack Developer';
        if (/backend/i.test(text)) return 'Backend Software Engineer';
        if (/frontend/i.test(text)) return 'Frontend Developer';
        if (/data\s+(?:analyst|scientist|engineer)/i.test(text)) return 'Data Analyst';
        if (/cloud|devops/i.test(text)) return 'Cloud DevOps Engineer';
        if (/machine\s+learning|ai\s+engineer/i.test(text)) return 'AI/ML Engineer';
        if (/intern/i.test(text)) return 'Software Engineering Intern';
        if (/consult/i.test(text)) return 'Technology Consultant';

        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lines.length > 0 && lines[0].length < 50 && !/^(hiring|job description|urgent|jd)$/i.test(lines[0])) {
            return lines[0];
        }

        return 'Software Development Engineer';
    }

    static extractLocation(text) {
        const locations = [
            { name: 'Bengaluru, India', match: /bengaluru|bangalore/i },
            { name: 'Hyderabad, India', match: /hyderabad/i },
            { name: 'Pune, India', match: /pune/i },
            { name: 'Chennai, India', match: /chennai/i },
            { name: 'Gurugram, India', match: /gurugram|gurgaon|noida|delhi|ncr/i },
            { name: 'Mumbai, India', match: /mumbai/i },
            { name: 'San Jose, CA', match: /san jose|california|usa/i },
            { name: 'Remote', match: /remote|pan india/i }
        ];

        for (const loc of locations) {
            if (loc.match.test(text)) return loc.name;
        }
        return 'Bengaluru, India';
    }

    static extractCTC(text) {
        let min = null;
        let max = null;

        const ctcMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|lac)/i) ||
                         text.match(/₹?\s*(\d+(?:\.\d+)?)\s*(?:-|to)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|lac)/i) ||
                         text.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?)/i);

        if (ctcMatch) {
            if (ctcMatch[2]) {
                min = parseFloat(ctcMatch[1]);
                max = parseFloat(ctcMatch[2]);
            } else if (ctcMatch[1]) {
                min = parseFloat(ctcMatch[1]);
                max = min;
            }
        }
        return { min, max };
    }

    static extractCGPA(text) {
        const cgpaMatch = text.match(/cgpa\s*(?:>=|:|of|above|is)?\s*(\d+(?:\.\d+)?)/i) ||
                          text.match(/(\d+(?:\.\d+)?)\s*(?:cgpa|gpa)/i);
        if (cgpaMatch && parseFloat(cgpaMatch[1]) <= 10) {
            return parseFloat(cgpaMatch[1]);
        }
        return 7.0;
    }

    static extractBranches(text) {
        const branches = [];
        if (/cse|computer\s+science/i.test(text)) branches.push('CSE');
        if (/ise|information\s+science|it\b|information\s+technology/i.test(text)) branches.push('ISE');
        if (/ece|electronics/i.test(text)) branches.push('ECE');
        if (/eee|electrical/i.test(text)) branches.push('EEE');
        if (/mechanical|me\b/i.test(text)) branches.push('ME');
        if (/biotech|bt\b/i.test(text)) branches.push('BT');
        if (branches.length === 0) branches.push('CSE', 'ISE', 'ECE');
        return branches;
    }

    static extractSkills(text) {
        const catalog = [
            'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Data Structures', 'Algorithms',
            'System Design', 'SQL', 'PostgreSQL', 'MongoDB', 'React', 'Node.js', 'Flask',
            'Django', 'AWS', 'Cloud (GCP)', 'Azure', 'Docker', 'Kubernetes', 'CI/CD',
            'Distributed Systems', 'Machine Learning', 'Data Visualization', 'Problem Solving',
            'DevOps', 'Kafka', 'Redis', 'Web Development', 'Git', 'Linux', 'Microservices'
        ];

        const required = [];
        const preferred = [];

        for (const skill of catalog) {
            const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (regex.test(text)) {
                if (required.length < 5) {
                    required.push(skill);
                } else if (preferred.length < 3) {
                    preferred.push(skill);
                }
            }
        }

        if (required.length === 0) {
            required.push('Python', 'Java', 'Data Structures', 'Algorithms');
            preferred.push('Docker', 'Cloud (AWS)');
        }

        return { required, preferred };
    }

    static getFallbackSchema(defaultCompany = 'Adobe') {
        return {
            company_name: defaultCompany,
            title: 'Software Development Engineer',
            role_type: 'Full-time',
            work_mode: 'Hybrid',
            location: 'Bengaluru, India',
            ctc_min: 18.0,
            ctc_max: 32.0,
            ctc_display: '₹ 18 - 32 LPA',
            min_cgpa: 7.0,
            max_backlogs: 0,
            eligible_branches: ['CSE', 'ISE', 'ECE'],
            eligible_grad_years: [2026, 2027],
            required_skills: ['Python', 'Java', 'Data Structures', 'Algorithms', 'SQL'],
            preferred_skills: ['Docker', 'Cloud (AWS)'],
            responsibilities: [
                'Design, develop, and maintain high-performance software modules',
                'Collaborate across cross-functional engineering teams'
            ],
            description: 'Software engineering opportunity.',
            deadline_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
    }
}

