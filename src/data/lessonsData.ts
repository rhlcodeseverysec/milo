import { LessonInfo, ChallengeInfo } from '../types';

export const ALL_LESSONS: LessonInfo[] = [
  {
    id: 1,
    title: 'Supermarket Quest',
    subtitle: 'A Day at Green Valley Market',
    description: 'Help Sam and Milo organize a shopping list, budget within ₹100, speak politely to shopkeepers, and checkout safely.',
    location: 'Green Valley Supermarket',
    icon: '🛒',
    color: '#58CC02',
    badge: 'Lesson 1',
    totalChallenges: 7,
    breakTitle: 'Hydration & Energy Break!',
    breakPrompt: 'Super job finishing the Supermarket Quest! 💧 Milo says: Go drink a fresh, cool glass of water, do 3 giant puppy stretches, and come right back feeling energized!',
    breakAction: 'Drink a glass of water & stretch',
    breakIcon: '🥤',
    breakAudioText: 'Awesome job completing the Supermarket Quest! Go drink a cool glass of water, stretch your arms high like Milo, and come back ready!',
    memoryPairs: [
      { id: 'apple', name: 'Fresh Apple', icon: '🍎', funFact: 'Crisp, sweet, and healthy!' },
      { id: 'milk', name: 'Milk Carton', icon: '🥛', funFact: 'Cold dairy for strong bones!' },
      { id: 'bread', name: 'Wheat Bread', icon: '🍞', funFact: 'Warm and golden from bakery!' },
      { id: 'banana', name: 'Ripe Bananas', icon: '🍌', funFact: 'Great energy for adventures!' }
    ]
  },
  {
    id: 2,
    title: 'Sunny Park Adventure',
    subtitle: 'Fun at the Neighborhood Park',
    description: 'Pack outdoor essentials, take turns on the playground swings, manage snack sharing, and solve a lost toy puzzle.',
    location: 'Sunny Meadows Community Park',
    icon: '🌳',
    color: '#1CB0F6',
    badge: 'Lesson 2',
    totalChallenges: 7,
    breakTitle: 'High-Five Victory & Share!',
    breakPrompt: 'Hooray! You completed the Sunny Park Adventure! 🌟 Milo says: Go give your mom, dad, or guardian a huge high-five, tell them your park victory, and take 3 deep superhero breaths!',
    breakAction: 'Give a high-five & tell a victory story',
    breakIcon: '✋',
    breakAudioText: 'Hooray! You conquered the Sunny Park Adventure! Go give someone a happy high-five, tell them what you learned, and take three deep breaths!',
    memoryPairs: [
      { id: 'tree', name: 'Oak Tree', icon: '🌳', funFact: 'Gives cool shade at the park!' },
      { id: 'butterfly', name: 'Butterfly', icon: '🦋', funFact: 'Flutters gently near flowers!' },
      { id: 'ball', name: 'Soccer Ball', icon: '⚽', funFact: 'Fun to kick and pass with friends!' },
      { id: 'kite', name: 'Colorful Kite', icon: '🪁', funFact: 'Soars high in breezy skies!' }
    ]
  },
  {
    id: 3,
    title: 'Library Explorer',
    subtitle: 'The Magical Neighborhood Library',
    description: 'Learn quiet indoor voices, sort books by colorful covers, borrow with your library card, and assist the friendly librarian.',
    location: 'Discovery Corner Library',
    icon: '📚',
    color: '#FF9600',
    badge: 'Lesson 3',
    totalChallenges: 7,
    breakTitle: 'Eye-Rest & Sky Stretch!',
    breakPrompt: 'Magnificent work, Master Reader! 🌈 Milo says: Rest your eyes by looking out the window for 20 seconds at something green, give someone a warm smile, and stretch your paws up to the sky!',
    breakAction: 'Look at something green & smile',
    breakIcon: '🌿',
    breakAudioText: 'Magnificent work exploring the library! Rest your eyes by looking out the window, give someone a warm smile, and stretch up tall!',
    memoryPairs: [
      { id: 'book', name: 'Storybook', icon: '📚', funFact: 'Filled with amazing tales!' },
      { id: 'glasses', name: 'Reading Glasses', icon: '👓', funFact: 'Helps us read clearly!' },
      { id: 'bookmark', name: 'Ribbon Bookmark', icon: '🔖', funFact: 'Saves your favorite page!' },
      { id: 'owl', name: 'Wise Owl', icon: '🦉', funFact: 'The quiet guardian of books!' }
    ]
  }
];

