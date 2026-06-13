import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  Landmark,
  Search,
  Trophy,
  Wifi
} from 'lucide-react';
import { flagImageUrl } from './flag-utils';
import {
  getDateKeyInVietnam,
  groupMatchesByDate,
  isFeaturedMatch,
  matchesFilter,
  VIETNAM_TIME_ZONE
} from './schedule-utils';
import type { Group, Match } from './types';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
const POLL_INTERVAL_MS = Number(import.meta.env.VITE_POLL_INTERVAL_MS ?? 5000);
const venueCountryByCity: Record<string, string> = {
  Arlington: 'US',
  Atlanta: 'US',
  'East Rutherford': 'US',
  Foxborough: 'US',
  Guadalupe: 'MX',
  Houston: 'US',
  Inglewood: 'US',
  'Kansas City': 'US',
  'Mexico City': 'MX',
  'Miami Gardens': 'US',
  Philadelphia: 'US',
  'Santa Clara': 'US',
  Seattle: 'US',
  Toronto: 'CA',
  Vancouver: 'CA',
  Zapopan: 'MX'
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: VIETNAM_TIME_ZONE
  }).format(new Date(`${value}T00:00:00+07:00`));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: VIETNAM_TIME_ZONE
  }).format(new Date(value));
}

function getCountdownParts(kickoffAt: string, now: Date) {
  const diff = new Date(kickoffAt).getTime() - now.getTime();

  if (diff <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours,
    minutes,
    seconds
  };
}

function useNow() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  return now;
}

