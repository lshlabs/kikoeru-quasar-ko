const RJ_CODE_DETECTOR = /RJ[\s_-]*\d{6,8}/iu
const RJ_CODE_PATTERN = /[\s_-]*(?:\p{Ps}\s*RJ[\s_-]*\d{6,8}\s*\p{Pe}|([#*_~+=@!$%^])\s*RJ[\s_-]*\d{6,8}\s*\1|RJ[\s_-]*\d{6,8})[\s_-]*/giu
const EMPTY_WRAPPER_PATTERN = /([\p{Ps}])\s*([\p{Pe}])|([#*_~+=@!])\s*\3/gu
const EDGE_SEPARATOR_PATTERN = /^[\s_#＃@＠\-–—=+~～.,，。:：;；·・]+|[\s_#＃@＠\-–—=+~～.,，。:：;；·・]+$/gu

export function cleanFolderName (folderName) {
  const value = String(folderName || '')
  if (!RJ_CODE_DETECTOR.test(value)) return value

  return value
    .replace(RJ_CODE_PATTERN, ' ')
    .replace(EMPTY_WRAPPER_PATTERN, ' ')
    .replace(/\s+/gu, ' ')
    .replace(EDGE_SEPARATOR_PATTERN, '')
    .trim()
}

export function displayWorkTitle (work, mode = 'metadata') {
  if (!work) return ''

  if (mode === 'folder') {
    return cleanFolderName(work.folderName) || work.title || ''
  }

  if (mode === 'custom') {
    return work.customTitle || work.title || ''
  }

  return work.title || ''
}
