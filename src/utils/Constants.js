export const DRAWER_WIDTH = 240;

export const ALERT_TYPE = {
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  SUCCESS: "success",
};

export const USER_ROLES = [
  // {
  //     "role_id": 1,
  //     "name": "superadmin",
  //     "description": "An super admin user"
  // },
  // {
  //     "role_id": 2,
  //     "name": "admin",
  //     "description": "An admin user"
  // },
  {
    role_id: 3,
    name: "candidate",
    description: "A candidate user",
  },
  {
    role_id: 4,
    name: "employer",
    description: "An employer user",
  },
  {
    role_id: 5,
    name: "promoter",
    description: "A crayon promoter user",
  },
  // {
  //     "role_id": 6,
  //     "name": "recruiter",
  //     "description": "A recruiter user"
  // },
  // {
  //     "role_id": 7,
  //     "name": "coach",
  //     "description": "a coach user"
  // }
];

export const ERROR_MSG = "Something went wrong! Please try again later!";

export const USER_TYPES = ["Candidate", "Employer", "Promoter"];

export const LOGIN_TYPE = ["login", "signup"];

export const PUBLIC_TAB_ITEMS = [
  {
    label: "jobs",
    path: "jobs",
  },
  {
    label: "talent",
    path: "talent",
  },
  {
    label: "solutions",
    path: "solutions",
  },
  {
    label: "pricing",
    path: "pricing",
  },
  {
    label: "contact",
    path: "contact",
  },
];

export const ADMIN_TAB_ITEMS = [
  {
    label: "",
    path: "",
  },
];

export const AUTHORIZED_TAB_ITEMS_EMPLOYER = [
  {
    label: "quick links",
    path: "employer/quick_links",
  },
  {
    label: "post a job",
    path: "employer/post-a-job",
  },
  {
    label: "my jobs",
    path: "employer/my-jobs",
  },
  {
    label: "my team",
    path: "employer/my-team",
  },
  {
    label: "my alerts",
    path: "employer/my_alerts",
  },
  {
    label: "my profile",
    path: "employer/my-profile",
  },
];

export const AUTHORIZED_TAB_ITEMS_CANDIDATE = [
  {
    label: "quick links",
    path: "candidate/quick_links",
  },
  {
    label: "my jobs",
    path: "candidate/my-jobs",
  },
  {
    label: "my CV",
    path: "candidate/my-cv",
  },
  {
    label: "my cam",
    path: "candidate/my_cam",
  },
  {
    label: "my alerts",
    path: "candidate/my_alerts",
  },
  {
    label: "my profile",
    path: "candidate/my-profile",
  },
  {
    label: "coins",
    path: "candidate/coins",
  },
];

export const MY_TEAMS_LEFT_PANEL = [
  {
    id: "Team Status",
    name: "Team Status",
    color: "lightGreenButton300",
    title: true,
  },
  {
    id: "team members",
    name: "team members",
    color: "lightGreenButton300",
  },
  {
    id: "recruiters",
    name: "recruiters",
    color: "lightGreenButton300",
  },
  {
    id: "promoters",
    name: "promoters",
    color: "lightGreenButton300",
  },
  {
    id: "hired talent",
    name: "hired talent",
    color: "lightGreenButton300",
  },
];

export const MY_TEAMS_INVITE_STATUS = [
  {
    id: "Invite Status",
    name: "Invite Status",
    color: "blueButton700",
    title: true,
  },
  {
    id: "accepted",
    name: "accepted",
    color: "blueButton700",
  },
  {
    id: "pending",
    name: "pending",
    color: "blueButton700",
  },
  {
    id: "rejected",
    name: "rejected",
    color: "blueButton700",
  },
];

export const JOBS_LEFT_INDUSTRIES_BUTTON_GROUP = [
  {
    id: 1,
    name: "all industies",
    color: "blueButton600",
    title: true,
  },
  {
    id: 2,
    name: "tech",
    color: "blueButton600",
  },
  {
    id: 3,
    name: "digital",
    color: "blueButton600",
  },
  {
    id: 4,
    name: "marketing",
    color: "blueButton600",
  },
  {
    id: 5,
    name: "sales",
    color: "blueButton600",
  },
  {
    id: 6,
    name: "finance",
    color: "blueButton600",
  },
  {
    id: 7,
    name: "insurance",
    color: "blueButton600",
  },
  {
    id: 8,
    name: "operations",
    color: "blueButton600",
  },
  {
    id: 9,
    name: "data",
    color: "blueButton600",
  },
  {
    id: 10,
    name: "real estate",
    color: "blueButton600",
  },
  {
    id: 11,
    name: "education",
    color: "blueButton600",
  },
  {
    id: 12,
    name: "media",
    color: "blueButton600",
  },
];

