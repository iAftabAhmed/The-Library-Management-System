#!/usr/bin/env node
/**
 * Builds migrations/0002_library.sql for the EF101-P15 library.
 * Bibliographic rows are an original demonstration catalog of well-known
 * published works (title, author, year, subject). ISBN values are synthetic
 * (DEM-####) and are not registered ISBNs. Member names are fictional.
 *
 * Run: node scripts/generate-library-seed.mjs
 */
import { writeFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

const CATEGORIES = {
  CS: "Computer Science",
  MA: "Mathematics",
  PH: "Physics",
  LI: "Literature",
  HI: "History",
  BI: "Biology",
  EC: "Economics",
  PL: "Philosophy",
  EN: "Engineering",
  PS: "Psychology",
};

/** category key, title, author, year */
const BOOKS = [
  ["CS", "The Art of Computer Programming", "Donald Knuth", 1968],
  ["CS", "Introduction to Algorithms", "Thomas Cormen, Charles Leiserson, Ronald Rivest, Clifford Stein", 2009],
  ["CS", "Structure and Interpretation of Computer Programs", "Harold Abelson, Gerald Sussman", 1996],
  ["CS", "Design Patterns", "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides", 1994],
  ["CS", "Clean Code", "Robert C. Martin", 2008],
  ["CS", "The Pragmatic Programmer", "Andrew Hunt, David Thomas", 1999],
  ["CS", "Code: The Hidden Language of Computer Hardware and Software", "Charles Petzold", 1999],
  ["CS", "Computer Networks", "Andrew Tanenbaum, David Wetherall", 2011],
  ["CS", "Operating System Concepts", "Abraham Silberschatz, Peter Galvin, Greg Gagne", 2018],
  ["CS", "Database System Concepts", "Abraham Silberschatz, Henry Korth, S. Sudarshan", 2019],
  ["CS", "Artificial Intelligence: A Modern Approach", "Stuart Russell, Peter Norvig", 2020],
  ["CS", "Deep Learning", "Ian Goodfellow, Yoshua Bengio, Aaron Courville", 2016],
  ["CS", "The Mythical Man-Month", "Frederick Brooks", 1995],
  ["CS", "Compilers: Principles, Techniques, and Tools", "Alfred Aho, Monica Lam, Ravi Sethi, Jeffrey Ullman", 2006],
  ["CS", "Concrete Mathematics", "Ronald Graham, Donald Knuth, Oren Patashnik", 1994],
  ["CS", "Algorithms", "Robert Sedgewick, Kevin Wayne", 2011],
  ["CS", "Computer Organization and Design", "David Patterson, John Hennessy", 2017],
  ["CS", "The C Programming Language", "Brian Kernighan, Dennis Ritchie", 1988],
  ["CS", "Designing Data-Intensive Applications", "Martin Kleppmann", 2017],
  ["CS", "Code Complete", "Steve McConnell", 2004],
  ["CS", "Godel, Escher, Bach", "Douglas Hofstadter", 1979],
  ["CS", "The Algorithm Design Manual", "Steven Skiena", 2008],
  ["CS", "Computer Systems: A Programmer's Perspective", "Randal Bryant, David O'Hallaron", 2015],
  ["CS", "Introduction to the Theory of Computation", "Michael Sipser", 2012],
  ["MA", "A Mathematician's Apology", "G. H. Hardy", 1940],
  ["MA", "How to Prove It", "Daniel Velleman", 2019],
  ["MA", "Calculus", "James Stewart", 2015],
  ["MA", "Linear Algebra Done Right", "Sheldon Axler", 2015],
  ["MA", "Principles of Mathematical Analysis", "Walter Rudin", 1976],
  ["MA", "Abstract Algebra", "David Dummit, Richard Foote", 2003],
  ["MA", "Elementary Number Theory", "David Burton", 2010],
  ["MA", "Discrete Mathematics and Its Applications", "Kenneth Rosen", 2018],
  ["MA", "Flatland", "Edwin A. Abbott", 1884],
  ["MA", "Journey through Genius", "William Dunham", 1990],
  ["MA", "The Music of the Primes", "Marcus du Sautoy", 2003],
  ["MA", "Fermat's Enigma", "Simon Singh", 1997],
  ["MA", "Infinite Powers", "Steven Strogatz", 2019],
  ["MA", "A Book of Abstract Algebra", "Charles Pinter", 1982],
  ["MA", "Topology", "James Munkres", 2000],
  ["MA", "What Is Mathematics?", "Richard Courant, Herbert Robbins", 1941],
  ["MA", "Euclid's Elements", "Euclid", -300],
  ["MA", "The Princeton Companion to Mathematics", "Timothy Gowers", 2008],
  ["MA", "Naive Set Theory", "Paul Halmos", 1960],
  ["MA", "A First Course in Probability", "Sheldon Ross", 2019],
  ["MA", "Numerical Analysis", "Richard Burden, J. Douglas Faires", 2015],
  ["MA", "Graph Theory", "Reinhard Diestel", 2017],
  ["PH", "The Feynman Lectures on Physics", "Richard Feynman, Robert Leighton, Matthew Sands", 1964],
  ["PH", "Six Easy Pieces", "Richard Feynman", 1994],
  ["PH", "A Brief History of Time", "Stephen Hawking", 1988],
  ["PH", "The Elegant Universe", "Brian Greene", 1999],
  ["PH", "Cosmos", "Carl Sagan", 1980],
  ["PH", "Introduction to Electrodynamics", "David Griffiths", 2017],
  ["PH", "Classical Mechanics", "John R. Taylor", 2005],
  ["PH", "Introduction to Quantum Mechanics", "David Griffiths", 2018],
  ["PH", "An Introduction to Thermal Physics", "Daniel Schroeder", 2000],
  ["PH", "Astrophysics for People in a Hurry", "Neil deGrasse Tyson", 2017],
  ["PH", "The Order of Time", "Carlo Rovelli", 2018],
  ["PH", "Seven Brief Lessons on Physics", "Carlo Rovelli", 2014],
  ["PH", "Relativity: The Special and the General Theory", "Albert Einstein", 1916],
  ["PH", "The Character of Physical Law", "Richard Feynman", 1965],
  ["PH", "Optics", "Eugene Hecht", 2016],
  ["PH", "University Physics", "Hugh Young, Roger Freedman", 2019],
  ["PH", "The First Three Minutes", "Steven Weinberg", 1977],
  ["PH", "Black Holes and Time Warps", "Kip Thorne", 1994],
  ["PH", "Surely You're Joking, Mr. Feynman", "Richard Feynman", 1985],
  ["PH", "The Theoretical Minimum", "Leonard Susskind, George Hrabovsky", 2013],
  ["PH", "QED: The Strange Theory of Light and Matter", "Richard Feynman", 1985],
  ["PH", "The Road to Reality", "Roger Penrose", 2004],
  ["LI", "Pride and Prejudice", "Jane Austen", 1813],
  ["LI", "Great Expectations", "Charles Dickens", 1861],
  ["LI", "Jane Eyre", "Charlotte Bronte", 1847],
  ["LI", "Wuthering Heights", "Emily Bronte", 1847],
  ["LI", "Moby-Dick", "Herman Melville", 1851],
  ["LI", "The Odyssey", "Homer", -700],
  ["LI", "Hamlet", "William Shakespeare", 1603],
  ["LI", "Things Fall Apart", "Chinua Achebe", 1958],
  ["LI", "One Hundred Years of Solitude", "Gabriel Garcia Marquez", 1967],
  ["LI", "Beloved", "Toni Morrison", 1987],
  ["LI", "The God of Small Things", "Arundhati Roy", 1997],
  ["LI", "Midnight's Children", "Salman Rushdie", 1981],
  ["LI", "The Kite Runner", "Khaled Hosseini", 2003],
  ["LI", "A Passage to India", "E. M. Forster", 1924],
  ["LI", "Crime and Punishment", "Fyodor Dostoevsky", 1866],
  ["LI", "The Metamorphosis", "Franz Kafka", 1915],
  ["LI", "To the Lighthouse", "Virginia Woolf", 1927],
  ["LI", "Their Eyes Were Watching God", "Zora Neale Hurston", 1937],
  ["LI", "The Old Man and the Sea", "Ernest Hemingway", 1952],
  ["LI", "Invisible Man", "Ralph Ellison", 1952],
  ["LI", "Season of Migration to the North", "Tayeb Salih", 1966],
  ["LI", "The Cairo Trilogy", "Naguib Mahfouz", 1956],
  ["LI", "A Thousand Splendid Suns", "Khaled Hosseini", 2007],
  ["LI", "The Reluctant Fundamentalist", "Mohsin Hamid", 2007],
  ["HI", "Sapiens", "Yuval Noah Harari", 2011],
  ["HI", "Guns, Germs, and Steel", "Jared Diamond", 1997],
  ["HI", "The Silk Roads", "Peter Frankopan", 2015],
  ["HI", "A History of the Arab Peoples", "Albert Hourani", 1991],
  ["HI", "The Anarchy", "William Dalrymple", 2019],
  ["HI", "Empire of Cotton", "Sven Beckert", 2014],
  ["HI", "The History of the Peloponnesian War", "Thucydides", -400],
  ["HI", "The Muqaddimah", "Ibn Khaldun", 1377],
  ["HI", "Orientalism", "Edward Said", 1978],
  ["HI", "The Discovery of India", "Jawaharlal Nehru", 1946],
  ["HI", "A People's History of the United States", "Howard Zinn", 1980],
  ["HI", "The Second World War", "Winston Churchill", 1948],
  ["HI", "Postwar", "Tony Judt", 2005],
  ["HI", "The Rise and Fall of the Third Reich", "William Shirer", 1960],
  ["HI", "India After Gandhi", "Ramachandra Guha", 2007],
  ["HI", "The Crusades", "Thomas Asbridge", 2010],
  ["HI", "1491", "Charles Mann", 2005],
  ["HI", "The Age of Extremes", "Eric Hobsbawm", 1994],
  ["HI", "Destiny Disrupted", "Tamim Ansary", 2009],
  ["HI", "The Swerve", "Stephen Greenblatt", 2011],
  ["HI", "SPQR", "Mary Beard", 2015],
  ["HI", "The Great Partition", "Yasmin Khan", 2007],
  ["BI", "The Selfish Gene", "Richard Dawkins", 1976],
  ["BI", "The Origin of Species", "Charles Darwin", 1859],
  ["BI", "The Double Helix", "James Watson", 1968],
  ["BI", "Silent Spring", "Rachel Carson", 1962],
  ["BI", "The Immortal Life of Henrietta Lacks", "Rebecca Skloot", 2010],
  ["BI", "Campbell Biology", "Jane Reece, Lisa Urry, Michael Cain", 2016],
  ["BI", "Molecular Biology of the Cell", "Bruce Alberts", 2014],
  ["BI", "The Gene", "Siddhartha Mukherjee", 2016],
  ["BI", "Braiding Sweetgrass", "Robin Wall Kimmerer", 2013],
  ["BI", "The Sixth Extinction", "Elizabeth Kolbert", 2014],
  ["BI", "Lab Girl", "Hope Jahren", 2016],
  ["BI", "Why We Sleep", "Matthew Walker", 2017],
  ["BI", "The Emperor of All Maladies", "Siddhartha Mukherjee", 2010],
  ["BI", "Your Inner Fish", "Neil Shubin", 2008],
  ["BI", "The Botany of Desire", "Michael Pollan", 2001],
  ["BI", "The Hidden Life of Trees", "Peter Wohlleben", 2015],
  ["BI", "I Contain Multitudes", "Ed Yong", 2016],
  ["BI", "The Song of the Cell", "Siddhartha Mukherjee", 2022],
  ["BI", "Principles of Neural Science", "Eric Kandel", 2012],
  ["BI", "On Growth and Form", "D'Arcy Thompson", 1917],
  ["BI", "The Diversity of Life", "Edward O. Wilson", 1992],
  ["BI", "Life's Edge", "Carl Zimmer", 2021],
  ["EC", "The Wealth of Nations", "Adam Smith", 1776],
  ["EC", "Capital in the Twenty-First Century", "Thomas Piketty", 2013],
  ["EC", "Thinking, Fast and Slow", "Daniel Kahneman", 2011],
  ["EC", "Poor Economics", "Abhijit Banerjee, Esther Duflo", 2011],
  ["EC", "The General Theory of Employment, Interest and Money", "John Maynard Keynes", 1936],
  ["EC", "Freakonomics", "Steven Levitt, Stephen Dubner", 2005],
  ["EC", "Why Nations Fail", "Daron Acemoglu, James Robinson", 2012],
  ["EC", "Development as Freedom", "Amartya Sen", 1999],
  ["EC", "The Undercover Economist", "Tim Harford", 2005],
  ["EC", "Nudge", "Richard Thaler, Cass Sunstein", 2008],
  ["EC", "Doughnut Economics", "Kate Raworth", 2017],
  ["EC", "The Big Short", "Michael Lewis", 2010],
  ["EC", "Good Economics for Hard Times", "Abhijit Banerjee, Esther Duflo", 2019],
  ["EC", "Microeconomic Theory", "Andreu Mas-Colell, Michael Whinston, Jerry Green", 1995],
  ["EC", "Macroeconomics", "N. Gregory Mankiw", 2019],
  ["EC", "The Price of Inequality", "Joseph Stiglitz", 2012],
  ["EC", "Debt: The First 5000 Years", "David Graeber", 2011],
  ["EC", "Misbehaving", "Richard Thaler", 2015],
  ["EC", "The Economists' Hour", "Binyamin Appelbaum", 2019],
  ["EC", "Banker to the Poor", "Muhammad Yunus", 1999],
  ["EC", "Small Is Beautiful", "E. F. Schumacher", 1973],
  ["EC", "The Worldly Philosophers", "Robert Heilbroner", 1953],
  ["PL", "The Republic", "Plato", -375],
  ["PL", "Nicomachean Ethics", "Aristotle", -340],
  ["PL", "Meditations", "Marcus Aurelius", 180],
  ["PL", "Critique of Pure Reason", "Immanuel Kant", 1781],
  ["PL", "Thus Spoke Zarathustra", "Friedrich Nietzsche", 1883],
  ["PL", "Being and Time", "Martin Heidegger", 1927],
  ["PL", "The Second Sex", "Simone de Beauvoir", 1949],
  ["PL", "A Theory of Justice", "John Rawls", 1971],
  ["PL", "The Myth of Sisyphus", "Albert Camus", 1942],
  ["PL", "Zen and the Art of Motorcycle Maintenance", "Robert Pirsig", 1974],
  ["PL", "The Problems of Philosophy", "Bertrand Russell", 1912],
  ["PL", "Groundwork of the Metaphysics of Morals", "Immanuel Kant", 1785],
  ["PL", "Discourse on Method", "Rene Descartes", 1637],
  ["PL", "The Prince", "Niccolo Machiavelli", 1532],
  ["PL", "The Analects", "Confucius", -450],
  ["PL", "The Incoherence of the Philosophers", "Al-Ghazali", 1095],
  ["PL", "The Wretched of the Earth", "Frantz Fanon", 1961],
  ["PL", "Justice: What's the Right Thing to Do?", "Michael Sandel", 2009],
  ["PL", "The Structure of Scientific Revolutions", "Thomas Kuhn", 1962],
  ["PL", "Practical Ethics", "Peter Singer", 1979],
  ["PL", "Sophie's World", "Jostein Gaarder", 1991],
  ["PL", "Tao Te Ching", "Laozi", -400],
  ["EN", "Structures: Or Why Things Don't Fall Down", "J. E. Gordon", 1978],
  ["EN", "To Engineer Is Human", "Henry Petroski", 1985],
  ["EN", "The Design of Everyday Things", "Don Norman", 1988],
  ["EN", "Fundamentals of Electric Circuits", "Charles Alexander, Matthew Sadiku", 2016],
  ["EN", "Engineering Mechanics: Dynamics", "J. L. Meriam, L. G. Kraige", 2015],
  ["EN", "Materials Science and Engineering", "William Callister", 2018],
  ["EN", "Thermodynamics: An Engineering Approach", "Yunus Cengel, Michael Boles", 2014],
  ["EN", "Fluid Mechanics", "Frank White", 2015],
  ["EN", "Shigley's Mechanical Engineering Design", "Richard Budynas, Keith Nisbett", 2014],
  ["EN", "Introduction to Flight", "John Anderson", 2015],
  ["EN", "Control Systems Engineering", "Norman Nise", 2015],
  ["EN", "The Art of Electronics", "Paul Horowitz, Winfield Hill", 2015],
  ["EN", "Signals and Systems", "Alan Oppenheim, Alan Willsky", 1996],
  ["EN", "Renewable Energy", "Bent Sorensen", 2017],
  ["EN", "Sustainable Energy - without the Hot Air", "David MacKay", 2008],
  ["EN", "Engineering: A Very Short Introduction", "David Blockley", 2012],
  ["EN", "The Existential Pleasures of Engineering", "Samuel Florman", 1976],
  ["EN", "Skunk Works", "Ben Rich", 1994],
  ["EN", "Rocket Propulsion Elements", "George Sutton, Oscar Biblarz", 2016],
  ["EN", "Introduction to Environmental Engineering", "Mackenzie Davis, David Cornwell", 2012],
  ["EN", "Civil Engineering Materials", "Shan Somayaji", 2001],
  ["EN", "Feedback Control of Dynamic Systems", "Gene Franklin, J. David Powell, Abbas Emami-Naeini", 2018],
  ["PS", "Man's Search for Meaning", "Viktor Frankl", 1946],
  ["PS", "Influence", "Robert Cialdini", 1984],
  ["PS", "The Man Who Mistook His Wife for a Hat", "Oliver Sacks", 1985],
  ["PS", "Flow", "Mihaly Csikszentmihalyi", 1990],
  ["PS", "Cognitive Psychology", "Robert Sternberg", 2016],
  ["PS", "Psychology", "David Myers", 2018],
  ["PS", "The Body Keeps the Score", "Bessel van der Kolk", 2014],
  ["PS", "Quiet", "Susan Cain", 2012],
  ["PS", "Behave", "Robert Sapolsky", 2017],
  ["PS", "The Interpretation of Dreams", "Sigmund Freud", 1899],
  ["PS", "Attachment", "John Bowlby", 1969],
  ["PS", "Mindset", "Carol Dweck", 2006],
  ["PS", "Stumbling on Happiness", "Daniel Gilbert", 2006],
  ["PS", "The Social Animal", "Elliot Aronson", 1972],
  ["PS", "An Introduction to Social Psychology", "Miles Hewstone", 2012],
  ["PS", "Emotional Intelligence", "Daniel Goleman", 1995],
  ["PS", "The Righteous Mind", "Jonathan Haidt", 2012],
  ["PS", "Phantoms in the Brain", "V. S. Ramachandran", 1998],
  ["PS", "Lost Connections", "Johann Hari", 2018],
  ["PS", "Atomic Habits", "James Clear", 2018],
  ["PS", "The Happiness Hypothesis", "Jonathan Haidt", 2006],
  ["PS", "In the Realm of Hungry Ghosts", "Gabor Mate", 2008],
];

const MEMBERS = [
  ["M-1001", "Amina Rahman"],
  ["M-1002", "Bilal Hussain"],
  ["M-1003", "Chen Wei"],
  ["M-1004", "Dalia Okonkwo"],
  ["M-1005", "Ehsan Qureshi"],
  ["M-1006", "Fatima Noor"],
  ["M-1007", "Gabriel Ortiz"],
  ["M-1008", "Hira Siddiqui"],
  ["M-1009", "Ibrahim Diallo"],
  ["M-1010", "Jaspreet Kaur"],
  ["M-1011", "Kenji Sato"],
  ["M-1012", "Layla Haddad"],
  ["M-1013", "Mateo Alvarez"],
  ["M-1014", "Nadia Farooq"],
  ["M-1015", "Omar Yusuf"],
  ["M-1016", "Priya Nair"],
  ["M-1017", "Quinn Adler"],
  ["M-1018", "Rashid Mahmood"],
  ["M-1019", "Sara Lindgren"],
  ["M-1020", "Tariq Javed"],
  ["M-1021", "Umair Shah"],
  ["M-1022", "Valentina Rossi"],
  ["M-1023", "Waleed Aziz"],
  ["M-1024", "Ximena Cruz"],
  ["M-1025", "Yasmin Akhtar"],
  ["M-1026", "Zain Ali"],
  ["M-1027", "Hannah Berg"],
  ["M-1028", "Leo Martins"],
];

function q(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function copyId(n) {
  return `C-${String(n).padStart(5, "0")}`;
}

if (BOOKS.length < 200) {
  throw new Error(`Need at least 200 titles, have ${BOOKS.length}`);
}

const titles = BOOKS.map((row, index) => {
  const [key, title, author, year] = row;
  const category = CATEGORIES[key];
  if (!category) throw new Error(`Unknown category ${key}`);
  return {
    id: index + 1,
    key,
    title,
    author,
    category,
    year,
    isbn: `DEM-${String(index + 1).padStart(4, "0")}`,
  };
});

const copies = [];
for (const title of titles) {
  const extra = title.id % 4 === 0 ? 1 : 0;
  const third = title.id % 18 === 0 ? 1 : 0;
  const n = 1 + extra + third;
  for (let i = 0; i < n; i += 1) {
    copies.push({
      id: copyId(copies.length + 1),
      titleId: title.id,
      shelf: `${title.key}-${(title.id % 12) + 1}`,
    });
  }
}

const memberIds = MEMBERS.map((m) => m[0]);

// First 36 copies are out. The first 14 of those are past due.
const open = [];
for (let i = 0; i < 36; i += 1) {
  const overdue = i < 14;
  const issuedAgo = overdue ? 22 + (i % 9) : 1 + (i % 8);
  const dueAgo = overdue ? 5 + (i % 6) : -(14 - issuedAgo);
  open.push({
    copyId: copies[i].id,
    memberId: memberIds[i % memberIds.length],
    issuedAgo,
    dueAgo,
    returnedAgo: null,
  });
}

const returned = [];
for (let i = 36; i < 140 && i < copies.length; i += 1) {
  const issuedAgo = 50 + (i % 70);
  const late = i % 4 === 0 ? 3 + (i % 5) : i % 4 === 1 ? 0 : -2;
  const dueAgo = issuedAgo - 14;
  const returnedAgo = dueAgo - late;
  returned.push({
    copyId: copies[i].id,
    memberId: memberIds[(i * 3) % memberIds.length],
    issuedAgo,
    dueAgo,
    returnedAgo: Math.max(1, returnedAgo),
  });
}

// Earlier completed loans on copies that are out again. Dates sit well before the open loan.
for (let i = 0; i < 18; i += 1) {
  returned.push({
    copyId: copies[i].id,
    memberId: memberIds[(i + 7) % memberIds.length],
    issuedAgo: 90 + i,
    dueAgo: 76 + i,
    returnedAgo: 70 + i,
  });
}

function loanSql(row) {
  const ret = row.returnedAgo == null ? "null" : `current_date - ${row.returnedAgo}`;
  const due =
    row.dueAgo >= 0 ? `current_date - ${row.dueAgo}` : `current_date + ${-row.dueAgo}`;
  return `(${q(row.copyId)}, ${q(row.memberId)}, current_date - ${row.issuedAgo}, ${due}, ${ret})`;
}

const titleValues = titles
  .map(
    (t) =>
      `(${t.id}, ${q(t.title)}, ${q(t.author)}, ${q(t.category)}, ${q(t.isbn)}, ${t.year})`,
  )
  .join(",\n  ");

const copyValues = copies
  .map((c) => `(${q(c.id)}, ${c.titleId}, ${q(c.shelf)})`)
  .join(",\n  ");

const memberValues = MEMBERS.map(
  ([id, name], i) => `(${q(id)}, ${q(name)}, current_date - ${(i + 1) * 11})`,
).join(",\n  ");

const loanValues = [...open, ...returned].map(loanSql).join(",\n  ");

const openCopySet = new Set(open.map((row) => row.copyId));
const byTitle = new Map();
for (const copy of copies) {
  const list = byTitle.get(copy.titleId) ?? [];
  list.push(copy.id);
  byTitle.set(copy.titleId, list);
}
const fullyOut = [...byTitle.entries()]
  .filter(([, ids]) => ids.every((id) => openCopySet.has(id)))
  .map(([titleId]) => titleId);

const holdRows = fullyOut.slice(0, 8).map((titleId, i) => {
  const memberId = memberIds[(i + 11) % memberIds.length];
  return `(${titleId}, ${q(memberId)}, 'waiting', now() - interval '${i + 1} days')`;
});
// A fulfilled and a cancelled hold, so hold history is not destroyed either.
holdRows.push(`(2, 'M-1008', 'fulfilled', now() - interval '20 days')`);
holdRows.push(`(3, 'M-1019', 'cancelled', now() - interval '12 days')`);

const sql = `-- EF101-P15 Digital Library
-- Demonstration schema. Safe to read in the project report (section: data design).
--
-- A TITLE is the bibliographic work (one Pride and Prejudice).
-- A COPY is one physical object on a shelf, with its own id (C-00042).
-- A LOAN is one issue/return transaction. Returning a book sets returned_on.
-- The loan row is never deleted, so circulation history survives the return.
-- Availability is derived: a copy is issued exactly when it has a loan with
-- returned_on is null. A partial unique index makes a second open loan impossible.
--
-- Fine rule (also stored in settings, one row, and applied by the view below):
--   days_past_due    = max(0, as_of - due_on)
--   chargeable_days  = max(0, days_past_due - grace_days)
--   fine             = min(max_fine, chargeable_days * fine_per_day)
-- as_of is the return date, or today if the copy is still out.
-- A past-due copy still on loan is "overdue" even during the grace window
-- (the fine is then zero). Payments are stored in fine_payments and are not deleted.

create table if not exists settings (
  id            integer primary key default 1 check (id = 1),
  loan_days     integer not null default 14 check (loan_days between 1 and 90),
  grace_days    integer not null default 1 check (grace_days between 0 and 30),
  fine_per_day  numeric(10,2) not null default 20 check (fine_per_day >= 0),
  max_fine      numeric(10,2) not null default 500 check (max_fine >= 0),
  currency      text not null default 'PKR'
);

insert into settings (id, loan_days, grace_days, fine_per_day, max_fine, currency)
values (1, 14, 1, 20, 500, 'PKR')
on conflict (id) do nothing;

create table if not exists titles (
  id          integer primary key,
  title       text not null,
  author      text not null,
  category    text not null,
  isbn        text,
  year        integer,
  created_at  timestamptz not null default now()
);

create table if not exists copies (
  id          text primary key,
  title_id    integer not null references titles (id),
  shelf       text not null,
  created_at  timestamptz not null default now()
);

create table if not exists members (
  id          text primary key,
  name        text not null,
  joined_on   date not null default current_date
);

create table if not exists loans (
  id           integer generated by default as identity primary key,
  copy_id      text not null references copies (id),
  member_id    text not null references members (id),
  issued_on    date not null,
  due_on       date not null,
  returned_on  date,
  check (due_on >= issued_on),
  check (returned_on is null or returned_on >= issued_on)
);

-- The same physical copy cannot be on loan to two members at once.
create unique index if not exists loans_one_open_copy
  on loans (copy_id)
  where returned_on is null;

create index if not exists loans_member_idx on loans (member_id);
create index if not exists loans_copy_idx on loans (copy_id);
create index if not exists titles_category_idx on titles (category);

create table if not exists fine_payments (
  id        integer generated by default as identity primary key,
  loan_id   integer not null references loans (id),
  amount    numeric(10,2) not null check (amount > 0),
  paid_on   date not null,
  note      text not null default ''
);

create table if not exists holds (
  id          integer generated by default as identity primary key,
  title_id    integer not null references titles (id),
  member_id   text not null references members (id),
  status      text not null default 'waiting' check (status in ('waiting', 'fulfilled', 'cancelled')),
  created_at  timestamptz not null default now()
);

create unique index if not exists holds_one_waiting
  on holds (title_id, member_id)
  where status = 'waiting';

insert into titles (id, title, author, category, isbn, year) values
  ${titleValues};

insert into copies (id, title_id, shelf) values
  ${copyValues};

insert into members (id, name, joined_on) values
  ${memberValues};

insert into loans (copy_id, member_id, issued_on, due_on, returned_on) values
  ${loanValues};

-- Partial demonstration payments. The balance is fine minus these rows.
insert into fine_payments (loan_id, amount, paid_on, note)
select l.id, 20, current_date - 1, 'Demonstration desk payment'
from loans l
where l.returned_on is not null
  and l.returned_on > l.due_on
  and l.id % 4 = 0;

insert into fine_payments (loan_id, amount, paid_on, note)
select l.id, 40, current_date, 'Demonstration part-payment while still out'
from loans l
where l.returned_on is null
  and l.due_on < current_date
  and l.id % 5 = 1;

insert into holds (title_id, member_id, status, created_at) values
  ${holdRows.join(",\n  ")};

create or replace view loan_accounts as
select
  l.id,
  l.copy_id,
  l.member_id,
  l.issued_on,
  l.due_on,
  l.returned_on,
  m.name as member_name,
  t.id as title_id,
  t.title,
  t.author,
  t.category,
  c.shelf,
  (l.returned_on is null) as is_open,
  (l.returned_on is null and l.due_on < current_date) as is_overdue,
  greatest(0, (coalesce(l.returned_on, current_date) - l.due_on))::int as days_past_due,
  greatest(0, (coalesce(l.returned_on, current_date) - l.due_on) - s.grace_days)::int as chargeable_days,
  least(
    s.max_fine,
    greatest(0, (coalesce(l.returned_on, current_date) - l.due_on) - s.grace_days) * s.fine_per_day
  )::float8 as fine,
  coalesce((select sum(p.amount) from fine_payments p where p.loan_id = l.id), 0)::float8 as paid
from loans l
join copies c on c.id = l.copy_id
join titles t on t.id = c.title_id
join members m on m.id = l.member_id
cross join settings s
where s.id = 1;

create or replace view copy_status as
select
  c.id,
  c.title_id,
  c.shelf,
  t.title,
  t.author,
  t.category,
  t.isbn,
  t.year,
  case when o.id is null then 'available' else 'issued' end as status,
  o.id as loan_id,
  o.member_id,
  o.member_name,
  o.due_on,
  o.issued_on,
  coalesce(o.is_overdue, false) as is_overdue,
  o.days_past_due,
  o.chargeable_days,
  o.fine,
  o.paid
from copies c
join titles t on t.id = c.title_id
left join loan_accounts o on o.copy_id = c.id and o.is_open;
`;

await writeFile(new URL("../migrations/0002_library.sql", import.meta.url), sql);
console.log(
  `wrote migration: ${titles.length} titles, ${copies.length} copies, ${open.length} open loans, ${returned.length} returned, ${holdRows.length} holds`,
);

const pg = new PGlite();
await pg.waitReady;
await pg.exec(sql);
const counts = await pg.query(`
  select
    (select count(*) from titles)::int as titles,
    (select count(*) from copies)::int as copies,
    (select count(*) from members)::int as members,
    (select count(*) from loans where returned_on is null)::int as open_loans,
    (select count(*) from copy_status where is_overdue)::int as overdue,
    (select count(*) from copy_status where status = 'available')::int as available,
    (select count(*) from loans where returned_on is not null)::int as returned,
    (select count(*) from holds where status = 'waiting')::int as holds,
    (select count(*) from fine_payments)::int as payments
`);
console.log(counts.rows[0]);
const dup = await pg.query(
  `select copy_id, count(*) from loans where returned_on is null group by copy_id having count(*) > 1`,
);
if (dup.rows.length) throw new Error("duplicate open loans");
const sample = await pg.query(
  `select id, title, fine, chargeable_days, paid, is_overdue from loan_accounts where is_overdue order by id limit 3`,
);
console.log("overdue sample", sample.rows);
if (counts.rows[0].titles < 200) throw new Error("titles < 200");
if (counts.rows[0].overdue < 1) throw new Error("expected overdue copies");
console.log("seed ok");
