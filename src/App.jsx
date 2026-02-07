import React, { useState, useEffect, useRef } from 'react';
import { Camera, Users, Zap, BookOpen, Utensils, Plane, Music, Palette, Coffee, Heart, Moon, Sun, Volume2, VolumeX, Type, Contrast, Lightbulb, Info, Settings } from 'lucide-react';

// Word categories with icons and word lists
const CATEGORIES = {
  animals: {
    name: 'Animals',
    icon: '🐾',
    words: ['elephant', 'dolphin', 'penguin', 'giraffe', 'kangaroo', 'octopus', 'peacock', 'hamster', 'butterfly', 'chameleon', 'platypus', 'flamingo', 'raccoon', 'koala', 'hedgehog', 'sloth', 'axolotl', 'meerkat', 'armadillo', 'narwhal']
  },
  food: {
    name: 'Food',
    icon: '🍕',
    words: ['pizza', 'sushi', 'taco', 'burger', 'pasta', 'croissant', 'pancake', 'ramen', 'donut', 'waffle', 'curry', 'burrito', 'sandwich', 'salad', 'cheesecake', 'dumplings', 'macaron', 'pho', 'nachos', 'brownies']
  },
  pop_culture: {
    name: 'Pop Culture',
    icon: '🌟',
    words: ['Taylor Swift', 'Beyoncé', 'Harry Potter', 'Star Wars', 'TikTok', 'Marvel', 'Disney', 'Netflix', 'Grammys', 'Coachella', 'K-pop', 'Barbie', 'Spider-Man', 'Pokémon', 'Minecraft', 'Fortnite', 'Instagram', 'Super Mario', 'Elon Musk', 'Beyonce']
  },
  actors: {
    name: 'Actors',
    icon: '🎭',
    words: ['Tom Cruise', 'Brad Pitt', 'Zendaya', 'Tom Holland', 'Will Smith', 'Margot Robbie', 'Dwayne Johnson', 'Johnny Depp', 'Robert Downey Jr', 'Scarlett Johansson', 'Leonardo DiCaprio', 'Emma Watson', 'Jennifer Lawrence', 'Ryan Reynolds', 'Meryl Streep']
  },
  movies: {
    name: 'Movies',
    icon: '🎬',
    words: ['Titanic', 'Inception', 'Jaws', 'Avatar', 'Frozen', 'Shrek', 'Madagascar', 'Up', 'Rocky', 'Gladiator', 'Aladdin', 'Coco', 'Ratatouille', 'Matrix', 'Interstellar', 'Barbie', 'Oppenheimer', 'Jurassic Park', 'Toy Story', 'The Lion King']
  },
  places: {
    name: 'Places',
    icon: '🗺️',
    words: ['beach', 'museum', 'library', 'hospital', 'stadium', 'airport', 'restaurant', 'cinema', 'park', 'subway', 'casino', 'zoo', 'aquarium', 'mall', 'theater', 'pyramids', 'Eiffel Tower', 'Disneyland', 'Grand Canyon', 'Hollywood']
  },
  professions: {
    name: 'Professions',
    icon: '💼',
    words: ['teacher', 'doctor', 'chef', 'pilot', 'artist', 'musician', 'engineer', 'firefighter', 'detective', 'astronaut', 'photographer', 'architect', 'veterinarian', 'barista', 'florist', 'lawyer', 'dentist', 'scientist', 'farmer', 'librarian']
  },
  sports: {
    name: 'Sports',
    icon: '⚽',
    words: ['soccer', 'basketball', 'tennis', 'swimming', 'boxing', 'golf', 'volleyball', 'skiing', 'surfing', 'archery', 'fencing', 'bowling', 'hockey', 'baseball', 'badminton', 'karate', 'cycling', 'skating', 'yoga', 'wrestling']
  },
  objects: {
    name: 'Objects',
    icon: '📦',
    words: ['umbrella', 'backpack', 'hammer', 'telescope', 'compass', 'guitar', 'camera', 'pillow', 'bicycle', 'laptop', 'toaster', 'headphones', 'skateboard', 'microphone', 'calculator', 'keychain', 'flashlight', 'sunglasses', 'watch', 'matches']
  },
  nature: {
    name: 'Nature',
    icon: '🌳',
    words: ['waterfall', 'rainbow', 'volcano', 'desert', 'forest', 'ocean', 'mountain', 'lake', 'river', 'canyon', 'glacier', 'cave', 'island', 'meadow', 'valley', 'coral reef', 'northern lights', 'oasis', 'quicksand', 'thunderstorm']
  },
  random_shits: {
    name: 'Random Shits',
    icon: '🤪',
    words: ['Fidget spinner', 'Duct tape', 'Pet rock', 'Lava lamp', 'Traffic cone', 'Rubber duck', 'Bubble wrap', 'Shopping cart', 'Toaster oven', 'Garden gnome', 'Slinky', 'Paperclip', 'Umbrella hat', 'Snuggie', 'Chia pet', 'Disco ball', 'Feather duster', 'Fly swatter', 'Glow stick', 'Toothpick']
  }
};

