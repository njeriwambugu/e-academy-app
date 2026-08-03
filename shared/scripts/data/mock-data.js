import { firstName } from "../utils/string-utils.js";

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
      { id: 5118, subjectId: "ENV", classId: 13, role: "Co-Teacher" },
      { id: 5119, subjectId: "COMP", classId: 12, role: "Main" },
      { id: 5120, subjectId: "COMP", classId: 11, role: "Co-Teacher" },
      { id: 5121, subjectId: "SS", classId: 11, role: "Main" },
      { id: 5122, subjectId: "SS", classId: 12, role: "Assistant" },
      { id: 5124, subjectId: "AGRI", classId: 12, role: "Main" },
      { id: 5126, subjectId: "PTECH", classId: 11, role: "Main" }

    ]

  },

  {
    id: 2,
    name: "Mrs Jane",
    contact: "0712456789",
    email: "jane@esoma.com",

    assignments: [
      { id: 5008, subjectId: "ENG", classId: 10, role: "Main" },
      { id: 5009, subjectId: "ENG", classId: 9, role: "Co-Teacher" },
      { id: 5201, subjectId: "ENG", classId: 1, role: "Main" },    // PP1 North
      { id: 5223, subjectId: "ENG", classId: 8, role: "Main" },    // Grade 5 South
      { id: 5237, subjectId: "AGRI", classId: 11, role: "Main" },  // Grade 8 South
      { id: 5239, subjectId: "ENG", classId: 11, role: "Main" },   // Grade 8 South
      { id: 5246, subjectId: "ENG", classId: 13, role: "Main" }    // Grade 1 East
    ]

  },

  {
    id: 3,
    name: "Mr David",
    contact: "0722345678",
    email: "david@esoma.com",

    assignments: [
      { id: 5010, subjectId: "SCI", classId: 8, role: "Main" },
      { id: 5011, subjectId: "BIO", classId: 12, role: "Assistant" },
      { id: 5215, subjectId: "AGRI", classId: 7, role: "Main" },   // Grade 4 North
      { id: 5226, subjectId: "AGRI", classId: 9, role: "Main" },   // Grade 6 West
      { id: 5235, subjectId: "SCI", classId: 10, role: "Main" },   // Grade 7 Central
      { id: 5244, subjectId: "SCI", classId: 12, role: "Main" },   // Grade 9 North
      { id: 5254, subjectId: "SCI", classId: 14, role: "Main" }    // Grade 5 West
    ]
  },

  {
    id: 4,
    name: "Ms Sarah",
    contact: "0733456789",
    email: "sarah@esoma.com",
    assignments: [
      { id: 5012, subjectId: "SS", classId: 6, role: "Main" },
      { id: 5013, subjectId: "MAT", classId: 5, role: "Temporary" },
      { id: 5202, subjectId: "MAT", classId: 1, role: "Main" },    // PP1 North
      { id: 5209, subjectId: "MAT", classId: 4, role: "Main" },    // Grade 1 North
      { id: 5219, subjectId: "MAT", classId: 7, role: "Main" },    // Grade 4 North
      { id: 5236, subjectId: "SS", classId: 10, role: "Main" },    // Grade 7 Central
      { id: 5253, subjectId: "MAT", classId: 14, role: "Main" },   // Grade 5 West
      { id: 5255, subjectId: "SS", classId: 14, role: "Main" }     // Grade 5 West
    ]

  },

  {
    id: 5,
    name: "Mr Peter",
    contact: "0744567890",
    email: "peter@esoma.com",
    assignments: [
      { id: 5014, subjectId: "COMP", classId: 12, role: "Main" },
      { id: 5015, subjectId: "COMP", classId: 11, role: "Co-Teacher" },
      { id: 5220, subjectId: "AGRI", classId: 8, role: "Main" },   // Grade 5 South
      { id: 5231, subjectId: "AGRI", classId: 10, role: "Main" },  // Grade 7 Central
      { id: 5240, subjectId: "KIS", classId: 11, role: "Main" },   // Grade 8 South
      { id: 5249, subjectId: "AGRI", classId: 14, role: "Main" }   // Grade 5 West
    ]

  },

  {
    id: 6,
    name: "Mrs Emily",
    contact: "0755678901",
    email: "emily@esoma.com",

    assignments: [
      { id: 5016, subjectId: "MAT", classId: 10, role: "Main" },
      { id: 5017, subjectId: "SCI", classId: 9, role: "Assistant" },
      { id: 5205, subjectId: "MAT", classId: 3, role: "Main" },    // PP2 North East
      { id: 5214, subjectId: "MAT", classId: 6, role: "Main" },    // Grade 3 East
      { id: 5224, subjectId: "MAT", classId: 8, role: "Main" },    // Grade 5 South
      { id: 5248, subjectId: "MAT", classId: 13, role: "Main" }    // Grade 1 East
    ]

  },

  {
    id: 7,
    name: "Mr Joseph",
    contact: "0766789012",
    email: "joseph@esoma.com",

    assignments: [
      { id: 5018, subjectId: "BIO", classId: 12, role: "Main" },
      { id: 5019, subjectId: "CRE", classId: 1, role: "Temporary" },
      { id: 5203, subjectId: "CRE", classId: 3, role: "Main" },    // PP2 North East
      { id: 5211, subjectId: "CRE", classId: 5, role: "Main" },    // Grade 2 North East
      { id: 5222, subjectId: "CRE", classId: 8, role: "Main" },    // Grade 5 South
      { id: 5233, subjectId: "CRE", classId: 10, role: "Main" },   // Grade 7 Central
      { id: 5250, subjectId: "CRE", classId: 14, role: "Main" }    // Grade 5 West
    ]

  },

  {
    id: 8,
    name: "Mr Augustine",
    contact: "0777890123",
    email: "augustine@esoma.com",

    assignments: [
      { id: 5020, subjectId: "SS", classId: 7, role: "Main" },
      { id: 5021, subjectId: "ENG", classId: 6, role: "Co-Teacher" },
      { id: 5217, subjectId: "ENG", classId: 7, role: "Main" },    // Grade 4 North
      { id: 5225, subjectId: "SS", classId: 8, role: "Main" },     // Grade 5 South
      { id: 5230, subjectId: "SS", classId: 9, role: "Main" },     // Grade 6 West
      { id: 5243, subjectId: "ENG", classId: 12, role: "Main" },   // Grade 9 North
      { id: 5251, subjectId: "ENG", classId: 14, role: "Main" }    // Grade 5 West
    ]

  },

  {
    id: 9,
    name: "Ms Gloria",
    contact: "0788901234",
    email: "gloria@esoma.com",

    assignments: [
      { id: 5022, subjectId: "KIS", classId: 8, role: "Main" },
      { id: 5023, subjectId: "KIS", classId: 5, role: "Assistant" },
      { id: 5204, subjectId: "KIS", classId: 3, role: "Main" },    // PP2 North East
      { id: 5208, subjectId: "KIS", classId: 4, role: "Main" },    // Grade 1 North
      { id: 5213, subjectId: "KIS", classId: 6, role: "Main" },    // Grade 3 East
      { id: 5218, subjectId: "KIS", classId: 7, role: "Main" },    // Grade 4 North
      { id: 5229, subjectId: "KIS", classId: 9, role: "Main" },    // Grade 6 West
      { id: 5234, subjectId: "KIS", classId: 10, role: "Main" },   // Grade 7 Central
      { id: 5247, subjectId: "KIS", classId: 13, role: "Main" }    // Grade 1 East
    ]

  },

  {
    id: 10,
    name: "Mr Thomas",
    contact: "0799012345",
    email: "thomas@esoma.com",

    assignments: [
      { id: 5024, subjectId: "CRE", classId: 13, role: "Main" },
      { id: 5025, subjectId: "ENV", classId: 1, role: "Temporary" },
      { id: 5207, subjectId: "CRE", classId: 4, role: "Main" },    // Grade 1 North
      { id: 5216, subjectId: "CRE", classId: 7, role: "Main" },    // Grade 4 North
      { id: 5228, subjectId: "CRE", classId: 9, role: "Main" },    // Grade 6 West
      { id: 5242, subjectId: "CRE", classId: 12, role: "Main" }    // Grade 9 North
    ]

  },

  {
    id: 11,
    name: "Mrs Ruth",
    contact: "0700123456",
    email: "ruth@esoma.com",

    assignments: [
      { id: 5026, subjectId: "ART", classId: 3, role: "Main" },
      { id: 5027, subjectId: "ART", classId: 14, role: "Assistant" },
      { id: 5200, subjectId: "ART", classId: 1, role: "Main" },    // PP1 North
      { id: 5206, subjectId: "ART", classId: 4, role: "Main" },    // Grade 1 North
      { id: 5210, subjectId: "ART", classId: 5, role: "Main" },    // Grade 2 North East
      { id: 5212, subjectId: "ART", classId: 6, role: "Main" },    // Grade 3 East
      { id: 5227, subjectId: "ART", classId: 9, role: "Main" },    // Grade 6 West
      { id: 5238, subjectId: "ART", classId: 11, role: "Main" },   // Grade 8 South
      { id: 5245, subjectId: "ART", classId: 13, role: "Main" }    // Grade 1 East
    ]

  },

  {
    id: 12,
    name: "Mr Benjamin",
    contact: "0711234567",
    email: "benjamin@esoma.com",

    assignments: [
      { id: 5028, subjectId: "SCI", classId: 7, role: "Co-Teacher" },
      { id: 5029, subjectId: "COMP", classId: 11, role: "Main" },
      { id: 5221, subjectId: "ART", classId: 8, role: "Main" },    // Grade 5 South
      { id: 5232, subjectId: "ART", classId: 10, role: "Main" },   // Grade 7 Central
      { id: 5241, subjectId: "ART", classId: 12, role: "Main" },   // Grade 9 North
      { id: 5252, subjectId: "KIS", classId: 14, role: "Main" }    // Grade 5 West
    ]

  }
];


