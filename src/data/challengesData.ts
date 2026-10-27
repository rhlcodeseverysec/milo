export interface ChallengeInfo {
  id: number;
  title: string;
  category: string;
  storyContext: string;
  storyImage: string;
  hint?: string;
}

export const MARKET_CHALLENGES_INFO: ChallengeInfo[] = [
  {
    id: 1,
    title: "Getting Ready to Shop",
    category: "Sequencing & Planning",
    storyContext: "Sam arrives at the lively Green Valley Market. Before buying anything, Sam needs to follow the right shopping routine.",
    storyImage: "basket"
  },
  {
    id: 2,
    title: "Item Pricing & Total",
    category: "Mathematics",
    storyContext: "Sam has picked up fresh apples, a carton of milk, and warm whole wheat bread. Let's calculate the total cost.",
    storyImage: "calculator"
  },
  {
    id: 3,
    title: "Market Budgeting",
    category: "Budgeting & Math",
    storyContext: "Sam has a ₹100 note in pocket. Help Sam choose delicious items from the market stalls without exceeding the budget.",
    storyImage: "wallet"
  },
  {
    id: 4,
    title: "Emotional Understanding",
    category: "Empathy & Awareness",
    storyContext: "Near the fruit stall, Sam notices another child sitting alone on a bench, looking upset and holding a dropped list.",
    storyImage: "heart"
  },
  {
    id: 5,
    title: "Asking for Help",
    category: "Polite Communication",
    storyContext: "The market aisles are bustling with fresh stalls. Sam is looking for the bakery section to find fresh bread.",
    storyImage: "message"
  },
  {
    id: 6,
    title: "Problem Solving",
    category: "Flexible Thinking",
    storyContext: "Sam reaches the dairy cooler, but the shelf is empty — the shop has temporarily run out of fresh milk cartons.",
    storyImage: "lightbulb"
  },
  {
    id: 7,
    title: "Final Market Mission",
    category: "Integrated Mission",
    storyContext: "Time to complete the entire market adventure! Let's put everything Sam learned together to successfully check out.",
    storyImage: "award"
  }
];

export interface BudgetMarketItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: string;
}

export const BUDGET_ITEMS: BudgetMarketItem[] = [
  { id: 'b-apple', name: 'Fresh Apples (Bag)', price: 20, icon: '🍎', category: 'Fruits' },
  { id: 'b-milk', name: 'Milk Carton', price: 30, icon: '🥛', category: 'Dairy' },
  { id: 'b-bread', name: 'Whole Wheat Bread', price: 25, icon: '🍞', category: 'Bakery' },
  { id: 'b-banana', name: 'Ripe Bananas (Bunch)', price: 15, icon: '🍌', category: 'Fruits' },
  { id: 'b-eggs', name: 'Farm Eggs (6-pack)', price: 35, icon: '🥚', category: 'Dairy' },
  { id: 'b-honey', name: 'Wild Honey Jar', price: 40, icon: '🍯', category: 'Pantry' },
  { id: 'b-carrots', name: 'Crisp Carrots', price: 20, icon: '🥕', category: 'Vegetables' },
  { id: 'b-juice', name: 'Fresh Orange Juice', price: 25, icon: '🍊', category: 'Drinks' },
];
