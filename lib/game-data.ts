// Game data for new features

// Random Events
export const RANDOM_EVENTS = [
  {
    id: "celebrity_visit",
    title: "Celebrity Visit!",
    description: "A famous coffee influencer is visiting your shops! Customers are flocking in.",
    type: "positive",
    duration: 120, // 2 minutes
    defaultEffect: {
      type: "multiplier",
      value: 2,
      target: "all businesses",
    },
  },
  {
    id: "bean_shortage",
    title: "Bean Shortage",
    description: "There's a temporary shortage of quality coffee beans in the market.",
    type: "negative",
    duration: 180, // 3 minutes
    defaultEffect: {
      type: "multiplier",
      value: -0.5,
      target: "all businesses",
    },
  },
  {
    id: "coffee_competition",
    title: "Coffee Competition",
    description: "A local coffee competition is being held. You can enter your best blend!",
    type: "challenge",
    options: [
      {
        text: "Enter Standard Blend",
        effect: "Safe option: +$5,000 cash",
        value: 5000,
      },
      {
        text: "Enter Experimental Blend",
        effect: "Risky: 50% chance of +$20,000, 50% chance of nothing",
        value: 20000,
      },
      {
        text: "Skip Competition",
        effect: "No risk, no reward",
        value: 0,
      },
    ],
  },
  {
    id: "health_trend",
    title: "Coffee Health Study",
    description: "A new study claims coffee has additional health benefits!",
    type: "positive",
    duration: 300, // 5 minutes
    defaultEffect: {
      type: "multiplier",
      value: 1.5,
      target: "all businesses",
    },
  },
  {
    id: "equipment_breakdown",
    title: "Equipment Breakdown",
    description: "Some of your coffee equipment is malfunctioning.",
    type: "negative",
    duration: 120, // 2 minutes
    defaultEffect: {
      type: "multiplier",
      value: -0.3,
      target: "all businesses",
    },
  },
  {
    id: "investor_offer",
    title: "Investor Offer",
    description: "A venture capitalist wants to invest in your coffee empire!",
    type: "special",
    options: [
      {
        text: "Accept Investment",
        effect: "Gain $50,000 cash now, but 10% lower profits for 5 minutes",
        value: 50000,
      },
      {
        text: "Decline Offer",
        effect: "No immediate cash, maintain full profits",
        value: 0,
      },
    ],
  },
]

// Customer Types
export const CUSTOMER_TYPES = [
  {
    id: "casual",
    name: "Casual Customer",
    description: "Just looking for a quick coffee",
    preferences: {
      quality: 0.5,
      price: 0.7,
      speed: 0.3,
      loyalty: 0.2,
    },
    spendingLimit: 10,
    visitFrequency: 0.7,
    icon: "☕",
  },
  {
    id: "business",
    name: "Business Professional",
    description: "In a hurry, needs caffeine",
    preferences: {
      quality: 0.6,
      price: 0.3,
      speed: 0.9,
      loyalty: 0.5,
    },
    spendingLimit: 15,
    visitFrequency: 0.8,
    icon: "💼",
  },
  {
    id: "connoisseur",
    name: "Coffee Connoisseur",
    description: "Appreciates quality beans",
    preferences: {
      quality: 0.9,
      price: 0.4,
      speed: 0.5,
      loyalty: 0.8,
    },
    spendingLimit: 25,
    visitFrequency: 0.4,
    icon: "🧐",
  },
  {
    id: "student",
    name: "Student",
    description: "On a budget, needs caffeine",
    preferences: {
      quality: 0.3,
      price: 0.9,
      speed: 0.6,
      loyalty: 0.3,
    },
    spendingLimit: 8,
    visitFrequency: 0.6,
    icon: "📚",
  },
  {
    id: "influencer",
    name: "Social Media Influencer",
    description: "Here for the aesthetic",
    preferences: {
      quality: 0.7,
      price: 0.5,
      speed: 0.4,
      loyalty: 0.6,
    },
    spendingLimit: 20,
    visitFrequency: 0.3,
    icon: "📱",
  },
]

