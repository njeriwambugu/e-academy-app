const icon = (fileName) =>
  new URL(`../assets/images/${fileName}`, import.meta.url).href;

export const teachers = [
  {
    id: 1,
    name: "Mr Sammy",
    contact: "0721859532",
    email: "sammy@esoma.com",

    assignments: [
      { id: 5101, subjectId: "MAT", classId: 12, role: "Main" },
      { id: 5102, subjectId: "MAT", classId: 11, role: "Main" },
      { id: 5103, subjectId: "MAT", classId: 10, role: "Co-Teacher" },
      { id: 5104, subjectId: "MAT", classId: 9, role: "Assistant" },
      { id: 5105, subjectId: "SCI", classId: 11, role: "Main" },
      { id: 5106, subjectId: "SCI", classId: 3, role: "Main" },
      { id: 5107, subjectId: "SCI", classId: 8, role: "Assistant" },
      { id: 5108, subjectId: "ENG", classId: 3, role: "Assistant" },
      { id: 5109, subjectId: "ENG", classId: 4, role: "Main" },
      { id: 5110, subjectId: "ENG", classId: 5, role: "Co-Teacher" },
      { id: 5111, subjectId: "KIS", classId: 12, role: "Main" },
      { id: 5112, subjectId: "KIS", classId: 1, role: "Temporary" },
      { id: 5113, subjectId: "CRE", classId: 11, role: "Temporary" },
      { id: 5114, subjectId: "CRE", classId: 6, role: "Main" },
      { id: 5115, subjectId: "ART", classId: 3, role: "Assistant" },
      { id: 5116, subjectId: "ART", classId: 7, role: "Main" },
      { id: 5117, subjectId: "ENV", classId: 12, role: "Main" },
      { id: 5118, subjectId: "ENV", classId: 13, role: "Co-Teacher" },
      { id: 5119, subjectId: "COMP", classId: 12, role: "Main" },
      { id: 5120, subjectId: "COMP", classId: 11, role: "Co-Teacher" },
      { id: 5121, subjectId: "SS", classId: 11, role: "Main" },
      { id: 5122, subjectId: "SS", classId: 12, role: "Assistant" },
      { id: 5123, subjectId: "INT", classId: 3, role: "Main" },
      { id: 5124, subjectId: "AGRI", classId: 12, role: "Main" },
      { id: 5125, subjectId: "AGRI", classId: 3, role: "Co-Teacher" },
      { id: 5126, subjectId: "PTECH", classId: 11, role: "Main" },
      { id: 5127, subjectId: "IRE", classId: 3, role: "Assistant" }
    ]

  },

  {
    id: 2,
    name: "Mrs Jane",
    contact: "0712456789",
    email: "jane@esoma.com",

    assignments: [
      {
        id: 5008,
        subjectId: "ENG",
        classId: 10,
        role: "Main"
      },
      {
        id: 5009,
        subjectId: "LIT",
        classId: 9,
        role: "Co-Teacher"
      }
    ]

  },

  {
    id: 3,
    name: "Mr David",
    contact: "0722345678",
    email: "david@esoma.com",

    assignments: [
      {
        id: 5010,
        subjectId: "SCI",
        classId: 8,
        role: "Main"
      },
      {
        id: 5011,
        subjectId: "BIO",
        classId: 7,
        role: "Assistant"
      }
    ]
  },

  {
    id: 4,
    name: "Ms Sarah",
    contact: "0733456789",
    email: "sarah@esoma.com",
    assignments: [
      {
        id: 5012,
        subjectId: "SS",
        classId: 6,
        role: "Main"
      },
      {
        id: 5013,
        subjectId: "GEO",
        classId: 5,
        role: "Temporary"
      }
    ]

  },

  {
    id: 5,
    name: "Mr Peter",
    contact: "0744567890",
    email: "peter@esoma.com",
    assignments: [
      {
        id: 5014,
        subjectId: "COMP",
        classId: 12,
        role: "Main"
      },
      {
        id: 5015,
        subjectId: "COMP",
        classId: 11,
        role: "Co-Teacher"
      }
    ]

  },

  {
    id: 6,
    name: "Mrs Emily",
    contact: "0755678901",
    email: "emily@esoma.com",

    assignments: [
      {
        id: 5016,
        subjectId: "MAT",
        classId: 10,
        role: "Main"
      },
      {
        id: 5017,
        subjectId: "PHY",
        classId: 9,
        role: "Assistant"
      }
    ]

  },

  {
    id: 7,
    name: "Mr Joseph",
    contact: "0766789012",
    email: "joseph@esoma.com",

    assignments: [
      {
        id: 5018,
        subjectId: "BIO",
        classId: 12,
        role: "Main"
      },
      {
        id: 5019,
        subjectId: "CHEM",
        classId: 1,
        role: "Temporary"
      }
    ]

  },

  {
    id: 8,
    name: "Mr Augustine",
    contact: "0777890123",
    email: "augustine@esoma.com",

    assignments: [
      { id: 5020, subjectId: "SS", classId: 7, role: "Main" },
      { id: 5021, subjectId: "GEO", classId: 6, role: "Co-Teacher" }
    ]

  },

  {
    id: 9,
    name: "Ms Gloria",
    contact: "0788901234",
    email: "gloria@esoma.com",

    assignments: [
      { id: 5022, subjectId: "KIS", classId: 8, role: "Main" },
      { id: 5023, subjectId: "LIT", classId: 5, role: "Assistant" }
    ]

  },

  {
    id: 10,
    name: "Mr Thomas",
    contact: "0799012345",
    email: "thomas@esoma.com",

    assignments: [
      { id: 5024, subjectId: "CRE", classId: 13, role: "Main" },
      { id: 5025, subjectId: "ENV", classId: 1, role: "Temporary" }
    ]

  },

  {
    id: 11,
    name: "Mrs Ruth",
    contact: "0700123456",
    email: "ruth@esoma.com",

    assignments: [
      { id: 5026, subjectId: "ART", classId: 3, role: "Main" },
      { id: 5027, subjectId: "PE", classId: 14, role: "Assistant" }
    ]

  },

  {
    id: 12,
    name: "Mr Benjamin",
    contact: "0711234567",
    email: "benjamin@esoma.com",

    assignments: [
      { id: 5028, subjectId: "SCI", classId: 7, role: "Co-Teacher" },
      { id: 5029, subjectId: "COMP", classId: 11, role: "Main" }
    ]

  }
];


export const classes = [
  { id: 1, name: "PP1 North", group: "PP1", theme: "pp1", students: 22, classTeacher: "Mrs Lilian Achieng" },
  { id: 3, name: "PP2 North East", group: "PP2", theme: "pp2", students: 25, classTeacher: "Mrs Caroline Njeri" },
  { id: 4, name: "Grade 1 North", group: "Grade 1", theme: "grade-1", students: 26, classTeacher: "Mr Kevin Otieno" },
  { id: 5, name: "Grade 2 North East", group: "Grade 2", theme: "grade-2", students: 31, classTeacher: "Mrs Faith Wambui" },
  { id: 6, name: "Grade 3 East", group: "Grade 3", theme: "grade-3", students: 28, classTeacher: "Mr Dennis Kariuki" },
  { id: 7, name: "Grade 4 North", group: "Grade 4", theme: "grade-4", students: 30, classTeacher: "Mrs Beatrice Nyokabi" },
  { id: 8, name: "Grade 5 South", group: "Grade 5", theme: "grade-5", students: 29, classTeacher: "Mr Victor Mutua" },
  { id: 9, name: "Grade 6 West", group: "Grade 6", theme: "grade-6", students: 27, classTeacher: "Mrs Alice Chebet" },
  { id: 10, name: "Grade 7 Central", group: "Grade 7", theme: "grade-7", students: 34, classTeacher: "Mr Patrick Onyango" },
  { id: 11, name: "Grade 8 South", group: "Grade 8", theme: "grade-8", students: 32, classTeacher: "Mrs Winnie Adhiambo" },
  { id: 12, name: "Grade 9 North", group: "Grade 9", theme: "grade-9", students: 33, classTeacher: "Mr Charles Kimani" },
  { id: 13, name: "Grade 1 East", group: "Grade 1", theme: "grade-1", students: 25, classTeacher: "Mrs Grace Wanjiku" },
  { id: 14, name: "Grade 5 West", group: "Grade 5", theme: "grade-5", students: 24, classTeacher: "Mr Eliud Mwendwa" }
];