export const classes = [
  { id: 1, name: "PP1 North", group: "PP1", theme: "pp1", classTeacher: "Mrs Lilian Achieng" },
  { id: 3, name: "PP2 North East", group: "PP2", theme: "pp2", classTeacher: "Mrs Caroline Njeri" },
  { id: 4, name: "Grade 1 North", group: "Grade 1", theme: "grade-1", classTeacher: "Mr Kevin Otieno" },
  { id: 5, name: "Grade 2 North East", group: "Grade 2", theme: "grade-2", classTeacher: "Mrs Faith Wambui" },
  { id: 6, name: "Grade 3 East", group: "Grade 3", theme: "grade-3", classTeacher: "Mr Dennis Kariuki" },
  { id: 7, name: "Grade 4 North", group: "Grade 4", theme: "grade-4", classTeacher: "Mrs Beatrice Nyokabi" },
  { id: 8, name: "Grade 5 South", group: "Grade 5", theme: "grade-5", classTeacher: "Mr Victor Mutua" },
  { id: 9, name: "Grade 6 West", group: "Grade 6", theme: "grade-6", classTeacher: "Mrs Alice Chebet" },
  { id: 10, name: "Grade 7 Central", group: "Grade 7", theme: "grade-7", classTeacher: "Mr Patrick Onyango" },
  { id: 11, name: "Grade 8 South", group: "Grade 8", theme: "grade-8", classTeacher: "Mrs Winnie Adhiambo" },
  { id: 12, name: "Grade 9 North", group: "Grade 9", theme: "grade-9", classTeacher: "Mr Charles Kimani" },
  { id: 13, name: "Grade 1 East", group: "Grade 1", theme: "grade-1", classTeacher: "Mrs Grace Wanjiku" },
  { id: 14, name: "Grade 5 West", group: "Grade 5", theme: "grade-5", classTeacher: "Mr Eliud Mwendwa" }
];

