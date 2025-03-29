import Group from '../models/Group.js';
import User from '../models/User.js';

export const seedGroups = async (users) => {
  console.log('Seeding groups...');
  
  // Clean existing groups
  await Group.deleteMany({});
  
  // Find admin user for creating groups
  const adminUser = users.find(user => user.role === 'admin');
  const devUser = users.find(user => user.role === 'fullstack-dev');
  const designerUser = users.find(user => user.role === 'designer');
  
  if (!adminUser || !devUser || !designerUser) {
    console.log('Required users not found for group seeding');
    return [];
  }

  // Groups data
  const groups = [
    {
      name: 'Desarrollo 1',
      description: 'Equipo principal de desarrollo de software',
      visibility: 'public',
      createdBy: adminUser._id,
      members: [
        { user: adminUser._id, role: 'admin', joinedAt: new Date() },
        { user: devUser._id, role: 'member', joinedAt: new Date() },
        { user: designerUser._id, role: 'member', joinedAt: new Date() }
      ],
      isActive: true,
      createdAt: new Date()
    },
    {
      name: 'Ingeniería',
      description: 'Grupo para coordinar todas las actividades de desarrollo e ingeniería.',
      visibility: 'private',
      icon: 'code',
      createdBy: adminUser._id,
      members: [
        {
          user: adminUser._id,
          role: 'admin',
          joinedAt: new Date()
        },
        {
          user: devUser._id,
          role: 'member',
          joinedAt: new Date()
        }
      ]
    },
    {
      name: 'Diseño',
      description: 'Grupo dedicado al diseño UX/UI y gráficos para los proyectos.',
      visibility: 'public',
      icon: 'brush',
      createdBy: adminUser._id,
      members: [
        {
          user: adminUser._id,
          role: 'admin',
          joinedAt: new Date()
        },
        {
          user: designerUser._id,
          role: 'member',
          joinedAt: new Date()
        }
      ]
    }
  ];

  try {
    // Create groups
    const createdGroups = await Group.insertMany(groups);
    
    // Update users with group references
    for (const group of createdGroups) {
      for (const member of group.members) {
        await User.findByIdAndUpdate(
          member.user,
          { $addToSet: { groups: group._id } }
        );
      }
    }
    
    console.log(`${createdGroups.length} groups created successfully`);
    return createdGroups;
  } catch (error) {
    console.error('Error seeding groups:', error);
    return [];
  }
};