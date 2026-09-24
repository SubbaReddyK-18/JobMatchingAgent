// Verification test script for backend APIs & Agent 50 Matching Engine
import { seedDatabase } from '../db/seed.js';
import { db } from '../db/database.js';
import { agent50 } from '../engine/agent50.js';
import { JDAnalyzer } from '../engine/jdAnalyzer.js';

async function testBackend() {
    console.log('--- Starting Backend Verification Tests ---');
    await seedDatabase();

    // 1. Test Student Fetch
    const student = await db.get('SELECT * FROM people_students WHERE id = "std_subbu"');
    console.log('✓ Found Student Persona:', student.full_name, 'USN:', student.usn, 'CGPA:', student.cgpa);

    // 2. Test Matching Engine with Google SWE
    const googleJob = await db.get('SELECT * FROM placement_job_openings WHERE id = "job_google_swe"');
    const skills = await db.query('SELECT * FROM student_skills WHERE student_id = "std_subbu"');
    const projects = await db.query('SELECT * FROM student_projects WHERE student_id = "std_subbu"');
    const prefs = await db.get('SELECT * FROM student_preferences WHERE student_id = "std_subbu"');
    const readiness = await db.get('SELECT * FROM placement_readiness_summary WHERE student_id = "std_subbu"');

    const match = await agent50.matchStudentToJob(student, googleJob, skills, projects, prefs, readiness);
    console.log('✓ Agent 50 Match Calculated for Google SWE:', {
        is_eligible: match.is_eligible,
        overall_match: `${match.overall_match}%`,
        skill_match: `${match.component_scores.skill_match}%`,
        project_relevance: `${match.component_scores.project_relevance}%`,
        reasons_count: match.why_strong_candidate.length,
        gaps_count: match.preparation_gaps.length
    });

    if (match.overall_match < 80) {
        throw new Error('Expected high match score for Subbu on Google SWE');
    }

    // 3. Test Eligibility Filter on Ineligible Case (e.g. CGPA threshold higher than student)
    const strictJob = {
        id: 'job_strict_test',
        min_cgpa: 9.5,
        max_backlogs: 0,
        eligible_branches: ['CSE'],
        eligible_grad_years: [2027],
        required_skills: ['Python']
    };
    const ineligibleCheck = agent50.checkEligibility(student, strictJob);
    console.log('✓ Eligibility Hard Filter Verified (Student CGPA 8.64 vs Min 9.5): Eligible =', ineligibleCheck.is_eligible, ineligibleCheck.eligibility_reasons);
    if (ineligibleCheck.is_eligible) {
        throw new Error('Expected student to be ineligible for CGPA 9.5 requirement');
    }

    // 4. Test JD AI Analyzer
    const rawJd = `
    Google is looking for a Software Engineer in Bengaluru.
    We require strong knowledge of Python, Data Structures, Algorithms, SQL, and Docker.
    Preferred: Cloud (GCP) and Machine Learning.
    Eligibility: CGPA >= 8.0, CSE or ISE branch.
    Package: 30 to 45 LPA.
    `;
    const structured = await JDAnalyzer.analyzeJobDescription(rawJd, 'Google');
    console.log('✓ JD AI Parser Output:', {
        title: structured.title,
        location: structured.location,
        ctc_display: structured.ctc_display,
        min_cgpa: structured.min_cgpa,
        required_skills: structured.required_skills,
        preferred_skills: structured.preferred_skills
    });

    console.log('🎉 All Backend Verification Tests Passed!');
}

testBackend().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