const students = [
  // PP2 North East (classId 3) — Mr Sammy: English, Creative Arts & Sports
  { id: 1001, name: "Baraka Otieno",    classId: 3, admissionNo: "EA-2026-PP2-001", status: "active",  invite: "Accepted" },
  { id: 1002, name: "Zawadi Achieng",   classId: 3, admissionNo: "EA-2026-PP2-002", status: "active",  invite: "Accepted" },
  { id: 1003, name: "Imani Wanjiru",    classId: 3, admissionNo: "EA-2026-PP2-003", status: "pending", invite: "Pending"  },
  { id: 1004, name: "Jayden Kiprono",   classId: 3, admissionNo: "EA-2026-PP2-004", status: "active",  invite: "Accepted" },
  { id: 1005, name: "Neema Mwikali",    classId: 3, admissionNo: "EA-2026-PP2-005", status: "active",  invite: "Accepted" },
  { id: 1006, name: "Tevin Omondi",     classId: 3, admissionNo: "EA-2026-PP2-006", status: "pending", invite: "Pending"  },

  // Grade 8 South (classId 11) — Mr Sammy: Science & Technology, CRE
  { id: 1007, name: "Brian Kiptoo",     classId: 11, admissionNo: "EA-2026-G8-001", status: "active",  invite: "Accepted" },
  { id: 1008, name: "Faith Atieno",     classId: 11, admissionNo: "EA-2026-G8-002", status: "active",  invite: "Accepted" },
  { id: 1009, name: "Dennis Mwangi",    classId: 11, admissionNo: "EA-2026-G8-003", status: "active",  invite: "Accepted" },
  { id: 1010, name: "Joan Wanjiku",     classId: 11, admissionNo: "EA-2026-G8-004", status: "pending", invite: "Pending"  },
  { id: 1011, name: "Kevin Muli",       classId: 11, admissionNo: "EA-2026-G8-005", status: "active",  invite: "Accepted" },
  { id: 1012, name: "Mercy Jepkoech",   classId: 11, admissionNo: "EA-2026-G8-006", status: "active",  invite: "Accepted" },
  { id: 1013, name: "Victor Maina",     classId: 11, admissionNo: "EA-2026-G8-007", status: "pending", invite: "Pending"  },

  // Grade 9 North (classId 12) — Mr Sammy: Mathematics, Kiswahili, Environmental
  { id: 1014, name: "Sharon Cheruiyot", classId: 12, admissionNo: "EA-2026-G9-001", status: "active",  invite: "Accepted" },
  { id: 1015, name: "Caleb Mutua",      classId: 12, admissionNo: "EA-2026-G9-002", status: "active",  invite: "Accepted" },
  { id: 1016, name: "Grace Naliaka",    classId: 12, admissionNo: "EA-2026-G9-003", status: "active",  invite: "Accepted" },
  { id: 1017, name: "Eric Kiplangat",   classId: 12, admissionNo: "EA-2026-G9-004", status: "pending", invite: "Pending"  },
  { id: 1018, name: "Faith Nyambura",   classId: 12, admissionNo: "EA-2026-G9-005", status: "active",  invite: "Accepted" },
  { id: 1019, name: "Abel Musyoka",     classId: 12, admissionNo: "EA-2026-G9-006", status: "active",  invite: "Accepted" },
  { id: 1020, name: "Christine Atieno", classId: 12, admissionNo: "EA-2026-G9-007", status: "active",  invite: "Accepted" },
  { id: 1021, name: "John Mwenda",      classId: 12, admissionNo: "EA-2026-G9-008", status: "pending", invite: "Pending"  },

  { id: 1022, name: "Sarah Chepkemoi",  classId: 10, admissionNo: "EA-2026-G7-001", status: "active",  invite: "Accepted" },

  { id: 1023, name: "Timothy Kamau",    classId: 4,  admissionNo: "EA-2026-G1-001", status: "active",  invite: "Accepted" },
  { id: 1024, name: "Amani Yusuf",      classId: 12, admissionNo: "EA-2026-G9-009", status: "active",  invite: "Accepted" },
  { id: 1025, name: "Nia Joy",          classId: 11, admissionNo: "EA-2026-G8-008", status: "active",  invite: "Accepted" },
  { id: 1026, name: "Zacharia Muteti",  classId: 3,  admissionNo: "EA-2026-PP2-007", status: "pending", invite: "Pending" },

  // Kevin Kamau's other children (siblings of Timothy Kamau, id 1023) — parent portal family
  { id: 1027, name: "Bethany Kamau",    classId: 7,  admissionNo: "EA-2026-G4-010", status: "active",  invite: "Accepted" },
  { id: 1028, name: "Kelvin Kamau",     classId: 8,  admissionNo: "EA-2026-G5-011", status: "active",  invite: "Accepted" },
  { id: 1029, name: "Viola Kamau",      classId: 10, admissionNo: "EA-2026-G7-012", status: "active",  invite: "Accepted" },
  { id: 1030, name: "Cherop Kamau",     classId: 11, admissionNo: "EA-2026-G8-013", status: "active",  invite: "Accepted" },
  { id: 1031, name: "James Kamau",      classId: 5,  admissionNo: "EA-2026-G2-014", status: "active",  invite: "Accepted" },
  { id: 1032, name: "Brian Kamau",      classId: 3,  admissionNo: "EA-2026-PP2-008", status: "active",  invite: "Accepted" },
  { id: 1033, name: "Purity Kamau",     classId: 12, admissionNo: "EA-2026-G9-010", status: "active",  invite: "Accepted" }
];


const guardianInfo = {
  1001: ["Joseph Otieno", "0722 145 880"],
  1002: ["Mary Achieng", "0723 410 552"],
  1003: ["Peter Wanjiru", "0701 938 274"],
  1004: ["Grace Kiprono", "0712 664 109"],
  1005: ["Daniel Mwikali", "0733 215 487"],
  1006: ["Esther Omondi", "0720 877 360"],
  1007: ["Samuel Kiptoo", "0711 502 943"],
  1008: ["Lucy Atieno", "0729 138 705"],
  1009: ["James Mwangi", "0700 461 829"],
  1010: ["Ann Wanjiku", "0743 920 158"],
  1011: ["Charles Muli", "0758 374 612"],
  1012: ["Rose Jepkoech", "0707 285 490"],
  1013: ["David Maina", "0721 609 733"],
  1014: ["Faith Cheruiyot", "0734 118 256"],
  1015: ["Paul Mutua", "0768 540 921"],
  1016: ["Mercy Naliaka", "0719 803 467"],
  1017: ["Stephen Kiplangat", "0726 357 084"],
  1018: ["Caroline Nyambura", "0702 691 538"],
  1019: ["Patrick Musyoka", "0715 240 976"],
  1020: ["Susan Atieno", "0738 562 310"],
  1021: ["Michael Mwenda", "0709 487 651"],
  1022: ["Janet Chepkemoi", "0747 130 829"],
  1023: ["Kevin Kamau", "0721859532"],
  1024: ["Abdi Rahim", "0712456789"],
  1025: ["James Otieno", "0799555123"],
  1026: ["Jamain Mutati", "0733208417"],
  1027: ["Kevin Kamau", "0721859532"],
  1028: ["Kevin Kamau", "0721859532"],
  1029: ["Kevin Kamau", "0721859532"],
  1030: ["Kevin Kamau", "0721859532"],
  1031: ["Kevin Kamau", "0721859532"],
  1032: ["Kevin Kamau", "0721859532"],
  1033: ["Kevin Kamau", "0721859532"],
};
students.forEach((student) => {
  const info = guardianInfo[student.id];
  if (info) {
    student.guardian = info[0];
    student.guardianContact = info[1];
  }
});

const subjects = [
  {
    id: "SCI",
    name: "Science and Technology",
    icon: icon("science_tech.webp"),
  },
  {
    id: "KIS",
    name: "Kiswahili",
    icon: icon("kiswahili.webp"),
    
  },
  {
    id: "MAT",
    name: "Mathematics",
    icon: icon("mathematics.webp"),
    
  },
  {
    id: "INT",
    name: "Integrated Science",
    icon: icon("integrated_sci.webp"),
   
  },
  {
    id: "COMP",
    name: "Computer Studies",
    icon: icon("computer_studies.webp"),
    
  },
  {
    id: "CRE",
    name: "Christian Religious Education",
    icon: icon("cre.webp"),
    
  },
  {
    id: "ART",
    name: "Creative Arts and Sports",
    icon: icon("creative_arts.webp"),
    
  },
  {
    id: "IRE",
    name: "Islam Religious Education",
    icon: icon("ire.webp"),
   
  },
  {
    id: "ENV",
    name: "Enviromental Activities",
    icon: icon("enviromental_activities.webp"),
    
  },
  {
    id: "ENG",
    name: "English",
    icon: icon("english.webp"),
    
  },
  {
    id: "SS",
    name: "Social Studies",
    icon: icon("social_studies.webp"),
    
  },
  {
    id: "PTECH",
    name: "Pre-Technical Studies",
    icon: icon("pre_tech.webp"),
  },

  {
    id: "AGRI",
    name: "Agriculure and Nutrition",
    icon: icon("agriculture.webp"),

  },

  // secondary-school-only subjects — not part of the CBC subject set above,
  // but referenced by some teachers' assignments, so given display names too
  { id: "BIO", name: "Biology", icon: icon("science_tech.webp") },
  { id: "CHEM", name: "Chemistry", icon: icon("science_tech.webp") },
  { id: "PHY", name: "Physics", icon: icon("science_tech.webp") },
  { id: "GEO", name: "Geography", icon: icon("social_studies.webp") },
  { id: "LIT", name: "Literature", icon: icon("english.webp") },
  { id: "PE", name: "Physical Education", icon: icon("creative_arts.webp") },
];

function makeScores(subjectId, base = 68) {
  return students.map((student, index) => ({
    studentId: student.id,
    subjectId,
    latestScore: Math.min(98, Math.max(35, base + ((index % 5) - 2) * 6)),
    trend: index % 3 === 0 ? "Improving" : index % 3 === 1 ? "Steady" : "Needs support",
  }));
}

const subjectStudentScores = {
  SCI: makeScores("SCI", 74),
  KIS: makeScores("KIS", 69),
  MAT: makeScores("MAT", 71),
  INT: makeScores("INT", 76),
  COMP: makeScores("COMP", 82),
  CRE: makeScores("CRE", 78),
  ART: makeScores("ART", 84),
  ENG: makeScores("ENG", 73),
  ENV: makeScores("ENV", 75),
  SS: makeScores("SS", 72),
  IRE: makeScores("IRE", 77),
  PTECH: makeScores("PTECH", 70),
  AGRI: makeScores("AGRI", 79),
  BIO: makeScores("BIO", 38), // Grade 9 North's only subject Mr Sammy doesn't teach- kept low so it visibly drags the all-subjects avg below the teacher avg
};

