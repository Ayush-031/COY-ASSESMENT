import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, Sparkles, MessageCircle, Compass, House, RotateCw, MapPin, SlidersHorizontal } from "lucide-react";
import { getFeed, getMatches, sendSwipe } from "./api";

function ProfileCard({ profile, onSwipe, disabled }) {
  const [dragX, setDragX] = useState(0);
  const [busy, setBusy] = useState(false);

  const finishSwipe = async (action) => {
    if (busy || disabled) return;
    setBusy(true);
    await onSwipe(action);
    setBusy(false);
  };

  return (
    <motion.div
      className="profile-card"
      drag={!disabled && !busy ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.82}
      onDrag={(_, info) => setDragX(info.offset.x)}
      onDragEnd={(_, info) => {
        setDragX(0);
        if (info.offset.x > 110 || info.velocity.x > 650) finishSwipe("like");
        else if (info.offset.x < -110 || info.velocity.x < -650) finishSwipe("pass");
      }}
      animate={{ rotate: dragX / 22 }}
      whileTap={{ scale: 1.015 }}
      exit={{ x: dragX >= 0 ? 650 : -650, opacity: 0, rotate: dragX >= 0 ? 22 : -22, transition: { duration: 0.28 } }}
    >
      <img className="profile-photo" src={profile.photo} alt={profile.name} draggable="false" />
      <div className={`swipe-stamp ${dragX > 35 ? "like-stamp" : dragX < -35 ? "pass-stamp" : ""}`}>
        {dragX > 35 ? "LIKE" : dragX < -35 ? "PASS" : ""}
      </div>
      <div className="photo-shade" />
      <div className="profile-info">
        <div className="profile-heading">
          <div><h2>{profile.name}, {profile.age}</h2><p><MapPin size={15} />{profile.location}</p></div>
          <span className="verified">✓</span>
        </div>
        <p className="bio">{profile.bio}</p>
        <div className="interest-list">{profile.interests.map(tag => <span key={tag}>{tag}</span>)}</div>
      </div>
      <div className="drag-hint">DRAG TO DISCOVER</div>
    </motion.div>
  );
}

function MatchCelebration({ match, onContinue }) {
  return (
    <motion.div className="match-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="match-modal" initial={{ y: 30, scale: .9 }} animate={{ y: 0, scale: 1 }}>
        <div className="sparkle"><Sparkles size={30} /></div>
        <p className="eyebrow">THE FEELING IS MUTUAL</p>
        <h2>It’s a match!</h2>
        <p>You and {match.name} liked each other.</p>
        <img src={match.photo} alt={match.name} className="match-photo" />
        <button className="primary-button" onClick={onContinue}>Keep discovering</button>
      </motion.div>
    </motion.div>
  );
}

function MatchesView({ matches, loading }) {
  if (loading) return <div className="empty-state"><div className="loader" /><p>Loading your matches…</p></div>;
  if (!matches.length) return <div className="empty-state"><div className="empty-icon"><Heart size={30}/></div><h2>Your story starts here</h2><p>When you and someone like each other, your mutual matches will appear here.</p></div>;
  return <div className="matches-grid">{matches.map(person => (
    <article className="match-card" key={person.id}>
      <img src={person.photo} alt={person.name} />
      <div><h3>{person.name}, {person.age}</h3><p><MapPin size={13}/>{person.location}</p><span>It's mutual ♥</span></div>
    </article>
  ))}</div>;
}

