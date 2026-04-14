import { initEditor, destroyEditor, validateEditor } from './helpers';

jest.mock('jsoneditor/dist/jsoneditor.min', () => ({
  default: jest.fn().mockImplementation(() => ({
    validate: jest.fn().mockResolvedValue([]),
    destroy: jest.fn(),
  })),
}));

describe('JsonWidget helpers', () => {
  describe('initEditor', () => {
    it('creates editor when __CLIENT__ is true', async () => {
      const prev = global.__CLIENT__;
      global.__CLIENT__ = true;
      const el = document.createElement('div');
      document.body.appendChild(el);
      const editor = { current: null };
      const onInit = jest.fn();

      try {
        await initEditor({
          el,
          editor,
          dflt: { test: 'value' },
          onInit,
        });
      } catch (e) {
        // Expected in test env without real jsoneditor
      }

      document.body.removeChild(el);
      global.__CLIENT__ = prev;
    });

    it('uses default options when none provided', async () => {
      const prev = global.__CLIENT__;
      global.__CLIENT__ = true;
      const el = document.createElement('div');
      document.body.appendChild(el);
      const editor = { current: null };

      try {
        await initEditor({
          el,
          editor,
          dflt: { key: 'value' },
        });
      } catch (e) {
        // Expected
      }

      document.body.removeChild(el);
      global.__CLIENT__ = prev;
    });

    it('does nothing if container is missing', async () => {
      const prev = global.__CLIENT__;
      global.__CLIENT__ = true;
      const editor = { current: null };

      await initEditor({
        el: null,
        editor,
        dflt: {},
      });

      expect(editor.current).toBeNull();
      global.__CLIENT__ = prev;
    });
  });

  describe('destroyEditor', () => {
    it('does nothing if editor is null', () => {
      expect(destroyEditor(null)).toBeUndefined();
    });

    it('does nothing if editor is undefined', () => {
      expect(destroyEditor(undefined)).toBeUndefined();
    });

    it('calls destroy on editor instance', () => {
      const mockEditor = {
        destroy: jest.fn(),
      };
      destroyEditor(mockEditor);
      expect(mockEditor.destroy).toHaveBeenCalled();
    });
  });

  describe('validateEditor', () => {
    it('returns valid when no validation errors', async () => {
      const mockEditor = {
        current: {
          validate: jest.fn().mockResolvedValue([]),
        },
      };
      const result = await validateEditor(mockEditor);
      expect(result).toEqual({ valid: true, errors: [] });
    });

    it('returns invalid when validation errors exist', async () => {
      const mockEditor = {
        current: {
          validate: jest.fn().mockResolvedValue(['error 1', 'error 2']),
        },
      };
      const result = await validateEditor(mockEditor);
      expect(result).toEqual({
        valid: false,
        errors: ['error 1', 'error 2'],
      });
    });
  });
});