const strandPerformance = {
  MAT: {
    // CBC math strand names/complexity genuinely change by grade band — a
    // PP1 learner and a Grade 9 learner should never see the same
    // "Mathematics" assignment list.
    "pre-primary": [
      {
        name: "NUMBER WORK",
        open: true,
        averageScore: 81,
        completion: 78,
        subStrands: [
          { name: "Counting 1-10", count: 6, averageScore: 84, completion: 82 },
          { name: "Number Recognition", count: 5, averageScore: 80, completion: 76 },
          { name: "Simple Sorting", count: 4, averageScore: 78, completion: 74 },
        ],
      },
      {
        name: "SHAPE AND SPACE",
        open: false,
        averageScore: 77,
        completion: 70,
        subStrands: [
          { name: "Basic Shapes", count: 4, averageScore: 79, completion: 73 },
          { name: "Size Comparison", count: 3, averageScore: 75, completion: 68 },
          { name: "Position Words", count: 3, averageScore: 76, completion: 69 },
        ],
      },
    ],
    "lower-primary": [
      {
        name: "NUMBERS",
        open: true,
        averageScore: 74,
        completion: 69,
        subStrands: [
          { name: "Counting and Number Names", count: 8, averageScore: 78, completion: 74 },
          { name: "Addition", count: 8, averageScore: 71, completion: 67 },
          { name: "Subtraction", count: 8, averageScore: 70, completion: 64 },
          { name: "Place Value", count: 5, averageScore: 73, completion: 68 },
        ],
      },
      {
        name: "MEASUREMENT",
        open: false,
        averageScore: 69,
        completion: 60,
        subStrands: [
          { name: "Length", count: 4, averageScore: 71, completion: 62 },
          { name: "Time", count: 4, averageScore: 68, completion: 59 },
          { name: "Money", count: 5, averageScore: 68, completion: 59 },
        ],
      },
      {
        name: "GEOMETRY",
        open: false,
        averageScore: 72,
        completion: 63,
        subStrands: [
          { name: "Lines and Angles", count: 3, averageScore: 73, completion: 64 },
          { name: "2-D Shapes", count: 4, averageScore: 71, completion: 62 },
        ],
      },
    ],
    "upper-primary": [
      {
        name: "NUMBERS",
        open: true,
        averageScore: 72,
        completion: 68,
        subStrands: [
          { name: "Whole Numbers", count: 18, averageScore: 76, completion: 72 },
          { name: "Addition", count: 8, averageScore: 69, completion: 65 },
          { name: "Subtraction", count: 8, averageScore: 71, completion: 66 },
          { name: "Multiplication", count: 9, averageScore: 64, completion: 59 },
          { name: "Division", count: 7, averageScore: 62, completion: 55 },
          { name: "Fractions", count: 7, averageScore: 78, completion: 74 },
          { name: "Decimals", count: 4, averageScore: 75, completion: 70 },
          { name: "Use of Letters", count: 0, averageScore: null, completion: 0 },
        ],
      },
      {
        name: "MEASUREMENTS",
        open: false,
        averageScore: 70,
        completion: 61,
        subStrands: [
          { name: "Length", count: 5, averageScore: 74, completion: 63 },
          { name: "Mass", count: 4, averageScore: 67, completion: 58 },
          { name: "Capacity", count: 3, averageScore: 72, completion: 64 },
          { name: "Time", count: 4, averageScore: 69, completion: 60 },
          { name: "Money", count: 6, averageScore: 71, completion: 62 },
        ],
      },
      {
        name: "GEOMETRY",
        open: false,
        averageScore: 73,
        completion: 66,
        subStrands: [
          { name: "Lines", count: 3, averageScore: 77, completion: 70 },
          { name: "Angles", count: 4, averageScore: 68, completion: 61 },
          { name: "Shapes", count: 5, averageScore: 74, completion: 68 },
        ],
      },
      {
        name: "DATA HANDLING",
        open: false,
        averageScore: 79,
        completion: 73,
        subStrands: [
          { name: "Tables", count: 3, averageScore: 80, completion: 76 },
          { name: "Pictographs", count: 2, averageScore: 78, completion: 70 },
          { name: "Bar Graphs", count: 3, averageScore: 79, completion: 74 },
        ],
      },
    ],
    "junior-secondary": [
      {
        name: "NUMBERS AND ALGEBRA",
        open: true,
        averageScore: 66,
        completion: 58,
        subStrands: [
          { name: "Integers", count: 6, averageScore: 70, completion: 63 },
          { name: "Algebraic Expressions", count: 7, averageScore: 61, completion: 52 },
          { name: "Linear Equations", count: 6, averageScore: 64, completion: 55 },
        ],
      },
      {
        name: "GEOMETRY AND MEASUREMENT",
        open: false,
        averageScore: 68,
        completion: 60,
        subStrands: [
          { name: "Pythagorean Theorem", count: 4, averageScore: 65, completion: 56 },
          { name: "Trigonometric Ratios", count: 5, averageScore: 63, completion: 54 },
          { name: "Area and Volume", count: 5, averageScore: 72, completion: 66 },
        ],
      },
      {
        name: "DATA AND PROBABILITY",
        open: false,
        averageScore: 74,
        completion: 69,
        subStrands: [
          { name: "Data Interpretation", count: 4, averageScore: 76, completion: 71 },
          { name: "Probability Basics", count: 3, averageScore: 71, completion: 64 },
        ],
      },
    ],
  },
  SCI: [
    {
      name: "LIVING THINGS",
      open: true,
      averageScore: 77,
      completion: 71,
      subStrands: [
        { name: "Plants", count: 6, averageScore: 80, completion: 74 },
        { name: "Animals", count: 5, averageScore: 75, completion: 69 },
        { name: "Human Body", count: 4, averageScore: 76, completion: 70 },
      ],
    },
    {
      name: "MATERIALS",
      open: false,
      averageScore: 73,
      completion: 65,
      subStrands: [
        { name: "States of Matter", count: 4, averageScore: 72, completion: 66 },
        { name: "Mixtures", count: 3, averageScore: 74, completion: 64 },
      ],
    },
    {
      name: "ENERGY",
      open: false,
      averageScore: 70,
      completion: 62,
      subStrands: [
        { name: "Light", count: 3, averageScore: 73, completion: 61 },
        { name: "Heat", count: 3, averageScore: 68, completion: 60 },
        { name: "Sound", count: 2, averageScore: 69, completion: 64 },
      ],
    },
  ],
  COMP: [
    {
      name: "DIGITAL LITERACY",
      open: true,
      averageScore: 84,
      completion: 78,
      subStrands: [
        { name: "Keyboard Skills", count: 4, averageScore: 86, completion: 80 },
        { name: "File Management", count: 3, averageScore: 82, completion: 76 },
        { name: "Internet Safety", count: 5, averageScore: 85, completion: 79 },
      ],
    },
  ],
  ENG: {
    "pre-primary": [
      {
        name: "ORAL LANGUAGE",
        open: true,
        averageScore: 80,
        completion: 76,
        subStrands: [
          { name: "Listening Games", count: 5, averageScore: 82, completion: 79 },
          { name: "Rhymes and Songs", count: 4, averageScore: 81, completion: 77 },
          { name: "Vocabulary Building", count: 4, averageScore: 77, completion: 72 },
        ],
      },
      {
        name: "PRE-LITERACY",
        open: false,
        averageScore: 74,
        completion: 66,
        subStrands: [
          { name: "Letter Recognition", count: 5, averageScore: 76, completion: 68 },
          { name: "Picture Reading", count: 3, averageScore: 72, completion: 64 },
        ],
      },
    ],
    "lower-primary": [
      {
        name: "LISTENING AND SPEAKING",
        open: true,
        averageScore: 75,
        completion: 70,
        subStrands: [
          { name: "Pronunciation", count: 4, averageScore: 77, completion: 72 },
          { name: "Oral Narratives", count: 3, averageScore: 73, completion: 67 },
          { name: "Conversations", count: 4, averageScore: 76, completion: 71 },
        ],
      },
      {
        name: "READING",
        open: false,
        averageScore: 72,
        completion: 66,
        subStrands: [
          { name: "Fluency", count: 5, averageScore: 74, completion: 69 },
          { name: "Comprehension", count: 6, averageScore: 70, completion: 63 },
          { name: "Intensive Reading", count: 3, averageScore: 73, completion: 66 },
        ],
      },
      {
        name: "WRITING",
        open: false,
        averageScore: 69,
        completion: 61,
        subStrands: [
          { name: "Handwriting", count: 3, averageScore: 72, completion: 66 },
          { name: "Creative Writing", count: 5, averageScore: 66, completion: 57 },
          { name: "Functional Writing", count: 4, averageScore: 70, completion: 60 },
        ],
      },
      {
        name: "GRAMMAR",
        open: false,
        averageScore: 74,
        completion: 68,
        subStrands: [
          { name: "Parts of Speech", count: 5, averageScore: 75, completion: 70 },
          { name: "Tenses", count: 4, averageScore: 71, completion: 64 },
          { name: "Sentence Structure", count: 3, averageScore: 76, completion: 71 },
        ],
      },
    ],
    "upper-primary": [
      {
        name: "READING COMPREHENSION",
        open: true,
        averageScore: 71,
        completion: 64,
        subStrands: [
          { name: "Silent Reading", count: 5, averageScore: 73, completion: 66 },
          { name: "Comprehension Questions", count: 6, averageScore: 69, completion: 61 },
          { name: "Summary Skills", count: 3, averageScore: 68, completion: 58 },
        ],
      },
      {
        name: "COMPOSITION WRITING",
        open: false,
        averageScore: 67,
        completion: 58,
        subStrands: [
          { name: "Narrative Writing", count: 4, averageScore: 69, completion: 60 },
          { name: "Descriptive Writing", count: 4, averageScore: 65, completion: 56 },
          { name: "Letter Writing", count: 3, averageScore: 66, completion: 57 },
        ],
      },
      {
        name: "GRAMMAR AND STRUCTURE",
        open: false,
        averageScore: 73,
        completion: 67,
        subStrands: [
          { name: "Tenses", count: 4, averageScore: 74, completion: 68 },
          { name: "Sentence Types", count: 3, averageScore: 72, completion: 65 },
          { name: "Punctuation", count: 3, averageScore: 73, completion: 66 },
        ],
      },
    ],
    "junior-secondary": [
      {
        name: "LISTENING AND SPEAKING SKILLS",
        open: true,
        averageScore: 70,
        completion: 63,
        subStrands: [
          { name: "Public Speaking", count: 4, averageScore: 68, completion: 60 },
          { name: "Debate", count: 3, averageScore: 71, completion: 65 },
          { name: "Oral Presentations", count: 4, averageScore: 72, completion: 66 },
        ],
      },
      {
        name: "READING AND COMPREHENSION",
        open: false,
        averageScore: 68,
        completion: 60,
        subStrands: [
          { name: "Critical Reading", count: 5, averageScore: 66, completion: 57 },
          { name: "Inference Skills", count: 4, averageScore: 64, completion: 54 },
        ],
      },
      {
        name: "CREATIVE AND FUNCTIONAL WRITING",
        open: false,
        averageScore: 65,
        completion: 56,
        subStrands: [
          { name: "Essay Writing", count: 5, averageScore: 63, completion: 53 },
          { name: "Report Writing", count: 4, averageScore: 66, completion: 58 },
          { name: "Creative Composition", count: 4, averageScore: 64, completion: 55 },
        ],
      },
      {
        name: "GRAMMAR IN CONTEXT",
        open: false,
        averageScore: 71,
        completion: 64,
        subStrands: [
          { name: "Advanced Tenses", count: 4, averageScore: 70, completion: 62 },
          { name: "Clause Structure", count: 3, averageScore: 72, completion: 65 },
        ],
      },
    ],
  },
  KIS: {
    "pre-primary": [
      {
        name: "KUSIKILIZA NA KUZUNGUMZA (AWALI)",
        open: true,
        averageScore: 79,
        completion: 74,
        subStrands: [
          { name: "Nyimbo na Michezo", count: 4, averageScore: 81, completion: 77 },
          { name: "Msamiati wa Awali", count: 4, averageScore: 76, completion: 71 },
        ],
      },
      {
        name: "MAANDALIZI YA KUSOMA NA KUANDIKA",
        open: false,
        averageScore: 73,
        completion: 65,
        subStrands: [
          { name: "Utambuzi wa Herufi", count: 4, averageScore: 74, completion: 66 },
        ],
      },
    ],
    "lower-primary": [
      {
        name: "KUSIKILIZA NA KUZUNGUMZA",
        open: true,
        averageScore: 71,
        completion: 66,
        subStrands: [
          { name: "Matamshi", count: 4, averageScore: 73, completion: 68 },
          { name: "Mazungumzo", count: 3, averageScore: 69, completion: 63 },
          { name: "Hadithi", count: 3, averageScore: 72, completion: 67 },
        ],
      },
      {
        name: "KUSOMA",
        open: false,
        averageScore: 68,
        completion: 62,
        subStrands: [
          { name: "Ufahamu", count: 5, averageScore: 66, completion: 59 },
          { name: "Kusoma kwa Ufasaha", count: 4, averageScore: 70, completion: 64 },
        ],
      },
      {
        name: "KUANDIKA",
        open: false,
        averageScore: 67,
        completion: 60,
        subStrands: [
          { name: "Insha", count: 5, averageScore: 64, completion: 56 },
          { name: "Imla", count: 3, averageScore: 70, completion: 63 },
        ],
      },
      {
        name: "SARUFI",
        open: false,
        averageScore: 72,
        completion: 65,
        subStrands: [
          { name: "Ngeli", count: 4, averageScore: 71, completion: 64 },
          { name: "Vitenzi", count: 4, averageScore: 73, completion: 66 },
        ],
      },
    ],
    "upper-primary": [
      {
        name: "UFAHAMU",
        open: true,
        averageScore: 69,
        completion: 61,
        subStrands: [
          { name: "Kusoma kwa Ufahamu", count: 5, averageScore: 70, completion: 63 },
          { name: "Maswali ya Ufahamu", count: 5, averageScore: 67, completion: 58 },
        ],
      },
      {
        name: "INSHA",
        open: false,
        averageScore: 65,
        completion: 55,
        subStrands: [
          { name: "Insha za Masimulizi", count: 4, averageScore: 66, completion: 56 },
          { name: "Insha za Maelezo", count: 4, averageScore: 64, completion: 53 },
        ],
      },
      {
        name: "SARUFI NA MATUMIZI YA LUGHA",
        open: false,
        averageScore: 71,
        completion: 64,
        subStrands: [
          { name: "Aina za Maneno", count: 4, averageScore: 72, completion: 65 },
          { name: "Miundo ya Sentensi", count: 3, averageScore: 70, completion: 62 },
        ],
      },
      {
        name: "FASIHI SIMULIZI",
        open: false,
        averageScore: 74,
        completion: 68,
        subStrands: [
          { name: "Methali na Vitendawili", count: 3, averageScore: 75, completion: 69 },
          { name: "Hadithi za Kimapokeo", count: 3, averageScore: 73, completion: 67 },
        ],
      },
    ],
    "junior-secondary": [
      {
        name: "KUSIKILIZA NA KUZUNGUMZA",
        open: true,
        averageScore: 68,
        completion: 60,
        subStrands: [
          { name: "Hotuba", count: 4, averageScore: 69, completion: 61 },
          { name: "Midahalo", count: 3, averageScore: 66, completion: 57 },
        ],
      },
      {
        name: "UFAHAMU WA KUSOMA",
        open: false,
        averageScore: 66,
        completion: 57,
        subStrands: [
          { name: "Uchambuzi wa Makala", count: 4, averageScore: 64, completion: 54 },
        ],
      },
      {
        name: "USHAIRI NA FASIHI",
        open: false,
        averageScore: 70,
        completion: 62,
        subStrands: [
          { name: "Uchambuzi wa Mashairi", count: 3, averageScore: 71, completion: 63 },
          { name: "Uchambuzi wa Riwaya", count: 3, averageScore: 68, completion: 60 },
        ],
      },
      {
        name: "SARUFI YA JUU",
        open: false,
        averageScore: 69,
        completion: 61,
        subStrands: [
          { name: "Sentensi Ambatani", count: 3, averageScore: 70, completion: 62 },
          { name: "Matumizi ya Lugha ya Juu", count: 3, averageScore: 67, completion: 58 },
        ],
      },
    ],
  },
  CRE: [
    {
      name: "CREATION",
      open: true,
      averageScore: 79,
      completion: 74,
      subStrands: [
        { name: "The Creation Story", count: 4, averageScore: 81, completion: 76 },
        { name: "Caring for Creation", count: 3, averageScore: 77, completion: 71 },
      ],
    },
    {
      name: "THE BIBLE",
      open: false,
      averageScore: 76,
      completion: 70,
      subStrands: [
        { name: "Books of the Bible", count: 4, averageScore: 78, completion: 72 },
        { name: "Bible Stories", count: 5, averageScore: 74, completion: 68 },
      ],
    },
    {
      name: "CHRISTIAN VALUES",
      open: false,
      averageScore: 80,
      completion: 75,
      subStrands: [
        { name: "Honesty", count: 3, averageScore: 82, completion: 78 },
        { name: "Responsibility", count: 3, averageScore: 78, completion: 72 },
      ],
    },
  ],
  ART: [
    {
      name: "CREATING AND PERFORMING",
      open: true,
      averageScore: 85,
      completion: 80,
      subStrands: [
        { name: "Drawing and Painting", count: 5, averageScore: 87, completion: 82 },
        { name: "Music and Movement", count: 4, averageScore: 84, completion: 79 },
        { name: "Drama", count: 3, averageScore: 83, completion: 77 },
      ],
    },
    {
      name: "SPORTS AND GAMES",
      open: false,
      averageScore: 82,
      completion: 78,
      subStrands: [
        { name: "Athletics", count: 4, averageScore: 84, completion: 80 },
        { name: "Ball Games", count: 4, averageScore: 80, completion: 76 },
      ],
    },
  ],
  ENV: [
    {
      name: "THE ENVIRONMENT",
      open: true,
      averageScore: 76,
      completion: 71,
      subStrands: [
        { name: "Weather", count: 4, averageScore: 78, completion: 73 },
        { name: "Soil", count: 3, averageScore: 74, completion: 68 },
        { name: "Water", count: 4, averageScore: 77, completion: 72 },
      ],
    },
    {
      name: "CONSERVATION",
      open: false,
      averageScore: 73,
      completion: 67,
      subStrands: [
        { name: "Waste Management", count: 4, averageScore: 72, completion: 65 },
        { name: "Tree Planting", count: 3, averageScore: 75, completion: 70 },
      ],
    },
  ],
  // Integrated Science (junior secondary, Grade 7-9) — the JSS-level science
  // subject; had no dedicated strand data before (silently fell back to the
  // generic FOUNDATION placeholder for every JSS science class).
  INT: [
    {
      name: "LIVING THINGS AND THEIR ENVIRONMENT",
      open: true,
      averageScore: 70,
      completion: 63,
      subStrands: [
        { name: "Classification of Organisms", count: 5, averageScore: 71, completion: 64 },
        { name: "Ecosystems", count: 4, averageScore: 69, completion: 61 },
      ],
    },
    {
      name: "MATTER AND ENERGY",
      open: false,
      averageScore: 67,
      completion: 58,
      subStrands: [
        { name: "States of Matter", count: 4, averageScore: 69, completion: 60 },
        { name: "Forms of Energy", count: 4, averageScore: 65, completion: 55 },
      ],
    },
    {
      name: "HUMAN BODY SYSTEMS",
      open: false,
      averageScore: 72,
      completion: 65,
      subStrands: [
        { name: "Digestive System", count: 4, averageScore: 73, completion: 67 },
        { name: "Circulatory System", count: 3, averageScore: 71, completion: 63 },
      ],
    },
    {
      name: "FORCES AND MOTION",
      open: false,
      averageScore: 65,
      completion: 56,
      subStrands: [
        { name: "Types of Forces", count: 4, averageScore: 64, completion: 54 },
        { name: "Simple Machines", count: 4, averageScore: 66, completion: 57 },
      ],
    },
  ],
};

