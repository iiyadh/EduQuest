import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { marked, Renderer, Tokens } from 'marked';
import hljs from 'highlight.js';
import { Course, Module, Lesson, CoursesService } from "../../../services/courses.service";
import { ActivatedRoute } from '@angular/router';

marked.use({
  renderer: {
    code(this: Renderer, token: Tokens.Code): string {
      const lang = token.lang ?? '';
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(token.text, { language }).value;
      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
    }
  }
});

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {
  course!: Course;
  editingLesson: string | null = null;
  activeTab: 'write' | 'preview' = 'write';
  

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute
  ) {
    marked.use({
      renderer: {
        code(this: Renderer, codeObj): string {
          const lang = codeObj.lang ?? '';
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          const highlighted = hljs.highlight(codeObj.text, { language }).value;
          return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
        }
      }
    });
  }
  renderMarkdown(markdown: string){
    return marked.parse(markdown);
  }
  
  
  

  ngOnInit(): void {
    const course = this.coursesService.getCourseById(this.route.snapshot.paramMap.get('id') as string);
    if (course) {
      this.course = course;
    } else {
      this.course = {
        id: this.generateId(),
        title: 'Untitled Course',
        description: '',
        level: '',
        duration: '',
        modules: []
      };
      this.coursesService.addCourse(this.course);
    }
  }

  updateCourse(field: keyof Course, event: Event): void {
    const element = event.target as HTMLElement;
    (this.course as any)[field] = element.innerText;
    this.coursesService.updateCourse(this.course);
  }

  updateModule(moduleIndex: number, field: keyof Module, event: Event): void {
    const element = event.target as HTMLElement;
    (this.course.modules[moduleIndex] as any)[field] = element.innerText;
    this.coursesService.updateCourse(this.course);
  }

  updateLesson(moduleIndex: number, lessonIndex: number, field: keyof Lesson, event: Event): void {
    const element = event.target as HTMLElement;
    (this.course.modules[moduleIndex].lessons[lessonIndex] as any)[field] = element.innerText;
    this.coursesService.updateCourse(this.course);
  }

  updateLessonContent(moduleIndex: number, lessonIndex: number, content: string): void {
    this.course.modules[moduleIndex].lessons[lessonIndex].content = content;
    this.coursesService.updateCourse(this.course);
  }

  toggleEditor(moduleIndex: number, lessonIndex: number): void {
    const key = `${moduleIndex}-${lessonIndex}`;
    this.editingLesson = this.editingLesson === key ? null : key;
    this.activeTab = 'write';
  }

  generateId(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }

  addModule(): void {
    this.course.modules.push({
      id: this.generateId(),
      title: 'New Module',
      lessons: [{
        id: this.generateId(),
        title: 'New Lesson',
        content: '## Lesson Content\n\nStart writing here...'
      }]
    });
    this.coursesService.updateCourse(this.course);
  }

  deleteModule(index: number): void {
    this.course.modules.splice(index, 1);
    this.coursesService.updateCourse(this.course);
  }

  addLesson(moduleIndex: number): void {
    this.course.modules[moduleIndex].lessons.push({
      id: this.generateId(),
      title: 'New Lesson',
      content: '## Lesson Content\n\nStart writing here...'
    });
    this.coursesService.updateCourse(this.course);
  }

  deleteLesson(moduleIndex: number, lessonIndex: number): void {
    this.course.modules[moduleIndex].lessons.splice(lessonIndex, 1);
    this.coursesService.updateCourse(this.course);
  }
}
