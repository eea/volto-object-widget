import React from 'react';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ObjectListWidget, {
  FlatObjectList,
  ModalObjectListForm,
} from './ObjectListWidget';

const mockStore = configureStore();

// TODO: what about localized schemas?
const LinkSchema = {
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
      title: 'Internal link',
    },
    external_link: {
      title:
        'External URL (can be relative within this site or absolute if it starts with http:// or https://)',
    },
    email_address: {
      title: 'Email address',
    },
    email_subject: {
      title: 'Email subject (optional)',
    },
  },
  required: [],
};

test('renders an object list widget component', () => {
  const store = mockStore({
    search: {},
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  const { container } = render(
    <Provider store={store}>
      <ObjectListWidget
        id="my-widget"
        schema={LinkSchema}
        title="My Widget"
        onChange={() => {}}
        error={[]}
        value={[
          { external_link: 'https://dgg.gg' },
          { external_link: 'https://wikipedia.org' },
        ]}
        required={true}
        fieldSet="my-field-set"
        description="My description"
        onDelete={() => {}}
        onEdit={() => {}}
      />
    </Provider>,
  );

  expect(screen.getByLabelText('My Widget')).toBeInTheDocument();

  const inputField = container.querySelector('[name="my-widget"]');
  expect(inputField).toBeInTheDocument();
  expect(inputField).toHaveValue('2 x Link');
  expect(inputField).toBeDisabled();

  expect(
    container.querySelector('button[aria-label="Edit"]'),
  ).toBeInTheDocument();
  expect(
    container.querySelector('button[aria-label="Delete"]'),
  ).toBeInTheDocument();

  const bigPenButton = screen.getByTestId('big-pen-button');
  expect(bigPenButton).toBeInTheDocument();
  expect(bigPenButton).toHaveClass('ui button item ui noborder button');
  expect(bigPenButton).toHaveAttribute('title', 'Edit');
  expect(bigPenButton.querySelector('svg')).toHaveStyle({
    fill: 'blue',
    height: '18px',
    width: 'auto',
  });

  // Assert the help text
  expect(screen.getByText('My description')).toBeInTheDocument();
  expect(screen.getByText('My description')).toHaveClass('help');
});

test('renders an object list widget component and changes its value by clicking a button', async () => {
  const store = mockStore({
    search: {},
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  let valueState = [
    { external_link: 'https://ddg.gg' },
    { external_link: 'https://wikipedia.org' },
  ];

  let jsx = (
    <Provider store={store}>
      <>
        <ObjectListWidget
          id={`my-widget`}
          schema={LinkSchema}
          title="My Widget"
          onChange={(id, v) => {
            valueState = v;
            rerender(jsx);
          }}
          error={[]}
          value={valueState}
          required={true}
          description="My description"
          onDelete={() => {}}
          onEdit={() => {}}
        />
        <button
          onClick={(e) => {
            valueState = [{ external_link: 'https://duckduckgo.com' }];
            rerender(jsx);
            e.preventDefault();
          }}
        >
          Click me !
        </button>
      </>
    </Provider>
  );

  const { container, getByText, rerender, getByTestId, getAllByText } =
    render(jsx);

  // Assert the outer container
  const outerContainer = container.querySelector(
    '.inline.required.field.help.text.field-wrapper-my-widget',
  );
  expect(outerContainer).toBeInTheDocument();

  // Assert the label
  const label = screen.getByLabelText('My Widget');
  expect(label).toBeInTheDocument();
  expect(label).toHaveAttribute('id', 'field-my-widget');

  // Assert the toolbar
  const toolbar = container.querySelector('.toolbar');
  expect(toolbar).toBeInTheDocument();
  expect(toolbar).toHaveStyle({ 'z-index': '2' });

  const editButton = toolbar.querySelector('button[aria-label="Edit"]');
  expect(editButton).toBeInTheDocument();
  expect(editButton).toHaveClass('item ui noborder button');
  expect(editButton.querySelector('i')).toHaveClass(
    'blue write square large icon',
  );

  const deleteButton = toolbar.querySelector('button[aria-label="Delete"]');
  expect(deleteButton).toBeInTheDocument();
  expect(deleteButton).toHaveClass('item ui noborder button');
  expect(deleteButton.querySelector('i')).toHaveClass('red close large icon');

  // Assert the input field
  const inputField = container.querySelector('#field-my-widget');
  expect(inputField).toBeInTheDocument();
  expect(inputField).toHaveAttribute('name', 'my-widget');
  expect(inputField).toHaveAttribute('type', 'text');
  expect(inputField).toHaveValue('2 x Link');
  expect(inputField).toBeDisabled();

  const bigPenButton = screen.getByTestId('big-pen-button');
  expect(bigPenButton).toBeInTheDocument();
  expect(bigPenButton).toHaveClass('ui button item ui noborder button');
  expect(bigPenButton).toHaveAttribute('title', 'Edit');
  expect(bigPenButton.querySelector('svg')).toHaveStyle({
    fill: 'blue',
    height: '18px',
    width: 'auto',
  });

  const deleteButton2 = container.querySelector('button[aria-label="Delete"]');
  expect(deleteButton2).toBeInTheDocument();
  expect(deleteButton2).toHaveClass('ui button item ui noborder button');

  const deleteButtonSvg = container.querySelector(
    'button[aria-label="Delete"] svg',
  );
  expect(deleteButtonSvg).toHaveStyle({
    fill: 'red',
    height: '18px',
    width: 'auto',
  });

  // Assert the help text
  const helpText = screen.getByText('My description');
  expect(helpText).toBeInTheDocument();
  expect(helpText).toHaveClass('help');

  // Assert the additional button
  const extraButton = screen.getByText('Click me !');
  expect(extraButton).toBeInTheDocument();

  // click the button which changes data outside of modal
  fireEvent.click(getByText('Click me !'));

  // open the modal
  fireEvent.click(getByTestId('big-pen-button'));

  // click on the first External tab
  fireEvent.click(getAllByText('External')[0]);
});

test('renders a flat object list component with an item', async () => {
  const store = mockStore({
    search: {},
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  let valueState = [
    { external_link: 'https://ddg.gg' },
    { external_link: 'https://wikipedia.org' },
  ];

  let jsx = (
    <Provider store={store}>
      <FlatObjectList id={`my-widget`} schema={LinkSchema} value={valueState} />
    </Provider>
  );

  const { getAllByText, container } = render(jsx);

  const outerContainer = container.querySelector('.objectlist-widget-content');
  expect(outerContainer).toBeInTheDocument();

  // Assert the first grid layout
  const firstGrid = outerContainer.querySelector('.ui.grid:first-child');
  expect(firstGrid).toBeInTheDocument();

  const firstGridColumn = firstGrid.querySelector('.eleven.wide.column');
  expect(firstGridColumn).toBeInTheDocument();

  const firstSegment = firstGridColumn.querySelector('.ui.segment');
  expect(firstSegment).toBeInTheDocument();

  const firstObjectListItems = firstSegment.querySelectorAll(
    '.mocked-default-widget',
  );
  expect(firstObjectListItems).toHaveLength(1);
  expect(firstObjectListItems[0]).toHaveAttribute(
    'id',
    'mocked-field-internal_link-0-my-widget-0',
  );
  expect(firstObjectListItems[0]).toHaveTextContent(
    'Internal link - No description',
  );

  // Assert the second grid layout
  const secondGrid = outerContainer.querySelector('.ui.grid:nth-child(2)');
  expect(secondGrid).toBeInTheDocument();

  const secondGridColumn = secondGrid.querySelector('.eleven.wide.column');
  expect(secondGridColumn).toBeInTheDocument();

  const secondSegment = secondGridColumn.querySelector('.ui.segment');
  expect(secondSegment).toBeInTheDocument();

  const secondObjectListItems = secondSegment.querySelectorAll(
    '.mocked-default-widget',
  );
  expect(secondObjectListItems).toHaveLength(1);
  expect(secondObjectListItems[0]).toHaveAttribute(
    'id',
    'mocked-field-internal_link-0-my-widget-1',
  );
  expect(secondObjectListItems[0]).toHaveTextContent(
    'Internal link - No description',
  );

  // Assert the delete buttons
  const deleteButtons = container.querySelectorAll(
    'button[aria-label="Delete"]',
  );
  expect(deleteButtons).toHaveLength(2);
  deleteButtons.forEach((button) => {
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('ui mini basic circular button');
    expect(button).toHaveAttribute('title', 'Delete');
    const deleteButtonSvg = button.querySelector('svg');
    expect(deleteButtonSvg).toBeInTheDocument();
    expect(deleteButtonSvg).toHaveStyle({
      height: '18px',
      width: 'auto',
      fill: 'currentColor',
    });
  });

  const segment = firstGridColumn.querySelector('.ui.segment');
  expect(segment).toBeInTheDocument();

  const tabMenu = segment.querySelector('.ui.attached.tabular.menu');
  expect(tabMenu).toBeInTheDocument();
  const tabMenuItems = tabMenu.querySelectorAll('.item');
  expect(tabMenuItems).toHaveLength(3);
  expect(tabMenuItems[0]).toHaveClass('active');
  expect(tabMenuItems[0]).toHaveTextContent('Internal');
  expect(tabMenuItems[1]).toHaveTextContent('External');
  expect(tabMenuItems[2]).toHaveTextContent('Email');

  const activeTab = segment.querySelector(
    '.ui.bottom.attached.segment.active.tab',
  );
  expect(activeTab).toBeInTheDocument();
  const activeTabContent = activeTab.querySelector('.mocked-default-widget');
  expect(activeTabContent).toBeInTheDocument();
  expect(activeTabContent).toHaveAttribute(
    'id',
    'mocked-field-internal_link-0-my-widget-0',
  );
  expect(activeTabContent).toHaveTextContent('Internal link - No description');
  // load second tab in first item
  fireEvent.click(getAllByText('External')[0]);

  const activeTabContentAfterClick = activeTab.querySelector(
    '.mocked-default-widget',
  );
  expect(activeTabContentAfterClick).toBeInTheDocument();
  expect(activeTabContentAfterClick).toHaveAttribute(
    'id',
    'mocked-field-external_link-0-my-widget-0',
  );

  expect(activeTabContentAfterClick).toHaveTextContent(
    'External URL (can be relative within this site or absolute if it starts with http:// or https://) - No description',
  );

  // load second tab in second item
  fireEvent.click(getAllByText('External')[1]);

  const activeTabContentAfterClick1 = container.querySelector(
    '#mocked-field-external_link-0-my-widget-1',
  );
  expect(activeTabContentAfterClick1).toBeInTheDocument();

  expect(activeTabContentAfterClick1).toHaveTextContent(
    'External URL (can be relative within this site or absolute if it starts with http:// or https://) - No description',
  );
});

test('renders a modal object list form component and tests it in various ways', () => {
  const store = mockStore({
    search: {},
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  let valueState = [
    { external_link: 'https://ddg.gg' },
    { external_link: 'https://wikipedia.org' },
  ];

  let openState = true; // or false?

  let jsx = (
    <Provider store={store}>
      <ModalObjectListForm
        id="my-widget"
        schema={LinkSchema}
        title="Modal title"
        value={valueState}
        open={openState}
        onSave={(id, val) => {
          openState = false;
          rerender(jsx);
        }}
        onCancel={() => {
          openState = false;
          rerender(jsx);
        }}
      />
    </Provider>
  );

  const { getByText, rerender, getByTestId } = render(jsx);

  // set value prop to something else than the value before from outside the modal
  valueState = [{ external_link: 'https://duckduckgo.com' }];
  rerender(jsx);

  // in the modal there should be just a single item with the link: https://duckduckgo.com
  // (actual result: empty snapshot because of https://github.com/Semantic-Org/Semantic-UI-React/issues/3959)

  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  // add 20 objects to the modal
  for (let i = 0; i < 20; ++i) {
    fireEvent.click(getByText('Add Link'));
  }

  expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();

  // check if the modal has scrolled to bottom automatically
  let mc = getByTestId('modal-content');
  let sh = mc.scrollHeight;
  let st = mc.scrollTop;

  // the modal has scrolled to the bottom automatically?
  // both st and sh variables are 0 in jsdom environment, so it is useless here
  // console.log('st', st, 'sh', sh);
  expect(st).toEqual(sh);
});

test('renders a modal object list form component and tests it in other various ways', () => {
  const store = mockStore({
    search: {},
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  let valueState = [
    { external_link: 'https://ddg.gg' },
    { external_link: 'https://wikipedia.org' },
  ];

  let openState = true;

  let jsx = (
    <Provider store={store}>
      <ModalObjectListForm
        id="my-test-widget"
        schema={LinkSchema}
        title="My Modal Title"
        data-testid="my-modal"
        value={valueState}
        className="my-test-widget-class"
        open={openState}
        onSave={(id, val) => {
          openState = false;
          valueState = val;
          rerender(jsx);
        }}
        onCancel={() => {
          openState = false;
          rerender(jsx);
        }}
      />
    </Provider>
  );

  const { getByTitle, getByText, rerender } = render(jsx);

  fireEvent.click(getByTitle('Cancel'));

  expect(openState).toEqual(false);

  openState = true;
  rerender(jsx);

  fireEvent.click(getByText('Add Link'));

  fireEvent.click(getByTitle('Save'));

  expect(openState).toEqual(false);
  expect(valueState.length).toEqual(3);

  // actual result: empty snapshot because of https://github.com/Semantic-Org/Semantic-UI-React/issues/3959
});
