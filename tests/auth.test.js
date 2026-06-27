// tests/auth.test.js
const request = require('supertest');
const app = require('../app'); // Grab our isolated app setup
const pool = require('../config/db'); // Grab db to clean up after ourselves

// Describe aggregates a collection of related endpoint tests
describe('Authentication Flow Integration Tests', () => {
    
    // 🧹 Clean up hook: Close your cloud DB pool sockets when ALL tests finish
    afterAll(async () => {
        await pool.end(); 
    });

    // Test Case 1
    it('should block signup requests if inputs are missing', async () => {
        const response = await request(app)
            .post('/auth/signup')
            .send({
                username: "" // Deliberately sending an empty username
            });

        // We expect our global validation error middleware to catch this and throw a 400!
        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    // Test Case 2
    it('should successfully onboard a valid dispatcher payload', async () => {
        // Generate a random unique username so our database unique key constraint doesn't trip on rerun
        const uniqueUsername = `test_dispatcher_${Date.now()}`;

        const response = await request(app)
            .post('/auth/signup')
            .send({
                username: uniqueUsername,
                password: "TestPassword123"
            });

        console.log("🔍 MY CONTROLLER RETURNED THIS:", response.body);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.username).toBe(uniqueUsername);
        expect(response.body).not.toHaveProperty('password_hash'); // Security check!
    });

    // Add this right underneath your onboarding test case inside tests/auth.test.js

    it('should successfully authenticate an existing dispatcher and issue a JWT token', async () => {
        const loginUsername = `login_test_${Date.now()}`;
        const loginPassword = `SecurePassword999`;

        // 1. Setup Phase: Onboard the target user account directly into the test sandbox database
        await request(app)
            .post('/auth/signup')
            .send({
                username: loginUsername,
                password: loginPassword
            });

        // 2. Action Phase: Hit your login endpoint with the credentials we just created
        const response = await request(app)
            .post('/auth/login')
            .send({
                username: loginUsername,
                password: loginPassword
            });

        // 3. Assertion Phase: Verify the server returns the correct tokens and messages
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token'); // Checks if the JWT string exists!
        expect(response.body.message).toBe('Login Successful');
    });
});