export const JOBS_LEFT_TYPES_BUTTON_GROUP = [
  {
    id: 1,
    name: "all types",
    color: "purpleButton",
    title: true,
  },
  {
    id: 2,
    name: "challengers",
    color: "purpleButton",
  },
  {
    id: 3,
    name: "characters",
    color: "purpleButton",
  },
  {
    id: 4,
    name: "contemplators",
    color: "purpleButton",
  },
  {
    id: 5,
    name: "collaborators",
    color: "purpleButton",
  },
];

export const JOBS_RIGHT_JOB_TYPES_BUTTON_GROUP = [
  {
    id: 1,
    name: "all job types",
    color: "blueButton700",
    title: true,
  },
  {
    id: 2,
    name: "freelance",
    color: "blueButton700",
  },
  {
    id: 3,
    name: "full-time",
    color: "blueButton700",
  },
  {
    id: 4,
    name: "remote",
    color: "blueButton700",
  },
  {
    id: 5,
    name: "in-office",
    color: "blueButton700",
  },
  {
    id: 6,
    name: "hybrid",
    color: "blueButton700",
  },
  {
    id: 7,
    name: "crayon recruit",
    color: "blueButton700",
  },
];

export const JOBS_RIGHT_POSTS_BUTTON_GROUP = [
  {
    id: 1,
    name: "all stages",
    color: "lightGreenButton300",
    title: true,
  },
  {
    id: 2,
    name: "review",
    color: "lightGreenButton300",
  },
  {
    id: 3,
    name: "shortlist",
    color: "lightGreenButton300",
  },
  {
    id: 4,
    name: "interview",
    color: "lightGreenButton300",
  },
  {
    id: 5,
    name: "assessment",
    color: "lightGreenButton300",
  },
  {
    id: 6,
    name: "offer",
    color: "lightGreenButton300",
  },
];

export const JOBS_RIGHT_STAGES_BUTTON_GROUP = [
  {
    id: 1,
    name: "all post",
    color: "black100",
    title: true,
  },
  {
    id: 2,
    name: "recent",
    color: "black100",
  },
  {
    id: 3,
    name: "favourites",
    color: "black100",
  },
  {
    id: 4,
    name: "applied jobs",
    color: "black100",
  },
];

export const TALENT_RIGHT_JOB_TYPES_BUTTON_GROUP = [
  {
    id: 1,
    name: "all talents",
    color: "blueButton700",
    title: true,
  },
  {
    id: 2,
    name: "permanent",
    color: "blueButton700",
  },
  {
    id: 3,
    name: "contract",
    color: "blueButton700",
  },
  {
    id: 4,
    name: "freelance",
    color: "blueButton700",
  },
  {
    id: 5,
    name: "in-office",
    color: "blueButton700",
  },
  {
    id: 6,
    name: "hybrid",
    color: "blueButton700",
  },
  {
    id: 7,
    name: "remote",
    color: "blueButton700",
  },
];

export const TALENT_RIGHT_JOB_ACTIVITY_BUTTON_GROUP = [
  {
    id: 1,
    name: "all activity",
    color: "lightGreenButton300",
    title: true,
  },
  {
    id: 2,
    name: "recent",
    color: "lightGreenButton300",
  },
  {
    id: 3,
    name: "active",
    color: "lightGreenButton300",
  },
  {
    id: 4,
    name: "in demand",
    color: "lightGreenButton300",
  },
  {
    id: 5,
    name: "favourites",
    color: "lightGreenButton300",
  },
  {
    id: 6,
    name: "my talent",
    color: "lightGreenButton300",
  },
];

export const CARD_RIGHT_BUTTON_GROUP = [
  {
    id: 1,
    name: "adaptable",
    color: "purpleButton",
    hover: "yellowButton100",
  },
  {
    id: 2,
    name: "detailed",
    color: "purpleButton",
    hover: "yellowButton100",
  },
  {
    id: 3,
    name: "organized",
    color: "purpleButton",
    hover: "yellowButton100",
  },
  {
    id: 4,
    name: "proactive",
    color: "purpleButton",
    hover: "yellowButton100",
  },
  {
    id: 5,
    name: "thrives on stress",
    color: "purpleButton",
    hover: "yellowButton100",
  },
];

