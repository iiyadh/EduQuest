import { create } from "zustand";

const useCoursesStore = create((set, get) => ({
  courses: [],
  enrolledCourses: [],

  fetchCourses: async () => {
    try {
      set({
        courses: [
          {
            id: "course-1",
            title: "Introduction to Programming",
            description: "Learn the basics of programming with Python",
            level: "Beginner",
            duration: "8 weeks",
            modules: [
              {
                id: "module-1",
                title: "Getting Started with Python",
                lessons: [
                  {
                    id: "lesson-1", title: "Installing Python and Setup",
                    content: `
                                Learn the Basics of Programming with Python

                                A beginner-friendly course to introduce you to the fundamentals of Python programming.

                                Lesson 1: Installing Python and Setup

                                Overview

                                Introduction to Python and its applications

                                Setting up the Python environment

                                Steps

                                Download Python
                                Visit Python's official website (https://www.python.org/downloads/) and download the latest version for your OS.

                                Install Python
                                Run the installer and ensure you check "Add Python to PATH" before installation.

                                Verify Installation
                                Open a terminal or command prompt and run:
                                python --version
                                You should see the installed Python version.

                                Choose an IDE/Editor
                                Recommended options:

                                VS Code (with Python extension)

                                PyCharm (Community Edition)

                                Jupyter Notebook (for interactive coding)`
                  },
                  {
                    id: "lesson-2", title: "Variables and Data Types",
                    content: `
                            Key Concepts

                            Variables: Containers for storing data values.

                            Data Types: Classification of data (e.g., numbers, text).

                            Common Data Types in Python

                            Data Type	Example	Description
                            int	5	Integer numbers
                            float	3.14	Decimal numbers
                            str	"Hello"	Text (strings)
                            bool	True/False	Boolean values
                            list	[1, 2, 3]	Ordered, mutable collection
                            dict	{"key": "value"}	Key-value pairs
                            Example Code

                            Variable assignment
                            name = "Alice"
                            age = 25
                            is_student = True

                            Print variables
                            print("Name:", name)
                            print("Age:", age)
                            print("Is Student?", is_student)
                            `
                  },
                  {
                    id: "lesson-3", title: "Basic Operations",
                    content: "place holder"
                  },
                ],
              },
              {
                id: "module-2",
                title: "Control Flow",
                lessons: [
                  { id: "lesson-4", title: "Conditional Statements", content: "place holder" },
                  { id: "lesson-5", title: "Loops", content: "place holder" },
                  { id: "lesson-6", title: "Functions", content: "place holder" },
                ],
              },
              {
                id: "module-3",
                title: "Data Structures",
                lessons: [
                  { id: "lesson-7", title: "Lists and Tuples", content: "place holder" },
                  { id: "lesson-8", title: "Dictionaries", content: "place holder" },
                  { id: "lesson-9", title: "Sets", content: "place holder" },
                ],
              },
            ],
            lastLessonId: ""
          },
          {
            id: "course-2",
            title: "Data Structures and Algorithms",
            description: "Master the fundamental data structures and algorithms",
            level: "Intermediate",
            duration: "10 weeks",
            modules: [
              {
                id: "module-1",
                title: "Introduction to Algorithms",
                lessons: [
                  { id: "lesson-1", title: "Algorithm Analysis" },
                  { id: "lesson-2", title: "Big O Notation" },
                ],
              },
              {
                id: "module-2",
                title: "Basic Data Structures",
                lessons: [
                  { id: "lesson-3", title: "Arrays and Linked Lists" },
                  { id: "lesson-4", title: "Stacks and Queues" },
                ],
              },
            ],
            lastLessonId: ""
          },
          {
            id: "course-3",
            title: "Calculus I",
            description: "Introduction to differential and integral calculus",
            level: "Beginner",
            duration: "12 weeks",
            modules: [
              {
                id: "module-1",
                title: "Limits and Continuity",
                lessons: [
                  { id: "lesson-1", title: "Understanding Limits" },
                  { id: "lesson-2", title: "Continuity" },
                ],
              },
              {
                id: "module-2",
                title: "Derivatives",
                lessons: [
                  { id: "lesson-3", title: "Definition of Derivative" },
                  { id: "lesson-4", title: "Rules of Differentiation" },
                ],
              },
            ],
            lastLessonId: ""
          },
          {
            id: "course-4",
            title: "Linear Algebra",
            description: "Study of vectors, matrices, and linear transformations",
            level: "Intermediate",
            duration: "10 weeks",
            modules: [
              {
                id: "module-1",
                title: "Vectors and Matrices",
                lessons: [
                  { id: "lesson-1", title: "Vector Operations" },
                  { id: "lesson-2", title: "Matrix Multiplication" },
                ],
              },
              {
                id: "module-2",
                title: "Determinants and Eigenvalues",
                lessons: [
                  { id: "lesson-3", title: "Calculating Determinants" },
                  { id: "lesson-4", title: "Eigenvalues and Eigenvectors" },
                ],
              },
            ],
            lastLessonId: ""
          },
          {
            id: "course-5",
            title: "Quantum Mechanics",
            description: "Explore the fundamental principles of quantum physics",
            level: "Advanced",
            duration: "14 weeks",
            modules: [
              {
                id: "module-1",
                title: "Wave-Particle Duality",
                lessons: [
                  { id: "lesson-1", title: "Understanding Wave-Particle Duality" },
                  { id: "lesson-2", title: "Double-Slit Experiment" },
                ],
              },
              {
                id: "module-2",
                title: "Quantum States and Operators",
                lessons: [
                  {
                    id: "lesson-3", title: "Quantum States"
                  },
                  {
                    id: "lesson-4", title: "Operators in Quantum Mechanics"
                  },
                ],
              },
            ],
            lastLessonId: ""
          },
          {
            id: "course-6",
            title: "Business Ethics",
            description: "Ethical principles and moral issues in business",
            level: "Intermediate",
            duration: "8 weeks",
            modules: [
              {
                id: "module-1",
                title: "Introduction to Business Ethics",
                lessons: [
                  { id: "lesson-1", title: "What is Business Ethics?" },
                  { id: "lesson-2", title: "Importance of Ethics in Business" },
                ],
              },
              {
                id: "module-2",
                title: "Corporate Social Responsibility",
                lessons: [
                  { id: "lesson-3", title: "Understanding CSR" },
                  { id: "lesson-4", title: "CSR in Practice" },
                ],
              },
            ],
            lastLessonId: ""
          },
          {
            id: "course-7",
            title: "Art History",
            description: "Survey of major art movements throughout history",
            level: "Beginner",
            duration: "10 weeks",
            modules: [
              {
                id: "module-1",
                title: "Renaissance Art",
                lessons: [
                  { id: "lesson-1", title: "Key Artists of the Renaissance" },
                  { id: "lesson-2", title: "Techniques and Styles" },
                ],
              },
              {
                id: "module-2",
                title: "Modern Art",
                lessons: [
                  { id: "lesson-3", title: "Impressionism" },
                  { id: "lesson-4", title: "Abstract Expressionism" },
                ],
              },
            ],
            lastLessonId: ""
          },
        ]
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  },

  enrollInCourse: (courseId) => {
    set((state) => ({
      enrolledCourses: [...new Set([...state.enrolledCourses, courseId])]
    }));
  },

  unenrollFromCourse: (courseId) => {
    set((state) => ({
      enrolledCourses: state.enrolledCourses.filter((id) => id !== courseId),
    }));
  },

  isEnrolled: (courseId) => {
    return get().enrolledCourses.includes(courseId);
  },

  calculateProgress: (courseId) => {
    const course = get().courses.find(course => course.id === courseId);
    if (!course) return 0;
    if (!course.lastLessonId) return 0;

    let totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    let completedLessons = 0;
    let lessonReached = false;

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        totalLessons++;
        completedLessons++;
        if (lesson.id === course.lastLessonId) {
          lessonReached = true;
          break;
        }
      }
      if (lessonReached) break;
    }

    return totalLessons > 0 ? (completedLessons * 2 / totalLessons) * 100 : 0;
  },

  markLastPoint: (courseId, lessonId) => {
    set((state) => ({
      courses: state.courses.map(course =>
        course.id === courseId
          ? { ...course, lastLessonId: lessonId }
          : course
      )
    }));
  }
}));

export default useCoursesStore;