export default function ImpostorGame() {
  // Game state
  const [page, setPage] = useState('home');
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [customWords, setCustomWords] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [impostor, setImpostor] = useState(null);
  const [revealIndex, setRevealIndex] = useState(0);
  const [showRole, setShowRole] = useState(false);
  const [currentClueGiver, setCurrentClueGiver] = useState(0);
  const [clueTimer, setClueTimer] = useState(30);
  const [discussionTimer, setDiscussionTimer] = useState(120);
  const [votes, setVotes] = useState({});
  const [gameResult, setGameResult] = useState(null);
  const [usedWords, setUsedWords] = useState([]);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [impostorHint, setImpostorHint] = useState(true);

  // Animation states
  const [cardFlipped, setCardFlipped] = useState(false);
  const [revealAnimation, setRevealAnimation] = useState(false);

  // Timer refs
  const clueTimerRef = useRef(null);
  const discussionTimerRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Load settings and custom words from localStorage
  useEffect(() => {
    const savedWords = localStorage.getItem('customWords');
    if (savedWords) setCustomWords(savedWords);

    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    const savedHint = localStorage.getItem('impostorHint') !== 'false';
    setImpostorHint(savedHint);

    return () => {
      if (clueTimerRef.current) clearInterval(clueTimerRef.current);
      if (discussionTimerRef.current) clearInterval(discussionTimerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Save custom words
  useEffect(() => {
    if (customWords) localStorage.setItem('customWords', customWords);
  }, [customWords]);

  // Save dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Save hint setting
  useEffect(() => {
    localStorage.setItem('impostorHint', impostorHint);
  }, [impostorHint]);

  // Reset timers when page changes
  useEffect(() => {
    if (page !== 'clue') {
      if (clueTimerRef.current) clearInterval(clueTimerRef.current);
    }
    if (page !== 'discussion') {
      if (discussionTimerRef.current) clearInterval(discussionTimerRef.current);
    }
  }, [page]);

  // Sound effect helper
  const playSound = (type) => {
    if (!soundEnabled) return;
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'click') {
      osc.frequency.value = 800; gain.gain.value = 0.1;
      osc.start(); osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'reveal') {
      osc.frequency.value = 600; gain.gain.value = 0.15;
      osc.start(); osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'win') {
      osc.frequency.value = 1000; gain.gain.value = 0.2;
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    }
  };

  const addPlayer = () => {
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      playSound('click');
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (index) => {
    playSound('click');
    setPlayers(players.filter((_, i) => i !== index));
  };

  const startGame = () => {
    playSound('click');
    setPage('setup');
  };

  const selectCategory = (category) => {
    playSound('click');
    setSelectedCategory(category);
    startRound(category);
  };

  const startRound = (cat) => {
    let wordList;
    if (cat === 'random') {
      wordList = Object.values(CATEGORIES).flatMap(c => c.words);
    } else if (cat === 'custom') {
      wordList = customWords.split('\n').map(w => w.trim()).filter(w => w);
    } else {
      wordList = CATEGORIES[cat].words;
    }

    let availableWords = wordList.filter(w => !usedWords.includes(w));
    if (availableWords.length === 0) {
      availableWords = wordList;
      setUsedWords([]);
    }

    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    const impostorIndex = Math.floor(Math.random() * players.length);

    setCurrentWord(word);
    setImpostor(impostorIndex);
    setUsedWords([...usedWords, word]);
    setRevealIndex(0);
    setShowRole(false);
    setCardFlipped(false);
    setPage('reveal');
  };

  const showNextRole = () => {
    if (!showRole) {
      playSound('reveal');
      setCardFlipped(true);
      setTimeout(() => setShowRole(true), 300);
    } else {
      playSound('click');
      setShowRole(false);
      setCardFlipped(false);
      setTimeout(() => {
        if (revealIndex < players.length - 1) {
          setRevealIndex(revealIndex + 1);
        } else {
          setCurrentClueGiver(0);
          setClueTimer(30);
          setPage('clue');
          startClueTimer();
        }
      }, 300);
    }
  };

  const startClueTimer = () => {
    if (clueTimerRef.current) clearInterval(clueTimerRef.current);
    clueTimerRef.current = setInterval(() => {
      setClueTimer(prev => {
        if (prev <= 1) {
          clearInterval(clueTimerRef.current);
          nextClueGiver();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextClueGiver = () => {
    playSound('click');
    if (currentClueGiver < players.length - 1) {
      setCurrentClueGiver(currentClueGiver + 1);
      setClueTimer(30);
      startClueTimer();
    } else {
      clearInterval(clueTimerRef.current);
      setDiscussionTimer(120);
      setPage('discussion');
      startDiscussionTimer();
    }
  };

  const skipClue = () => {
    clearInterval(clueTimerRef.current);
    nextClueGiver();
  };

  const startDiscussionTimer = () => {
    if (discussionTimerRef.current) clearInterval(discussionTimerRef.current);
    discussionTimerRef.current = setInterval(() => {
      setDiscussionTimer(prev => {
        if (prev <= 1) {
          clearInterval(discussionTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endDiscussion = () => {
    playSound('click');
    clearInterval(discussionTimerRef.current);
    setVotes({});
    setPage('voting');
  };

  const castVote = (voterIndex, votedForIndex) => {
    playSound('click');
    setVotes({ ...votes, [voterIndex]: votedForIndex });
  };

  const submitVotes = () => {
    playSound('click');
    const voteCounts = {};
    Object.values(votes).forEach(votedFor => {
      voteCounts[votedFor] = (voteCounts[votedFor] || 0) + 1;
    });

    let maxVotes = 0;
    let suspected = null;
    Object.entries(voteCounts).forEach(([player, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        suspected = parseInt(player);
      }
    });

    const innocentsWin = suspected === impostor;
    setGameResult({ suspected, impostor, innocentsWin, voteCounts });
    setRevealAnimation(true);
    setTimeout(() => {
      playSound('win');
      setPage('result');
    }, 500);
  };

  const playAgain = () => {
    playSound('click');
    setRevealAnimation(false);
    setGameResult(null);
    setPage('category');
  };

  const newGame = () => {
    playSound('click');
    setRevealAnimation(false);
    setGameResult(null);
    setUsedWords([]);
    setPage('home');
  };

  // Styles
  const baseClasses = `min-h-screen transition-colors duration-300 ${darkMode
    ? highContrast ? 'bg-black text-white' : 'bg-gray-900 text-gray-100'
    : highContrast ? 'bg-white text-black' : 'bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100'
    } ${largeText ? 'text-xl' : 'text-base'} overflow-x-hidden select-none`;

  const cardClasses = `rounded-3xl p-6 shadow-xl transition-all duration-300 ${darkMode
    ? highContrast ? 'bg-gray-900 border-4 border-white' : 'bg-gray-800 border-2 border-gray-700'
    : highContrast ? 'bg-gray-100 border-4 border-black' : 'bg-white'
    }`;

  const buttonClasses = `px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 ${darkMode
    ? highContrast ? 'bg-white text-black border-4 border-white' : 'bg-purple-600 text-white hover:bg-purple-700'
    : highContrast ? 'bg-black text-white border-4 border-black' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
    }`;

  // Home Page
  if (page === 'home') {
    return (
      <div className={baseClasses}>
        <div className="container mx-auto px-4 py-6 max-w-4xl min-h-screen flex flex-col">
          <div className="flex justify-end gap-2 mb-4 shrink-0">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-3 rounded-full ${cardClasses}`}>
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-full ${cardClasses}`}>
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button onClick={() => setLargeText(!largeText)} className={`p-3 rounded-full ${cardClasses}`}>
              <Type size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
            <div className={`${cardClasses} w-full max-w-lg mb-4 animate-bounce-slow py-10`}>
              <h1 className={`font-black tracking-tighter ${largeText ? 'text-7xl' : 'text-6xl'} mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
                IMPOSTOR
              </h1>
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400">Find the traitor among you!</p>
            </div>

            <button onClick={startGame} className={`${buttonClasses} text-3xl px-16 py-8 shadow-2xl`}>
              🎮 Start Game
            </button>
          </div>

          <div className={`${cardClasses} mt-8 shrink-0`}>
            <h2 className={`font-bold ${largeText ? 'text-3xl' : 'text-2xl'} mb-4 text-purple-600 dark:text-purple-400 flex items-center gap-2`}>
              <BookOpen size={24} /> How to Play
            </h2>
            <ul className="space-y-3 text-lg font-medium text-gray-700 dark:text-gray-300">
              {[
                "3+ players, one is secretly the Impostor.",
                "Innocents see a word, Impostor sees nothing.",
                "Give one-word clues to prove you know the word.",
                "Discuss and vote to kick the suspicious ones!",
                "Innocents win if Impostor is voted out."
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-purple-500 font-black">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Player Setup Page
  if (page === 'setup') {
    return (
      <div className={baseClasses}>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className={cardClasses}>
            <h2 className="text-4xl font-black mb-8 text-center tracking-tight">👥 Setup Players</h2>

            <div className="flex gap-3 mb-8">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                placeholder="Player name..."
                className={`flex-1 px-6 py-4 rounded-2xl border-2 text-xl ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-purple-200'
                  } focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all`}
              />
              <button onClick={addPlayer} className={buttonClasses}>Add</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin">
              {players.map((player, index) => (
                <div key={index} className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} p-4 rounded-2xl flex justify-between items-center animate-scale-in border-2 border-transparent hover:border-purple-400 transition-all`}>
                  <span className="font-bold text-xl">{player}</span>
                  <button onClick={() => removePlayer(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">✕</button>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t-2 border-gray-100 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="text-yellow-500" />
                  <span className="font-bold text-lg">Impostor Clue</span>
                </div>
                <button
                  onClick={() => setImpostorHint(!impostorHint)}
                  className={`w-14 h-8 rounded-full transition-colors relative ${impostorHint ? 'bg-green-500' : 'bg-gray-400'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${impostorHint ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">When enabled, the impostor sees the category during reveal.</p>

              <button
                onClick={() => { playSound('click'); setPage('category'); }}
                disabled={players.length < 3}
                className={`w-full ${buttonClasses} py-5 text-2xl ${players.length < 3 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              >
                {players.length < 3 ? `Add ${3 - players.length} more...` : 'Next: Choose Category 🎯'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Category Selection
  if (page === 'category') {
    return (
      <div className={baseClasses}>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col gap-6">
            <div className="text-center space-y-2">
              <h2 className="text-5xl font-black tracking-tight">🎯 Choose Category</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">What will the word be about?</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <button onClick={() => selectCategory('random')} className={`${cardClasses} p-8 hover:scale-105 transition-transform flex flex-col items-center gap-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20`}>
                <div className="text-6xl drop-shadow-lg">🎲</div>
                <div className="text-xl font-black">All Random</div>
              </button>
              {Object.entries(CATEGORIES).map(([key, cat]) => (
                <button key={key} onClick={() => selectCategory(key)} className={`${cardClasses} p-8 hover:scale-105 transition-transform flex flex-col items-center gap-4`}>
                  <div className="text-6xl drop-shadow-md">{cat.icon}</div>
                  <div className="text-xl font-black">{cat.name}</div>
                </button>
              ))}
              <button onClick={() => { playSound('click'); setPage('custom'); }} className={`${cardClasses} p-8 hover:scale-105 border-dashed border-2 flex flex-col items-center gap-4`}>
                <div className="text-6xl drop-shadow-md">🖊️</div>
                <div className="text-xl font-black">Custom</div>
              </button>
            </div>

            <button onClick={() => { playSound('click'); setPage('setup'); }} className="mx-auto text-lg font-bold text-purple-600 dark:text-purple-400 hover:underline">← Back to Players</button>
          </div>
        </div>
      </div>
    );
  }

  // Role Reveal Page
  if (page === 'reveal') {
    const currentPlayer = players[revealIndex];
    const isImpostor = revealIndex === impostor;
    const currentCategoryData = CATEGORIES[selectedCategory] || { name: 'Random' };

    return (
      <div className={baseClasses}>
        <div className="container mx-auto px-4 py-8 max-w-lg min-h-screen flex flex-col items-center justify-center gap-12">
          <div className="text-center space-y-4 w-full">
            <div className="flex items-center justify-center gap-3">
              <Users className="text-purple-500" />
              <span className="text-2xl font-black uppercase tracking-widest text-gray-500">Player {revealIndex + 1}/{players.length}</span>
            </div>
            <h2 className="text-4xl font-black">Pass the device to:</h2>
            <div className={`${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'} px-8 py-6 rounded-3xl inline-block shadow-lg border-4 border-purple-500 animate-pulse`}>
              <h3 className="text-5xl font-black text-purple-600 dark:text-purple-400 tracking-tight">{currentPlayer}</h3>
            </div>
          </div>

          <div className="perspective w-full h-[500px] cursor-pointer" onClick={showNextRole}>
            <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${cardFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className={`absolute w-full h-full backface-hidden ${cardClasses} flex flex-col items-center justify-center gap-8 border-4 border-transparent hover:border-purple-400`}>
                <div className="text-9xl animate-bounce">🎭</div>
                <div className="text-center space-y-2">
                  <p className="text-3xl font-black">Tap to Reveal</p>
                  <p className="text-gray-500 dark:text-gray-400 font-bold">Don't let others see!</p>
                </div>
              </div>
              {/* Back */}
              <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${cardClasses} flex flex-col items-center justify-center gap-8 overflow-hidden`}>
                {showRole && (
                  <div className="w-full text-center space-y-8 animate-scale-in">
                    {isImpostor ? (
                      <>
                        <div className="text-9xl">😈</div>
                        <h3 className="text-4xl font-black text-red-600 dark:text-red-400 uppercase tracking-tighter">YOU ARE THE IMPOSTOR</h3>
                        {impostorHint && (
                          <div className="p-6 rounded-2xl bg-red-100 dark:bg-red-900/30 border-2 border-red-500">
                            <p className="text-red-800 dark:text-red-200 font-bold text-lg mb-2 flex items-center justify-center gap-2"><Info size={20} /> CATEGORY HINT</p>
                            <p className="text-4xl font-black uppercase">{currentCategoryData.name}</p>
                          </div>
                        )}
                        <p className="text-xl font-medium text-gray-500 dark:text-gray-400">Blend in and lie about your clue!</p>
                      </>
                    ) : (
                      <>
                        <div className="text-9xl">😇</div>
                        <h3 className="text-4xl font-black text-green-600 dark:text-green-400 uppercase tracking-tighter tracking-tighter">YOU ARE INNOCENT</h3>
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-20"><Zap size={100} /></div>
                          <p className="text-purple-100 font-bold uppercase tracking-widest mb-2">Secret Word</p>
                          <p className="text-5xl font-black tracking-tighter break-words">{currentWord.toUpperCase()}</p>
                        </div>
                        <p className="text-xl font-medium text-gray-500 dark:text-gray-400">Describe it without saying it!</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button onClick={showNextRole} className={`${buttonClasses} w-full py-6 text-2xl shadow-xl flex items-center justify-center gap-3`}>
            {!showRole ? <><Lightbulb size={28} /> Show My Role</> : (revealIndex < players.length - 1 ? '➡️ Next Player' : '🔥 Start Game!')}
          </button>
        </div>
      </div>
    );
  }

  // Clue Giving Page
  if (page === 'clue') {
    const isLastPlayer = currentClueGiver === players.length - 1;
    return (
      <div className={baseClasses}>
        <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen flex flex-col gap-8">
          <div className="text-center space-y-2 shrink-0">
            <h2 className="text-5xl font-black tracking-tighter">🗣️ CLUE TIME</h2>
            <p className="text-xl font-medium text-gray-500 dark:text-gray-400">Give a one-word hint!</p>
          </div>

          <div className={`${cardClasses} flex-1 flex flex-col items-center justify-center gap-8 relative overflow-hidden`}>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />

            <div className="text-center space-y-4 relative z-10 w-full">
              <p className="text-2xl font-bold uppercase tracking-widest text-purple-500">Current Speaker</p>
              <h3 className="text-6xl font-black tracking-tight underline decoration-purple-500">{players[currentClueGiver]}</h3>
            </div>

            <div className="relative shrink-0">
              <div className={`w-48 h-48 rounded-full border-[12px] flex flex-col items-center justify-center transition-colors shadow-2xl ${clueTimer <= 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-purple-500 text-purple-500'}`}>
                <span className="text-7xl font-black">{clueTimer}</span>
                <span className="text-lg font-bold uppercase tracking-widest">SEC</span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-center px-4">
              {players.map((p, i) => (
                <div key={i} className={`px-4 py-2 rounded-xl text-lg font-black transition-all ${i === currentClueGiver ? 'bg-purple-500 text-white scale-110 shadow-lg' : i < currentClueGiver ? 'bg-green-500/20 text-green-600 dark:text-green-400 opacity-50' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                  {p}
                </div>
              ))}
            </div>
          </div>

          <button onClick={skipClue} className={`${buttonClasses} w-full py-6 text-2xl flex items-center justify-center gap-3 shrink-0`}>
            {isLastPlayer ? '💬 End Clues & Discuss' : '➡️ Next Clue Player'}
          </button>
        </div>
      </div>
    );
  }

  // Discussion Page
  if (page === 'discussion') {
    const min = Math.floor(discussionTimer / 60);
    const sec = discussionTimer % 60;
    return (
      <div className={baseClasses}>
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col gap-6">
          <div className="text-center space-y-2 shrink-0">
            <h2 className="text-5xl font-black tracking-tighter">💬 DISCUSS!</h2>
            <p className="text-xl font-medium text-gray-500">Who is lying? Who gave a bad clue?</p>
          </div>

          <div className="flex-1 flex flex-col gap-6 overflow-hidden">
            <div className={`${cardClasses} shrink-0 py-8 flex flex-col items-center justify-center bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b-8 border-purple-500`}>
              <p className="text-xl font-black uppercase tracking-widest text-gray-400 mb-2">Discussion Ends In</p>
              <p className={`text-8xl font-black tracking-tighter ${discussionTimer <= 30 ? 'text-red-500 animate-pulse' : 'text-purple-600 dark:text-purple-400'}`}>
                {min}:{sec.toString().padStart(2, '0')}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto pr-2 scrollbar-thin">
              {players.map((p, i) => (
                <div key={i} className={`${cardClasses} flex flex-col items-center gap-3 font-black text-xl bg-opacity-50 border-4 border-transparent hover:border-purple-400 cursor-default`}>
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-3xl">👤</div>
                  {p}
                </div>
              ))}
            </div>
          </div>

          <button onClick={endDiscussion} className={`${buttonClasses} w-full py-6 text-2xl flex items-center justify-center gap-3 shrink-0`}>
            🗳️ Start Voting Now
          </button>
        </div>
      </div>
    );
  }

  // Voting Page
  if (page === 'voting') {
    const allVoted = Object.keys(votes).length === players.length;
    return (
      <div className={baseClasses}>
        <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen flex flex-col gap-8">
          <div className="text-center space-y-4 shrink-0">
            <h2 className="text-5xl font-black tracking-tight">🗳️ VOTE THE SUS</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-full max-w-md h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${(Object.keys(votes).length / players.length) * 100}%` }} />
              </div>
              <span className="text-2xl font-black">{Object.keys(votes).length}/{players.length}</span>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-thin">
            {players.map((voter, vIdx) => (
              <div key={vIdx} className={cardClasses}>
                <div className="flex items-center gap-3 mb-6 border-b-2 border-gray-100 dark:border-gray-700 pb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white"><Users size={24} /></div>
                  <h3 className="text-2xl font-black">{voter}'s Search Result:</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {players.map((cand, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => castVote(vIdx, cIdx)}
                      disabled={vIdx === cIdx}
                      className={`p-5 rounded-2xl flex flex-col items-center gap-2 font-black transition-all border-4 ${vIdx === cIdx ? 'opacity-30' : votes[vIdx] === cIdx ? 'bg-purple-600 text-white border-purple-300 scale-105 shadow-xl rotate-1' : 'bg-gray-100 dark:bg-gray-700/50 border-transparent hover:border-purple-400'}`}
                    >
                      <div className="text-3xl">👤</div>
                      <span className="text-lg line-clamp-1">{cand}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={submitVotes}
            disabled={!allVoted}
            className={`${buttonClasses} w-full py-6 text-3xl shadow-2xl ${!allVoted ? 'grayscale opacity-50' : 'bg-green-600 shadow-green-500/20'}`}
          >
            {allVoted ? '🕵️ Reveal Identity' : 'Waiting for everyone...'}
          </button>
        </div>
      </div>
    );
  }

  // Result Page
  if (page === 'result' && gameResult) {
    const win = gameResult.innocentsWin;
    return (
      <div className={baseClasses}>
        <div className="container mx-auto px-4 py-8 max-w-3xl min-h-screen flex flex-col gap-6">
          <div className={`${cardClasses} py-12 flex flex-col items-center justify-center text-center gap-6 border-t-[16px] overflow-hidden relative ${win ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-red-500 bg-red-50/50 dark:bg-red-900/10'}`}>
            {win && <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-20" />}
            <div className="text-9xl mb-4 drop-shadow-2xl">{win ? '🎊' : '💀'}</div>
            <h2 className={`text-6xl font-black tracking-tighter ${win ? 'text-green-600' : 'text-red-600'}`}>
              {win ? 'VICTORY!' : 'DEFEAT!'}
            </h2>
            <p className="text-2xl font-bold opacity-75">{win ? 'The traitos was caught red-handed!' : 'The Impostor fooled everyone!'}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`${cardClasses} p-8 flex flex-col items-center gap-4 bg-red-500 text-white`}>
              <p className="font-black uppercase tracking-widest opacity-80">THE IMPOSTOR</p>
              <p className="text-5xl font-black underline underline-offset-8">{players[gameResult.impostor]}</p>
            </div>
            <div className={`${cardClasses} p-8 flex flex-col items-center gap-4 bg-purple-600 text-white`}>
              <p className="font-black uppercase tracking-widest opacity-80">SECRET WORD</p>
              <p className="text-5xl font-black underline underline-offset-8 uppercase">{currentWord}</p>
            </div>
          </div>

          <div className={cardClasses}>
            <h3 className="text-3xl font-black mb-8 flex items-center gap-3"><Contrast size={32} /> Final Verdict</h3>
            <div className="space-y-4">
              {players.map((p, i) => {
                const count = gameResult.voteCounts[i] || 0;
                const isTarget = i === gameResult.suspected;
                return (
                  <div key={i} className={`p-6 rounded-2xl flex items-center justify-between transition-all ${isTarget ? 'bg-purple-100 dark:bg-purple-900/40 border-l-8 border-purple-500' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-black">{p}</span>
                      {i === gameResult.impostor && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-black">IMPOSTOR</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {Array.from({ length: count }).map((_, j) => (
                          <div key={j} className="text-2xl drop-shadow-sm">🗳️</div>
                        ))}
                      </div>
                      <span className="text-3xl font-black ml-4">{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <button onClick={playAgain} className={`flex-1 ${buttonClasses} py-6 text-2xl flex items-center justify-center gap-3`}>🔄 Play Again</button>
            <button onClick={newGame} className={`flex-1 ${buttonClasses} py-6 text-2xl bg-gray-500 hover:bg-gray-600 flex items-center justify-center gap-3`}>🏠 Main Menu</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
