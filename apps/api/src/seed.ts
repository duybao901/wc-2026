export const seedGroups = [
  { code: 'A', name: 'Group A', teams: [
    { position: 1, name: 'Mexico', flagEmoji: 'MX' },
    { position: 2, name: 'South Africa', flagEmoji: 'ZA' },
    { position: 3, name: 'South Korea', flagEmoji: 'KR' },
    { position: 4, name: 'Czech Republic', flagEmoji: 'CZ' }
  ] },
  { code: 'B', name: 'Group B', teams: [
    { position: 1, name: 'Canada', flagEmoji: 'CA' },
    { position: 2, name: 'Bosnia and Herzegovina', flagEmoji: 'BA' },
    { position: 3, name: 'Qatar', flagEmoji: 'QA' },
    { position: 4, name: 'Switzerland', flagEmoji: 'CH' }
  ] },
  { code: 'C', name: 'Group C', teams: [
    { position: 1, name: 'Brazil', flagEmoji: 'BR' },
    { position: 2, name: 'Morocco', flagEmoji: 'MA' },
    { position: 3, name: 'Haiti', flagEmoji: 'HT' },
    { position: 4, name: 'Scotland', flagEmoji: 'GB-SCT' }
  ] },
  { code: 'D', name: 'Group D', teams: [
    { position: 1, name: 'United States', flagEmoji: 'US' },
    { position: 2, name: 'Paraguay', flagEmoji: 'PY' },
    { position: 3, name: 'Australia', flagEmoji: 'AU' },
    { position: 4, name: 'Turkey', flagEmoji: 'TR' }
  ] },
  { code: 'E', name: 'Group E', teams: [
    { position: 1, name: 'Germany', flagEmoji: 'DE' },
    { position: 2, name: 'Curacao', flagEmoji: 'CW' },
    { position: 3, name: 'Ivory Coast', flagEmoji: 'CI' },
    { position: 4, name: 'Ecuador', flagEmoji: 'EC' }
  ] },
  { code: 'F', name: 'Group F', teams: [
    { position: 1, name: 'Netherlands', flagEmoji: 'NL' },
    { position: 2, name: 'Japan', flagEmoji: 'JP' },
    { position: 3, name: 'Sweden', flagEmoji: 'SE' },
    { position: 4, name: 'Tunisia', flagEmoji: 'TN' }
  ] },
  { code: 'G', name: 'Group G', teams: [
    { position: 1, name: 'Belgium', flagEmoji: 'BE' },
    { position: 2, name: 'Egypt', flagEmoji: 'EG' },
    { position: 3, name: 'Iran', flagEmoji: 'IR' },
    { position: 4, name: 'New Zealand', flagEmoji: 'NZ' }
  ] },
  { code: 'H', name: 'Group H', teams: [
    { position: 1, name: 'Spain', flagEmoji: 'ES' },
    { position: 2, name: 'Cape Verde', flagEmoji: 'CV' },
    { position: 3, name: 'Saudi Arabia', flagEmoji: 'SA' },
    { position: 4, name: 'Uruguay', flagEmoji: 'UY' }
  ] },
  { code: 'I', name: 'Group I', teams: [
    { position: 1, name: 'France', flagEmoji: 'FR' },
    { position: 2, name: 'Senegal', flagEmoji: 'SN' },
    { position: 3, name: 'Iraq', flagEmoji: 'IQ' },
    { position: 4, name: 'Norway', flagEmoji: 'NO' }
  ] },
  { code: 'J', name: 'Group J', teams: [
    { position: 1, name: 'Argentina', flagEmoji: 'AR' },
    { position: 2, name: 'Algeria', flagEmoji: 'DZ' },
    { position: 3, name: 'Austria', flagEmoji: 'AT' },
    { position: 4, name: 'Jordan', flagEmoji: 'JO' }
  ] },
  { code: 'K', name: 'Group K', teams: [
    { position: 1, name: 'Portugal', flagEmoji: 'PT' },
    { position: 2, name: 'DR Congo', flagEmoji: 'CD' },
    { position: 3, name: 'Uzbekistan', flagEmoji: 'UZ' },
    { position: 4, name: 'Colombia', flagEmoji: 'CO' }
  ] },
  { code: 'L', name: 'Group L', teams: [
    { position: 1, name: 'England', flagEmoji: 'GB-ENG' },
    { position: 2, name: 'Croatia', flagEmoji: 'HR' },
    { position: 3, name: 'Ghana', flagEmoji: 'GH' },
    { position: 4, name: 'Panama', flagEmoji: 'PA' }
  ] }
];

