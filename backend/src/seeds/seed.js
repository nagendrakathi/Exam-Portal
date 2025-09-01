import dotenv from 'dotenv';
import Question from '../models/question.model.js';
import { connectDB } from '../config/db.js';

dotenv.config();

const sample = [
  // ---- Web & HTTP ----
  {
    prompt: 'Which HTTP method is idempotent?',
    options: ['POST', 'PUT', 'PATCH', 'DELETE'],
    correctIndex: 1
  },
  {
    prompt: 'What does JWT stand for?',
    options: ['Java Web Token', 'JSON Web Token', 'Joint Web Token', 'JavaScript Web Ticket'],
    correctIndex: 1
  },
  {
    prompt: 'Which status code means Not Found?',
    options: ['200', '301', '404', '500'],
    correctIndex: 2
  },
  {
    prompt: 'Which protocol is used to send emails?',
    options: ['HTTP', 'SMTP', 'IMAP', 'POP3'],
    correctIndex: 1
  },
  {
    prompt: 'Which header is used for authorization in HTTP?',
    options: ['Auth', 'Authorization', 'Token', 'Bearer'],
    correctIndex: 1
  },

  // ---- React & JS ----
  {
    prompt: 'Which hook is used for side effects in React?',
    options: ['useEffect', 'useState', 'useMemo', 'useRef'],
    correctIndex: 0
  },
  {
    prompt: 'What does DOM stand for?',
    options: ['Document Object Model', 'Data Object Method', 'Document Oriented Model', 'Data Order Management'],
    correctIndex: 0
  },
  {
    prompt: 'Which method is used to parse JSON in JavaScript?',
    options: ['JSON.parse()', 'JSON.stringify()', 'parse.JSON()', 'toJSON()'],
    correctIndex: 0
  },
  {
    prompt: 'Which of the following is NOT a JavaScript data type?',
    options: ['String', 'Boolean', 'Character', 'Undefined'],
    correctIndex: 2
  },
  {
    prompt: 'What is the default state of a React component?',
    options: ['undefined', 'null', 'empty object', 'false'],
    correctIndex: 1
  },

  // ---- SQL & DB ----
  {
    prompt: 'Which SQL command is used to remove a table?',
    options: ['DELETE TABLE', 'DROP TABLE', 'REMOVE TABLE', 'TRUNCATE TABLE'],
    correctIndex: 1
  },
  {
    prompt: 'Which SQL clause is used to filter results?',
    options: ['WHERE', 'GROUP BY', 'ORDER BY', 'HAVING'],
    correctIndex: 0
  },
  {
    prompt: 'Which type of join returns all rows from both tables?',
    options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'],
    correctIndex: 3
  },
  {
    prompt: 'Which normal form removes partial dependency?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctIndex: 1
  },
  {
    prompt: 'What does ACID stand for in databases?',
    options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Atomic, Concurrent, Independent, Durable', 'None'],
    correctIndex: 0
  },

  // ---- OS ----
  {
    prompt: 'Which scheduling algorithm is preemptive?',
    options: ['FCFS', 'SJF', 'Round Robin', 'FIFO'],
    correctIndex: 2
  },
  {
    prompt: 'Which is not a type of OS?',
    options: ['Batch', 'Time-sharing', 'Distributed', 'Firewall'],
    correctIndex: 3
  },
  {
    prompt: 'Which memory management technique suffers from external fragmentation?',
    options: ['Paging', 'Segmentation', 'Swapping', 'None'],
    correctIndex: 1
  },
  {
    prompt: 'Which system call creates a new process in Unix?',
    options: ['exec()', 'fork()', 'wait()', 'exit()'],
    correctIndex: 1
  },
  {
    prompt: 'What is thrashing in OS?',
    options: ['CPU overload', 'Excessive paging', 'Deadlock', 'Cache miss'],
    correctIndex: 1
  },

  // ---- Networking ----
  {
    prompt: 'Which layer of OSI is responsible for routing?',
    options: ['Data Link', 'Network', 'Transport', 'Session'],
    correctIndex: 1
  },
  {
    prompt: 'What is the default port for HTTPS?',
    options: ['80', '8080', '443', '21'],
    correctIndex: 2
  },
  {
    prompt: 'Which protocol resolves domain names to IP?',
    options: ['HTTP', 'DNS', 'FTP', 'DHCP'],
    correctIndex: 1
  },
  {
    prompt: 'Which topology uses a central hub?',
    options: ['Ring', 'Mesh', 'Star', 'Bus'],
    correctIndex: 2
  },
  {
    prompt: 'Which address is used for broadcasting?',
    options: ['127.0.0.1', '255.255.255.255', '192.168.0.1', '0.0.0.0'],
    correctIndex: 1
  },

  // ---- Data Structures ----
  {
    prompt: 'Which data structure uses FIFO?',
    options: ['Stack', 'Queue', 'Tree', 'Graph'],
    correctIndex: 1
  },
  {
    prompt: 'Which traversal is DFS in a binary tree?',
    options: ['Level-order', 'In-order', 'Breadth-first', 'Dijkstra'],
    correctIndex: 1
  },
  {
    prompt: 'Which data structure is used for recursion?',
    options: ['Stack', 'Queue', 'Heap', 'Array'],
    correctIndex: 0
  },
  {
    prompt: 'Which sorting algorithm is the fastest on average?',
    options: ['Bubble Sort', 'Selection Sort', 'Merge Sort', 'Quick Sort'],
    correctIndex: 3
  },
  {
    prompt: 'Which graph traversal uses a queue?',
    options: ['DFS', 'BFS', 'Dijkstra', 'Kruskal'],
    correctIndex: 1
  },

  // ---- Programming Fundamentals ----
  {
    prompt: 'Which keyword is used to define a constant in Java?',
    options: ['let', 'final', 'const', 'define'],
    correctIndex: 1
  },
  {
    prompt: 'Which of these is not OOP concept?',
    options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Compilation'],
    correctIndex: 3
  },
  {
    prompt: 'What is the size of int in Java?',
    options: ['2 bytes', '4 bytes', '8 bytes', 'Depends on OS'],
    correctIndex: 1
  },
  {
    prompt: 'Which language introduced the concept of pointers?',
    options: ['Java', 'C', 'Python', 'C#'],
    correctIndex: 1
  },
  {
    prompt: 'What does JVM stand for?',
    options: ['Java Virtual Machine', 'Java Variable Method', 'Just Virtual Machine', 'Joint Virtual Model'],
    correctIndex: 0
  },

  // Add more until total reaches 100
];

(async () => {
  try {
    await connectDB();
    await Question.deleteMany({});
    await Question.insertMany(sample);
    console.log('Seeded questions:', sample.length);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