// CBC grade bands — PP1 through Grade 9 don't all take the same version of
// a subject: a Grade 1 learner's "Mathematics" strands aren't a JSS
// learner's. Subjects whose strand content genuinely changes by band
// (MAT/ENG/KIS below) are keyed by band; subjects that are already
// band-specific by subject id (e.g. ENV for lower grades vs SCI for upper
// primary vs INT for JSS) stay a flat strand list.
function gradeBandForClass(classId) {
  const group = classes.find((c) => c.id === Number(classId))?.group || "";
  if (group === "PP1" || group === "PP2") return "pre-primary";
  const gradeNum = Number(group.replace(/^Grade /, "")) || 0;
  if (gradeNum >= 1 && gradeNum <= 3) return "lower-primary";
  if (gradeNum >= 4 && gradeNum <= 6) return "upper-primary";
  if (gradeNum >= 7 && gradeNum <= 9) return "junior-secondary";
  return "upper-primary";
}

function defaultStrands(subjectId, classId) {
  const fallback = [
    {
      name: "FOUNDATION",
      open: true,
      averageScore: 74,
      completion: 66,
      subStrands: [
        { name: "Core Skills", count: 5, averageScore: 74, completion: 66 },
        { name: "Practice Tasks", count: 4, averageScore: 72, completion: 62 },
        { name: "Review", count: 3, averageScore: 76, completion: 70 },
      ],
    },
  ];

  const entry = strandPerformance[subjectId];
  if (!entry) return fallback;
  if (Array.isArray(entry)) return entry;

  // band-keyed subject (MAT/ENG/KIS) — resolve by this class's real grade band
  const band = gradeBandForClass(classId);
  return entry[band] || entry["upper-primary"] || fallback;
}

