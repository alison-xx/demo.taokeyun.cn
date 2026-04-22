<script setup lang="ts">
import { computed } from 'vue';
import { marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/atom-one-dark.css';

defineProps<{ content: string }>();

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

const renderedHtml = computed(() => {
  if (!props.content) return '';
  const rawHtml = marked.parse(props.content);
  return DOMPurify.sanitize(rawHtml as string);
});
</script>

<template>
  <div
    class="markdown-body"
    v-html="renderedHtml"
  />
</template>

<style>
.markdown-body {
  font-family: var(--font-family-ui);
  line-height: 1.6;
  color: var(--text-primary);
  word-break: break-word;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body p:last-child {
  margin-bottom: 0;
}

.markdown-body code {
  font-family: var(--font-family-mono);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}

.markdown-body pre {
  background: #1e1e28;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.markdown-body pre code {
  background: transparent;
  padding: 0;
  border-radius: 0;
  font-size: 0.85em;
  color: #abb2bf;
}

.markdown-body ul, .markdown-body ol {
  padding-left: 20px;
  margin-bottom: 16px;
}

.markdown-body a {
  color: var(--brand-secondary);
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body blockquote {
  border-left: 4px solid var(--brand-accent);
  padding-left: 16px;
  margin-left: 0;
  color: var(--text-secondary);
}
</style>