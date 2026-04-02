const elements = [
  {
    id: 1,
    slug: "position",
    title: "Position",
    subtitle: "where you are",
    whatThisMeans: [
      "Before you navigate anywhere, you need an honest read of where you stand. Not where you want to be, but where you actually are. Now.",
      "Position is your current financial snapshot — your personal polaroid. Some might call it a picture of your Net Financial Worth (N$W).",
      "What you own, what you owe. What's coming in, what's going out. No judgment. Just a clear-eyed look at the state of your money matters today.",
      "You can think of it as your Financial Orientation Starting Line."
    ],
    consider: [
      "Do I have a clear picture of what I own, where it is, and what it's worth?",
      "Do I know my monthly cash flow — both in and out?",
      "Have I ever mapped my full financial position on paper?",
      "What feels unclear or untracked right now?"
    ],
    scorecardConnections: [
      {
        "num": "1",
        "title": "Accounts"
      },
      {
        "num": "2",
        "title": "Reserves"
      },
      {
        "num": "9",
        "title": "Net $ Worth"
      }
    ],
    notesPrompt: "where do things stand? what's clear? what isn't?"
  },
  {
    id: 2,
    slug: "terrain",
    title: "Terrain",
    subtitle: "what surrounds you",
    whatThisMeans: [
      "Terrain is the landscape where you are operating. Tax rules, interest rates, insurance markets, employer benefits.",
      "You didn't design these conditions, but they're acting on you all the same. Understanding terrain doesn't mean mastering it. It means knowing what's out there so you're not caught off guard by the hills or the hazards you could have seen coming into play.",
      "Scope the terrain. Before making your next move."
    ],
    consider: [
      "Do I understand the graduated tax scale and the basic rules that affect me?",
      "Am I aware of all the benefits available through my employer?",
      "Do I know how interest rates affect my debts or savings or bond values?",
      "What parts of the financial landscape feel foreign?"
    ],
    scorecardConnections: [
      {
        "num": "4",
        "title": "Protection"
      },
      {
        "num": "5",
        "title": "Benefits"
      },
      {
        "num": "8",
        "title": "Taxes"
      }
    ],
    notesPrompt: "what parts of your money matters landscape feel unclear or unfamiliar?"
  },
  {
    id: 3,
    slug: "forces",
    title: "Forces",
    subtitle: "what's acting on you",
    whatThisMeans: [
      "Forces are everything external that's acting on your terrain. From the common little things — like family and job/career responsibilities — to the quite large ones — like leases and loans. Like a mortgage. Like Time itself.",
      "Such forces are the pressures, obligations, and dynamics that are actively shaping your financial life. Whether you know it or choose them. Or not.",
      "Naming them is an easy first step toward managing them. Instead of being managed by them. May the Forces be with You and not against."
    ],
    consider: [
      "Which of my financial obligations are non-negotiable right now?",
      "Are there commitments I've made that I don't fully understand?",
      "Who or what has the most pull on my financial decisions?",
      "What forces am I ignoring that I probably shouldn't be?"
    ],
    scorecardConnections: [
      {
        "num": "3",
        "title": "Debts"
      },
      {
        "num": "4",
        "title": "Protection"
      },
      {
        "num": "7",
        "title": "Cash Flow"
      }
    ],
    notesPrompt: "what forces are acting on your financial life — seen or unseen?"
  },
  {
    id: 4,
    slug: "questions",
    title: "Questions",
    subtitle: "what matters now",
    whatThisMeans: [
      "The questions you carry are data that matter as much to your success as understanding the answers they will bring.",
      "The money matters that you're unsure about, the ones that keep surfacing, and the others you've been meaning to figure out? Those recurrences aren't signs of failure, but they do suggest a lack of familiarity.",
      "Does the legend to your treasure map identify all the symbols and icons on the terrain you're traveling? Together, those items are the Key.",
      "Knowing what's out there turns vague unease into actionable inquiry."
    ],
    consider: [
      "What financial question have I put off the longest?",
      "What have I agreed to that I don't fully understand?",
      "What decision is coming that I feel less-than-prepared for?",
      "What term or concept do I most want explained in plain language?"
    ],
    scorecardConnections: [
      {
        "num": "12",
        "title": "Choices"
      },
      {
        "num": "18",
        "title": "Clarity"
      },
      {
        "num": "1 - 18",
        "title": "All: Fair Game"
      }
    ],
    notesPrompt: "write your real questions here. no filter needed."
  },
  {
    id: 5,
    slug: "pace",
    title: "Pace",
    subtitle: "where tempo ties in",
    whatThisMeans: [
      "Financial life has its own peculiar rhythms over the course of time. Monthly cash flow, annual taxes, long-term savings horizons, and once-in-a-generation decisions.",
      "Pace is about understanding the timing of things. Moving too fast invites mistakes. Moving too slow invites costs.",
      "Knowing your pace lets you recognize when to make changes that make sense, and provides time for you to make sense as things change. Which is a solid way to face meaningful decisions."
    ],
    consider: [
      "Am I making decisions reactively in haste… or deliberately?",
      "What decisions feel urgent that might actually have more time?",
      "What have I delayed that's actually time-sensitive?",
      "Do I know the rhythm of my own financial calendar?"
    ],
    scorecardConnections: [
      {
        "num": "6",
        "title": "Savings"
      },
      {
        "num": "11",
        "title": "Timing"
      },
      {
        "num": "15",
        "title": "Lifestyle"
      }
    ],
    notesPrompt: "where is your pace off? too fast? too slow? unclear?"
  },
  {
    id: 6,
    slug: "options",
    title: "Options",
    subtitle: "how to scan for lines",
    whatThisMeans: [
      "A good caddy scopes the course to identify more than one route to consider before recommending a line.",
      "It is important to isolate the options that are actually available to you today. These represent the only choices you have, even when they're not obvious.",
      "Financial Orientation helps you surface those options with clarity and purpose. It won't choose which one is best for you. But your recognition of them will enable you to know that your decision is well informed.",
      "Make sure you're choosing from a fully legible menu. Use your 'readers' first."
    ],
    consider: [
      "In my biggest financial decisions: did I know all my options?",
      "Where am I proceeding by default rather than by choice?",
      "Any alternatives I didn't explore because I only later learned they existed?",
      "Where do I feel stuck with no good path forward?"
    ],
    scorecardConnections: [
      {
        "num": "12",
        "title": "Choices"
      },
      {
        "num": "14",
        "title": "Purchases"
      },
      {
        "num": "17",
        "title": "Volatility"
      }
    ],
    notesPrompt: "are you making choices unaware of all options? ever do so in the past?"
  },
  {
    id: 7,
    slug: "readiness",
    title: "Readiness",
    subtitle: "when clarity compounds",
    whatThisMeans: [
      "Readiness isn't urgency. It's the quiet signal that you're properly equipped and aligned. That it's the right time to proceed.",
      "Reacting to felt pressure and acting with purpose are different states. Pressure comes from outside. Readiness comes from within. One pushes. The other pulls.",
      "When you've considered Elements 1–6, something shifts. You can see through the fog well enough to move with intention rather than reaction. Not with confusion. With clarity.",
      "Readiness is: when you see clearly and start choosing."
    ],
    consider: [
      "What would 'ready enough' actually feel like for me?",
      "What's the one thing standing between me and forward movement?",
      "What do I need to understand before I can act with confidence?",
      "Am I waiting for certainty? Or am I actually already ready?"
    ],
    scorecardConnections: [
      {
        "num": "13",
        "title": "Investing"
      },
      {
        "num": "18",
        "title": "Clarity"
      },
      {
        "num": "1 - 18",
        "title": "All: Fair Game"
      }
    ],
    notesPrompt: "what would readiness look and feel like for you right now?"
  }
]

export default elements