/**
 * Category API Test Script
 * 
 * This script can be used to test the Category API endpoints.
 * Run this script with Node.js after starting your server.
 * 
 * Usage:
 * 1. Start your server
 * 2. Run: node tests/categoryApi.test.js
 */

const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api';
let token = ''; // Will be set after login
let categoryId = null; // Will be set after creating a category

// Test admin user credentials
const adminUser = {
  email: 'admin@example.com',
  password: 'password123'
};

// Test category data
const testCategory = {
  store_id: 1, // Replace with an actual store ID from your database
  name: 'Test Category',
  description: 'This is a test category',
  img_path: 'https://example.com/image.jpg'
};

// Helper function to log responses
const logResponse = (title, response) => {
  console.log('\n===', title, '===');
  console.log('Status:', response.status);
  console.log('Data:', JSON.stringify(response.data, null, 2));
};

// Helper function to log errors
const logError = (title, error) => {
  console.error('\n===', title, '===');
  console.error('Error:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', JSON.stringify(error.response.data, null, 2));
  }
};

// Main test function
const runTests = async () => {
  try {
    // Step 1: Login as admin
    console.log('\n=== Starting Category API Tests ===');
    console.log('Step 1: Login as admin');
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, adminUser);
    token = loginResponse.data.token;
    logResponse('Login Response', loginResponse);
    
    if (!token) {
      throw new Error('Failed to get authentication token');
    }
    
    // Set auth header for all subsequent requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Step 2: Create a new category
    console.log('\nStep 2: Create a new category');
    const createResponse = await axios.post(`${API_URL}/admin/categories`, testCategory);
    logResponse('Create Category Response', createResponse);
    
    categoryId = createResponse.data.data.category_id;
    
    // Step 3: Get all categories
    console.log('\nStep 3: Get all categories');
    const getAllResponse = await axios.get(`${API_URL}/admin/categories`);
    logResponse('Get All Categories Response', getAllResponse);
    
    // Step 4: Get category by ID
    console.log('\nStep 4: Get category by ID');
    const getByIdResponse = await axios.get(`${API_URL}/admin/categories/${categoryId}`);
    logResponse('Get Category By ID Response', getByIdResponse);
    
    // Step 5: Update the category
    console.log('\nStep 5: Update the category');
    const updateResponse = await axios.put(`${API_URL}/admin/categories/${categoryId}`, {
      name: 'Updated Test Category',
      description: 'This category has been updated'
    });
    logResponse('Update Category Response', updateResponse);
    
    // Step 6: Delete the category
    console.log('\nStep 6: Delete the category');
    const deleteResponse = await axios.delete(`${API_URL}/admin/categories/${categoryId}`);
    logResponse('Delete Category Response', deleteResponse);
    
    console.log('\n=== Category API Tests Completed Successfully ===');
  } catch (error) {
    logError('Test Error', error);
    console.error('\n=== Category API Tests Failed ===');
  }
};

// Run the tests
runTests();
