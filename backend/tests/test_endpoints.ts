import { createApp } from "../src/app.js";
import { Server } from "http";

let server: Server;
const PORT = 5055;
const BASE_URL = `http://localhost:${PORT}/api`;

async function runTests() {
  console.log("🧪 Starting Automated Backend Authentication Verification Suite...\n");
  const app = createApp();

  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Test server running on port ${PORT}`);
      resolve();
    });
  });

  let testsPassed = 0;
  let testsFailed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      testsPassed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      testsFailed++;
    }
  }

  try {
    // 1. Health Check
    console.log("\n[1] Testing GET /api/health");
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, "Health check status is 200");
    assert(healthData.success === true && healthData.data.status === "ok", "Health status is ok");

    // 2. Account A Login (Alex Rivera)
    console.log("\n[2] Testing Account A Login (POST /api/auth/login with alex@berkeley.edu)");
    const loginResA = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "alex@berkeley.edu",
        password: "password123",
      }),
    });
    const loginDataA = await loginResA.json();
    assert(loginResA.status === 200, "Account A login returned 200");
    assert(loginDataA.success === true, "Account A login success is true");
    assert(typeof loginDataA.data?.token === "string", "Account A received valid JWT string");
    assert(loginDataA.data?.user?.id === "usr_alex", "Account A user ID is usr_alex");
    assert(loginDataA.data?.user?.name === "Alex Rivera", "Account A user name is Alex Rivera");
    assert(!loginDataA.data?.user?.passwordHash, "passwordHash is stripped from response");
    const tokenA = loginDataA.data.token;

    // 3. Test GET /api/auth/me with Account A Token
    console.log("\n[3] Testing GET /api/auth/me with Account A Token");
    const meResA = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const meDataA = await meResA.json();
    assert(meResA.status === 200, "GET /api/auth/me returned 200");
    assert(meDataA.data?.user?.id === "usr_alex", "Authenticated user is Alex Rivera");
    assert(meDataA.data?.user?.college === "UC Berkeley", "User college matches seed data");

    // 4. Test Account B Login (Sophia Chen)
    console.log("\n[4] Testing Account B Login (POST /api/auth/login with sophia@stanford.edu)");
    const loginResB = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "sophia@stanford.edu",
        password: "password123",
      }),
    });
    const loginDataB = await loginResB.json();
    assert(loginResB.status === 200, "Account B login returned 200");
    assert(loginDataB.data?.user?.id === "usr_sophia", "Account B user ID is usr_sophia");
    assert(loginDataB.data?.user?.name === "Sophia Chen", "Account B user name is Sophia Chen");
    const tokenB = loginDataB.data.token;

    // 5. Test GET /api/auth/me with Account B Token
    console.log("\n[5] Testing GET /api/auth/me with Account B Token");
    const meResB = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const meDataB = await meResB.json();
    assert(meResB.status === 200, "GET /api/auth/me with Token B returned 200");
    assert(meDataB.data?.user?.id === "usr_sophia", "Authenticated user is Sophia Chen");
    assert(tokenA !== tokenB, "Token A and Token B are distinct and unique");

    // 6. Test Invalid Credentials
    console.log("\n[6] Testing Invalid Credentials");
    const badPassRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "alex@berkeley.edu",
        password: "wrongpassword!",
      }),
    });
    const badPassData = await badPassRes.json();
    assert(badPassRes.status === 401, "Wrong password returned 401 Unauthorized");
    assert(badPassData.success === false, "Wrong password response has success: false");

    const badEmailRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nonexistent@school.edu",
        password: "password123",
      }),
    });
    assert(badEmailRes.status === 401, "Non-existent user returned 401 Unauthorized");

    // 7. Test Zod Validation Error on Invalid Input
    console.log("\n[7] Testing Zod Validation Error (invalid email format)");
    const invalidFormatRes = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "not-an-email",
        password: "123",
      }),
    });
    const invalidFormatData = await invalidFormatRes.json();
    assert(invalidFormatRes.status === 400, "Malformed request returned 400 Bad Request");
    assert(invalidFormatData.details?.length > 0, "Validation details provided in response");

    // 8. Test Unauthorized Requests to /api/auth/me
    console.log("\n[8] Testing Unauthorized Requests (no token / invalid token)");
    const noTokenRes = await fetch(`${BASE_URL}/auth/me`);
    assert(noTokenRes.status === 401, "Missing Authorization header returns 401");

    const badTokenRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: "Bearer invalid.jwt.token" },
    });
    assert(badTokenRes.status === 401, "Invalid Bearer token returns 401");

    // 9. Test Registration Endpoint (POST /api/auth/register)
    console.log("\n[9] Testing User Registration (POST /api/auth/register)");
    const registerEmail = `newstudent_${Date.now()}@university.edu`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: registerEmail,
        password: "securepassword123",
        name: "Jordan Lee",
        college: "MIT",
        major: "Robotics & AI",
        year: "Junior",
        bio: "Excited to exchange ROS2 skills for React Native.",
      }),
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, "Registration returned 201 Created");
    assert(regData.success === true, "Registration success is true");
    assert(regData.data?.user?.email === registerEmail, "New user email matches");
    assert(typeof regData.data?.token === "string", "Registration returns JWT token");
    const newRegToken = regData.data.token;

    // Verify newly registered user with /api/auth/me
    const meNewRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${newRegToken}` },
    });
    const meNewData = await meNewRes.json();
    assert(meNewData.data?.user?.name === "Jordan Lee", "GET /api/auth/me returns newly registered user");

    // Test Duplicate Registration Conflict
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: registerEmail,
        password: "securepassword123",
        name: "Duplicate Jordan",
      }),
    });
    assert(dupRes.status === 409, "Duplicate email registration returned 409 Conflict");

    // 10. Test Logout (POST /api/auth/logout)
    console.log("\n[10] Testing Logout (POST /api/auth/logout)");
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenA}`,
        "Content-Type": "application/json",
      },
    });
    const logoutData = await logoutRes.json();
    assert(logoutRes.status === 200, "Logout returned 200 OK");
    assert(logoutData.success === true, "Logout success is true");

    console.log("\n==========================================");
    console.log(`📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);
    console.log("==========================================\n");

    if (testsFailed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution exception:", err);
    process.exit(1);
  } finally {
    server.close();
  }
}

runTests();
