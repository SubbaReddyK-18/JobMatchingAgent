const BASE_URL = 'http://127.0.0.1:5000';

async function testEndpoint(name, url, options = {}, validator) {
  try {
    const res = await fetch(`${BASE_URL}${url}`, options);
    const pass = await validator(res);
    if (pass) {
      console.log(`✅ [PASS] ${name}`);
      return true;
    } else {
      console.error(`❌ [FAIL] ${name} (Status: ${res.status})`);
      return false;
    }
  } catch (err) {
    console.error(`❌ [ERROR] ${name}: ${err.message}`);
    return false;
  }
}

async function runProductionAudit() {
  console.log('====================================================');
  console.log('🧪 RUNNING PRODUCTION DEPLOYMENT READINESS AUDIT');
  console.log('====================================================\n');

  let studentToken = null;
  let tpToken = null;
  let hodToken = null;

  // 1. Health check
  await testEndpoint('Health Check API', '/api/health', {}, async (res) => {
    const data = await res.json();
    return res.status === 200 && data.status === 'healthy';
  });

  // 2. Frontend Static & SPA Routing
  await testEndpoint('Frontend Root Index Delivery', '/', {}, async (res) => {
    const text = await res.text();
    return res.status === 200 && text.includes('<div id="root"></div>');
  });

  await testEndpoint('Frontend Brand Asset (Deloitte Logo)', '/deloitte-logo.png', {}, async (res) => {
    return res.status === 200;
  });

  await testEndpoint('Frontend Brand Asset (TCS Logo)', '/tcs-logo.webp', {}, async (res) => {
    return res.status === 200;
  });

  await testEndpoint('SPA Wildcard Route Fallback (/student/dashboard)', '/student/dashboard', {}, async (res) => {
    const text = await res.text();
    return res.status === 200 && text.includes('<div id="root"></div>');
  });

  await testEndpoint('SPA Wildcard Route Fallback (/institution/tp/dashboard)', '/institution/tp/dashboard', {}, async (res) => {
    const text = await res.text();
    return res.status === 200 && text.includes('<div id="root"></div>');
  });

  // 3. Predefined Authentication
  console.log('\n--- 3. Authentication & RBAC Verification ---');

  await testEndpoint('Student Login via USN (1RV23CS184)', '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: '1RV23CS184', password: 'Student@123' })
  }, async (res) => {
    const data = await res.json();
    studentToken = data.token;
    return res.status === 200 && data.user.role === 'STUDENT' && Boolean(data.token);
  });

  await testEndpoint('T&P Officer Login via Emp ID (TP-OFFICER-01)', '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'TP-OFFICER-01', password: 'TPCell@123' })
  }, async (res) => {
    const data = await res.json();
    tpToken = data.token;
    return res.status === 200 && data.user.role === 'T_AND_P' && Boolean(data.token);
  });

  await testEndpoint('HOD Login via Faculty ID (HOD-CSE-01)', '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'HOD-CSE-01', password: 'HOD@123' })
  }, async (res) => {
    const data = await res.json();
    hodToken = data.token;
    return res.status === 200 && data.user.role === 'HOD' && Boolean(data.token);
  });

  // 4. Security & Role Isolation
  console.log('\n--- 4. Security & Role-Based Access Control ---');

  await testEndpoint('Security: Unauthenticated access rejected (401)', '/api/students/profile', {}, async (res) => {
    return res.status === 401;
  });

  await testEndpoint('Security: Student blocked from T&P/HOD Metrics (403)', '/api/institution/dashboard-metrics', {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  }, async (res) => {
    return res.status === 403;
  });

  await testEndpoint('Security: HOD can read T&P/HOD Metrics (200)', '/api/institution/dashboard-metrics', {
    headers: { 'Authorization': `Bearer ${hodToken}` }
  }, async (res) => {
    return res.status === 200;
  });

  await testEndpoint('Security: HOD blocked from T&P Student Mutation (403)', '/api/institution/add-student', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${hodToken}` 
    },
    body: JSON.stringify({ full_name: 'Test Student', usn: '1RV99CS999', email: 'test@rvce.edu.in' })
  }, async (res) => {
    return res.status === 403;
  });

  await testEndpoint('Security: Invalid/Unregistered User Rejected (401)', '/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'random_unauthorized_user', password: 'Pass@123' })
  }, async (res) => {
    return res.status === 401;
  });

  // 5. Agent 50 Matching Engine
  console.log('\n--- 5. Agent 50 Matching Engine Verification ---');

  await testEndpoint('Agent 50: Compute Real SQLite Matches for Student', '/api/matching/student-matches', {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  }, async (res) => {
    const data = await res.json();
    const matches = data.recommended || data.all_eligible || [];
    const hasMatches = Array.isArray(matches) && matches.length > 0;
    const topMatch = matches[0];
    const hasScores = topMatch && typeof topMatch.overall_match === 'number';
    const hasBreakdown = topMatch && topMatch.component_scores && typeof topMatch.component_scores.skill_match === 'number';
    return res.status === 200 && hasMatches && hasScores && hasBreakdown;
  });

  // 6. SantraAI Context Verification
  console.log('\n--- 6. SantraAI Production Interface Verification ---');

  await testEndpoint('SantraAI Chat Execution (Student)', '/api/santra-ai/chat', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({ message: 'What is my top recommended job match?' })
  }, async (res) => {
    const data = await res.json();
    const hasNoTLDR = !data.reply.toLowerCase().includes('tl;dr') && !data.reply.toLowerCase().includes('tl:dr');
    return res.status === 200 && Boolean(data.reply) && hasNoTLDR;
  });

  console.log('\n====================================================');
  console.log('🎉 AUDIT COMPLETE — ALL CHECKS EVALUATED');
  console.log('====================================================');
}

runProductionAudit();
