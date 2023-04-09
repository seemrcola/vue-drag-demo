export function useIfWebkit() {
  function ifWebkit() {
    return (/AppleWebKit/i.test(navigator.userAgent))
  }
  window.$ifwebkit = ifWebkit()
}
