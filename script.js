const { useState, useEffect } = React;

function QuoteCard({ quote, author, loading, onNewQuote, onToggleLike, isLiked }) {

  let content;

  if (loading) {
    content = <div className="loading">✨ Finding inspiration...</div>;
  } else {
    let displayQuote = quote || "Click 'New Quote' to start!";
    let displayAuthor = author ? "— " + author : "";

    content = (
      <>
        <div className="quote-text">{displayQuote}</div>
        <div className="author">{displayAuthor}</div>
      </>
    );
  }

  return (
    <div className="card">
      {content}

      <div className="button-group">
        <button className="primary" onClick={onNewQuote} disabled={loading}>
          🔄 New Quote
        </button>

        <button
          className={isLiked ? "like liked" : "like"}
          onClick={onToggleLike}
          disabled={!quote || loading}
        >
          {isLiked ? "❤️ Liked" : "🤍 Like"}
        </button>
      </div>
    </div>
  );
}

function LikedQuotes({ likedQuotes, onRemove }) {

  if (likedQuotes.length === 0) {
    return <p>No liked quotes yet.</p>;
  }

  return (
    <>
      {likedQuotes.map((q, index) => (
        <div key={q.content} className="liked-item">
          <button className="remove-btn" onClick={() => onRemove(index)}>×</button>
          <p>"{q.content}"</p>
          <small>— {q.author}</small>
        </div>
      ))}
    </>
  );
}

function App() {

  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [filterAuthor, setFilterAuthor] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("likedQuotes");
    if (saved) setLikedQuotes(JSON.parse(saved));
    fetchQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  async function fetchQuote() {
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      const data = await res.json();
      setQuote(data.quote);
      setAuthor(data.author);
    } catch {
      setQuote("Believe in yourself.");
      setAuthor("Unknown");
    }
    setLoading(false);
  }

  function toggleLike() {
    const exists = likedQuotes.some(q => q.content === quote);
    if (exists) {
      setLikedQuotes(likedQuotes.filter(q => q.content !== quote));
    } else {
      setLikedQuotes([...likedQuotes, { content: quote, author }]);
    }
  }

  function removeQuote(index) {
    setLikedQuotes(likedQuotes.filter((_, i) => i !== index));
  }

  function toggleFilter() {
  if (!author) return;

  const hasQuotesFromAuthor = likedQuotes.some(
    q => q.author === author
  );

  if (!hasQuotesFromAuthor) {
    alert("No liked quotes from this author yet!");
    return;
  }

  if (filterAuthor === author) {
    setFilterAuthor(null);
  } else {
    setFilterAuthor(author);
  }
}

  const filteredQuotes = filterAuthor
    ? likedQuotes.filter(q => q.author === filterAuthor)
    : likedQuotes;

  const isLiked = likedQuotes.some(q => q.content === quote);

  return (
    <div className="container">
      <div className="header">
        <h1>InspireHub ✨</h1>
      </div>

      <div className="main">
        <div>
          <QuoteCard
            quote={quote}
            author={author}
            loading={loading}
            onNewQuote={fetchQuote}
            onToggleLike={toggleLike}
            isLiked={isLiked}
          />

          <div className="button-group" style={{marginTop:"15px"}}>
            <button className="filter-btn" onClick={toggleFilter}>
              {filterAuthor ? "Clear Filter" : "Filter By Current Author"}
            </button>
          </div>

          <div className="stats">
            <h3>Total Liked: {filteredQuotes.length}</h3>
          </div>
        </div>

        <div className="card">
          <h3>❤️ Liked Quotes</h3>
          <LikedQuotes
            likedQuotes={filteredQuotes}
            onRemove={removeQuote}
          />
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
