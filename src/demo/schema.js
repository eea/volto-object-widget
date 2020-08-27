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
      default: [],
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

const LinkEditSchema = {
  title: 'Insert link',
  fieldsets: [
    {
      id: 'default',
      title: 'Internal link',
      fields: ['link', 'target', 'title'],
    },
  ],
  properties: {
    link: {
      widget: 'object',
      schema: LinkSchema,
    },
    target: {
      title: 'Target',
      choices: [
        ['', 'Open in this window / frame'],
        ['_blank', 'Open in new window'],
        ['_parent', 'Open in parent window / frame'],
        ['_top', 'Open in top frame (replaces all frames)'],
      ],
    },
    title: {
      title: 'Title',
    },
  },
  required: [],
};

export const Tabs = {
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
      fields: ['position', 'css_class'],
    },
  ],

  properties: {
    css_class: {
      title: 'CSS Class',
      default: 'default-tabsblock',
      widget: 'string',
    },
    tabs: {
      widget: 'object_list',
      title: 'Tabs',
      schema: Tab,
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
