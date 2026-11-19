import { useState, useRef, useEffect } from 'react';
import { Button, Segment, TextArea, Modal } from 'semantic-ui-react';
import FormFieldWrapper from '@plone/volto/components/manage/Widgets/FormFieldWrapper';
import { initEditor, destroyEditor, validateEditor } from './helpers';
import 'jsoneditor/dist/jsoneditor.min.css';
import './json-widget.css';

const JsonWidget = (props) => {
  const { id, title, description, value, onChange, required, error } = props;
  const [open, setOpen] = useState(false);
  const [editorValue, setEditorValue] = useState(null);
  const editorRef = useRef();
  const editorEl = useRef();
  const [ready, setReady] = useState(false);

  const initialValue = value ? JSON.parse(JSON.stringify(value)) : {};

  useEffect(() => {
    const editor = editorRef.current;
    return () => {
      if (editor) {
        destroyEditor(editor);
      }
    };
  }, []);

  const openEditor = (e) => {
    setEditorValue(initialValue);
    setOpen(true);
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    if (open && editorEl.current) {
      setReady(false);
      initEditor({
        el: editorEl.current,
        editor: editorRef,
        dflt: editorValue,
        options: {
          mode: 'code',
          enableTransform: false,
        },
        onInit: () => {
          setReady(true);
        },
      });
    }
  }, [open, editorValue]);

  const handleClose = () => {
    if (editorRef.current) {
      destroyEditor(editorRef.current);
    }
    setReady(false);
    setOpen(false);
  };

  const handleApply = async () => {
    const validation = await validateEditor(editorRef);
    if (!validation.valid) {
      return;
    }
    const newValue = editorRef.current.get();
    onChange(id, newValue);
    handleClose();
  };

  const renderPreview = () => {
    try {
      const parsed = value ? JSON.parse(JSON.stringify(value)) : {};
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return value || '';
    }
  };

  return (
    <FormFieldWrapper
      title={title}
      description={description}
      required={required}
      error={error}
      className="json-widget"
      id={id}
    >
      <Segment>
        <TextArea
          value={renderPreview()}
          readOnly
          onClick={openEditor}
          style={{
            fontFamily: 'monospace',
            fontSize: '0.9em',
          }}
          rows={5}
        />
      </Segment>

      <Modal
        open={open}
        onClose={handleClose}
        size="fullscreen"
        className="json-widget-modal"
      >
        <Modal.Content>
          <div ref={editorEl} style={{ width: '100%', height: '80vh' }} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button primary onClick={handleApply} disabled={!ready}>
            Apply
          </Button>
        </Modal.Actions>
      </Modal>
    </FormFieldWrapper>
  );
};

export default JsonWidget;