const students = [
  // PP2 North East (classId 3) — Mr Sammy: English, Creative Arts & Sports
  { id: 1001, name: "Baraka Otieno", classId: 3, admissionNo: "EA-2026-PP2-001", status: "active", invite: "Accepted" },
  { id: 1002, name: "Zawadi Achieng", classId: 3, admissionNo: "EA-2026-PP2-002", status: "active", invite: "Accepted" },
  { id: 1003, name: "Imani Wanjiru", classId: 3, admissionNo: "EA-2026-PP2-003", status: "pending", invite: "Pending" },
  { id: 1004, name: "Jayden Kiprono", classId: 3, admissionNo: "EA-2026-PP2-004", status: "active", invite: "Accepted" },
  { id: 1005, name: "Neema Mwikali", classId: 3, admissionNo: "EA-2026-PP2-005", status: "active", invite: "Accepted" },
  { id: 1006, name: "Tevin Omondi", classId: 3, admissionNo: "EA-2026-PP2-006", status: "pending", invite: "Pending" },

  // Grade 8 South (classId 11) — Mr Sammy: Mathematics, Science & Technology, CRE,
  // Computer Studies, Social Studies, Pre-Technical Studies
  { id: 1007, name: "Brian Kiptoo", classId: 11, admissionNo: "EA-2026-G8-001", status: "active", invite: "Accepted" },
  { id: 1008, name: "Faith Atieno", classId: 11, admissionNo: "EA-2026-G8-002", status: "active", invite: "Accepted" },
  { id: 1009, name: "Dennis Mwangi", classId: 11, admissionNo: "EA-2026-G8-003", status: "active", invite: "Accepted" },
  { id: 1010, name: "Joan Wanjiku", classId: 11, admissionNo: "EA-2026-G8-004", status: "pending", invite: "Pending" },
  { id: 1011, name: "Kevin Muli", classId: 11, admissionNo: "EA-2026-G8-005", status: "active", invite: "Accepted" },
  { id: 1012, name: "Mercy Jepkoech", classId: 11, admissionNo: "EA-2026-G8-006", status: "active", invite: "Accepted" },
  { id: 1013, name: "Victor Maina", classId: 11, admissionNo: "EA-2026-G8-007", status: "pending", invite: "Pending" },

  // Grade 9 North (classId 12) — Mr Sammy: Mathematics, Kiswahili, Computer Studies,
  // Social Studies, Agriculture & Nutrition (Environmental Activities is Grade 1 East, classId 13)
  { id: 1014, name: "Sharon Cheruiyot", classId: 12, admissionNo: "EA-2026-G9-001", status: "active", invite: "Accepted" },
  { id: 1015, name: "Caleb Mutua", classId: 12, admissionNo: "EA-2026-G9-002", status: "active", invite: "Accepted" },
  { id: 1016, name: "Grace Naliaka", classId: 12, admissionNo: "EA-2026-G9-003", status: "active", invite: "Accepted" },
  { id: 1017, name: "Eric Kiplangat", classId: 12, admissionNo: "EA-2026-G9-004", status: "pending", invite: "Pending" },
  { id: 1018, name: "Faith Nyambura", classId: 12, admissionNo: "EA-2026-G9-005", status: "active", invite: "Accepted" },
  { id: 1019, name: "Abel Musyoka", classId: 12, admissionNo: "EA-2026-G9-006", status: "active", invite: "Accepted" },
  { id: 1020, name: "Christine Atieno", classId: 12, admissionNo: "EA-2026-G9-007", status: "active", invite: "Accepted" },
  { id: 1021, name: "John Mwenda", classId: 12, admissionNo: "EA-2026-G9-008", status: "pending", invite: "Pending" },
  { id: 1022, name: "Sarah Chepkemoi", classId: 10, admissionNo: "EA-2026-G7-001", status: "active", invite: "Accepted" },
  { id: 1024, name: "Amani Yusuf", classId: 12, admissionNo: "EA-2026-G9-009", status: "active", invite: "Accepted" },
  { id: 1025, name: "Nia Joy", classId: 11, admissionNo: "EA-2026-G8-008", status: "active", invite: "Accepted" },

  // Kevin Kamau's other children (siblings of Timothy Kamau, id 1023) — parent portal family
  { id: 1026, name: "Zacharia Muteti", classId: 3, admissionNo: "EA-2026-PP2-007", status: "pending", invite: "Pending" },
  { id: 1027, name: "Bethany Kamau", classId: 7, admissionNo: "EA-2026-G4-010", status: "active", invite: "Accepted" },
  { id: 1028, name: "Kelvin Kamau", classId: 8, admissionNo: "EA-2026-G5-011", status: "active", invite: "Accepted" },
  { id: 1029, name: "Viola Kamau", classId: 10, admissionNo: "EA-2026-G7-012", status: "active", invite: "Accepted" },
  { id: 1030, name: "Cherop Kamau", classId: 11, admissionNo: "EA-2026-G8-013", status: "active", invite: "Accepted" },
  { id: 1031, name: "James Kamau", classId: 5, admissionNo: "EA-2026-G2-014", status: "active", invite: "Accepted" },
  { id: 1032, name: "Brian Kamau", classId: 3, admissionNo: "EA-2026-PP2-008", status: "active", invite: "Accepted" },
  { id: 1033, name: "Purity Kamau", classId: 12, admissionNo: "EA-2026-G9-010", status: "active", invite: "Accepted" },
  { id: 1023, name: "Timothy Kamau", classId: 4, admissionNo: "EA-2026-G1-001", status: "active", invite: "Accepted" }
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
  1024: ["Abdi Rahim", "0712456789"],
  1025: ["James Otieno", "0799555123"],
  //kevin
  1027: ["Kevin Kamau", "0721859532"],//Bethany Kamau
  1028: ["Kevin Kamau", "0721859532"],//Kelvin Kamau
  1029: ["Kevin Kamau", "0721859532"],//Viola Kamau
  1030: ["Kevin Kamau", "0721859532"],//Cherop Kamau
  1031: ["Kevin Kamau", "0721859532"],//James Kamau
  1032: ["Kevin Kamau", "0721859532"],//Brian Kamau
  1033: ["Kevin Kamau", "0721859532"],//Purity Kamau
  1023: ["Kevin Kamau", "0721859532"],//Timothy Kamau
  1026: ["Kevin Kamau", "0733208417"]//Zacharia Muteti
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
    name: "Islamic Religious Education",
    icon: icon("ire.webp"),

  },
  {
    id: "ENV",
    name: "Environmental Activities",
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
    name: "Agriculture and Nutrition",
    icon: icon("agriculture.webp"),

  },


  { id: "BIO", name: "Biology", icon: icon("science_tech.webp") },//junior high or som'
  { id: "CHEM", name: "Chemistry", icon: icon("science_tech.webp") },
  { id: "PHY", name: "Physics", icon: icon("science_tech.webp") },
  { id: "GEO", name: "Geography", icon: icon("social_studies.webp") },
  { id: "LIT", name: "Literature", icon: icon("english.webp") },
  { id: "PE", name: "Physical Education", icon: icon("creative_arts.webp") },
];