function buildAssignments(subjectId, classId) {
  const strands = defaultStrands(subjectId, classId);
  const rows = [];

  strands.forEach((strand, strandIndex) => {
    strand.subStrands.forEach((sub, subIndex) => {
      if (!sub.count) return;
      rows.push({
        id: `${subjectId}-${classId}-${strandIndex}-${subIndex}`,
        name: `${sub.name} Practice ${subIndex + 1}`,
        strand: `${strand.name} - ${sub.name}`,
        strandName: strand.name,
        deployed: `2026-06-${String(9 - ((strandIndex + subIndex) % 7)).padStart(2, "0")} 09:30:00`,
        status: sub.completion >= 70 ? "Active" : "Needs Review",
        completed: Math.round((sub.completion / 100) * 28),
        total: 28,
        average: sub.averageScore,
      });
    });
  });

  return rows;
}

function buildClassData(subjectId, classId) {
  const classStudents = students.filter((s) => Number(s.classId) === Number(classId));
  const selectedStudents = classStudents.length ? classStudents : students.slice(0, 6);
  const scores = (subjectStudentScores[subjectId] || makeScores(subjectId, 70)).filter((score) =>
    selectedStudents.some((student) => student.id === score.studentId)
  );
  const strands = defaultStrands(subjectId, classId);
  const assignments = buildAssignments(subjectId, classId);
  const average = scores.length
    ? Math.round(scores.reduce((sum, score) => sum + score.latestScore, 0) / scores.length)
    : 0;
  const completion = assignments.length
    ? Math.round(assignments.reduce((sum, assignment) => sum + (assignment.completed / assignment.total) * 100, 0) / assignments.length)
    : 0;

  return {
    stats: {
      totalStudents: selectedStudents.length,
      totalAssignments: assignments.length,
      activeAssignments: assignments.filter((assignment) => assignment.status === "Active").length,
      averageScore: `${average}%`,
      completion: `${completion}%`,
    },
    students: selectedStudents.map((student) => ({
      ...student,
      score: scores.find((score) => score.studentId === student.id)?.latestScore ?? null,
      trend: scores.find((score) => score.studentId === student.id)?.trend ?? "No data",
    })),
    performance: {
      title: "Performance Overview for the Last 6 Months",
      labels: ["Jan-2026", "Feb-2026", "Mar-2026", "Apr-2026", "May-2026", "Jun-2026"],
      values: [Math.max(0, average - 22), Math.max(0, average - 16), Math.max(0, average - 10), average - 4, average - 2, average],
    },
    assignments,
    strands,
    mixedExercises: [
      { name: "Midterm 1", count: 6, averageScore: Math.max(0, average - 6), completion: Math.max(0, completion - 8) },
      { name: "Endterm 1", count: 8, averageScore: average, completion },
      { name: "Midterm 2", count: 5, averageScore: Math.max(0, average - 2), completion: Math.max(0, completion - 3) },
      { name: "Endterm 2", count: 7, averageScore: Math.min(100, average + 4), completion: Math.min(100, completion + 6) },
    ],
  };
}


export const teacherContext = {
  teacher: teachers[0],
  teachers,
  subjects,
  classes,
  students,
  subjectStudentScores,//
};

export const classDataBySubjectClass = {};//
subjects.forEach((subject) => {
  classes.forEach((klass) => {
    classDataBySubjectClass[`${subject.id}::${klass.id}`] =
      buildClassData(subject.id, klass.id);
  });
});

export function getClassMock(subjectId, classId) {
  return classDataBySubjectClass[`${subjectId}::${classId}`] || buildClassData(subjectId, classId);
}

export const classMock = getClassMock("MAT", 12);

/* =========================================================================
 * Everything below derives admin- and parent-facing views from the exact
 * same teachers/classes/students/subjectStudentScores records above. This
 * is the one mock-data file for all three portals — admin, teacher, and
 * parent all import directly from here, so the same student always shows
 * the same name/class/scores everywhere.
 * ========================================================================= */

/* ---- shared helpers for the admin & parent views below ---- */

// admin/parent chart codes → canonical subject ids (CAS is "Creative Arts
// and Sports" = ART in the subject list above)
const SUBJECT_CODE_TO_SHARED = {
  MAT: "MAT",
  ENG: "ENG",
  KIS: "KIS",
  CRE: "CRE",
  CAS: "ART",
  SS: "SS",
  SCI: "SCI",
  AGRI: "AGRI"
};

// real CBC subject offering per grade band — pre-primary/lower-primary
// don't split Science/Social Studies/Agriculture out as separate subjects
// yet (that happens from upper primary onward), so a PP1/PP2/Grade1-3
// learner genuinely has fewer subjects than a Grade4+ learner, not the
// same fixed 8 for everyone regardless of grade.
const SUBJECT_OFFERING_BY_BAND = {
  "pre-primary": ["MAT", "ENG", "KIS", "CAS", "CRE"],
  "lower-primary": ["MAT", "ENG", "KIS", "CAS", "CRE"],
  "upper-primary": ["MAT", "ENG", "KIS", "CAS", "CRE", "SS", "SCI", "AGRI"],
  "junior-secondary": ["MAT", "ENG", "KIS", "CAS", "CRE", "SS", "SCI", "AGRI"],
};

// the 8-code subject list a given class's grade band actually offers — used
// by admin/teacher/parent alike so a student's chart/legend never shows a
// subject their grade doesn't take.
export function getOfferedSubjectCodesForClass(classId) {
  return SUBJECT_OFFERING_BY_BAND[gradeBandForClass(classId)] || Object.keys(SUBJECT_CODE_TO_SHARED);
}

function classNameById(classId) {
  return classes.find((c) => Number(c.id) === Number(classId))?.name || "Not recorded";
}

function subjectNameById(subjectId) {
  return subjects.find((s) => s.id === subjectId)?.name || subjectId;
}

function scoreFor(sharedSubjectId, studentId) {
  const entry = (subjectStudentScores[sharedSubjectId] || []).find((s) => s.studentId === studentId);
  return entry ? entry.latestScore : 0;
}

export function hash(value) {
  return String(value).split("").reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) >>> 0, 7);
}

function firstName(name) {
  return String(name || "").trim().split(/\s+/)[0] || name;
}

