import { ref, type Ref } from 'vue';

export function useTypewriter(
  text: Ref<string>,
  speed: number = 40,
) {
  const displayed = ref('');
  const isTyping = ref(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const start = (fullText?: string) => {
    const source = fullText ?? text.value;
    displayed.value = '';
    isTyping.value = true;

    const chars = source.split('');
    let i = 0;

    const type = () => {
      if (i < chars.length) {
        displayed.value += chars[i];
        i++;
        const delay = chars[i - 1] === '\n' ? speed * 3 : speed;
        timer = setTimeout(type, delay);
      } else {
        isTyping.value = false;
      }
    };

    type();
  };

  const stop = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    isTyping.value = false;
  };

  const complete = () => {
    stop();
    displayed.value = text.value;
  };

  return { displayed, isTyping, start, stop, complete };
}