function makeScores(subjectId, base = 68) {
  return students.map((student) => {
    const spread = (hash(`score:${subjectId}:${student.id}`) % 5) - 2;
    const trendSeed = hash(`trend:${subjectId}:${student.id}`) % 3;
    return {
      studentId: student.id,
      subjectId,
      latestScore: Math.min(98, Math.max(35, base + spread * 6)),
      trend: trendSeed === 0 ? "Improving" : trendSeed === 1 ? "Steady" : "Needs support",
    };
  });
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
  BIO: makeScores("BIO", 38), // one of the Grade 9 North subjects Mr Sammy doesn't teach- kept low so it visibly drags the all-subjects avg below the teacher avg
};

const strandPerformance = {
  MAT: {
    
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

  const band = gradeBandForClass(classId);
  return entry[band] || entry["upper-primary"] || fallback;
}


function addDays(date, days) {
  const d = date instanceof Date
    ? new Date(date.getTime())
    : new Date(String(date).replace(" ", "T"));
  d.setDate(d.getDate() + days);
  return d;
}

function toDateOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toDateStamp(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const ASSIGNMENT_DUE_DAYS = 7;//only for testing you should change it for the intergration

const DEPLOY_ANCHOR = "2026-06-09 09:30:00";
const DEPLOY_SPREAD_WEEKS = 8;

function deployedAt(assignmentId, strandIndex, subIndex) {
  const dayInWeek = (strandIndex + subIndex) % 7;
  const weeksBack = hash(`week:${assignmentId}`) % DEPLOY_SPREAD_WEEKS;
  return `${toDateStamp(addDays(DEPLOY_ANCHOR, -(dayInWeek + 7 * weeksBack)))} 09:30:00`;
}

function dueDaysFor(assignmentId) {
  return ASSIGNMENT_DUE_DAYS - 5 + (hash(`due:${assignmentId}`) % 11); // 2..12 days
}

export const MOCK_TODAY = toDateOnly(new Date(DEPLOY_ANCHOR.replace(" ", "T")));

export function isPastDue(assignment) {
  if (!assignment?.due) return false;
  return toDateOnly(new Date(String(assignment.due).replace(" ", "T"))).getTime() < MOCK_TODAY.getTime();
}

function buildAssignments(subjectId, classId) {
  const strands = defaultStrands(subjectId, classId);
  const roster = students.filter((s) => Number(s.classId) === Number(classId));
  const rows = [];

  strands.forEach((strand, strandIndex) => {
    strand.subStrands.forEach((sub, subIndex) => {
      if (!sub.count) return;
      const id = `${subjectId}-${classId}-${strandIndex}-${subIndex}`;
      const deployed = deployedAt(id, strandIndex, subIndex);
      rows.push({
        id,
        name: `${sub.name} Practice ${subIndex + 1}`,
        strand: `${strand.name} - ${sub.name}`,
        strandName: strand.name,
        deployed,
        // this is what decides whether unsubmitted work is pending or overdue.
        due: `${toDateStamp(addDays(deployed, dueDaysFor(id)))} 23:59:00`,
        // the actual teacher who set it, from the same subject+class 
        setBy: teacherForClassSubject(subjectId, classId),
        status: sub.completion >= 70 ? "Active" : "Needs Review",
        completed: 0,
        total: roster.length,
        average: sub.averageScore,
      });
    });
  });

  
  rows.forEach((row) => {
    row.completed = roster.reduce((count, student) => {
      const { score } = getStudentAssignmentScore(student.id, subjectId, row, student.status === "pending");
      return score != null ? count + 1 : count;
    }, 0);
  });

  return rows;
}

const assignmentsBySubjectClass = new Map();
function assignmentsFor(subjectId, classId) {
  const key = `${subjectId}::${classId}`;
  if (!assignmentsBySubjectClass.has(key)) {
    assignmentsBySubjectClass.set(key, buildAssignments(subjectId, classId));
  }
  return assignmentsBySubjectClass.get(key);
}

// generator input only
function subjectAbility(sharedSubjectId, studentId) {
  const entry = (subjectStudentScores[sharedSubjectId] || []).find((s) => s.studentId === studentId);
  return entry ? entry.latestScore : 0;
}

const subjectAverageCache = new Map();
export function getStudentSubjectAverage(studentId, sharedSubjectId) {
  const key = `${sharedSubjectId}::${studentId}`;
  if (subjectAverageCache.has(key)) return subjectAverageCache.get(key);

  const student = students.find((s) => s.id === studentId);
  let total = 0;
  let count = 0;
  if (student && student.status !== "pending") {
    assignmentsFor(sharedSubjectId, student.classId).forEach((assignment) => {
      const { score } = getStudentAssignmentScore(studentId, sharedSubjectId, assignment, false);
      if (score == null) return;
      total += score;
      count += 1;
    });
  }

  const average = count ? Math.round(total / count) : null;
  subjectAverageCache.set(key, average);
  return average;
}

function buildClassData(subjectId, classId) {
  
  const selectedStudents = students.filter((s) => Number(s.classId) === Number(classId));
  const abilities = (subjectStudentScores[subjectId] || makeScores(subjectId, 70)).filter((score) =>
    selectedStudents.some((student) => student.id === score.studentId)
  );
  const strands = defaultStrands(subjectId, classId);
  const assignments = assignmentsFor(subjectId, classId);

  const marks = selectedStudents
    .map((student) => getStudentSubjectAverage(student.id, subjectId))
    .filter((value) => value != null);
  const average = marks.length
    ? Math.round(marks.reduce((sum, value) => sum + value, 0) / marks.length)
    : 0;
  const completion = assignments.length
    ? Math.round(assignments.reduce((sum, assignment) => sum + (assignment.total ? (assignment.completed / assignment.total) * 100 : 0), 0) / assignments.length)
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
      score: getStudentSubjectAverage(student.id, subjectId),
      trend: abilities.find((entry) => entry.studentId === student.id)?.trend ?? "No data",
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


export const SUBJECT_CODE_TO_SHARED = {
  MAT: "MAT",
  ENG: "ENG",
  KIS: "KIS",
  CRE: "CRE",
  CAS: "ART",
  SS: "SS",
  SCI: "SCI",
  AGRI: "AGRI",
  ENV: "ENV",
  COMP: "COMP",
  PTECH: "PTECH",
  BIO: "BIO",
  IRE: "IRE",
  INT: "INT"
};


const SUBJECT_OFFERING_BY_BAND = {
  "pre-primary": ["MAT", "ENG", "KIS", "CAS", "CRE", "ENV"],
  "lower-primary": ["MAT", "ENG", "KIS", "CAS", "CRE", "ENV"],
  "upper-primary": ["MAT", "ENG", "KIS", "CAS", "CRE", "SS", "SCI", "AGRI"],
  "junior-secondary": ["MAT", "ENG", "KIS", "CAS", "CRE", "SS", "SCI", "AGRI", "COMP", "PTECH", "BIO"],
};

const SHARED_TO_SUBJECT_CODE = Object.fromEntries(
  Object.entries(SUBJECT_CODE_TO_SHARED).map(([code, sharedId]) => [sharedId, code])
);



export function getOfferedSubjectCodesForClass(classId) {
  const taught = new Set(subjectIdsForClass(classId));
  const band = SUBJECT_OFFERING_BY_BAND[gradeBandForClass(classId)] || Object.keys(SUBJECT_CODE_TO_SHARED);

  const fromBand = band.filter((code) => taught.has(SUBJECT_CODE_TO_SHARED[code]));
  const extras = [...taught]
    .map((subjectId) => SHARED_TO_SUBJECT_CODE[subjectId])
    .filter((code) => code && !fromBand.includes(code));

  return [...fromBand, ...extras];
}

function classNameById(classId) {
  return classes.find((c) => Number(c.id) === Number(classId))?.name || "Not recorded";
}

function subjectNameById(subjectId) {
  return subjects.find((s) => s.id === subjectId)?.name || subjectId;
}

export function hash(value) {
  return String(value).split("").reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) >>> 0, 7);
}


export function getClassStudentCount(classId) {
  return students.filter((student) => Number(student.classId) === Number(classId)).length;
}

export function subjectIdsForClass(classId) {
  const ids = new Set();
  teachers.forEach((t) => (t.assignments || []).forEach((a) => {
    if (Number(a.classId) === Number(classId)) ids.add(a.subjectId);
  }));
  return [...ids];
}


export function categorizeAssignment(seed, assignment, isPending) {
  const notSubmitted = isPastDue(assignment) ? "overdue" : "pending";
  if (isPending) return notSubmitted;
  if (assignment.status === "Needs Review" && seed % 2 === 0) return "retake";
  const m = seed % 10;
  if (m === 0 || m === 1) return notSubmitted;
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


export function getStudentAssignmentScore(studentId, subjectId, assignment, isPending) {
  const seed = hash(`${studentId}:${assignment.id}`);
  const category = categorizeAssignment(seed, assignment, isPending);
  const attempted = category === "done" || category === "retake" || category === "ongoing";
  const isScored = category === "done" || category === "retake";
  const base = subjectAbility(subjectId, studentId);
  const variance = (seed % 13) - 6;
  const score = isScored && base != null ? clampAssignmentScore(base + variance) : null;
  return { category, attempted, score };
}

// users can supply YYYY-MM-DD bounds to calculate a month, term, or academic-year 
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
        due: String(assignment.due || "").slice(0, 10),
        setBy: assignment.setBy,
        pastDue: isPastDue(assignment),
        category,
        attempted,
        score,
      });
    });
  });

  return records.sort((a, b) => a.date.localeCompare(b.date));
}

