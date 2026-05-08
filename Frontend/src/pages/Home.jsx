import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import useTheme from "../components/usetheme";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
    <path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z" />
    <path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z" />
  </svg>
);
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
  </svg>
);
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const TrendingUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const trendingSearches = [
  "Machine Learning",
  "Climate Change",
  "Quantum Computing",
  "Artificial Intelligence",
  "Renewable Energy",
  "Space Exploration",
];

const searchSuggestions = [
  "What is quantum computing?",
  "Best practices for AI development",
  "Climate change solutions 2026",
  "Latest breakthroughs in medicine",
];

function Home() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { theme, mode } = useTheme();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <button
          onClick={mode}
          className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-200"
        >
          {theme === "dark" ? (
            <span className="text-yellow-400">
              <SunIcon />
            </span>
          ) : (
            <span className="text-gray-600">
              <MoonIcon />
            </span>
          )}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-blue-600 dark:text-blue-400">
            <SparklesIcon />
          </span>
          <h1 className="text-4xl sm:text-7xl font-bold">
            <span className="text-blue-600 dark:text-blue-400">Search</span>
            <span className="text-green-600 dark:text-green-400">Engine</span>
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          Smart Search with Boolean Retrieval, BM25, and Query Expansion
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onSubmit={handleSearch}
        className="w-full max-w-3xl relative"
      >
        <div className="relative">
          <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-full shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4">
              <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">
                <SearchIcon />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for anything..."
                className="flex-1 min-w-0 bg-transparent outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm sm:text-base"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-4 py-1.5 sm:px-8 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white text-sm sm:text-base rounded-full hover:shadow-lg transition-shadow duration-200 whitespace-nowrap flex-shrink-0"
              >
                Search
              </motion.button>
            </div>
          </div>

          {showSuggestions && query.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden z-10"
            >
              {searchSuggestions
                .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 4)
                .map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-6 py-3 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors duration-150 flex items-center gap-3"
                  >
                    <span className="text-gray-400">
                      <SearchIcon />
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {suggestion}
                    </span>
                  </button>
                ))}
            </motion.div>
          )}
        </div>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
          <TrendingUpIcon />
          <span>Trending Searches</span>
        </div>
        <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
          {trendingSearches.map((trend, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              onClick={() => {
                setQuery(trend);
                navigate(`/search?q=${encodeURIComponent(trend)}`);
              }}
              className="px-5 py-2.5 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60 rounded-full border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:shadow-lg transition-all duration-200"
            >
              {trend}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;