// Seasonal Events
export const SEASONAL_EVENTS = [
  {
    id: "pumpkin_spice",
    name: "Pumpkin Spice Season",
    description: "Fall is here, and customers are craving that signature pumpkin spice flavor in their coffee!",
    startMonth: 8, // September
    endMonth: 10, // November
    effects: {
      globalMultiplier: 1.5,
      specialBusiness: {
        id: "pumpkin_spice_station",
        name: "Pumpkin Spice Station",
        icon: "🎃",
        baseCost: 50000,
        baseRevenue: 25000,
        baseTime: 10,
        costMultiplier: 1.1,
        revenueMultiplier: 1.2,
      },
      specialUpgrades: [
        {
          id: "pumpkin_master",
          name: "Pumpkin Spice Master",
          cost: 100000,
          multiplier: 3,
          type: "profit",
          description: "Triple profits from Pumpkin Spice Station",
        },
      ],
    },
  },
  {
    id: "holiday_blend",
    name: "Holiday Blend Season",
    description: "The holidays are here! Special festive coffee blends are in high demand.",
    startMonth: 10, // November
    endMonth: 0, // January
    effects: {
      globalMultiplier: 2,
      specialBusiness: {
        id: "holiday_blend_bar",
        name: "Holiday Blend Bar",
        icon: "🎄",
        baseCost: 100000,
        baseRevenue: 50000,
        baseTime: 15,
        costMultiplier: 1.15,
        revenueMultiplier: 1.25,
      },
      specialUpgrades: [
        {
          id: "festive_cheer",
          name: "Festive Cheer",
          cost: 200000,
          multiplier: 2,
          type: "speed",
          description: "Holiday Blend Bar produces twice as fast",
        },
      ],
    },
  },
  {
    id: "summer_iced",
    name: "Summer Iced Coffee",
    description: "It's hot outside, and everyone wants refreshing iced coffee drinks!",
    startMonth: 5, // June
    endMonth: 7, // August
    effects: {
      globalMultiplier: 1.3,
      specialBusiness: {
        id: "iced_coffee_station",
        name: "Iced Coffee Station",
        icon: "❄️",
        baseCost: 75000,
        baseRevenue: 37500,
        baseTime: 8,
        costMultiplier: 1.12,
        revenueMultiplier: 1.18,
      },
      specialUpgrades: [
        {
          id: "cold_brew_master",
          name: "Cold Brew Master",
          cost: 150000,
          multiplier: 2.5,
          type: "profit",
          description: "Increase Iced Coffee Station profits by 250%",
        },
      ],
    },
  },
  {
    id: "coffee_day",
    name: "International Coffee Day",
    description: "October 1st is International Coffee Day! Coffee enthusiasm is at an all-time high.",
    startMonth: 9, // October
    endMonth: 9, // October
    duration: 1, // Just one day
    effects: {
      globalMultiplier: 3,
      specialUpgrades: [
        {
          id: "coffee_day_celebration",
          name: "Coffee Day Celebration",
          cost: 50000,
          multiplier: 5,
          type: "profit",
          description: "5x profits for all businesses today only!",
        },
      ],
    },
  },
]

// Achievement data
export const ACHIEVEMENTS = [
  {
    id: "first_million",
    name: "First Million",
    description: "Earn your first million dollars",
    requirement: { type: "earnings", value: 1000000 },
    reward: { type: "cash", value: 10000 },
    icon: "💰",
  },
  {
    id: "coffee_empire",
    name: "Coffee Empire",
    description: "Own at least 100 of each business",
    requirement: { type: "businesses", value: 100 },
    reward: { type: "multiplier", value: 1.5 },
    icon: "👑",
  },
  {
    id: "bean_master",
    name: "Bean Master",
    description: "Win the bean sorting game with a perfect score",
    requirement: { type: "minigame", value: 100 },
    reward: { type: "cash", value: 500 },
    icon: "🏆",
  },
  {
    id: "customer_service",
    name: "Customer Service Expert",
    description: "Serve 1,000 customers",
    requirement: { type: "customers", value: 1000 },
    reward: { type: "multiplier", value: 1.2 },
    icon: "🤝",
  },
  {
    id: "prestige_master",
    name: "Prestige Master",
    description: "Reach prestige level 10",
    requirement: { type: "prestige", value: 10 },
    reward: { type: "multiplier", value: 2 },
    icon: "✨",
  },
]
