// stores/coursesStore.js
import { create } from "zustand";
import axios from "axios";

const useCoursesStore = create((set, get) => ({
  courses: [],
  enrolledCourses: [],
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("http://127.0.0.1:8000/student/getCourses");
      set({ courses: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching courses:", error);
      set({ error: "Failed to load courses", isLoading: false });
    }
  },

  fetchEnrolledCourses: async (student_id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`http://127.0.0.1:8000/student/getEnrolledCourses/${student_id}`);
      set({ enrolledCourses: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      set({ error: "Failed to load enrolled courses", isLoading: false });
    }
  },

  enrollInCourse: async (course_id, student_id) => {
    set({ isLoading: true });
    try {
      await axios.post(`http://127.0.0.1:8000/student/enrollUser/${course_id}/${student_id}`);
      await get().fetchEnrolledCourses(student_id);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error enrolling in course:", error);
      set({ error: "Failed to enroll in course", isLoading: false });
    }
  },

  unenrollFromCourse: async (course_id, student_id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`http://127.0.0.1:8000/student/unenrollUser/${course_id}/${student_id}`);
      await get().fetchEnrolledCourses(student_id);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error unenrolling from course:", error);
      set({ error: "Failed to unenroll from course", isLoading: false });
    }
  },

  isEnrolled: (course_id) => {
    return get().enrolledCourses.some(course => course.course_id === course_id);
  },

  calculateProgress: (course_id) => {
    const enrolledCourse = get().enrolledCourses.find(c => c.course_id == course_id);
    if (!enrolledCourse) return 0;
    
    const course = get().courses.find(c => c.id == course_id);
    if (!course) return 0;

    let totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
    let completedLessons = 0;
    let foundLastLesson = !enrolledCourse.last_lesson_id;

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (enrolledCourse.last_lesson_id && lesson.id == enrolledCourse.last_lesson_id) {
          completedLessons++;
          foundLastLesson = true;
          break;
        } else if (!foundLastLesson) {
          completedLessons++;
        }
      }
      if (foundLastLesson) break;
    }

    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  },

  getNextLesson: (course_id) => {
    const enrolledCourse = get().enrolledCourses.find(c => c.course_id == course_id);
    if (!enrolledCourse) return null;

    const course = get().courses.find(c => c.id == course_id);
    if (!course) return null;

    let foundLastLesson = false;
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (foundLastLesson) {
          return lesson.title;
        } else if (lesson.id == enrolledCourse.last_lesson_id) {
          foundLastLesson = true;
        }
      }
    }
    return null;
  },

  updateEnrollmentProgress: async (course_id, student_id, last_lesson_id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/student/updateEnrollmentProgress/${course_id}/${student_id}/${last_lesson_id}`);
      await get().fetchEnrolledCourses(student_id);
    } catch (error) {
      console.error("Error updating enrollment progress:", error);
      set({ error: "Failed to update progress" });
    }
  },

  clearError: () => set({ error: null })
}));

export default useCoursesStore;