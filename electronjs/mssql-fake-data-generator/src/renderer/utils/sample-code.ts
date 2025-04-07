export const BasicCode = `// Welcome to the Generator Function Editor!
// This is your space to create custom fake data for your application.
// You can access the \`@faker-js/faker\` library with \`require('@faker-js/faker')\`.

const { faker } = require('@faker-js/faker');

function generateFakeData() {
  return {
    Name: faker.person.fullName(),
    Email: faker.internet.email(),
    Phone: faker.phone.number(),
  };
}

// Tip: Click "Confirm Code" to test and confirm your code!
`
export const AdvancedCode = `// Welcome to the Generator Function Editor!
// This is your space to create custom fake data for your application.

// **File Scope**: 
// - Code outside the function runs ONCE when you validate/run it.
// - Use this area to pre-compute values, define helpers, or set up data that 
//   your 'generateFakeData' function will use. It’s great for performance optimizations!
// - You have access to the '@faker-js/faker' library via 'require('@faker-js/faker')'.

const { faker } = require('@faker-js/faker');

// Example: Pre-generate arrays of dates to reuse in your function (runs once!)
const pastDates = Array.from({ length: 1000 }, () => faker.date.past());
const recentDates = Array.from({ length: 1000 }, () => faker.date.recent());

// You can define helper functions or constants here too!
const getRandomStatus = () => {
  const statuses = ['Active', 'Inactive', 'Pending'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// **Function Scope**: 
// - Define your 'generateFakeData' function below.
// - This function MUST be named 'generateFakeData' and exported (using 'export').
// - It will be called multiple times to generate an array of fake data objects.
// - Each call is independent, but it can use file-scope variables like 'pastDates'.

// **Maximize Your Creativity!**:
// - Use the full power of Faker.js (https://fakerjs.dev/api/) to generate realistic data.
// - Add as many fields as you want: names, emails, addresses, dates, numbers, etc.
// - Combine logic, randomness, or even nested objects to create complex data!

function generateFakeData() {
  return {
    // Basic user info
    Name: faker.person.fullName(),
    Email: faker.internet.email().toLowerCase(),
    Phone: faker.phone.number(),
    Address: faker.location.streetAddress(),

    // Pre-computed dates from file scope
    CreatedAt: pastDates[Math.floor(Math.random() * 1000)],
    UpdatedAt: recentDates[Math.floor(Math.random() * 1000)],

    // Example of custom logic using a helper
    Status: getRandomStatus(),

    // Go wild! Add more fields like these:
    Username: faker.internet.username(),
    Bio: faker.lorem.sentence(),
    Balance: faker.finance.amount(0, 10000, 2, '$'),
    Avatar: faker.image.avatar(),
    Company: faker.company.name(),
  };
}

// **Tips**:
// - Check out Faker’s API for more options (e.g., faker.person, faker.internet, faker.date).
// - Keep 'generateFakeData' fast since it runs for each item in the output array.
// - Test your code with the "Confirm Code" button to see a sample!
`