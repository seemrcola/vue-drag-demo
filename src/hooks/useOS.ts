export function useOS() {
  function OSnow() {
    const agent = navigator.userAgent.toLowerCase()
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent)

    if (agent.includes('win32') || agent.includes('wow32'))
      return 'WINDOWS'

    if (agent.includes('win64') || agent.includes('wow64'))
      return 'WINDOWS'

    if (isMac)
      return 'MAC'

    return 'MAC' // default is mac
  }
  const os = OSnow()
  window.$OS = os
}