export const TALENT_LEFT_BUTTON_GROUP = [
  {
    id: 1,
    name: "all industies",
    color: "blueButton600",
    title: true,
  },
  {
    id: 2,
    name: "tech",
    color: "blueButton600",
  },
  {
    id: 3,
    name: "digital",
    color: "blueButton600",
  },
  {
    id: 4,
    name: "marketing",
    color: "blueButton600",
  },
  {
    id: 5,
    name: "sales",
    color: "blueButton600",
  },
  {
    id: 6,
    name: "finance",
    color: "blueButton600",
  },
  {
    id: 7,
    name: "insurance",
    color: "blueButton600",
  },
  {
    id: 8,
    name: "operations",
    color: "blueButton600",
  },
  {
    id: 9,
    name: "data",
    color: "blueButton600",
  },
  {
    id: 10,
    name: "real estate",
    color: "blueButton600",
  },
  {
    id: 11,
    name: "education",
    color: "blueButton600",
  },
  {
    id: 12,
    name: "media",
    color: "blueButton600",
  },
  {
    id: 13,
    name: "all types",
    color: "purpleButton",
    title: true,
    marginTop: 2,
  },
  {
    id: 14,
    name: "challengers",
    color: "purpleButton",
  },
  {
    id: 15,
    name: "characters",
    color: "purpleButton",
  },
  {
    id: 16,
    name: "contemplators",
    color: "purpleButton",
  },
  {
    id: 17,
    name: "collaborators",
    color: "purpleButton",
  },
];

export const TALENT_RIGHT_BUTTON_GROUP = [
  {
    id: 1,
    name: "all job types",
    color: "blueButton700",
    title: true,
  },
  {
    id: 2,
    name: "freelance",
    color: "blueButton700",
  },
  {
    id: 3,
    name: "full-time",
    color: "blueButton700",
  },
  {
    id: 4,
    name: "remote",
    color: "blueButton700",
  },
  {
    id: 5,
    name: "in-office",
    color: "blueButton700",
  },
  {
    id: 6,
    name: "hybrid",
    color: "blueButton700",
  },
  {
    id: 7,
    name: "crayon recruit",
    color: "blueButton700",
  },
  {
    id: 8,
    name: "all stages",
    color: "lightGreenButton300",
    title: true,
    marginTop: 2,
  },
  {
    id: 9,
    name: "review",
    color: "lightGreenButton300",
  },
  {
    id: 10,
    name: "shortlist",
    color: "lightGreenButton300",
  },
  {
    id: 11,
    name: "interview",
    color: "lightGreenButton300",
  },
  {
    id: 12,
    name: "assessment",
    color: "lightGreenButton300",
  },
  {
    id: 13,
    name: "offer",
    color: "lightGreenButton300",
  },
  {
    id: 14,
    name: "all post",
    color: "black100",
    title: true,
    marginTop: 2,
  },
  {
    id: 15,
    name: "recent",
    color: "black100",
  },
  {
    id: 16,
    name: "favourites",
    color: "black100",
  },
  {
    id: 17,
    name: "applied jobs",
    color: "black100",
  },
];

export const EMPLOYER_MY_JOBS_LEFT = [
  {
    id: 1,
    name: "jobs",
    color: "redButton",
  },
  {
    id: 2,
    name: "settings",
    color: "redButton",
  },
];

export const EMPLOYER_JOB_POSTING_LEFT = [
  {
    id: 1,
    name: "The basics",
    color: "redButton",
  },
  {
    id: 2,
    name: "The details",
    color: "redButton",
  },
  {
    id: 3,
    name: "The culture",
    color: "redButton",
  },
];

export const EMPLOYER_JOB_POSTING_SPEC_LEFT = [
  {
    id: 1,
    name: "build a spec",
    color: "redButton",
  },
  {
    id: 2,
    name: "find a spec",
    color: "redButton",
  },
  {
    id: 3,
    name: "my spec",
    color: "redButton",
  },
];

export const TALENT_LEFT_JOB_APPLICATION_BUTTON_GROUP = [
  {
    id: 1,
    name: "all applications",
    color: "blueButton300",
    title: true,
  },
  {
    id: 2,
    name: "complete",
    color: "blueButton300",
    // title: true,
  },
  {
    id: 3,
    name: "incomplete",
    color: "blueButton300",
    // title: true,
  },
  {
    id: 4,
    name: "video",
    color: "blueButton300",
    // title: true,
  },
  {
    id: 5,
    name: "no video",
    color: "blueButton300",
    // title: true,
  },
  {
    id: 6,
    name: "crayon cam",
    color: "blueButton300",
    // title: true,
  },
  {
    id: 7,
    name: "no crayon cam",
    color: "blueButton300",
    // title: true,
  },
  {
    id: 8,
    name: "portfolio",
    color: "blueButton300",
    // title: true,
  },
  {
    id: 9,
    name: "no portfolio",
    color: "blueButton300",
    // title: true,
  },
];

