const flagCdnCodes: Record<string, string> = {
  'GB-ENG': 'gb-eng',
  'GB-SCT': 'gb-sct'
};

export function flagImageUrl(code: string) {
  const normalized = code.toUpperCase();
  const cdnCode = flagCdnCodes[normalized] ?? normalized.toLowerCase();

  if (/^[a-z]{2}(-[a-z]{3})?$/.test(cdnCode)) {
    return `https://flagcdn.com/w80/${cdnCode}.png`;
  }

  return null;
}
