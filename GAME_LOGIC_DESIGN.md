# Zankoku: Complete Game Logic & Strategy Design

## 🎯 Core Philosophy

**"The World Does Not Forgive"** - Every action has consequences. Resource management, positioning, and technique timing determine victory. A skilled player with depleted resources can still win through superior strategy and technique timing.

---

## 🎮 Game Overview

### **Objective**
Capture more territory than your opponent by completing shapes (squares/triangles) on a grid-based battlefield. The game ends when all dots are connected.

### **Victory Conditions**
- **Primary**: Most completed shapes wins
- **Secondary**: Resource efficiency
- **Tiebreaker**: Techniques used vs opponent

---

## 🏟️ Battlefield Mechanics

### **Grid System**
- **6x6 grid** (36 intersection points)
- **Dots** placed at each intersection
- **Lines** connect adjacent dots (horizontal/vertical/diagonal)
- **Shapes** formed by completing closed geometric patterns

### **Shape Completion**
- **Square**: 4 lines forming a closed square
- **Triangle**: 3 lines forming a closed triangle
- **Ownership**: Shape belongs to player who drew the final line
- **Scoring**: Each shape = 1 point

---

## ⚡ Resource System

### **Anime-Specific Resources**
Each faction has unique resources that power their techniques:

| Faction | Resource | Starting Amount | Max Capacity |
|---------|----------|----------------|--------------|
| Naruto | Chakra | 100 | 200 |
| JJK | Cursed Energy | 100 | 200 |
| One Piece | Haki | 100 | 200 |
| Bleach | Reiatsu | 100 | 200 |
| Black Clover | Mana | 100 | 200 |
| Dragon Ball | Ki | 100 | 200 |
| Demon Slayer | Breath Power | 100 | 200 |
| HxH | Nen | 100 | 200 |

### **Resource Costs**
- **Basic Line**: 0 resources
- **Technique Lines**: Variable (10-50 resources)
- **Resource Generation**: +5 resources per turn
- **Resource Theft**: Steal resources when completing shapes

---

## 🎯 Technique System

### **Technique Categories**

#### **1. Offensive Techniques** (High Cost, High Impact)
- **Shadow Clone Jutsu** (Naruto): 40 Chakra - Place 2 lines simultaneously
- **Domain Expansion** (JJK): 50 Cursed Energy - Convert 1 enemy shape to yours
- **Conqueror's Haki** (One Piece): 45 Haki - Block opponent's next technique
- **Bankai** (Bleach): 45 Reiatsu - Complete 1 partial shape instantly
- **Anti-Magic** (Black Clover): 40 Mana - Negate opponent's active technique
- **Spirit Bomb** (Dragon Ball): 50 Ki - Clear 3x3 area, reset all lines
- **Breath of the Sun** (Demon Slayer): 45 Breath Power - Chain 3 lines in sequence
- **100-Type Guany休** (HxH): 50 Nen - Perfect defense, block next 2 attacks

#### **2. Defensive Techniques** (Medium Cost, Strategic)
- **Substitution Jutsu** (Naruto): 25 Chakra - Swap positions of 2 dots
- **Infinity** (JJK): 30 Cursed Energy - Protect 1 dot from being connected
- **Observation Haki** (One Piece): 25 Haki - See opponent's next move
- **Shapewarp** (Bleach): 25 Reiatsu - Move 1 already placed line
- **Magic Reflection** (Black Clover): 30 Mana - Reflect technique back to caster
- **Afterimage** (Dragon Ball): 25 Ki - Create decoy line that disappears after 1 turn
- **Water Breathing** (Demon Slayer): 25 Breath Power - Undo opponent's last line
- **Zaji** (HxH): 30 Nen - Steal opponent's technique for 1 use

#### **3. Utility Techniques** (Low Cost, Tactical)
- **Shadow Possession** (Naruto): 15 Chakra - Force opponent to play specific area
- **Cleansing Flow** (JJK): 15 Cursed Energy - Remove debuffs
- **Gear Second** (One Piece): 15 Haki - Next line costs 50% less resources
- **Flash Step** (Bleach): 15 Reiatsu - Place line anywhere on board
- **Reinforcement** (Black Clover): 15 Mana - Double resource gain next turn
- **Kaioken** (Dragon Ball): 15 Ki - Next technique costs 25% less
- **Total Concentration** (Demon Slayer): 15 Breath Power - See all possible shape completions
- **aji** (HxH): 15 Nen - Analyze opponent's resource levels

---

## 🧠 Strategic Depth Mechanics

### **Resource Management Strategy**
```
Early Game (Turns 1-10):
- Conserve resources (use <30% total)
- Focus on basic line placement
- Set up future shape completions
- Observe opponent's patterns

Mid Game (Turns 11-25):
- Use utility techniques for positioning
- Begin defensive technique usage
- Create multiple simultaneous threats
- Force opponent to waste resources

Late Game (Turns 26-36):
- Unleash offensive techniques
- Use defensive techniques to protect leads
- Resource starvation becomes critical
- Technique timing determines victory
```

