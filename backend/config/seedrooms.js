const Room = require('../models/Room');

const predefinedRooms = [
  { name: 'Matematyka - podstawowy', subject: 'Matematyka', level: 'podstawowy' },
  { name: 'Matematyka - rozszerzony', subject: 'Matematyka', level: 'rozszerzony' },
  { name: 'Fizyka - podstawowy', subject: 'Fizyka', level: 'podstawowy' },
  { name: 'Fizyka - rozszerzony', subject: 'Fizyka', level: 'rozszerzony' },
  { name: 'Chemia - podstawowy', subject: 'Chemia', level: 'podstawowy' },
  { name: 'Chemia - rozszerzony', subject: 'Chemia', level: 'rozszerzony' },
  { name: 'Informatyka - podstawowy', subject: 'Informatyka', level: 'podstawowy' },
  { name: 'Informatyka - rozszerzony', subject: 'Informatyka', level: 'rozszerzony' },
  { name: 'Historia - rozszerzony', subject: 'Historia', level: 'rozszerzony' },
  { name: 'Biologia - rozszerzony', subject: 'Biologia', level: 'rozszerzony' },
];

async function seedRooms() {
  for (const room of predefinedRooms) {
    const exists = await Room.findOne({ subject: room.subject, level: room.level });
    if (!exists) {
      await Room.create(room);
      console.log(`✅ Utworzono pokój: ${room.name}`);
    }
  }
}

module.exports = seedRooms;