export const TALENT_RIGHT_JOB_INFO_BUTTON_GROUP = [
  {
    id: 1,
    name: "all talents",
    color: "blueButton700",
    title: true,
  },
  {
    id: 2,
    name: "permanent",
    color: "blueButton700",
  },
  {
    id: 3,
    name: "contract",
    color: "blueButton700",
  },
  {
    id: 4,
    name: "freelance",
    color: "blueButton700",
  },
  {
    id: 5,
    name: "in-office",
    color: "blueButton700",
  },
  {
    id: 6,
    name: "hybrid",
    color: "blueButton700",
  },
  {
    id: 7,
    name: "remote",
    color: "blueButton700",
  },
  {
    id: 8,
    name: "gender",
    color: "blueButton700",
    // title: true,
  },
  {
    id: 9,
    name: "race",
    color: "blueButton700",
    // title: true,
  },
  {
    id: 10,
    name: "age",
    color: "blueButton700",
    // title: true,
  },
  {
    id: 11,
    name: "qulification",
    color: "blueButton700",
    // title: true,
  },
  {
    id: 12,
    name: "salary",
    color: "blueButton700",
    // title: true,
  },
  {
    id: 13,
    name: "experience",
    color: "blueButton700",
    // title: true,
  },
];

export const EMPLOYER_MY_JOBS_RIGHT = [
  {
    id: 1,
    name: "all",
    color: "redButton",
  },
  {
    id: 2,
    name: "recruit",
    color: "brownButton",
  },
  {
    id: 3,
    name: "talent/lite",
    color: "redButton",
  },
  {
    id: 4,
    name: "review",
    color: "yellowButton100",
  },
  {
    id: 5,
    name: "shortlist",
    color: "yellowButton100",
  },
  {
    id: 6,
    name: "interview",
    color: "yellowButton100",
  },
  {
    id: 7,
    name: "assessment",
    color: "yellowButton100",
  },
  {
    id: 8,
    name: "offer",
    color: "yellowButton100",
  },
  {
    id: 9,
    name: "recent",
    color: "orangeButton",
  },
  {
    id: 10,
    name: "favourites",
    color: "brownButton",
  },
  {
    id: 11,
    name: "applied",
    color: "lightGreenButton200",
  },
];

export const CANDIDATE_MY_CV_LEFT = [
  {
    id: 1,
    name: "the basics",
    color: "redButton",
  },
  {
    id: 2,
    name: "work life",
    color: "redButton",
  },
  {
    id: 3,
    name: "study life",
    color: "redButton",
  },
];

export const CANDIDATE_MY_CV_RIGHT = [
  {
    id: 1,
    name: "create cv",
    color: "redButton",
  },
  {
    id: 2,
    name: "view my cv",
    color: "redButton",
  },
];

export const ADMIN_LFET_PANEL = [
  {
    title: "Dashboard",
    path: "dashboard",
    subTitle: "The stats",
    icon: "CreditCardIcon",
    color: "greenButton",
    menuItems: [{ label: "Dashboard item1" }, { label: "Dashboard item2" }],
  },
  {
    title: "Jobs",
    path: "adminJobs",
    subTitle: "Manage your jobs",
    icon: "NotificationsActiveOutlinedIcon",
    color: "yellowButton300",
    menuItems: [
      { label: "Pending Jobs", path: "pending-jobs" },
      { label: "Active jobs", path: "active-jobs" },
      { label: "Paused jobs", path: "paused-jobs" },
      { label: "Closed jobs", path: "closed-jobs" },
      // { label: 'Post a job' },
    ],
  },
  {
    title: "Talent",
    path: "admin-talent",
    subTitle: "Manage your talent",
    icon: "PermIdentityIcon",
    color: "blueButton400",
    menuItems: [
      { label: "All talent", path: "all-talent" },
      { label: "Talent pools" },
    ],
  },
  {
    title: "Search",
    path: "search",
    subTitle: "Find talent, fast",
    icon: "LanguageIcon",
    color: "pinkButton",
    menuItems: [
      { label: "Build a search", path: "build-search" },
      { label: "Job titles", path: "job-titles" },
      { label: "Tags" },
      { label: "Skills" },
      { label: "Tools" },
      { label: "Qualifications" },
      { label: "Institutions" },
      { label: "Associations" },
      { label: "Schools" },
      { label: "Towns" },
      { label: "Nationalities" },
      { label: "Languages" },
    ],
  },
  {
    title: "Crayon Chat",
    path: "chat",
    subTitle: "Who said what",
    icon: "ChatBubbleOutlineIcon",
    color: "blueButton400",
    menuItems: [{ label: "Chat item1" }],
  },
  {
    title: "Maintenance",
    path: "maintenance",
    subTitle: "The nuts and bolts",
    icon: "ShowChartIcon",
    color: "yellowButton300",
    menuItems: [{ label: "Maintenance item1" }],
  },
];