export const PARK_CHALLENGES_INFO: ChallengeInfo[] = [
  {
    id: 1,
    title: "Packing the Park Bag",
    category: "Sequencing & Routine",
    storyContext: "Before heading out to Sunny Meadows Park, Sam and Milo need to pack the right items in order.",
    storyImage: "backpack"
  },
  {
    id: 2,
    title: "Swing Counting Math",
    category: "Mathematics",
    storyContext: "At the swing set, Sam counts 3 blue swings and 2 yellow swings. Let's find how many swings are in total.",
    storyImage: "swings"
  },
  {
    id: 3,
    title: "Park Snack Sharing",
    category: "Budgeting & Sharing",
    storyContext: "Sam has ₹50 for healthy park snacks. Pick apple juice and whole grain crackers without going over budget.",
    storyImage: "snack"
  },
  {
    id: 4,
    title: "Waiting for the Big Slide",
    category: "Emotional Understanding",
    storyContext: "There is a line for the popular spiral slide. Sam feels impatient. What is the calm and friendly choice?",
    storyImage: "slide"
  },
  {
    id: 5,
    title: "Asking to Share the Sandbox",
    category: "Polite Communication",
    storyContext: "Another child has red sand shovels. Sam wants to build a sandcastle together. How to ask politely?",
    storyImage: "sandbox"
  },
  {
    id: 6,
    title: "Milo's Lost Rubber Ball",
    category: "Problem Solving",
    storyContext: "Milo's rubber play ball rolled under the park picnic bench. How should Sam safely retrieve it?",
    storyImage: "ball"
  },
  {
    id: 7,
    title: "Grand Park Picnic Finale",
    category: "Integrated Mission",
    storyContext: "Time to set up the picnic mat, share snacks with friends, put trash in the recycling bin, and celebrate!",
    storyImage: "picnic"
  }
];

export const LIBRARY_CHALLENGES_INFO: ChallengeInfo[] = [
  {
    id: 1,
    title: "Library Entry Routine",
    category: "Sequencing & Rules",
    storyContext: "Sam and Milo step inside the Discovery Corner Library. Follow the calm entrance routine.",
    storyImage: "doors"
  },
  {
    id: 2,
    title: "Book Shelf Math",
    category: "Mathematics",
    storyContext: "Sam finds 2 adventure books and 3 dinosaur books on the shelf. Let's calculate the total books!",
    storyImage: "books"
  },
  {
    id: 3,
    title: "Borrowing Limit Allowance",
    category: "Budgeting & Rules",
    storyContext: "Each reader can borrow up to 4 items on their library card. Pick your favorite books within the limit.",
    storyImage: "card"
  },
  {
    id: 4,
    title: "Soft Indoor Whispers",
    category: "Sensory & Emotional",
    storyContext: "The library is quiet. Sam wants to tell Milo about a cool illustration. How should Sam use their voice?",
    storyImage: "whisper"
  },
  {
    id: 5,
    title: "Asking the Friendly Librarian",
    category: "Polite Communication",
    storyContext: "Sam is looking for the animal encyclopedia. How should Sam ask Ms. Tara the librarian politely?",
    storyImage: "librarian"
  },
  {
    id: 6,
    title: "Gently Handling Dropped Books",
    category: "Problem Solving",
    storyContext: "A picture book slipped off the study table onto the rug. What is the kind and gentle way to fix it?",
    storyImage: "book-care"
  },
  {
    id: 7,
    title: "Library Master Checkout",
    category: "Integrated Mission",
    storyContext: "Scan your library card, thank the librarian, place books neatly in the tote bag, and earn your Golden Reader Badge!",
    storyImage: "badge"
  }
];