/* ---- one shared assignment-status computation for all three portals ----
 * admin's student rows, parent's kid cards, and teacher's student profile
 * all need a "done/retake/pending/ongoing/overdue" breakdown for the same
 * student. Previously each portal invented its own numbers (admin: a fake
 * hash-based generator, parent: hand-typed constants, teacher: a real
 * per-assignment tally) — for the same student these could never agree.
 * This is the one real computation; every portal reads it. */

export function subjectIdsForClass(classId) {
  const ids = new Set();
  teachers.forEach((t) => (t.assignments || []).forEach((a) => {
    if (Number(a.classId) === Number(classId)) ids.add(a.subjectId);
  }));
  return [...ids];
}

export function categorizeAssignment(seed, assignment, isPending) {
  if (isPending) return seed % 3 === 0 ? "overdue" : "pending";
  if (assignment.status === "Needs Review" && seed % 2 === 0) return "retake";
  const m = seed % 10;
  if (m === 0) return "overdue";
  if (m === 1) return "pending";
  if (m === 2) return "ongoing";
  if (m === 3) return "retake";
  return "done";
}

export function getAssignmentSummary(studentId) {
  const summary = { done: 0, retake: 0, pending: 0, ongoing: 0, overdue: 0 };
  const student = students.find((s) => s.id === studentId);
  if (!student) return summary;
  const isPending = student.status === "pending";

  subjectIdsForClass(student.classId).forEach((subjectId) => {
    const classData = getClassMock(subjectId, student.classId);
    (classData.assignments || []).forEach((assignment) => {
      const seed = hash(`${studentId}:${assignment.id}`);
      const category = categorizeAssignment(seed, assignment, isPending);
      if (summary[category] != null) summary[category] += 1;
    });
  });

  return summary;
}

function clampAssignmentScore(n) {
  return Math.max(35, Math.min(99, Math.round(n)));
}

// this student's real result on one real assignment — same hash-seeded
// category/variance approach teacher's student-profile page already used
// (now the one shared version of it, so anything aggregating per-assignment
// scores agrees with the assignment table teacher/parent already show).
export function getStudentAssignmentScore(studentId, subjectId, assignment, isPending) {
  const seed = hash(`${studentId}:${assignment.id}`);
  const category = categorizeAssignment(seed, assignment, isPending);
  const attempted = category === "done" || category === "retake" || category === "ongoing";
  const isScored = category === "done" || category === "retake";
  const base = scoreFor(subjectId, studentId);
  const variance = (seed % 13) - 6;
  const score = isScored && base != null ? clampAssignmentScore(base + variance) : null;
  return { category, attempted, score };
}

// A dated, per-assignment source for scoped analytics. Consumers can supply
// YYYY-MM-DD bounds to calculate a month, term, or academic-year view from
// the same assignments used by the rest of the portal.
export function getStudentAssignmentRecords(studentId, { start, end } = {}) {
  const student = students.find((s) => s.id === studentId);
  if (!student || student.status === "pending") return [];

  const records = [];
  subjectIdsForClass(student.classId).forEach((subjectId) => {
    const classData = getClassMock(subjectId, student.classId);
    const subject = subjectNameById(subjectId);

    (classData.assignments || []).forEach((assignment) => {
      const date = String(assignment.deployed || "").slice(0, 10);
      if (!date || (start && date < start) || (end && date > end)) return;

      const { category, attempted, score } = getStudentAssignmentScore(studentId, subjectId, assignment, false);
      records.push({
        subjectId,
        subject,
        strand: (assignment.strandName || "General")
          .toLowerCase()
          .replace(/\b\w/g, (character) => character.toUpperCase()),
        date,
        category,
        attempted,
        score,
      });
    });
  });

  return records.sort((a, b) => a.date.localeCompare(b.date));
}

// per-student, per-strand averages (e.g. within Mathematics: Numbers vs
// Measurement vs Geometry) — aggregated from real per-assignment scores
// across every subject the student's class actually covers, not a
// subject-level approximation. Sorted ascending by average (weakest first).
// Also carries a real completion rate per strand (scored assignments over
// total assignments seen in that strand).
export function getStudentStrandAverages(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student || student.status === "pending") return [];

  // keyed by subject+strand so an entry can report both, not just a bare
  // strand name — the same strand name can exist under different subjects.
  // Also tallies each assignment's own baked-in class average as a fallback
  // so a subject the student hasn't personally attempted yet (all seeded
  // categories landed on pending/ongoing/overdue) still gets a real strand
  // entry instead of silently vanishing from the breakdown.
  const totals = {};
  subjectIdsForClass(student.classId).forEach((subjectId) => {
    const classData = getClassMock(subjectId, student.classId);
    const subjectName = subjectNameById(subjectId);
    (classData.assignments || []).forEach((assignment) => {
      const strandName = (assignment.strandName || "General")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      const key = `${subjectId}::${strandName}`;
      if (!totals[key]) {
        totals[key] = { subject: subjectName, strand: strandName, sum: 0, count: 0, total: 0, fallbackSum: 0, fallbackCount: 0 };
      }
      totals[key].total += 1;
      totals[key].fallbackSum += Number(assignment.average) || 0;
      totals[key].fallbackCount += 1;
      const { score } = getStudentAssignmentScore(studentId, subjectId, assignment, false);
      if (score == null) return;
      totals[key].sum += score;
      totals[key].count += 1;
    });
  });

  const entries = Object.values(totals)
    .map(({ subject, strand, sum, count, total, fallbackSum, fallbackCount }) => ({
      subject,
      strand,
      average: count > 0
        ? Math.round(sum / count)
        : fallbackCount ? Math.round(fallbackSum / fallbackCount) : 0,
      completion: total ? Math.round((count / total) * 100) : 0,
    }))
    .filter((e) => e.average > 0);

  entries.sort((a, b) => a.average - b.average);
  return entries;
}

export function getStudentStrandBreakdown(studentId) {
  const entries = getStudentStrandAverages(studentId);
  if (!entries.length) return { weakAreas: [] };

  // every strand+subject combo under 70% is a real weak area — list all of
  // them (capped so the card doesn't run away), or fall back to the single
  // lowest one so there's always something to show.
  const weakAreas = entries.filter((e) => e.average < 70).slice(0, 3);
  return { weakAreas: weakAreas.length ? weakAreas : [entries[0]] };
}

// real calendar dates the student was actually engaged on — every
// assignment whose category is done/retake/ongoing (i.e. attempted) using
// its own real `deployed` date. Used to compute genuine active-day counts
// and streaks instead of an invented number.
export function getStudentActivityDates(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student || student.status === "pending") return [];

  const dates = new Set();
  subjectIdsForClass(student.classId).forEach((subjectId) => {
    const classData = getClassMock(subjectId, student.classId);
    (classData.assignments || []).forEach((assignment) => {
      const { attempted } = getStudentAssignmentScore(studentId, subjectId, assignment, false);
      if (!attempted) return;
      const date = String(assignment.deployed || "").slice(0, 10);
      if (date) dates.add(date);
    });
  });

  return [...dates].sort();
}

// real scored-assignment history (date + score) across every subject the
// student's class covers, sorted oldest-first — used to detect a genuine
// improving/declining/stable trend from actual recent scores rather than
// an invented "last 6 assessments" figure.
export function getStudentScoreHistory(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student || student.status === "pending") return [];

  const history = [];
  subjectIdsForClass(student.classId).forEach((subjectId) => {
    const classData = getClassMock(subjectId, student.classId);
    (classData.assignments || []).forEach((assignment) => {
      const { score } = getStudentAssignmentScore(studentId, subjectId, assignment, false);
      if (score == null) return;
      history.push({ date: String(assignment.deployed || "").slice(0, 10), score });
    });
  });

  history.sort((a, b) => a.date.localeCompare(b.date));
  return history;
}

/* =========================================================================
 * Admin-facing views — row/object shapes legacy.js and admin's ui/ modules
 * consume. Presentation-only constants (filters, themes, hero images,
 * subject labels) have no canonical equivalent and live only here.
 * ========================================================================= */

export const filters = [
  "All Classes",
  "PP1",
  "PP2",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9"
];

export const themes = {
  pp1: { className: "pp1", color: "#a8cf3d", soft: "#ecf8bf", deep: "#6f8f18" },
  pp2: { className: "pp2", color: "#b57b80", soft: "#f2d8da", deep: "#7e444b" },
  "grade-1": { className: "grade-1", color: "#b596d6", soft: "#eadfff", deep: "#7a579f" },
  "grade-2": { className: "grade-2", color: "#8ecbeb", soft: "#ddf5ff", deep: "#4f88a8" },
  "grade-3": { className: "grade-3", color: "#d98a88", soft: "#ffe0dd", deep: "#9b514f" },
  "grade-4": { className: "grade-4", color: "#f4cf87", soft: "#fff4cf", deep: "#9a7332" },
  "grade-5": { className: "grade-5", color: "#9fbd78", soft: "#e7f3d8", deep: "#5e7d3a" },
  "grade-6": { className: "grade-6", color: "#efb06f", soft: "#ffe7ca", deep: "#a76627" },
  "grade-7": { className: "grade-7", color: "#a9aeb2", soft: "#edf0f2", deep: "#626a70" },
  "grade-8": { className: "grade-8", color: "#b18663", soft: "#ead5bf", deep: "#725038" },
  "grade-9": { className: "grade-9", color: "#b87472", soft: "#f3d8d6", deep: "#7e4545" },
  teacher: { className: "teacher", color: "#4d6676", soft: "#edf4f6", deep: "#243949" }
};

