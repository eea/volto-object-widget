import loadable from '@loadable/component';

const LoadableJsonEditor = loadable.lib(() =>
  import('jsoneditor/dist/jsoneditor.min'),
);

const jsoneditor = __CLIENT__ && LoadableJsonEditor;

export async function initEditor({ el, editor, dflt, options, onInit }) {
  if (!jsoneditor) return;
  const module = await jsoneditor.load();
  const { default: JSONEditor } = module;

  const container = el;

  if (!container) {
    return;
  }

  container.innerHTML = '';

  const _options = {
    mode: 'code',
    enableTransform: false,
    ...options,
  };

  editor.current = new JSONEditor(container, _options, dflt);

  if (onInit) {
    requestAnimationFrame(() => {
      onInit();
    });
  }
}

export function destroyEditor(editor) {
  if (editor) {
    editor.destroy();
    editor = null;
  }
}

export async function validateEditor(editor) {
  const err = await editor.current.validate();

  if (err && err.length) {
    return { valid: false, errors: err };
  }

  return { valid: true, errors: [] };
}