function useSchedule() {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    const load = async (initial = false) => {
      try {
        if (initial) {
          setLoading(true);
        }

        const [groupsResponse, matchesResponse] = await Promise.all([
          fetch(`${API_URL}/groups`),
          fetch(`${API_URL}/matches`)
        ]);

        if (!groupsResponse.ok || !matchesResponse.ok) {
          throw new Error('API is not available');
        }

        if (!active) {
          return;
        }

        setGroups((await groupsResponse.json()) as Group[]);
        setMatches((await matchesResponse.json()) as Match[]);
        setLastUpdated(new Date().toISOString());
        setError(null);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load(true);
    const timer = window.setInterval(() => {
      void load();
    }, POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return { groups, matches, loading, error, lastUpdated };
}

function FlagBadge({ code, label, small = false }: { code?: string; label: string; small?: boolean }) {
  const [failed, setFailed] = React.useState(false);
  const url = code ? flagImageUrl(code) : null;

  if (!url || failed) {
    return (
      <span className={small ? 'flagBadge small fallback' : 'flagBadge fallback'} title={label}>
        {code ?? '--'}
      </span>
    );
  }

  return (
    <span className={small ? 'flagBadge small' : 'flagBadge'} title={label}>
      <img src={url} alt={`${label} flag`} loading="lazy" onError={() => setFailed(true)} />
    </span>
  );
}

function VenueInfo({ venue, city }: { venue: string; city: string }) {
  const countryCode = venueCountryByCity[city];

  return (
    <div className="venue">
      <div className="venueName">
        <Landmark size={15} />
        <span>{venue}</span>
      </div>
      <small>
        {countryCode && <FlagBadge code={countryCode} label={city} small />}
        <span>{city}</span>
      </small>
    </div>
  );
}

function CountdownBadge({ kickoffAt, now }: { kickoffAt: string; now: Date }) {
  const parts = getCountdownParts(kickoffAt, now);

  if (!parts) {
    return (
      <div className="countdownBadge soon">
        <Activity size={12} />
        <span>Starting soon</span>
      </div>
    );
  }

  return (
    <div className="countdownBadge" aria-label="Countdown to kickoff">
      <Clock3 size={12} />
      <span className="countUnit">
        <strong>{parts.hours.toString().padStart(2, '0')}</strong>
        <em>H</em>
      </span>
      <span className="countSeparator">:</span>
      <span className="countUnit">
        <strong>{parts.minutes.toString().padStart(2, '0')}</strong>
        <em>M</em>
      </span>
      <span className="countSeparator">:</span>
      <span className="countUnit">
        <strong>{parts.seconds.toString().padStart(2, '0')}</strong>
        <em>S</em>
      </span>
    </div>
  );
}

function MatchStatusBadge({ match, isToday }: { match: Match; isToday: boolean }) {
  if (match.status === 'finished') {
    return (
      <span className="statusBadge finished">
        <CheckCircle2 size={12} />
        FT
      </span>
    );
  }

  if (isToday) {
    return (
      <span className="statusBadge today">
        <Clock3 size={12} />
        Today
      </span>
    );
  }

  return (
    <span className="statusBadge scheduled">
      <CalendarDays size={12} />
      Upcoming
    </span>
  );
}

function App() {
  const { groups, matches, loading, error, lastUpdated } = useSchedule();
  const now = useNow();
  const todayKey = getDateKeyInVietnam(now);
  const [selectedGroup, setSelectedGroup] = React.useState('ALL');
  const [query, setQuery] = React.useState('');

  const dates = React.useMemo(
    () => [...new Set(matches.map((match) => getDateKeyInVietnam(match.kickoffAt)))],
    [matches]
  );
  const [selectedDate, setSelectedDate] = React.useState<string>('ALL');

  const filteredMatches = matches.filter((match) =>
    matchesFilter(match, { group: selectedGroup, date: selectedDate, query })
  );

  const groupedByDate = groupMatchesByDate(filteredMatches);
  const flagCodesByTeam = React.useMemo(() => {
    return new Map(
      groups.flatMap((group) => group.teams.map((team) => [team.name, team.flagEmoji] as const))
    );
  }, [groups]);

  return (
    <main className="shell">
      <header className="topbar">
        <div className="topbarMain">
          <div className="brand">
            <div className="brandMark" aria-label="World Cup trophy logo">
              <Trophy size={24} />
              <span>FIFA</span>
            </div>
            <div>
              <h1>FIFA World Cup</h1>
              <p>International</p>
            </div>
          </div>

          <label className="searchBox">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search team, city, stadium"
            />
          </label>
        </div>
      </header>

      <section className="layout">
        <aside className="sidebar">
          <div className="sectionHeader">
            <CircleDot size={16} />
            <span>Groups</span>
            {lastUpdated && (
              <small className="liveStamp">
                <Wifi size={12} />
                Live {formatTime(lastUpdated)}
              </small>
            )}
          </div>
          <div className="groupFilters">
            <button
              className={selectedGroup === 'ALL' ? 'active' : ''}
              onClick={() => setSelectedGroup('ALL')}
            >
              All
            </button>
            {groups.map((group) => (
              <button
                key={group.code}
                className={selectedGroup === group.code ? 'active' : ''}
                onClick={() => setSelectedGroup(group.code)}
              >
                {group.code}
              </button>
            ))}
          </div>

          <div className="standings">
            {groups.map((group) => (
              <article key={group.code} className="groupPanel">
                <h2>{group.name}</h2>
                <div className="standingsHeader">
                  <span />
                  <span />
                  <span>Team</span>
                  <span>P</span>
                  <span>GD</span>
                  <span>Pts</span>
                </div>
                {group.teams.map((team) => (
                  <div key={team.name} className="teamLine">
                    <span className="rank">{team.position}</span>
                    <FlagBadge code={team.flagEmoji} label={team.name} small />
                    <span>{team.name}</span>
                    <span className="stat">{team.played}</span>
                    <span className="stat">
                      {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                    </span>
                    <strong className="points">{team.points}</strong>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </aside>

        <section className="content">
          <div className="dateRail">
            <button
              className={selectedDate === 'ALL' ? 'active' : ''}
              onClick={() => setSelectedDate('ALL')}
            >
              <CalendarDays size={16} />
              All dates
            </button>
            {dates.map((date) => (
              <button
                key={date}
                className={selectedDate === date ? 'active' : ''}
                onClick={() => setSelectedDate(date)}
              >
                {formatDate(date)}
                {date === todayKey && <span className="todayPill">Today</span>}
              </button>
            ))}
          </div>

          {loading && <div className="notice">Loading schedule...</div>}
          {error && <div className="notice error">API error: {error}</div>}

          {!loading && !error && Object.keys(groupedByDate).length === 0 && (
            <div className="notice">No matches found.</div>
          )}

          <div className="matchDays">
            {Object.entries(groupedByDate).map(([date, dayMatches]) => (
              <section key={date} className="dayBlock">
                <div className="dayTitle">
                  <span>
                    {formatDate(date)}
                    {date === todayKey && <span className="dayTodayBadge">Today</span>}
                  </span>
                  <small>{dayMatches.length} matches · Vietnam time</small>
                </div>
                <div className="matchList">
                  {dayMatches.map((match) => {
                    const featured = isFeaturedMatch(match);
                    const matchDateKey = getDateKeyInVietnam(match.kickoffAt);
                    const isToday = matchDateKey === todayKey;

                    return (
                      <article
                        key={match.id}
                        className={[
                          'matchRow',
                          featured ? 'featured' : '',
                          match.status === 'finished' ? 'isFinished' : '',
                          isToday && match.status !== 'finished' ? 'isToday' : ''
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <div className="matchMeta">
                          <strong>Group {match.groupCode}</strong>
                          <span>Match {match.fifaMatchNo}</span>
                          <MatchStatusBadge match={match} isToday={isToday} />
                          {featured && <span className="featuredBadge">Featured</span>}
                        </div>
                        <div className="teams">
                          <span className="matchTeam homeTeam">
                            <span>{match.homeTeam}</span>
                            <FlagBadge
                              code={flagCodesByTeam.get(match.homeTeam)}
                              label={match.homeTeam}
                            />
                          </span>
                          <div className="score">
                            {match.status === 'finished' ? (
                              `${match.homeScore} - ${match.awayScore}`
                            ) : (
                              <>
                                <span>{formatTime(match.kickoffAt)}</span>
                                {isToday && (
                                  <CountdownBadge kickoffAt={match.kickoffAt} now={now} />
                                )}
                              </>
                            )}
                          </div>
                          <span className="matchTeam awayTeam">
                            <FlagBadge
                              code={flagCodesByTeam.get(match.awayTeam)}
                              label={match.awayTeam}
                            />
                            <span>{match.awayTeam}</span>
                          </span>
                        </div>
                        <VenueInfo venue={match.venue} city={match.city} />
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