export const heroImages = {
  pp1: "assets/images/pp_1.webp",
  pp2: "assets/images/pp_2.webp",
  "grade-1": "assets/images/grade_1.webp",
  "grade-2": "assets/images/grade_2.webp",
  "grade-3": "assets/images/grade_3.webp",
  "grade-4": "assets/images/grade_4.webp",
  "grade-5": "assets/images/grade_5.webp",
  "grade-6": "assets/images/grade_6.webp",
  "grade-7": "assets/images/grade_7.webp",
  "grade-8": "assets/images/grade_8.webp",
  "grade-9": "assets/images/grade_9.webp"
};

export const subjectLabels = {
  MAT: "MATHEMATICS",
  ENG: "ENGLISH",
  KIS: "KISWAHILI",
  CRE: "CRE",
  CAS: "CREATIVE ARTS AND SPORTS",
  SS: "SOCIAL STUDIES",
  SCI: "SCIENCE AND TECHNOLOGY",
  AGRI: "AGRICULTURE AND NUTRITION"
};

// derived from the canonical subject list above (was hand-typed and had
// drifted: wrong spellings vs. the real records, a "History" subject that
// doesn't exist anywhere, and two missing real subjects).
export const subjectOptions = subjects.map((s) => s.name);

// one shared performance computation for a student — scores/classAverage
// (per the 8 core subject codes admin/parent both chart), the overall
// average, "engagement" (share of real assignments actively worked vs
// sitting untouched, from the same getAssignmentSummary() everything else
// uses), and the strongest-subject code. Admin, parent, and teacher's
// "overall" (non teacher-scoped) metrics all read this same computation so
// the same student shows the same numbers everywhere.
export function getStudentPerformanceProfile(studentId) {
  const student = students.find((s) => s.id === studentId);
  const scores = {};
  const classAverage = {};
  if (!student) {
    return { scores, classAverage, average: 0, engagement: "-", bestSubjectCode: null };
  }

  const isPending = student.status === "pending";
  const classmates = students.filter(
    (s) => Number(s.classId) === Number(student.classId) && s.status !== "pending"
  );

  // only the subjects this student's grade band actually offers — a PP1
  // learner and a Grade 9 learner don't take the same subjects.
  const offeredCodes = SUBJECT_OFFERING_BY_BAND[gradeBandForClass(student.classId)]
    || Object.keys(SUBJECT_CODE_TO_SHARED);

  offeredCodes.forEach((code) => {
    const sharedId = SUBJECT_CODE_TO_SHARED[code];
    scores[code] = isPending ? 0 : scoreFor(sharedId, studentId);
    const values = classmates.map((mate) => scoreFor(sharedId, mate.id)).filter((v) => v > 0);
    classAverage[code] = values.length
      ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
      : 0;
  });

  const scored = Object.values(scores).filter((v) => v > 0);
  const average = scored.length
    ? Math.round(scored.reduce((sum, v) => sum + v, 0) / scored.length)
    : 0;

  let bestSubjectCode = null;
  let bestScore = 0;
  Object.entries(scores).forEach(([code, value]) => {
    if (value > bestScore) {
      bestScore = value;
      bestSubjectCode = code;
    }
  });

  const summary = getAssignmentSummary(studentId);
  const totalAssignments = summary.done + summary.retake + summary.pending + summary.ongoing + summary.overdue;
  const activeAssignments = summary.done + summary.retake + summary.ongoing;
  const engagement = totalAssignments ? `${Math.round((activeAssignments / totalAssignments) * 100)}%` : "-";

  // full canonical subject name for consumers that don't use the 8-code
  // admin/parent convention directly (e.g. teacher's own subject list)
  const bestSubjectName = bestSubjectCode
    ? subjectNameById(SUBJECT_CODE_TO_SHARED[bestSubjectCode])
    : null;

  return { scores, classAverage, average, engagement, bestSubjectCode, bestSubjectName };
}

// per-subject breakdown (name, average, class average, rank) for the same 8
// codes getStudentPerformanceProfile already scores — no separate scoring
// logic, just decorated + ranked for consumers that need a subject list
// rather than a code-keyed map (e.g. the insights engine).
export function getStudentSubjectBreakdown(studentId) {
  const profile = getStudentPerformanceProfile(studentId);
  const rows = Object.entries(profile.scores)
    .map(([code, average]) => ({
      code,
      name: subjectNameById(SUBJECT_CODE_TO_SHARED[code]),
      average,
      classAverage: profile.classAverage[code] || 0,
    }))
    .filter((row) => row.average > 0)
    .sort((a, b) => b.average - a.average)
    .map((row, index, arr) => ({ ...row, rank: index + 1, outOf: arr.length }));

  return rows;
}

function buildAssignmentSummary(student) {
  return getAssignmentSummary(student.id);
}

function buildStudentRow(student) {
  const profile = getStudentPerformanceProfile(student.id);
  const { scores, classAverage, average: performance, engagement, bestSubjectName } = profile;
  const active = student.status !== "pending";

  return {
    id: student.id,
    classId: student.classId,
    name: student.name,
    nickname: String(student.name).trim().split(/\s+/)[0],
    admissionNumber: student.admissionNo || "Not recorded",
    guardian: student.guardian || "Not recorded",
    contact: student.guardianContact || "Not recorded",
    inviteStatus: student.invite || (active ? "Accepted" : "Pending"),
    active,
    engagement,
    performance,
    bestSubjectName,
    assignmentSummary: buildAssignmentSummary(student),
    scores,
    classAverage
  };
}

export const studentRows = students.map(buildStudentRow);

// Every row is derived live from the canonical teacher records above, so it
// can never drift out of sync with what the teacher app itself shows.
export const teacherRows = teachers.flatMap((teacher) =>
  (teacher.assignments || []).map((a) => [
    teacher.name,
    subjectNameById(a.subjectId),
    a.role,
    classNameById(a.classId),
    Number(a.classId)
  ])
);

export const teacherDirectory = teachers.map((teacher) => ({
  id: teacher.id,
  name: teacher.name,
  contact: teacher.contact,
  email: teacher.email,
  subjects: [...new Set((teacher.assignments || []).map((a) => subjectNameById(a.subjectId)))],
  classes: [...new Set((teacher.assignments || []).map((a) => classNameById(a.classId)))],
  assignments: (teacher.assignments || []).map((a) => ({
    subject: subjectNameById(a.subjectId),
    className: classNameById(a.classId),
    role: a.role
  }))
}));

/* =========================================================================
 * Parent-facing views — Kevin Kamau's seven children (ids 1023, 1027-1033)
 * are canonical students above. Presentation-only bits with no canonical
 * equivalent (avatar art, plan/license countdown, per-kid assignment-status
 * counters, notification copy) live only here.
 * ========================================================================= */

const parentSchool = { name: "Esoma School", town: "Thika" };

export const parent = {
  name: "Kevin",
  fullName: "Kevin Kamau",
  contact: "0721859532",
  email: "kevin.kamau@gmail.com",
};

export const avatarThemes = {
  buffalo: { c1: "#e3c7ae", c2: "#f6ebdd", soft: "#f6ebdd", ink: "#5d3a1e", accent: "#8a5a3b" },
  "0":     { c1: "#f0d5b1", c2: "#faefdd", soft: "#faefdd", ink: "#6b4312", accent: "#a9743f" }, // monkey
  lion:    { c1: "#fcd9a0", c2: "#fdf0d4", soft: "#fdf0d4", ink: "#7a4d05", accent: "#e8930c" },
  elephant:{ c1: "#ccd8e6", c2: "#e9eef5", soft: "#e9eef5", ink: "#33455c", accent: "#6b7a8d" },
};

// presentation-only decoration with no canonical equivalent, keyed by the
// canonical student id — identity (name/class/grade) and assignment counts
// (done/ongoing/pending/retakes) are derived live below instead, from the
// same getAssignmentSummary() admin and teacher use for the same student.
const KID_DECORATION = {
  1023: { gender: "NONE",    avatar: "buffalo",  plan: "Monthly", daysLeft: 158 },
  1027: { gender: "FEMALE",  avatar: "0",        plan: "Monthly", daysLeft: 158 },
  1028: { gender: "MALE",    avatar: "0",        plan: "Monthly", daysLeft: 158 },
  1029: { gender: "FEMALE",  avatar: "lion",     plan: "Monthly", daysLeft: 19 },
  1030: { gender: "NONE",    avatar: "0",        plan: "Monthly", daysLeft: 158 },
  1031: { gender: "MALE",    avatar: "elephant", plan: "Monthly", daysLeft: 5 },
  1032: { gender: "MALE",    avatar: "0",        plan: "Monthly", daysLeft: 158 },
  1033: { gender: "FEMALE",  avatar: "lion",     plan: "Monthly", daysLeft: -3 },
};

// stream words in use today are compass directions, but the code is written
// generically enough to also cover color-named streams if any class is ever
// named that way (Blue/Yellow reserved below even though unused right now).
const STREAM_LETTERS = {
  North: "North",
  South: "South",
  East: "East",
  West: "West",
  Central: "Central",
  "North East": "NE",
  Blue: "Blue",
  Yellow: "Yellow",
};

function streamCode(classItem) {
  const level = classItem.group.replace(/^Grade /, ""); // "1".."9", or "PP1"/"PP2" unchanged
  const stream = classItem.name.replace(classItem.group, "").trim();
  const letter = STREAM_LETTERS[stream] || stream.slice(0, 1).toUpperCase();
  return `Grade ${level} ${letter}`;
}

function gradeCodeById(classId) {
  const classItem = classes.find((c) => c.id === Number(classId));
  return classItem ? streamCode(classItem) : "";
}

