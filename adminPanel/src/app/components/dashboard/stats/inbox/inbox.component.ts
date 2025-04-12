import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {ReportsService} from '../../../../services/reports.service';

interface Email {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
}

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {

  emails: Email[] = [];
  constructor(private reportsService: ReportsService) { }
  ngOnInit(): void {
    this.reportsService.getReports().subscribe({
      next: (data: any) => {
        this.emails = data.map((email: any) => ({ ...email, read: false })) as Email[];
        console.log(data);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  handleRemoveReport(id:string){
    this.reportsService.removeReport(id).subscribe({
      next: (data: any) => {
        this.emails = this.emails.filter((email) => email.id.toString() !== id);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  // emails: Email[] = [
  //   {
  //     id: 1,
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     subject: 'Meeting tomorrow',
  //     content: 'Hi there, just a reminder about our meeting tomorrow at 10 AM. Please bring your project updates.',
  //     read: false
  //   },
  //   {
  //     id: 2,
  //     name: 'Amazon',
  //     email: 'no-reply@amazon.com',
  //     subject: 'Your order has shipped',
  //     content: 'Your recent order #12345 has been shipped and will arrive in 2-3 business days.',
  //     read: true
  //   },
  //   {
  //     id: 3,
  //     name: 'Sarah Johnson',
  //     email: 'sarah.johnson@company.org',
  //     subject: 'Project deadline extension',
  //     content: 'Good news! The client has agreed to extend the project deadline by one week.',
  //     read: false
  //   },
  //   {
  //     id: 4,
  //     name: 'LinkedIn',
  //     email: 'members@linkedin.com',
  //     subject: 'New connection request',
  //     content: 'You have a new connection request from Michael Brown.',
  //     read: true
  //   },
  //   {
  //     id: 5,
  //     name: 'GitHub',
  //     email: 'notifications@github.com',
  //     subject: 'Pull request: Feature/login',
  //     content: 'A new pull request has been opened in your repository by developer123.',
  //     read: false
  //   }
  // ];

  selectedEmail: any;

  selectEmail(email: Email): void {
    this.selectedEmail = email;
    email.read = true;
  }
}