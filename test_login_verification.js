async function testLogin(identifier, password, expectedRole, shouldSucceed = true) {
  try {
    const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (shouldSucceed) {
      if (res.status === 200 && data.success && data.user.role === expectedRole) {
        console.log(`[PASS] ${identifier} -> Logged in as ${data.user.role} (${data.user.name})`);
        return true;
      } else {
        console.error(`[FAIL] ${identifier} -> Expected 200 / ${expectedRole}, got ${res.status}:`, data);
        return false;
      }
    } else {
      if (res.status === 401 && !data.success) {
        console.log(`[PASS] Unauthorized user ${identifier} was correctly rejected (401)`);
        return true;
      } else {
        console.error(`[FAIL] Unauthorized user ${identifier} was NOT rejected properly:`, res.status, data);
        return false;
      }
    }
  } catch (err) {
    console.error(`[ERR] ${identifier}:`, err.message);
    return false;
  }
}

async function run() {
  console.log('--- Testing Predefined Student Accounts ---');
  await testLogin('1RV23CS184', 'Student@123', 'student');
  await testLogin('subbu@rvce.edu.in', 'Student@123', 'student');
  await testLogin('1RV22IS015', 'Student@123', 'student');
  await testLogin('1RV22EC032', 'Student@123', 'student');
  await testLogin('1RV23CS046', 'Student@123', 'student');
  await testLogin('1RV21ME078', 'Student@123', 'student');
  await testLogin('1RV21BT110', 'Student@123', 'student');

  console.log('\n--- Testing Predefined T&P Cell Accounts ---');
  await testLogin('TP-OFFICER-01', 'TPCell@123', 'tp_cell');
  await testLogin('aarav.sharma@rvce.edu.in', 'TPCell@123', 'tp_cell');
  await testLogin('TP-COORD-02', 'TPCell@123', 'tp_cell');
  await testLogin('TP-CRO-03', 'TPCell@123', 'tp_cell');

  console.log('\n--- Testing Predefined HOD Account ---');
  await testLogin('HOD-CSE-01', 'HOD@123', 'hod');
  await testLogin('hod.cse@rvce.edu.in', 'HOD@123', 'hod');

  console.log('\n--- Testing Unauthorized / Invalid Accounts ---');
  await testLogin('random_student', 'Pass@123', 'student', false);
  await testLogin('hacker@unknown.com', 'Hacker@123', 'student', false);
  await testLogin('TP-OFFICER-99', 'TPCell@123', 'tp_cell', false);
  await testLogin('1RV23CS184', 'WrongPassword', 'student', false);

  console.log('\nVerification complete!');
}

run();
