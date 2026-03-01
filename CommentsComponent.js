const COMMENTS_STYLE_ID = 'comments-component-styles';

function injectStyles() {
  if (document.getElementById(COMMENTS_STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = COMMENTS_STYLE_ID;
  style.textContent = `
    .comments-card {
      font-family: "IBM Plex Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 1.5rem;
      background: #ffffff;
      box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
      max-width: 560px;
      margin: 0 auto;
    }
    .comments-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 1rem;
    }
    .comments-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .comments-form input,
    .comments-form textarea {
      width: 100%;
      border: 1px solid #d1d5db;
      border-radius: 14px;
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      resize: vertical;
      min-height: 48px;
      font-family: inherit;
      background: #f9fafb;
    }
    .comments-form textarea {
      min-height: 96px;
    }
    .comments-form input:focus,
    .comments-form textarea:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
      background: #ffffff;
    }
    .comments-actions {
      display: flex;
      justify-content: flex-end;
    }
    .comments-form button {
      border: none;
      border-radius: 14px;
      background: #0f172a;
      color: #ffffff;
      font-weight: 600;
      padding: 0.65rem 1.5rem;
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.2s ease;
    }
    .comments-form button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .comments-list {
      list-style: none;
      padding: 0;
      margin: 1.5rem 0 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 360px;
      overflow-y: auto;
    }
    .comments-item {
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 0.9rem 1rem;
      background: #f8fafc;
    }
    .comments-item header {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      margin-bottom: 0.4rem;
      gap: 1rem;
    }
    .comments-author {
      font-weight: 600;
      color: #0f172a;
    }
    .comments-date {
      color: #94a3b8;
      white-space: nowrap;
    }
    .comments-text {
      font-size: 0.95rem;
      color: #1f2937;
      line-height: 1.5;
      margin: 0;
    }
    .comments-load-more {
      margin-top: 1rem;
      width: 100%;
      border-radius: 14px;
      border: 1px solid #cbd5f5;
      background: #eef2ff;
      color: #1e293b;
      font-weight: 600;
      padding: 0.6rem;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
    }
    .comments-load-more:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .comments-empty {
      text-align: center;
      color: #94a3b8;
      font-size: 0.9rem;
      margin-top: 1rem;
    }
    @media (max-width: 640px) {
      .comments-card {
        border-radius: 16px;
        padding: 1.25rem;
      }
    }
  `;

  document.head.appendChild(style);
}

function buildRequestHeaders(apiKey) {
  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };
}

export class CommentsComponent {
  constructor({
    root,
    entregaId,
    supabaseUrl,
    supabaseKey,
    pageSize = 5,
  }) {
    if (!root) throw new Error('Root element is required');
    if (!entregaId) throw new Error('entrega_id es obligatorio');

    this.root = root;
    this.entregaId = entregaId;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.pageSize = pageSize;
    this.currentPage = 0;
    this.hasMore = true;
    this.isLoading = false;

    injectStyles();
    this.render();
    this.loadComments();
  }

  get baseUrl() {
    return `${this.supabaseUrl.replace(/\/$/, '')}/rest/v1/comentarios_entregas`;
  }

  render() {
    this.root.innerHTML = '';
    this.root.classList.add('comments-card');

    const title = document.createElement('h3');
    title.textContent = 'Comentarios de la entrega';

    this.form = document.createElement('form');
    this.form.className = 'comments-form';

    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.placeholder = 'Tu nombre (opcional)';

    this.textarea = document.createElement('textarea');
    this.textarea.placeholder = 'Escribe tu comentario...';
    this.textarea.required = true;

    const actions = document.createElement('div');
    actions.className = 'comments-actions';

    this.submitButton = document.createElement('button');
    this.submitButton.type = 'submit';
    this.submitButton.textContent = 'Enviar';

    actions.appendChild(this.submitButton);
    this.form.append(this.nameInput, this.textarea, actions);
    this.form.addEventListener('submit', (ev) => this.handleSubmit(ev));

    this.list = document.createElement('ul');
    this.list.className = 'comments-list';

    this.emptyState = document.createElement('p');
    this.emptyState.className = 'comments-empty';
    this.emptyState.textContent = 'Todavía no hay comentarios.';
    this.emptyState.hidden = true;

    this.loadMoreBtn = document.createElement('button');
    this.loadMoreBtn.className = 'comments-load-more';
    this.loadMoreBtn.type = 'button';
    this.loadMoreBtn.textContent = 'Cargar más';
    this.loadMoreBtn.addEventListener('click', () => this.loadComments({ append: true }));

    this.root.append(title, this.form, this.list, this.emptyState, this.loadMoreBtn);
  }

  async handleSubmit(event) {
    event.preventDefault();
    const contenido = this.textarea.value.trim();
    if (!contenido) return;

    const autor_nombre = this.nameInput.value.trim() || 'Anónimo';
    this.setLoading(true);

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: buildRequestHeaders(this.supabaseKey),
        body: JSON.stringify({ entrega_id: this.entregaId, autor_nombre, contenido }),
      });

      if (!response.ok) throw new Error('No se pudo guardar el comentario');
      const [saved] = await response.json();
      this.prependComment(saved);
      this.textarea.value = '';
    } catch (error) {
      console.error(error);
      alert('Hubo un problema al enviar tu comentario. Intenta de nuevo.');
    } finally {
      this.setLoading(false);
    }
  }

  async loadComments({ append = false } = {}) {
    if (this.isLoading || !this.hasMore && append) return;
    this.setLoading(true);

    const from = this.currentPage * this.pageSize;
    const to = from + this.pageSize - 1;
    const query = `${this.baseUrl}?select=* &entrega_id=eq.${encodeURIComponent(this.entregaId)}&order=created_at.desc`;

    try {
      const response = await fetch(query.replace(/\s+/g, ''), {
        method: 'GET',
        headers: {
          ...buildRequestHeaders(this.supabaseKey),
          Accept: 'application/json',
          Range: `${from}-${to}`,
          'Range-Unit': 'items',
        },
      });

      if (!response.ok) throw new Error('Error al cargar comentarios');
      const data = await response.json();

      if (!append) {
        this.list.innerHTML = '';
      }

      if (data.length < this.pageSize) {
        this.hasMore = false;
        this.loadMoreBtn.disabled = true;
        this.loadMoreBtn.textContent = 'No hay más comentarios';
      }

      if (data.length) {
        this.currentPage += 1;
      }

      data.forEach((comment) => this.list.appendChild(this.createCommentNode(comment)));
      this.emptyState.hidden = this.list.children.length !== 0;
    } catch (error) {
      console.error(error);
      this.emptyState.hidden = false;
      this.emptyState.textContent = 'No pudimos cargar los comentarios.';
    } finally {
      this.setLoading(false);
    }
  }

  prependComment(comment) {
    const node = this.createCommentNode(comment);
    this.list.prepend(node);
    this.emptyState.hidden = true;
  }

  createCommentNode(comment) {
    const li = document.createElement('li');
    li.className = 'comments-item';

    const header = document.createElement('header');
    const author = document.createElement('span');
    author.className = 'comments-author';
    author.textContent = comment.autor_nombre || 'Anónimo';

    const date = document.createElement('span');
    date.className = 'comments-date';
    date.textContent = new Date(comment.created_at).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });

    header.append(author, date);

    const body = document.createElement('p');
    body.className = 'comments-text';
    body.textContent = comment.contenido;

    li.append(header, body);
    return li;
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    this.submitButton.disabled = isLoading;
    this.loadMoreBtn.disabled = isLoading || !this.hasMore;
  }
}

export function mountCommentsFromDom({
  selector = '[data-entrega-comments]',
  supabaseUrl,
  supabaseKey,
  pageSize,
} = {}) {
  const nodes = document.querySelectorAll(selector);
  nodes.forEach((node) => {
    const entregaId = node.dataset.entregaId || node.getAttribute('data-entrega-id');
    // eslint-disable-next-line no-new
    new CommentsComponent({ root: node, entregaId, supabaseUrl, supabaseKey, pageSize });
  });
}

if (typeof window !== 'undefined') {
  window.CommentsComponent = CommentsComponent;
  window.mountCommentsFromDom = mountCommentsFromDom;
}
