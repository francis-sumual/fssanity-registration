import {defineField, defineType} from 'sanity'

export const registrationType = defineType({
  name: 'registration',
  title: 'Registration',
  type: 'document',
  fields: [
    defineField({
      name: 'gathering',
      title: 'Gathering',
      type: 'reference',
      to: [{type: 'gathering'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'member',
      title: 'Member',
      type: 'reference',
      to: [{type: 'member'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Confirmed', value: 'confirmed'},
          {title: 'Pending', value: 'pending'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
      },
      initialValue: 'confirmed',
    }),
    defineField({
      name: 'registeredAt',
      title: 'Registered At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      memberName: 'member.name',
      gatheringTitle: 'gathering.title',
      status: 'status',
    },
    prepare(selection) {
      const {memberName, gatheringTitle, status} = selection
      return {
        title: memberName || 'Unknown Member',
        subtitle: `${gatheringTitle || 'Unknown Gathering'} - ${status || 'Unknown Status'}`,
      }
    },
  },
  // This ensures a member can't register twice for the same gathering
  indexes: [
    {
      name: 'member_gathering_unique',
      spec: {
        unique: true,
        fields: ['member', 'gathering'],
      },
    },
  ],
})
