export const Tab = {
  title: 'Tab',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title'],
    },
  ],

  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
  },

  required: ['title'],
};

export const LinkSchema = {
  title: 'Link',
  fieldsets: [
    {
      id: 'internal',
      title: 'Internal',
      fields: ['internal_link'],
    },
    {
      id: 'external',
      title: 'External',
      fields: ['external_link'],
    },
    {
      id: 'email',
      title: 'Email',
      fields: ['email_address', 'email_subject'],
    },
  ],
  properties: {
    internal_link: {
      widget: 'object_browser',
      title: 'Internal link',
      defaultValue: '',
    },
    external_link: {
      title: 'External URL',
      description:
        'URL can be relative within this site or absolute if it starts with http:// or https://',
    },
    email_address: {
      title: 'Email address',
    },
    email_subject: {
      title: 'Email subject',
      description: 'Optional',
    },
  },
  required: [],
};

export const CombinedSchema = {
  title: 'Tabs',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['tabs'],
    },
    {
      id: 'settings',
      title: 'Settings',
      fields: ['image', 'position', 'css_class'],
    },
    {
      id: 'link',
      title: 'Link',
      fields: ['link', 'link_target', 'link_title'],
    },
  ],

  properties: {
    link: {
      widget: 'object',
      schema: LinkSchema,
      default: {},
    },
    link_target: {
      title: 'Target',
      choices: [
        ['', 'Open in this window / frame'],
        ['_blank', 'Open in new window'],
        ['_parent', 'Open in parent window / frame'],
        ['_top', 'Open in top frame (replaces all frames)'],
      ],
    },
    link_title: {
      title: 'Title',
    },
    css_class: {
      title: 'CSS Class',
      default: 'default-tabsblock',
      widget: 'string',
    },
    tabs: {
      widget: 'object_list',
      title: 'Tabs',
      schema: Tab,
      description: 'This is a verification.',
    },
    image: {
      widget: 'attachedimage',
      title: 'Attached image',
    },
    position: {
      title: 'Position',
      description: 'Position of the tabs, content related',
      factory: 'Choice',
      type: 'string',
      choices: [
        ['top', 'Top'],
        ['bottom', 'Bottom'],
        ['left', 'Left'],
        ['right', 'Right'],
      ],
    },
  },

  required: ['tabs'],
};

export default CombinedSchema;
