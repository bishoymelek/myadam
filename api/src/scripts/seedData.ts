import { connectDatabase } from '../config/database';
import { Availability, Booking } from '../models';

const seedDemoData = async () => {
  try {
    console.log('🌱 Seeding demo data...');
    
    // Clear existing data
    await Availability.deleteMany({});
    await Booking.deleteMany({});
    
    // Create sample availabilities
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(now);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    const availabilities = [
      // painter-1: Tomorrow 9 AM - 6 PM
      {
        painterId: 'painter-1',
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 18, 0),
      },
      // painter-2: Tomorrow 11 AM - 9 PM
      {
        painterId: 'painter-2', 
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 21, 0),
      },
      // painter-1: Day after tomorrow 2 PM - 8 PM
      {
        painterId: 'painter-1',
        startTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 14, 0),
        endTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 20, 0),
      },
      // painter-3: Day after tomorrow 10 AM - 4 PM
      {
        painterId: 'painter-3',
        startTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 10, 0),
        endTime: new Date(dayAfterTomorrow.getFullYear(), dayAfterTomorrow.getMonth(), dayAfterTomorrow.getDate(), 16, 0),
      },
    ];
    
    await Availability.insertMany(availabilities);
    
    // Create one sample booking to demonstrate conflict detection
    const sampleBooking = {
      painterId: 'painter-1',
      painterName: 'Painter One',
      customerId: 'demo-customer',
      startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 14, 0), // 2 PM
      endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 15, 0),   // 3 PM
      status: 'confirmed',
    };
    
    await Booking.create(sampleBooking);
    
    console.log('✅ Demo data seeded successfully!');
    console.log(`📅 Tomorrow: ${tomorrow.toDateString()}`);
    console.log(`📅 Day after: ${dayAfterTomorrow.toDateString()}`);
    console.log('🎨 Painters: painter-1, painter-2, painter-3');
    console.log('📝 Sample booking: painter-1 tomorrow 2-3 PM');
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
  }
};

// Run if called directly
if (require.main === module) {
  connectDatabase().then(seedDemoData).then(() => process.exit(0));
}

export { seedDemoData };