export const BUILD_SEARCH = [
  { label: "job titles" },
  { label: "tags" },
  { label: "skills" },
  { label: "tools" },
  { label: "qualifications" },
  { label: "institutions" },
  { label: "associations" },
  { label: "schools" },
  { label: "towns" },
  { label: "nationalities" },
  { label: "languages" },
];

export const ADMIN_ACTIVE_JOBS = [
  {
    id: "006",
    name: "Sally",
    logo: "",
    job: "Front End Developer",
    description: "Hooligan Development",
    status: {
      label: "considering",
      color: "yellowButton100",
    },
    crayonComfort: false,
    address: "Paarl, South Africa",
    salary: "R60,000pm",
    experience: "5 years",
    workType: "in-office",
    jobType: "full-time",
    date: "2 Jan 2023",
    days: "3 days",
  },
  {
    id: "005",
    name: "James",
    logo: "",
    job: "Data Scientist",
    description: "Click Learning",
    status: {
      label: "assessment",
      color: "blueButton100",
    },
    crayonComfort: false,
    address: "London, United Kingdom",
    salary: "R40,000pm",
    experience: "4 years",
    workType: "hybrid",
    jobType: "full-time",
    date: "15 Dec 2022",
    days: "22 days",
  },
  {
    id: "004",
    name: "Mike",
    logo: "",
    job: "Lead Developer",
    description: "Ozow Payments",
    status: {
      label: "interview",
      color: "purpleButton",
    },
    crayonComfort: true,
    address: "Cape Town, South Africa",
    salary: "R90,000pm",
    experience: "6 years",
    workType: "remote",
    jobType: "full-time",
    date: "25 Nov 2022",
    days: "42 days",
  },
];

export const ADMIN_TALENT_JOBS = [
  {
    id: "545",
    job: "Mickey Mouse",
    description: "Data Scientist",
    count: 25,
    date: "27 Apr 2022",
    days: "5 days",
    chips: [
      {
        label: "interview",
        color: "lightGreenButton300",
      },
      {
        label: "education",
        color: "blueButton600",
      },
      {
        label: "real estate",
        color: "blueButton600",
      },
    ],
    address: "Sandton, South Africa",
    salary: "R30,000pm",
    experience: "6 years",
    workType: "remote",
    jobType: "full-time",
  },
  {
    id: "546",
    job: "Daffy Duck",
    description: "Lead Engineer",
    count: 43,
    date: "7 May 2019",
    days: "16 days",
    chips: [
      {
        label: "interview",
        color: "purpleButton",
      },
      {
        label: "education",
        color: "brownButton",
      },
      {
        label: "real estate",
        color: "brownButton",
      },
    ],
    address: "Cape Town, South Africa",
    salary: "R30,000pm",
    experience: "6 years",
    workType: "in-office",
    jobType: "full-time",
  },
  {
    id: "547",
    job: "Bugs Bunny",
    description: "Graphic Designer",
    count: 32,
    date: "27 Apr 2022",
    days: "30 days",
    chips: [
      {
        label: "assessment",
        color: "purpleButton",
      },
      {
        label: "tech",
        color: "brownButton",
      },
      {
        label: "finance",
        color: "brownButton",
      },
    ],
    address: "London, United Kingdom",
    salary: "R30,000pm",
    experience: "6 years",
    workType: "in-office",
    jobType: "full-time",
  },
];

export const CV_STEPS = ["The basics", "work life", "study life"];

export const POST_JOB_STEPS = ["The basics", "The details", "The culture add"];

export const WORK_TYPE = [
  {
    id: "remote",
    name: "remote",
  },
  {
    id: "work from office",
    name: "work from office",
  },
];

export const ROLE_TYPE = [
  {
    id: "freelance",
    name: "freelance",
  },
  {
    id: "full-time",
    name: "full-time",
  },
  {
    id: "remote",
    name: "remote",
  },
  {
    id: "in-office",
    name: "in-office",
  },
  {
    id: "hybrid",
    name: "hybrid",
  },
  {
    id: "crayon recruit",
    name: "crayon recruit",
  },
];

export const EMP_PROFILE_STEPS = ["My info", "Company info"];
