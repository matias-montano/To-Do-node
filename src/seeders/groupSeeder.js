import Group from '../models/Group.js';

export const seedGroups = async (users) => {
  console.log('Seeding groups...');
  
  // Clean existing groups
  await Group.deleteMany({});
  
  if (!users || users.length === 0) {
    console.log('No users found to create groups. Skipping...');
    return [];
  }
  
  // Find users by username
  const jana = users.find(user => user.username === 'jana');
  const john = users.find(user => user.username === 'john');
  const Sam = users.find(user => user.username === 'Sam');
  
  if (!jana || !john || !Sam) {
    console.log('Required users not found. Skipping group creation...');
    return [];
  }
  
  // Create one group with all three users
  const groups = [
    {
      name: 'Desarrollo 1',
      description: 'Equipo principal de desarrollo de software',
      visibility: 'public',
      createdBy: jana._id, // Jana como creadora (admin)
      members: [
        { user: jana._id, role: 'admin', joinedAt: new Date() },
        { user: john._id, role: 'member', joinedAt: new Date() },
        { user: Sam._id, role: 'member', joinedAt: new Date() }
      ],
      isActive: true,
      createdAt: new Date()
    }
  ];
  
  const createdGroups = await Group.insertMany(groups);
  console.log(`${createdGroups.length} groups created successfully`);
  
  return createdGroups;
};