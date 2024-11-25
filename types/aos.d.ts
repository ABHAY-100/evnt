declare module 'aos' {
  interface AosOptions {
    offset?: number;
    delay?: number;
    duration?: number;
    easing?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
  }

  function init(options?: AosOptions): void;
  function refresh(): void;

  export default {
    init: init,
    refresh: refresh
  };
}