### **Positional Warfare**
- **Center Control**: Dominating center provides more shape opportunities
- **Edge Strategy**: Edges are safer but limit shape completion options
- **Corner Traps**: Force opponents into defensive positions
- **Pattern Recognition**: Identify opponent's preferred formations

### **Technique Timing Theory**
The **"Technique Economy"** principle:
1. **Early Waste**: Using expensive techniques early = disadvantage
2. **Mid Pressure**: Medium techniques to force responses
3. **Endgame Surge**: Save ultimate techniques for critical moments
4. **Resource Starvation**: Force opponent to use basic moves while you have techniques

---

## 🏆 Winning Through Superior Strategy

### **The Comeback Mechanic**
A player with fewer resources can still win through:

#### **1. Technique Efficiency**
- **Perfect Timing**: Use techniques when opponent has no resources to respond
- **Chain Combos**: Combine techniques for devastating effects
- **Resource Theft**: Complete shapes to steal opponent's resources

#### **2. Positional Advantage**
- **Shape Lock**: Complete shapes that block opponent's future moves
- **Forced Moves**: Use techniques to limit opponent's options
- **Area Denial**: Control key board regions

#### **3. Psychological Warfare**
- **Bluffing**: Make opponent think you have powerful techniques ready
- **Resource Bait**: Leave resources vulnerable to trap opponent
- **Pattern Breaking**: Deviate from expected play style

### **The "Last Technique" Victory Condition**
```
Scenario: Player A (low resources) vs Player B (high resources)

Player B's Advantage:
- More resources available
- Can use techniques freely
- Controls board position

Player A's Comeback Path:
1. Conserve all resources for final 5 turns
2. Use positioning to create unavoidable threats
3. Wait for Player B to overextend
4. Unleash perfect technique combination
5. Steal resources and complete winning shapes
6. Victory through superior timing and efficiency
```

---

## ⚖️ Balance Principles

### **Resource-Technique Balance**
- **Basic moves** always viable (0 cost)
- **Techniques** provide advantage but cost resources
- **No single technique** guarantees victory
- **Combination play** rewarded over single powerful moves

### **Skill Expression**
- **Pattern Recognition**: Experienced players see more opportunities
- **Resource Management**: Critical thinking about when to spend
- **Positional Understanding**: Board control matters more than individual moves
- **Adaptation**: Adjust strategy based on opponent's playstyle

### **Counter-Play System**
Every technique has counters:
```
Offensive Technique → Defensive Counter → Utility Response
     ↓                           ↓                      ↓
High Cost             Medium Cost             Low Cost
High Impact           Strategic Value         Tactical Advantage
```

---

## 🎯 Advanced Strategies

### **The Resource Starvation Strategy**
1. **Early**: Play conservatively, build board position
2. **Mid**: Use theft techniques to drain opponent resources
3. **Late**: Opponent forced into basic moves while you have techniques

### **The Technique Overload Strategy**
1. **Early**: Rapid resource accumulation
2. **Mid**: Overwhelm with multiple technique combinations
3. **Late**: Opponent cannot respond to all threats

### **The Positional Dominance Strategy**
1. **Early**: Secure key board positions
2. **Mid**: Use techniques to enhance positional advantage
3. **Late**: Convert position into unavoidable victories

### **The Adaptive Strategy**
1. **Early**: Test opponent's playstyle and resource usage
2. **Mid**: Adapt strategy to exploit opponent's weaknesses
3. **Late**: Execute perfected counter-strategy

---

## 🎮 Game Flow Example

### **Professional Match Analysis**
```
Turn 1-5: Positioning Phase
- Both players place basic lines
- Resource accumulation begins
- Patterns established

Turn 6-15: Tactical Phase  
- Utility techniques emerge
- Positional battles intensify
- Resource management becomes critical

Turn 16-25: Strategic Phase
- Defensive techniques protect key positions
- Offensive techniques create breakthrough opportunities
- Resource levels fluctuate dramatically

Turn 26-36: Endgame Phase
- Ultimate techniques unleashed
- Resource starvation forces desperate moves
- Victory determined by technique efficiency and timing
```

---

## 🔮 Skill Ceiling Design

### **Beginner Level**
- Understand basic line placement
- Learn shape completion rules
- Basic resource management

### **Intermediate Level**
- Technique timing and combinations
- Positional awareness
- Resource efficiency

### **Advanced Level**
- Complex technique chains
- Psychological warfare
- Adaptive strategy implementation

### **Professional Level**
- Perfect resource management
- Pattern prediction and manipulation
- Optimal technique economy

---

## 🏅 Conclusion

Zankoku rewards **strategic thinking**, **resource management**, and **technique timing** over raw power. A skilled player with 10 resources can defeat a novice with 100 resources through superior positioning, perfect timing, and technique efficiency.

The game embodies its philosophy: **"The World Does Not Forgive"** - every mistake can be exploited, every resource matters, and victory goes to those who think ahead.

**Remember**: It's not about having the most resources or the most powerful techniques. It's about using what you have, when it matters most.

---

*"In Zankoku, the last technique often determines the victor, not the first."*
