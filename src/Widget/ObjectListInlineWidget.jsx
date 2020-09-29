import { Accordion, Button, Segment } from 'semantic-ui-react';

import React from 'react';
import { Icon as VoltoIcon, FormFieldWrapper } from '@plone/volto/components';
import { DragDropList } from '@eeacms/volto-blocks-form/components';
import ObjectWidget from './ObjectWidget';

import deleteSVG from '@plone/volto/icons/delete.svg';
import addSVG from '@plone/volto/icons/add.svg';
import dragSVG from '@plone/volto/icons/drag.svg';
import { v4 as uuid } from 'uuid';

import './style.css';

const ObjectListInlineWidget = (props) => {
  const { id, schema, value = [], onChange } = props;

  const [accordionStates, setAccordionStates] = React.useState({});

  console.log('oliw', props);
  return (
    <>
      <FormFieldWrapper {...props} className="objectlist-inline-widget">
        <div>
          <Button
            compact
            onClick={() =>
              onChange(id, [
                ...value,
                {
                  '@id': uuid(),
                },
              ])
            }
          >
            <VoltoIcon name={addSVG} size="12px" />
            {`Add ${schema.title}`}
          </Button>
        </div>
      </FormFieldWrapper>
      <DragDropList
        childList={value.map((o, i) => [i, o])}
        onMoveItem={(result) => {
          console.log('moved', result);
          const { source, destination } = result;
          if (!destination) {
            return;
          }
          const s = parseInt(source);
          const d = parseInt(destination);

          const first = value[s];
          const second = value[d];
          value[d] = first;
          value[s] = second;

          onChange(id, value);
        }}
      >
        {({ child, childId, index, draginfo }) => {
          return (
            <div ref={draginfo.innerRef} {...draginfo.draggableProps}>
              <Segment.Group raised>
                <Accordion key={index} fluid styled>
                  <Accordion.Title>
                    <button
                      style={{
                        visibility: 'visible',
                        display: 'inline-block',
                      }}
                      {...draginfo.dragHandleProps}
                      className="drag handle"
                    >
                      <VoltoIcon name={dragSVG} size="18px" />
                    </button>

                    {`${schema.title} #${index + 1}`}
                    <button
                      onClick={() => {
                        onChange(
                          id,
                          value.filter((v, i) => i !== index),
                        );
                      }}
                    >
                      <VoltoIcon name={deleteSVG} size="16px" />
                    </button>
                  </Accordion.Title>
                  <Accordion.Content active>
                    <Segment>
                      <ObjectWidget
                        id={`${id}-${index}`}
                        key={`ow-${id}-${index}`}
                        schema={schema}
                        value={child}
                        onChange={(fi, fv) => {
                          const newvalue = value.map((v, i) =>
                            i !== index ? v : fv,
                          );
                          onChange(id, newvalue);
                        }}
                      />
                    </Segment>
                  </Accordion.Content>
                </Accordion>
              </Segment.Group>
            </div>
          );
        }}
      </DragDropList>
    </>
  );
};
export default ObjectListInlineWidget;
