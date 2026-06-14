// Node v18+ has global fetch built-in, so we can just use the global fetch.

const BASE_URL = "http://127.0.0.1:8000/api";

async function runTests() {
  console.log("=== STARTING PROGRAMMATIC PORTAL FLOW TESTS ===");

  // 1. Health check
  console.log("\n[Test 1] Verifying /health...");
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log("Health Status:", healthRes.status, healthData);
  if (healthRes.status !== 200 || healthData.status !== "ok") {
    throw new Error("Health check failed");
  }

  // 2. Parent OTP Send & Verify with Pending Child
  console.log("\n[Test 2] Parent OTP registration with invalid child ID...");
  const parentPhone = "08022222222";
  const parentOtpRes = await fetch(`${BASE_URL}/auth/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: parentPhone })
  });
  const parentOtpData = await parentOtpRes.json();
  console.log("OTP Send Response:", parentOtpRes.status, parentOtpData);
  const devCode = parentOtpData.devCode || "1234";

  const parentVerifyRes = await fetch(`${BASE_URL}/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: parentPhone,
      code: devCode,
      profile: {
        name: "Adebayo Parent",
        role: "parent",
        child_name: "Chidi Adebayo",
        child_student_id: "PF-NOTFOUND",
        school_name: "Government College Lagos"
      }
    })
  });
  const parentData = await parentVerifyRes.json();
  console.log("OTP Verify Response:", parentVerifyRes.status, parentData);
  if (parentVerifyRes.status !== 200) {
    throw new Error("Parent OTP verification failed: " + JSON.stringify(parentData));
  }
  if (parentData.user.role !== "parent") {
    throw new Error("Expected role parent, got: " + parentData.user.role);
  }
  if (parentData.pendingLink !== true) {
    throw new Error("Expected pendingLink to be true for PF-NOTFOUND child ID");
  }
  console.log("✅ Parent registration success! pendingLink warning is correctly active.");
  const parentUserId = parentData.user.id;

  // 3. School OTP Send & Verify
  console.log("\n[Test 3] School OTP registration...");
  const schoolPhone = "08033333333";
  const schoolOtpRes = await fetch(`${BASE_URL}/auth/otp/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: schoolPhone })
  });
  const schoolOtpData = await schoolOtpRes.json();
  const schoolDevCode = schoolOtpData.devCode || "1234";

  const schoolVerifyRes = await fetch(`${BASE_URL}/auth/otp/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: schoolPhone,
      code: schoolDevCode,
      profile: {
        school_name: "Lagos Prep School",
        role: "school",
        email: "contact@lagosprep.com",
        address: "123 Prep St, Yaba"
      }
    })
  });
  const schoolData = await schoolVerifyRes.json();
  console.log("School Verify Response:", schoolVerifyRes.status, schoolData);
  if (schoolVerifyRes.status !== 200) {
    throw new Error("School OTP verification failed");
  }
  if (schoolData.user.role !== "school") {
    throw new Error("Expected role school, got: " + schoolData.user.role);
  }
  console.log("✅ School registration success!");
  const schoolUserId = schoolData.user.id;

  // 4. Admin login
  console.log("\n[Test 4] Admin login passcode test...");
  const adminLoginRes = await fetch(`${BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "admin123" })
  });
  const adminData = await adminLoginRes.json();
  console.log("Admin Login Response:", adminLoginRes.status, adminData);
  if (adminLoginRes.status !== 200) {
    throw new Error("Admin login failed");
  }
  if (adminData.user.role !== "admin") {
    throw new Error("Expected role admin, got: " + adminData.user.role);
  }
  const adminToken = adminData.token;
  console.log("✅ Admin login success!");

  // 5. Admin Impersonate School User
  console.log(`\n[Test 5] Impersonating school user (${schoolUserId})...`);
  const impersonateRes = await fetch(`${BASE_URL}/admin/impersonate/${schoolUserId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${adminToken}`
    }
  });
  const impersonateData = await impersonateRes.json();
  console.log("Impersonate Response:", impersonateRes.status, impersonateData);
  if (impersonateRes.status !== 200 || !impersonateData.success) {
    throw new Error("Impersonation failed");
  }
  const impersonationToken = impersonateData.token;
  console.log("✅ Admin impersonation success!");

  // 6. Verify Impersonated user profile retrieval
  console.log("\n[Test 6] Retriving profile via impersonation token...");
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${impersonationToken}`
    }
  });
  const meData = await meRes.json();
  console.log("Me Response:", meRes.status, meData);
  if (meRes.status !== 200) {
    throw new Error("Me request failed with impersonation token");
  }
  if (meData.user.id !== schoolUserId) {
    throw new Error("Expected impersonated ID to match school user ID");
  }
  console.log("✅ Profile retrieval works with impersonation token!");

  // 7. Security: Verify Invalid/Non-UUID Token Gate
  console.log("\n[Test 7] Verify security handling of invalid non-UUID token payload...");
  const jwt = require("jsonwebtoken");
  const badToken = jwt.sign(
    { id: "admin-user", role: "admin", phone: "+2348000000000" },
    "prepfast-dev-secret-change-in-production" // dev jwt secret
  );

  const securityRes = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${badToken}`
    }
  });
  const securityData = await securityRes.json();
  console.log("Invalid Token Response Status:", securityRes.status);
  console.log("Invalid Token Response Data:", securityData);
  if (securityRes.status !== 401) {
    throw new Error("Expected 401 response for non-UUID token, got: " + securityRes.status);
  }
  console.log("✅ Security check passed! Stale/invalid text tokens are properly rejected early (no CastError crash).");

  console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
}

runTests().catch(err => {
  console.error("\n❌ TEST FAILED:", err);
  process.exit(1);
});