export const kids = Object.keys(KID_DECORATION).map((idKey) => {
  const id = Number(idKey);
  const student = students.find((item) => item.id === id);
  const summary = getAssignmentSummary(id);
  return {
    id,
    name: firstName(student?.name),
    cls: classNameById(student?.classId),
    grade: gradeCodeById(student?.classId),
    school: parentSchool.name,
    town: parentSchool.town,
    done: summary.done,
    ongoing: summary.ongoing,
    pending: summary.pending,
    retakes: summary.retake,
    ...KID_DECORATION[id],
  };
});

// parent-reported question-issue notifications (admin review flow) — a
// separate concern from the assignment-deployed/due-soon ones built after
// reports below, merged together into the one exported `notifications`.
const reportIssueNotifications = [
  {
    id: "n1",
    kidId: 1023,
    question: "Mathematics - Fractions Practice 2, Q3",
    status: "Resolved",
    message: "Admin reviewed your report: the question had a wrong answer key. It has been corrected and Timothy's score updated.",
    time: "Today, 08:40",
    read: false,
  },
  {
    id: "n2",
    kidId: 1029,
    question: "English - Comprehension Set 1, Q7",
    status: "Under Review",
    message: "Your report was received and the admin is reviewing the question.",
    time: "Yesterday, 16:05",
    read: false,
  },
  {
    id: "n3",
    kidId: 1031,
    question: "Environmental Activities - Weather Quiz, Q1",
    status: "Pending",
    message: "Your report has been received and is waiting for an admin to pick it up.",
    time: "Mon, 11:20",
    read: true,
  },
];

export const subjectKey = [
  ["AGRI", "Agriculture and Nutrition"],
  ["CRE", "CRE"],
  ["CAS", "Creative Arts and Sports"],
  ["ENG", "English"],
  ["KIS", "Kiswahili"],
  ["MAT", "Mathematics"],
  ["SCI", "Science and Technology"],
  ["SS", "Social Studies"],
];

// the real teacher for this subject+class, same lookup admin/teacher already
// do — a subject can be taught by different teachers in different classes,
// so this must match on classId too, not just subjectId.
function teacherForClassSubject(sharedSubjectId, classId) {
  for (const teacher of teachers) {
    const match = (teacher.assignments || []).find(
      (a) => a.subjectId === sharedSubjectId && Number(a.classId) === Number(classId)
    );
    if (match) return teacher.name;
  }
  return classes.find((c) => Number(c.id) === Number(classId))?.classTeacher || "Class Teacher";
}

export const reports = {};
kids.forEach((kid) => {
  const studentRecord = students.find((item) => item.id === kid.id);
  const classId = studentRecord?.classId;

  // this kid's real grade-band subject list — a PP1/lower-primary learner
  // has fewer subjects than an upper-primary/JSS one, not the same fixed 8
  // for every kid. subjectKey stays the filter source so display order/
  // labels stay consistent everywhere else that reads subjectKey.
  const offeredCodes = SUBJECT_OFFERING_BY_BAND[gradeBandForClass(classId)]
    || subjectKey.map(([code]) => code);
  const kidSubjectKey = subjectKey.filter(([code]) => offeredCodes.includes(code));
  const subjectCodes = kidSubjectKey.map(([code]) => code);

  // same shared computation admin/teacher use for this exact student, so the
  // chart, average, engagement, and strongest subject all agree everywhere.
  const profile = getStudentPerformanceProfile(kid.id);
  const studentScores = subjectCodes.map((code) => profile.scores[code] || 0);
  const classAvgScores = subjectCodes.map((code) => profile.classAverage[code] || 0);
  const bestIndex = subjectCodes.indexOf(profile.bestSubjectCode);

  // real, class-appropriate assignments — one per subject this kid's class
  // actually covers, pulled from the same per-class data admin/teacher
  // already render (real strand-based names, real deploy dates), with a
  // per-student score variation seeded the same way student-profile.js
  // does it (no separate/invented randomization scheme). A pending student
  // hasn't actually attempted anything — score stays null (not a fabricated
  // percentage) so this can't disagree with their 0% engagement/average.
  const isPendingForAssignments = studentRecord?.status === "pending";
  const assignments = subjectCodes.flatMap((code) => {
    const sharedSubjectId = SUBJECT_CODE_TO_SHARED[code];
    const classData = getClassMock(sharedSubjectId, classId);
    const subjectName = subjectNameById(sharedSubjectId);
    const teacherName = teacherForClassSubject(sharedSubjectId, classId);
    const base = scoreFor(sharedSubjectId, kid.id) || 60;

    return (classData.assignments || []).slice(0, 1).map((assignment) => {
      const seed = hash(`${kid.id}:${assignment.id}`);
      const variance = (seed % 13) - 6;
      return {
        title: assignment.name,
        subject: subjectName,
        teacher: teacherName,
        last: assignment.deployed,
        score: isPendingForAssignments ? null : Math.max(0, Math.min(100, base + variance)),
      };
    });
  });

  reports[kid.id] = {
    engagement: profile.engagement,
    average: `${profile.average.toFixed(2)}%`,
    bestSubject: bestIndex >= 0 ? kidSubjectKey[bestIndex][1] : "-",
    assignments,
    chart: {
      subjects: kidSubjectKey,
      student: studentScores,
      classAvg: classAvgScores,
    },
  };
});

/* =========================================================================
 * Assignment-deployed / due-soon notifications — real data only: which
 * teacher deployed which real assignment for which real kid, and when it's
 * really due. No invented names or dates; everything here traces back to
 * the same teachers/getClassMock data every portal already renders from.
 * ========================================================================= */

function addDays(dateStr, days) {
  const d = new Date(dateStr.replace(" ", "T"));
  d.setDate(d.getDate() + days);
  return d;
}

function toDateOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatNotifDate(d) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

// how many days a learner gets to complete an assignment after it's posted.
const ASSIGNMENT_DUE_DAYS = 7;

// "today" in this mock world = the latest real deploy date already present
// in the data, not a hardcoded guess — stays correct if the underlying
// dates ever shift.
let latestDeployMs = -Infinity;
Object.values(reports).forEach((r) => {
  r.assignments.forEach((a) => {
    const t = new Date(a.last.replace(" ", "T")).getTime();
    if (t > latestDeployMs) latestDeployMs = t;
  });
});
const MOCK_TODAY = toDateOnly(new Date(latestDeployMs));
const MOCK_TOMORROW = toDateOnly(addDays(`${MOCK_TODAY.getFullYear()}-${String(MOCK_TODAY.getMonth() + 1).padStart(2, "0")}-${String(MOCK_TODAY.getDate()).padStart(2, "0")}`, 1));

const assignmentNotifications = [];

kids.forEach((kid) => {
  const reportRows = reports[kid.id]?.assignments || [];
  if (!reportRows.length) return;

  const classId = students.find((s) => s.id === kid.id)?.classId;
  const classTeacherName = classes.find((c) => Number(c.id) === Number(classId))?.classTeacher;
  const offeredCodes = SUBJECT_OFFERING_BY_BAND[gradeBandForClass(classId)] || subjectKey.map(([code]) => code);
  const kidSubjectKeyForNotifs = subjectKey.filter(([code]) => offeredCodes.includes(code));

  // the single most-recently-deployed real assignment for this kid, across
  // their real offered subjects — prefer one taught by an actual subject
  // specialist over the class-teacher fallback when several tie on the same
  // date, since that's the more meaningful "who deployed this" to name.
  let newest = null;
  reportRows.forEach((row) => {
    const t = new Date(row.last.replace(" ", "T")).getTime();
    const isFallbackTeacher = row.teacher === classTeacherName;
    if (!newest || t > newest._t || (t === newest._t && newest._fallback && !isFallbackTeacher)) {
      newest = { ...row, _t: t, _fallback: isFallbackTeacher };
    }
  });

  if (newest) {
    const due = addDays(newest.last, ASSIGNMENT_DUE_DAYS);
    assignmentNotifications.push({
      id: `assign-new-${kid.id}`,
      kidId: kid.id,
      title: "New Assignment",
      message: `${newest.teacher} added "${newest.title}" (${newest.subject}) for ${kid.name} — due ${formatNotifDate(due)}.`,
      time: "Today, 09:30",
      read: false,
    });
  }

  // scan every real assignment across this kid's offered subjects (not just
  // the single most-recent one per subject) for anything due tomorrow.
  kidSubjectKeyForNotifs.forEach(([code]) => {
    const sharedSubjectId = SUBJECT_CODE_TO_SHARED[code];
    const classData = getClassMock(sharedSubjectId, classId);
    const subjectName = subjectNameById(sharedSubjectId);
    const teacherName = teacherForClassSubject(sharedSubjectId, classId);

    (classData.assignments || []).forEach((assignment) => {
      const due = toDateOnly(addDays(assignment.deployed, ASSIGNMENT_DUE_DAYS));
      if (due.getTime() !== MOCK_TOMORROW.getTime()) return;

      assignmentNotifications.push({
        id: `assign-due-${kid.id}-${assignment.id}`,
        kidId: kid.id,
        title: "Assignment Due Tomorrow",
        message: `${teacherName}'s "${assignment.name}" (${subjectName}) for ${kid.name} is due tomorrow, ${formatNotifDate(due)}.`,
        time: "Today, 09:30",
        read: false,
      });
    });
  });
});

// assignment notifications first (most actionable/time-sensitive), then the
// parent-reported question-issue ones.
export const notifications = [...assignmentNotifications, ...reportIssueNotifications];
