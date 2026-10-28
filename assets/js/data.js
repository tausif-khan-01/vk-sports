/* VK Sports — store config and catalogue.
   Edit this file to change contact details, prices, or add products. */
window.VK = window.VK || {};

VK.config = {
  brand: 'VK Sports',
  whatsapp: '918010405546',          // country code + number, digits only
  whatsappDisplay: '+91 80104 05546',
  email: 'info@vksports.in',
  address: 'Parbhani, Maharashtra, India',
  hours: 'Mon – Sat: 9AM – 7PM',
  social: { instagram: '#', facebook: '#', youtube: '#' },
};

VK.sports = [
  { key: 'cricket',    label: 'Cricket' },
  { key: 'football',   label: 'Football' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'running',    label: 'Running' },
  { key: 'gym',        label: 'Gym & Training' },
  { key: 'kabaddi',    label: 'Kabaddi' },
  { key: 'volleyball', label: 'Volleyball' },
  { key: 'custom',     label: 'Custom Teamwear' },
];

VK.colours = {
  blue:  { label: 'Royal Blue', hex: '#1E5BFF' },
  red:   { label: 'Fire Red',   hex: '#E31B23' },
  green: { label: 'Volt Green', hex: '#24D653' },
};

VK.fabrics = ['Dri-Fit Polyester', 'Micro Mesh', 'Lycra Blend'];

/* Shown on product pages — check these match your actual fabrics */
VK.fabricInfo = {
  'Dri-Fit Polyester': 'Lightweight polyester that pulls sweat away from the skin and dries fast, so you stay cool through long innings and matches.',
  'Micro Mesh': 'Fine, breathable mesh knit with maximum airflow — ideal for high-intensity games like football and basketball.',
  'Lycra Blend': 'Polyester with added stretch for a close, flexible fit that moves with you in contact sports and training.',
};
VK.care = ['Machine wash cold, inside out', 'Do not bleach', 'Do not iron directly on prints', 'Line dry in shade'];

/* Chest / length in inches — used on product pages and the FAQ size guide */
VK.sizeChart = {
  XS: [34, 26], S: [36, 27], M: [38, 28], L: [40, 29], XL: [42, 30], XXL: [44, 31], '3XL': [46, 32],
};
VK.sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

/* "Teams we've kitted" strip on the homepage.
   PLACEHOLDER TEAMS — replace with clubs/schools you've actually supplied (and have permission to name).
   To use a real logo, add  logo: 'assets/img/teams/your-team.png'  and it replaces the drawn crest. */
VK.teams = [
  { name: 'Parbhani Strikers',   sport: 'Cricket',    colours: ['#1E5BFF', '#F5F7FA'] },
  { name: 'Marathwada FC',       sport: 'Football',   colours: ['#E31B23', '#111418'] },
  { name: 'Sunrise Public School', sport: 'Athletics', colours: ['#FACC15', '#0B1F4B'] },
  { name: 'Jintur Raiders',      sport: 'Kabaddi',    colours: ['#F97316', '#111418'] },
  { name: 'Latur Smashers',      sport: 'Volleyball', colours: ['#7C3AED', '#F5F7FA'] },
  { name: 'Nanded Warriors',     sport: 'Cricket',    colours: ['#0F6B3A', '#FACC15'] },
  { name: 'Hingoli Hoopers',     sport: 'Basketball', colours: ['#111418', '#24D653'] },
  { name: 'Purna Sports Club',   sport: 'Football',   colours: ['#7A1222', '#F5F7FA'] },
];

const IMG = {
  blue:    'assets/img/jersey-blue.webp',
  red:     'assets/img/jersey-red.webp',
  red2:    'assets/img/jersey-red-2.webp',
  green:   'assets/img/jersey-green.webp',
  stadium: 'assets/img/jersey-blue-stadium.webp',
};

/* type: 'team' = suited to bulk/team orders, 'individual' = single buyers.
   rating/reviews are placeholders — replace with real numbers before launch. */
VK.products = [
  {
    id: 'cricket-pro', name: 'Cricket Jersey – Pro Series', sport: 'cricket',
    type: ['team', 'individual'], fabric: 'Dri-Fit Polyester',
    price: 699, mrp: 899, rating: 4.5, reviews: 120, bestseller: true, badge: 'Bestseller',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [{ key: 'blue', img: IMG.blue }, { key: 'red', img: IMG.red }, { key: 'green', img: IMG.green }],
  },
  {
    id: 'football-strike', name: 'Football Jersey – Strike', sport: 'football',
    type: ['team', 'individual'], fabric: 'Micro Mesh',
    price: 649, mrp: 899, rating: 4.4, reviews: 98, bestseller: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colours: [{ key: 'red', img: IMG.red }, { key: 'blue', img: IMG.blue }, { key: 'green', img: IMG.green }],
  },
  {
    id: 'custom-name-number', name: 'Custom Name & Number Jersey', sport: 'custom',
    type: ['team'], fabric: 'Dri-Fit Polyester',
    price: 799, mrp: 999, rating: 4.8, reviews: 75, bestseller: true, badge: 'Personalise',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    colours: [{ key: 'blue', img: IMG.blue }, { key: 'red', img: IMG.red2 }, { key: 'green', img: IMG.green }],
  },
  {
    id: 'training-volt', name: 'Training Tee – Volt', sport: 'gym',
    type: ['individual'], fabric: 'Lycra Blend',
    price: 549, mrp: 699, rating: 4.3, reviews: 60, bestseller: true, badge: 'New',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [{ key: 'green', img: IMG.green }, { key: 'blue', img: IMG.blue }],
  },
  {
    id: 'football-inferno', name: 'Football Jersey – Inferno', sport: 'football',
    type: ['team', 'individual'], fabric: 'Micro Mesh',
    price: 749, mrp: 999, rating: 4.6, reviews: 54, bestseller: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [{ key: 'red', img: IMG.red2 }],
  },
  {
    id: 'running-dash', name: 'Running T-Shirt – Dash', sport: 'running',
    type: ['individual'], fabric: 'Dri-Fit Polyester',
    price: 499, mrp: 699, rating: 4.2, reviews: 41, bestseller: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colours: [{ key: 'blue', img: IMG.blue }, { key: 'green', img: IMG.green }],
  },
  {
    id: 'kabaddi-raid', name: 'Kabaddi Jersey – Raid', sport: 'kabaddi',
    type: ['team'], fabric: 'Lycra Blend',
    price: 699, mrp: 899, rating: 4.5, reviews: 33,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [{ key: 'red', img: IMG.red2 }, { key: 'green', img: IMG.green }],
  },
  {
    id: 'volleyball-spike', name: 'Volleyball Jersey – Spike', sport: 'volleyball',
    type: ['team'], fabric: 'Micro Mesh',
    price: 649, mrp: 849, rating: 4.4, reviews: 29,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colours: [{ key: 'blue', img: IMG.blue }, { key: 'red', img: IMG.red }],
  },
  {
    id: 'basketball-dunk', name: 'Basketball Shooting Shirt – Dunk', sport: 'basketball',
    type: ['team', 'individual'], fabric: 'Micro Mesh',
    price: 599, mrp: 799, rating: 4.3, reviews: 22,
    sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
    colours: [{ key: 'red', img: IMG.red2 }, { key: 'blue', img: IMG.blue }],
  },
];