export default function App() {
  const [tab, setTab] = useState("discover");
  const [feed, setFeed] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [celebration, setCelebration] = useState(null);
  const [swiping, setSwiping] = useState(false);

  const refreshFeed = useCallback(async () => {
    try { setFeed(await getFeed()); setError(""); }
    catch { setError("Couldn't connect to the server. Make sure the backend and MongoDB are running."); }
    finally { setLoading(false); }
  }, []);

  const refreshMatches = useCallback(async () => {
    try { setMatches(await getMatches()); }
    catch { setError("Couldn't load matches. Check the backend connection."); }
  }, []);

  useEffect(() => { refreshFeed(); refreshMatches(); }, [refreshFeed, refreshMatches]);

  const handleSwipe = async (action) => {
    if (!feed[0] || swiping) return;
    setSwiping(true);
    const current = feed[0];
    // Optimistically remove from this session; API persists the swipe.
    try {
      const result = await sendSwipe(current._id, action);
      setFeed(prev => prev.filter(person => person._id !== current._id));
      if (result.isMatch) {
        await refreshMatches();
        setCelebration(result.match);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Swipe could not be saved. Please try again.");
    } finally { setSwiping(false); }
  };

  const activeProfile = feed[0];

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={e => e.preventDefault()}><span className="brand-mark">c</span> coy<span className="brand-dot">.</span></a>
        <div className="topbar-right"><span className="online-dot"/> Your space, your pace <button className="avatar">A</button></div>
      </header>

      <main className="main-content">
        <nav className="tabs">
          <button className={`tab ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}><House size={17}/>Home</button>
          <button className={`tab ${tab === "discover" ? "active" : ""}`} onClick={() => setTab("discover")}><Compass size={17}/>Discover</button>
          <button className={`tab ${tab === "matches" ? "active" : ""}`} onClick={async () => { setTab("matches"); await refreshMatches(); }}><Heart size={17}/>Matches <span className="match-count">{matches.length}</span></button>
        </nav>

        {tab === "home" && <section className="home-placeholder" aria-label="Home placeholder" />}
        {tab === "discover" && <>
          <section className="section-intro">
            <div><p className="eyebrow">A LITTLE CLOSER TO SOMETHING GOOD</p><h1>Discover <span>your people.</span></h1><p className="intro-copy">No pressure. Just people you might click with.</p></div>
            <button className="filter-button" title="Filters coming soon"><SlidersHorizontal size={18}/></button>
          </section>
          {error && <div className="error-banner">{error}<button onClick={() => { refreshFeed(); refreshMatches(); }}>Retry</button></div>}
          {loading ? <div className="empty-state"><div className="loader"/><p>Finding your people…</p></div> :
            activeProfile ? <section className="discovery-stage">
              <div className="card-stack"><div className="back-card back-two"/><div className="back-card back-one"/>
                <AnimatePresence mode="sync"><ProfileCard key={activeProfile._id} profile={activeProfile} onSwipe={handleSwipe} disabled={swiping}/></AnimatePresence>
              </div>
              <div className="action-row">
                <button className="action-button pass-button" onClick={() => handleSwipe("pass")} disabled={swiping} aria-label="Pass"><X size={28}/></button>
                <div className="action-caption">NOT YOUR VIBE? <span>THAT'S OKAY.</span></div>
                <button className="action-button like-button" onClick={() => handleSwipe("like")} disabled={swiping} aria-label="Like"><Heart size={26} fill="currentColor"/></button>
              </div>
              <p className="swipe-helper">← Pass <span>Drag the card or use the buttons</span> Like →</p>
            </section> : <div className="empty-state"><div className="empty-icon"><Sparkles size={30}/></div><h2>You've seen everyone for now</h2><p>That's everyone in your discovery queue. Check back later for new faces.</p><button className="secondary-button" onClick={refreshFeed}><RotateCw size={16}/> Refresh feed</button></div>
          }
        </>}
        {tab === "matches" && <section className="matches-section"><p className="eyebrow">GOOD THINGS ARE MUTUAL</p><h1>Your matches<span>.</span></h1><p className="intro-copy">A little spark, from both sides.</p><MatchesView matches={matches} loading={false}/></section>}
      </main>

      <footer className="footer">Made for meaningful connections <span>♥</span></footer>
      {celebration && <MatchCelebration match={celebration} onContinue={() => setCelebration(null)}/>}
    </div>
  );
}