export function getStudentStrandAverages(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student || student.status === "pending") return [];


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

  const weakAreas = entries.filter((e) => e.average < 70).slice(0, 3);
  return { weakAreas: weakAreas.length ? weakAreas : [entries[0]] };
}

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

/* admin facing views row/object shapes legacy.js and admin's ui/ modules presentation-only constants (filters, themes, hero images, subject labels)*/

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
  AGRI: "AGRICULTURE AND NUTRITION",
  COMP: "COMPUTER STUDIES",
  IRE: "ISLAMIC RELIGIOUS EDUCATION",
  PTECH: "PRE-TECHNICAL STUDIES",
  INT: "INTEGRATED SCIENCE",
  ENV: "ENVIRONMENTAL ACTIVITIES",
  BIO: "BIOLOGY",
};

export const subjectOptions = subjects.map((s) => s.name);

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

  const offeredCodes = getOfferedSubjectCodesForClass(student.classId);

  offeredCodes.forEach((code) => {
    const sharedId = SUBJECT_CODE_TO_SHARED[code];
    scores[code] = isPending ? 0 : (getStudentSubjectAverage(studentId, sharedId) ?? 0);
    const values = classmates
      .map((mate) => getStudentSubjectAverage(mate.id, sharedId))
      .filter((v) => v != null && v > 0);
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
  const bestSubjectName = bestSubjectCode
    ? subjectNameById(SUBJECT_CODE_TO_SHARED[bestSubjectCode])
    : null;

  return { scores, classAverage, average, engagement, bestSubjectCode, bestSubjectName };
}

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

/* parents facing views :::mole-Kevin Kamau's seven children (ids 1023, 1027-1033)*/

const parentSchool = { name: "Esoma School", town: "Thika" };

export const parent = {
  name: "Kevin",
  fullName: "Kevin Kamau",
  contact: "0721859532",
  email: "kevin.kamau@gmail.com",
};

export const avatarThemes = {
  buffalo: { c1: "#e3c7ae", c2: "#f6ebdd", soft: "#f6ebdd", ink: "#5d3a1e", accent: "#8a5a3b" },
  "0": { c1: "#f0d5b1", c2: "#faefdd", soft: "#faefdd", ink: "#6b4312", accent: "#a9743f" }, // monkey
  lion: { c1: "#fcd9a0", c2: "#fdf0d4", soft: "#fdf0d4", ink: "#7a4d05", accent: "#e8930c" },
  elephant: { c1: "#ccd8e6", c2: "#e9eef5", soft: "#e9eef5", ink: "#33455c", accent: "#6b7a8d" },
};

// presentation only decoration
const PARENT_STUDENT_DECORATION = {
  1023: { gender: "NONE", avatar: "buffalo", plan: "Monthly", daysLeft: 158 },
  1026: { gender: "MALE", avatar: "elephant", plan: "Termly", daysLeft: 30 },
  1027: { gender: "FEMALE", avatar: "0", plan: "Monthly", daysLeft: 158 },
  1028: { gender: "MALE", avatar: "buffalo", plan: "Monthly", daysLeft: 158 },
  1029: { gender: "FEMALE", avatar: "lion", plan: "Monthly", daysLeft: 19 },
  1030: { gender: "NONE", avatar: "0", plan: "Monthly", daysLeft: 158 },
  1031: { gender: "MALE", avatar: "elephant", plan: "Monthly", daysLeft: 5 },
  1032: { gender: "MALE", avatar: "0", plan: "Monthly", daysLeft: 0 },
  1033: { gender: "FEMALE", avatar: "lion", plan: "Yearly", daysLeft: 0 },
};


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

export const parentStudents = Object.keys(PARENT_STUDENT_DECORATION).map((idKey) => {
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
    ...PARENT_STUDENT_DECORATION[id],
  };
});

