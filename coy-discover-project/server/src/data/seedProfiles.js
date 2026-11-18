const people = [
  ["Aarav",24,"Adventure seeker, chai enthusiast and weekend explorer.","Delhi","Hiking, Coffee, Travel"],
  ["Ishita",22,"Collecting little moments and big stories.","Jaipur","Photography, Art, Music"],
  ["Kabir",25,"Software engineer by day, guitarist by night.","Chandigarh","Music, Coding, Trekking"],
  ["Ananya",23,"Books, sunsets and spontaneous road trips.","Lucknow","Books, Travel, Food"],
  ["Rohan",26,"Fitness, films and finding the best street food.","Mumbai","Fitness, Movies, Food"],
  ["Meera",22,"Artist who believes every day needs a little colour.","Pune","Painting, Museums, Coffee"],
  ["Vivaan",24,"Always planning the next mountain escape.","Dehradun","Trekking, Nature, Running"],
  ["Sana",23,"Dancing through life, one playlist at a time.","Bengaluru","Dance, Music, Cooking"],
  ["Aditya",25,"Curious mind. Kind heart. Terrible at bowling.","Noida","Bowling, Tech, Cricket"],
  ["Diya",21,"Trying new cafes and making new memories.","Mathura","Cafe hopping, Fashion, Travel"],
  ["Arjun",27,"A little nerdy, a lot outdoorsy.","Gurugram","Cycling, Startups, Hiking"],
  ["Kiara",24,"Film camera in my bag, curiosity in my head.","Delhi","Photography, Films, Design"],
  ["Reyansh",23,"Foodie with an unreasonable love for dogs.","Agra","Food, Dogs, Football"],
  ["Myra",25,"Doodling, journaling and chasing sunsets.","Jaipur","Writing, Art, Yoga"],
  ["Dev",26,"Building things and exploring places.","Hyderabad","Technology, Travel, Chess"],
  ["Aanya",22,"Making playlists for people I like.","Chandigarh","Music, Reading, Baking"],
  ["Neil",24,"Weekend runner and weekday dreamer.","Pune","Running, Coffee, Movies"],
  ["Tara",23,"Nature lover with a city-girl schedule.","Mumbai","Nature, Fashion, Food"],
  ["Krish",25,"Can talk about cricket for hours.","Lucknow","Cricket, Gaming, Fitness"],
  ["Riya",24,"Here for genuine conversations and good coffee.","Noida","Coffee, Books, Travel"],
  ["Samarth",22,"Learning something new every single day.","Bengaluru","Coding, Music, Hiking"],
  ["Naina",26,"Avid traveller. Amateur chef.","Dehradun","Travel, Cooking, Trekking"],
  ["Yash",23,"I take my board games very seriously.","Delhi","Board games, Movies, Food"],
  ["Avni",21,"Sunshine mixed with a little bit of sarcasm.","Mathura","Dance, Art, Cafes"],
  ["Dhruv",27,"Mountains over malls, always.","Shimla","Trekking, Photography, Cycling"],
  ["Pihu",22,"A playlist and a long drive fix everything.","Agra","Music, Travel, Dogs"],
  ["Kunal",24,"Trying to become a better cook.","Gurugram","Cooking, Football, Tech"],
  ["Zoya",25,"Designing things and collecting experiences.","Mumbai","Design, Museums, Travel"],
  ["Manav",23,"Quiet at first, funny after coffee.","Pune","Coffee, Chess, Reading"],
  ["Aditi",24,"Looking for someone to explore the city with.","Jaipur","Food, Art, Cycling"]
];

const photos = [
  "photo-1500648767791-00dcc994a43e","photo-1534528741775-53994a69daeb",
  "photo-1506794778202-cad84cf45f1d","photo-1524504388940-b1c1722653e1",
  "photo-1507003211169-0a1dd7228f2d","photo-1531123897727-8f129e1688ce",
  "photo-1506794778202-cad84cf45f1d","photo-1529139574466-a303027c1d8b"
];

export const seedProfiles = people.map((p, i) => ({
  name: p[0],
  age: p[1],
  bio: p[2],
  location: p[3],
  interests: p[4].split(", "),
  photo: `https://images.unsplash.com/${photos[i % photos.length]}?auto=format&fit=crop&w=900&q=85`,
  // Seed reciprocal-like opportunities for the demo user.
  likedBy: [2, 5, 9, 14, 20, 27].includes(i) ? ["demo-user"] : []
}));