export const seedMatches = [
  { fifaMatchNo: 1, groupCode: 'A', matchday: 1, homeTeam: 'Mexico', awayTeam: 'South Africa', kickoffAt: '2026-06-11T19:00:00.000Z', venue: 'Estadio Azteca', city: 'Mexico City', status: 'finished', homeScore: 2, awayScore: 0 },
  { fifaMatchNo: 2, groupCode: 'A', matchday: 1, homeTeam: 'South Korea', awayTeam: 'Czech Republic', kickoffAt: '2026-06-12T02:00:00.000Z', venue: 'Estadio Akron', city: 'Zapopan', status: 'finished', homeScore: 2, awayScore: 1 },
  { fifaMatchNo: 3, groupCode: 'B', matchday: 1, homeTeam: 'Canada', awayTeam: 'Bosnia and Herzegovina', kickoffAt: '2026-06-12T19:00:00.000Z', venue: 'BMO Field', city: 'Toronto', status: 'finished', homeScore: 1, awayScore: 1 },
  { fifaMatchNo: 4, groupCode: 'D', matchday: 1, homeTeam: 'United States', awayTeam: 'Paraguay', kickoffAt: '2026-06-13T01:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood', status: 'scheduled' },
  { fifaMatchNo: 5, groupCode: 'C', matchday: 1, homeTeam: 'Haiti', awayTeam: 'Scotland', kickoffAt: '2026-06-14T01:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough', status: 'scheduled' },
  { fifaMatchNo: 6, groupCode: 'D', matchday: 1, homeTeam: 'Australia', awayTeam: 'Turkey', kickoffAt: '2026-06-14T04:00:00.000Z', venue: 'BC Place', city: 'Vancouver', status: 'scheduled' },
  { fifaMatchNo: 7, groupCode: 'C', matchday: 1, homeTeam: 'Brazil', awayTeam: 'Morocco', kickoffAt: '2026-06-13T22:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford', status: 'scheduled' },
  { fifaMatchNo: 8, groupCode: 'B', matchday: 1, homeTeam: 'Qatar', awayTeam: 'Switzerland', kickoffAt: '2026-06-13T19:00:00.000Z', venue: 'Levi Stadium', city: 'Santa Clara', status: 'scheduled' },
  { fifaMatchNo: 9, groupCode: 'E', matchday: 1, homeTeam: 'Ivory Coast', awayTeam: 'Ecuador', kickoffAt: '2026-06-14T23:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', status: 'scheduled' },
  { fifaMatchNo: 10, groupCode: 'E', matchday: 1, homeTeam: 'Germany', awayTeam: 'Curacao', kickoffAt: '2026-06-14T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston', status: 'scheduled' },
  { fifaMatchNo: 11, groupCode: 'F', matchday: 1, homeTeam: 'Netherlands', awayTeam: 'Japan', kickoffAt: '2026-06-14T20:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington', status: 'scheduled' },
  { fifaMatchNo: 12, groupCode: 'F', matchday: 1, homeTeam: 'Sweden', awayTeam: 'Tunisia', kickoffAt: '2026-06-15T02:00:00.000Z', venue: 'Estadio BBVA', city: 'Guadalupe', status: 'scheduled' },
  { fifaMatchNo: 13, groupCode: 'H', matchday: 1, homeTeam: 'Saudi Arabia', awayTeam: 'Uruguay', kickoffAt: '2026-06-15T22:00:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens', status: 'scheduled' },
  { fifaMatchNo: 14, groupCode: 'H', matchday: 1, homeTeam: 'Spain', awayTeam: 'Cape Verde', kickoffAt: '2026-06-15T16:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', status: 'scheduled' },
  { fifaMatchNo: 15, groupCode: 'G', matchday: 1, homeTeam: 'Iran', awayTeam: 'New Zealand', kickoffAt: '2026-06-16T01:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood', status: 'scheduled' },
  { fifaMatchNo: 16, groupCode: 'G', matchday: 1, homeTeam: 'Belgium', awayTeam: 'Egypt', kickoffAt: '2026-06-15T19:00:00.000Z', venue: 'Lumen Field', city: 'Seattle', status: 'scheduled' },
  { fifaMatchNo: 17, groupCode: 'I', matchday: 1, homeTeam: 'France', awayTeam: 'Senegal', kickoffAt: '2026-06-16T19:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford', status: 'scheduled' },
  { fifaMatchNo: 18, groupCode: 'I', matchday: 1, homeTeam: 'Iraq', awayTeam: 'Norway', kickoffAt: '2026-06-16T22:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough', status: 'scheduled' },
  { fifaMatchNo: 19, groupCode: 'J', matchday: 1, homeTeam: 'Argentina', awayTeam: 'Algeria', kickoffAt: '2026-06-17T01:00:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City', status: 'scheduled' },
  { fifaMatchNo: 20, groupCode: 'J', matchday: 1, homeTeam: 'Austria', awayTeam: 'Jordan', kickoffAt: '2026-06-17T04:00:00.000Z', venue: 'Levi Stadium', city: 'Santa Clara', status: 'scheduled' },
  { fifaMatchNo: 21, groupCode: 'L', matchday: 1, homeTeam: 'Ghana', awayTeam: 'Panama', kickoffAt: '2026-06-17T23:00:00.000Z', venue: 'BMO Field', city: 'Toronto', status: 'scheduled' },
  { fifaMatchNo: 22, groupCode: 'L', matchday: 1, homeTeam: 'England', awayTeam: 'Croatia', kickoffAt: '2026-06-17T20:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington', status: 'scheduled' },
  { fifaMatchNo: 23, groupCode: 'K', matchday: 1, homeTeam: 'Portugal', awayTeam: 'DR Congo', kickoffAt: '2026-06-17T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston', status: 'scheduled' },
  { fifaMatchNo: 24, groupCode: 'K', matchday: 1, homeTeam: 'Uzbekistan', awayTeam: 'Colombia', kickoffAt: '2026-06-18T02:00:00.000Z', venue: 'Estadio Azteca', city: 'Mexico City', status: 'scheduled' },
  { fifaMatchNo: 25, groupCode: 'A', matchday: 2, homeTeam: 'Czech Republic', awayTeam: 'South Africa', kickoffAt: '2026-06-18T16:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', status: 'scheduled' },
  { fifaMatchNo: 26, groupCode: 'B', matchday: 2, homeTeam: 'Switzerland', awayTeam: 'Bosnia and Herzegovina', kickoffAt: '2026-06-18T19:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood', status: 'scheduled' },
  { fifaMatchNo: 27, groupCode: 'B', matchday: 2, homeTeam: 'Canada', awayTeam: 'Qatar', kickoffAt: '2026-06-18T22:00:00.000Z', venue: 'BC Place', city: 'Vancouver', status: 'scheduled' },
  { fifaMatchNo: 28, groupCode: 'A', matchday: 2, homeTeam: 'Mexico', awayTeam: 'South Korea', kickoffAt: '2026-06-19T01:00:00.000Z', venue: 'Estadio Akron', city: 'Zapopan', status: 'scheduled' },
  { fifaMatchNo: 29, groupCode: 'C', matchday: 2, homeTeam: 'Brazil', awayTeam: 'Haiti', kickoffAt: '2026-06-20T00:30:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', status: 'scheduled' },
  { fifaMatchNo: 30, groupCode: 'C', matchday: 2, homeTeam: 'Scotland', awayTeam: 'Morocco', kickoffAt: '2026-06-19T22:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough', status: 'scheduled' },
  { fifaMatchNo: 31, groupCode: 'D', matchday: 2, homeTeam: 'Turkey', awayTeam: 'Paraguay', kickoffAt: '2026-06-20T03:00:00.000Z', venue: 'Levi Stadium', city: 'Santa Clara', status: 'scheduled' },
  { fifaMatchNo: 32, groupCode: 'D', matchday: 2, homeTeam: 'United States', awayTeam: 'Australia', kickoffAt: '2026-06-19T19:00:00.000Z', venue: 'Lumen Field', city: 'Seattle', status: 'scheduled' },
  { fifaMatchNo: 33, groupCode: 'E', matchday: 2, homeTeam: 'Germany', awayTeam: 'Ivory Coast', kickoffAt: '2026-06-20T20:00:00.000Z', venue: 'BMO Field', city: 'Toronto', status: 'scheduled' },
  { fifaMatchNo: 34, groupCode: 'E', matchday: 2, homeTeam: 'Ecuador', awayTeam: 'Curacao', kickoffAt: '2026-06-21T00:00:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City', status: 'scheduled' },
  { fifaMatchNo: 35, groupCode: 'F', matchday: 2, homeTeam: 'Netherlands', awayTeam: 'Sweden', kickoffAt: '2026-06-20T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston', status: 'scheduled' },
  { fifaMatchNo: 36, groupCode: 'F', matchday: 2, homeTeam: 'Tunisia', awayTeam: 'Japan', kickoffAt: '2026-06-21T04:00:00.000Z', venue: 'Estadio BBVA', city: 'Guadalupe', status: 'scheduled' },
  { fifaMatchNo: 37, groupCode: 'H', matchday: 2, homeTeam: 'Uruguay', awayTeam: 'Cape Verde', kickoffAt: '2026-06-21T22:00:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens', status: 'scheduled' },
  { fifaMatchNo: 38, groupCode: 'H', matchday: 2, homeTeam: 'Spain', awayTeam: 'Saudi Arabia', kickoffAt: '2026-06-21T16:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', status: 'scheduled' },
  { fifaMatchNo: 39, groupCode: 'G', matchday: 2, homeTeam: 'Belgium', awayTeam: 'Iran', kickoffAt: '2026-06-21T19:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood', status: 'scheduled' },
  { fifaMatchNo: 40, groupCode: 'G', matchday: 2, homeTeam: 'New Zealand', awayTeam: 'Egypt', kickoffAt: '2026-06-22T01:00:00.000Z', venue: 'BC Place', city: 'Vancouver', status: 'scheduled' },
  { fifaMatchNo: 41, groupCode: 'I', matchday: 2, homeTeam: 'Norway', awayTeam: 'Senegal', kickoffAt: '2026-06-23T00:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford', status: 'scheduled' },
  { fifaMatchNo: 42, groupCode: 'I', matchday: 2, homeTeam: 'France', awayTeam: 'Iraq', kickoffAt: '2026-06-22T21:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', status: 'scheduled' },
  { fifaMatchNo: 43, groupCode: 'J', matchday: 2, homeTeam: 'Argentina', awayTeam: 'Austria', kickoffAt: '2026-06-22T17:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington', status: 'scheduled' },
  { fifaMatchNo: 44, groupCode: 'J', matchday: 2, homeTeam: 'Jordan', awayTeam: 'Algeria', kickoffAt: '2026-06-23T03:00:00.000Z', venue: 'Levi Stadium', city: 'Santa Clara', status: 'scheduled' },
  { fifaMatchNo: 45, groupCode: 'L', matchday: 2, homeTeam: 'England', awayTeam: 'Ghana', kickoffAt: '2026-06-23T20:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough', status: 'scheduled' },
  { fifaMatchNo: 46, groupCode: 'L', matchday: 2, homeTeam: 'Panama', awayTeam: 'Croatia', kickoffAt: '2026-06-23T23:00:00.000Z', venue: 'BMO Field', city: 'Toronto', status: 'scheduled' },
  { fifaMatchNo: 47, groupCode: 'K', matchday: 2, homeTeam: 'Portugal', awayTeam: 'Uzbekistan', kickoffAt: '2026-06-23T17:00:00.000Z', venue: 'NRG Stadium', city: 'Houston', status: 'scheduled' },
  { fifaMatchNo: 48, groupCode: 'K', matchday: 2, homeTeam: 'Colombia', awayTeam: 'DR Congo', kickoffAt: '2026-06-24T02:00:00.000Z', venue: 'Estadio Akron', city: 'Zapopan', status: 'scheduled' },
  { fifaMatchNo: 49, groupCode: 'C', matchday: 3, homeTeam: 'Scotland', awayTeam: 'Brazil', kickoffAt: '2026-06-24T22:00:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens', status: 'scheduled' },
  { fifaMatchNo: 50, groupCode: 'C', matchday: 3, homeTeam: 'Morocco', awayTeam: 'Haiti', kickoffAt: '2026-06-24T22:00:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', status: 'scheduled' },
  { fifaMatchNo: 51, groupCode: 'B', matchday: 3, homeTeam: 'Switzerland', awayTeam: 'Canada', kickoffAt: '2026-06-24T19:00:00.000Z', venue: 'BC Place', city: 'Vancouver', status: 'scheduled' },
  { fifaMatchNo: 52, groupCode: 'B', matchday: 3, homeTeam: 'Bosnia and Herzegovina', awayTeam: 'Qatar', kickoffAt: '2026-06-24T19:00:00.000Z', venue: 'Lumen Field', city: 'Seattle', status: 'scheduled' },
  { fifaMatchNo: 53, groupCode: 'A', matchday: 3, homeTeam: 'Czech Republic', awayTeam: 'Mexico', kickoffAt: '2026-06-25T01:00:00.000Z', venue: 'Estadio Azteca', city: 'Mexico City', status: 'scheduled' },
  { fifaMatchNo: 54, groupCode: 'A', matchday: 3, homeTeam: 'South Africa', awayTeam: 'South Korea', kickoffAt: '2026-06-25T01:00:00.000Z', venue: 'Estadio BBVA', city: 'Guadalupe', status: 'scheduled' },
  { fifaMatchNo: 55, groupCode: 'E', matchday: 3, homeTeam: 'Curacao', awayTeam: 'Ivory Coast', kickoffAt: '2026-06-25T20:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', status: 'scheduled' },
  { fifaMatchNo: 56, groupCode: 'E', matchday: 3, homeTeam: 'Ecuador', awayTeam: 'Germany', kickoffAt: '2026-06-25T20:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford', status: 'scheduled' },
  { fifaMatchNo: 57, groupCode: 'F', matchday: 3, homeTeam: 'Japan', awayTeam: 'Sweden', kickoffAt: '2026-06-25T23:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington', status: 'scheduled' },
  { fifaMatchNo: 58, groupCode: 'F', matchday: 3, homeTeam: 'Tunisia', awayTeam: 'Netherlands', kickoffAt: '2026-06-25T23:00:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City', status: 'scheduled' },
  { fifaMatchNo: 59, groupCode: 'D', matchday: 3, homeTeam: 'Turkey', awayTeam: 'United States', kickoffAt: '2026-06-26T02:00:00.000Z', venue: 'SoFi Stadium', city: 'Inglewood', status: 'scheduled' },
  { fifaMatchNo: 60, groupCode: 'D', matchday: 3, homeTeam: 'Paraguay', awayTeam: 'Australia', kickoffAt: '2026-06-26T02:00:00.000Z', venue: 'Levi Stadium', city: 'Santa Clara', status: 'scheduled' },
  { fifaMatchNo: 61, groupCode: 'I', matchday: 3, homeTeam: 'Norway', awayTeam: 'France', kickoffAt: '2026-06-26T19:00:00.000Z', venue: 'Gillette Stadium', city: 'Foxborough', status: 'scheduled' },
  { fifaMatchNo: 62, groupCode: 'I', matchday: 3, homeTeam: 'Senegal', awayTeam: 'Iraq', kickoffAt: '2026-06-26T19:00:00.000Z', venue: 'BMO Field', city: 'Toronto', status: 'scheduled' },
  { fifaMatchNo: 63, groupCode: 'G', matchday: 3, homeTeam: 'Egypt', awayTeam: 'Iran', kickoffAt: '2026-06-27T03:00:00.000Z', venue: 'Lumen Field', city: 'Seattle', status: 'scheduled' },
  { fifaMatchNo: 64, groupCode: 'G', matchday: 3, homeTeam: 'New Zealand', awayTeam: 'Belgium', kickoffAt: '2026-06-27T03:00:00.000Z', venue: 'BC Place', city: 'Vancouver', status: 'scheduled' },
  { fifaMatchNo: 65, groupCode: 'H', matchday: 3, homeTeam: 'Cape Verde', awayTeam: 'Saudi Arabia', kickoffAt: '2026-06-27T00:00:00.000Z', venue: 'NRG Stadium', city: 'Houston', status: 'scheduled' },
  { fifaMatchNo: 66, groupCode: 'H', matchday: 3, homeTeam: 'Uruguay', awayTeam: 'Spain', kickoffAt: '2026-06-27T00:00:00.000Z', venue: 'Estadio Akron', city: 'Zapopan', status: 'scheduled' },
  { fifaMatchNo: 67, groupCode: 'L', matchday: 3, homeTeam: 'Panama', awayTeam: 'England', kickoffAt: '2026-06-27T21:00:00.000Z', venue: 'MetLife Stadium', city: 'East Rutherford', status: 'scheduled' },
  { fifaMatchNo: 68, groupCode: 'L', matchday: 3, homeTeam: 'Croatia', awayTeam: 'Ghana', kickoffAt: '2026-06-27T21:00:00.000Z', venue: 'Lincoln Financial Field', city: 'Philadelphia', status: 'scheduled' },
  { fifaMatchNo: 69, groupCode: 'J', matchday: 3, homeTeam: 'Algeria', awayTeam: 'Austria', kickoffAt: '2026-06-28T02:00:00.000Z', venue: 'Arrowhead Stadium', city: 'Kansas City', status: 'scheduled' },
  { fifaMatchNo: 70, groupCode: 'J', matchday: 3, homeTeam: 'Jordan', awayTeam: 'Argentina', kickoffAt: '2026-06-28T02:00:00.000Z', venue: 'AT&T Stadium', city: 'Arlington', status: 'scheduled' },
  { fifaMatchNo: 71, groupCode: 'K', matchday: 3, homeTeam: 'Colombia', awayTeam: 'Portugal', kickoffAt: '2026-06-27T23:30:00.000Z', venue: 'Hard Rock Stadium', city: 'Miami Gardens', status: 'scheduled' },
  { fifaMatchNo: 72, groupCode: 'K', matchday: 3, homeTeam: 'DR Congo', awayTeam: 'Uzbekistan', kickoffAt: '2026-06-27T23:30:00.000Z', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', status: 'scheduled' }
];