// parent reported question issue notifications (admin review flow) , a separate concern from the assignment-deployed/due-soon ones built after
// reports below, merged together into the one exported `notifications`.
const reportIssueNotifications = [
  {
    id: "n1",
    studentId: 1023,
    question: "Mathematics - Fractions Practice 2, Q3",
    status: "Resolved",
    message: "Admin reviewed your report: the question had a wrong answer key. It has been corrected and Timothy's score updated.",
    time: "Today, 08:40",
    read: false,
  },
  {
    id: "n2",
    studentId: 1029,
    question: "English - Comprehension Set 1, Q7",
    status: "Under Review",
    message: "Your report was received and the admin is reviewing the question.",
    time: "Yesterday, 16:05",
    read: false,
  },
  {
    id: "n3",
    studentId: 1031,
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
  ["COMP", "Computer Studies"],
  ["IRE", "Islamic Religious Education"],
  ["PTECH", "Pre-Technical Studies"],
  ["INT", "Integrated Science"],
  ["ENV", "Environmental Activities"],
  ["BIO", "Biology"],
];

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
parentStudents.forEach((parentStudent) => {
  const studentRecord = students.find((item) => item.id === parentStudent.id);
  const classId = studentRecord?.classId;

  const offered = getOfferedSubjectCodesForClass(classId);
  const offeredCodes = offered.length ? offered : subjectKey.map(([code]) => code);
  const studentSubjectKey = subjectKey.filter(([code]) => offeredCodes.includes(code));
  const subjectCodes = studentSubjectKey.map(([code]) => code);

  // same shared computation admin/teacher use for this exact student, so the chart, average, engagement, and strongest subject 
  const profile = getStudentPerformanceProfile(parentStudent.id);
  const studentScores = subjectCodes.map((code) => profile.scores[code] || 0);
  const classAvgScores = subjectCodes.map((code) => profile.classAverage[code] || 0);
  const bestIndex = subjectCodes.indexOf(profile.bestSubjectCode);

  const isPendingForAssignments = studentRecord?.status === "pending";
  const assignments = subjectCodes.flatMap((code) => {
    const sharedSubjectId = SUBJECT_CODE_TO_SHARED[code];
    const classData = getClassMock(sharedSubjectId, classId);
    const subjectName = subjectNameById(sharedSubjectId);
    const teacherName = teacherForClassSubject(sharedSubjectId, classId);


    return (classData.assignments || []).slice(0, 1).map((assignment) => ({
      title: assignment.name,
      subject: subjectName,
      teacher: teacherName,
      last: assignment.deployed,
      due: assignment.due,
      setBy: assignment.setBy,
      score: isPendingForAssignments
        ? null
        : getStudentAssignmentScore(parentStudent.id, sharedSubjectId, assignment, false).score,
    }));
  });

  reports[parentStudent.id] = {
    engagement: profile.engagement,
    average: `${profile.average.toFixed(2)}%`,
    bestSubject: bestIndex >= 0 ? studentSubjectKey[bestIndex][1] : "-",
    assignments,
    chart: {
      subjects: studentSubjectKey,
      student: studentScores,
      classAvg: classAvgScores,
    },
  };
});


function formatNotifDate(d) {
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const MOCK_TOMORROW = toDateOnly(addDays(MOCK_TODAY, 1));

const assignmentNotifications = [];

parentStudents.forEach((parentStudent) => {
  const reportRows = reports[parentStudent.id]?.assignments || [];
  if (!reportRows.length) return;

  const classId = students.find((s) => s.id === parentStudent.id)?.classId;
  const classTeacherName = classes.find((c) => Number(c.id) === Number(classId))?.classTeacher;
  const offeredForNotifs = getOfferedSubjectCodesForClass(classId);
  const offeredCodes = offeredForNotifs.length ? offeredForNotifs : subjectKey.map(([code]) => code);
  const studentSubjectKeyForNotifs = subjectKey.filter(([code]) => offeredCodes.includes(code));

  let newest = null;
  reportRows.forEach((row) => {
    if (!row.due || isPastDue(row)) return;
    const t = new Date(row.last.replace(" ", "T")).getTime();
    const isFallbackTeacher = row.teacher === classTeacherName;
    if (!newest || t > newest._t || (t === newest._t && newest._fallback && !isFallbackTeacher)) {
      newest = { ...row, _t: t, _fallback: isFallbackTeacher };
    }
  });

  if (newest) {
    const due = toDateOnly(new Date(String(newest.due).replace(" ", "T")));
    assignmentNotifications.push({
      id: `assign-new-${parentStudent.id}`,
      studentId: parentStudent.id,
      title: "New Assignment",
      message: `${newest.teacher} added "${newest.title}" (${newest.subject}) for ${parentStudent.name} — due ${formatNotifDate(due)}.`,
      time: "Today, 09:30",
      read: false,
    });
  }

  // scan every real assignment across this parentStudent's offered subjects (not just the single most-recent one per subject) for anything due tomorrow.
  studentSubjectKeyForNotifs.forEach(([code]) => {
    const sharedSubjectId = SUBJECT_CODE_TO_SHARED[code];
    const classData = getClassMock(sharedSubjectId, classId);
    const subjectName = subjectNameById(sharedSubjectId);
    const teacherName = teacherForClassSubject(sharedSubjectId, classId);

    (classData.assignments || []).forEach((assignment) => {
      if (!assignment.due) return;
      const due = toDateOnly(new Date(String(assignment.due).replace(" ", "T")));
      if (due.getTime() !== MOCK_TOMORROW.getTime()) return;

      assignmentNotifications.push({
        id: `assign-due-${parentStudent.id}-${assignment.id}`,
        studentId: parentStudent.id,
        title: "Assignment Due Tomorrow",
        message: `${teacherName}'s "${assignment.name}" (${subjectName}) for ${parentStudent.name} is due tomorrow, ${formatNotifDate(due)}.`,
        time: "Today, 09:30",
        read: false,
      });
    });
  });
});

// assignment notifications first (most actionable/time-sensitive), then the parent-reported question-issue ones
export const notifications = [...assignmentNotifications, ...reportIssueNotifications];
