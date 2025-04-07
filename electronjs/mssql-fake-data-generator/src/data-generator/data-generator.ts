import { faker } from '@faker-js/faker';

// Pre-generate dates for performance
const pastDates = Array.from({ length: 1000 }, () => faker.date.past());
const recentDates = Array.from({ length: 1000 }, () => faker.date.recent());

export function generateFakeUser(): any {
  return {
    Name: faker.person.fullName(),
    Email: faker.internet.email().toLowerCase(),
    Phone: faker.phone.number().toString(),
    Address: faker.location.streetAddress(),
    CreatedAt: pastDates[Math.floor(Math.random() * 1000)],
    UpdatedAt: recentDates[Math.floor(Math.random() * 1000)]
  };
}

export function generateBatch(size: number): any[] {
  return Array.from({ length: size }, generateFakeUser);
}

