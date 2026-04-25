import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, RefreshCw, Compass, Zap, Skull, Swords, Shield, BookOpen, Users, ArrowRight, Tv2 } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentFact, setCurrentFact] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Redirect to feed page
  useEffect(() => {
    navigate('/feed');
  }, [navigate]);

  // Comprehensive Anime Fun Facts Database
  const animeFunFacts = [
    {
      category: "Naruto",
      fact: "Naruto's name comes from a Japanese word for 'ramen topping' - a type of fish cake that can be found swirling in ramen bowls.",
      icon: "🍜",
      color: "#FF6B35"
    },
    {
      category: "One Piece",
      fact: "Eiichiro Oda has been drawing One Piece since 1997 and has never taken a break longer than one week, even for his honeymoon!",
      icon: "⚓",
      color: "#FF0000"
    },
    {
      category: "Attack on Titan",
      fact: "The titans in Attack on Titan were inspired by a drunk friend of the creator who was trying to touch people at a bar.",
      icon: "👹",
      color: "#00CED1"
    },
    {
      category: "Dragon Ball",
      fact: "Goku's original design was inspired by Sun Wukong, the Monkey King from the 16th-century Chinese novel 'Journey to the West'.",
      icon: "🐒",
      color: "#FFA500"
    },
    {
      category: "Death Note",
      fact: "The creator of Death Note, Tsugumi Ohba, is a pseudonym - the real identity remains unknown to this day.",
      icon: "📓",
      color: "#000000"
    },
    {
      category: "My Hero Academia",
      fact: "All Might's design was inspired by American superheroes, particularly Superman and Captain America.",
      icon: "🦸",
      color: "#00BFFF"
    },
    {
      category: "Demon Slayer",
      fact: "Demon Slayer became the highest-grossing film of all time in Japan, surpassing even Studio Ghibli's classics.",
      icon: "⚔️",
      color: "#00CED1"
    },
    {
      category: "Sailor Moon",
      fact: "Sailor Moon was originally going to be a one-shot story about a girl who could talk to cats and fly.",
      icon: "🌙",
      color: "#FFB6C1"
    },
    {
      category: "Fullmetal Alchemist",
      fact: "The creator, Hiromu Arakawa, is a woman and one of the few female manga artists in the shonen genre.",
      icon: "⚗️",
      color: "#FFD700"
    },
    {
      category: "Hunter x Hunter",
      fact: "The creator Yoshihiro Togashi is famous for taking long hiatuses, sometimes lasting years, due to health issues.",
      icon: "🎯",
      color: "#32CD32"
    },
    {
      category: "Bleach",
      fact: "Bleach was originally going to be called 'Sniper' but was changed because it didn't fit the sword-fighting theme.",
      icon: "⚡",
      color: "#FF6347"
    },
    {
      category: "Cowboy Bebop",
      fact: "The title 'Cowboy Bebop' was chosen because it sounded cool - it has no actual connection to the story content.",
      icon: "🚀",
      color: "#4B0082"
    },
    {
      category: "Neon Genesis Evangelion",
      fact: "The Angels in Evangelion were named after angels from religious texts, but their designs were based on deep-sea creatures.",
      icon: "👼",
      color: "#800080"
    },
    {
      category: "Pokémon",
      fact: "The original Pokémon games were inspired by creator Satoshi Tajiri's childhood hobby of collecting insects.",
      icon: "🐛",
      color: "#FFD700"
    },
    {
      category: "Studio Ghibli",
      fact: "Studio Ghibli's name means 'hot wind blowing through the Sahara Desert' - referring to their desire to blow new life into the anime industry.",
      icon: "🌪️",
      color: "#87CEEB"
    },
    {
      category: "Spirited Away",
      fact: "Spirited Away won the Oscar for Best Animated Feature, but Hayao Miyazaki didn't attend the ceremony because he was against the Iraq War.",
      icon: "🏆",
      color: "#FFD700"
    },
    {
      category: "Akira",
      fact: "Akira's budget was equivalent to $11 million in 1988 - the most expensive anime film ever made at that time.",
      icon: "🏙️",
      color: "#FF4500"
    },
    {
      category: "Ghost in the Shell",
      fact: "The Matrix directors were heavily inspired by Ghost in the Shell - they even showed it to producers to explain the visual style they wanted.",
      icon: "👻",
      color: "#4169E1"
    },
    {
      category: "Code Geass",
      fact: "Lelouch's design was inspired by Light Yagami from Death Note, but with a more aristocratic and dramatic flair.",
      icon: "♟️",
      color: "#8B008B"
    },
    {
      category: "Steins;Gate",
      fact: "The time machine in Steins;Gate is a microwave - this was chosen because microwaves are common household items that feel mysterious.",
      icon: "⏰",
      color: "#1E90FF"
    },
    {
      category: "Re:Zero",
      fact: "The author wrote Re:Zero while working as a convenience store clerk, drawing inspiration from his daily interactions.",
      icon: "🔄",
      color: "#9370DB"
    },
    {
      category: "Tokyo Ghoul",
      fact: "Ghouls' kagune weapons were inspired by the concept of 'life force' taking physical form through emotions.",
      icon: "👁️",
      color: "#800000"
    },
    {
      category: "Black Clover",
      fact: "Asta's anti-magic ability was created as a contrast to typical overpowered protagonists - he's a normal person in a world of magic.",
      icon: "🍀",
      color: "#000000"
    },
    {
      category: "Jujutsu Kaisen",
      fact: "The cursed techniques in JJK are based on real Japanese folklore and spiritual concepts from Shinto and Buddhism.",
      icon: "👹",
      color: "#8B0000"
    },
    {
      category: "My Hero Academia",
      fact: "Each character's quirk was designed to reflect their personality - Bakugo's explosions match his explosive temper.",
      icon: "💥",
      color: "#FF4500"
    },
    {
      category: "One Punch Man",
      fact: "One Punch Man started as a webcomic drawn on MS Paint by a person who had never drawn manga before.",
      icon: "👊",
      color: "#FFFFFF"
    },
    {
      category: "Mob Psycho 100",
      fact: "The creator of Mob Psycho 100 is the same person who created One Punch Man - both started as webcomics.",
      icon: "🔮",
      color: "#9932CC"
    },
    {
      category: "Vinland Saga",
      fact: "The historical events in Vinland Saga are based on real Viking expeditions to North America around 1000 AD.",
      icon: "⚔️",
      color: "#4682B4"
    },
    {
      category: "Dr. Stone",
      fact: "Many of the scientific inventions in Dr. Stone are based on real historical discoveries and principles.",
      icon: "🔬",
      color: "#32CD32"
    },
    {
      category: "Fire Force",
      fact: "The creator of Fire Force also created Soul Eater - both series share similar art styles and themes.",
      icon: "🔥",
      color: "#FF6347"
    },
    {
      category: "The Promised Neverland",
      fact: "The demon designs were inspired by various mythological creatures from around the world, not just Japanese folklore.",
      icon: "👺",
      color: "#8B4513"
    },
    {
      category: "Spy x Family",
      fact: "Anya's telepathic ability was created because the author wanted a character who could understand everyone's true feelings.",
      icon: "🧠",
      color: "#FFB6C1"
    },
    {
      category: "Chainsaw Man",
      fact: "The creator of Chainsaw Man said he wanted to create a manga that felt like watching a Hollywood action movie.",
      icon: "🪚",
      color: "#8B0000"
    },
    {
      category: "JoJo's Bizarre Adventure",
      fact: "Many character names in JoJo are references to Western music bands and songs, like Queen and Pink Floyd.",
      icon: "✨",
      color: "#FFD700"
    },
    {
      category: "Yu Yu Hakusho",
      fact: "Yusuke's character design was inspired by Japanese high school delinquents from the 1990s.",
      icon: "👊",
      color: "#8B0000"
    },
    {
      category: "Inuyasha",
      fact: "The feudal Japan setting was chosen because the creator wanted to explore the contrast between modern and traditional Japan.",
      icon: "⚔️",
      color: "#FF6347"
    },
    {
      category: "Fruits Basket",
      fact: "The zodiac curse in Fruits Basket is based on the Chinese zodiac, but with some creative changes for the story.",
      icon: "🐀",
      color: "#FFB6C1"
    },
    {
      category: "Ouran High School Host Club",
      fact: "The host club concept was inspired by real Japanese host clubs, but made more romantic and less realistic.",
      icon: "🌹",
      color: "#FF69B4"
    },
    {
      category: "Death Note",
      fact: "L's sitting position was inspired by real detectives who sit that way to think better and stay alert.",
      icon: "🍫",
      color: "#000000"
    },
    {
      category: "Code Geass",
      fact: "The Knightmare Frames were designed to look like medieval knights combined with modern mecha aesthetics.",
      icon: "🤖",
      color: "#8B008B"
    },
    {
      category: "Gurren Lagann",
      fact: "The spiral power concept represents evolution and progress - the drill symbolizes breaking through barriers.",
      icon: "🔱",
      color: "#FF6347"
    },
    {
      category: "Kill la Kill",
      fact: "The revealing clothing designs were meant to challenge anime fanservice tropes and make viewers question why they're uncomfortable.",
      icon: "👘",
      color: "#FF0000"
    },
    {
      category: "Puella Magi Madoka Magica",
      fact: "Despite its cute appearance, Madoka Magica is considered one of the darkest magical girl anime ever made.",
      icon: "✨",
      color: "#FFB6C1"
    },
    {
      category: "Made in Abyss",
      fact: "The Abyss was inspired by the creator's childhood fear of deep water and mysterious places.",
      icon: "🕳️",
      color: "#4169E1"
    },
    {
      category: "Overlord",
      fact: "The series started as a web novel before becoming a light novel and anime - the original web novel is still ongoing.",
      icon: "👑",
      color: "#8B0000"
    },
    {
      category: "Sword Art Online",
      fact: "The NerveGear concept was inspired by real-life VR technology research and the creator's interest in gaming addiction.",
      icon: "🎮",
      color: "#00BFFF"
    },
    {
      category: "Erased",
      fact: "The time rewind ability was designed to explore themes of regret and the desire to fix past mistakes.",
      icon: "⏰",
      color: "#4682B4"
    },
    {
      category: "Charlotte",
      fact: "The ability-stealing concept was created to explore what happens when people lose what makes them special.",
      icon: "🌟",
      color: "#FFD700"
    },
    {
      category: "Angel Beats!",
      fact: "The afterlife setting was designed to explore themes of acceptance and moving on from past regrets.",
      icon: "👼",
      color: "#87CEEB"
    },
    {
      category: "Clannad",
      fact: "The title 'Clannad' comes from an Irish word meaning 'family' - reflecting the story's focus on family relationships.",
      icon: "👨‍👩‍👧‍👦",
      color: "#87CEEB"
    },
    {
      category: "K-On!",
      fact: "All the songs performed by the band in K-On! were actually composed and recorded by real musicians for the anime.",
      icon: "🎸",
      color: "#FFB6C1"
    },
    {
      category: "Lucky Star",
      fact: "The opening theme 'Motteke! Sailor Fuku' became an internet meme due to its catchy tune and dance.",
      icon: "🌟",
      color: "#FF69B4"
    },
    {
      category: "Haruhi Suzumiya",
      fact: "The episode order was intentionally broadcast out of order to match the chaotic nature of the main character.",
      icon: "🌌",
      color: "#FFD700"
    },
    {
      category: "Durarara!!",
      fact: "The title has no meaning - the creator just liked the sound of it and added exclamation marks for emphasis.",
      icon: "🌃",
      color: "#8B0000"
    },
    {
      category: "Baccano!",
      fact: "The title means 'stupid commotion' in Italian - perfectly describing the chaotic nature of the story.",
      icon: "🚂",
      color: "#8B4513"
    },
    {
      category: "Mononoke",
      fact: "The Medicine Seller's design was inspired by traditional Japanese medicine sellers and exorcists.",
      icon: "💊",
      color: "#4B0082"
    },
    {
      category: "Mushishi",
      fact: "The concept of 'mushi' was inspired by traditional Japanese folklore about mysterious life forms.",
      icon: "🦋",
      color: "#228B22"
    },
    {
      category: "Natsume's Book of Friends",
      fact: "The yokai in the series are based on real Japanese folklore creatures, many of which are rarely seen in modern media.",
      icon: "👻",
      color: "#6B8E23"
    },
    {
      category: "Haikyuu!!",
      fact: "All the volleyball techniques and strategies shown in the anime are based on real volleyball tactics.",
      icon: "🏐",
      color: "#FF6347"
    },
    {
      category: "Kuroko's Basketball",
      fact: "The 'Zone' concept was inspired by real basketball players entering a state of complete focus during games.",
      icon: "🏀",
      color: "#4169E1"
    },
    {
      category: "Free!",
      fact: "The swimming animations were so realistic that actual competitive swimmers praised their accuracy.",
      icon: "🏊",
      color: "#00BFFF"
    },
    {
      category: "Yuri on Ice",
      fact: "The figure skating routines were choreographed by real Olympic figure skaters and coaches.",
      icon: "⛸️",
      color: "#C71585"
    },
    {
      category: "Violet Evergarden",
      fact: "The Auto Memory Dolls were inspired by the concept of people who help others express their emotions through writing.",
      icon: "📝",
      color: "#4169E1"
    },
    {
      category: "A Place Further Than the Universe",
      fact: "The Antarctic expedition details were based on real Antarctic research and exploration stories.",
      icon: "🐧",
      color: "#87CEEB"
    },
    {
      category: "Girls' Last Tour",
      fact: "The post-apocalyptic setting was inspired by the creator's feelings about modern society and human connection.",
      icon: "🏍️",
      color: "#708090"
    },
    {
      category: "Land of the Lustrous",
      fact: "The gemstone characters were designed to be genderless, reflecting the creator's exploration of identity.",
      icon: "💎",
      color: "#E6E6FA"
    },
    {
      category: "Houseki no Kuni",
      fact: "The hardness scale used in the series is based on the real Mohs scale of mineral hardness.",
      icon: "💠",
      color: "#DDA0DD"
    },
    {
      category: "Beastars",
      fact: "The carnivore/herbivore conflict was created as an allegory for real-world prejudice and discrimination.",
      icon: "🐺",
      color: "#8B4513"
    },
    {
      category: "Golden Kamuy",
      fact: "The Ainu cultural elements were extensively researched to accurately represent the indigenous people of Hokkaido.",
      icon: "🗻",
      color: "#FFD700"
    },
    {
      category: "Dororo",
      fact: "The original manga from the 1960s was much more lighthearted - the dark tone was added for the modern adaptation.",
      icon: "👹",
      color: "#8B0000"
    },
    {
      category: "Mob Psycho 100",
      fact: "Mob's character design was intentionally made plain to emphasize that power doesn't come from appearance.",
      icon: "👻",
      color: "#9932CC"
    },
    {
      category: "One Piece",
      fact: "The Devil Fruit concept was inspired by the idea of 'cursed powers' - gaining amazing abilities at a terrible cost.",
      icon: "🍎",
      color: "#FF0000"
    },
    {
      category: "Naruto",
      fact: "The hand signs for jutsu are based on real Buddhist hand mudras, though simplified for the anime.",
      icon: "🙏",
      color: "#FF6B35"
    },
    {
      category: "Bleach",
      fact: "The Zanpakuto concept was inspired by the idea that a weapon should reflect its owner's soul.",
      icon: "⚔️",
      color: "#FF6347"
    },
    {
      category: "Fairy Tail",
      fact: "The guild system was inspired by real medieval guilds but adapted for a fantasy adventure setting.",
      icon: "🐉",
      color: "#FF6347"
    },
    {
      category: "Rave Master",
      fact: "The same creator who made Fairy Tail also created Rave Master - some characters make cameo appearances.",
      icon: "⚡",
      color: "#FFD700"
    },
    {
      category: "Magi",
      fact: "The Dungeons were inspired by Arabic mythology and the story of Alibaba and the Forty Thieves.",
      icon: "🏰",
      color: "#8B4513"
    },
    {
      category: "Blue Exorcist",
      fact: "The exorcism techniques are based on real religious practices from various cultures around the world.",
      icon: "🔥",
      color: "#0000FF"
    },
    {
      category: "D.Gray-man",
      fact: "The Innocence concept was inspired by the idea of holy weapons and religious artifacts.",
      icon: "✝️",
      color: "#FFFFFF"
    },
    {
      category: "Soul Eater",
      fact: "The concept of weapons transforming into humans was inspired by the idea of finding humanity in inanimate objects.",
      icon: "👻",
      color: "#8B0000"
    },
    {
      category: "Black Butler",
      fact: "Sebastian's character was inspired by the concept of the perfect butler - someone who can do anything flawlessly.",
      icon: "🎩",
      color: "#000000"
    },
    {
      category: "Pandora Hearts",
      fact: "The Alice in Wonderland themes were reimagined with a darker, more complex fantasy setting.",
      icon: "🐰",
      color: "#8B008B"
    },
    {
      category: "K Project",
      fact: "The Seven Kings concept was based on the seven deadly sins, but reimagined for a modern urban fantasy setting.",
      icon: "👑",
      color: "#FFD700"
    },
    {
      category: "No Game No Life",
      fact: "The game strategies shown are based on real game theory and mathematical principles.",
      icon: "🎲",
      color: "#FF69B4"
    },
    {
      category: "Log Horizon",
      fact: "The MMORPG mechanics were designed to be more realistic than typical game anime, focusing on strategy and economics.",
      icon: "🗡️",
      color: "#4169E1"
    },
    {
      category: "Overlord",
      fact: "The Nazarick hierarchy was inspired by real organizational structures and management principles.",
      icon: "🏛️",
      color: "#8B0000"
    },
    {
      category: "The Rising of the Shield Hero",
      fact: "The shield hero concept was inspired by the idea of defensive strength being as valuable as offensive power.",
      icon: "🛡️",
      color: "#4169E1"
    },
    {
      category: "Re:Zero",
      fact: "The return by death ability was created to explore the psychological toll of dying repeatedly.",
      icon: "💀",
      color: "#9370DB"
    },
    {
      category: "Konosuba",
      fact: "The comedy was designed to parody typical isekai tropes while still being an entertaining adventure story.",
      icon: "💧",
      color: "#00BFFF"
    },
    {
      category: "That Time I Got Reincarnated as a Slime",
      fact: "The skill evolution system was inspired by evolutionary biology and adaptation concepts.",
      icon: "🦋",
      color: "#32CD32"
    }
  ];

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Rotate through fun facts every 8 seconds
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentFact((prev) => (prev + 1) % animeFunFacts.length);
        setIsTransitioning(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [location.pathname]);

  const handleNewFact = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentFact(Math.floor(Math.random() * animeFunFacts.length));
      setIsTransitioning(false);
    }, 300);
  };

  const fact = animeFunFacts[currentFact];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="scanline-overlay-fixed" />
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: 0.1 + Math.random() * 0.2,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {['⚔️', '👹', '⚡', '🔥', '💀', '🌟', '⚗️', '🛡️'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
        <div className="text-center">
          {/* 404 Display */}
          <div className="mb-8">
            <div className="relative inline-block">
              <h1 className="font-display text-[150px] md:text-[200px] font-black leading-none" 
                style={{ 
                  color: 'var(--neon-purple)',
                  textShadow: '0 0 30px rgba(139,0,255,0.5), 0 0 60px rgba(139,0,255,0.3)',
                  transform: 'perspective(500px) rotateX(15deg)'
                }}>
                404
              </h1>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full h-1 rounded-full"
                style={{ 
                  background: 'linear-gradient(90deg, transparent, var(--neon-purple), transparent)',
                  boxShadow: '0 0 20px rgba(139,0,255,0.5)'
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Lost in the Anime Dimension?
            </h2>
            <p className="font-body text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
              The page you're looking for doesn't exist in our multiverse.
            </p>
          </div>

          {/* Anime Fun Fact Card */}
          <div className={`mb-8 p-6 rounded-lg border transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
            style={{ 
              background: 'var(--bg-elevated)', 
              borderColor: fact.color,
              boxShadow: `0 0 30px ${fact.color}20`
            }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-3xl">{fact.icon}</span>
              <h3 className="font-display text-xl font-bold" style={{ color: fact.color }}>
                {fact.category} Fun Fact
              </h3>
            </div>
            <p className="font-body text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              {fact.fact}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleNewFact}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-display font-bold text-sm transition-all"
                style={{ 
                  background: `${fact.color}20`, 
                  color: fact.color,
                  border: `1px solid ${fact.color}40`
                }}
              >
                <RefreshCw size={16} />
                New Fact
              </button>
              <div className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                {currentFact + 1} / {animeFunFacts.length}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold transition-all"
              style={{ 
                background: 'var(--neon-purple)20', 
                color: 'var(--neon-purple)',
                border: '1px solid var(--neon-purple)',
                boxShadow: '0 0 20px rgba(139,0,255,0.3)'
              }}
            >
              <Home size={18} />
              Return to Home
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-display font-bold transition-all"
              style={{ 
                background: 'var(--bg-elevated)', 
                color: 'var(--text-primary)',
                border: '1px solid var(--border)'
              }}
            >
              <ArrowRight size={18} className="rotate-180" />
              Go Back
            </button>
          </div>

          {/* Navigation Suggestions */}
          <div className="mt-12 p-6 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <h3 className="font-display text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Looking for Something?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Swords, label: 'Battle Lobby', href: '/battle-lobby' },
                { icon: BookOpen, label: 'Manga Library', href: '/manga' },
                { icon: Users, label: 'Clans', href: '/clans' },
                { icon: Shield, label: 'Leaderboard', href: '/leaderboard' },
                { icon: Compass, label: 'Feed', href: '/feed' },
                { icon: Zap, label: 'Store', href: '/store' },
                { icon: Skull, label: 'Bounties', href: '/bounties' },
                { icon: Tv2, label: 'Anime News', href: '/anime-news' }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.href)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all hover:scale-105"
                  style={{ 
                    background: 'var(--bg-elevated)', 
                    border: '1px solid var(--border)'
                  }}
                >
                  <item.icon size={20} style={{ color: 'var(--neon-blue)' }} />
                  <span className="font-body text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
